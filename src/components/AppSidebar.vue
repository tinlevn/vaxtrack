<template>
  <aside class="sidebar">
    <!-- Brand -->
    <div class="sidebar-brand">
      <span class="brand-icon">💉</span>
      <span class="brand-name">VaxTrack</span>
    </div>

    <!-- Baby profile card -->
    <div class="baby-card">
      <div class="baby-avatar">{{ BABY.emoji }}</div>
      <div class="baby-info">
        <div class="baby-name">{{ BABY.name }}</div>
        <div class="baby-dob">Born {{ fmtDate(BABY.dob) }}</div>
        <div class="baby-age">{{ babyAgeLabel(BABY.dob) }}</div>
      </div>
    </div>

    <!-- Progress ring -->
    <div class="sidebar-progress">
      <ProgressRing :pct="progressPct" size="80" stroke="7" />
      <div class="progress-legend">
        <div class="legend-row">
          <span class="legend-dot done"></span>
          <span>{{ doneVisits }} visits done</span>
        </div>
        <div class="legend-row">
          <span class="legend-dot overdue"></span>
          <span>{{ overdueVisits }} due / overdue</span>
        </div>
        <div class="legend-row">
          <span class="legend-dot upcoming"></span>
          <span>{{ upcomingVisits }} upcoming</span>
        </div>
      </div>
    </div>

    <!-- Next due -->
    <div v-if="nextDue" class="sidebar-next-due" @click="router.push({ name: 'detail', params: { id: nextDue.id } })">
      <div class="nd-label">⏰ Next Visit</div>
      <div class="nd-title">{{ nextDue.emoji }} {{ nextDue.ageLabel }}</div>
      <div class="nd-date">{{ fmtDate(nextDue.targetDate) }}</div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <RouterLink class="nav-link" :to="{ name: 'home' }">
        <span class="nl-icon">🏠</span> Timeline
      </RouterLink>
      <RouterLink class="nav-link" :to="{ name: 'schedule' }">
        <span class="nl-icon">📋</span> Full Schedule
      </RouterLink>
      <RouterLink class="nav-link" :to="{ name: 'info' }">
        <span class="nl-icon">ℹ️</span> Vaccine Info
      </RouterLink>
    </nav>

    <div class="sidebar-footer">Based on CDC/ACIP guidelines</div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSchedule } from '@/composables/useSchedule.js'
import { fmtDate, babyAgeLabel } from '@/composables/useFormatters.js'
import { BABY } from '@/data/schedule.js'
import ProgressRing from '@/components/ProgressRing.vue'

const router = useRouter()
const { doneVisits, overdueVisits, upcomingVisits, progressPct, nextDue } = useSchedule()
</script>

<style scoped>
.sidebar {
  background: var(--clr-surface);
  border-right: 1px solid var(--clr-border);
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100dvh;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px 16px;
  border-bottom: 1px solid var(--clr-border);
}
.brand-icon { font-size: 26px; }
.brand-name { font-size: 20px; font-weight: 800; color: var(--clr-primary); }

.baby-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--clr-primary-light);
  border-bottom: 1px solid var(--clr-border);
}
.baby-avatar { font-size: 36px; }
.baby-name   { font-size: 15px; font-weight: 700; }
.baby-dob    { font-size: 12px; color: var(--clr-text-muted); }
.baby-age    { font-size: 12px; color: var(--clr-primary); font-weight: 600; margin-top: 2px; }

.sidebar-progress {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--clr-border);
}
.progress-legend { display: flex; flex-direction: column; gap: 5px; }
.legend-row { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--clr-text-muted); }
.legend-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.legend-dot.done     { background: var(--clr-success); }
.legend-dot.overdue  { background: var(--clr-danger); }
.legend-dot.upcoming { background: var(--clr-upcoming); }

.sidebar-next-due {
  margin: 14px 16px;
  background: var(--clr-warning-light);
  border: 1.5px solid var(--clr-warning);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  cursor: pointer;
  transition: opacity .15s;
}
.sidebar-next-due:hover { opacity: .85; }
.nd-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--clr-warning); margin-bottom: 3px; }
.nd-title { font-size: 14px; font-weight: 700; }
.nd-date  { font-size: 12px; color: var(--clr-text-muted); margin-top: 2px; }

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  gap: 2px;
  flex: 1;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  color: var(--clr-text-muted);
  transition: background .15s, color .15s;
}
.nav-link:hover { background: var(--clr-bg); color: var(--clr-text); }
.nav-link.router-link-active {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
}
.nl-icon { font-size: 18px; }

.sidebar-footer {
  padding: 12px 20px 20px;
  font-size: 11px;
  color: var(--clr-text-muted);
  border-top: 1px solid var(--clr-border);
}
</style>
