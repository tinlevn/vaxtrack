<template>
  <!-- DESKTOP SNAKE MODE -->
  <div
    v-if="mode === 'snake'"
    class="tl-snake-card"
    :class="visit.status"
    @click="$emit('open')"
    @keydown.enter="$emit('open')"
    tabindex="0"
    role="listitem"
    :aria-label="`Visit #${pad(seqNumber)}: ${visit.ageLabel}, ${visit.status}`"
  >
    <!-- Top Header: Milestone Sequence Badge + Title + Status Pill -->
    <div class="sc-header">
      <div class="sc-anchor-badge" :class="visit.status">
        <span class="sc-seq">#{{ pad(seqNumber) }}</span>
        <span class="sc-emoji">{{ visit.emoji }}</span>
      </div>
      <div class="sc-title-block">
        <div class="sc-visit-name">{{ visit.ageLabel }}</div>
        <div class="sc-cohort-tag">{{ visit.ageGroup }}</div>
      </div>
      <div class="sc-status">
        <StatusPill :status="visit.status" />
      </div>
    </div>

    <!-- Target Date and Days Remaining -->
    <div class="sc-meta-row">
      <span class="sc-meta-date">📅 {{ fmtDate(visit.targetDate) }}</span>
      <span class="sc-meta-days" :class="visit.status">⏱️ {{ daysLabel(visit) }}</span>
    </div>

    <!-- Vaccine Dose Chips -->
    <div class="sc-chips">
      <VaccineChip
        v-for="vx in visit.vaccines"
        :key="vx.key"
        :vaxKey="vx.key"
        :given="vx.given"
        :overdue="visit.status === 'overdue'"
      />
    </div>

    <!-- Medical Note (if any) -->
    <div v-if="visit.note" class="sc-note">
      <span class="sc-note-icon">📋</span>
      <span class="sc-note-text">{{ visit.note }}</span>
    </div>
  </div>

  <!-- MOBILE VERTICAL MODE -->
  <div
    v-else
    class="tl-item"
    @click="$emit('open')"
    @keydown.enter="$emit('open')"
    tabindex="0"
    role="listitem"
    :aria-label="`Visit #${pad(seqNumber)}: ${visit.ageLabel}, ${visit.status}`"
  >
    <!-- Left: square clinical milestone badge with sequence number + line -->
    <div class="tl-left">
      <div class="tl-dot" :class="visit.status" aria-hidden="true">
        <span class="tl-dot-seq">#{{ pad(seqNumber) }}</span>
      </div>
      <div v-if="!isLast" class="tl-line"></div>
    </div>

    <!-- Right: clinical age tag + squared record card -->
    <div class="tl-right">
      <div class="tl-age-pill">{{ visit.ageGroup }} · VISIT #{{ pad(seqNumber) }}</div>
      <div class="tl-card" :class="visit.status">
        <div class="tl-card-header">
          <span class="tl-card-title">{{ visit.emoji }} {{ visit.ageLabel }}</span>
          <StatusPill :status="visit.status" />
        </div>
        <div class="tl-card-meta">
          <span>📅 {{ fmtDate(visit.targetDate) }}</span>
          <span :class="visit.status">⏱️ {{ daysLabel(visit) }}</span>
        </div>
        <div class="tl-chips">
          <VaccineChip
            v-for="vx in visit.vaccines"
            :key="vx.key"
            :vaxKey="vx.key"
            :given="vx.given"
            :overdue="visit.status === 'overdue'"
          />
        </div>
        <div v-if="visit.note" class="tl-note">📋 {{ visit.note }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fmtDate, daysLabel } from '@/composables/useFormatters.js'
import StatusPill from '@/components/StatusPill.vue'
import VaccineChip from '@/components/VaccineChip.vue'

defineProps({
  visit: { type: Object, required: true },
  seqNumber: { type: Number, default: 1 },
  mode: { type: String, default: 'vertical' },
  isLast: { type: Boolean, default: false },
  flowDirection: { type: String, default: 'right' },
})
defineEmits(['open'])

const pad = (n) => String(n).padStart(2, '0')
</script>

<style scoped>
/* ==========================================================================
   DESKTOP SNAKE CARD STYLING
   Strictly rectangular, status-tinted background, zero left-side border
   ========================================================================== */
.tl-snake-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 0px;
  padding: 8px 10px;
  box-shadow: var(--shadow);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
  outline: none;
  position: relative;
}
.tl-snake-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: var(--clr-border-strong);
}
.tl-snake-card:focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}
.tl-snake-card:active {
  transform: scale(0.995);
}

/* Full card background colors by status */
.tl-snake-card.done {
  background: var(--clr-card-done-bg);
  border-color: var(--clr-card-done-border);
}
.tl-snake-card.upcoming {
  background: var(--clr-card-upcoming-bg);
  border-color: var(--clr-card-upcoming-border);
}
.tl-snake-card.overdue {
  background: var(--clr-card-overdue-bg);
  border-color: var(--clr-card-overdue-border);
}
.tl-snake-card.due-soon {
  background: var(--clr-card-due-soon-bg);
  border-color: var(--clr-card-due-soon-border);
}

