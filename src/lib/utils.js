export function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date))
}

export function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

export function getPreviousMonthRange(date = new Date()) {
  const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
  return getMonthRange(prevMonth)
}

export const DEFAULT_CATEGORIES = [
  { id: 'makan', name: 'Makan', icon: '🍔' },
  { id: 'minuman', name: 'Minuman', icon: '☕' },
  { id: 'groceries', name: 'Groceries', icon: '🛒' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'bensin', name: 'Bensin', icon: '⛽' },
  { id: 'belanja', name: 'Belanja', icon: '🛍️' },
  { id: 'hiburan', name: 'Hiburan', icon: '🎬' },
  { id: 'kesehatan', name: 'Kesehatan', icon: '💊' },
  { id: 'pulsa', name: 'Pulsa/Data', icon: '📱' },
  { id: 'listrik', name: 'Listrik/Air', icon: '💡' },
  { id: 'rumah', name: 'Rumah', icon: '🏠' },
  { id: 'pet', name: 'Pet', icon: '🐾' },
  { id: 'kendaraan', name: 'Kendaraan', icon: '🔧' },
  { id: 'skincare', name: 'Skincare', icon: '✨' },
  { id: 'bayi', name: 'Bayi', icon: '🍼' },
  { id: 'lainnya', name: 'Lainnya', icon: '📦' },
]

export function getCategoryInfo(categoryId) {
  return DEFAULT_CATEGORIES.find(c => c.id === categoryId) || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
}

export const CHART_COLORS = [
  '#0ea5e9', // primary
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#14b8a6', // teal
  '#a855f7', // purple
  '#e11d48', // rose
  '#0284c7', // sky
  '#65a30d', // green
  '#d946ef', // fuchsia
  '#78716c', // stone
]
