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

// helper functions

function randomlyArrangeShip(shipSize) {
  if (shipSize === 1) {
    const y = directions[Math.floor(Math.random() * directions.length)];
    const xDirections = directionsHash[y];
    const x = xDirections[Math.floor(Math.random() * xDirections.length)];

    battlefieldMatrix[y][x] = true;
    directionsHash[y] = filterDirections([x, x + 1, x - 1], directionsHash[y]);

    if (directionsHash[y - 1]) {
      directionsHash[y - 1] = filterDirections([x, x - 1, x + 1], directionsHash[y - 1]);
    }

    if (directionsHash[y + 1]) {
      directionsHash[y + 1] = filterDirections([x, x - 1, x + 1], directionsHash[y + 1]);
    }

    return { x, y, dir: null };
  } else {
    let isArranged = false;
    let tryAttempt = 0;
    while (!isArranged) {
      if (tryAttempt > 1000000) {
        throw new Error("Не удалось расположить корабли");
      }

      const y = directions[Math.floor(Math.random() * directions.length)];
      const xDirections = directionsHash[y];
      const x = xDirections[Math.floor(Math.random() * xDirections.length)];

      isArranged = isFieldsAvailable(x, y, shipSize, "right");

      if (isArranged) {
        const end = horizontalyArrangeShipToMatrix(y, x, "right", shipSize);
        return { x: [x, end], y, dir: "horizontal" };
      }

      isArranged = isFieldsAvailable(x, y, shipSize, "left");

      if (isArranged) {
        const end = horizontalyArrangeShipToMatrix(y, x, "left", shipSize);
        return { x: [x, end], y, dir: "horizontal" };
      }

      isArranged = isFieldsAvailable(x, y, shipSize, "up");

      if (isArranged) {
        const end = verticallyArrangeShipToMatrix(y, x, shipSize, "up");
        return { x, y: [y, end], dir: "vertical" };
      }

      isArranged = isFieldsAvailable(x, y, shipSize, "down");

      if (isArranged) {
        const end = verticallyArrangeShipToMatrix(y, x, shipSize, "down");
        return { x, y: [y, end], dir: "vertical" };
      }

      tryAttempt++;
    }
  }
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
  const lastChild = myField.children[myField.children.length - 1];
  for (let i = 0; i < 4; i++) {
    // const ship = document.createElement("div");
    // ship.role = "button";
    // ship.innerHTML = firstTierShip();
    // ship.style.height = "fit-content";
    const { x, y } = randomlyArrangeShip(1);
    // ship.style.gridRow = y + 2;
    // ship.style.gridColumn = x + 2;
    // ship.style.justifySelf = "center";
    // myField.appendChild(ship);
    // myField.adj
    lastChild.insertAdjacentHTML("afterend", firstTierShip(x + 2, y + 2));
  }

  for (let i = 0; i < 3; i++) {
    // const ship = document.createElement("div");
    // ship.role = "button";
    // ship.innerHTML = secondTierShip();
    // ship.style.justifySelf = "center";
    const { x, y, dir } = randomlyArrangeShip(2);

    switch (dir) {
      case "horizontal":
        const xStart = Math.min(x[0], x[1]);
        const xEnd = Math.max(x[0], x[1]);
        lastChild.insertAdjacentHTML(
          "afterend",
          secondTierShip(xStart, xEnd, y + 2, "rotate(90deg)", true)
        );
        break;
      case "vertical":
        const yStart = Math.min(y[0], y[1]);
        const yEnd = Math.max(y[0], y[1]);
        lastChild.insertAdjacentHTML(
          "afterend",
          secondTierShip(yStart, yEnd, x + 2, "rotate(0deg)", false)
        );
        break;
    }
  }

  // for (let i = 0; i < 2; i++) {
  //   const ship = document.createElement("div");
  //   ship.role = "button";
  //   ship.innerHTML = thirdTierShip();
  //   ship.style.justifySelf = "center";
  //   const { x, y, dir } = randomlyArrangeShip(3);

  //   switch (dir) {
  //     case "horizontal":
  //       ship.style.transform = "rotate(90deg)";
  //       const xStart = Math.min(x[0], x[1]);
  //       const xEnd = Math.max(x[0], x[1]);
  //       ship.style.gridRow = y + 2;
  //       ship.style.gridColumn = `${xStart + 2} / ${xEnd + 2}`;
  //       break;
  //     case "vertical":
  //       ship.style.height = "fit-content";
  //       const yStart = Math.min(y[0], y[1]);
  //       const yEnd = Math.max(y[0], y[1]);
  //       ship.style.gridColumn = x + 2;
  //       ship.style.gridRow = `${yStart + 2} / ${yEnd + 2}`;
  //       break;
  //   }

  //   myField.appendChild(ship);
  // }

  // const ship = document.createElement("div");
  // ship.role = "button";
  // ship.innerHTML = fourthTierShip();
  // ship.style.justifySelf = "center";
  // const { x, y, dir } = randomlyArrangeShip(4);

  // switch (dir) {
  //   case "horizontal":
  //     ship.style.transform = "rotate(90deg)";
  //     const xStart = Math.min(x[0], x[1]);
  //     const xEnd = Math.max(x[0], x[1]);
  //     ship.style.gridRow = y + 2;
  //     ship.style.gridColumn = `${xStart + 2} / ${xEnd + 2}`;
  //     break;
  //   case "vertical":
  //     ship.style.height = "fit-content";
  //     const yStart = Math.min(y[0], y[1]);
  //     const yEnd = Math.max(y[0], y[1]);
  //     ship.style.gridColumn = x + 2;
  //     ship.style.gridRow = `${yStart + 2} / ${yEnd + 2}`;
  //     break;
  // }

  // myField.appendChild(ship);
}

