<template>
  <aside class="sidebar">
    <!-- Medical Brand / Header -->
    <div class="sidebar-brand">
      <div class="brand-badge">⚕️</div>
      <div class="brand-text">
        <span class="brand-name">VaxTrack</span>
        <span class="brand-sub">Clinical Immunization EMR</span>
      </div>
    </div>

    <!-- Patient Profile Card (Hospital Chart Style) -->
    <div class="patient-card">
      <div class="patient-header">
        <span class="ph-label">PATIENT RECORD</span>
        <span class="ph-id">#VX-2404</span>
      </div>
      <div class="patient-main">
        <div class="patient-avatar">{{ BABY.emoji }}</div>
        <div class="patient-info">
          <div class="patient-name">{{ BABY.name }}</div>
          <div class="patient-dob">DOB: {{ fmtDate(BABY.dob) }}</div>
          <div class="patient-age">Age: {{ babyAgeLabel(BABY.dob) }}</div>
        </div>
      </div>
    </div>

    <!-- Immunization Progress (Clinical Metrics) -->
    <div class="sidebar-progress">
      <ProgressRing :pct="progressPct" size="76" stroke="6" />
      <div class="progress-legend">
        <div class="legend-row">
          <span class="legend-box done"></span>
          <span>{{ doneVisits }} visits completed</span>
        </div>
        <div class="legend-row">
          <span class="legend-box overdue"></span>
          <span>{{ overdueVisits }} due / overdue</span>
        </div>
        <div class="legend-row">
          <span class="legend-box upcoming"></span>
          <span>{{ upcomingVisits }} upcoming</span>
        </div>
      </div>
    </div>

    <!-- Next Due Medical Alert -->
    <div v-if="nextDue" class="sidebar-next-due" @click="router.push({ name: 'detail', params: { id: nextDue.id } })">
      <div class="nd-tag">SCHEDULED VISIT</div>
      <div class="nd-title">{{ nextDue.emoji }} {{ nextDue.ageLabel }}</div>
      <div class="nd-date">Target: {{ fmtDate(nextDue.targetDate) }}</div>
    </div>

    <!-- Export Report Quick Button -->
    <div class="sidebar-export-wrap">
      <button class="export-report-btn" @click="showPrintModal = true">
        <span class="er-icon">🖨️</span>
        <span class="er-text">EXPORT / PRINT LOG</span>
      </button>
    </div>

    <!-- Navigation (Clinical Sections) -->
    <nav class="sidebar-nav">
      <RouterLink class="nav-link" :to="{ name: 'home' }">
        <span class="nl-icon">📅</span> Timeline Chart
      </RouterLink>
      <RouterLink class="nav-link" :to="{ name: 'schedule' }">
        <span class="nl-icon">📋</span> Master Schedule
      </RouterLink>
      <RouterLink class="nav-link" :to="{ name: 'info' }">
        <span class="nl-icon">📖</span> Clinical Glossary
      </RouterLink>
    </nav>

    <!-- Theme Control (Hospital Monitor Modes) -->
    <div class="sidebar-theme">
      <div class="theme-header">
        <span class="theme-title">DISPLAY MODE</span>
        <span class="theme-active-label">{{ theme === 'light' ? 'Clinical Light' : 'Telemetry Dark' }}</span>
      </div>
      <div class="theme-pills" role="radiogroup" aria-label="Theme mode">
        <button
          type="button"
          class="theme-btn"
          :class="{ active: theme === 'light' }"
          @click="setTheme('light')"
          aria-label="Light mode"
        >
          <span class="tb-icon">☀️</span> Light
        </button>
        <button
          type="button"
          class="theme-btn"
          :class="{ active: theme === 'dark' }"
          @click="setTheme('dark')"
          aria-label="Dark mode"
        >
          <span class="tb-icon">🌙</span> Dark
        </button>
      </div>
    </div>

    <div class="sidebar-footer">
      <span class="footer-dot"></span> CDC / ACIP Pediatric Standards
    </div>

    <!-- Print Modal -->
    <PrintModal :isOpen="showPrintModal" @close="showPrintModal = false" />
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSchedule } from '@/composables/useSchedule.js'
import { useTheme } from '@/composables/useTheme.js'
import { fmtDate, babyAgeLabel } from '@/composables/useFormatters.js'
import { BABY } from '@/data/schedule.js'
import ProgressRing from '@/components/ProgressRing.vue'
import PrintModal from '@/components/PrintModal.vue'

const router = useRouter()
const { doneVisits, overdueVisits, upcomingVisits, progressPct, nextDue } = useSchedule()
const { theme, setTheme } = useTheme()

