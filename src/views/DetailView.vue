<template>
  <div v-if="visit" class="detail-view">
    <!-- Back bar with theme toggle -->
    <div class="detail-topbar">
      <RouterLink :to="{ name: 'home' }" class="back-btn" aria-label="Return to timeline">
        ‹ RETURN TO TIMELINE
      </RouterLink>
      <button
        class="theme-quick-btn"
        @click="toggleTheme"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <span>{{ isDark ? '☀️ Clinical Light' : '🌙 Telemetry Dark' }}</span>
      </button>
    </div>

    <!-- Clinical Hero Record Banner -->
    <div class="detail-hero" :class="visit.status">
      <div class="hero-top-tag">
        <span>VISIT ADMINISTRATION RECORD</span>
        <span class="record-id">ID: VIS-{{ visit.id.toUpperCase() }}</span>
      </div>
      <div class="hero-center">
        <span class="d-emoji">{{ visit.emoji }}</span>
        <div class="hero-headings">
          <h1 class="d-title">{{ visit.ageLabel }} Visit</h1>
          <p class="d-sub">Target Cohort: {{ visit.ageGroup }} · ACIP Routine Immunization</p>
        </div>
        <StatusPill :status="visit.status" class="d-pill" />
      </div>
    </div>

    <!-- Clinical Parameters (Info Grid) -->
    <div class="info-row">
      <div class="ir-cell">
        <div class="ir-label">TARGET ADMINISTRATION DATE</div>
        <div class="ir-val">{{ fmtDate(visit.targetDate) }}</div>
      </div>
      <div class="ir-cell">
        <div class="ir-label">CURRENT CLINICAL STATUS</div>
        <div class="ir-val" :class="`text-${visit.status}`">{{ daysLabel(visit) }}</div>
      </div>
    </div>
    <div v-if="nextVisit" class="info-row">
      <div class="ir-cell">
        <div class="ir-label">SUBSEQUENT MILESTONE</div>
        <div class="ir-val">{{ nextVisit.emoji }} {{ nextVisit.ageLabel }}</div>
      </div>
      <div class="ir-cell">
        <div class="ir-label">PROJECTED DATE</div>
        <div class="ir-val">{{ fmtDate(nextVisit.targetDate) }}</div>
      </div>
    </div>

    <!-- Vaccines Administration Checklist -->
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">
            💉 Prescribed Vaccines & Formulations
            <span class="count-badge">{{ givenCount }} / {{ visit.vaccines.length }} GIVEN</span>
          </h2>
          <p class="section-hint">Select a vaccine entry to toggle verified administration status</p>
        </div>
      </div>

      <!-- Linear Clinical Progress Bar -->
      <div class="vax-progress-bar" role="progressbar"
           :aria-valuenow="givenCount" :aria-valuemax="visit.vaccines.length"
           :aria-label="`${givenCount} of ${visit.vaccines.length} vaccines given`">
        <div class="vax-progress-fill" :style="{ width: progressPct + '%' }"></div>
      </div>

      <!-- Vaccine rows (Square Medical Checkboxes) -->
      <div class="vaccine-list">
        <button
          v-for="vx in visit.vaccines"
          :key="vx.key"
          class="vaccine-row"
          :class="{ given: vx.given }"
          @click="handleToggle(vx.key)"
          :aria-pressed="vx.given"
          :aria-label="`${vaxInfo[vx.key]?.name} — ${vx.given ? 'administered, click to revert' : 'unadministered, click to mark administered'}`"
        >
          <!-- Square Medical Checkbox -->
          <div class="vr-check" :class="{ checked: vx.given }">
            <svg v-if="vx.given" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <span class="vr-icon">{{ vaxInfo[vx.key]?.icon }}</span>

          <div class="vr-body">
            <div class="vr-name">
              {{ vaxInfo[vx.key]?.name }}
              <span class="vr-abbr">[{{ vx.key }}]</span>
            </div>
            <div class="vr-desc">{{ vaxInfo[vx.key]?.desc }}</div>
            <Transition name="slide-down">
              <div v-if="vx.given && vx.dateGiven" class="vr-given">
                ✓ Recorded Administered on {{ fmtDate(vx.dateGiven) }}
              </div>
            </Transition>
          </div>

          <!-- Right Status Badge -->
          <div class="vr-status-wrap">
            <span class="vr-status-badge" :class="vx.given ? 'given' : (visit.status === 'overdue' ? 'missed' : 'pending')">
              {{ vx.given ? '✓ ADMINISTERED' : (visit.status === 'overdue' ? 'MISSED / OVERDUE' : 'PENDING') }}
            </span>
          </div>
        </button>
      </div>
    </section>

    <!-- Clinical Physician Note -->
    <div v-if="visit.note" class="note-box">
      <div class="note-tag">CLINICAL DIRECTIVE</div>
      <p class="note-body">📋 {{ visit.note }}</p>
    </div>

    <!-- Administration Actions -->
    <div v-if="visit.status !== 'done'" class="cta-wrap">
      <button class="cta-btn" @click="handleMarkAllDone">
        ✓ RECORD ALL VACCINES AS ADMINISTERED
      </button>
    </div>
    <div v-else class="done-banner">
      ✓ ALL PRESCRIBED VACCINES DOCUMENTED AS ADMINISTERED
    </div>
  </div>

  <!-- 404 Not Found -->
  <div v-else class="not-found">
    <div style="font-size:40px">🔍</div>
    <h2>Visit Record Not Found</h2>
    <RouterLink :to="{ name: 'home' }" class="back-btn">‹ Return to timeline</RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSchedule } from '@/composables/useSchedule.js'
