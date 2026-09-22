<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from '@/i18n'

const { t, lang } = useI18n()

const infoItems = computed(() => t.value.contact.infoItems)

const form = ref({ name: '', email: '', message: '' })
const submitted = ref(false)
const errored = ref(false)

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

watch(lang, () => {
  heroRiseKey.value += 1
  playHeroRise()
  nextTick(() => bindReveals())
})

onMounted(() => {
  playHeroRise()
  bindReveals()
})

onBeforeUnmount(() => {
  if (revealIo) revealIo.disconnect()
})

function submit () {
  if (!form.value.name || !form.value.email || !form.value.message) {
    errored.value = true
    submitted.value = false
    return
  }
  // Pretend submission
  submitted.value = true
  errored.value = false
  form.value = { name: '', email: '', message: '' }
  setTimeout(() => { submitted.value = false }, 4000)
}
</script>

<template>
  <div ref="rootRef">
  <section class="header contact">
    <div class="header-content" :key="`contact-hero-${lang}-${heroRiseKey}`">
      <h1
        class="h1 inner contact hero-rise"
        :class="{ 'is-risen': heroRiseVisible }"
        style="--rise-delay: 0ms"
      >
        {{ t.contact.heroTitle }}
      </h1>
      <p
        class="header-title-paragraph contact hero-rise"
        :class="{ 'is-risen': heroRiseVisible }"
        style="--rise-delay: 140ms"
      >
        {{ t.contact.heroBody }}
      </p>
    </div>
  </section>

  <section class="main-section cc-padding-t-150 gray-bg cc-padding-b-230">
    <div class="container">
      <div class="row">
        <div class="_2-row-text platform-left reveal" style="flex:0 0 40%; --reveal-delay: 0ms;">
          <div class="content-title">
            <div class="above-title">
              <div class="gold-line"></div>
              <h3 class="h3">{{ t.contact.infoTitle }}</h3>
            </div>
            <h2 class="h2 information-width" style="white-space: pre-line;">{{ t.contact.infoHeading }}</h2>
          </div>
        </div>
        <div class="_2-row-text platform-right reveal" style="--reveal-delay: 120ms;">
          <div class="contact-block">
            <div
              v-for="(item, i) in infoItems"
              :key="item.title"
              class="offer---more-row reveal"
              :style="{ '--reveal-delay': `${160 + i * 70}ms` }"
            >
              <div class="title-paragraph">{{ item.title }}</div>
              <a :href="item.href" class="body-text contact-link">{{ item.value }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="main-section cc-margin-t--150">
    <div class="container">
      <div class="row vertical">
        <div class="row margin-t-150 vertical">
          <div class="_2-row-text highlights-left contact" style="flex:0 0 100%; max-width:100%;">
            <div class="content-title contact reveal" style="--reveal-delay: 0ms;">
              <div class="above-title">
                <div class="gold-line"></div>
                <h3 class="h3">{{ t.contact.formTitle }}</h3>
              </div>
              <h2 class="h2 cc-margin-b-20">{{ t.contact.formHeading }}</h2>
              <div class="title-paragraph">{{ t.contact.formDesc }}</div>
            </div>

            <form class="contact-form reveal" style="--reveal-delay: 120ms;" @submit.prevent="submit">
              <div class="form-top">
                <div class="form-name cc-margin-r">
                  <label for="name" class="body-text">{{ t.contact.formName }}</label>
                  <input id="name" v-model="form.name" class="form-field" type="text" :placeholder="t.contact.formNamePh" required />
                </div>
                <div class="form-email">
                  <label for="email" class="body-text">{{ t.contact.formEmail }}</label>
                  <input id="email" v-model="form.email" class="form-field" type="email" :placeholder="t.contact.formEmailPh" required />
                </div>
              </div>
              <div class="form-message" style="margin-top:20px;">
                <label for="message" class="body-text">{{ t.contact.formMessage }}</label>
                <textarea id="message" v-model="form.message" class="form-field textarea" rows="5" :placeholder="t.contact.formMessagePh" required></textarea>
              </div>
              <button type="submit" class="button cc-margin-t-20 w-button">{{ t.contact.formSubmit }}</button>
              <div v-if="submitted" class="form-success" style="margin-top:14px;">
                <div class="small-paragraph green">{{ t.contact.formSuccess }}</div>
              </div>
              <div v-if="errored" class="form-error" style="margin-top:14px;">
                <div class="small-paragraph red">{{ t.contact.formError }}</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<style scoped>
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
  .hero-rise {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
