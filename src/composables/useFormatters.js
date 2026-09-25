/**
 * Shared formatting utilities used across views and components.
 */

export const fmtDate = (d) =>
  d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

export const fmtDateShort = (d) =>
  d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

export function babyAgeLabel(dob) {
  const today = new Date()
  const months = Math.floor((today - dob) / (1000 * 60 * 60 * 24 * 30.44))
  if (months < 24) return `${months} months old`
  const y = Math.floor(months / 12)
  const m = months % 12
  return m > 0 ? `${y} yr ${m} mo old` : `${y} years old`
}

export function daysLabel(visit) {
  if (visit.status === 'done')      return '✓ Completed'
  if (visit.daysTil === 0)          return '🔴 Due today!'
  if (visit.daysTil < 0)            return `🔴 ${Math.abs(visit.daysTil)}d overdue`
  if (visit.daysTil <= 7)           return `⚠️ In ${visit.daysTil} days`
  const months = Math.round(visit.daysTil / 30.44)
  return months < 2 ? `In ~${visit.daysTil} days` : `In ~${months} months`
}

export function statusLabel(status) {
  return { done: '✓ Done', upcoming: 'Upcoming', overdue: 'Overdue!', 'due-soon': 'Due Soon' }[status] ?? status
}

/** CSS variable name suffix for each status */
export const STATUS_COLOR = {
  done:      'success',
  upcoming:  'upcoming',
  overdue:   'danger',
  'due-soon':'warning',
}

