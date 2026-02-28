/**
 * Format currency for debt-clock display: fixed 2 decimals, comma separators.
 */

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

export function formatCurrency(
  value: number,
  currency: CurrencyCode = 'USD',
  options?: { decimals?: number }
): string {
  const decimals = options?.decimals ?? 2;
  const symbol = CURRENCY_SYMBOLS[currency];
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const combined = decPart !== undefined ? `${withCommas}.${decPart}` : withCommas;
  return symbol + combined;
}