/* Header & Milestone Anchor */
.sc-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}
.sc-anchor-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  padding: 1px 5px;
  border-radius: 0px;
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 11px;
  letter-spacing: -0.02em;
  box-shadow: var(--shadow);
  flex-shrink: 0;
}
.sc-anchor-badge.done {
  background: var(--clr-success-light);
  border-color: var(--clr-success);
  color: var(--clr-success-text);
}
.sc-anchor-badge.overdue {
  background: var(--clr-danger-light);
  border-color: var(--clr-danger);
  color: var(--clr-danger-text);
}
.sc-anchor-badge.due-soon {
  background: var(--clr-warning-light);
  border-color: var(--clr-warning);
  color: var(--clr-warning-text);
}
.sc-anchor-badge.upcoming {
  background: var(--clr-upcoming-light);
  border-color: var(--clr-upcoming);
  color: var(--clr-upcoming-text);
}
.sc-seq {
  font-weight: 900;
}
.sc-emoji {
  font-size: 12px;
}

.sc-title-block {
  flex: 1;
  min-width: 0;
}
.sc-visit-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--clr-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.sc-cohort-tag {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--clr-text-muted);
  line-height: 1.1;
}
.sc-status {
  flex-shrink: 0;
}

/* Metadata */
.sc-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--clr-text-muted);
  margin-bottom: 5px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
:root[data-theme="dark"] .sc-meta-row {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}
.sc-meta-days.overdue  { color: var(--clr-danger-text); font-weight: 800; }
.sc-meta-days.due-soon { color: var(--clr-warning-text); font-weight: 800; }
.sc-meta-days.done     { color: var(--clr-success-text); }

/* Chips */
.sc-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  flex: 1;
  align-content: flex-start;
}
.sc-chips :deep(.chip) {
  padding: 1px 5px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
}

/* Note */
.sc-note {
  margin-top: 5px;
  font-size: 10px;
  line-height: 1.35;
  color: var(--clr-text-muted);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.07);
  padding: 3px 6px;
  display: flex;
  gap: 4px;
  border-radius: 0px;
}
:root[data-theme="dark"] .sc-note {
  background: rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.08);
}
.sc-note-icon {
  flex-shrink: 0;
  font-size: 11px;
}

/* ==========================================================================
   MOBILE VERTICAL TIMELINE STYLING
   ========================================================================== */
.tl-item {
  display: flex;
  gap: 14px;
  cursor: pointer;
  outline: none;
}
.tl-item:focus-visible .tl-card { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

.tl-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 44px; }
.tl-dot {
  width: 44px; height: 36px;
  border-radius: 0px;
  display: grid; place-items: center;
  font-size: 11px;
  font-weight: 900;
  font-family: var(--font-mono);
  border: 1.5px solid;
  flex-shrink: 0;
  position: relative; z-index: 1;
  box-shadow: var(--shadow);
}
.tl-dot.done     { background: var(--clr-success-light);  border-color: var(--clr-success); color: var(--clr-success-text); }
.tl-dot.upcoming { background: var(--clr-upcoming-light); border-color: var(--clr-upcoming); color: var(--clr-upcoming-text); }
.tl-dot.overdue  { background: var(--clr-danger-light);   border-color: var(--clr-danger); color: var(--clr-danger-text); }
.tl-dot.due-soon { background: var(--clr-warning-light);  border-color: var(--clr-warning); color: var(--clr-warning-text); }
.tl-line { flex: 1; width: 2px; background: var(--clr-border); margin: 2px 0; min-height: 18px; }

.tl-right { flex: 1; min-width: 0; padding-bottom: 20px; }
.tl-age-pill {
  display: inline-block;
  font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: .08em;
  background: var(--clr-surface); color: var(--clr-text-muted);
  border: 1px solid var(--clr-border);
  border-radius: 0px; padding: 2px 8px; margin-bottom: 6px;
}
.tl-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 0px;
  padding: 14px 16px;
  box-shadow: var(--shadow);
  transition: transform .12s, box-shadow .12s, border-color .12s, background-color .12s;
}
.tl-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}
.tl-card:active { transform: scale(.99); }

/* Full card background colors by status */
.tl-card.done     { background: var(--clr-card-done-bg);     border-color: var(--clr-card-done-border); }
.tl-card.upcoming { background: var(--clr-card-upcoming-bg); border-color: var(--clr-card-upcoming-border); }
.tl-card.overdue  { background: var(--clr-card-overdue-bg);  border-color: var(--clr-card-overdue-border); }
.tl-card.due-soon { background: var(--clr-card-due-soon-bg); border-color: var(--clr-card-due-soon-border); }

.tl-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
.tl-card-title  { font-size: 15px; font-weight: 800; color: var(--clr-text); }
.tl-card-meta   { font-size: 12px; color: var(--clr-text-muted); display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 10px; font-weight: 500; }
.tl-chips       { display: flex; flex-wrap: wrap; gap: 6px; }
.tl-note {
  margin-top: 10px;
  font-size: 12px; color: var(--clr-text-muted);
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0px;
  padding: 8px 10px; line-height: 1.5;
}
:root[data-theme="dark"] .tl-note {
  background: rgba(0, 0, 0, 0.28);
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
