import { createApp } from 'vue'
import router from './router'
import App from './views/App.vue'
import PieChart from './components/PieChart.vue'
import DataRectangle from './components/DataRectangle.vue'
import Table from './components/Table.vue'
import DashboardButton from './components/DashboardButton.vue'
import './assets/css/main.css'
import Particle from './components/ParticlesComponent.vue'


createApp(App)
.component('PieChart', PieChart)
.component('DataRectangle', DataRectangle)
.component('Table', Table)
.component('DashboardButton', DashboardButton)
.component('Particles', Particle)
.use(router)
.mount('#app')