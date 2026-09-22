import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'

describe('App', () => {
  it('mounts and renders the navigation/site chrome', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/:lang', component: { template: '<div />' } }]
    })
    const wrapper = mount(App, {
      global: { plugins: [router] }
    })
    expect(wrapper.find('main').exists()).toBe(true)
  })
})
