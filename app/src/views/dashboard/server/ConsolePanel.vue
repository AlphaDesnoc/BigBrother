<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css'

import { connectWebSocket } from '../../../data/webSocketBot';

const terminalRef = ref();
const wss = ref();
onMounted(() => {
    const terminal = new Terminal();
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    let currentLine: string = '';

    // Attachez le terminal à l'élément du DOM
    terminal.open(terminalRef.value);
    fitAddon.fit();


    // Connectez-vous au WebSocket
    connectWebSocket().then(ws => {
        console.log('WebSocket connection established', ws);
        if (ws instanceof WebSocket) {
            wss.value = ws;
            ws.onmessage = (event) => {
                let receiveData = JSON.parse(event.data);
                switch (receiveData.id) {
                    case "2x01":
                        // Nettoyez les données et écrivez-les dans le terminal
                        let cleanData: string = receiveData.data.replace(' ', '');
                        console.log(`cleanData: '${cleanData}', length: ${cleanData.length}`);
                        console.log(`currentLine: '${currentLine}', length: ${currentLine.length}`);
                        currentLine = '';
                        if(cleanData.endsWith('#')){
                            terminal.write(cleanData + ' ');
                        }else{
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

    terminal.onKey(key => {
        if (key.key === "\r") {
            terminal.write('\r\n');
            if(wss.value instanceof WebSocket){
                wss.value.send(`{"id": "sendMessage", "data": "${currentLine}"}`);
            }
        }else if (key.key === "\u007f"){
            currentLine = currentLine.slice(0, currentLine.length - 1);
            terminal.write('\b \b');
        }else{
            currentLine += key.key;
            terminal.write(key.key);
        }
    })
});



</script>

<template>
    <div class="back">
        <div class="console">
            <div ref="terminalRef" class="terminal"></div>
        </div>
    </div>
</template>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono&display=swap');
.back {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
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
</style>