import { useTheme } from '@/composables/useTheme.js'
import { fmtDate, daysLabel } from '@/composables/useFormatters.js'
import { VAX_INFO } from '@/data/vaccineInfo.js'
import StatusPill from '@/components/StatusPill.vue'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const { visits, getVisit, markVisitDone, toggleVaccine } = useSchedule()
const { toggleTheme, isDark } = useTheme()

const visit   = computed(() => getVisit(props.id))
const vaxInfo = VAX_INFO

const nextVisit = computed(() =>
  visits.find(v => v.status !== 'done' && v.targetDate > (visit.value?.targetDate ?? new Date())) ?? null
)

const givenCount  = computed(() => visit.value?.vaccines.filter(v => v.given).length ?? 0)
const progressPct = computed(() => {
  const total = visit.value?.vaccines.length ?? 1
  return Math.round((givenCount.value / total) * 100)
})

function handleToggle(vaxKey) {
  toggleVaccine(props.id, vaxKey)
}

function handleMarkAllDone() {
  markVisitDone(props.id)
}
</script>

<style scoped>
.detail-view {
  padding-bottom: 90px;
  container-type: inline-size;
  width: 100%;
}

/* ---- Topbar ---- */
.detail-topbar {
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border);
  padding: calc(var(--safe-top) + 12px) 20px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.back-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--clr-primary);
  padding: 6px 12px;
  border-radius: 0px;
  background: var(--clr-primary-light);
  border: 1px solid var(--clr-primary-border);
  transition: all .12s;
}
.back-btn:hover {
  background: var(--clr-surface);
  border-color: var(--clr-primary);
}

.theme-quick-btn {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  color: var(--clr-text);
  padding: 6px 12px;
  border-radius: 0px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all .12s ease;
}
.theme-quick-btn:hover {
  border-color: var(--clr-primary);
  color: var(--clr-primary);
}

