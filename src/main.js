import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import VueNumerals from 'vue-numerals'
import 'element-plus/dist/index.css'
import "leaflet/dist/leaflet.css"
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(VueNumerals)
app.mount('#app')
