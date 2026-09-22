<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useI18n } from '@/i18n'

const { t, lang } = useI18n()

const sections = computed(() => t.value.solutions.sections)
const heroTabs = computed(() => t.value.solutions.heroTabs)

// Per-section tab state
const sectionTabs = ref(sections.value.map(() => 0))
const offerShown = ref(sections.value.map(() => false))

watch(sections, () => {
  sectionTabs.value = sections.value.map(() => 0)
  offerShown.value = sections.value.map(() => false)
  nextTick(() => {
    bindReveals()
    bindOfferTriggers()
  })
})

function showOffer (sIdx) {
  if (offerShown.value[sIdx]) return
  const next = [...offerShown.value]
  next[sIdx] = true
  offerShown.value = next
}

function selectSectionTab (sIdx, tIdx) {
  const next = [...sectionTabs.value]
  next[sIdx] = tIdx
  sectionTabs.value = next
}

const rootRef = ref(null)
const heroRiseKey = ref(0)
const heroRiseVisible = ref(false)

function playHeroRise () {
  heroRiseVisible.value = false
  nextTick(() => {
    requestAnimationFrame(() => {
      heroRiseVisible.value = true
    })
  })
}

watch(lang, () => {
  heroRiseKey.value += 1
  playHeroRise()
  nextTick(() => {
    bindReveals()
    bindOfferTriggers()
  })
})

let revealIo = null
let offerIo = null

function bindReveals () {
  if (!rootRef.value) return
  if (!revealIo) {
    revealIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          revealIo.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
  }
  rootRef.value.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    revealIo.observe(el)
  })
}

function bindOfferTriggers () {
  if (!rootRef.value) return
  if (offerIo) offerIo.disconnect()
  offerIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      const idx = Number(e.target.getAttribute('data-offer-trigger'))
      if (!Number.isNaN(idx)) showOffer(idx)
    })
  }, { threshold: 0.35 })
  rootRef.value.querySelectorAll('[data-offer-trigger]').forEach((el) => {
    offerIo.observe(el)
  })
}

onMounted(() => {
  playHeroRise()
  bindReveals()
  bindOfferTriggers()
  onBeforeUnmount(() => {
    if (revealIo) revealIo.disconnect()
    if (offerIo) offerIo.disconnect()
  })

  // Smooth-scroll for hash navigation
  nextTick(() => {
    const hash = window.location.hash
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  })
})

const bulletSvg = new URL('@/assets/images/triangle_bullet.svg', import.meta.url).href

