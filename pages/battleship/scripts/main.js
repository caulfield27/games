import { handleDocumentLoading } from "../../../utils/handleDocumentLoading.js";
import { displayShip } from "../scripts/helpers.js";
import { gameSessionData, startGame } from "./socket.js";

// INIT SCRIPT

handleDocumentLoading(render);

// GLOBAL VARIABLES

const myField = document.createElement("div");
const opponentField = document.createElement("div");

gameSessionData.myFiledMatrix = [
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
  const myParentField = document.createElement("div");
  const opponentParentField = document.createElement("div");
  const myWrapper = document.getElementById("my_wrapper");
  const oppWrapper = document.getElementById("opp_wrapper");

  myParentField.classList.add("parent_field");
  myParentField.classList.add("my_position");
  opponentParentField.classList.add("parent_field");
  opponentParentField.classList.add("opp_position");
  myField.classList.add("battle_field");
  myField.classList.add("my_position");
  opponentField.classList.add("battle_field");
  opponentField.classList.add("opp_position");

  myWrapper.appendChild(myParentField);
  myWrapper.appendChild(myField);
  oppWrapper.appendChild(opponentParentField);
  oppWrapper.appendChild(opponentField);

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

    myParentField.appendChild(myLetterSpan);
    myParentField.appendChild(myNumSpan);

    opponentParentField.appendChild(oppsLetterSpan);
    opponentParentField.appendChild(oppsNumSpan);

    pos++;
  });
}

function arrangeShips() {
  for (let i = 1; i < 5; i++) {
    displayShip(i, myField, directions, directionsHash, gameSessionData.myFiledMatrix);
  }
}

export function reset() {
  gameSessionData = {
    myName: "",
    opponentName: "",
    myFiledMatrix: [
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
    ],
    sessionId: null,
  };
  const play = document.getElementById("play");
  play.textContent = "Играть";
  play.onclick = startGame;
  arrangeShips();
}

function render() {
  drawBattlefields();
  arrangeShips();
}
