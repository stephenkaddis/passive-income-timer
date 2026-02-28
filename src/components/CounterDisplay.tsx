import { formatCurrency, type CurrencyCode } from '../utils/format'
import type { Period } from '../App'

const PERIOD_LABELS: Record<Period, string> = {
  daily: 'Money so far today',
  weekly: 'Money so far this week',
  monthly: 'Money so far this month',
  yearly: 'Money so far this year',
}

interface CounterDisplayProps {
  mainAmount: number
  mainLabel: Period
  secondary: { period: Period; amount: number }[]
  currency: CurrencyCode
  valid: boolean
}

export function CounterDisplay({
  mainAmount,
  mainLabel,
  secondary,
  currency,
  valid,
}: CounterDisplayProps) {
  const displayValue = valid ? mainAmount : 0
  const mainFormatted = formatCurrency(displayValue, currency, { decimals: 4 })

  return (
    <section className="counter-display" aria-live="polite" aria-atomic="true">
      <p className="counter-main-label">{PERIOD_LABELS[mainLabel]}</p>
      <div className="counter-main" data-valid={valid}>
        {mainFormatted}
      </div>
      <div className="counter-secondary">
        {secondary.map(({ period, amount }) => (
          <div key={period} className="counter-secondary-item">
            <span className="counter-secondary-label">{PERIOD_LABELS[period]}:</span>
            <span className="counter-secondary-value">
              {valid ? formatCurrency(amount, currency, { decimals: 4 }) : formatCurrency(0, currency, { decimals: 4 })}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