function imgUrl (img) {
  if (!img) return ''
  if (/^https?:\/\//i.test(img)) return img
  return new URL(`../assets/images/${img}`, import.meta.url).href
}
</script>

<template>
  <div ref="rootRef">
    <section class="header solutions">
      <div class="header-content solutions-header-content" :key="`solutions-hero-${lang}-${heroRiseKey}`">
        <h1
          class="h1 inner solutions-h1 hero-rise"
          :class="{ 'is-risen': heroRiseVisible }"
          style="--rise-delay: 0ms"
        >
          {{ t.solutions.heroTitle }}
        </h1>
        <div
          class="header-title-tab hero-rise"
          :class="{ 'is-risen': heroRiseVisible }"
          style="--rise-delay: 140ms"
        >
          <template v-for="(tab, i) in heroTabs" :key="tab">
            <a :href="i === 0 ? '#solutions-intro' : `#Solutions-${i}`" class="header-title-paragraph gold align-centered">{{ tab }}</a>
            <p v-if="i < heroTabs.length - 1" class="header-title-paragraph margin-l-r-30">/</p>
          </template>
        </div>
      </div>
    </section>

    <section id="solutions-intro" class="main-section gray-bg solutions-bg solutions-intro">
      <div class="container">
        <div class="row padding-t-b-50 vertical">
          <div class="content-title align-centered">
            <div
              class="solutions-intro-heading"
              :class="{ 'is-en-wrap': lang === 'en' }"
            >
              <h2
                class="h2 solutions-centered reveal"
                :class="{ 'is-en-wrap': lang === 'en' }"
                style="--reveal-delay: 0ms;"
              >{{ t.solutions.introHeading }}</h2>
              <div class="gold-line-heavy solutions-intro-line reveal" style="--reveal-delay: 80ms;"></div>
            </div>
            <div class="body-text solutions-centered reveal" style="text-align:center; max-width:900px; margin: 0 auto; --reveal-delay: 160ms;">{{ t.solutions.introBody }}</div>
          </div>
        </div>
      </div>
    </section>

    <section v-for="(section, sIdx) in sections" :key="section.id" :id="section.id" class="main-section solutions-section-block cc-padding-b-0">
      <div class="container">
        <div class="row vertical">
          <div class="banner---solution reveal" style="--reveal-delay: 0ms;">
            <img :src="imgUrl(section.img)" :alt="section.heading" class="solutions-img" />
          </div>

          <div
            class="row margin-t-60 solutions"
            :data-offer-trigger="sIdx"
            @mouseenter="showOffer(sIdx)"
          >
            <div class="_2-row-text solutions-left reveal" style="--reveal-delay: 80ms;">
              <div class="content-title" :class="section.cta ? 'cc-margin-b-30' : ''">
                <div class="above-title">
                  <div class="gold-line"></div>
                  <h3 class="h3">{{ section.label }}</h3>
                </div>
                <h2 class="h2 title-width-solutions">{{ section.heading }}</h2>
                <a v-if="section.cta" :href="section.ctaLink" class="button cc-margin-t-10 width-expand w-button">{{ section.cta }}</a>
              </div>

              <p v-if="section.sidebarSmallBody" class="small-paragraph" style="white-space: pre-line;">{{ section.sidebarSmallBody }}
{{ section.sidebarSmallBody2 }}</p>
            </div>

            <div class="_2-row-text solutions-right reveal" style="--reveal-delay: 160ms;">
              <div v-if="section.body" class="body-text" v-html="section.body"></div>
              <div v-if="section.body2" class="body-text" style="margin-top:14px; white-space: pre-line;">{{ section.body2 }}</div>

              <div v-if="section.listTitle" class="body-text" style="margin-top:20px; font-weight:500;">{{ section.listTitle }}</div>
              <div v-if="section.bullets" class="content-list-block" style="margin-top:12px;">
                <template v-for="(b, bi) in section.bullets" :key="bi">
                  <img :src="bulletSvg" loading="lazy" alt="" class="triangle-bullet" />
                  <div class="body-text black-opacity-60">{{ b }}</div>
                </template>
              </div>

              <div v-if="section.listTitle2" class="body-text" style="margin-top:20px; font-weight:500;">{{ section.listTitle2 }}</div>
              <div v-if="section.bullets2" class="content-list-block" style="margin-top:12px;">
                <template v-for="(b, bi) in section.bullets2" :key="'b2-' + bi">
                  <img :src="bulletSvg" loading="lazy" alt="" class="triangle-bullet" />
                  <div class="body-text black-opacity-60">{{ b }}</div>
                </template>
              </div>

              <div v-if="section.body3" class="body-text" style="margin-top:16px; white-space: pre-line;">{{ section.body3 }}</div>
              <div v-if="section.body4" class="body-text" style="margin-top:14px; white-space: pre-line;">{{ section.body4 }}</div>
              <div v-if="section.body5" class="body-text" style="margin-top:14px; white-space: pre-line;">{{ section.body5 }}</div>
              <div v-if="section.body6" class="body-text" style="margin-top:14px; white-space: pre-line;">{{ section.body6 }}</div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="main-section solutions---offer"
        :class="{ 'is-shown': offerShown[sIdx] }"
      >
        <div class="container">
          <div class="tab-menu">
            <div v-for="(tab, tIdx) in section.tabs" :key="tab.label"
                 :class="['offer-tab-link', { 'is-active': sectionTabs[sIdx] === tIdx }]"
                 @click="selectSectionTab(sIdx, tIdx)">
              <div class="title-paragraph-tab">{{ tab.label }}</div>
            </div>
          </div>

          <div v-for="(tab, tIdx) in section.tabs" :key="tab.label"
               class="tab-pane" :class="{ 'is-active': sectionTabs[sIdx] === tIdx }">
            <div class="offer-row-content">
              <div class="_2-row-text solutions-left">
                <div class="title-paragraph cc-margin-b-30">{{ tab.leftTitle }}</div>
                <a v-if="tab.leftCta" :href="tab.leftCtaLink || '#'" :target="tab.leftCtaLink?.startsWith('http') ? '_blank' : null" class="button cc-margin-t-10 width-expand cc-margin-b-20 w-button">{{ tab.leftCta }}</a>

                <div class="body-text" style="white-space: pre-line;">{{ tab.leftBody }}</div>
                <div v-if="tab.leftBody2" class="body-text" style="margin-top:14px; white-space: pre-line;">{{ tab.leftBody2 }}</div>
                <div v-if="tab.leftBody3" class="body-text" style="margin-top:14px; white-space: pre-line;">{{ tab.leftBody3 }}</div>
                <div v-if="tab.leftBody4" class="body-text" style="margin-top:14px; white-space: pre-line;">{{ tab.leftBody4 }}</div>
              </div>

              <div class="_2-row-text solutions-right">
                <div v-if="tab.rightBody" class="body-text" style="white-space: pre-line;">{{ tab.rightBody }}</div>
                <div v-if="tab.rightItems" class="content-list-block cc-margin-b-0" style="margin-top:20px;">
                  <template v-for="(item, ii) in tab.rightItems" :key="ii">
                    <img :src="bulletSvg" loading="lazy" alt="" class="triangle-bullet" />
                    <div class="offer---more-row">
                      <div class="body-text black-opacity-60">{{ item.title }}</div>
                      <div v-if="item.sub" class="body-text black-opacity-60 cc-margin-t-b-10" style="white-space: pre-line;">{{ item.sub }}</div>
                    </div>
                  </template>
                </div>
                <div v-if="tab.rightBody2" class="body-text" style="margin-top:20px; white-space: pre-line;">{{ tab.rightBody2 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cc-margin-t-200 { margin-top: 200px; }

/* Header layout: left-aligned at bottom, matches About page */
.solutions-header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 220px 30px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.solutions-h1 {
  font-size: 42px !important;
  color: #fff;
  font-family: 'Lora', serif;
  font-weight: 700;
  line-height: 1.15;
}

.solutions-header-content .header-title-tab {
  margin-top: 20px;
  gap: 0;
  row-gap: 10px;
  max-width: 100%;
}

.solutions-header-content .header-title-paragraph.margin-l-r-30 {
  margin: 0 12px;
}

.solutions---offer {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transform: translateY(16px);
  margin-top: 0;
  padding-top: 0 !important;
  padding-bottom: 0;
  transition: opacity 0.45s ease, transform 0.45s ease, max-height 0.45s ease, padding 0.45s ease, margin 0.45s ease;
}

.solutions---offer.is-shown {
  max-height: 5000px;
  opacity: 1;
  overflow: visible;
  pointer-events: auto;
  transform: translateY(0);
  margin-top: 28px;
  padding-top: 28px !important;
  padding-bottom: 60px;
}

.hero-rise {
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: var(--rise-delay, 0ms);
}
.hero-rise.is-risen {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .hero-rise,
  .solutions---offer {
    opacity: 1;
    transform: none;
    transition: none;
    max-height: none;
    overflow: visible;
    pointer-events: auto;
  }
  .solutions---offer {
    margin-top: 28px;
    padding-top: 28px !important;
    padding-bottom: 60px;
  }
}
</style>
