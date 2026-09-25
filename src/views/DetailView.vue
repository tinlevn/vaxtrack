<template>
  <div v-if="visit" class="detail-view">
    <!-- Back button -->
    <div class="detail-topbar">
      <RouterLink :to="{ name: 'home' }" class="back-btn" aria-label="Back to timeline">
        ‹ Back
      </RouterLink>
    </div>

    <!-- Hero — colour shifts by status -->
    <div class="detail-hero" :class="visit.status">
      <span class="d-emoji">{{ visit.emoji }}</span>
      <div class="d-age-label">Vaccination Visit</div>
      <h1 class="d-title">{{ visit.ageLabel }}</h1>
      <StatusPill :status="visit.status" class="d-pill" />
    </div>

    <!-- Info rows -->
    <div class="info-row">
      <div class="ir-cell">
        <div class="ir-label">📅 Scheduled</div>
        <div class="ir-val">{{ fmtDate(visit.targetDate) }}</div>
      </div>
      <div class="ir-cell">
        <div class="ir-label">⏱️ Status</div>
        <div class="ir-val" :class="`text-${visit.status}`">{{ daysLabel(visit) }}</div>
      </div>
    </div>
    <div v-if="nextVisit" class="info-row">
      <div class="ir-cell">
        <div class="ir-label">⏭️ Next Visit</div>
        <div class="ir-val">{{ nextVisit.emoji }} {{ nextVisit.ageLabel }}</div>
      </div>
      <div class="ir-cell">
        <div class="ir-label">📆 Next Date</div>
        <div class="ir-val">{{ fmtDate(nextVisit.targetDate) }}</div>
      </div>
    </div>

    <!-- Vaccines section -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">
          💉 Vaccines at this visit
          <span class="count-badge">{{ givenCount }}/{{ visit.vaccines.length }}</span>
        </h2>
        <p class="section-hint">Tap a vaccine to toggle its status</p>
      </div>

      <!-- Progress bar -->
      <div class="vax-progress-bar" role="progressbar"
           :aria-valuenow="givenCount" :aria-valuemax="visit.vaccines.length"
           :aria-label="`${givenCount} of ${visit.vaccines.length} vaccines given`">
        <div class="vax-progress-fill" :style="{ width: progressPct + '%' }"></div>
      </div>

      <!-- Vaccine rows — each is a toggle -->
      <div class="vaccine-list">
        <button
          v-for="vx in visit.vaccines"
          :key="vx.key"
          class="vaccine-row"
          :class="{ given: vx.given }"
          @click="handleToggle(vx.key)"
          :aria-pressed="vx.given"
          :aria-label="`${vaxInfo[vx.key]?.name} — ${vx.given ? 'given, click to undo' : 'not given, click to mark as given'}`"
        >
          <!-- Checkbox visual -->
          <div class="vr-check" :class="{ checked: vx.given }">
            <svg v-if="vx.given" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <span class="vr-icon">{{ vaxInfo[vx.key]?.icon }}</span>

          <div class="vr-body">
            <div class="vr-name">
              {{ vaxInfo[vx.key]?.name }}
              <span class="vr-abbr">({{ vx.key }})</span>
            </div>
            <div class="vr-desc">{{ vaxInfo[vx.key]?.desc }}</div>
            <Transition name="slide-down">
              <div v-if="vx.given && vx.dateGiven" class="vr-given">
                ✅ Given on {{ fmtDate(vx.dateGiven) }}
              </div>
            </Transition>
          </div>

          <!-- Right status -->
          <div class="vr-status-wrap">
            <span class="vr-status-badge" :class="vx.given ? 'given' : (visit.status === 'overdue' ? 'missed' : 'pending')">
              {{ vx.given ? '✓ Given' : (visit.status === 'overdue' ? 'Missed' : 'Pending') }}
            </span>
          </div>
        </button>
      </div>
    </section>

    <!-- Note box -->
    <div v-if="visit.note" class="note-box">
      <span class="note-icon">💡</span>
      <p>{{ visit.note }}</p>
    </div>

    <!-- Mark all done CTA (only when not all given) -->
    <div v-if="visit.status !== 'done'" class="cta-wrap">
      <button class="cta-btn" @click="handleMarkAllDone">
        ✅ Mark All as Given
      </button>
    </div>
    <div v-else class="done-banner">
      ✅ All vaccines given — great job, parent! 🎉
    </div>
  </div>

  <!-- 404 -->
  <div v-else class="not-found">
    <div style="font-size:48px">🔍</div>
    <h2>Visit not found</h2>
    <RouterLink :to="{ name: 'home' }" class="back-btn">← Back to timeline</RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSchedule } from '@/composables/useSchedule.js'
import { fmtDate, daysLabel } from '@/composables/useFormatters.js'
import { VAX_INFO } from '@/data/vaccineInfo.js'
import StatusPill from '@/components/StatusPill.vue'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const { visits, getVisit, markVisitDone, toggleVaccine } = useSchedule()

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
}

/* ---- Back bar ---- */
.detail-topbar {
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border);
  padding: calc(var(--safe-top) + 10px) 20px 10px;
}
.back-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 14px; font-weight: 600;
  color: var(--clr-primary);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  background: var(--clr-primary-light);
  transition: opacity .15s;
}
.back-btn:hover { opacity: .8; }

