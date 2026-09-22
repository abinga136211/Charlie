<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import { useI18n } from '@/i18n'

const { t, lang } = useI18n()

const heroTabs = computed(() => t.value.about.heroTabs)
const values = computed(() => t.value.about.values)
const compliancePrinciples = computed(() => t.value.about.compliancePrinciples || [])
// 0° = east; + = clockwise. 01 above-left of disk, 06 below-left of disk.
const valuesOrbitAnglesDeg = [-100, -55, -15, 20, 55, 100]
const valuesOrbitWide = ref(typeof window !== 'undefined' ? window.innerWidth >= 1200 : true)

function valuesOrbitLayout () {
  if (valuesOrbitWide.value) {
    return { centerX: 280, rx: 360, diskEdge: 560, gap: 24, yStep: 200 }
  }
  return { centerX: 220, rx: 290, diskEdge: 440, gap: 20, yStep: 175 }
}

function valuesOrbitStyle (vi) {
  const { centerX, rx, diskEdge, gap, yStep } = valuesOrbitLayout()
  const n = valuesOrbitAnglesDeg.length
  const deg = valuesOrbitAnglesDeg[vi] ?? 0
  const rad = (deg * Math.PI) / 180
  // Equal vertical pitch so cards never stack
  const y = -((n - 1) / 2) * yStep + vi * yStep
  let x = centerX + Math.cos(rad) * rx
  let widthOverride = null
  if (vi === 0) {
    // Card 01: above the disk, left of card 02
    x = Math.min(centerX - 60, Math.max(12, x))
    widthOverride = 'min(260px, 32vw)'
  } else if (vi === 1) {
    // Card 02: top-right of disk
    x = Math.max(centerX + 80, x)
  } else if (vi === n - 1) {
    // Card 06: below the disk, left of card 05
    x = Math.min(centerX - 60, Math.max(12, x))
    widthOverride = 'min(260px, 32vw)'
  } else if (vi === n - 2) {
    // Card 05: bottom-right of disk, right of card 06
    x = Math.max(centerX + 80, diskEdge + gap, x)
  } else {
    x = Math.max(diskEdge + gap, x)
  }
  return {
    left: `${Math.round(x)}px`,
    top: `calc(50% + ${Math.round(y)}px)`,
    zIndex: 20 - vi,
    ...(widthOverride ? { width: widthOverride } : {}),
    '--reveal-delay': `${100 + vi * 80}ms`
  }
}

function onValuesOrbitResize () {
  valuesOrbitWide.value = window.innerWidth >= 1200
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
  nextTick(() => bindReveals())
})

const bulletSvg = new URL('@/assets/images/triangle_bullet.svg', import.meta.url).href
const missionImg = new URL('@/assets/images/mission_img.jpg', import.meta.url).href
const complianceImg = new URL('@/assets/images/compliance_img.jpg', import.meta.url).href
const teamImg = new URL('@/assets/images/team_img.jpg', import.meta.url).href

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
    }, { threshold: 0.12 })
  }
  rootRef.value.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    revealIo.observe(el)
  })
}

onMounted(() => {
  playHeroRise()
  bindReveals()
  onValuesOrbitResize()
  window.addEventListener('resize', onValuesOrbitResize)
})

onBeforeUnmount(() => {
  if (revealIo) revealIo.disconnect()
  window.removeEventListener('resize', onValuesOrbitResize)
})
</script>

