<template>
  <div class="tl-item" @click="$emit('open')" @keydown.enter="$emit('open')" tabindex="0" role="listitem">
    <!-- Left: dot + line -->
    <div class="tl-left">
      <div class="tl-dot" :class="visit.status" aria-hidden="true">{{ visit.emoji }}</div>
      <div v-if="!isLast" class="tl-line"></div>
    </div>

    <!-- Right: age pill + card -->
    <div class="tl-right">
      <div class="tl-age-pill">{{ visit.ageGroup }}</div>
      <div class="tl-card" :class="visit.status">
        <div class="tl-card-header">
          <span class="tl-card-title">{{ visit.emoji }} {{ visit.ageLabel }}</span>
          <StatusPill :status="visit.status" />
        </div>
        <div class="tl-card-meta">
          <span>📅 {{ fmtDate(visit.targetDate) }}</span>
          <span>⏱️ {{ daysLabel(visit) }}</span>
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
        <div v-if="visit.note" class="tl-note">💡 {{ visit.note }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fmtDate, daysLabel } from '@/composables/useFormatters.js'
import StatusPill  from '@/components/StatusPill.vue'
import VaccineChip from '@/components/VaccineChip.vue'

defineProps({
  visit:  { type: Object, required: true },
  isLast: { type: Boolean, default: false },
})
defineEmits(['open'])
</script>

<style scoped>
.tl-item {
  display: flex;
  gap: 14px;
  cursor: pointer;
  outline: none;
}
.tl-item:focus-visible .tl-card { outline: 2px solid var(--clr-primary); outline-offset: 2px; }

.tl-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 38px; }
.tl-dot {
  width: 38px; height: 38px;
  border-radius: 50%;
  display: grid; place-items: center;
  font-size: 18px;
  border: 2.5px solid;
  flex-shrink: 0;
  position: relative; z-index: 1;
}
.tl-dot.done     { background: var(--clr-success-light);  border-color: var(--clr-success); }
.tl-dot.upcoming { background: var(--clr-upcoming-light); border-color: var(--clr-upcoming); }
.tl-dot.overdue  { background: var(--clr-danger-light);   border-color: var(--clr-danger); }
.tl-dot.due-soon { background: var(--clr-warning-light);  border-color: var(--clr-warning); }
.tl-line { flex: 1; width: 2px; background: var(--clr-border); margin: 2px 0; min-height: 16px; }

.tl-right { flex: 1; padding-bottom: 18px; }
.tl-age-pill {
  display: inline-block;
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .06em;
  background: var(--clr-primary-light); color: var(--clr-primary);
  border-radius: 100px; padding: 2px 10px; margin-bottom: 8px;
}
.tl-card {
  background: var(--clr-surface);
  border: 1.5px solid var(--clr-border);
  border-radius: var(--radius);
  padding: 14px 16px;
  box-shadow: var(--shadow);
  transition: transform .15s, box-shadow .15s;
  border-left-width: 4px;
}
.tl-card:hover  { transform: translateY(-1px); box-shadow: var(--shadow-card); }
.tl-card:active { transform: scale(.98); box-shadow: none; }
.tl-card.done     { border-left-color: var(--clr-success); }
.tl-card.upcoming { border-left-color: var(--clr-upcoming); }
.tl-card.overdue  { border-left-color: var(--clr-danger); }
.tl-card.due-soon { border-left-color: var(--clr-warning); }

.tl-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
.tl-card-title  { font-size: 15px; font-weight: 700; }
.tl-card-meta   { font-size: 12px; color: var(--clr-text-muted); display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
.tl-chips       { display: flex; flex-wrap: wrap; gap: 6px; }
.tl-note {
  margin-top: 10px;
  font-size: 12px; color: var(--clr-text-muted);
  background: var(--clr-bg);
  border-radius: var(--radius-sm);
  padding: 8px 10px; line-height: 1.5;
}
</style>
