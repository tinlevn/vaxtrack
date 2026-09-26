<template>
  <div class="home-view">
    <!-- Mobile clinical hero -->
    <div class="mobile-hero">
      <div class="mh-avatar">{{ BABY.emoji }}</div>
      <div class="mh-info">
        <h1 class="mh-name">{{ BABY.name }}</h1>
        <p class="mh-sub">DOB: {{ fmtDate(BABY.dob) }} · {{ babyAgeLabel(BABY.dob) }}</p>
      </div>
      <button
        class="mobile-theme-btn"
        @click="toggleTheme"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        {{ isDark ? '☀️' : '🌙' }}
      </button>
      <ProgressRing :pct="progressPct" size="58" stroke="5" />
    </div>

    <!-- Desktop clinical header bar -->
    <div class="desktop-header">
      <div class="header-left">
        <div class="header-pretitle">PEDIATRIC HEALTH RECORD · VACCINATION LOG</div>
        <h1 class="page-title">🗓️ Vaccination Timeline Chart</h1>
        <p class="page-sub">
          <strong>Patient:</strong> {{ BABY.name }} &nbsp;|&nbsp;
          <strong>DOB:</strong> {{ fmtDate(BABY.dob) }} &nbsp;|&nbsp;
          <strong>Age:</strong> {{ babyAgeLabel(BABY.dob) }}
        </p>
      </div>
      <div class="header-right">
        <button
          class="theme-quick-btn"
          @click="toggleTheme"
          :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <span class="theme-quick-icon">{{ isDark ? '☀️' : '🌙' }}</span>
          <span class="theme-quick-text">{{ isDark ? 'Clinical Light' : 'Telemetry Dark' }}</span>
        </button>
      </div>
    </div>

    <!-- Stats strip (Clinical Vitals Strip) -->
    <div class="stats-strip" role="region" aria-label="Vaccination summary">
      <div class="stat-card">
        <span class="stat-num done">{{ doneVisits }}</span>
        <span class="stat-lbl">VISITS COMPLETED</span>
      </div>
      <div class="stat-card">
        <span class="stat-num warning">{{ overdueVisits }}</span>
        <span class="stat-lbl">DUE / OVERDUE</span>
      </div>
      <div class="stat-card">
        <span class="stat-num upcoming">{{ upcomingVisits }}</span>
        <span class="stat-lbl">UPCOMING VISITS</span>
      </div>
      <div class="stat-card stat-progress">
        <span class="stat-num progress-val">{{ progressPct }}%</span>
        <span class="stat-lbl">COMPLETION RATE</span>
      </div>
    </div>

    <!-- Next due medical banner -->
    <div
      v-if="nextDue"
      class="next-due-banner"
      role="button" tabindex="0"
      aria-label="View next due vaccination"
      @click="router.push({ name: 'detail', params: { id: nextDue.id } })"
      @keydown.enter="router.push({ name: 'detail', params: { id: nextDue.id } })"
    >
      <div class="ndb-icon-box">⏰</div>
      <div class="ndb-body">
        <div class="ndb-label">NEXT SCHEDULED VISIT</div>
        <div class="ndb-title">{{ nextDue.emoji }} {{ nextDue.ageLabel }} Visit</div>
        <div class="ndb-date">Target Date: {{ fmtDate(nextDue.targetDate) }} · {{ daysLabel(nextDue) }}</div>
      </div>
      <div class="ndb-action">
        <span>VIEW VISIT RECORD</span>
        <span class="ndb-arrow">›</span>
      </div>
    </div>

    <!-- Age group filter tabs (Clinical Tabs) -->
    <div class="section-label">FILTER BY AGE COHORT</div>
    <div class="age-tabs" role="tablist" aria-label="Age cohort filter">
      <button
        v-for="g in ageGroups" :key="g"
        class="age-tab" :class="{ active: activeGroup === g }"
        role="tab" :aria-selected="activeGroup === g"
        @click="activeGroup = g"
      >
        {{ g }}
        <span v-if="pendingCount(g) > 0" class="tab-badge">{{ pendingCount(g) }}</span>
      </button>
    </div>

    <!-- Timeline header & navigation legend -->
    <div class="timeline-header-bar">
      <div class="section-label-inner">CHRONOLOGICAL VISIT TIMELINE</div>
      <div class="snake-flow-legend" aria-hidden="true">
        <span class="legend-pill"><span class="legend-arrow">►</span> EASTBOUND</span>
        <span class="legend-pill"><span class="legend-arrow">▼</span> NEXT CYCLE</span>
        <span class="legend-pill"><span class="legend-arrow">◄</span> WESTBOUND</span>
      </div>
    </div>

    <!-- DESKTOP SNAKE TIMELINE (>= 860px) -->
    <div class="desktop-snake-timeline" role="region" aria-label="Sequential snake vaccination timeline">
      <div class="snake-start-marker">
        <span class="start-dot">●</span>
        <span class="start-text">CLINICAL SEQUENCE START · AT BIRTH RECORD</span>
        <span class="start-arrow">►</span>
      </div>

      <template v-for="(row, rIdx) in snakeRows" :key="row.rowIndex">
        <!-- Row of 3 Cards -->
        <div class="snake-row" :class="{ 'row-reversed': row.isReversed }">
          <div
            v-for="item in row.visits"
            :key="item.id"
            class="snake-col"
            :style="{ gridColumn: item.gridCol }"
          >
            <TimelineCard
              :visit="item"
              :seqNumber="item.seqNumber"
              mode="snake"
              :flowDirection="item.flowDirection"
              :isLastInRow="item.isLastInRow"
              :isLastGlobal="item.isLastGlobal"
              @open="router.push({ name: 'detail', params: { id: item.id } })"
              class="fade-in"
            />

            <!-- Horizontal connector arrow between items in this row -->
            <div
              v-if="!item.isLastInRow && !item.isLastGlobal"
              class="snake-h-connector"
              :class="item.flowDirection === 'right' ? 'conn-right' : 'conn-left'"
              aria-hidden="true"
            >
              <div class="conn-line"></div>
              <div class="conn-badge">
                <span class="conn-arrow">{{ item.flowDirection === 'right' ? '▶' : '◀' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Downward turn connector between rows -->
        <div
          v-if="rIdx < snakeRows.length - 1"
          class="snake-turn-row"
          :class="row.isReversed ? 'turn-from-left' : 'turn-from-right'"
          aria-hidden="true"
        >
          <div
            class="turn-pipe"
            :style="{ gridColumn: row.isReversed ? 1 : 3 }"
          >
            <div class="turn-pipe-line"></div>
            <div class="turn-junction">
              <span class="turn-arrow">▼</span>
            </div>
            <div class="turn-pipe-line"></div>
          </div>
        </div>
      </template>

      <div class="snake-end-marker">
        <span class="end-dot">■</span>
        <span class="end-text">CHRONOLOGICAL HORIZON REACHED · 13 MILESTONE PROTOCOL</span>
      </div>
    </div>

    <!-- MOBILE VERTICAL TIMELINE (< 860px) -->
    <ol class="mobile-timeline" role="list" aria-label="Vertical vaccination timeline">
      <TimelineCard
        v-for="(visit, i) in filteredVisits" :key="'mob-' + visit.id"
        :visit="visit"
        :seqNumber="getGlobalSeq(visit.id, i)"
        :isLast="i === filteredVisits.length - 1"
        mode="vertical"
        @open="router.push({ name: 'detail', params: { id: visit.id } })"
        class="fade-in"
      />
    </ol>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSchedule } from '@/composables/useSchedule.js'
import { useTheme } from '@/composables/useTheme.js'
import { babyAgeLabel, fmtDate, daysLabel } from '@/composables/useFormatters.js'
import { BABY } from '@/data/schedule.js'
import ProgressRing from '@/components/ProgressRing.vue'
import TimelineCard from '@/components/TimelineCard.vue'

const router = useRouter()
const { visits, doneVisits, overdueVisits, upcomingVisits, progressPct, nextDue, ageGroups } = useSchedule()
const { toggleTheme, isDark } = useTheme()

const activeGroup = ref('All')
const filteredVisits = computed(() =>
  activeGroup.value === 'All' ? visits : visits.filter(v => v.ageGroup === activeGroup.value)
)
const pendingCount = (g) =>
  visits.filter(v => (g === 'All' || v.ageGroup === g) && v.status !== 'done').length

const getGlobalSeq = (visitId, fallbackIdx) => {
  const idx = visits.findIndex(v => v.id === visitId)
  return idx >= 0 ? idx + 1 : fallbackIdx + 1
}

/**
 * Snake Rows Computation (3 columns per row on desktop):
 * Row 0 (even): L-to-R (Cols 1 -> 2 -> 3)
 * Row 1 (odd):  R-to-L (Cols 3 -> 2 -> 1)
 * Row 2 (even): L-to-R (Cols 1 -> 2 -> 3)
 * Connected via downward pipes at Col 3 (turn right) and Col 1 (turn left).
 */
const snakeRows = computed(() => {
  const result = []
  const list = filteredVisits.value
  for (let i = 0; i < list.length; i += 3) {
    const chunk = list.slice(i, i + 3)
    const rowIndex = Math.floor(i / 3)
    const isReversed = rowIndex % 2 === 1
    result.push({
      rowIndex,
      isReversed,
      visits: chunk.map((v, colIdx) => {
        const globalIdx = visits.findIndex(item => item.id === v.id) + 1
        return {
          ...v,
          seqNumber: globalIdx > 0 ? globalIdx : (i + colIdx + 1),
          gridCol: isReversed ? (3 - colIdx) : (colIdx + 1),
          isLastInRow: colIdx === chunk.length - 1,
          isLastGlobal: (i + colIdx) === list.length - 1,
          flowDirection: isReversed ? 'left' : 'right',
        }
      })
    })
  }
  return result
})
</script>

<style scoped>
.home-view {
  padding-bottom: 90px;
  container-type: inline-size;
  width: 100%;
}

/* Mobile Hero */
.mobile-hero {
  background: var(--clr-primary);
  padding: calc(var(--safe-top) + 16px) 18px 18px;
  display: flex; align-items: center; gap: 12px; color: #fff;
  border-bottom: 1px solid var(--clr-border);
}
.mh-avatar {
  font-size: 24px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 0px;
  flex-shrink: 0;
}
.mh-info  { flex: 1; }
.mh-name  { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; }
.mh-sub   { font-size: 11px; opacity: .9; margin-top: 2px; }
.mobile-theme-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 0px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  font-size: 15px;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
}

