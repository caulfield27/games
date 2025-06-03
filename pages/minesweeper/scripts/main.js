import { getFields, levels } from "./data.js";
import { displayDigits, setTimer, startTimer, updateTablo } from "./digits.js";
import { killSmile, smileIsAlive } from "./drawSVG.js";

// VARIABLES

let { level } = window;
let rows = level.rows;
let fields = getFields(level);
let isGameStart = false;
let isGameOver = false;
let intervalCancel = null;
let flagsCounter = level.mines;
const smile = document.getElementById("smile");
const container = document.getElementById("container");
const options = document.getElementById("my_dropdown");
const flagsCounterDigits = [
  document.getElementById("first_num"),
  document.getElementById("second_num"),
  document.getElementById("third_num"),
];

// STRAIGHT LISTENERS

smile.addEventListener("click", restart);
document.addEventListener("DOMContentLoaded", render);
options.addEventListener("change", (event) => {
  const newLvl = levels[event?.detail?.value?.toLowerCase()];
  
  if (newLvl) {
    level = newLvl;
    restart();
  }
});

// HELPER FUNCTIONS

function render() {
  setField(fields);
  displayDigits(level.mines);
  setTimer();
  container.style.gridTemplateRows = `repeat(${level.cols}, ${level.size})`;
  container.style.gridTemplateColumns = `repeat(${level.rows}, ${level.size})`;
};



function generateMines(firstInd) {
  // GENERATE MINES ON GAME START
  const mines = new Set();
  while (mines.size !== level.mines) {
    const minePosition = Math.floor(Math.random() * fields.length);
    if (minePosition === firstInd) continue;
    if (!mines.has(minePosition)) {
      mines.add(minePosition);
      fields[minePosition] = { ...fields[minePosition], isMine: true };
    }
  }
}



function isWin(fields, mines) {
  // CHECKING WIN CONDITION
  let openCounter = 0;
  for (const field of fields) {
    if (field.isOpen) {
      openCounter++;
    }
  }
  return openCounter + mines === fields.length;
}



function gameOver(failIndex, type = "mine") {
  // LOSE CASE HANDLER
  Swal.fire({
    icon: "error",
    title: "Вы проиграли",
    text:
      type === "mine"
        ? "К сожалению, вы наступили на мину :("
        : "К сожалению вы не успели найти все мину во время :(",
    showCancelButton: true,
    confirmButtonText: "Попробовать ещё раз",
    cancelButtonText: "Посмотреть результат",
  }).then((res) => {
    if (res?.isConfirmed) {
      restart();
    } else {
      container.childNodes.forEach((child, ind) => {
        if (ind === failIndex) {
          child.classList.add("failed");
        }

        if (fields[ind].isMine) {
          child.classList.add("open_field");
          child.innerHTML = `<img style="width: ${level.mineSize};" src="/pages/minesweeper/images/naval-mine.svg" alt="mine">`;
        }
      });
    }
  });
}



function checkField(i, buttons) {
  // RECURSIVE CHECK MINES AROUND
  buttons[i].classList.add("open_field");
  fields[i].isOpen = true;

  const { edgeCase } = fields[i];
  let neighbours = null;

  switch (edgeCase) {
    case 1:
      neighbours = [i + 1, i - rows, i + rows, i - rows + 1, i + rows + 1];
      break;
    case 2:
      neighbours = [i - 1, i - rows, i + rows, i - rows - 1, i + rows - 1];
      break;
    case 3:
      neighbours = [i + 1, i + rows, i + rows + 1];
      break;
    case 4:
      neighbours = [i - 1, i + rows, i + rows - 1];
      break;
    case 5:
      neighbours = [i + 1, i - rows, i - rows + 1];
      break;
    case 6:
      neighbours = [i - 1, i - rows, i - rows - 1];
      break;
    case 7:
      neighbours = [
        i + 1,
        i - 1,
        i - rows,
        i + rows,
        i - rows + 1,
        i - rows - 1,
        i + rows + 1,
        i + rows - 1,
      ];
      break;
    default:
      neighbours = [];
      break;
  }

  let counter = 0;
  const validNeighbours = [];
  for (const neighbour of neighbours) {
    if (buttons[neighbour]) {
      validNeighbours.push(neighbour);
      if (fields[neighbour]?.isMine) {
        counter++;
      }
    }
  }

  if (counter === 0) {
    for (const neighbour of validNeighbours) {
      if (fields[neighbour]?.isMine || fields[neighbour]?.isOpen || fields[neighbour]?.isFlaged) {
        continue;
      }
      const minesAround = checkField(neighbour, buttons);
      if (minesAround) {
        buttons[neighbour].innerHTML = minesAround;
        switch (minesAround) {
          case 1:
            buttons[neighbour].style.color = "#0B24FB";
            break;
          case 2:
            buttons[neighbour].style.color = "#0E7A11";
            break;
          case 3:
            buttons[neighbour].style.color = "#852123";
            break;
          default:
            buttons[neighbour].style.color = "#FC0D1B";
        }
      }
    }
  } else {
    return counter;
  }
}



