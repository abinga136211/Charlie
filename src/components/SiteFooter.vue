<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from '@/i18n'

const { lang, t } = useI18n()

const footer = computed(() => t.value.footer)
const logoSrc = '/logo.png'

function linkTo (to) {
  if (!to) return `/${lang.value}`
  if (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('#')) return to
  if (to.startsWith('/')) return to
  const [path, hash] = to.split('#')
  const full = `/${lang.value}/${path}`
  return hash ? `${full}#${hash}` : full
}
</script>

<template>
  <footer class="footer">
    <div class="footer-container cc-footer">
      <div class="footer-brand">
        <RouterLink :to="`/${lang}`" class="footer-logo logo-text">
          <img :src="logoSrc" alt="CITIC TRUST LIMITED" class="logo-mark" />
          <span>CITIC TRUST LIMITED</span>
        </RouterLink>
        <p class="footer-tagline">{{ footer.tagline }}</p>
      </div>

      <div
        v-for="(col, idx) in footer.columns"
        :key="idx"
        class="footer-col"
      >
        <div v-if="col.title" class="footer-col-title">{{ col.title }}</div>
        <div class="footer-links-list">
          <RouterLink
            v-for="link in col.links"
            :key="link.label"
            :to="linkTo(link.to)"
            class="link-footer"
          >{{ link.label }}</RouterLink>
        </div>
      </div>

      <div class="footer-col footer-col-contact">
        <div class="footer-col-title">{{ footer.contactTitle }}</div>
        <div
          v-for="(line, i) in footer.contactLines"
          :key="i"
          class="footer-text white cc-margin-b-10"
        >
          <template v-if="line.pre">{{ line.pre }}<a :href="line.href" class="link">{{ line.val }}</a></template>
          <a v-else :href="line.href" class="link" style="white-space: pre-line;">{{ line.val }}</a>
        </div>
      </div>
    </div>

    <div class="footer-copyright">
      <div class="footer-copyright-left">
        <div class="footer-text">{{ footer.copyright }}</div>
      </div>
      <div class="footer-terms-link-list">
        <a
          v-for="term in footer.terms"
          :key="term.label"
          :href="term.href"
          :class="['link-terms-footer', { 'margin-remove': term.last }]"
        >{{ term.label }}</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 280px;
}
.logo-text {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Lexend', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1.2;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
}
.logo-mark {
  height: 28px;
  width: auto;
  display: block;
  flex-shrink: 0;
}
.footer-tagline {
  margin: 0;
  font-family: 'Lexend', sans-serif;
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
}
.footer-col-title {
  font-family: 'Lexend', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 10px;
}
</style>