/* Desktop Clinical Header */
.desktop-header {
  display: none;
  padding: 24px 28px 0;
  align-items: center;
  justify-content: space-between;
}
.header-pretitle {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--clr-primary);
  margin-bottom: 4px;
}
.page-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--clr-text);
  letter-spacing: -0.02em;
}
.page-sub {
  font-size: 13px;
  color: var(--clr-text-muted);
  margin-top: 4px;
}

.header-right { display: flex; align-items: center; gap: 12px; }
.theme-quick-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  color: var(--clr-text);
  padding: 8px 14px;
  border-radius: 0px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.12s ease;
  box-shadow: var(--shadow);
}
.theme-quick-btn:hover {
  background: var(--clr-primary-light);
  border-color: var(--clr-primary);
  color: var(--clr-primary);
}
.theme-quick-icon { font-size: 14px; }

/* Stats Strip (Clinical Vitals) */
.stats-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border);
  border-top: 1px solid var(--clr-border);
}
.stat-card {
  padding: 14px 12px;
  text-align: center;
  border-right: 1px solid var(--clr-border);
}
.stat-card:last-child { border-right: none; }
.stat-card.stat-progress { display: none; }
.stat-num {
  display: block;
  font-size: 26px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}
.stat-num.done        { color: var(--clr-success); }
.stat-num.warning     { color: var(--clr-warning); }
.stat-num.upcoming    { color: var(--clr-upcoming); }
.stat-num.progress-val{ color: var(--clr-primary); }
.stat-lbl {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--clr-text-muted);
  margin-top: 4px;
}

