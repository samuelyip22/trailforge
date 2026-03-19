// components/SeasonalCalendar.js
// Shows which months are best to ride this trail as a visual calendar strip.
// Green = prime riding, yellow = shoulder season, gray = closed/snow/too wet.
// This is a SERVER component — no interactivity needed, pure display.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Given the array of bestMonths (e.g. [5,6,7,8,9,10]) and a month number (1-12),
// return the color class for that cell.
function getMonthStatus(bestMonths, monthNum) {
  if (bestMonths.includes(monthNum)) return 'prime'
  // Shoulder = one month before or after a prime month
  if (bestMonths.includes(monthNum - 1) || bestMonths.includes(monthNum + 1)) return 'shoulder'
  return 'closed'
}

export default function SeasonalCalendar({ bestMonths, surface }) {
  // Current month (1-12) so we can highlight "now"
  const currentMonth = new Date().getMonth() + 1

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-4">
      <h2 className="font-semibold text-stone-800 mb-4">Best Time to Ride</h2>

      {/* Month strip */}
      <div className="grid grid-cols-12 gap-1 mb-3">
        {MONTHS.map((label, i) => {
          const monthNum = i + 1
          const status = getMonthStatus(bestMonths, monthNum)
          const isNow = monthNum === currentMonth

          // Color classes per status
          const bg =
            status === 'prime'    ? 'bg-green-500 text-white' :
            status === 'shoulder' ? 'bg-amber-300 text-amber-900' :
                                    'bg-stone-100 text-stone-300'

          return (
            <div key={label} className="flex flex-col items-center gap-1">
              {/* Colored bar */}
              <div className={`w-full rounded-md h-8 flex items-center justify-center text-xs font-medium relative ${bg}`}>
                {/* "Now" indicator dot on the current month */}
                {isNow && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
                )}
              </div>
              {/* Month label below the bar */}
              <span className={`text-[10px] font-medium ${isNow ? 'text-orange-500' : 'text-stone-400'}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500" />
          Prime riding
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-300" />
          Shoulder season
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-stone-100 border border-stone-200" />
          Closed / snow / mud
        </div>
        {/* The orange dot legend */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          This month
        </div>
      </div>

      {/* Surface type */}
      {surface && (
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2">
          <span className="text-xs text-stone-400 uppercase tracking-wide font-medium">Trail Surface</span>
          <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full capitalize font-medium">
            {surface}
          </span>
        </div>
      )}
    </div>
  )
}
