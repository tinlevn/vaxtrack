<template>
  <div class="info-view">
    <div class="view-header">
      <div class="header-left">
        <div class="header-pretitle">CLINICAL REFERENCE GUIDE</div>
        <h1 class="view-title">📖 Vaccine Pharmacopeia & Glossary</h1>
        <p class="view-sub">Pediatric vaccine formulations, target diseases, and clinical administration guidance</p>
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

    <section class="info-section">
      <h2 class="section-title">CLINICAL IMMUNIZATION PROTOCOLS</h2>
      <div class="info-grid">
        <div class="info-card" v-for="tip in tips" :key="tip.title">
          <div class="ic-title">{{ tip.icon }} {{ tip.title }}</div>
          <div class="ic-body">{{ tip.body }}</div>
        </div>
      </div>
    </section>

    <section class="info-section">
      <h2 class="section-title">VACCINE ABBREVIATION DIRECTORY & ETIOLOGY</h2>
      <div class="abbrev-grid">
        <div class="abbrev-card" v-for="(info, key) in VAX_INFO" :key="key">
          <div class="ac-key">{{ key }}</div>
          <div class="ac-icon">{{ info.icon }}</div>
          <div class="ac-name">{{ info.name }}</div>
          <div class="ac-desc">{{ info.desc }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { VAX_INFO } from '@/data/vaccineInfo.js'
import { useTheme } from '@/composables/useTheme.js'

const { toggleTheme, isDark } = useTheme()

const tips = [
  { icon: '🛡️', title: 'Mechanism of Action', body: "Vaccines stimulate adaptive immunity by exposing the child's immune system to harmless antigens, establishing antigen-specific immunological memory." },
  { icon: '⏱️', title: 'Critical Interval Timing', body: "Immunization schedules are calibrated to the earliest age when maternal antibodies wane and the infant's immune system mounts a protective response." },
  { icon: '🌡️', title: 'Post-Immunization Observation', body: "Expected mild physiological responses include low-grade fever, localized erythema, and transient fussiness resolving within 24–48 hours." },
  { icon: '🚨', title: 'Adverse Event Protocol', body: "Prompt clinical evaluation is indicated for temperatures exceeding 39°C (102°F), inconsolable crying >3 hours, or acute hypersensitivity symptoms." },
  { icon: '🏛️', title: 'Regulatory Standard', body: "Guidelines harmonized with CDC/ACIP Advisory Committee on Immunization Practices and AAP recommendations for ages 0–5." },
]
</script>

<style scoped>
.info-view {
  padding-bottom: 90px;
  container-type: inline-size;
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

.info-section { padding: 22px 16px 0; }
.section-title {
  font-size: 11px; font-weight: 800; color: var(--clr-text-muted);
  margin-bottom: 12px; padding-bottom: 8px;
  border-bottom: 1px solid var(--clr-border);
  text-transform: uppercase; letter-spacing: .08em;
}

.info-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
.info-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 0px;
  padding: 14px 16px;
  box-shadow: var(--shadow);
  transition: border-color .12s, transform .1s;
}
.info-card:hover {
  border-color: var(--clr-primary-border);
  transform: translateY(-1px);
}
.ic-title { font-size: 14px; font-weight: 800; margin-bottom: 6px; color: var(--clr-text); }
.ic-body  { font-size: 12px; color: var(--clr-text-muted); line-height: 1.55; }

.abbrev-grid { display: flex; flex-direction: column; gap: 8px; padding-bottom: 24px; }
.abbrev-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 0px;
  padding: 12px 14px;
  display: grid;
  grid-template-columns: 60px 28px 1fr;
  grid-template-rows: auto auto;
  gap: 2px 10px;
  align-items: center;
  box-shadow: var(--shadow);
  transition: border-color .12s, transform .1s;
}
.abbrev-card:hover {
  border-color: var(--clr-primary-border);
  transform: translateY(-1px);
}
.ac-key  {
  font-size: 11px;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--clr-primary);
  grid-row: 1 / 3;
  background: var(--clr-primary-light);
  border: 1px solid var(--clr-primary-border);
  padding: 4px 6px;
  text-align: center;
  border-radius: 0px;
}
.ac-icon { font-size: 18px; }
.ac-name { font-size: 13px; font-weight: 800; color: var(--clr-text); }
.ac-desc { font-size: 11px; color: var(--clr-text-muted); grid-column: 3; line-height: 1.45; }

@container (min-width: 600px) {
  .view-header  { padding: 26px 32px 20px; }
  .view-title   { font-size: 24px; }
  .info-section { padding: 24px 32px 0; }
  .info-grid    { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .abbrev-grid  { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
}

@container (min-width: 1200px) {
  .view-header  { padding: 30px 40px 24px; }
  .info-section { padding: 28px 40px 0; }
  .info-grid    { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .abbrev-grid  { grid-template-columns: repeat(3, 1fr); gap: 12px; }
}

@container (min-width: 1750px) {
  .info-grid    { grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .abbrev-grid  { grid-template-columns: repeat(4, 1fr); gap: 12px; }
}
</style>