const showPrintModal = ref(false)
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
  padding: 20px 18px 16px;
  border-bottom: 1px solid var(--clr-border);
  background: var(--clr-surface-muted);
}
.brand-badge {
  font-size: 22px;
  background: var(--clr-primary-light);
  border: 1px solid var(--clr-primary-border);
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 0px;
}
.brand-text { display: flex; flex-direction: column; }
.brand-name { font-size: 19px; font-weight: 800; color: var(--clr-primary); letter-spacing: -0.02em; }
.brand-sub  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--clr-text-muted); }

/* Patient Card (EMR Chart Look) */
.patient-card {
  padding: 14px 18px;
  border-bottom: 1px solid var(--clr-border);
  background: var(--clr-surface);
}
.patient-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.ph-label { font-size: 10px; font-weight: 800; letter-spacing: 0.08em; color: var(--clr-text-subtle); }
.ph-id    { font-size: 10px; font-family: var(--font-mono); font-weight: 700; color: var(--clr-primary); background: var(--clr-primary-light); border: 1px solid var(--clr-primary-border); padding: 1px 5px; }

.patient-main { display: flex; align-items: center; gap: 12px; }
.patient-avatar {
  font-size: 28px;
  background: var(--clr-surface-muted);
  border: 1px solid var(--clr-border);
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 0px;
  flex-shrink: 0;
}
.patient-info { flex: 1; min-width: 0; }
.patient-name { font-size: 15px; font-weight: 800; color: var(--clr-text); }
.patient-dob  { font-size: 11px; color: var(--clr-text-muted); margin-top: 1px; }
.patient-age  { font-size: 12px; color: var(--clr-primary); font-weight: 700; margin-top: 2px; }

.sidebar-progress {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--clr-border);
  background: var(--clr-surface-muted);
}
.progress-legend { display: flex; flex-direction: column; gap: 6px; }
.legend-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--clr-text-muted); font-weight: 600; }
.legend-box { width: 9px; height: 9px; border-radius: 0px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.1); }
.legend-box.done     { background: var(--clr-success); border-color: var(--clr-success-border); }
.legend-box.overdue  { background: var(--clr-danger); border-color: var(--clr-danger-border); }
.legend-box.upcoming { background: var(--clr-upcoming); border-color: var(--clr-upcoming-border); }

.sidebar-next-due {
  margin: 14px 16px;
  background: var(--clr-card-due-soon-bg);
  border: 1px solid var(--clr-card-due-soon-border);
  border-radius: 0px;
  padding: 12px 14px;
  cursor: pointer;
  transition: opacity .15s, background .15s;
}
.sidebar-next-due:hover { opacity: .88; }
.nd-tag   { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--clr-warning-text); margin-bottom: 3px; }
.nd-title { font-size: 13px; font-weight: 800; color: var(--clr-text); }
.nd-date  { font-size: 11px; color: var(--clr-text-muted); margin-top: 2px; }

.sidebar-export-wrap {
  padding: 0 16px 10px;
}
.export-report-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 12px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-primary);
  color: var(--clr-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: all .12s ease;
}
.export-report-btn:hover {
  background: var(--clr-primary-light);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  gap: 3px;
  flex: 1;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 0px;
  font-size: 13px;
  font-weight: 600;
  color: var(--clr-text-muted);
  border: 1px solid transparent;
  transition: all .12s ease;
}
.nav-link:hover {
  background: var(--clr-surface-muted);
  color: var(--clr-text);
  border-color: var(--clr-border);
}
.nav-link.router-link-active {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
  font-weight: 700;
  border-color: var(--clr-primary-border);
}
.nl-icon { font-size: 16px; }

.sidebar-theme {
  padding: 14px 16px;
  border-top: 1px solid var(--clr-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--clr-surface);
}
.theme-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.theme-title {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--clr-text-subtle);
}
.theme-active-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--clr-primary);
  text-transform: uppercase;
}
.theme-pills {
  display: flex;
  background: var(--clr-bg);
  border: 1px solid var(--clr-border);
  border-radius: 0px;
  padding: 2px;
  gap: 2px;
}
.theme-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 0px;
  font-size: 12px;
  font-weight: 600;
  color: var(--clr-text-muted);
  transition: all .12s ease;
  cursor: pointer;
  border: 1px solid transparent;
}
.theme-btn:hover {
  color: var(--clr-text);
}
.theme-btn.active {
  background: var(--clr-surface);
  color: var(--clr-primary);
  font-weight: 700;
  border-color: var(--clr-border);
  box-shadow: var(--shadow);
}
.tb-icon {
  font-size: 12px;
}

.sidebar-footer {
  padding: 12px 18px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--clr-text-subtle);
  border-top: 1px solid var(--clr-border);
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--clr-surface-muted);
}
.footer-dot {
  width: 6px;
  height: 6px;
  background: var(--clr-success);
  border-radius: 0px;
}
</style>
