// app/api/maintenance-cron/route.js
// Daily cron endpoint — called automatically by Vercel Cron at 9am UTC.
// Checks all users' bike maintenance records and sends email reminders
// via Resend when a component is coming due (within their notify_days_before window).
//
// To use this:
//   1. Sign up at https://resend.com (free — 3,000 emails/month)
//   2. Get your API key from the Resend dashboard
//   3. Add RESEND_API_KEY to your .env.local and Vercel environment variables
//   4. Add npm install resend to your project (run: npm install resend)

import { createClient } from '@supabase/supabase-js'

// We use the SERVICE ROLE key here (not the anon key) so we can query all users.
// This key is SECRET — never expose it in client-side code or commit it.
// Add SUPABASE_SERVICE_ROLE_KEY to your Vercel environment variables.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// These intervals must match the COMPONENTS array in app/bike/page.js
const COMPONENT_INTERVALS = {
  'tire-pressure':      3,
  'chain-lube':        14,
  'chain-wear':        90,
  'brake-pads':        60,
  'brake-bleed':      365,
  'drivetrain-clean':  30,
  'fork-lower-service': 180,
  'tubeless-sealant':  150,
  'wheel-true':        180,
  'headset-check':      90,
}

const COMPONENT_LABELS = {
  'tire-pressure':      'Tire Pressure Check',
  'chain-lube':        'Chain Lubrication',
  'chain-wear':        'Chain Wear Check',
  'brake-pads':        'Brake Pad Inspection',
  'brake-bleed':       'Brake Bleed (Hydraulic)',
  'drivetrain-clean':  'Drivetrain Deep Clean',
  'fork-lower-service': 'Fork Lower Leg Service',
  'tubeless-sealant':  'Tubeless Sealant Refresh',
  'wheel-true':        'Wheel True Check',
  'headset-check':     'Headset & Stem Bolt Check',
}

// Protect this route: require a secret token so random people can't trigger it.
// Add CRON_SECRET to your .env.local and Vercel environment variables.
function isAuthorized(request) {
  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // 1. Get all users who have email notifications enabled
    const { data: notifSettings } = await supabase
      .from('notification_settings')
      .select('user_id, email, notify_days_before, enabled')
      .eq('enabled', true)

    if (!notifSettings || notifSettings.length === 0) {
      return Response.json({ sent: 0, message: 'No active notification settings found' })
    }

    // 2. For each user, check which components are coming due
    let totalSent = 0

    for (const setting of notifSettings) {
      if (!setting.email) continue

      // Load their maintenance records
      const { data: records } = await supabase
        .from('bike_maintenance')
        .select('component_id, last_service_date')
        .eq('user_id', setting.user_id)

      const today = new Date()
      const dueSoon = []
      const overdue = []

      // Check each component
      for (const [componentId, intervalDays] of Object.entries(COMPONENT_INTERVALS)) {
        const record = records?.find(r => r.component_id === componentId)

        if (!record?.last_service_date) {
          // Never serviced — skip (don't spam about unlogged components)
          continue
        }

        const lastService = new Date(record.last_service_date)
        const daysSince   = Math.floor((today - lastService) / 86400000)
        const daysLeft    = intervalDays - daysSince

        if (daysLeft < 0) {
          overdue.push({ label: COMPONENT_LABELS[componentId], daysOverdue: Math.abs(daysLeft) })
        } else if (daysLeft <= setting.notify_days_before) {
          dueSoon.push({ label: COMPONENT_LABELS[componentId], daysLeft })
        }
      }

      // Only send if there's something to report
      if (dueSoon.length === 0 && overdue.length === 0) continue

      // 3. Send email via Resend
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      const overdueSection = overdue.length > 0 ? `
        <h3 style="color:#ef4444;margin-top:24px">⚠️ Overdue</h3>
        <ul>
          ${overdue.map(c => `<li><strong>${c.label}</strong> — ${c.daysOverdue} day${c.daysOverdue !== 1 ? 's' : ''} overdue</li>`).join('')}
        </ul>
      ` : ''

      const dueSoonSection = dueSoon.length > 0 ? `
        <h3 style="color:#f59e0b;margin-top:24px">🔔 Coming Up</h3>
        <ul>
          ${dueSoon.map(c => `<li><strong>${c.label}</strong> — due in ${c.daysLeft} day${c.daysLeft !== 1 ? 's' : ''}</li>`).join('')}
        </ul>
      ` : ''

      await resend.emails.send({
        from: 'TrailForge <onboarding@resend.dev>',   // replace with your verified domain later
        to: setting.email,
        subject: `🔧 Bike Maintenance Reminder — ${overdue.length + dueSoon.length} item${overdue.length + dueSoon.length !== 1 ? 's' : ''} need attention`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#1c1917">
            <h2 style="color:#f97316">TrailForge — Bike Maintenance Reminder</h2>
            <p>Here is what needs attention on your <strong>Trek Roscoe 7</strong>:</p>
            ${overdueSection}
            ${dueSoonSection}
            <p style="margin-top:32px;border-top:1px solid #e7e5e4;padding-top:16px;font-size:12px;color:#78716c">
              Manage your reminders at TrailForge → My Bike.<br>
              You are receiving this because you enabled bike maintenance reminders.
            </p>
          </div>
        `,
      })

      totalSent++
    }

    return Response.json({ sent: totalSent, checked: notifSettings.length })

  } catch (error) {
    console.error('Maintenance cron error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
