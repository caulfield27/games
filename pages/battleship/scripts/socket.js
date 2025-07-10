import {nanoid} from "../../../node_modules/nanoid/nanoid.js";
const socket = new WebSocket("ws://localhost:3000");

const activeUsers = document.getElementById("active-users");

socket.addEventListener("open", ()=>{
    console.log('Соеденение установлено',);
    const userId = nanoid();
    socket.send(JSON.stringify({type:"init", data: userId}));
    socket.send(JSON.stringify({type:"activeUsersCount", data: null}))
});


socket.addEventListener("message", (ev)=>{
    const msg = JSON.parse(ev.data);
    const {type, data} = msg;
    switch(type){
        case "activeUsersCount":
            activeUsers.textContent = data;
            break;
    }
})