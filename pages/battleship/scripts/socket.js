import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid@4.0.2/index.browser.js";
import { removeQueryParams } from "../../../utils/utils.js";
import { getCoordinates, isLose, ships } from "./helpers.js";
import { myField, reset } from "./main.js";

// GLOBAL VARIABLES

const socket = new WebSocket("wss://games-online-service.onrender.com");

export const gameSessionData = {
  myName: "",
  opponentName: "",
  opponentField: null,
  myFiledMatrix: [],
  sessionId: null,
};
const activeUsers = document.getElementById("active-users");
const play = document.getElementById("find-game-btn");
const infoSection = document.getElementById("info-section");
const nameSpan = document.getElementById("name");
const actions = document.getElementById("actions");
const main = document.getElementById("battleship_main");
const instruction = document.getElementById("instructions");
const quit = document.getElementById("quit-btn");
const buttonsMatrx = [];
let originalMatrix = [];
export const elementsArray = [];

// HELPER FUNCTIONS
async function startGame() {
  const result = await Swal.fire({
    title: "Введите ваш никнейм",
    input: "text",
    inputPlaceholder: "никнейм",
    confirmButtonText: "Продолжить",
  });

  if (result?.value && socket.readyState === socket.OPEN) {
    play.classList.add("play_btn_loading");
    play.textContent = "Подбор противника...";
    gameSessionData.myName =
      result.value.length > 15 ? result.value.slice(0, 15) + "..." : result.value;
    socket.send(
      JSON.stringify({
        type: "selection",
        data: {
          name: result.value,
        },
      })
    );
  }
}

play.onclick = startGame;

function generateOpponentField(name) {
  const field = document.createElement("div");
  field.classList.add("battle_field");
  const lettersGrid = document.createElement("div");
  const numbersGrid = document.createElement("div");

  ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"].forEach((letter, idx) => {
    const letterSpan = document.createElement("span");
    const numberSpan = document.createElement("span");
    letterSpan.textContent = letter;
    numberSpan.textContent = idx + 1;
    lettersGrid.appendChild(letterSpan);
    numbersGrid.appendChild(numberSpan);
  });
  lettersGrid.classList.add("letters_grid");
  numbersGrid.classList.add("numbers_grid");

  const infoSection = document.createElement("div");
  const nameSpan = document.createElement("span");
  nameSpan.textContent = name;
  infoSection.classList.add("info-section");
  infoSection.appendChild(nameSpan);

  field.appendChild(lettersGrid);
  field.appendChild(numbersGrid);
  field.appendChild(infoSection);

  main.appendChild(field);

  let col = 1;
  let row = 1;
  for (let i = 0; i < 100; i++) {
    const btn = document.createElement("button");
    btn.classList.add("cell_btn");
    btn.style.gridArea = `${row}/${col}`;
    btn.style.position = "relative";
    btn.style.padding = "0";

    btn.addEventListener("click", (event) => {
      const coordinates = getCoordinates(field, event);
      socket.send(
        JSON.stringify({
          type: "check",
          data: {
            sessionId: gameSessionData.sessionId,
            coordinates,
          },
        })
      );
    });

    if (!Array.isArray(buttonsMatrx[row - 1])) {
      buttonsMatrx[row - 1] = [];
    }

    buttonsMatrx[row - 1][col - 1] = btn;
    field.appendChild(btn);

    if (col === 10) {
      row++;
      col = 0;
    }

    col++;
  }

  gameSessionData.opponentField = field;
}

