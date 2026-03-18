// components/NavBar.js
// The top navigation bar that appears on every page.
// Uses lucide-react for clean icons, and highlights the active page link.

'use client' // 'use client' means this component runs in the browser (needed for links + state)

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mountain, Map, BookOpen, CalendarDays, Wrench, User, GraduationCap } from 'lucide-react'

// Each nav item: label, URL path, and icon component
const navItems = [
  { label: 'Trails',  href: '/trails',  icon: Map },
  { label: 'Guide',   href: '/guide',   icon: GraduationCap },
  { label: 'My Log',  href: '/log',     icon: BookOpen },
  { label: 'Agenda',  href: '/agenda',  icon: CalendarDays },
  { label: 'My Bike', href: '/bike',    icon: Wrench },
]

export default function NavBar() {
  const pathname = usePathname() // tells us which page we're currently on

  return (
    <nav className="bg-stone-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:text-orange-400 transition-colors">
            <Mountain size={22} className="text-orange-400" />
            TrailForge
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive ? 'bg-orange-500 text-white' : 'text-stone-300 hover:bg-stone-700 hover:text-white'}`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Login / Account button */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-stone-300 hover:bg-stone-700 hover:text-white transition-colors"
          >
            <User size={15} />
            <span className="hidden sm:inline">Account</span>
          </Link>
        </div>

        {/* Mobile bottom nav (shows on small screens) */}
        <div className="md:hidden flex items-center justify-around border-t border-stone-700 py-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded text-xs font-medium transition-colors
                  ${isActive ? 'text-orange-400' : 'text-stone-400 hover:text-white'}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
