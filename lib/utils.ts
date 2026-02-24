import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number with commas using a fixed locale to avoid hydration mismatches */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', options).format(value)
}

/** Format a number as USD currency */
export function formatCurrency(value: number, decimals = 0): string {
  return `$${formatNumber(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}