<template>
  <div ref="rootRef">
    <section class="header about">
      <div class="header-content" :key="`about-hero-${lang}-${heroRiseKey}`">
        <h1
          class="h1 inner hero-rise"
          :class="{ 'is-risen': heroRiseVisible }"
          style="--rise-delay: 0ms"
        >
          <span class="span-bold">{{ t.about.heroTitle }}</span>
        </h1>
        <div
          class="header-title-tab hero-rise"
          :class="{ 'is-risen': heroRiseVisible }"
          style="--rise-delay: 140ms"
        >
          <template v-for="(tab, i) in heroTabs" :key="tab.label">
            <a :href="tab.href" class="header-title-paragraph gold align-centered">{{ tab.label }}</a>
            <p v-if="i < heroTabs.length - 1" class="header-title-paragraph margin-l-r-30">/</p>
          </template>
        </div>
      </div>
    </section>

    <section class="main-section cc-padding-t-150 gray-bg about-bg">
      <div class="container">
        <div id="about-us" class="row padding-t-b-50">
          <div class="inner-left-row" style="flex:0 0 45%; padding-right:100px;">
            <div class="content-title relative">
              <div class="gold-line-heavy absolute"></div>
              <h2
                class="h2 reveal"
                style="white-space: pre-line; --reveal-delay: 0ms;"
              >A company with&#10;Professional and&#10;reliable</h2>
            </div>
          </div>
          <div class="inner-right-row" style="flex:1;">
            <div class="body-text reveal" style="--reveal-delay: 100ms;">{{ t.about.visionBody }}</div>
            <div class="body-text reveal" style="margin-top:16px; --reveal-delay: 200ms;">{{ t.about.visionBody2 }}</div>
            <div class="body-text reveal" style="margin-top:16px; --reveal-delay: 300ms;">{{ t.about.visionBody3 }}</div>
          </div>
        </div>

        <div class="about-curve-wrap reveal" aria-hidden="true" style="--reveal-delay: 60ms;">
          <svg viewBox="0 0 1200 240" preserveAspectRatio="none">
            <path
              class="about-gold-curve"
              d="M 50 40
                 C 200 40, 280 200, 520 175
                 C 760 150, 860 55, 1150 90"
            />
          </svg>
        </div>

        <div id="mission" class="row about-mission-after-curve">
          <div class="_2-row-image---our-mission reveal" style="flex:0 0 45%; padding-right:60px; --reveal-delay: 0ms;">
            <img :src="missionImg" alt="" class="about-mission-bg" />
          </div>
          <div class="_2-row-text mission-text-col">
            <div class="content-title cc-margin-b-30 reveal" style="--reveal-delay: 80ms;">
              <div class="above-title">
                <div class="gold-line"></div>
                <h3 class="h3">{{ t.about.missionTitle }}</h3>
              </div>
              <h2 v-if="t.about.missionHeading" class="h2 our-mission">{{ t.about.missionHeading }}</h2>
            </div>
            <div class="body-text reveal mission-body-anchor" style="--reveal-delay: 180ms;">{{ t.about.missionBody }}</div>
          </div>
        </div>

        <div id="values" class="row margin-t-150 vertical">
          <div class="content-title cc-margin-b-30 reveal" style="--reveal-delay: 0ms;">
            <div class="above-title">
              <div class="gold-line"></div>
              <h3 class="h3">{{ t.about.valuesTitle }}</h3>
            </div>
            <h2 v-if="t.about.valuesHeading" class="h2 our-mission">{{ t.about.valuesHeading }}</h2>
          </div>

          <div class="values-orbit">
            <div class="values-orbit-disk">
              <div class="values-orbit-disk-inner reveal" style="--reveal-delay: 60ms;">
                <img :src="complianceImg" alt="" class="values-orbit-img" />
              </div>
            </div>
            <div
              v-for="(v, vi) in values"
              :key="v.n"
              class="values-orbit-card"
              :style="valuesOrbitStyle(vi)"
            >
              <div class="values-orbit-card-inner values-block reveal" :style="{ '--reveal-delay': `${100 + vi * 80}ms` }">
                <h3 class="h3">{{ v.n }}</h3>
                <div class="gray-line margin-t-b"></div>
                <div class="title-paragraph cc-margin-b-15">{{ v.name }}</div>
                <div class="body-text">{{ v.body }}</div>
              </div>
            </div>
          </div>
        </div>

        <div id="principles" class="row margin-t-150">
          <div class="_2-row-text solutions-left reveal" style="flex:0 0 45%; padding-right:60px; --reveal-delay: 0ms;">
            <div class="content-title compliance">
              <div class="above-title">
                <div class="gold-line"></div>
                <h3 class="h3">{{ t.about.complianceTitle }}</h3>
              </div>
              <h2 v-if="t.about.complianceHeading" class="h2">{{ t.about.complianceHeading }}</h2>
            </div>
          </div>
          <div class="_2-row-text solutions-right">
            <div class="content-list-block">
              <template v-for="(p, pi) in compliancePrinciples" :key="pi">
                <img
                  :src="bulletSvg"
                  loading="lazy"
                  alt=""
                  class="triangle-bullet reveal"
                  :style="{ '--reveal-delay': `${80 + pi * 70}ms` }"
                />
                <div
                  class="body-text black-opacity-60 reveal"
                  :style="{ '--reveal-delay': `${80 + pi * 70}ms` }"
                >{{ p }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="main-section cc-margin-t--100">
      <div class="container">
        <div class="row platform">
          <div class="_2-row-text cc-margin-t-200 team-content-flag">
            <div class="content-title cc-margin-b-30">
              <div class="above-title">
                <div class="gold-line"></div>
                <h3 class="h3">{{ t.about.teamTitle }}</h3>
              </div>
              <h2 class="h2 title-width-team">{{ t.about.teamHeading }}</h2>
            </div>
            <div class="body-text">{{ t.about.teamBody }}</div>
            <div class="body-text" style="margin-top:14px;">{{ t.about.teamBody2 }}</div>
            <div class="body-text" style="margin-top:14px;">{{ t.about.teamBody3 }}</div>
            <div class="body-text" style="margin-top:14px;">{{ t.about.teamBody4 }}</div>
          </div>
          <div class="_2-row-image---our-team" style="flex:0 0 50%; padding-left:40px;">
            <img :src="teamImg" alt="" class="about-team-bg" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.team-content-flag .h3,
.team-content-flag .h2,
.team-content-flag .body-text {
  color: #d32f2f !important;
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

.about-curve-wrap {
  position: relative;
  z-index: 0;
  height: 200px;
  margin: 24px 6% 16px;
  pointer-events: none;
  overflow: visible;
}
.about-curve-wrap svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.about-gold-curve {
  fill: none;
  stroke: #c1a060;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.88;
}
.about-gold-curve--strong {
  stroke: #a88546;
  stroke-width: 3;
  opacity: 1;
}

.about-mission-after-curve {
  margin-top: 40px;
  overflow: visible;
}

.mission-text-col {
  position: relative;
  overflow: visible;
  padding-left: 20px;
}

.values-orbit {
  position: relative;
  width: 100%;
  min-height: 1180px;
  margin-top: 28px;
  margin-left: 0;
  padding-right: 8px;
  overflow: visible;
  box-sizing: border-box;
}

.values-orbit-disk {
  /* Orbit origin = disk center; must not use .reveal (its transform fights translateY) */
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 440px;
  height: 440px;
  z-index: 1;
  pointer-events: none;
}

.values-orbit-disk-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  background: #1a1a1a;
  pointer-events: auto;
}

.values-orbit-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.values-orbit-card {
  position: absolute;
  width: min(340px, 36vw);
  z-index: 3;
  transform: translateY(-50%);
  pointer-events: none;
  max-width: calc(100% - 470px);
}

.values-orbit-card-inner {
  pointer-events: auto;
  padding: 12px 14px;
  background: rgba(247, 247, 247, 0.96);
  border-left: 3px solid #c1a060;
}

.values-orbit-card .h3 {
  font-size: 26px;
  margin: 0;
  line-height: 1.1;
}

.values-orbit-card .gray-line.margin-t-b {
  margin: 8px 0;
}

.values-orbit-card .title-paragraph {
  font-size: 17px;
  margin-bottom: 6px !important;
}

.values-orbit-card .body-text {
  font-size: 14px;
  line-height: 1.45;
}

#about-us,
#mission,
#values {
  position: relative;
  z-index: 1;
  overflow: visible;
}

