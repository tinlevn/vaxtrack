<template>
  <div class="schedule-view" container-type="inline-size">
    <div class="view-header">
      <h1 class="view-title">📋 Full Schedule</h1>
      <p class="view-sub">All {{ totalVisits }} vaccination visits from birth to age 5</p>
    </div>

    <div v-for="group in ageGroups.slice(1)" :key="group" class="group-section">
      <h2 class="group-title">{{ group }}</h2>
      <div class="group-rows">
        <div
          v-for="visit in visitsByGroup(group)"
          :key="visit.id"
          class="schedule-row"
          role="button"
          tabindex="0"
          @click="router.push({ name: 'detail', params: { id: visit.id } })"
          @keydown.enter="router.push({ name: 'detail', params: { id: visit.id } })"
        >
          <span class="sr-dot" :class="visit.status"></span>
          <div class="sr-body">
            <div class="sr-age">{{ visit.emoji }} {{ visit.ageLabel }}</div>
            <div class="sr-vax">{{ visit.vaccines.map(v => v.key).join(' · ') }}</div>
          </div>
          <div class="sr-right">
            <div class="sr-date">{{ fmtDateShort(visit.targetDate) }}</div>
            <StatusPill :status="visit.status" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSchedule } from '@/composables/useSchedule.js'
import { fmtDateShort } from '@/composables/useFormatters.js'
import StatusPill from '@/components/StatusPill.vue'

const router = useRouter()
const { visits, totalVisits, ageGroups } = useSchedule()

const visitsByGroup = (g) => visits.filter(v => v.ageGroup === g)
</script>

<style scoped>
.schedule-view {
  container-type: inline-size;
  padding-bottom: 90px;
}

.view-header {
  padding: calc(var(--safe-top) + 20px) 20px 16px;
  background: linear-gradient(145deg, var(--clr-primary) 0%, #a78bfa 100%);
  color: #fff;
}
.view-title { font-size: 22px; font-weight: 800; }
.view-sub   { font-size: 13px; opacity: .8; margin-top: 3px; }

.group-section { margin: 0 16px 20px; }
.group-title {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--clr-text-muted);
  padding: 18px 0 8px;
  border-bottom: 1px solid var(--clr-border);
  margin-bottom: 10px;
}

.group-rows { display: flex; flex-direction: column; gap: 2px; }

.schedule-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--clr-surface);
  border: 1.5px solid var(--clr-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background .15s;
}
.schedule-row:hover { background: var(--clr-bg); }
.schedule-row:focus-visible { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

.sr-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.sr-dot.done     { background: var(--clr-success); }
.sr-dot.upcoming { background: var(--clr-upcoming); }
.sr-dot.overdue  { background: var(--clr-danger); }
.sr-dot.due-soon { background: var(--clr-warning); }

.sr-body  { flex: 1; }
.sr-age   { font-size: 14px; font-weight: 700; }
.sr-vax   { font-size: 11px; color: var(--clr-text-muted); margin-top: 2px; }

.sr-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.sr-date  { font-size: 12px; color: var(--clr-text-muted); }

@container (min-width: 600px) {
  .view-header { padding: 28px 32px 24px; }
  .group-section { margin: 0 32px 24px; }
  .group-rows {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
}
</style>