/* ---- Hero ---- */
.detail-hero {
  padding: 28px 24px;
  text-align: center;
  color: #fff;
  background: linear-gradient(145deg, var(--clr-primary), #a78bfa);
}
.detail-hero.overdue  { background: linear-gradient(145deg, var(--clr-danger),  #fb923c); }
.detail-hero.due-soon { background: linear-gradient(145deg, var(--clr-warning), #fbbf24); }
.detail-hero.done     { background: linear-gradient(145deg, var(--clr-success), #4ade80); }
.d-emoji     { font-size: 52px; display: block; margin-bottom: 10px; }
.d-age-label { font-size: 11px; opacity: .8; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
.d-title     { font-size: 26px; font-weight: 800; margin-bottom: 12px; }
.d-pill { background: rgba(255,255,255,.22) !important; color: #fff !important; }

/* ---- Info rows ---- */
.info-row {
  display: grid; grid-template-columns: 1fr 1fr;
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border);
}
.ir-cell  { padding: 14px 20px; border-right: 1px solid var(--clr-border); }
.ir-cell:last-child { border-right: none; }
.ir-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--clr-text-muted); margin-bottom: 4px; }
.ir-val   { font-size: 15px; font-weight: 700; }

/* ---- Section ---- */
.section { padding: 20px 16px 0; }
.section-header { margin-bottom: 10px; }
.section-title {
  font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .07em;
  color: var(--clr-text-muted);
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 2px;
}
.section-hint { font-size: 12px; color: var(--clr-text-muted); }
.count-badge {
  background: var(--clr-primary-light); color: var(--clr-primary);
  border-radius: 100px; padding: 2px 9px; font-size: 11px;
}

/* ---- Progress bar ---- */
.vax-progress-bar {
  height: 6px;
  background: var(--clr-border);
  border-radius: 100px;
  margin-bottom: 14px;
  overflow: hidden;
}
.vax-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--clr-primary), var(--clr-success));
  border-radius: 100px;
  transition: width .4s cubic-bezier(.4,0,.2,1);
}

/* ---- Vaccine rows (toggle buttons) ---- */
.vaccine-list { display: flex; flex-direction: column; gap: 8px; }

.vaccine-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  text-align: left;
  background: var(--clr-surface);
  border: 1.5px solid var(--clr-border);
  border-radius: var(--radius);
  padding: 14px 16px;
  cursor: pointer;
  transition: background .15s, border-color .15s, transform .12s;
  position: relative;
  overflow: hidden;
}
.vaccine-row::after {
  content: '';
  position: absolute; inset: 0;
  background: var(--clr-success);
  opacity: 0;
  transition: opacity .2s;
  pointer-events: none;
}
.vaccine-row.given { border-color: var(--clr-success); background: var(--clr-success-light); }
.vaccine-row:not(.given):hover { background: var(--clr-bg); border-color: var(--clr-primary); }
.vaccine-row:active { transform: scale(.98); }
.vaccine-row:focus-visible { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

/* Checkbox circle */
.vr-check {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 2.5px solid var(--clr-border);
  display: grid; place-items: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: background .2s, border-color .2s;
  background: #fff;
}
.vr-check.checked {
  background: var(--clr-success);
  border-color: var(--clr-success);
  color: #fff;
}
.vr-check svg { width: 14px; height: 14px; }

.vr-icon  { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
.vr-body  { flex: 1; min-width: 0; }
.vr-name  { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
.vr-abbr  { font-size: 11px; color: var(--clr-text-muted); font-weight: 400; }
.vr-desc  { font-size: 12px; color: var(--clr-text-muted); line-height: 1.4; }
.vr-given { font-size: 11px; color: var(--clr-success); margin-top: 5px; font-weight: 600; }

.vr-status-wrap { flex-shrink: 0; align-self: flex-start; }
.vr-status-badge {
  display: inline-block;
  font-size: 11px; font-weight: 700;
  padding: 3px 9px; border-radius: 100px;
  text-transform: uppercase; letter-spacing: .04em;
  white-space: nowrap;
}
.vr-status-badge.given   { background: var(--clr-success-light);  color: #15803d; }
.vr-status-badge.pending { background: var(--clr-upcoming-light); color: #1d4ed8; }
.vr-status-badge.missed  { background: var(--clr-danger-light);   color: #b91c1c; }

/* Slide-down transition for "given on" date */
.slide-down-enter-active { transition: all .25s ease; }
.slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-4px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-4px); }

/* ---- Note box ---- */
.note-box {
  margin: 16px 16px 0;
  background: var(--clr-warning-light);
  border: 1.5px solid var(--clr-warning);
  border-radius: var(--radius);
  padding: 14px 16px;
  display: flex; gap: 10px;
  font-size: 13px; color: #92400e; line-height: 1.5;
}
.note-icon { font-size: 20px; flex-shrink: 0; }

/* ---- CTA ---- */
.cta-wrap { padding: 20px 16px; }
.cta-btn {
  width: 100%; padding: 16px;
  background: var(--clr-primary); color: #fff;
  border: none; border-radius: var(--radius);
  font-size: 16px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: opacity .15s, transform .12s;
}
.cta-btn:hover  { opacity: .88; }
.cta-btn:active { transform: scale(.97); }

.done-banner {
  margin: 20px 16px;
  background: var(--clr-success-light);
  border: 1.5px solid var(--clr-success);
  border-radius: var(--radius);
  padding: 14px 16px;
  font-size: 14px; font-weight: 600; color: #15803d;
  text-align: center;
}

.not-found {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px; min-height: 60dvh;
  text-align: center; padding: 24px;
}

/* ---- Container queries ---- */
@container (min-width: 600px) {
  .detail-topbar { padding: 16px 32px; }
  .detail-hero   { padding: 36px 32px; }
  .section       { padding: 24px 32px 0; }
  .note-box      { margin: 16px 32px 0; }
  .cta-wrap      { padding: 24px 32px; }
  .done-banner   { margin: 20px 32px; }
  .vaccine-list  { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
}
</style>
