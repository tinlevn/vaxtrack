<template>
  <span class="chip" :class="chipClass">
    {{ icon }} {{ vaxKey }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { VAX_INFO } from '@/data/vaccineInfo.js'
const props = defineProps({
  vaxKey:  { type: String, required: true },
  given:   { type: Boolean, required: true },
  overdue: { type: Boolean, default: false },
})
const icon     = computed(() => VAX_INFO[props.vaxKey]?.icon ?? '💉')
const chipClass = computed(() => {
  if (props.given)   return 'given'
  if (props.overdue) return 'missed'
  return 'pending'
})
</script>
