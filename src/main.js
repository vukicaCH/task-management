import './assets/main.css'
import PrimeVue from 'primevue/config'
import Lara from '@primeuix/themes/lara';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App);

app
.use(PrimeVue, {
    theme: {
        preset: Lara,
        options:{
            darkModeSelector: '.my-app-dark',
        }
    }
 })
 .use(createPinia());

 app.mount('#app')