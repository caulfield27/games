import { fields } from "./data.js";

let isGameStart = false;
const rows = 8;
const container = document.getElementById("container");
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
  while (mines.size !== 12) {
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
      e.preventDefault();
      if (fields[buttonInd].isFlaged) {
        buttons[buttonInd].innerHTML = "";
        fields[buttonInd].isFlaged = false;
      } else {
        buttons[buttonInd].innerHTML = drawFlag();
        fields[buttonInd].isFlaged = true;
      }
    });

    button.addEventListener("click", (event) => {
      if (fields[buttonInd].isOpen || fields[buttonInd].isFlaged) return;

      if (fields[buttonInd].isMine) {
        gameOver();
        return;
      }

      if (!isGameStart) {
        isGameStart = true;
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
            buttons[button].style.color = "#FC0D1B";
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

function gameOver() {
  alert("Вы проиграли!");
  container.childNodes.forEach((child, ind) => {
    child.classList.add("open_field");
    fields[ind].isOpen = true;
    if (fields[ind].isMine) {
      child.innerHTML = drawMine();
    }
  });
}

function drawMine() {
  return `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Shorter Spikes -->
        <line x1="50" y1="10" x2="50" y2="30" stroke="black" stroke-width="4"/>
        <line x1="50" y1="90" x2="50" y2="70" stroke="black" stroke-width="4"/>
        <line x1="10" y1="50" x2="30" y2="50" stroke="black" stroke-width="4"/>
        <line x1="90" y1="50" x2="70" y2="50" stroke="black" stroke-width="4"/>
        <line x1="25" y1="25" x2="35" y2="35" stroke="black" stroke-width="4"/>
        <line x1="75" y1="75" x2="65" y2="65" stroke="black" stroke-width="4"/>
        <line x1="75" y1="25" x2="65" y2="35" stroke="black" stroke-width="4"/>
        <line x1="25" y1="75" x2="35" y2="65" stroke="black" stroke-width="4"/>
        
        <!-- Mine body -->
        <circle cx="50" cy="50" r="20" fill="black" stroke="black" stroke-width="2"/>
        
        <!-- Highlight -->
        <circle cx="44" cy="44" r="5" fill="white"/>
    </svg>`;
  //   return `<svg
  //     width="30" height="30"
  //     viewBox="0 0 100 100"
  //     xmlns="http://www.w3.org/2000/svg"
  //     fill="black"
  // >
  //     <circle cx="50" cy="50" r="20" fill="black" />
  //     <circle cx="50" cy="50" r="10" fill="darkred" />
  //     <line x1="50" y1="10" x2="50" y2="30" stroke="black" stroke-width="5" />
  //     <line x1="50" y1="70" x2="50" y2="90" stroke="black" stroke-width="5" />
  //     <line x1="10" y1="50" x2="30" y2="50" stroke="black" stroke-width="5" />
  //     <line x1="70" y1="50" x2="90" y2="50" stroke="black" stroke-width="5" />

  //     <line x1="20" y1="20" x2="35" y2="35" stroke="black" stroke-width="5" />
  //     <line x1="65" y1="65" x2="80" y2="80" stroke="black" stroke-width="5" />
  //     <line x1="65" y1="35" x2="80" y2="20" stroke="black" stroke-width="5" />
  //     <line x1="20" y1="80" x2="35" y2="65" stroke="black" stroke-width="5" />
  // </svg>
  // `;
}

function drawFlag() {
  return `<svg width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="5" width="4" height="35" fill="black"/>
            <polygon points="26,8 40,15 26,22" fill="red"/>
            <rect x="15" y="40" width="20" height="5" fill="black"/>
          </svg>`;
}

function render() {
  setField();
}
