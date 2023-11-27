<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { connectWebSocketBot } from '../../../data/webSocketBot';
import { connectWebSocketSpigot } from '../../../data/webSocketSpigot.js';
import DataRectangle from '../../../components/DataRectangle.vue';
import ConsoleButton from '../../../components/ConsoleButton.vue';
import 'xterm/css/xterm.css'


const terminalRef = ref();
const wssBot = ref();
const wssSpigot = ref();
const serverRam = ref();
const serverCPU = ref();
onMounted(() => {
    const terminal = new Terminal({
        rows: 31,
        cols: 158
    });
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    let currentLine: string = '';

    // Attachez le terminal à l'élément du DOM
    terminal.open(terminalRef.value);


    // Connectez-vous au WebSocket
    connectWebSocketBot().then(ws => {
        console.log('WebSocket connection established', ws);
        if (ws instanceof WebSocket) {
            wssBot.value = ws;
            ws.onmessage = (event) => {
                let receiveData = JSON.parse(event.data);
                switch (receiveData.id) {
                    case "2x01":
                        // Nettoyez les données et écrivez-les dans le terminal
                        let cleanData: string = receiveData.data.replace(' ', '');
                        currentLine = '';
                        if (cleanData.endsWith('#')) {
                            terminal.write(cleanData + ' ');
                        } else {
                            terminal.write(cleanData + '\r\n');
                        }
                        break;
                    default:
                        break;
                }
            };
        }
    }).catch(error => {
        console.error('Failed to connect:', error);
    });

    function formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1000; // Base pour les unités décimales
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    connectWebSocketSpigot().then(ws => {
        wssSpigot.value = ws;
        console.log('WebSocket connection established', ws);
        if (ws instanceof WebSocket) {
            setInterval(() => {
                ws.send('{"id": "getServerRam"}');
                ws.send('{"id": "getServerCPU"}');
            }, 5000)
            ws.onmessage = (event) => {
                let receiveData = JSON.parse(event.data);
                switch (receiveData.id) {
                    case "1x02":
                        serverRam.value = formatBytes(receiveData.data);
                        break;
                    case "1x03":
                        serverCPU.value = receiveData.data;
                        break;
                    default:
                        break;
                }
            };
        }
    }).catch(error => {
        console.log('Failed to connect:', error);
    });

    terminal.onKey(key => {
        if (key.key === "\r") {
            terminal.write('\r\n');
            if (wssBot.value instanceof WebSocket) {
                wssBot.value.send(`{"id": "sendMessage", "data": "${currentLine}"}`);
            }
        } else if (key.key === "\u007f") {
            currentLine = currentLine.slice(0, currentLine.length - 1);
            terminal.write('\b \b');
        } else {
            currentLine += key.key;
            terminal.write(key.key);
        }
    })
});


function startServer(){
    wssBot.value.send('{"id": "startServer"}');
}

function stopServer(){
    wssBot.value.send('{"id": "stopServer"}');
}

function restartServer(){
    wssBot.value.send('{"id": "restartServer"}');
}


</script>

<template>
    <div class="back">
        <DashboardParticles />
        <div class="serverInfos">
            <DataRectangle :icon="'fas fa-solid fa-memory'" :data="serverRam" :label="'Ram'" :width="'20%'" :height="'80%'"
                :color="'#1F2937'" />
            <DataRectangle :icon="'fas fa-solid fa-microchip'" :data="serverCPU + '%'" :label="'CPU'" :width="'20%'" :height="'80%'"
                :color="'#1F2937'" />
        </div>
        <div class="console">
            <div ref="terminalRef" class="terminal"></div>
        </div>
        <div class="serverButtons">
            <ConsoleButton :width="'24%'" :color="'#476930'" :height="'30%'" :icon="'fas fa-solid fa-play'" :name="'Démarrer le serveur'" @click="_$event => startServer()"/>
            <ConsoleButton :width="'24%'" :color="'#c1121f'" :height="'30%'" :icon="'fas fa-solid fa-stop'" :name="'Arrêter le serveur'" @click="_$event => stopServer()"/>
            <ConsoleButton :width="'24%'" :color="'#023e8a'" :height="'30%'" :icon="'fas fa-solid fa-arrows-rotate'" :name="'Redémarrer le serveur'" @click="_$event => restartServer()"/>
        </div>
    </div>
</template>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono&display=swap');

.back {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
}

.serverInfos {
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: space-evenly;
}

.console {
    border: 2px solid #374151;
    width: 90%;
    height: 60%;
    padding: 10px;
    background-color: #1F2937;
    border-radius: 10px;
}

.terminal {
    width: 100%;
    height: 100%;
    font-family: 'Space Mono', normal;

}

.xterm-screen {
    width: 100% !important;
}

.serverButtons{
    display: flex;
    width: 50%;
    justify-content: space-between;
    position: relative;
    z-index: 1;
}
</style>