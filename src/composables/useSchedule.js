/**
 * Global reactive state for the vaccination schedule.
 * Single source of truth — import useSchedule() in any component.
 */
import { reactive, computed, ref } from 'vue'
import { BABY, buildSchedule } from '@/data/schedule.js'
import { VAX_INFO } from '@/data/vaccineInfo.js'

const TODAY = new Date()
const STORAGE_KEY_VISITS = 'vaxtrack-visits-data'
const STORAGE_KEY_NOTES = 'vaxtrack-custom-notes'

function computeStatus(visit) {
  const allGiven = visit.vaccines.every(vx => vx.given)
  const daysTil  = Math.floor((visit.targetDate - TODAY) / 86_400_000)
  let status
  if (allGiven)           status = 'done'
  else if (daysTil < 0)  status = 'overdue'
  else if (daysTil <= 30) status = 'due-soon'
  else                   status = 'upcoming'
  return { status, daysTil }
}

function loadSavedData() {
  const baseVisits = buildSchedule(BABY.dob)
  if (typeof localStorage === 'undefined') return baseVisits

  try {
    const savedVisitsRaw = localStorage.getItem(STORAGE_KEY_VISITS)
    const savedNotesRaw  = localStorage.getItem(STORAGE_KEY_NOTES)

    const savedVisits = savedVisitsRaw ? JSON.parse(savedVisitsRaw) : null
    const savedNotes  = savedNotesRaw ? JSON.parse(savedNotesRaw) : {}

    return baseVisits.map(visit => {
      const savedV = savedVisits ? savedVisits.find(sv => sv.id === visit.id) : null
      const customNote = savedNotes[visit.id] ?? null

      if (savedV) {
        visit.vaccines.forEach(vx => {
          const svx = savedV.vaccines.find(x => x.key === vx.key)
          if (svx) {
            vx.given = svx.given
            vx.dateGiven = svx.dateGiven ? new Date(svx.dateGiven) : null
          }
        })
      }

      if (customNote !== null) {
        visit.customNote = customNote
      } else {
        visit.customNote = ''
      }

      const s = computeStatus(visit)
      visit.status  = s.status
      visit.daysTil = s.daysTil
      return visit
    })
  } catch (e) {
    console.error('Failed to load saved schedule data', e)
    return baseVisits
  }
}

function saveState() {
  if (typeof localStorage === 'undefined') return
  try {
    const serializableVisits = state.visits.map(v => ({
      id: v.id,
      vaccines: v.vaccines.map(vx => ({
        key: vx.key,
        given: vx.given,
        dateGiven: vx.dateGiven ? vx.dateGiven.toISOString() : null,
      }))
    }))
    const notesMap = {}
    state.visits.forEach(v => {
      if (v.customNote) notesMap[v.id] = v.customNote
    })

    localStorage.setItem(STORAGE_KEY_VISITS, JSON.stringify(serializableVisits))
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesMap))
  } catch (e) {
    console.error('Failed to persist schedule data', e)
  }
}

const state = reactive({
  visits: loadSavedData(),
})

const searchQuery = ref('')
const statusFilter = ref('all') // 'all', 'done', 'due-soon', 'overdue', 'upcoming'

export function useSchedule() {
  const totalVisits    = computed(() => state.visits.length)
  const doneVisits     = computed(() => state.visits.filter(v => v.status === 'done').length)
  const overdueVisits  = computed(() => state.visits.filter(v => v.status === 'overdue' || v.status === 'due-soon').length)
  const upcomingVisits = computed(() => state.visits.filter(v => v.status === 'upcoming').length)
  const progressPct    = computed(() => Math.round((doneVisits.value / totalVisits.value) * 100))
  const nextDue        = computed(() => state.visits.find(v => v.status !== 'done') ?? null)
  const ageGroups      = computed(() => ['All', ...new Set(state.visits.map(v => v.ageGroup))])

  function getVisit(id) {
    return state.visits.find(v => v.id === id) ?? null
  }

  function updateCustomNote(id, noteText) {
    const visit = getVisit(id)
    if (!visit) return
    visit.customNote = noteText
    saveState()
  }

  /** Mark every vaccine in a visit as given */
  function markVisitDone(id) {
    const visit = getVisit(id)
    if (!visit) return
    visit.vaccines.forEach(vx => {
      if (!vx.given) {
        vx.given = true
        vx.dateGiven = new Date()
      }
    })
    const s = computeStatus(visit)
    visit.status  = s.status
    visit.daysTil = s.daysTil
    saveState()
  }

  /** Toggle a single vaccine's given state */
  function toggleVaccine(visitId, vaxKey) {
    const visit = getVisit(visitId)
    if (!visit) return
    const vx = visit.vaccines.find(v => v.key === vaxKey)
    if (!vx) return
    vx.given    = !vx.given
    vx.dateGiven = vx.given ? new Date() : null
    // Recompute the visit-level status
    const s = computeStatus(visit)
    visit.status  = s.status
    visit.daysTil = s.daysTil
    saveState()
  }

  /** Filter visits by search query and status filter */
  function filterVisits(visitList, group = 'All') {
    return visitList.filter(v => {
      if (group !== 'All' && v.ageGroup !== group) return false

      if (statusFilter.value !== 'all') {
        if (statusFilter.value === 'due-soon' && v.status !== 'due-soon') return false
        if (statusFilter.value === 'overdue' && v.status !== 'overdue') return false
        if (statusFilter.value === 'done' && v.status !== 'done') return false
        if (statusFilter.value === 'upcoming' && v.status !== 'upcoming') return false
      }

      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim()
        const matchTitle = v.ageLabel.toLowerCase().includes(q)
        const matchNote  = (v.note && v.note.toLowerCase().includes(q)) || (v.customNote && v.customNote.toLowerCase().includes(q))
        const matchVax   = v.vaccines.some(vx => {
          const info = VAX_INFO[vx.key]
          return vx.key.toLowerCase().includes(q) ||
            (info && (info.name.toLowerCase().includes(q) || info.desc.toLowerCase().includes(q)))
        })
        return matchTitle || matchNote || matchVax
      }

      return true
    })
  }

  return {
    visits: state.visits,
    totalVisits,
    doneVisits,
    overdueVisits,
    upcomingVisits,
    progressPct,
    nextDue,
    ageGroups,
    searchQuery,
    statusFilter,
    getVisit,
    markVisitDone,
    toggleVaccine,
    updateCustomNote,
    filterVisits,
  }
}