/* Next Due Clinical Banner */
.next-due-banner {
  display: flex; align-items: center; gap: 14px;
  margin: 16px 16px 0;
  background: var(--clr-card-due-soon-bg);
  border: 1px solid var(--clr-card-due-soon-border);
  border-radius: 0px; padding: 14px 18px;
  cursor: pointer;
  transition: background .12s, box-shadow .12s;
  box-shadow: var(--shadow);
}
.next-due-banner:hover {
  background: var(--clr-surface);
  box-shadow: var(--shadow-card);
}
.ndb-icon-box {
  font-size: 22px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-warning-border);
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 0px;
  flex-shrink: 0;
}
.ndb-body  { flex: 1; min-width: 0; }
.ndb-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--clr-warning-text); }
.ndb-title { font-size: 15px; font-weight: 800; margin: 2px 0; color: var(--clr-text); }
.ndb-date  { font-size: 12px; color: var(--clr-text-muted); font-weight: 500; }
.ndb-action{
  display: none;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  color: var(--clr-warning-text);
  letter-spacing: 0.06em;
}
.ndb-arrow { font-size: 20px; color: var(--clr-warning); }

.section-label {
  font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .1em;
  color: var(--clr-text-subtle); padding: 22px 16px 8px;
}

/* Age Tabs (Sharp Rectangular Segments) */
.age-tabs {
  display: flex; gap: 4px;
  padding: 0 16px 14px;
  overflow-x: auto; scrollbar-width: none;
}
.age-tabs::-webkit-scrollbar { display: none; }
.age-tab {
  flex-shrink: 0;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 0px; padding: 7px 14px;
  font-size: 12px; font-weight: 700; color: var(--clr-text-muted);
  cursor: pointer; transition: all .12s;
  display: flex; align-items: center; gap: 6px;
}
.age-tab:hover {
  background: var(--clr-surface-muted);
  border-color: var(--clr-primary-border);
  color: var(--clr-text);
}
.age-tab.active {
  background: var(--clr-primary);
  border-color: var(--clr-primary);
  color: #fff;
}
.tab-badge {
  display: inline-flex;
  background: var(--clr-warning); color: #fff;
  font-size: 10px; font-weight: 800;
  border-radius: 0px; padding: 1px 5px; line-height: 1.4;
}
.age-tab.active .tab-badge {
  background: rgba(255,255,255,.3);
}

