<script setup lang="ts">
import { connectWebSocketBot } from '../../../data/webSocketBot';
import { ref } from 'vue';

const allUsers = ref();
const wss = ref();
connectWebSocketBot().then(ws => {
    wss.value = ws;
    console.log('WebSocket connection established', ws);
    if (ws instanceof WebSocket) {
        ws.send('{"id": "getAllUsersInfos"}');

        ws.onmessage = (event) => {
            let receiveData = JSON.parse(event.data);
            console.log(receiveData);
            switch (receiveData.id) {
                case "0x05":
                    allUsers.value = receiveData.data;
                    break;
                default:
                    break;
            }
        };
    }
}).catch(error => {
    console.log('Failed to connect:', error);
});

function excludeUser(userId: string) {
    let time = prompt("Temps d'exclusion en minutes (Si vide, retire l'exclusion)");
    wss.value.send(JSON.stringify({
        id: "excludeUser",
        userID: userId.toString(),
        exclusionTime: time
    }));
    location.reload();
}

function kickUser(userId: string) {
    let reason = prompt("Raison du kick");
    wss.value.send(JSON.stringify({
        id: "kickUser",
        userID: userId.toString(),
        reason: reason
    }));
    location.reload();
}

function banUser(userId: string) {
    let reason = prompt("Raison du ban");
    wss.value.send(JSON.stringify({
        id: "banUser",
        userID: userId.toString(),
        reason: reason
    }));
    location.reload();
}

const buttons = [
    {
        text: 'Expulser',
        class: '',
        onClick: (item: any) => excludeUser(item.id)
    },
    {
        text: 'Kick',
        class: '',
        onClick: (item: any) => kickUser(item.id)
    },
    {
        text: 'Bannir',
        class: '',
        onClick: (item: any) => banUser(item.id)
    }
]
</script>

<template>
    <DashboardParticles />
    <div class="panel">
        <Table :label="['ID', 'Nickname', 'Username', 'Join Date', 'Is Excluded', 'Excluded Time', 'Actions']"
            :data="allUsers" :buttons="buttons" />
    </div>
</template>

<style scoped>
.panel {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    align-items: center;
    position: relative;
    z-index: 1;
}
</style>