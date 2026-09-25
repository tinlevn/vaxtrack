<template>
  <div class="home-view">
    <!-- Mobile-only hero -->
    <div class="mobile-hero">
      <span class="hero-emoji">{{ BABY.emoji }}</span>
      <div class="hero-info">
        <h1 class="hero-name">{{ BABY.name }}</h1>
        <p class="hero-age">{{ babyAgeLabel(BABY.dob) }}</p>
      </div>
      <ProgressRing :pct="progressPct" size="62" stroke="6" />
    </div>

    <!-- Desktop page title -->
    <div class="desktop-header">
      <h1 class="page-title">🗓️ Vaccination Timeline</h1>
      <p class="page-sub">{{ BABY.name }} · {{ babyAgeLabel(BABY.dob) }}</p>
    </div>

    <!-- Stats strip -->
    <div class="stats-strip" role="region" aria-label="Vaccination summary">
      <div class="stat-card">
        <span class="stat-num done">{{ doneVisits }}</span>
        <span class="stat-lbl">Visits Done</span>
      </div>
      <div class="stat-card">
        <span class="stat-num warning">{{ overdueVisits }}</span>
        <span class="stat-lbl">Due / Overdue</span>
      </div>
      <div class="stat-card">
        <span class="stat-num upcoming">{{ upcomingVisits }}</span>
        <span class="stat-lbl">Upcoming</span>
      </div>
    </div>

    <!-- Next due banner -->
    <div
      v-if="nextDue"
      class="next-due-banner"
      role="button" tabindex="0"
      aria-label="View next due vaccination"
      @click="router.push({ name: 'detail', params: { id: nextDue.id } })"
      @keydown.enter="router.push({ name: 'detail', params: { id: nextDue.id } })"
    >
      <span class="ndb-icon">💉</span>
      <div class="ndb-body">
        <div class="ndb-label">⏰ Next Visit</div>
        <div class="ndb-title">{{ nextDue.emoji }} {{ nextDue.ageLabel }}</div>
        <div class="ndb-date">{{ fmtDate(nextDue.targetDate) }} · {{ daysLabel(nextDue) }}</div>
      </div>
      <span class="ndb-arrow">›</span>
    </div>

    <!-- Age group filter tabs -->
    <div class="section-label">Filter by Age Group</div>
    <div class="age-tabs" role="tablist" aria-label="Age group filter">
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

    <!-- Timeline -->
    <div class="section-label">Timeline</div>
    <ol class="timeline" role="list" aria-label="Vaccination timeline">
      <TimelineCard
        v-for="(visit, i) in filteredVisits" :key="visit.id"
        :visit="visit" :isLast="i === filteredVisits.length - 1"
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
import { babyAgeLabel, fmtDate, daysLabel } from '@/composables/useFormatters.js'
import { BABY } from '@/data/schedule.js'
import ProgressRing from '@/components/ProgressRing.vue'
import TimelineCard from '@/components/TimelineCard.vue'

const router = useRouter()
const { visits, doneVisits, overdueVisits, upcomingVisits, progressPct, nextDue, ageGroups } = useSchedule()

const activeGroup = ref('All')
const filteredVisits = computed(() =>
  activeGroup.value === 'All' ? visits : visits.filter(v => v.ageGroup === activeGroup.value)
)
const pendingCount = (g) =>
  visits.filter(v => (g === 'All' || v.ageGroup === g) && v.status !== 'done').length
</script>

<style scoped>
.home-view { padding-bottom: 90px; container-type: inline-size; }

.mobile-hero {
  background: linear-gradient(145deg, var(--clr-primary) 0%, #a78bfa 100%);
  padding: calc(var(--safe-top) + 20px) 20px 22px;
  display: flex; align-items: center; gap: 14px; color: #fff;
}
.hero-emoji { font-size: 44px; flex-shrink: 0; }
.hero-info  { flex: 1; }
.hero-name  { font-size: 20px; font-weight: 800; }
.hero-age   { font-size: 13px; opacity: .85; margin-top: 2px; }

.desktop-header { display: none; padding: 28px 28px 0; }
.page-title { font-size: 22px; font-weight: 800; }
.page-sub   { font-size: 14px; color: var(--clr-text-muted); margin-top: 3px; }

.stats-strip {
  display: grid; grid-template-columns: repeat(3, 1fr);
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border);
  border-top: 1px solid var(--clr-border);
}
.stat-card   { padding: 14px 10px; text-align: center; border-right: 1px solid var(--clr-border); }
.stat-card:last-child { border-right: none; }
.stat-num    { display: block; font-size: 26px; font-weight: 800; }
.stat-num.done     { color: var(--clr-success); }
.stat-num.warning  { color: var(--clr-warning); }
.stat-num.upcoming { color: var(--clr-upcoming); }
.stat-lbl    { font-size: 11px; color: var(--clr-text-muted); margin-top: 2px; }

.next-due-banner {
  display: flex; align-items: center; gap: 12px;
  margin: 16px 16px 0;
  background: var(--clr-warning-light);
  border: 1.5px solid var(--clr-warning);
  border-radius: var(--radius); padding: 14px 16px;
  cursor: pointer; transition: opacity .15s;
}
.next-due-banner:hover { opacity: .88; }
.ndb-icon  { font-size: 28px; flex-shrink: 0; }
.ndb-body  { flex: 1; }
.ndb-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--clr-warning); }
.ndb-title { font-size: 15px; font-weight: 700; margin: 2px 0; }
.ndb-date  { font-size: 12px; color: var(--clr-text-muted); }
.ndb-arrow { font-size: 24px; color: var(--clr-warning); }

.section-label {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--clr-text-muted); padding: 18px 16px 8px;
}

.age-tabs {
  display: flex; gap: 8px;
  padding: 0 16px 14px;
  overflow-x: auto; scrollbar-width: none;
}
.age-tabs::-webkit-scrollbar { display: none; }
.age-tab {
  flex-shrink: 0;
  background: var(--clr-surface); border: 1.5px solid var(--clr-border);
  border-radius: 100px; padding: 7px 15px;
  font-size: 13px; font-weight: 600; color: var(--clr-text-muted);
  cursor: pointer; transition: all .18s;
  display: flex; align-items: center; gap: 5px;
}
.age-tab.active { background: var(--clr-primary); border-color: var(--clr-primary); color: #fff; }
.tab-badge {
  display: inline-flex;
  background: var(--clr-warning); color: #fff;
  font-size: 10px; font-weight: 800;
  border-radius: 100px; padding: 1px 6px; line-height: 1.5;
}
.age-tab.active .tab-badge { background: rgba(255,255,255,.3); }

.timeline { display: flex; flex-direction: column; padding: 0 16px 20px; list-style: none; }

@container (min-width: 600px) {
  .mobile-hero    { display: none; }
  .desktop-header { display: block; }
  .stats-strip    { margin: 16px 28px 0; border-radius: var(--radius); border: 1.5px solid var(--clr-border); }
  .next-due-banner{ margin: 16px 28px 0; }
  .section-label  { padding: 18px 28px 8px; }
  .age-tabs       { padding: 0 28px 14px; }
  .timeline       { padding: 0 28px 20px; }
}
@container (min-width: 900px) {
  .timeline { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
}
</style>
