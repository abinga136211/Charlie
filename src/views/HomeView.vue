<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from '@/i18n'

const { t, lang } = useI18n()

const currentSlide = ref(0)
const slides = computed(() => t.value.home.slides)
const solutions = computed(() => t.value.home.solutions)
const hoveredSolution = ref(null)
let solutionLeaveTimer = null

function onSolutionEnter (i) {
  if (solutionLeaveTimer) {
    clearTimeout(solutionLeaveTimer)
    solutionLeaveTimer = null
  }
  hoveredSolution.value = i
}
function onSolutionLeave () {
  if (solutionLeaveTimer) clearTimeout(solutionLeaveTimer)
  solutionLeaveTimer = setTimeout(() => {
    hoveredSolution.value = null
    solutionLeaveTimer = null
  }, 150)
}
const heroTextKey = ref(0)
const slideAnimVisible = ref([false, false, false])

function playSlideAnim (idx) {
  const next = slideAnimVisible.value.slice()
  while (next.length < slides.value.length) next.push(false)
  next[idx] = false
  slideAnimVisible.value = next
  nextTick(() => {
    requestAnimationFrame(() => {
      const shown = slideAnimVisible.value.slice()
      shown[idx] = true
      slideAnimVisible.value = shown
    })
  })
}

function isSlideAnimOn (idx) {
  return !!slideAnimVisible.value[idx]
}

watch(lang, () => {
  heroTextKey.value += 1
  slideAnimVisible.value = slides.value.map(() => false)
  playSlideAnim(currentSlide.value)
  nextTick(() => bindReveals())
})

watch(currentSlide, (idx) => {
  playSlideAnim(idx)
})

let timer = null

function nextSlide () {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  resetTimer()
}
function prevSlide () {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
  resetTimer()
}
function goToSlide (i) {
  currentSlide.value = i
  resetTimer()
}
function resetTimer () {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
  }, 5000)
}

onMounted(() => {
  resetTimer()
  playSlideAnim(currentSlide.value)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (solutionLeaveTimer) clearTimeout(solutionLeaveTimer)
})

// Reveal-on-scroll
const rootRef = ref(null)
let revealIo = null

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
    }, { threshold: 0.15 })
  }
  rootRef.value.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    revealIo.observe(el)
  })
}

onMounted(() => {
  bindReveals()
  onBeforeUnmount(() => {
    if (revealIo) revealIo.disconnect()
  })
})

const bulletSvg = new URL('@/assets/images/triangle_bullet.svg', import.meta.url).href
const introImg = new URL('@/assets/images/intro_bg.jpg', import.meta.url).href
// platformImg removed

// Three hero slider backgrounds (one per slide)
const slideBg1 = new URL('@/assets/images/slide1_bg.jpg', import.meta.url).href
const slideBg2 = new URL('@/assets/images/slide2_bg.jpg', import.meta.url).href
const slideBg3 = new URL('@/assets/images/slide3_bg.jpg', import.meta.url).href
const slideBgs = [slideBg1, slideBg2, slideBg3]

