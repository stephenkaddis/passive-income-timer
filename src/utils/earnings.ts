/**
 * Earnings calculation for Passive Income Timer.
 *
 * Model:
 * - User inputs: principal (P), APR (annual percentage rate), compounding frequency.
 * - Simple interest: annualEarnings = P * (APR/100). Per-second rate = annualEarnings / secondsPerYear.
 * - "So far" for a period = (per-second rate) * elapsedSecondsInPeriod (simple).
 *
 * Compounding:
 * - We use effective rate per period. For "so far" in a period we compute:
 *   value_now = P * (1 + r)^(t in period units) at period start, then
 *   earned_in_period = value_at_now - value_at_period_start.
 * - For smooth real-time updates we use elapsed seconds within the period and
 *   convert to fraction of the compounding period (day/month/year).
 */

export type Compounding = 'none' | 'daily' | 'monthly' | 'yearly';

export const SECONDS_PER_YEAR = 365.2425 * 24 * 60 * 60;
export const SECONDS_PER_DAY = 24 * 60 * 60;
export const SECONDS_PER_MONTH = SECONDS_PER_YEAR / 12;

/**
 * Simple interest: annual earnings = principal * (APR/100).
 * Per-second rate = annualEarnings / SECONDS_PER_YEAR.
 */
export function simplePerSecondRate(principal: number, aprPercent: number): number {
  const annualEarnings = principal * (aprPercent / 100);
  return annualEarnings / SECONDS_PER_YEAR;
}

/**
 * Simple "earned so far" in a period: perSecond * elapsedSeconds.
 * Never decreases within a period (elapsedSeconds only grows until period reset).
 */
export function simpleEarnedSoFar(
  principal: number,
  aprPercent: number,
  elapsedSecondsInPeriod: number
): number {
  const perSecond = simplePerSecondRate(principal, aprPercent);
  return perSecond * elapsedSecondsInPeriod;
}

/**
 * Compounded value of principal after time (in years): P * (1 + r)^t
 * where r = APR/100.
 */
function compoundedValueAtYears(principal: number, aprPercent: number, years: number): number {
  const r = aprPercent / 100;
  return principal * Math.pow(1 + r, years);
}

/**
 * For a given period we need "earned so far in this period" with compounding.
 * We treat the "period start" as time 0 and "now" as elapsed time in the period.
 * Total value at period start = principal (we're not compounding across periods for "so far").
 * Actually: the spec says "value at now minus value at period start". So we need
 * to think in absolute time from some epoch. Using "start of period" as epoch:
 * - At period start: value = principal (by definition for "so far this period").
 * - At now: value = principal * (1 + r)^(elapsedYears). Then earned = value - principal.
 *
 * So for compounding we use: earned = principal * ((1 + r)^(elapsedYears) - 1).
 * elapsedYears = elapsedSecondsInPeriod / SECONDS_PER_YEAR.
 *
 * For daily compounding we use effective daily rate: (1 + r)^(1/365.2425) - 1 per day,
 * and elapsed days = elapsedSecondsInPeriod / SECONDS_PER_DAY.
 * value = principal * (1 + dailyRate)^elapsedDays, earned = value - principal.
 *
 * For monthly: monthly rate = (1 + r)^(1/12) - 1, elapsed months = elapsedSeconds / SECONDS_PER_MONTH.
 */
function effectiveDailyRate(aprPercent: number): number {
  const r = aprPercent / 100;
  return Math.pow(1 + r, 1 / 365.2425) - 1;
}

function effectiveMonthlyRate(aprPercent: number): number {
  const r = aprPercent / 100;
  return Math.pow(1 + r, 1 / 12) - 1;
}

/**
 * Compounded "earned so far" in a period given elapsed seconds in that period.
 */
export function compoundedEarnedSoFar(
  principal: number,
  aprPercent: number,
  compounding: Compounding,
  elapsedSecondsInPeriod: number
): number {
  if (principal <= 0) return 0;

  switch (compounding) {
    case 'none': {
      return simpleEarnedSoFar(principal, aprPercent, elapsedSecondsInPeriod);
    }
    case 'yearly': {
      const years = elapsedSecondsInPeriod / SECONDS_PER_YEAR;
      const valueNow = compoundedValueAtYears(principal, aprPercent, years);
      return valueNow - principal;
    }
    case 'monthly': {
      const monthlyRate = effectiveMonthlyRate(aprPercent);
      const months = elapsedSecondsInPeriod / SECONDS_PER_MONTH;
      const valueNow = principal * Math.pow(1 + monthlyRate, months);
      return valueNow - principal;
    }
    case 'daily': {
      const dailyRate = effectiveDailyRate(aprPercent);
      const days = elapsedSecondsInPeriod / SECONDS_PER_DAY;
      const valueNow = principal * Math.pow(1 + dailyRate, days);
      return valueNow - principal;
    }
    default:
      return simpleEarnedSoFar(principal, aprPercent, elapsedSecondsInPeriod);
  }
}
