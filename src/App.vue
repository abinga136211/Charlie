<script setup>
import { computed, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import SiteNav from '@/components/SiteNav.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { useI18n } from '@/i18n'

const route = useRoute()
const router = useRouter()
const { lang } = useI18n()

// Sync URL <-> language
watch(() => route.params.lang, (val) => {
  if (val && ['en', 'tc', 'sc'].includes(val)) {
    if (lang.value !== val) lang.value = val
  }
}, { immediate: true })

watch(lang, (val) => {
  const pathLang = route.params.lang
  if (pathLang && pathLang !== val) {
    const newPath = route.fullPath.replace(`/${pathLang}/`, `/${val}/`).replace(`/${pathLang}`, `/${val}`)
    router.replace(newPath)
  }
})

const hideChrome = computed(() => route.name === 'not-found')
</script>

<template>
  <SiteNav v-if="!hideChrome" />
  <main>
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </main>
  <SiteFooter v-if="!hideChrome" />
</template>
