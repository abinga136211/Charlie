import { ref, computed } from 'vue'
import en from './en.js'
import tc from './tc.js'
import sc from './sc.js'

const STORAGE_KEY = 'unitrust_lang'

const messages = { en, tc, sc }

function detectInitialLang () {
  if (typeof window === 'undefined') return 'en'
  const pathLang = window.location?.pathname?.match(/^\/(en|tc|sc)(?:\/|$)/)?.[1]
  if (pathLang && messages[pathLang]) return pathLang
  const stored = window.localStorage?.getItem(STORAGE_KEY)
  if (stored && messages[stored]) return stored
  const browserLang = (window.navigator?.language || 'en').toLowerCase()
  if (browserLang.startsWith('zh-tw') || browserLang === 'zh-hk') return 'tc'
  if (browserLang.startsWith('zh')) return 'sc'
  return 'en'
}

const currentLang = ref(detectInitialLang())
const isMobileMenuOpen = ref(false)

function setLang (lang) {
  if (!messages[lang]) return
  currentLang.value = lang
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'en' ? 'en' : (lang === 'tc' ? 'zh-Hant' : 'zh-Hans')
  }
}

function toggleMobileMenu (val) {
  isMobileMenuOpen.value = typeof val === 'boolean' ? val : !isMobileMenuOpen.value
}

const t = computed(() => messages[currentLang.value])

export function useI18n () {
  return {
    lang: currentLang,
    setLang,
    isMobileMenuOpen,
    toggleMobileMenu,
    t,
    messages
  }
}

export function getCurrentLang () { return currentLang.value }
