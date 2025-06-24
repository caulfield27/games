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
import { thirdTierShip, firstTierShip, secondTierShip, fourthTierShip } from "../scripts/ships.js";

// init ui

handleDocumentLoading(render);

// global variables

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
const directions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
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

// helper functions

function randomlyArrangeShip(shipSize) {
  let dir = null;
  if (shipSize === 1) {
    const y = directions[Math.floor(Math.random() * directions.length)];
    const xDirections = directionsHash[y];
    const x = xDirections[Math.floor(Math.random() * xDirections.length)];

    battlefieldMatrix[y][x] = true;
    if (battlefieldMatrix[y][x + 1] !== undefined) {
      battlefieldMatrix[y][x + 1] = null;
    };
    if (battlefieldMatrix[y][x - 1] !== undefined) {
      battlefieldMatrix[y][x - 1] = null;
    }

    directionsHash[y] = filterDirections([x, x + 1, x - 1], directionsHash[y]);
    if (directionsHash[y - 1]) {
      directionsHash[y - 1] = filterDirections([x, x - 1, x + 1], directionsHash[y - 1]);
      battlefieldMatrix[y - 1][x] = null;
      if (battlefieldMatrix[y - 1][x + 1] !== undefined) {
        battlefieldMatrix[y - 1][x + 1] = null;
      };
      if (battlefieldMatrix[y - 1][x - 1] !== undefined) {
        battlefieldMatrix[y - 1][x - 1] = null;
      }
    }

    if (directionsHash[y + 1]) {
      directionsHash[y + 1] = filterDirections([x, x - 1, x + 1], directionsHash[y + 1]);
      battlefieldMatrix[y + 1][x] = null;
      if (battlefieldMatrix[y + 1][x + 1] !== undefined) {
        battlefieldMatrix[y + 1][x + 1] = null;
      };
      if (battlefieldMatrix[y + 1][x - 1] !== undefined) {
        battlefieldMatrix[y + 1][x - 1] = null;
      }
    }

    return { x: [x], y: [y], dir };
  } else {
    let isArranged = false;
    while (!isArranged) {
      const y = directions[Math.floor(Math.random() * directions.length)];
      const xDirections = directionsHash[y];
      const x = xDirections[Math.floor(Math.random() * xDirections.length)];

      isArranged = isFieldsAvailable(x, y, shipSize, "right");

      if (isArranged) {
        directionsHash[y][x] = filterDirections(generatePositionsArray(x, "right", shipSize), directionsHash[y][x]);
        let curDir = directionsHash[y][x-1] !== undefined ? x - 1 : x; 
        shipSize = directionsHash[y][x - 1] !== undefined ? x + 2 : x + 1
        for (let i = 0; i < shipSize; i++) {
          battlefieldMatrix[y][curDir] = (curDir === (x - 1) || curDir === (x + shipSize)) ? null : false;

          if (battlefieldMatrix[y - 1] !== undefined) {
            battlefieldMatrix[y - 1][curDir] = null;
          };

          if (battlefieldMatrix[y + 1] !== undefined) {
            battlefieldMatrix[y + 1][curDir] = null;
          }
          curDir++;
        };

        break;
      };

      isArranged = isFieldsAvailable(x, y, shipSize, "left");

      if (isArranged) {
        directionsHash[y][x] = filterDirections(generatePositionsArray(x, "left", shipSize), directionsHash[y][x]);
        let curDir = x + 1;
        for (let i = 0; i < shipSize + 2; i++) {
          battlefieldMatrix[y][curDir]
        }
      }
    }
  }

  return res;

}

function drawBattlefields() {
  myField.classList.add("battle_field");
  opponentField.classList.add("battle_field");

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
    }

    if (i > 89) {
      myCell.style.borderBottom = "1px solid gainsboro";
      oppsCell.style.borderBottom = "1px solid gainsboro";
    }

    oppsCell.role = "button";

    myField.appendChild(myCell);
    opponentField.appendChild(oppsCell);

    if (col === 11) {
      row++;
      col = 1;
    }

    col++;
  }

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
  for (let i = 0; i < 4; i++) {
    const ship = document.createElement("div");
    ship.role = "button";
    ship.innerHTML = firstTierShip();
    const { x, y } = randomlyArrangeShip(1);
    ship.style.gridRow = y[0] + 2;
    ship.style.gridColumn = x[0] + 2;
    myField.appendChild(ship);
  };

  // const ship3 = document.createElement("div");
  // ship3.role = "button";
  // ship3.innerHTML = thirdTierShip();
  // const { x, y, dir } = randomlyArrangeShip(3);

  // if (dir === 1) {
  //   ship3.style.transform = `rotate(90deg)`;
  // };
  // ship3.style.gridRow = y[0] + 2;
  // ship3.style.gridColumn = `${(x[0] + 2)}/ span ${(x[1] + 2) - (x[0] + 2)}`;
  // myField.appendChild(ship3);

}

function filterDirections(ship, array) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (ship.includes(array[i])) continue;
    newArray.push(array[i]);
  }

  return newArray;
}

function generatePositionsArray(x, dir, size) {
  const arr = [];
  let curPos = x - 1;
  for (let i = 0; i < size + 2; i++) {
    arr.push(curPos);
    if (dir === "right") {
      curPos++;
    } else {
      curPos--;
    };
  };

  return arr;
}


function isFieldsAvailable(x, y, size, dir) {
  for (let i = 0; i < size; i++) {
    if (dir === "right" || dir === "left") {
      if (dir === "right") {
        x++;
      } else {
        x--;
      };
      if ((i === (size - 1) && directions[y][x] !== undefined && directions[y][x] === null) ||
        ((i !== (size - 1) && directions[y][x] === undefined) || directions[y][x] === null) ||
        (directions[y + 1] !== undefined && directions[y + 1][x] === null) ||
        (directions[y - 1] !== undefined && directions[y - 1][x] === null)
      ) {
        return false;
      }
    } else if (dir === "up" || dir == "down") {
      if (dir === "up") {
        y--;
      } else {
        y++;
      };
      if ((i === (size - 1) && directions[y][x] !== undefined && directions[y][x] === null) ||
        ((i !== (size - 1) && directions[y][x] === undefined) || directions[y][x] === null) ||
        (directions[y][x - 1] !== undefined && directions[y][x - 1] === null) ||
        (directions[y][x + 1] !== undefined && directions[y][x + 1] === null)
      ) {
        return false;
      };
    }
  }
  return true;
}

function render() {
  drawBattlefields();
  arrangeShips();
  console.log(battlefieldMatrix);

}
