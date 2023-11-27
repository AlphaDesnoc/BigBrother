import { createApp } from 'vue'
import router from './router'
import App from './views/App.vue'
import PieChart from './components/PieChart.vue'
import DataRectangle from './components/DataRectangle.vue'
import Table from './components/Table.vue'
import DashboardButton from './components/DashboardButton.vue'
import Particle from './components/ParticlesComponent.vue'
import DashboardParticle from './components/ParticlesDashboard.vue'
import ConsoleButton from './components/ConsoleButton.vue'
import './assets/css/main.scss'

createApp(App)
.component('PieChart', PieChart)
.component('DataRectangle', DataRectangle)
.component('Table', Table)
.component('DashboardButton', DashboardButton)
.component('Particles', Particle)
.component('DashboardParticles', DashboardParticle)
.component('ConsoleButton', ConsoleButton)
.use(router)
.mount('#app')