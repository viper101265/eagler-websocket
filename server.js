const WebSocket = require("ws");
const net = require("net");

const MC_HOST = "calandralark.aternos.host"; // your Aternos server
const MC_PORT = 49164;

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

wss.on("connection", (ws) => {
    const mc = net.connect(MC_PORT, MC_HOST);

    mc.on("connect", () => {
        console.log("Connected to Aternos server");
    });

    mc.on("data", (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });

    mc.on("error", (err) => {
        console.error("Minecraft connection error:", err.message);
        ws.close();
    });

    ws.on("message", (msg) => {
        mc.write(msg);
    });

    ws.on("close", () => {
        mc.end();
    });
});

// Heartbeat to auto-wake Aternos
setInterval(() => {
    const test = net.connect(MC_PORT, MC_HOST, () => {
        test.end();
    });
    test.on("error", () => {});
}, 15000);

console.log("WebSocket proxy running");
