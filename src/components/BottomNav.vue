<template>
  <nav class="bottom-nav" aria-label="App navigation">
    <RouterLink class="nav-btn" :to="{ name: 'home' }" aria-label="Timeline">
      <span class="nav-icon">🏠</span>
      <span>Timeline</span>
    </RouterLink>
    <RouterLink class="nav-btn" :to="{ name: 'schedule' }" aria-label="Schedule">
      <span class="nav-icon">📋</span>
      <span>Schedule</span>
    </RouterLink>
    <RouterLink class="nav-btn" :to="{ name: 'info' }" aria-label="Info">
      <span class="nav-icon">ℹ️</span>
      <span>Info</span>
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
  box-shadow: 0 -4px 20px rgba(0,0,0,.07);
  z-index: 200;
}
.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 8px;
  color: var(--clr-text-muted);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  transition: color .15s;
  border-radius: 0;
}
.nav-btn.router-link-active { color: var(--clr-primary); }
.nav-icon { font-size: 22px; line-height: 1; }
</style>
