import { defineStore } from 'pinia'

export const themeModeOptions = [
  { value: 'system', label: '跟随系统', icon: 'fluent:desktop-20-regular' },
  { value: 'dark', label: '深色', icon: 'fluent:weather-moon-20-regular' },
  { value: 'light', label: '浅色', icon: 'fluent:weather-sunny-20-regular' },
] as const

export const themeAccentOptions = [
  { value: 'pink', label: '蔷薇粉', color: '#e04486' },
  { value: 'blue', label: '海湾蓝', color: '#3578e5' },
  { value: 'violet', label: '星云紫', color: '#805ad5' },
  { value: 'teal', label: '松石绿', color: '#168574' },
  { value: 'amber', label: '琥珀橙', color: '#b86f16' },
] as const

export type ThemeMode = (typeof themeModeOptions)[number]['value']
export type ThemeAccent = (typeof themeAccentOptions)[number]['value']
export type ResolvedThemeMode = Exclude<ThemeMode, 'system'>

interface ThemePreferences {
  mode: ThemeMode
  accent: ThemeAccent
}

const STORAGE_KEY = 'ai-screen-theme'
const DEFAULT_THEME: ThemePreferences = {
  mode: 'dark',
  accent: 'pink',
}

function isThemeMode(value: unknown): value is ThemeMode {
  return themeModeOptions.some((option) => option.value === value)
}

function isThemeAccent(value: unknown): value is ThemeAccent {
  return themeAccentOptions.some((option) => option.value === value)
}

function getStoredTheme(): ThemePreferences {
  if (typeof window === 'undefined') return DEFAULT_THEME

  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')

    return {
      mode: isThemeMode(value.mode) ? value.mode : DEFAULT_THEME.mode,
      accent: isThemeAccent(value.accent) ? value.accent : DEFAULT_THEME.accent,
    }
  } catch {
    return DEFAULT_THEME
  }
}

export const useThemeStore = defineStore('theme', () => {
  const storedTheme = getStoredTheme()
  const mediaQuery = typeof window === 'undefined' ? null : window.matchMedia('(prefers-color-scheme: dark)')
  const mode = ref<ThemeMode>(storedTheme.mode)
  const accent = ref<ThemeAccent>(storedTheme.accent)
  const systemPrefersDark = ref(mediaQuery?.matches ?? true)
  const resolvedMode = computed<ResolvedThemeMode>(() => {
    if (mode.value !== 'system') return mode.value

    return systemPrefersDark.value ? 'dark' : 'light'
  })

  function applyTheme() {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    root.dataset.theme = resolvedMode.value
    root.dataset.accent = accent.value
    root.classList.toggle('dark', resolvedMode.value === 'dark')
  }

  function saveTheme() {
    if (typeof window === 'undefined') return

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode: mode.value,
        accent: accent.value,
      } satisfies ThemePreferences),
    )
  }

  function setMode(value: ThemeMode) {
    mode.value = value
  }

  function setAccent(value: ThemeAccent) {
    accent.value = value
  }

  function resetTheme() {
    mode.value = DEFAULT_THEME.mode
    accent.value = DEFAULT_THEME.accent
  }

  function onSystemThemeChange(event: MediaQueryListEvent) {
    systemPrefersDark.value = event.matches
  }

  mediaQuery?.addEventListener('change', onSystemThemeChange)
  onScopeDispose(() => mediaQuery?.removeEventListener('change', onSystemThemeChange))

  watch([resolvedMode, accent], applyTheme, { immediate: true, flush: 'sync' })
  watch([mode, accent], saveTheme)

  return {
    mode,
    accent,
    resolvedMode,
    setMode,
    setAccent,
    resetTheme,
  }
})
