import { createApp } from 'vue'
import { createLume } from '../index'
import App from './App.vue'

const lume = createLume({
  theme: 'auto',
  glass: true,
  motion: 'spring',
  haptics: 'auto',
  primary: '#5e72e4'
})

createApp(App).use(lume).mount('#app')
