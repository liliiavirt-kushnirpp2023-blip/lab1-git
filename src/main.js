import { createApp } from 'vue'
import App from './App.vue'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/vue'

posthog.init('phc_y5cEnWCMFYw8Kw5Qb66bjSHaNrDYgZbKAqebbDfRH5dK', {
  api_host: 'https://us.posthog.com',
  person_profiles: 'always',
})

const app = createApp(App)

Sentry.init({
  app,
  dsn: 'https://ebe35fed83d333b94682e481f3c029a7@o4511239969898496.ingest.de.sentry.io/4511239974420560',
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.VITE_APP_STATUS === 'Production'
    ? 'production'
    : 'development',
})

app.mount('#app')
