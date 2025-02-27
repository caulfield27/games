import { getFields, level } from "./data.js";
import { displayDigits, setTimer, startTimer, updateTablo } from "./digits.js";
import { drawFlag, drawMine, killSmile, smileIsAlive } from "./drawSVG.js";

const rows = level.rows;
let fields = getFields();
let isGameStart = false;
let isGameOver = false;
let intervalCancel = null;

const smile = document.getElementById("smile");
smile.addEventListener('click',()=>{
  fields = getFields();
  isGameStart = false;
  isGameOver = false;
  smile.innerHTML = smileIsAlive();
  if(intervalCancel){
    intervalCancel();
  }
  render();
});

const container = document.getElementById("container");
const flagsCounterDigits = [
  document.getElementById("first_num"),
  document.getElementById("second_num"),
  document.getElementById("third_num")
]
let flagsCounter = level.mines;
container.style.gridTemplateRows = `repeat(${level.cols}, ${level.size})`;
container.style.gridTemplateColumns = `repeat(${level.rows}, ${level.size})`;


render();

function generateFields(filedsAmount) {
  let html = "";
  for (let i = 0; i < filedsAmount; i++) {
    html += `<button class="field" value="${i}"></button>`;
  };

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
        flagsCounter+=1;
        updateTablo(flagsCounter, flagsCounterDigits)
        buttons[buttonInd].innerHTML = "";
        fields[buttonInd].isFlaged = false;
      } else {
        if(flagsCounter < 1) return;
        flagsCounter-=1;
        updateTablo(flagsCounter, flagsCounterDigits)
        buttons[buttonInd].innerHTML = drawFlag();
        fields[buttonInd].isFlaged = true;
      }
    });

    button.addEventListener("click", (event) => {
      if (fields[buttonInd].isOpen || fields[buttonInd].isFlaged || isGameOver) return;

      if (fields[buttonInd].isMine) {
        smile.innerHTML = killSmile();
        isGameOver = true;
        if(intervalCancel){
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
  alert("Вы проиграли!");
  container.childNodes.forEach((child, ind) => {
    if (ind === failIndex) {
      child.classList.add("failed");
    }

    if (fields[ind].isMine) {
      child.classList.add("open_field");
      child.innerHTML = drawMine();
    }
  });
}

function render() {
  setField();
  displayDigits();
  setTimer();
}
