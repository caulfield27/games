import { getFields, level } from "./data.js";
import { displayDigits, setTimer, startTimer, updateTablo } from "./digits.js";
import { killSmile, smileIsAlive } from "./drawSVG.js";

const rows = level.rows;
let fields = getFields(level);
let isGameStart = false;
let isGameOver = false;
let intervalCancel = null;
let flagsCounter = level.mines;

function restart(newLvl = level) {
  fields = getFields(newLvl);
  isGameStart = false;
  isGameOver = false;
  flagsCounter = level.mines;
  window.minesweeperSeconds = 0;
  smile.innerHTML = smileIsAlive();
  if (intervalCancel) {
    intervalCancel();
  }
  render();
}

const smile = document.getElementById("smile");
smile.addEventListener("click", restart);

document.getElementById("level_form").addEventListener("change", (ev)=>{
  localStorage.setItem("level", ev.target.value);
  restart(ev.target.value);
})

const container = document.getElementById("container");
const flagsCounterDigits = [
  document.getElementById("first_num"),
  document.getElementById("second_num"),
  document.getElementById("third_num"),
];

container.style.gridTemplateRows = `repeat(${level.cols}, ${level.size})`;
container.style.gridTemplateColumns = `repeat(${level.rows}, ${level.size})`;

render();

function generateFields(filedsAmount) {
  let html = "";
  for (let i = 0; i < filedsAmount; i++) {
    html += `<button class="field" value="${i}"></button>`;
  }

  return html;
}

function generateMines(firstInd) {
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

function setField() {
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
        intervalCancel = startTimer();
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
      };

      if (isWin(fields, level.mines)) {
        if(intervalCancel){
          clearInterval(intervalCancel);
        };
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Поздравляю, вы выиграли!",
            text: `Вы нашли все мины за ${window?.minesweeperSeconds ?? ""} секунд.`,
            confirmButtonText: "Сыграть ещё"
          }).then((res) => {
            if (res?.isConfirmed) {
              restart();
            }
          })
        }, [500])
      }

    });
  });
}

function checkField(i, buttons) {
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

function gameOver(failIndex) {
  Swal.fire({
    icon: "error",
    title: "Вы проиграли",
    text: "К сожалению, вы наступили на мину.",
    showCancelButton: true,
    confirmButtonText: "Попробовать ещё раз",
    cancelButtonText: "Посмотреть результат"
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

function render() {
  setField();
  displayDigits();
  setTimer();
}

function isWin(fields, mines) {
  let openCounter = 0;
  for (const field of fields) {
    if (field.isOpen) {
      openCounter++;
    }
  };
  return (openCounter + mines) === fields.length;
}
