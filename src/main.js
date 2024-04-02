/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createHead } from '@unhead/vue'

const app = createApp(App)

const head = createHead()
app.use(head)

registerPlugins(app)

app.mount('#app')
