<template>
  <div class="schedule-view">
    <div class="view-header">
      <div class="header-left">
        <div class="header-pretitle">OFFICIAL CDC/ACIP PROTOCOL</div>
        <h1 class="view-title">📋 Pediatric Immunization Schedule</h1>
        <p class="view-sub">Complete clinical protocol: {{ totalVisits }} visits scheduled from birth through 5 years of age</p>
      </div>
      <button
        class="header-theme-btn"
        @click="toggleTheme"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <span>{{ isDark ? '☀️ Clinical Light' : '🌙 Telemetry Dark' }}</span>
      </button>
    </div>

    <div v-for="group in ageGroups.slice(1)" :key="group" class="group-section">
      <div class="group-header">
        <h2 class="group-title">{{ group }}</h2>
        <span class="group-badge">{{ visitsByGroup(group).length }} VISITS</span>
      </div>
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
          <span class="sr-box" :class="visit.status"></span>
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
import { useTheme } from '@/composables/useTheme.js'
import { fmtDateShort } from '@/composables/useFormatters.js'
import StatusPill from '@/components/StatusPill.vue'

const router = useRouter()
const { visits, totalVisits, ageGroups } = useSchedule()
const { toggleTheme, isDark } = useTheme()

const visitsByGroup = (g) => visits.filter(v => v.ageGroup === g)
</script>

<style scoped>
.schedule-view {
  container-type: inline-size;
  padding-bottom: 90px;
  width: 100%;
}

.view-header {
  padding: calc(var(--safe-top) + 20px) 20px 20px;
  background: var(--clr-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--clr-border);
}
.header-left { flex: 1; }
.header-pretitle {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.85;
  margin-bottom: 4px;
}
.view-title { font-size: 22px; font-weight: 800; letter-spacing: -0.01em; }
.view-sub   { font-size: 12px; opacity: .88; margin-top: 3px; }

.header-theme-btn {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  padding: 7px 14px;
  border-radius: 0px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.12s ease;
  white-space: nowrap;
}
.header-theme-btn:hover {
  background: rgba(255, 255, 255, 0.28);
}

.group-section { margin: 0 16px 24px; }
.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0 8px;
  border-bottom: 1px solid var(--clr-border);
  margin-bottom: 10px;
}
.group-title {
  font-size: 11px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--clr-text-muted);
}
.group-badge {
  font-size: 10px;
  font-weight: 800;
  color: var(--clr-primary);
  background: var(--clr-primary-light);
  border: 1px solid var(--clr-primary-border);
  padding: 1px 6px;
  border-radius: 0px;
}

.group-rows { display: flex; flex-direction: column; gap: 6px; }

.schedule-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 0px;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: background .12s, border-color .12s, transform .1s;
}
.schedule-row:hover {
  background: var(--clr-surface-muted);
  border-color: var(--clr-primary-border);
  transform: translateY(-1px);
}
.schedule-row:focus-visible { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

.sr-box { width: 9px; height: 9px; border-radius: 0px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.1); }
.sr-box.done     { background: var(--clr-success); border-color: var(--clr-success-border); }
.sr-box.upcoming { background: var(--clr-upcoming); border-color: var(--clr-upcoming-border); }
.sr-box.overdue  { background: var(--clr-danger); border-color: var(--clr-danger-border); }
.sr-box.due-soon { background: var(--clr-warning); border-color: var(--clr-warning-border); }

.sr-body  { flex: 1; min-width: 0; }
.sr-age   { font-size: 14px; font-weight: 800; color: var(--clr-text); }
.sr-vax   { font-size: 11px; color: var(--clr-text-muted); margin-top: 2px; }

.sr-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.sr-date  { font-size: 11px; color: var(--clr-text-muted); font-weight: 600; font-family: var(--font-mono); }

@container (min-width: 600px) {
  .view-header { padding: 26px 32px 20px; }
  .view-title  { font-size: 24px; }
  .group-section { margin: 0 32px 26px; }
  .group-rows {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

@container (min-width: 1250px) {
  .view-header { padding: 30px 40px 24px; }
  .group-section { margin: 0 40px 30px; }
  .group-rows {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
}

@container (min-width: 1800px) {
  .group-rows {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
}
</style>
