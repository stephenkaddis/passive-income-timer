/**
 * Persist app state to localStorage. Keys are prefixed to avoid collisions.
 */

const KEY_PREFIX = 'passive-income-timer:';

export interface StoredState {
  principal: string;
  interestRate: string;
  compounding: string;
  currency: string;
  startTime: string;
}

const DEFAULTS: StoredState = {
  principal: '10000',
  interestRate: '7',
  compounding: 'none',
  currency: 'USD',
  startTime: '',
};

export function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + 'state');
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveState(state: StoredState): void {
  try {
    localStorage.setItem(KEY_PREFIX + 'state', JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function getDefaultStartTime(): number {
  return Date.now();
}
