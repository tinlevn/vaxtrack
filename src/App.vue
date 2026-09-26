<template>
  <div class="app-shell">
    <!-- Desktop sidebar (hidden on mobile via CSS) -->
    <AppSidebar class="app-sidebar" />

    <!-- Main content area -->
    <div class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </Transition>
      </RouterView>
    </div>

    <!-- Mobile bottom nav -->
    <BottomNav class="app-bottom-nav" />
  </div>
</template>

<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import BottomNav  from '@/components/BottomNav.vue'
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: 100dvh;
  grid-template-areas: 'sidebar main';
  min-height: 100dvh;
  width: 100%;
  max-width: 100%;
  background: var(--clr-bg);
}

.app-sidebar {
  grid-area: sidebar;
  width: var(--sidebar-width);
  height: 100dvh;
  position: sticky;
  top: 0;
  z-index: 50;
}

.app-main {
  grid-area: main;
  overflow-y: auto;
  min-width: 0;
  width: 100%;
  background: var(--clr-bg);
}

.app-bottom-nav {
  display: none;
}

/* Mobile: single column, bottom nav */
@media (max-width: 767px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      'main'
      'bottom';
  }
  .app-sidebar    { display: none; }
  .app-bottom-nav { grid-area: bottom; display: flex; }
}
</style>
