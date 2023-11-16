import { createApp } from 'vue'
import router from './router'
import App from './views/App.vue'
import PieChart from './components/PieChart.vue'
import DataRectangle from './components/DataRectangle.vue'
import './assets/css/main.css'

createApp(App)
.component('PieChart', PieChart)
.component('DataRectangle', DataRectangle)
.use(router)
.mount('#app')

import {connectWebSocket} from './data/webSocket';
// connectWebSocket().then(ws => {
//     console.log('WebSocket connection established', ws);
// }).catch(error => {
//     console.log('Failed to connect:', error);
// });