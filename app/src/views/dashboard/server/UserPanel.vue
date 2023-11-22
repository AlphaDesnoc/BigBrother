<script setup lang="ts">
import { connectWebSocket } from '../../../data/webSocketSpigot.js';
import { ref } from 'vue';

const wss = ref();
const allPlayers = ref();
connectWebSocket().then(ws => {
    wss.value = ws;
    console.log('WebSocket connection established', ws);
    if (ws instanceof WebSocket) {
        ws.send('{"id": "getAllPlayers"}');

        ws.onmessage = (event) => {
            let receiveData = JSON.parse(event.data);
            console.log(receiveData);
            switch (receiveData.id) {
                case "1x01":
                    allPlayers.value = receiveData.players;
                    break;
                default:
                    break;
            }
        };
    }
}).catch(error => {
    console.log('Failed to connect:', error);
});

</script>

<template>
    <div class="panel">
        <Table :label="['UUID', 'Username', 'Health']" :data="allPlayers"/>
    </div>
</template>

<style scoped>
    .panel{
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        align-items: center;
    }
</style>