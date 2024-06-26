export function connectWebSocketBot(shouldReconnect = true): Promise<WebSocket | boolean> {
    return new Promise((resolve, reject) => {
        let ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Connected to server');
            resolve(ws);
        };

        // ws.send("{'id': 'getTotalUsers'}")

        ws.onclose = () => {
            console.log('Disconnected from server');
            if (shouldReconnect) {
                console.log('Attempting to reconnect...');
                setTimeout(() => {
                    connectWebSocket().then(resolve).catch(reject);
                }, 3000);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.close();
            reject(false);
        };
    });
}