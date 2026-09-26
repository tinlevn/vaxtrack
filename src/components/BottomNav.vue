<template>
  <nav class="bottom-nav" aria-label="Clinical navigation">
    <RouterLink class="nav-btn" :to="{ name: 'home' }" aria-label="Timeline Chart">
      <span class="nav-icon">📅</span>
      <span>Timeline</span>
    </RouterLink>
    <RouterLink class="nav-btn" :to="{ name: 'schedule' }" aria-label="Schedule">
      <span class="nav-icon">📋</span>
      <span>Schedule</span>
    </RouterLink>
    <RouterLink class="nav-btn" :to="{ name: 'info' }" aria-label="Glossary">
      <span class="nav-icon">📖</span>
      <span>Glossary</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  width: 100%;
  background: var(--clr-surface);
  border-top: 1px solid var(--clr-border);
  display: flex;
  padding-bottom: var(--safe-bottom);
  box-shadow: 0 -2px 8px rgba(0,0,0,.08);
  z-index: 200;
}
.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 9px 8px;
  color: var(--clr-text-muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  transition: all .12s;
  border-radius: 0;
  border-top: 2px solid transparent;
}
.nav-btn.router-link-active {
  color: var(--clr-primary);
  border-top-color: var(--clr-primary);
  background: var(--clr-primary-light);
}
.nav-icon { font-size: 20px; line-height: 1; }
</style>
