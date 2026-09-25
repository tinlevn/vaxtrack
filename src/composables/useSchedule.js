/**
 * Global reactive state for the vaccination schedule.
 * Single source of truth — import useSchedule() in any component.
 */
import { reactive, computed } from 'vue'
import { BABY, buildSchedule } from '@/data/schedule.js'

const TODAY = new Date()

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

const state = reactive({
  visits: buildSchedule(BABY.dob),
})

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
    getVisit,
    markVisitDone,
    toggleVaccine,
  }
}
