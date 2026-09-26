<template>
  <div class="ring-wrap" :style="{ width: size + 'px', height: size + 'px' }" :aria-label="`${pct}% of vaccinations completed`" role="img">
    <svg :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size" style="transform:rotate(-90deg)">
      <circle class="ring-bg"  :cx="c" :cy="c" :r="r" :stroke-width="stroke" />
      <circle class="ring-val" :cx="c" :cy="c" :r="r" :stroke-width="stroke"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        style="transition: stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)" />
    </svg>
    <div class="ring-text">
      <span class="ring-pct">{{ pct }}%</span>
      <span class="ring-lbl">Done</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  pct:    { type: Number, required: true },
  size:   { type: [Number, String], default: 90 },
  stroke: { type: [Number, String], default: 7 },
})
const c = computed(() => Number(props.size) / 2)
const r = computed(() => c.value - Number(props.stroke))
const circumference = computed(() => 2 * Math.PI * r.value)
const offset = computed(() => circumference.value - (props.pct / 100) * circumference.value)
</script>

<style scoped>
.ring-wrap { position: relative; flex-shrink: 0; }
.ring-bg   { fill: none; stroke: var(--clr-primary-light); }
.ring-val  { fill: none; stroke: var(--clr-primary); stroke-linecap: butt; }
.ring-text {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.ring-pct { font-size: 16px; font-weight: 800; color: var(--clr-primary); line-height: 1; font-family: var(--font-mono); }
.ring-lbl { font-size: 9px; color: var(--clr-text-muted); font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
</style>