@media (min-width: 1200px) {
  .values-orbit {
    margin-left: 0;
    min-height: 1380px;
  }
  .values-orbit-disk {
    width: 560px;
    height: 560px;
  }
  .values-orbit-card {
    width: min(380px, 32vw);
    max-width: calc(100% - 600px);
  }
  .values-orbit-card .h3 {
    font-size: 30px;
  }
  .values-orbit-card .title-paragraph {
    font-size: 18px;
  }
  .values-orbit-card .body-text {
    font-size: 15px;
  }
}

@media (max-width: 991px) {
  .about-curve-wrap {
    height: 140px;
    margin: 16px 4% 0;
  }
  .about-mission-after-curve {
    margin-top: 28px;
  }
  .mission-text-col {
    padding-left: 0;
  }
}

@media (max-width: 700px) {
  .values-orbit {
    min-height: 0;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
    padding-left: 8px;
  }
  .values-orbit-disk {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    width: 360px;
    height: 360px;
    max-width: 86vw;
    max-height: 86vw;
  }
  .values-orbit-card {
    position: relative;
    left: auto !important;
    top: auto !important;
    width: 100%;
    max-width: 520px;
    transform: none;
  }
}

@media (max-width: 600px) {
  .about-curve-wrap {
    display: none;
  }
  .about-mission-after-curve {
    margin-top: 80px;
  }
  .values-orbit-disk {
    width: 300px;
    height: 300px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-rise {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
