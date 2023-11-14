import { createApp } from 'vue'
import router from './router'
import App from './views/App.vue'
import PieChart from './components/PieChart.vue'
import './assets/css/main.css'

createApp(App)
.component('PieChart', PieChart)
.use(router)
.mount('#app')