/* ---- Hero Record Banner ---- */
.detail-hero {
  padding: 24px 20px;
  color: #fff;
  background: var(--clr-primary);
  border-bottom: 1px solid var(--clr-border);
}
.detail-hero.overdue  { background: #b91c1c; }
.detail-hero.due-soon { background: #b45309; }
.detail-hero.done     { background: #047857; }

.hero-top-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  opacity: 0.85;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.record-id { font-family: var(--font-mono); }

.hero-center {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.d-emoji { font-size: 38px; }
.hero-headings { flex: 1; min-width: 200px; }
.d-title { font-size: 24px; font-weight: 800; letter-spacing: -0.01em; }
.d-sub   { font-size: 12px; opacity: .88; margin-top: 2px; }
.d-pill  { background: rgba(255,255,255,.2) !important; color: #fff !important; border-color: rgba(255,255,255,.4) !important; }

/* ---- Info Table Rows ---- */
.info-row {
  display: grid; grid-template-columns: 1fr 1fr;
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border);
}
.ir-cell  { padding: 12px 20px; border-right: 1px solid var(--clr-border); }
.ir-cell:last-child { border-right: none; }
.ir-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--clr-text-subtle); margin-bottom: 2px; }
.ir-val   { font-size: 14px; font-weight: 800; color: var(--clr-text); font-family: var(--font-mono); }

/* ---- Section ---- */
.section { padding: 22px 16px 0; }
.section-header { margin-bottom: 12px; }
.section-title {
  font-size: 12px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--clr-text);
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 2px;
}
.section-hint { font-size: 11px; color: var(--clr-text-muted); }
.count-badge {
  background: var(--clr-primary-light); color: var(--clr-primary);
  border: 1px solid var(--clr-primary-border);
  border-radius: 0px; padding: 2px 7px; font-size: 10px; font-family: var(--font-mono);
}

/* ---- Progress Bar (Linear Flat) ---- */
.vax-progress-bar {
  height: 6px;
  background: var(--clr-border);
  border-radius: 0px;
  margin-bottom: 14px;
  overflow: hidden;
}
.vax-progress-fill {
  height: 100%;
  background: var(--clr-primary);
  border-radius: 0px;
  transition: width .3s ease;
}

/* ---- Vaccine Rows (Checklist) ---- */
.vaccine-list { display: flex; flex-direction: column; gap: 6px; }

.vaccine-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 0px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background .12s, border-color .12s;
  box-shadow: var(--shadow);
}
.vaccine-row.given { border-color: var(--clr-success-border); background: var(--clr-success-light); }
.vaccine-row:not(.given):hover {
  background: var(--clr-surface-muted);
  border-color: var(--clr-primary-border);
}
.vaccine-row:focus-visible { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

/* Square Medical Checkbox */
.vr-check {
  width: 22px; height: 22px;
  border-radius: 0px;
  border: 2px solid var(--clr-border-strong);
  display: grid; place-items: center;
  flex-shrink: 0;
  transition: background .15s, border-color .15s;
  background: var(--clr-surface);
}
.vr-check.checked {
  background: var(--clr-success);
  border-color: var(--clr-success);
  color: #fff;
}
.vr-check svg { width: 14px; height: 14px; }

.vr-icon  { font-size: 20px; flex-shrink: 0; }
.vr-body  { flex: 1; min-width: 0; }
.vr-name  { font-size: 13px; font-weight: 800; color: var(--clr-text); }
.vr-abbr  { font-size: 11px; font-family: var(--font-mono); color: var(--clr-primary); font-weight: 700; margin-left: 4px; }
.vr-desc  { font-size: 11px; color: var(--clr-text-muted); line-height: 1.4; margin-top: 1px; }
.vr-given { font-size: 11px; color: var(--clr-success-text); margin-top: 4px; font-weight: 700; }

.vr-status-wrap { flex-shrink: 0; }
.vr-status-badge {
  display: inline-block;
  font-size: 10px; font-weight: 800;
  padding: 3px 8px; border-radius: 0px;
  text-transform: uppercase; letter-spacing: .06em;
  font-family: var(--font-mono);
  white-space: nowrap;
}
.vr-status-badge.given   { background: var(--clr-success-light);  color: var(--clr-success-text); border: 1px solid var(--clr-success-border); }
.vr-status-badge.pending { background: var(--clr-upcoming-light); color: var(--clr-upcoming-text); border: 1px solid var(--clr-upcoming-border); }
.vr-status-badge.missed  { background: var(--clr-danger-light);   color: var(--clr-danger-text); border: 1px solid var(--clr-danger-border); }

/* Slide-down transition */
.slide-down-enter-active { transition: all .2s ease; }
.slide-down-leave-active { transition: all .15s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-3px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-3px); }

/* ---- Note Box ---- */
.note-box {
  margin: 16px 16px 0;
  background: var(--clr-card-due-soon-bg);
  border: 1px solid var(--clr-card-due-soon-border);
  border-radius: 0px;
  padding: 12px 16px;
}
.note-tag  { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--clr-warning-text); margin-bottom: 2px; }
.note-body { font-size: 12px; color: var(--clr-warning-text); line-height: 1.5; font-weight: 600; }

/* ---- Action Buttons ---- */
.cta-wrap { padding: 20px 16px; }
.cta-btn {
  width: 100%; padding: 14px;
  background: var(--clr-primary); color: #fff;
  border: 1px solid var(--clr-primary-hover);
  border-radius: 0px;
  font-size: 13px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.08em;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: var(--shadow);
  transition: background .12s;
}
.cta-btn:hover { background: var(--clr-primary-hover); }

.done-banner {
  margin: 20px 16px;
  background: var(--clr-card-done-bg);
  border: 1px solid var(--clr-card-done-border);
  border-radius: 0px;
  padding: 14px 16px;
  font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--clr-success-text);
  text-align: center;
}

.not-found {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 14px; min-height: 50dvh;
  text-align: center; padding: 24px;
}

/* ---- Container queries ---- */
@container (min-width: 600px) {
  .detail-topbar { padding: 14px 32px; }
  .detail-hero   { padding: 28px 32px; }
  .section       { padding: 24px 32px 0; }
  .note-box      { margin: 16px 32px 0; }
  .cta-wrap      { padding: 24px 32px; }
  .done-banner   { margin: 20px 32px; }
  .vaccine-list  { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
}

@container (min-width: 1200px) {
  .detail-topbar { padding: 16px 40px; }
  .detail-hero   { padding: 32px 40px; }
  .section       { padding: 26px 40px 0; }
  .note-box      { margin: 18px 40px 0; }
  .cta-wrap      { padding: 26px 40px; }
  .done-banner   { margin: 24px 40px; }
  .vaccine-list  { grid-template-columns: repeat(3, 1fr); gap: 10px; }
}
</style>
