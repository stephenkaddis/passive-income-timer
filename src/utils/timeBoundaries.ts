/**
 * Time-boundary utilities for Passive Income Timer.
 * All functions use local time. Weekly start is Monday 00:00 (ISO week).
 */

const MS_PER_SECOND = 1000;

/**
 * Start of today (local): midnight 00:00:00.000
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Start of week (local): Monday 00:00:00.000.
 * getDay(): 0=Sun, 1=Mon, ... 6=Sat. So Monday = 1.
 * Days since Monday: (getDay() + 6) % 7
 */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const daysSinceMonday = (day + 6) % 7;
  d.setDate(d.getDate() - daysSinceMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Start of month (local): 1st of month 00:00:00.000
 */
export function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Start of year (local): Jan 1 00:00:00.000
 */
export function startOfYear(date: Date): Date {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Elapsed seconds from the given start date to the given end date.
 */
export function elapsedSeconds(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / MS_PER_SECOND;
}

/**
 * Elapsed seconds since start of day (local midnight) until `now`.
 */
export function elapsedSecondsToday(now: Date): number {
  return elapsedSeconds(startOfDay(now), now);
}

/**
 * Elapsed seconds since start of week (Monday 00:00 local) until `now`.
 */
export function elapsedSecondsThisWeek(now: Date): number {
  return elapsedSeconds(startOfWeek(now), now);
}

/**
 * Elapsed seconds since start of month (1st 00:00 local) until `now`.
 */
export function elapsedSecondsThisMonth(now: Date): number {
  return elapsedSeconds(startOfMonth(now), now);
}

/**
 * Elapsed seconds since start of year (Jan 1 00:00 local) until `now`.
 */
export function elapsedSecondsThisYear(now: Date): number {
  return elapsedSeconds(startOfYear(now), now);
}
