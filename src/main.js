import { createApp } from 'vue'
import App from './App.vue'
import posthog from 'posthog-js'

posthog.init('phc_y5cEnWCMFYw8Kw5Qb66bjSHaNrDYgZbKAqebbDfRH5dK', {
  api_host: 'https://us.posthog.com',
  person_profiles: 'always',
})

createApp(App).mount('#app')
