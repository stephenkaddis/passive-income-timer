import { describe, it, expect } from 'vitest'
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  elapsedSecondsToday,
  elapsedSecondsThisWeek,
  elapsedSecondsThisMonth,
  elapsedSecondsThisYear,
  elapsedSeconds,
} from './timeBoundaries'

describe('startOfDay', () => {
  it('returns midnight for same day', () => {
    const d = new Date(2025, 1, 15, 14, 30, 45)
    const start = startOfDay(d)
    expect(start.getFullYear()).toBe(2025)
    expect(start.getMonth()).toBe(1)
    expect(start.getDate()).toBe(15)
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)
    expect(start.getSeconds()).toBe(0)
  })
})

describe('startOfWeek', () => {
  it('returns Monday 00:00 for a Wednesday', () => {
    // 2025-02-12 is Wednesday
    const d = new Date(2025, 1, 12, 10, 0, 0)
    const start = startOfWeek(d)
    expect(start.getDay()).toBe(1) // Monday
    expect(start.getDate()).toBe(10)
    expect(start.getMonth()).toBe(1)
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)
  })

  it('returns same Monday for a Monday', () => {
    const d = new Date(2025, 1, 10, 0, 0, 0) // Monday Feb 10
    const start = startOfWeek(d)
    expect(start.getDay()).toBe(1)
    expect(start.getDate()).toBe(10)
  })
})

describe('startOfMonth', () => {
  it('returns 1st at midnight', () => {
    const d = new Date(2025, 5, 20, 12, 0, 0)
    const start = startOfMonth(d)
    expect(start.getMonth()).toBe(5)
    expect(start.getDate()).toBe(1)
    expect(start.getHours()).toBe(0)
  })
})

describe('startOfYear', () => {
  it('returns Jan 1 at midnight', () => {
    const d = new Date(2025, 5, 20, 12, 0, 0)
    const start = startOfYear(d)
    expect(start.getMonth()).toBe(0)
    expect(start.getDate()).toBe(1)
    expect(start.getFullYear()).toBe(2025)
    expect(start.getHours()).toBe(0)
  })
})

describe('elapsedSeconds', () => {
  it('returns positive seconds between two dates', () => {
    const start = new Date(2025, 0, 1, 0, 0, 0)
    const end = new Date(2025, 0, 1, 0, 0, 10)
    expect(elapsedSeconds(start, end)).toBe(10)
  })
})

describe('elapsedSecondsToday', () => {
  it('returns seconds since midnight', () => {
    const d = new Date(2025, 0, 1, 12, 30, 0) // 12:30:00
    const secs = elapsedSecondsToday(d)
    expect(secs).toBe(12 * 3600 + 30 * 60)
  })
})

describe('elapsedSecondsThisWeek', () => {
  it('returns seconds since Monday 00:00', () => {
    // Wednesday Feb 12 2025, 00:00:00 -> 2 full days since Monday Feb 10
    const d = new Date(2025, 1, 12, 0, 0, 0)
    const secs = elapsedSecondsThisWeek(d)
    expect(secs).toBe(2 * 24 * 3600)
  })
})

describe('elapsedSecondsThisMonth', () => {
  it('returns seconds since 1st of month', () => {
    const d = new Date(2025, 0, 15, 0, 0, 0) // Jan 15
    const secs = elapsedSecondsThisMonth(d)
    expect(secs).toBe(14 * 24 * 3600)
  })
})

describe('elapsedSecondsThisYear', () => {
  it('returns seconds since Jan 1', () => {
    const d = new Date(2025, 0, 2, 0, 0, 0) // Jan 2
    const secs = elapsedSecondsThisYear(d)
    expect(secs).toBe(24 * 3600)
  })
})
