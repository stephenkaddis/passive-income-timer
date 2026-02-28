import type { Compounding } from '../utils/earnings'
import type { CurrencyCode } from '../utils/format'

const COMPOUNDING_OPTIONS: { value: Compounding; label: string }[] = [
  { value: 'none', label: 'None (simple)' },
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

const CURRENCIES: { value: CurrencyCode; label: string }[] = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
]

interface InputPanelProps {
  principalStr: string
  setPrincipalStr: (s: string) => void
  interestRateStr: string
  setInterestRateStr: (s: string) => void
  compounding: Compounding
  setCompounding: (c: Compounding) => void
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  resetTimer: () => void
  principalValid: boolean
  rateValid: boolean
}

export function InputPanel({
  principalStr,
  setPrincipalStr,
  interestRateStr,
  setInterestRateStr,
  compounding,
  setCompounding,
  currency,
  setCurrency,
  resetTimer,
  principalValid,
  rateValid,
}: InputPanelProps) {
  return (
    <section className="input-panel" aria-label="Investment parameters">
      <div className="input-row">
        <label htmlFor="principal">
          Principal
          <input
            id="principal"
            type="number"
            min="0"
            step="100"
            value={principalStr}
            onChange={(e) => setPrincipalStr(e.target.value)}
            className={principalValid ? '' : 'input-invalid'}
            aria-invalid={!principalValid}
          />
        </label>
        <label htmlFor="apr">
          APR (%)
          <input
            id="apr"
            type="number"
            min="0"
            step="0.1"
            value={interestRateStr}
            onChange={(e) => setInterestRateStr(e.target.value)}
            className={rateValid ? '' : 'input-invalid'}
            aria-invalid={!rateValid}
          />
        </label>
      </div>
      <div className="input-row">
        <label htmlFor="compounding">
          Compounding
          <select
            id="compounding"
            value={compounding}
            onChange={(e) => setCompounding(e.target.value as Compounding)}
          >
            {COMPOUNDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="currency">
          Currency
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          >
            {CURRENCIES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="input-row">
        <button type="button" className="reset-timer" onClick={resetTimer}>
          Reset Timer
        </button>
      </div>
    </section>
  )
}
