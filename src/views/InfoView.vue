<template>
  <div class="info-view">
    <div class="view-header">
      <h1 class="view-title">ℹ️ Vaccine Info</h1>
      <p class="view-sub">Learn about the vaccines protecting your baby</p>
    </div>

    <section class="info-section">
      <h2 class="section-title">📢 Why Vaccines Matter</h2>
      <div class="info-grid">
        <div class="info-card" v-for="tip in tips" :key="tip.title">
          <div class="ic-title">{{ tip.icon }} {{ tip.title }}</div>
          <div class="ic-body">{{ tip.body }}</div>
        </div>
      </div>
    </section>

    <section class="info-section">
      <h2 class="section-title">💉 Vaccine Abbreviations</h2>
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

const tips = [
  { icon: '🛡️', title: 'What is vaccination?',   body: "Vaccines train your baby's immune system to fight diseases before they're exposed. They are one of the safest and most effective health tools available." },
  { icon: '🕐', title: 'Why timing matters',       body: "Vaccines are given at specific ages because that's when babies are most vulnerable and when their immune systems respond best. Keeping to the schedule is important." },
  { icon: '🌡️', title: 'After the shot',           body: "It's normal for your baby to have a sore arm, mild fever, or be fussier than usual for a day or two. This is a sign the immune system is responding." },
  { icon: '📞', title: 'When to call the doctor', body: "Call your doctor if your baby has a fever above 39°C (102°F), non-stop crying for more than 3 hours, or any severe or unusual reaction." },
  { icon: '🇺🇸', title: 'Schedule source',         body: "This schedule follows CDC/ACIP recommended childhood immunization guidelines for 0–5 years. Always confirm with your pediatrician." },
]
</script>

<style scoped>
.info-view { padding-bottom: 90px; container-type: inline-size; }
.view-header {
  padding: calc(var(--safe-top) + 20px) 20px 20px;
  background: linear-gradient(145deg, var(--clr-primary) 0%, #a78bfa 100%);
  color: #fff;
}
.view-title { font-size: 22px; font-weight: 800; }
.view-sub   { font-size: 13px; opacity: .8; margin-top: 3px; }
.info-section { padding: 20px 16px 0; }
.section-title {
  font-size: 13px; font-weight: 700; color: var(--clr-text);
  margin-bottom: 12px; padding-bottom: 8px;
  border-bottom: 2px solid var(--clr-primary-light);
  text-transform: uppercase; letter-spacing: .05em;
}
.info-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.info-card {
  background: var(--clr-surface); border: 1.5px solid var(--clr-border);
  border-radius: var(--radius); padding: 14px 16px; box-shadow: var(--shadow);
}
.ic-title { font-size: 14px; font-weight: 700; margin-bottom: 5px; }
.ic-body  { font-size: 13px; color: var(--clr-text-muted); line-height: 1.6; }
.abbrev-grid { display: flex; flex-direction: column; gap: 8px; padding-bottom: 20px; }
.abbrev-card {
  background: var(--clr-surface); border: 1.5px solid var(--clr-border);
  border-radius: var(--radius-sm); padding: 12px 14px;
  display: grid;
  grid-template-columns: 52px 28px 1fr;
  grid-template-rows: auto auto;
  gap: 0 10px; align-items: center;
}
.ac-key  { font-size: 13px; font-weight: 800; color: var(--clr-primary); grid-row: 1 / 3; }
.ac-icon { font-size: 20px; }
.ac-name { font-size: 13px; font-weight: 700; }
.ac-desc { font-size: 11px; color: var(--clr-text-muted); grid-column: 3; line-height: 1.4; }
@container (min-width: 600px) {
  .view-header  { padding: 28px 32px 24px; }
  .info-section { padding: 20px 32px 0; }
  .info-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .abbrev-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
}
</style>
