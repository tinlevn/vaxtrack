import { ref, computed } from 'vue'

const THEME_KEY = 'vaxtrack-theme'

function getInitialTheme() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  }
  return 'light'
}

const theme = ref(getInitialTheme())

function applyTheme(t) {
  theme.value = t
  if (typeof document !== 'undefined') {
    try {
      localStorage.setItem(THEME_KEY, t)
      document.documentElement.setAttribute('data-theme', t)
      document.documentElement.style.colorScheme = t
      const metaTheme = document.querySelector('meta[name="theme-color"]')
      if (metaTheme) {
        metaTheme.setAttribute('content', t === 'dark' ? '#090d16' : '#0f766e')
      }
    } catch (e) {
      console.error('Failed to set theme in localStorage', e)
    }
  }
}

// Initial application
if (typeof document !== 'undefined') {
  applyTheme(theme.value)
}

export function useTheme() {
  function setTheme(t) {
    if (t === 'light' || t === 'dark') {
      applyTheme(t)
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: computed(() => theme.value === 'dark'),
  }
}