function getRange(x, y, arr, matrix) {
  if (!arr[y][x - 1] && !arr[y][x + 1] && !arr[y - 1]?.[x] && !arr[y + 1]?.[x]) {
    return {
      range: null,
      isVertical: false,
      isDestroyed: true
    }
  }

  const isVertical = arr[y + 1]?.[x] || arr[y - 1]?.[x];
  let start = isVertical ? y : x;
  let end = isVertical ? y : x;

  if (isVertical) {
    while (arr[start]?.[x] || arr[end]?.[x]) {
      if (arr[start]?.[x]) start--;
      if (arr[end]?.[x]) end++;
    }
  } else {
    while (arr[y][start] || arr[y][end]) {
      if (arr[y][start]) start--;
      if (arr[y][end]) end++;
    }
  }

  let isDestroyed = true;
  for (let i = start + 1; i < end; i++) {
    if (isVertical) {
      if (matrix[i]?.[x]) {
        isDestroyed = false;
      }
    } else {
      if (matrix[y]?.[i]) {
        isDestroyed = false;
      }
    }
  }

  return {
    range: [start, end],
    isVertical,
    isDestroyed
  };
}

function disableAround(x, y, start, end, isVertical, isSingle) {
  if (isSingle) {
    [
      buttonsMatrx[y][x + 1], buttonsMatrx[y][x - 1],
      buttonsMatrx[y - 1]?.[x], buttonsMatrx[y - 1]?.[x - 1],
      buttonsMatrx[y - 1]?.[x + 1], buttonsMatrx[y + 1]?.[x],
      buttonsMatrx[y + 1]?.[x - 1], buttonsMatrx[y + 1]?.[x + 1],
    ].forEach((btn) => {
      if (btn) {
        btn.classList.add("miss_field");
      }
    });
  } else {
    for (let i = start; i <= end; i++) {
      if (isVertical) {
        const btnLeft = buttonsMatrx[i]?.[x + 1];
        const btnRight = buttonsMatrx[i]?.[x - 1];
        if (i === start || i === end) {
          const btn = buttonsMatrx[i]?.[x];
          if (btn) {
            btn.classList.add("miss_field");
          }
        }

        if (btnLeft) {
          btnLeft.classList.add("miss_field");
        }

        if (btnRight) {
          btnRight.classList.add("miss_field");
        }
      } else {
        const btnLeft = buttonsMatrx[y - 1]?.[i];
        const btnRight = buttonsMatrx[y + 1]?.[i];
        if (i === start || i === end) {
          const btn = buttonsMatrx[y]?.[i];
          if (btn) {
            btn.classList.add("miss_field");
          }
        }

        if (btnLeft) {
          btnLeft.classList.add("miss_field");
        }

        if (btnRight) {
          btnRight.classList.add("miss_field");
        }
      }
    }
  }
}

export function checkQuery() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("room")) {
    const interval = setInterval(() => {
      if (socket.readyState === socket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "invite",
            data: {
              key: params.get("room"),
            },
          })
        );
        clearInterval(interval);
      }
    }, 500);
  }
}

export function sendInvite(key) {
  if (socket.readyState === socket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "invite",
        data: { key },
      })
    );
  }
}

// SOCKET LISTENERS

socket.addEventListener("open", () => {
  console.info("Соеденение установлено");
  const userId = nanoid();
  socket.clientId = userId;
  socket.send(JSON.stringify({ type: "init", data: userId }));
});

