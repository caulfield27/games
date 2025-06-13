import {nanoid} from "../../../node_modules/nanoid/nanoid.js"

const webSocket = new WebSocket("ws://localhost:3000");
const userId = localStorage.getItem("session-id") ?? nanoid();

const activeUsers = document.getElementById("active-users");

webSocket.addEventListener("open", ()=>{
    webSocket.send(JSON.stringify({
        type: "init",
        data: userId
    }));
});