/* Timeline Header Bar & Legend */
.timeline-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 16px 10px;
}
.section-label-inner {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--clr-text-subtle);
}
.snake-flow-legend {
  display: none;
  align-items: center;
  gap: 8px;
}
.legend-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--clr-text-muted);
  box-shadow: var(--shadow);
}
.legend-arrow {
  color: var(--clr-primary);
  font-weight: 900;
}

/* Mobile Vertical Timeline (Strictly phone screens < 600px) */
.desktop-snake-timeline {
  display: none;
}
.mobile-timeline {
  display: flex;
  flex-direction: column;
  padding: 0 16px 24px;
  list-style: none;
}

/* Tablet & Desktop Layout Enhancements (>= 600px) */
@container (min-width: 600px) {
  .mobile-hero    { display: none; }
  .desktop-header { display: flex; }
  .stats-strip    {
    margin: 18px 28px 0;
    border-radius: 0px;
    border: 1px solid var(--clr-border);
    box-shadow: var(--shadow);
    grid-template-columns: repeat(4, 1fr);
  }
  .stat-card.stat-progress { display: block; }
  .next-due-banner{ margin: 18px 28px 0; }
  .ndb-action     { display: flex; }
  .section-label  { padding: 24px 28px 8px; }
  .age-tabs       { padding: 0 28px 14px; }
  .timeline-header-bar { padding: 24px 28px 12px; }

  /* Activate Snake Timeline on all desktop/tablet viewports */
  .mobile-timeline {
    display: none;
  }
  .snake-flow-legend {
    display: flex;
  }
  .desktop-snake-timeline {
    display: flex;
    flex-direction: column;
    padding: 0 28px 36px;
    --snake-gap: 32px;
  }

  .snake-start-marker {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--clr-surface);
    border: 1px solid var(--clr-border);
    padding: 8px 14px;
    margin-bottom: 22px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: var(--clr-primary);
    box-shadow: var(--shadow);
  }
  .start-dot {
    color: var(--clr-success);
    font-size: 13px;
  }
  .start-arrow {
    margin-left: auto;
    font-size: 13px;
    color: var(--clr-primary);
  }

  .snake-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--snake-gap);
    position: relative;
    align-items: stretch;
  }

  .snake-col {
    position: relative;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  /* Horizontal Snake Connectors between cards */
  .snake-h-connector {
    position: absolute;
    top: 34px;
    width: var(--snake-gap);
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
  }
  .snake-h-connector.conn-right {
    right: calc(-1 * var(--snake-gap));
  }
  .snake-h-connector.conn-left {
    left: calc(-1 * var(--snake-gap));
  }
  .conn-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--clr-primary);
    transform: translateY(-50%);
    opacity: 0.85;
  }
  :root[data-theme="dark"] .conn-line {
    opacity: 0.95;
  }
  .conn-badge {
    position: relative;
    z-index: 2;
    width: 24px;
    height: 24px;
    background: var(--clr-surface);
    border: 2px solid var(--clr-primary);
    display: grid;
    place-items: center;
    box-shadow: var(--shadow-card);
  }
  .conn-arrow {
    font-size: 11px;
    line-height: 1;
    color: var(--clr-primary);
    font-weight: 900;
  }

  /* Vertical Downward Turn Row between Snake Cycles */
  .snake-turn-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--snake-gap);
    margin: 12px 0;
  }
  .turn-pipe {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 52px;
    position: relative;
  }
  .turn-pipe-line {
    flex: 1;
    width: 3px;
    background: var(--clr-primary);
    opacity: 0.85;
  }
  :root[data-theme="dark"] .turn-pipe-line {
    opacity: 0.95;
  }
  .turn-junction {
    width: 32px;
    height: 32px;
    background: var(--clr-surface);
    border: 2px solid var(--clr-primary);
    display: grid;
    place-items: center;
    box-shadow: var(--shadow-card);
    z-index: 2;
  }
  .turn-arrow {
    font-size: 12px;
    color: var(--clr-primary);
    font-weight: 900;
    line-height: 1;
  }

  .snake-end-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    margin-top: 24px;
    background: var(--clr-surface-muted);
    border: 1px dashed var(--clr-border-strong);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: var(--clr-text-muted);
  }
  .end-dot {
    color: var(--clr-primary);
    font-size: 12px;
  }
}

/* 1440p Monitor & Ultra-Wide: larger paddings & generous spacing */
@container (min-width: 1380px) {
  .desktop-header { padding: 28px 36px 0; }
  .stats-strip    { margin: 20px 36px 0; }
  .next-due-banner{ margin: 20px 36px 0; }
  .timeline-header-bar { padding: 26px 36px 12px; }
  .age-tabs       { padding: 0 36px 16px; }
  .desktop-snake-timeline {
    padding: 0 36px 40px;
    --snake-gap: 40px;
  }
}
</style>
