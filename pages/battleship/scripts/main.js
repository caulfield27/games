import { handleDocumentLoading } from "../../../utils/handleDocumentLoading.js";
import {displayShip} from "../scripts/helpers.js";

// INIT SCRIPT

handleDocumentLoading(render);

// GLOBAL VARIABLES

const mainContainer = document.getElementById("battleship_main");
const myField = document.createElement("div");
const opponentField = document.createElement("div");

const battlefieldMatrix = [
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
];
let directions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const directionsHash = {
  0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  6: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  7: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  8: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  9: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};

// FUNCTIONS

function drawBattlefields() {
  myField.classList.add("battle_field");
  opponentField.classList.add("battle_field");
  
  mainContainer.appendChild(myField);
  mainContainer.appendChild(opponentField);

  let pos = 2;

  ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"].forEach((elem, ind) => {
    const myLetterSpan = document.createElement("span");
    const myNumSpan = document.createElement("span");
    const oppsLetterSpan = document.createElement("span");
    const oppsNumSpan = document.createElement("span");

    myLetterSpan.textContent = elem;
    myNumSpan.textContent = ind + 1;
    oppsLetterSpan.textContent = elem;
    oppsNumSpan.textContent = ind + 1;

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
  });
}

function arrangeShips() {
  for(let i = 1; i < 5; i++){
    displayShip(i, myField, directions, directionsHash, battlefieldMatrix);
  };
}


function render() {
  drawBattlefields();
  arrangeShips();
  console.log('matrix: ', battlefieldMatrix);
  
}
