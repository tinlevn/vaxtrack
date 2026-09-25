/**
 * Builds the full CDC/ACIP vaccination schedule relative to a baby's date of birth.
 * Each visit includes: id, ageLabel, ageGroup, emoji, targetDate, vaccines[], note.
 * Status (done | upcoming | due-soon | overdue) is computed against TODAY.
 */

export const BABY = {
  name: 'Baby Emma',
  dob: new Date('2024-04-14'),
  emoji: '👶',
}

const TODAY = new Date()

/** Add months to a date (day-aligned) */
const addMonths = (d, n) => { const r = new Date(d); r.setMonth(r.getMonth() + n); return r }

/** Days from date a to date b (negative = b is in the past) */
const daysBetween = (a, b) => Math.floor((b - a) / 86_400_000)

export function buildSchedule(dob) {
  const raw = [
    {
      id: 'birth',
      ageLabel: 'At Birth',
      ageGroup: 'Year 1',
      emoji: '🍼',
      targetDate: new Date(dob),
      vaccines: [
        { key: 'HepB', given: true, dateGiven: new Date(dob) },
      ],
      note: 'First Hepatitis B dose is given in the hospital right after birth.',
    },
    {
      id: '2m',
      ageLabel: '2 Months',
      ageGroup: 'Year 1',
      emoji: '🐣',
      targetDate: addMonths(dob, 2),
      vaccines: [
        { key: 'HepB',  given: true, dateGiven: addMonths(dob, 2) },
        { key: 'RV',    given: true, dateGiven: addMonths(dob, 2) },
        { key: 'DTaP',  given: true, dateGiven: addMonths(dob, 2) },
        { key: 'Hib',   given: true, dateGiven: addMonths(dob, 2) },
        { key: 'PCV15', given: true, dateGiven: addMonths(dob, 2) },
        { key: 'IPV',   given: true, dateGiven: addMonths(dob, 2) },
      ],
      note: 'Busiest visit! Your baby may be fussier than usual for a day or two — totally normal.',
    },
    {
      id: '4m',
      ageLabel: '4 Months',
      ageGroup: 'Year 1',
      emoji: '🌱',
      targetDate: addMonths(dob, 4),
      vaccines: [
        { key: 'RV',    given: true, dateGiven: addMonths(dob, 4) },
        { key: 'DTaP',  given: true, dateGiven: addMonths(dob, 4) },
        { key: 'Hib',   given: true, dateGiven: addMonths(dob, 4) },
        { key: 'PCV15', given: true, dateGiven: addMonths(dob, 4) },
        { key: 'IPV',   given: true, dateGiven: addMonths(dob, 4) },
      ],
      note: null,
    },
    {
      id: '6m',
      ageLabel: '6 Months',
      ageGroup: 'Year 1',
      emoji: '🌻',
      targetDate: addMonths(dob, 6),
      vaccines: [
        { key: 'HepB',  given: true, dateGiven: addMonths(dob, 6) },
        { key: 'RV',    given: true, dateGiven: addMonths(dob, 6) },
        { key: 'DTaP',  given: true, dateGiven: addMonths(dob, 6) },
        { key: 'Hib',   given: true, dateGiven: addMonths(dob, 6) },
        { key: 'PCV15', given: true, dateGiven: addMonths(dob, 6) },
        { key: 'IPV',   given: true, dateGiven: addMonths(dob, 6) },
        { key: 'Flu',   given: true, dateGiven: addMonths(dob, 6) },
      ],
      note: 'First flu shot! First-timers need a 2nd dose 4 weeks later.',
    },
    {
      id: '9m',
      ageLabel: '9 Months',
      ageGroup: 'Year 1',
      emoji: '🏃',
      targetDate: addMonths(dob, 9),
      vaccines: [
        { key: 'Flu', given: true, dateGiven: addMonths(dob, 9) },
      ],
      note: 'Well-child checkup + 2nd flu shot (for first-time flu recipients).',
    },
    {
      id: '12m',
      ageLabel: '12 Months',
      ageGroup: 'Year 1',
      emoji: '🎂',
      targetDate: addMonths(dob, 12),
      vaccines: [
        { key: 'Hib',   given: true, dateGiven: addMonths(dob, 12) },
        { key: 'PCV15', given: true, dateGiven: addMonths(dob, 12) },
        { key: 'MMR',   given: true, dateGiven: addMonths(dob, 12) },
        { key: 'VAR',   given: true, dateGiven: addMonths(dob, 12) },
        { key: 'HepA',  given: true, dateGiven: addMonths(dob, 12) },
      ],
      note: 'Happy 1st birthday! 🎉 Several important vaccines at this visit.',
    },
    {
      id: '15m',
      ageLabel: '15 Months',
      ageGroup: 'Year 2',
      emoji: '👣',
      targetDate: addMonths(dob, 15),
      vaccines: [
        { key: 'DTaP', given: true, dateGiven: addMonths(dob, 15) },
        { key: 'HepA', given: true, dateGiven: addMonths(dob, 15) },
      ],
      note: null,
    },
    {
      id: '18m',
      ageLabel: '18 Months',
      ageGroup: 'Year 2',
      emoji: '🧸',
      targetDate: addMonths(dob, 18),
      vaccines: [
        { key: 'Flu', given: true, dateGiven: addMonths(dob, 18) },
      ],
      note: null,
    },
    {
      id: '24m',
      ageLabel: '2 Years',
      ageGroup: 'Year 2',
      emoji: '🎈',
      targetDate: addMonths(dob, 24),
      vaccines: [
        { key: 'Flu', given: false, dateGiven: null },
      ],
      note: 'Annual flu shot. Happy 2nd birthday! 🎈',
    },
    {
      id: '30m',
      ageLabel: '2½ Years',
      ageGroup: 'Year 3',
      emoji: '🚂',
      targetDate: addMonths(dob, 30),
      vaccines: [
        { key: 'Flu', given: false, dateGiven: null },
      ],
      note: null,
    },
    {
      id: '36m',
      ageLabel: '3 Years',
      ageGroup: 'Year 3',
      emoji: '🌈',
      targetDate: addMonths(dob, 36),
      vaccines: [
        { key: 'Flu', given: false, dateGiven: null },
      ],
      note: null,
    },
    {
      id: '48m',
      ageLabel: '4 Years',
      ageGroup: 'Year 4–5',
      emoji: '🚀',
      targetDate: addMonths(dob, 48),
      vaccines: [
        { key: 'DTAP5', given: false, dateGiven: null },
        { key: 'IPV4',  given: false, dateGiven: null },
        { key: 'MMR2',  given: false, dateGiven: null },
        { key: 'VAR2',  given: false, dateGiven: null },
        { key: 'Flu',   given: false, dateGiven: null },
      ],
      note: 'Pre-kindergarten booster visit — crucial before starting school!',
    },
    {
      id: '60m',
      ageLabel: '5 Years',
      ageGroup: 'Year 4–5',
      emoji: '🎓',
      targetDate: addMonths(dob, 60),
      vaccines: [
        { key: 'Flu', given: false, dateGiven: null },
      ],
      note: 'Annual flu shot. Ready for kindergarten! 🎓',
    },
  ]

  // Compute status for each visit
  return raw.map(v => {
    const allGiven  = v.vaccines.every(vx => vx.given)
    const daysTil   = daysBetween(TODAY, v.targetDate)

    let status
    if (allGiven)         status = 'done'
    else if (daysTil < 0) status = 'overdue'
    else if (daysTil <= 30) status = 'due-soon'
    else                  status = 'upcoming'

    return { ...v, status, daysTil }
  })
}

