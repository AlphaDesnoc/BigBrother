<script setup lang="ts">
import {connectWebSocketBot} from '../../../data/webSocketBot.js';
import { ref } from 'vue';

const totalUsers = ref(); 
const totalBots = ref();
const totalMembersPerRanks = ref();
const totalUsersInVoice = ref();
connectWebSocketBot().then(ws => {
    console.log('WebSocket connection established', ws);
    if(ws instanceof WebSocket){
        ws.send('{"id": "getTotalUsers"}');
        ws.send('{"id": "getTotalBots"}');
        ws.send('{"id": "getMemberPerRanks"}');
        ws.send('{"id": "getUsersInVoice"}');

        ws.onmessage = (event) => {
            let receiveData = JSON.parse(event.data);
            console.log(receiveData);
            switch (receiveData.id) {
                case "0x01":
                    totalUsers.value = receiveData.data; 
                    break;
                case "0x02":
                    totalBots.value = receiveData.data;
                    break;
                case "0x03":
                    totalMembersPerRanks.value = receiveData.data;
                    break;
                case "0x04":
                    totalUsersInVoice.value = receiveData.data;
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
    <DashboardParticles />
    <div v-if="totalUsers && totalBots && totalMembersPerRanks && totalUsersInVoice" class="dashInfos">
        <p>Discord Infos</p>
        <DataRectangle :data='totalUsers' :label="'Joueurs'" :icon="'fas fa-solid fa-users'" :color="'#1F2937'" :width="'20%'" :height="'20%'" />
        <DataRectangle :data='totalBots' :label="'Bots'" :icon="'fas fa-solid fa-robot'" :color="'#1F2937'" :width="'20%'" :height="'20%'" />
        <PieChart :data="[totalMembersPerRanks[0].nombre, totalMembersPerRanks[1].nombre]" :colors="['#FF5733', '#581845']" :labels="[totalMembersPerRanks[0].nom, totalMembersPerRanks[1].nom]" :size="300" />
        <DataRectangle :data='totalUsersInVoice' :label="'Joueurs en vocal'" :icon="'fas fa-solid fa-microphone'" :color="'#1F2937'" :width="'20%'" :height="'20%'" />
    </div>
</template>

<style scoped>
.dashInfos{
    position: relative;
    z-index: 1;
}
</style>