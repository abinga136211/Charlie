import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import SolutionsView from '@/views/SolutionsView.vue'
import ContactView from '@/views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/en' },
    { path: '/en', name: 'home-en', component: HomeView },
    { path: '/tc', name: 'home-tc', component: HomeView },
    { path: '/sc', name: 'home-sc', component: HomeView },

    { path: '/en/about', name: 'about-en', component: AboutView },
    { path: '/tc/about', name: 'about-tc', component: AboutView },
    { path: '/sc/about', name: 'about-sc', component: AboutView },

    { path: '/en/solutions', name: 'solutions-en', component: SolutionsView },
    { path: '/tc/solutions', name: 'solutions-tc', component: SolutionsView },
    { path: '/sc/solutions', name: 'solutions-sc', component: SolutionsView },

    { path: '/en/contact', name: 'contact-en', component: ContactView },
    { path: '/tc/contact', name: 'contact-tc', component: ContactView },
    { path: '/sc/contact', name: 'contact-sc', component: ContactView },

    { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<section class="main-section"><div class="container"><h1 class="h2">404 — Not Found</h1><p>Visit the <router-link to="/en">homepage</router-link>.</p></div></section>' } }
  ],
  scrollBehavior (to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

export default router
