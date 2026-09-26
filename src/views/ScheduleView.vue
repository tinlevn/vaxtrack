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

    <!-- Filter Console -->
    <div class="filter-console">
      <div class="fc-search">
        <span class="fc-search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search schedule by vaccine, disease, or note..."
          class="fc-input"
          aria-label="Search schedule"
        />
        <button v-if="searchQuery" class="fc-clear-btn" @click="searchQuery = ''">✕</button>
      </div>

      <div class="fc-status-group" role="group" aria-label="Filter by status">
        <button
          v-for="s in statusOptions"
          :key="s.value"
          class="fc-status-btn"
          :class="[s.value, { active: statusFilter === s.value }]"
          @click="statusFilter = s.value"
        >
          <span class="fc-dot"></span>
          <span>{{ s.label }}</span>
        </button>
      </div>
    </div>

    <div v-for="group in ageGroups.slice(1)" :key="group" class="group-section">
      <template v-if="visitsByGroup(group).length > 0">
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
              <div v-if="visit.customNote" class="sr-custom-note">📝 {{ visit.customNote }}</div>
            </div>
            <div class="sr-right">
              <div class="sr-date">{{ fmtDateShort(visit.targetDate) }}</div>
              <StatusPill :status="visit.status" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Empty Search Result -->
    <div v-if="totalMatchingVisits === 0" class="empty-schedule-state">
      <div class="empty-icon">🔍</div>
      <div class="empty-title">No Matching Schedule Entries</div>
      <div class="empty-sub">Adjust your query or clear the status filter to see more visits.</div>
      <button class="empty-reset-btn" @click="resetFilters">RESET FILTERS</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSchedule } from '@/composables/useSchedule.js'
import { useTheme } from '@/composables/useTheme.js'
import { fmtDateShort } from '@/composables/useFormatters.js'
import StatusPill from '@/components/StatusPill.vue'

const router = useRouter()
const { visits, totalVisits, ageGroups, searchQuery, statusFilter, filterVisits } = useSchedule()
const { toggleTheme, isDark } = useTheme()

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'done', label: 'Done' },
  { value: 'due-soon', label: 'Due Soon / Overdue' },
  { value: 'upcoming', label: 'Upcoming' },
]

const visitsByGroup = (g) => filterVisits(visits, g)

const totalMatchingVisits = computed(() => filterVisits(visits, 'All').length)

function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = 'all'
}
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

/* Filter Console */
.filter-console {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 16px 8px;
}

.fc-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.fc-search-icon {
  position: absolute;
  left: 12px;
  font-size: 14px;
  color: var(--clr-text-muted);
  pointer-events: none;
}
.fc-input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  font-size: 13px;
  font-weight: 600;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  color: var(--clr-text);
  border-radius: 0px;
  outline: none;
  transition: border-color .12s, box-shadow .12s;
  box-shadow: var(--shadow);
}
.fc-input:focus {
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 2px var(--clr-primary-light);
}
.fc-clear-btn {
  position: absolute;
  right: 10px;
  font-size: 12px;
  font-weight: 800;
  color: var(--clr-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.fc-status-group {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}
.fc-status-group::-webkit-scrollbar { display: none; }

.fc-status-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 0px;
  font-size: 11px;
  font-weight: 700;
  color: var(--clr-text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: all .12s ease;
}
.fc-status-btn:hover {
  background: var(--clr-surface-muted);
  color: var(--clr-text);
}
.fc-status-btn.active {
  background: var(--clr-surface);
  border-color: var(--clr-primary);
  color: var(--clr-primary);
  font-weight: 800;
  box-shadow: var(--shadow);
}
.fc-dot {
  width: 7px;
  height: 7px;
  background: var(--clr-text-subtle);
  border-radius: 0px;
}
.fc-status-btn.done .fc-dot { background: var(--clr-success); }
.fc-status-btn.due-soon .fc-dot { background: var(--clr-warning); }
.fc-status-btn.upcoming .fc-dot { background: var(--clr-upcoming); }

.group-section { margin: 0 16px 20px; }
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
  transform: translateY(-1px);
}
.schedule-row:focus-visible { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

.schedule-row.done {
  background: var(--clr-card-done-bg);
  border-color: var(--clr-card-done-border);
}
.schedule-row.upcoming {
  background: var(--clr-card-upcoming-bg);
  border-color: var(--clr-card-upcoming-border);
}
.schedule-row.overdue {
  background: var(--clr-card-overdue-bg);
  border-color: var(--clr-card-overdue-border);
}
.schedule-row.due-soon {
  background: var(--clr-card-due-soon-bg);
  border-color: var(--clr-card-due-soon-border);
}

.sr-box { width: 9px; height: 9px; border-radius: 0px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.1); }
.sr-box.done     { background: var(--clr-success); border-color: var(--clr-success-border); }
.sr-box.upcoming { background: var(--clr-upcoming); border-color: var(--clr-upcoming-border); }
.sr-box.overdue  { background: var(--clr-danger); border-color: var(--clr-danger-border); }
.sr-box.due-soon { background: var(--clr-warning); border-color: var(--clr-warning-border); }

.sr-body  { flex: 1; min-width: 0; }
.sr-age   { font-size: 14px; font-weight: 800; color: var(--clr-text); }
.sr-vax   { font-size: 11px; color: var(--clr-text-muted); margin-top: 2px; }
.sr-custom-note { font-size: 11px; color: var(--clr-primary); font-weight: 600; margin-top: 3px; }

.sr-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.sr-date  { font-size: 11px; color: var(--clr-text-muted); font-weight: 600; font-family: var(--font-mono); }

.empty-schedule-state {
  margin: 30px 16px;
  padding: 32px 20px;
  background: var(--clr-surface);
  border: 1px dashed var(--clr-border-strong);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.empty-icon { font-size: 32px; }
.empty-title { font-size: 15px; font-weight: 800; color: var(--clr-text); }
.empty-sub { font-size: 12px; color: var(--clr-text-muted); }
.empty-reset-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: var(--clr-primary-light);
  border: 1px solid var(--clr-primary);
  color: var(--clr-primary);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
}

@container (min-width: 600px) {
  .view-header { padding: 26px 32px 20px; }
  .view-title  { font-size: 24px; }
  .filter-console {
    margin: 18px 32px 10px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .fc-search { max-width: 380px; }
  .group-section { margin: 0 32px 26px; }
  .group-rows {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

@container (min-width: 1250px) {
  .view-header { padding: 30px 40px 24px; }
  .filter-console { margin: 20px 40px 12px; }
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
