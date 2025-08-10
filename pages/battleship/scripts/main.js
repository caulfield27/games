import { handleDocumentLoading } from "../../../utils/utils.js";
import { displayShip, ships } from "../scripts/helpers.js";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid@4.0.2/index.browser.js";
import { elementsArray, gameSessionData, checkQuery, sendInvite, chatBtn, chatContainer, notification } from "./socket.js";

// INIT SCRIPT

handleDocumentLoading(render);

// GLOBAL VARIABLES

export const myField = document.getElementById("battlefield");
const infoSection = document.getElementById("info-section");
const actions = document.getElementById("actions");
const main = document.getElementById("battleship_main");
const instruction = document.getElementById("instructions");
const play = document.getElementById("find-game-btn");
const quit = document.getElementById("quit-btn");
const shuffleBtn = document.getElementById("shuffle-btn");

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
let directionsHash = {
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

// STRAIGHT LISTENERS  
shuffleBtn.addEventListener("click",arrangeShips)
document.getElementById("copy-btn").addEventListener("click", handleCopyLink);

// FUNCTIONS

const switcher = document.getElementById("switcher");
const buttons = switcher.querySelectorAll("button");
const inviteBlock = document.getElementById("invite-block");
const findGameBtn = document.getElementById("find-game-btn");
const link = document.getElementById("link");
let inviteLink = null;

buttons.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    let isRight = switcher.classList.contains("right");
    if ((isRight && idx === 1) || (!isRight && idx == 0)) return;

    switcher.classList.toggle("right", idx === 1);
    isRight = switcher.classList.contains("right");
    if (isRight) {
      findGameBtn.style.display = "none";
      inviteBlock.style.display = "flex";
      if (!inviteLink) {
        const key = nanoid();
        inviteLink = `${window.location.href}?room=${key}`;
        link.textContent = inviteLink;
        sendInvite(key);
      }
    } else {
      inviteBlock.style.display = "none";
      findGameBtn.style.display = "";
    }
  });
});


function handleCopyLink() {
  if (link.textContent) {
    navigator.clipboard
      .writeText(link.textContent)
      .then(() =>
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: "Ссылка успешно скопирована!",
          showConfirmButton: false,
          timer: 1000,
        })
      )
      .catch(() =>
        Swal.fire({
          position: "top-end",
          icon: "error",
          text: "Не удалось скопировать ссылку.",
          showConfirmButton: false,
          timer: 1000,
        })
      );
  }
}

function arrangeShips() {
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

  while (ships.length) {
    const { ship } = ships.pop();
    myField.removeChild(ship);
  };

  while (elementsArray.length) {
    myField.removeChild(elementsArray.pop());
  };

  directions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  directionsHash = {
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

  for (let i = 1; i < 5; i++) {
    displayShip(i, myField, directions, directionsHash, gameSessionData.myFiledMatrix);
  }
}

export function reset() {
  main.style.justifyContent = "flex-start";
  main.style.gap = "80px";
  if (gameSessionData.opponentField) {
    main.removeChild(gameSessionData.opponentField);
  }

  infoSection.style.display = "none";
  actions.style.display = "flex";
  play.textContent = "Найти противника";
  play.classList.remove("play_btn_loading");
  instruction.textContent = "Расположите корабли";
  quit.style.display = "none";
  shuffleBtn.style.display = "flex";

  gameSessionData.myName = "";
  gameSessionData.opponentField = null;
  gameSessionData.opponentName = "";
  gameSessionData.sessionId = null;

  chatBtn.classList.add("hidden");
  chatContainer.classList.add("hidden");
  notification.classList.add("hidden");
  notification.textContent = "0";

  const myReadyWrapper = document.getElementById("ready-wrapper");
  const opReadyWrapper = document.getElementById("opp-ready-wrapper");
  opReadyWrapper && opReadyWrapper.remove();
  myReadyWrapper.style.display = "none";

  arrangeShips();
}


function render() {
  arrangeShips();
  checkQuery();
}
