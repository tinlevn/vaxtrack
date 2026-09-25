<template>
  <span class="status-pill" :class="status">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { statusLabel } from '@/composables/useFormatters.js'
const props = defineProps({ status: { type: String, required: true } })
const label = computed(() => statusLabel(props.status))
</script>
