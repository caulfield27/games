import { handleDocumentLoading } from "../../../utils/handleDocumentLoading.js";
import { displayShip } from "../scripts/helpers.js";
import {nanoid} from "../../../node_modules/nanoid/nanoid.js";

// INIT SCRIPT

handleDocumentLoading(render);

// GLOBAL VARIABLES

const myField = document.getElementById("battlefield");

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

const switcher = document.getElementById("switcher");
const buttons = switcher.querySelectorAll("button");
const inviteBlock = document.getElementById("invite-block");
const findGameBtn = document.getElementById("find-game-btn");
const link = document.getElementById("link");

buttons.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    let isRight = switcher.classList.contains("right");
    if((isRight && idx === 1) || (!isRight && idx == 0)) return;

    switcher.classList.toggle('right', idx === 1);
    isRight = switcher.classList.contains("right");
    if(isRight){
      findGameBtn.style.display = "none";
      inviteBlock.style.display = "flex";
      link.textContent = `${window.location.href}?room=${nanoid()}`;
    }else{
      inviteBlock.style.display = "none";
      findGameBtn.style.display = ""
    }
  });
});

document.getElementById("copy-btn").addEventListener("click", handleCopyLink);

function handleCopyLink(){
  if(link.textContent){
    navigator.clipboard.writeText(link.textContent)
    .then(()=> Swal.fire({
      position: "top-end",
      icon: "success",
      text: "Ссылка успешно скопирована!",
      showConfirmButton: false,
      timer: 1000
    }))
    .catch(()=> Swal.fire({
      position: "top-end",
      icon: "error",
      text: "Не удалось скопировать ссылку.",
      showConfirmButton: false,
      timer: 1000
    }))
  }
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
  arrangeShips();
}
