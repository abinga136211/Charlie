<script setup>
import { computed, watch, onMounted, onBeforeUnmount, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from '@/i18n'

const route = useRoute()
const { lang, setLang, isMobileMenuOpen, toggleMobileMenu, t } = useI18n()

const navLinks = computed(() => ([
  { to: `/${lang.value}/about`, label: t.value.nav.about },
  { to: `/${lang.value}/solutions`, label: t.value.nav.solutions },
  // Credit card link removed
  { to: `/${lang.value}/contact`, label: t.value.nav.contact }
]))

const isSticky = ref(false)

function onScroll () {
  isSticky.value = window.scrollY > 80
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(() => route.fullPath, () => {
  isMobileMenuOpen.value = false
})

const menuIcon = new URL('@/assets/icons/icon_menu.svg', import.meta.url).href
const logoSrc = '/logo.png'
</script>

<template>
  <div class="nav-mobile-menu" :class="{ 'is-open': isMobileMenuOpen }">
    <template v-for="link in navLinks" :key="link.label">
      <a v-if="link.external" :href="link.to" target="_blank" rel="nofollow" class="nav-link">{{ link.label }}</a>
      <RouterLink v-else :to="link.to" class="nav-link">{{ link.label }}</RouterLink>
    </template>
    <div class="nav-link" style="display:flex; gap:10px;">
      <a href="#" :class="['nav-lang', { 'w--current': lang === 'en' }]" @click.prevent="setLang('en')">EN</a>
      <a href="#" :class="['nav-lang', { 'w--current': lang === 'tc' }]" @click.prevent="setLang('tc')">繁</a>
      <a href="#" :class="['nav-lang', { 'w--current': lang === 'sc' }]" @click.prevent="setLang('sc')">简</a>
    </div>
    <RouterLink :to="`/${lang}/contact`" class="navigation-button w-button">{{ t.nav.contactUs }}</RouterLink>
    <div class="menu-close" @click="toggleMobileMenu(false)"></div>
  </div>

  <div v-show="!isSticky" class="navigation" role="banner">
    <div class="navigation-container">
      <RouterLink :to="`/${lang}`" class="logo logo-text">
        <img :src="logoSrc" alt="CITIC TRUST LIMITED" class="logo-mark" />
        <span>CITIC TRUST LIMITED</span>
      </RouterLink>
      <nav class="nav-menu">
        <template v-for="link in navLinks" :key="link.label">
          <a v-if="link.external" :href="link.to" target="_blank" rel="nofollow" class="nav-link">{{ link.label }}</a>
          <RouterLink v-else :to="link.to" class="nav-link">{{ link.label }}</RouterLink>
        </template>
        <a href="#" :class="['nav-lang', 'marign-left', { 'w--current': lang === 'en' }]" @click.prevent="setLang('en')">EN</a>
        <a href="#" :class="['nav-lang', { 'w--current': lang === 'tc' }]" @click.prevent="setLang('tc')">繁</a>
        <a href="#" :class="['nav-lang', 'margin-right', { 'w--current': lang === 'sc' }]" @click.prevent="setLang('sc')">简</a>
        <RouterLink :to="`/${lang}/contact`" class="navigation-button w-button">{{ t.nav.contactUs }}</RouterLink>
      </nav>
      <div class="menu-open" @click="toggleMobileMenu(true)">
        <img :src="menuIcon" width="32" alt="Menu" />
      </div>
    </div>
  </div>

  <div class="nav-sticky" :class="{ 'is-sticky': isSticky }" role="banner">
    <div class="nav-sticky-container">
      <RouterLink :to="`/${lang}`" class="logo logo-text">
        <img :src="logoSrc" alt="CITIC TRUST LIMITED" class="logo-mark" />
        <span>CITIC TRUST LIMITED</span>
      </RouterLink>
      <nav class="nav-menu">
        <template v-for="link in navLinks" :key="link.label">
          <a v-if="link.external" :href="link.to" target="_blank" rel="nofollow" class="nav-sticky-link">{{ link.label }}</a>
          <RouterLink v-else :to="link.to" class="nav-sticky-link">{{ link.label }}</RouterLink>
        </template>
        <a href="#" :class="['nav-sticky-lang', 'marign-left', { 'w--current': lang === 'en' }]" @click.prevent="setLang('en')">EN</a>
        <a href="#" :class="['nav-sticky-lang', { 'w--current': lang === 'tc' }]" @click.prevent="setLang('tc')">繁</a>
        <a href="#" :class="['nav-sticky-lang', 'margin-right', { 'w--current': lang === 'sc' }]" @click.prevent="setLang('sc')">简</a>
        <RouterLink :to="`/${lang}/contact`" class="navigation-button w-button">{{ t.nav.contactUs }}</RouterLink>
      </nav>
      <div class="menu-open" @click="toggleMobileMenu(true)">
        <img :src="menuIcon" width="32" alt="Menu" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.w--current { font-weight: 700; }

.logo-text {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: 'Lexend', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1.2;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
}

.logo-text .logo-mark {
  height: 72px;
  width: auto;
  max-height: none;
  display: block;
  flex-shrink: 0;
  object-fit: contain;
}

.nav-sticky .logo-text {
  color: #181818;
}

.nav-sticky .logo-text .logo-mark {
  height: 56px;
}
</style>
