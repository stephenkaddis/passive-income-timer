import { useState, useEffect, useCallback } from 'react'
import {
  elapsedSecondsToday,
  elapsedSecondsThisWeek,
  elapsedSecondsThisMonth,
  elapsedSecondsThisYear,
} from './utils/timeBoundaries'
import { compoundedEarnedSoFar, type Compounding } from './utils/earnings'
import type { CurrencyCode } from './utils/format'
import { loadState, saveState, getDefaultStartTime, type StoredState } from './utils/storage'
import { InputPanel } from './components/InputPanel'
import { PeriodToggles } from './components/PeriodToggles'
import { CounterDisplay } from './components/CounterDisplay'
import './App.css'

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly'

const PERIODS: Period[] = ['daily', 'weekly', 'monthly', 'yearly']

function parseNumber(s: string, defaultVal: number): number {
  const n = parseFloat(s)
  if (s.trim() === '' || Number.isNaN(n) || n < 0) return defaultVal
  return n
}

function getElapsedForPeriod(period: Period, now: Date): number {
  switch (period) {
    case 'daily':
      return elapsedSecondsToday(now)
    case 'weekly':
      return elapsedSecondsThisWeek(now)
    case 'monthly':
      return elapsedSecondsThisMonth(now)
    case 'yearly':
      return elapsedSecondsThisYear(now)
    default:
      return 0
  }
}

function earnedForPeriod(
  principal: number,
  apr: number,
  compounding: Compounding,
  period: Period,
  now: Date
): number {
  const elapsed = getElapsedForPeriod(period, now)
  return compoundedEarnedSoFar(principal, apr, compounding, elapsed)
}

function App() {
  const [stored, setStored] = useState<StoredState>(() => loadState())
  const [principalStr, setPrincipalStr] = useState(stored.principal)
  const [interestRateStr, setInterestRateStr] = useState(stored.interestRate)
  const [compounding, setCompounding] = useState<Compounding>(
    (stored.compounding as Compounding) || 'none'
  )
  const [currency, setCurrency] = useState<CurrencyCode>((stored.currency as CurrencyCode) || 'USD')
  const [startTime, setStartTime] = useState<number>(() => {
    const t = stored.startTime ? parseInt(stored.startTime, 10) : 0
    return Number.isNaN(t) || t <= 0 ? getDefaultStartTime() : t
  })
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily')
  const [amounts, setAmounts] = useState<Record<Period, number>>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  })
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const principal = parseNumber(principalStr, 0)
  const apr = parseNumber(interestRateStr, 0)
  const valid = principal > 0 && apr >= 0

  const persist = useCallback(() => {
    const state: StoredState = {
      principal: principalStr,
      interestRate: interestRateStr,
      compounding,
      currency,
      startTime: String(startTime),
    }
    saveState(state)
    setStored(state)
  }, [principalStr, interestRateStr, compounding, currency, startTime])

  useEffect(() => {
    persist()
  }, [persist])

  const resetTimer = useCallback(() => {
    const t = getDefaultStartTime()
    setStartTime(t)
    const state: StoredState = {
      ...stored,
      startTime: String(t),
    }
    saveState(state)
  }, [stored])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const now = new Date()
      setAmounts({
        daily: earnedForPeriod(principal, apr, compounding, 'daily', now),
        weekly: earnedForPeriod(principal, apr, compounding, 'weekly', now),
        monthly: earnedForPeriod(principal, apr, compounding, 'monthly', now),
        yearly: earnedForPeriod(principal, apr, compounding, 'yearly', now),
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [principal, apr, compounding])

  const mainAmount = valid ? amounts[selectedPeriod] : 0
  const secondary = PERIODS.filter((p) => p !== selectedPeriod).map((p) => ({
    period: p,
    amount: amounts[p],
  }))

  return (
    <div className={`app ${dark ? 'theme-dark' : 'theme-light'}`}>
      <header className="header">
        <h1>Passive Income Timer</h1>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle theme"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </header>

      <InputPanel
        principalStr={principalStr}
        setPrincipalStr={setPrincipalStr}
        interestRateStr={interestRateStr}
        setInterestRateStr={setInterestRateStr}
        compounding={compounding}
        setCompounding={setCompounding}
        currency={currency}
        setCurrency={setCurrency}
        resetTimer={resetTimer}
        principalValid={principal > 0}
        rateValid={interestRateStr.trim() !== '' && !Number.isNaN(parseFloat(interestRateStr)) && apr >= 0}
      />

      <PeriodToggles selected={selectedPeriod} onSelect={setSelectedPeriod} />

      <CounterDisplay
        mainAmount={mainAmount}
        mainLabel={selectedPeriod}
        secondary={secondary}
        currency={currency}
        valid={valid}
      />

      <p className="assumption-text">
        Assumes APR of {interestRateStr || '0'}% on principal {principalStr || '0'}. Updates in real
        time.
      </p>
    </div>
  )
}

export default App