function filterDirections(ship, array) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (ship.includes(array[i])) continue;
    newArray.push(array[i]);
  }

  return newArray;
}

function horizontalyArrangeShipToMatrix(y, x, dir, shipSize) {
  directionsHash[y] = filterDirections(generatePositionsArray(x, dir, shipSize), directionsHash[y]);

  if (!directionsHash[y].length) {
    directions = directions.filter((pos) => pos !== y);
  }

  if (directionsHash[y - 1] !== undefined) {
    directionsHash[y - 1] = filterDirections(
      generatePositionsArray(x, dir, shipSize),
      directionsHash[y - 1]
    );

    if (!directionsHash[y - 1].length) {
      directions = directions.filter((pos) => pos !== y - 1);
    }
  }

  if (directionsHash[y + 1] !== undefined) {
    directionsHash[y + 1] = filterDirections(
      generatePositionsArray(x, dir, shipSize),
      directionsHash[y + 1]
    );

    if (!directionsHash[y + 1].length) {
      directions = directions.filter((pos) => pos !== y + 1);
    }
  }

  let curDir = x;

  for (let i = 0; i < shipSize; i++) {
    battlefieldMatrix[y][curDir] = true;
    if (dir === "right") {
      curDir++;
    } else {
      curDir--;
    }
  }

  return dir === "left" ? curDir + 1 : curDir - 1;
}

function verticallyArrangeShipToMatrix(y, x, shipSize, dir) {
  let curDir = y;
  for (let i = 0; i < shipSize; i++) {
    directionsHash[curDir] = filterDirections([x, x + 1, x - 1], directionsHash[curDir]);
    if (!directionsHash[curDir].length) directions = directions.filter((pos) => pos !== curDir);
    battlefieldMatrix[curDir][x] = true;
    if (dir === "up") {
      curDir--;
    } else {
      curDir++;
    }
  }

  return dir === "up" ? curDir + 1 : curDir - 1;
}

function generatePositionsArray(x, dir, size) {
  const arr = [];
  let curPos = dir === "right" ? x - 1 : x + 1;
  for (let i = 0; i < size + 2; i++) {
    arr.push(curPos);
    if (dir === "right") {
      curPos++;
    } else {
      curPos--;
    }
  }

  return arr;
}

function isFieldsAvailable(x, y, size, dir) {
  let xDir = x;
  let yDir = y;

  switch (dir) {
    case "right":
      if (battlefieldMatrix[y][x - 1] !== undefined) {
        xDir = x - 1;
        size = size + 2;
      } else {
        size = size + 1;
      }
      break;
    case "left":
      if (battlefieldMatrix[y][x + 1] !== undefined) {
        xDir = x + 1;
        size = size + 2;
      } else {
        size = size + 1;
      }
      break;
    case "up":
      if (battlefieldMatrix[y + 1] !== undefined) {
        yDir = y + 1;
        size = size + 2;
      } else {
        size = size + 1;
      }
      break;
    case "down":
      if (battlefieldMatrix[y - 1] !== undefined) {
        yDir = y - 1;
        size = size + 2;
      } else {
        size = size + 1;
      }
  }

  for (let i = 0; i < size; i++) {
    if (dir === "right" || dir === "left") {
      if (i === size) {
        if (
          battlefieldMatrix[yDir][xDir] ||
          battlefieldMatrix[yDir - 1]?.[xDir] ||
          battlefieldMatrix[yDir + 1]?.[xDir]
        ) {
          return false;
        }
      } else {
        if (
          battlefieldMatrix[yDir][xDir] === undefined ||
          battlefieldMatrix[yDir][xDir] ||
          battlefieldMatrix[yDir + 1]?.[xDir] ||
          battlefieldMatrix[yDir - 1]?.[xDir]
        ) {
          return false;
        }
      }
      if (dir === "right") {
        xDir++;
      } else {
        xDir--;
      }
    } else if (dir === "up" || dir == "down") {
      if (i === size) {
        if (
          battlefieldMatrix[yDir]?.[xDir] ||
          battlefieldMatrix[yDir]?.[xDir + 1] ||
          battlefieldMatrix[yDir]?.[xDir - 1]
        ) {
          return false;
        }
      } else {
        if (
          battlefieldMatrix[yDir]?.[xDir] === undefined ||
          battlefieldMatrix[yDir]?.[xDir] ||
          battlefieldMatrix[yDir]?.[xDir - 1] ||
          battlefieldMatrix[yDir]?.[xDir + 1]
        ) {
          return false;
        }
      }
      if (dir === "up") {
        yDir--;
      } else {
        yDir++;
      }
    }
  }

  return true;
}

function render() {
  drawBattlefields();
  arrangeShips();
  console.log("matrix: ", battlefieldMatrix);
  console.log("hash: ", directionsHash);
}
