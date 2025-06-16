// import {nanoid} from "../../../node_modules/nanoid/nanoid.js"

// const webSocket = new WebSocket("ws://localhost:3000");
// const userId = localStorage.getItem("session-id") ?? nanoid();

// const activeUsers = document.getElementById("active-users");

// webSocket.addEventListener("open", ()=>{
//     webSocket.send(JSON.stringify({
//         type: "init",
//         data: userId
//     }));
// });

import { handleDocumentLoading } from "../../../utils/handleDocumentLoading.js";
import {thirdTierShip, firstTierShip, secondTierShip, fourthTierShip} from "../scripts/ships.js";

// init ui

handleDocumentLoading(render);

// global variables


const mainContainer = document.getElementById("battleship_main");


// helper functions


function drawBattlefields() {
    const myField = document.createElement("div");
    const opponentField = document.createElement("div");
    myField.classList.add("battle_field");
    opponentField.classList.add("battle_field");

    const ship1 = document.createElement("div");
    const ship2 = document.createElement("div");
    const ship3 = document.createElement("div");
    const ship4 = document.createElement('div');
    
    ship1.innerHTML = firstTierShip();
    ship2.innerHTML = secondTierShip();
    ship3.innerHTML = thirdTierShip();
    ship4.innerHTML = fourthTierShip();
    
    [ship1, ship2, ship3, ship4].forEach((elem)=>{
        myField.appendChild(elem);
    });


    let row = 2;
    let col = 2;
    let edge = 9;

    for (let i = 0; i < 100; i++) {
        const myCell = document.createElement("div");
        const oppsCell = document.createElement("div");

        const gridArea = `${row}/${col}`;

        myCell.classList.add("battlefield_cell");
        oppsCell.classList.add("battlefield_cell");

        myCell.style.gridArea = gridArea;
        oppsCell.style.gridArea = gridArea;

        if (i === edge) {
            myCell.style.borderRight = "1px solid gainsboro";
            oppsCell.style.borderRight = "1px solid gainsboro";
            edge += 10;
        };

        if (i > 89) {
            myCell.style.borderBottom = "1px solid gainsboro";
            oppsCell.style.borderBottom = "1px solid gainsboro";
        };

        oppsCell.role = "button";

        myField.appendChild(myCell);
        opponentField.appendChild(oppsCell);

        if (col === 11) {
            row++;
            col = 1;
        };

        col++;
    };

    mainContainer.appendChild(myField);
    mainContainer.appendChild(opponentField);

    let pos = 2;

    ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"].forEach((elem, ind) => {
        const myLetterSpan = document.createElement("span");
        const myNumSpan = document.createElement("span");
        const oppsLetterSpan = document.createElement("span");
        const oppsNumSpan = document.createElement("span");

        myLetterSpan.textContent = elem;
        myNumSpan.textContent = ind+1;
        oppsLetterSpan.textContent = elem;
        oppsNumSpan.textContent = ind+1;

        myLetterSpan.style.gridArea = `1/${pos}`;
        myLetterSpan.style.justifySelf = "center";
        myLetterSpan.style.alignSelf = "center";
        
        myNumSpan.style.gridArea = `${pos}/1`;
        myNumSpan.style.justifySelf = "center";
        myNumSpan.style.alignSelf = "center";
        
        oppsLetterSpan.style.gridArea = `1/${pos}`;
        oppsLetterSpan.style.justifySelf = "center";
        oppsLetterSpan.style.alignSelf = "center";

        oppsNumSpan.style.gridArea = `${pos}/1`;
        oppsNumSpan.style.justifySelf = "center";
        oppsNumSpan.style.alignSelf = "center";

        myField.appendChild(myLetterSpan);
        myField.appendChild(myNumSpan);

        opponentField.appendChild(oppsLetterSpan);
        opponentField.appendChild(oppsNumSpan);

        pos++;
    })
}

function render() {
    drawBattlefields();
}