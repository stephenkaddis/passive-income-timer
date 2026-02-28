import type { Period } from '../App'

const LABELS: Record<Period, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

const PERIODS: Period[] = ['daily', 'weekly', 'monthly', 'yearly']

interface PeriodTogglesProps {
  selected: Period
  onSelect: (p: Period) => void
}

export function PeriodToggles({ selected, onSelect }: PeriodTogglesProps) {
  return (
    <div className="period-toggles" role="tablist" aria-label="Time period">
      {PERIODS.map((period) => (
        <button
          key={period}
          type="button"
          role="tab"
          aria-selected={selected === period}
          className={`toggle-btn ${selected === period ? 'toggle-btn-active' : ''}`}
          onClick={() => onSelect(period)}
        >
          {LABELS[period]}
        </button>
      ))}
    </div>
  )
}