function restart() {
  // RESET ALL STATES
  fields = getFields(level);
  isGameStart = false;
  isGameOver = false;
  flagsCounter = level.mines;
  rows = level.rows;
  window.minesweeperSeconds = 0;
  smile.innerHTML = smileIsAlive();
  if (intervalCancel) {
    intervalCancel();
  }
  render();
}



function generateFields(filedsAmount) {
  // CREATE BUTTONS FOR GAME
  let html = "";
  for (let i = 0; i < filedsAmount; i++) {
    html += `<button class="field" value="${i}"></button>`;
  }

  return html;
}



function setField() {
  // SET CONTAINER AND ADD LISTENERS
  container.innerHTML = generateFields(fields.length);
  const buttons = container.childNodes;
  buttons.forEach((button, buttonInd) => {
    button.addEventListener("contextmenu", (e) => {
      if (isGameOver) return;
      e.preventDefault();
      if (fields[buttonInd].isFlaged) {
        flagsCounter += 1;
        updateTablo(flagsCounter, flagsCounterDigits);
        buttons[buttonInd].innerHTML = "";
        fields[buttonInd].isFlaged = false;
      } else {
        if (flagsCounter < 1) return;
        flagsCounter -= 1;
        updateTablo(flagsCounter, flagsCounterDigits);
        buttons[
          buttonInd
        ].innerHTML = `<img style="width: ${level.flagSize};" src="/pages/minesweeper/images/flag.png" alt="flag icon">`;
        fields[buttonInd].isFlaged = true;
      }
    });

    button.addEventListener("click", (event) => {
      if (fields[buttonInd].isOpen || fields[buttonInd].isFlaged || isGameOver) return;

      if (fields[buttonInd].isMine) {
        smile.innerHTML = killSmile();
        isGameOver = true;
        if (intervalCancel) {
          intervalCancel();
        }
        gameOver(buttonInd);
        return;
      }

      if (!isGameStart) {
        isGameStart = true;
        intervalCancel = startTimer(() => gameOver(null, "time"));
        generateMines(buttonInd);
      }

      const minesAround = checkField(buttonInd, buttons);
      if (minesAround) {
        buttons[buttonInd].innerHTML = minesAround;
        switch (minesAround) {
          case 1:
            buttons[buttonInd].style.color = "#0B24FB";
            break;
          case 2:
            buttons[buttonInd].style.color = "#0E7A11";
            break;
          case 3:
            buttons[buttonInd].style.color = "#852123";
            break;
          default:
            buttons[buttonInd].style.color = "#FC0D1B";
        }
      }

      if (isWin(fields, level.mines)) {
        if (intervalCancel) {
          intervalCancel();
        }
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Поздравляю, вы выиграли!",
            text: `Вы нашли все мины за ${window?.minesweeperSeconds ?? ""} секунд.`,
            confirmButtonText: "Сыграть ещё",
          }).then((res) => {
            if (res?.isConfirmed) {
              restart();
            }
          });
        }, [500]);
      }
    });
  });
}