function slideStyle (idx) {
  return {
    backgroundImage: `linear-gradient(135deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.7) 100%), url('${slideBgs[idx]}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}

// Solutions grid background images (match original dark overlay style)
const solBg1 = new URL('@/assets/images/solution1_img.jpg', import.meta.url).href
const solBg2 = new URL('@/assets/images/solution2_img.jpg', import.meta.url).href
const solBg3 = new URL('@/assets/images/solution3_img.jpg', import.meta.url).href
const solBg4 = new URL('@/assets/images/solution4_img.jpg', import.meta.url).href
const solBgs = [solBg1, solBg2, solBg3, solBg4]

function solStyle (idx) {
  return {
    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.4) 0%, rgba(0,0,0,.7) 100%), url('${solBgs[idx]}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}
</script>

<template>
  <div ref="rootRef">
    <!-- HERO SLIDER -->
    <section class="home-slider">
      <div class="home-slider-mask" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(slide, idx) in slides" :key="idx" class="home-slide" :style="slideStyle(idx)">
          <div class="header-slider">
            <div class="header-content home" :key="`hero-text-${lang}-${heroTextKey}-${idx}`">
              <h1
                class="h1 home hero-rise"
                :class="{ 'is-risen': isSlideAnimOn(idx) }"
                style="--rise-delay: 0ms"
                v-if="slide.title || slide.titleBold || slide.titlePre"
              >
                <template v-if="slide.titlePre">{{ slide.titlePre }} </template>
                <span class="span-bold">{{ slide.titleBold || slide.title }}</span>
              </h1>
              <h1 v-else class="h1 home" style="visibility:hidden;">.</h1>

              <p
                class="header-title-paragraph home hero-rise"
                :class="{ 'is-risen': isSlideAnimOn(idx) }"
                style="--rise-delay: 120ms"
              >{{ slide.sub }}</p>

              <div class="content-list-block home">
                <div
                  v-for="(b, bi) in slide.bullets"
                  :key="bi"
                  class="content-list-row hero-slide"
                  :class="{ 'is-slid': isSlideAnimOn(idx) }"
                  :style="{ '--slide-delay': `${160 + bi * 90}ms` }"
                >
                  <img :src="bulletSvg" loading="lazy" alt="" class="triangle-bullet" />
                  <div class="body-text black-opacity-60 white">{{ b }}</div>
                </div>
              </div>

              <RouterLink
                v-if="slide.closing"
                :to="`/${lang}/contact`"
                class="header-title-paragraph home gold hero-rise home-closing-link"
                :class="{ 'is-risen': isSlideAnimOn(idx) }"
                style="--rise-delay: 240ms"
              >{{ slide.closing }}</RouterLink>
              <RouterLink
                v-if="slide.cta"
                :to="`/${lang}/contact`"
                class="button w-button hero-rise"
                :class="{ 'is-risen': isSlideAnimOn(idx) }"
                style="--rise-delay: 240ms"
              >{{ slide.cta }}</RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div class="home-slider-arrow left" @click="prevSlide">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </div>
      <div class="home-slider-arrow right" @click="nextSlide">
        <svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
      </div>

      <div class="slide-nav-home">
        <span v-for="(_, i) in slides" :key="i" class="slide-dot" :class="{ 'is-active': i === currentSlide }" @click="goToSlide(i)"></span>
      </div>
    </section>

    <!-- INTRO TWO-COL -->
    <section class="main-section cc-padding-t-150 intro-bg">
      <div class="container">
        <div class="row">
          <div class="_2-row-image---intro">
            <img :src="introImg" alt="" class="intro-image" />
          </div>
          <div class="_2-row-text">
            <h2
              :key="`intro-title-${lang}`"
              class="h2 cc-margin-b-10 reveal reveal-from-image"
            >{{ t.home.introTitle }}</h2>
            <RouterLink :to="`/${lang}/about`" class="button w-button reveal">{{ t.home.introCta }}</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- SOLUTIONS TITLE -->
    <section class="main-section cc-margiin-b-40">
      <div class="container">
        <div class="content-title">
          <div class="above-title">
            <div class="gold-line"></div>
            <h3 class="h3">{{ t.home.solutionsTitle }}</h3>
          </div>
          <h2 class="h2 reveal">{{ t.home.solutionsHeading }}</h2>
          <p class="body-text reveal" style="margin-top: 16px; max-width: 720px;">{{ t.home.solutionsBody }}</p>
        </div>
      </div>
    </section>

    <!-- SOLUTIONS GRID -->
    <section class="solutions-section relative">
      <div
        class="solutions-grid"
        :class="{ 'has-hover': hoveredSolution !== null }"
        @mouseleave="onSolutionLeave"
      >
        <div
          v-for="(s, i) in solutions"
          :key="i"
          class="solutions-block"
          :class="{
            'is-hovered': hoveredSolution === i,
            'is-collapsed': hoveredSolution !== null && hoveredSolution !== i
          }"
          @mouseenter="onSolutionEnter(i)"
        >
          <div class="solutions-visual" :style="solStyle(i)">
            <div class="solutions-title-paragraph white">{{ s.name }}</div>
          </div>
          <div class="solutions-detail-panel">
            <div class="title-paragraph white cc-margin-b-15">{{ s.name }}</div>
            <div class="body-text white cc-margin-b-30">{{ s.body }}</div>
            <RouterLink
              :to="{ path: `/${lang}/solutions`, hash: `#Solutions-${i + 1}` }"
              class="button w-button"
            >{{ lang === 'en' ? 'Learn More' : '了解更多' }}</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- (Platform section removed) -->
  </div>
</template>

<style scoped>
.solutions-grid {
  position: relative;
  display: flex !important;
  flex-wrap: nowrap;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  height: 460px;
  align-items: stretch;
  overflow: hidden;
}

.solutions-block {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  background-color: #1a1a1a;
  z-index: 1;
  transition: opacity 0.3s ease;
}

.solutions-block:nth-child(2) { background-color: #243240; }
.solutions-block:nth-child(3) { background-color: #2c2018; }
.solutions-block:nth-child(4) { background-color: #1e2a24; }

.solutions-visual {
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 60px 40px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: flex 0.4s ease, width 0.4s ease, max-width 0.4s ease;
  z-index: 1;
}

.solutions-detail-panel {
  flex: 0 0 0;
  width: 0;
  max-width: 0;
  height: 100%;
  opacity: 0;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
  background-color: rgba(193, 160, 96, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: flex 0.4s ease, width 0.4s ease, max-width 0.4s ease, opacity 0.3s ease, padding 0.4s ease;
  z-index: 2;
}

/* Keep collapsed cards in layout to avoid reflow jitter */
.solutions-block.is-collapsed {
  opacity: 0;
  pointer-events: none;
}

/* Cover full grid without collapsing sibling layout */
.solutions-block.is-hovered {
  position: absolute;
  inset: 0;
  z-index: 5;
  flex: none;
  width: 100%;
  max-width: 100%;
  height: 100%;
  opacity: 1;
  pointer-events: auto;
}

.solutions-block.is-hovered .solutions-visual {
  flex: 0 0 25%;
  width: 25%;
  max-width: 350px;
  height: 100%;
}

.solutions-block.is-hovered .solutions-detail-panel {
  flex: 1 1 auto;
  width: auto;
  max-width: none;
  height: 100%;
  opacity: 1;
  padding: 40px 48px;
  overflow-x: hidden;
  overflow-y: auto;
  justify-content: center;
  align-items: stretch;
  text-align: left;
}

.solutions-detail-panel .title-paragraph,
.solutions-detail-panel .body-text {
  width: 100%;
  max-width: none;
}

.solutions-detail-panel .body-text {
  line-height: 1.7;
  flex: 0 1 auto;
}

@media (max-width: 600px) {
  .solutions-grid {
    flex-wrap: wrap;
    height: auto;
    min-height: 360px;
    overflow: visible;
  }
  .solutions-block {
    flex: 1 1 100%;
    height: 360px;
  }
  .solutions-block.is-collapsed {
    display: none;
  }
  .solutions-block.is-hovered {
    position: relative;
    inset: auto;
    flex: 1 1 100%;
    flex-direction: column;
    height: auto;
    min-height: 360px;
  }
  .solutions-block.is-hovered .solutions-visual {
    flex: 0 0 220px;
    width: 100%;
    max-width: none;
    height: 220px;
    padding: 40px 24px;
  }
  .solutions-block.is-hovered .solutions-detail-panel {
    height: auto;
    max-height: 280px;
    overflow-y: auto;
  }
  .solutions-visual {
    padding: 40px 24px;
  }
}

.content-list-block.home {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.content-list-row {
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 10px;
  align-items: start;
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

.hero-slide {
  opacity: 0;
  transform: translateX(-28px);
  transition: opacity 0.65s ease, transform 0.65s ease;
  transition-delay: var(--slide-delay, 0ms);
}
.hero-slide.is-slid {
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .hero-rise,
  .hero-slide {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