socket.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);

  const { type, data } = msg;
  switch (type) {
    case "activeUsersCount":
      activeUsers.textContent = data;
      break;
    case "gameFound":
      const params = new URLSearchParams(window.location.search);
      if (params.has("room")) {
        removeQueryParams("room");
      }
      const { name, sessionId } = data;
      gameSessionData.opponentName = name;
      gameSessionData.sessionId = sessionId;

      infoSection.style.display = "flex";
      nameSpan.textContent = gameSessionData.myName;

      actions.style.display = "none";
      document.getElementById("shuffle-btn").style.display = "none";

      main.style.justifyContent = "space-between";
      main.style.gap = "";

      quit.style.display = "block";
      quit.addEventListener("click", () => {
        Swal.fire({
          icon: "warning",
          title: "Вы действительно хотите покинуть игру?",
          showCancelButton: true,
          cancelButtonText: "Отмена",
          confirmButtonText: "Покинуть",
        }).then((res) => {
          if (res?.isConfirmed) {
            if (socket.readyState === socket.OPEN && gameSessionData.sessionId) {
              socket.send(
                JSON.stringify({
                  type: "closeRoom",
                  data: {
                    roomId: gameSessionData.sessionId,
                  },
                })
              );
            }
            reset();
          }
        });
      });

      ships.forEach((elem) => {
        const { draggableShip, ship } = elem;
        ship.style.cursor = "default";
        draggableShip.disable();
      });

      originalMatrix = gameSessionData.myFiledMatrix.map((arr) => [...arr]);
      generateOpponentField(name);

      Swal.fire({
        icon: "success",
        text: "Игра началась.",
        showConfirmButton: false,
        timer: 1300,
      });

      break;
    case "turn":
      instruction.textContent = data === 1 ? "Ваш ход" : "Ход противника";
      for (const array of buttonsMatrx) {
        for (const btn of array) {
          if (btn) {
            if (data === 1) {
              btn.classList.remove("disabled_btn");
            } else {
              btn.classList.add("disabled_btn");
            }
          }
        }
      }
      break;
    case "roomClosed":
      Swal.fire({
        icon: "info",
        title: "Игра закончена",
        text: `Противник ${gameSessionData.opponentName ?? ""} покинул игру`,
      }).then(() => reset());
      break;
    case "check":
      const x = data.coordinates?.xDir;
      const y = data.coordinates?.yDir;

      const { myFiledMatrix } = gameSessionData;
      const message = {
        type: "status",
        data: {
          roomId: gameSessionData.sessionId,
          coordinates: data.coordinates,
        },
      };
      const span = document.createElement("span");
      span.style.gridRow = y + 1;
      span.style.gridColumn = x + 1;
      span.style.position = "relative";
      elementsArray.push(span);
      myField.appendChild(span);

      if (myFiledMatrix[y]?.[x]) {
        myFiledMatrix[y][x] = false;
        span.classList.add("hitted_field");
        if (isLose(myFiledMatrix)) {
          message.data["status"] = "lose";
        } else {
          const { range, isVertical, isDestroyed } = getRange(x, y, originalMatrix, myFiledMatrix)

          if (isDestroyed) {
            message.data["status"] = "destroy";
            message.data["range"] = { range, isVertical };
          } else {
            message.data["status"] = "hit";
          }
        }
      } else {
        span.classList.add("miss_field");
        message.data["status"] = "miss";
      }

      socket.send(JSON.stringify(message));
      break;
    case "status":
      const status = data.status;
      const dataCoordinates = data.coordinates;
      const xDir = dataCoordinates.xDir;
      const yDir = dataCoordinates.yDir;

      const btn = buttonsMatrx[yDir][xDir];
      if (btn) {
        btn.classList.add(status === "miss" ? "miss_field" : "hitted_field");
      }

      if (status === "lose") {
        Swal.fire({
          icon: "success",
          title: "Поздравляем, вы выиграли битву!",
          text: "Вы смогли уничтожить весь флот противника",
        }).then(() => reset());

      } else if (status === "destroy") {
        const { range, isVertical } = data.range;
        if (!range) {
          disableAround(xDir, yDir, null, null, isVertical, true);
        } else {
          disableAround(xDir, yDir, range[0], range[1], isVertical, false);
        }
      }
      break;
    case "lose":
      Swal.fire({
        icon: "error",
        title: "К сожалению, вы проиграли битву.",
        text: "Но не проиграли войну!",
      }).then(() => reset());
  }
});

window.addEventListener("beforeunload", () => {
  if (socket.readyState === socket.OPEN && gameSessionData.sessionId) {
    socket.send(
      JSON.stringify({
        type: "closeRoom",
        data: {
          roomId: gameSessionData.sessionId,
        },
      })
    );
  }
});
