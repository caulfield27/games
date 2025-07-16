const arrangeStatus = {
  canArrange: false,
  coordinates: null,
};

let lastTempElem = null;
let coordinateDif = null;
let prevPositionSet = null;
let target = null;
export const ships = [];

function filterDirections(ship, array) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (ship.includes(array[i])) continue;
    newArray.push(array[i]);
  };

  return newArray;
}

function horizontalyArrangeShipToMatrix(
  y,
  x,
  dir,
  shipSize,
  directionsHash,
  directions,
  battlefieldMatrix
) {
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

function verticallyArrangeShipToMatrix(
  y,
  x,
  shipSize,
  dir,
  directionsHash,
  battlefieldMatrix,
  directions
) {
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

function displayShip(size, myField, directions, directionsHash, battlefieldMatrix) {
  if (size === 1) {
    for (let i = 0; i < 4; i++) {
      const ship = document.createElement("div");
      ship.style.border = "2px solid blue";
      ship.style.cursor = "grab";
      const { x, y } = randomlyArrangeShip(1, directions, directionsHash, battlefieldMatrix);
      ship.dataset.coordinates = JSON.stringify({ x, y, dir: null });
      ship.style.gridRow = y + 1;
      ship.style.gridColumn = x + 1;
      const draggableShip = new Draggabilly(ship, {
        containment: myField,
      });

      draggableShip.on("dragStart", () => {
        target = ship;
      });

      draggableShip.on("dragMove", (_, pointer) => {
        if (lastTempElem) {
          myField.removeChild(lastTempElem);
          lastTempElem = null;
        }

        const { xDir, yDir } = getCoordinates(myField, pointer);
        checkPosition(xDir, yDir, battlefieldMatrix, null, size, myField, ship);
      });

      draggableShip.on("dragEnd", () => {
        cancelAbsoluteDisplay(target);
        prevPositionSet = null;
        coordinateDif = null;
        if (lastTempElem) {
          myField.removeChild(lastTempElem);
          lastTempElem = null;
        }

        if (arrangeStatus.canArrange && arrangeStatus.coordinates) {
          const { coordinates } = arrangeStatus;
          const prevCoordinates = JSON.parse(ship.dataset?.coordinates ?? null);

          battlefieldMatrix[prevCoordinates.y][prevCoordinates.x] = false;
          battlefieldMatrix[coordinates.y][coordinates.x] = true;
          ship.style.gridRow = coordinates.y + 1;
          ship.style.gridColumn = coordinates.x + 1;

          ship.dataset.coordinates = JSON.stringify(coordinates);
        }
        arrangeStatus.canArrange = false;
        arrangeStatus.coordinates = null;
      });

      ships.push({
        ship,
        draggableShip
      });
      myField.appendChild(ship);
    }
  } else {
    const amount = size === 2 ? 3 : size === 3 ? 2 : 1;

    for (let i = 0; i < amount; i++) {
      const ship = document.createElement("div");
      ship.style.cursor = "grab";
      ship.style.border = "2px solid blue";
      const { x, y, dir } = randomlyArrangeShip(
        size,
        directions,
        directionsHash,
        battlefieldMatrix
      );

      ship.dataset.coordinates = JSON.stringify({ x, y, dir });

      switch (dir) {
        case "horizontal":
          const xStart = Math.min(x[0], x[1]);
          const xEnd = Math.max(x[0], x[1]);
          ship.style.gridRow = y + 1;
          ship.style.gridColumn = `${xStart + 1} / ${xEnd + 2}`;
          break;
        case "vertical":
          const yStart = Math.min(y[0], y[1]);
          const yEnd = Math.max(y[0], y[1]);
          ship.style.gridColumn = x + 1;
          ship.style.gridRow = `${yStart + 1} / ${yEnd + 2}`;
          break;
      }

      const draggableShip = new Draggabilly(ship, {
        containment: true,
      });

      draggableShip.on("dragStart", () => {
        target = ship;
        const { coordinates } = ship.dataset;
        const parsedCoordinates = JSON.parse(coordinates);

        const array = Array.isArray(parsedCoordinates.x)
          ? parsedCoordinates.x
          : parsedCoordinates.y;
        prevPositionSet = new Set();
        const [start, end] = [Math.min(...array), Math.max(...array)];
        for (let i = start; i <= end; i++) {
          prevPositionSet.add(i);
        }
      });

      draggableShip.on("dragMove", (_, pointer) => {
        if (lastTempElem) {
          myField.removeChild(lastTempElem);
          lastTempElem = null;
        }

        const { xDir, yDir } = getCoordinates(myField, pointer);
        checkPosition(xDir, yDir, battlefieldMatrix, dir, size, myField, ship);
      });

      draggableShip.on("dragEnd", (event) => {
        prevPositionSet = null;
        coordinateDif = null;
        if (lastTempElem) {
          myField.removeChild(lastTempElem);
          lastTempElem = null;
        }

        cancelAbsoluteDisplay(target);

        if (arrangeStatus.canArrange && arrangeStatus.coordinates) {
          const prevCoordinates = JSON.parse(ship.dataset?.coordinates ?? null);
          const { coordinates } = arrangeStatus;

          const isVertical = Array.isArray(prevCoordinates.y);
          const prevArray = isVertical ? prevCoordinates.y : prevCoordinates.x;
          const prevStart = Math.min(...prevArray);
          const prevEnd = Math.max(...prevArray);

          for (let i = prevStart; i <= prevEnd; i++) {
            battlefieldMatrix[isVertical ? i : prevCoordinates.y][
              isVertical ? prevCoordinates.x : i
            ] = false;
          }

          const curArray = isVertical ? coordinates.y : coordinates.x;
          const start = Math.min(...curArray);
          const end = Math.max(...curArray);

          for (let i = start; i <= end; i++) {
            battlefieldMatrix[isVertical ? i : coordinates.y][
              isVertical ? coordinates.x : i
            ] = true;
          }

          ship.style.gridRow = isVertical ? `${start + 1} / ${end + 2}` : coordinates.y + 1;
          ship.style.gridColumn = isVertical ? coordinates.x + 1 : `${start + 1} / ${end + 2}`;

          ship.dataset.coordinates = JSON.stringify(coordinates);
        }
        arrangeStatus.canArrange = false;
        arrangeStatus.coordinates = null;
      });

      ships.push({
        ship,
        draggableShip
      });
      myField.appendChild(ship);
    }
  }
}

function checkPosition(x, y, battlefieldMatrix, dir, size, myField, shipElement) {
  const prevCoordinates = JSON.parse(shipElement.dataset.coordinates);
  const prevX = prevCoordinates.x;
  const prevY = prevCoordinates.y; 

  if (size === 1) {
    if (
      !battlefieldMatrix[y][x] &&
      (!battlefieldMatrix[y][x + 1] || (x + 1 === prevX && y === prevY)) &&
      (!battlefieldMatrix[y][x - 1] || (x - 1 === prevX && y === prevY)) &&
      (!battlefieldMatrix[y - 1]?.[x] || (x === prevX && y - 1 === prevY)) &&
      (!battlefieldMatrix[y - 1]?.[x - 1] || (x - 1 === prevX && y - 1 === prevY)) &&
      (!battlefieldMatrix[y - 1]?.[x + 1] || (x + 1 === prevX && y - 1 === prevY)) &&
      (!battlefieldMatrix[y + 1]?.[x] || (x === prevX && y + 1 === prevY)) &&
      (!battlefieldMatrix[y + 1]?.[x - 1] || (x - 1 === prevX && y + 1 === prevY)) &&
      (!battlefieldMatrix[y + 1]?.[x + 1] || (x + 1 === prevX && y + 1 === prevY))
    ) {
      lastTempElem = document.createElement("div");
      lastTempElem.style.border = "2px solid lightgreen";
      lastTempElem.style.gridRow = y + 1;
      lastTempElem.style.gridColumn = x + 1;

      myField.appendChild(lastTempElem);

      arrangeStatus.canArrange = true;
      arrangeStatus.coordinates = { x, y };
    } else {
      arrangeStatus.canArrange = false;
      arrangeStatus.coordinates = null;
    }
  } else {
    let isAvailable = true;
    const pivot = dir === "horizontal" ? x : y;
    if (coordinateDif === null) {
      coordinateDif = getDiff(dir === "horizontal" ? prevX : prevY, pivot);
    }

    const start = Math.max(0, pivot - coordinateDif);
    let dynamicStart = start;
    let dynamicSize = size;

    if (dir === "horizontal") {
      if (battlefieldMatrix[y][start + size] !== undefined) {
        dynamicSize++;
      }

      if (battlefieldMatrix[y][start - 1] !== undefined) {
        dynamicStart--;
        dynamicSize++;
      }
    } else {
      if (battlefieldMatrix[start + size] !== undefined) {
        dynamicSize++;
      }

      if (battlefieldMatrix[start - 1] !== undefined) {
        dynamicStart--;
        dynamicSize++;
      }
    }

    const staticPrevDir = Array.isArray(prevX) ? prevY : prevX;

    for (let i = 0; i < dynamicSize; i++) {
      if (dir === "horizontal") {
        if (
          battlefieldMatrix[y][dynamicStart] !== false ||
          (battlefieldMatrix[y - 1] !== undefined &&
            battlefieldMatrix[y - 1][dynamicStart] &&
            !(staticPrevDir === y - 1 && prevPositionSet?.has(dynamicStart))) ||
          (battlefieldMatrix[y + 1] !== undefined &&
            battlefieldMatrix[y + 1][dynamicStart] &&
            !(staticPrevDir === y + 1 && prevPositionSet?.has(dynamicStart)))
        ) {
          isAvailable = false;
        }
      } else {
        if (
          battlefieldMatrix[dynamicStart]?.[x] !== false ||
          (battlefieldMatrix[dynamicStart]?.[x - 1] &&
            !(x - 1 === staticPrevDir && prevPositionSet?.has(dynamicStart))) ||
          (battlefieldMatrix[dynamicStart]?.[x + 1] &&
            !(x + 1 === staticPrevDir && prevPositionSet?.has(dynamicStart)))
        ) {
          isAvailable = false;
        }
      }
      dynamicStart++;
    }

    if (isAvailable) {
      lastTempElem = document.createElement("div");
      lastTempElem.style.border = "2px solid lightgreen";

      switch (dir) {
        case "horizontal":
          lastTempElem.style.gridRow = y + 1;
          lastTempElem.style.gridColumn = `${start + 1} / ${start + size + 1}`;
          break;
        case "vertical":
          lastTempElem.style.gridColumn = x + 1;
          lastTempElem.style.gridRow = `${start + 1} / ${start + size + 1}`;
          break;
      }

      myField.appendChild(lastTempElem);

      arrangeStatus.canArrange = true;
      x = dir === "horizontal" ? [start, start + size - 1] : x;
      y = dir === "vertical" ? [start, start + size - 1] : y;
      arrangeStatus.coordinates = { x, y };
    } else {
      arrangeStatus.canArrange = false;
      arrangeStatus.coordinates = null;
    }
  }
}

function getDiff(arr, pos) {
  const [start, end] = [Math.min(...arr), Math.max(...arr)];
  let counter = 0;
  for (let i = start; i <= end; i++) {
    if (i - pos === 0) {
      break;
    }
    counter++;
  }

  return counter;
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

function isFieldsAvailable(x, y, size, dir, battlefieldMatrix) {
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

export function isLose(matrix){
  return matrix.every((arr)=> arr.every((elem) => !elem));
};

function randomlyArrangeShip(shipSize, directions, directionsHash, battlefieldMatrix) {
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

      isArranged = isFieldsAvailable(x, y, shipSize, "right", battlefieldMatrix);

      if (isArranged) {
        const end = horizontalyArrangeShipToMatrix(
          y,
          x,
          "right",
          shipSize,
          directionsHash,
          directions,
          battlefieldMatrix
        );
        return { x: [x, end], y, dir: "horizontal" };
      }

      isArranged = isFieldsAvailable(x, y, shipSize, "left", battlefieldMatrix);

      if (isArranged) {
        const end = horizontalyArrangeShipToMatrix(
          y,
          x,
          "left",
          shipSize,
          directionsHash,
          directions,
          battlefieldMatrix
        );
        return { x: [x, end], y, dir: "horizontal" };
      }

      isArranged = isFieldsAvailable(x, y, shipSize, "up", battlefieldMatrix);

      if (isArranged) {
        const end = verticallyArrangeShipToMatrix(
          y,
          x,
          shipSize,
          "up",
          directionsHash,
          battlefieldMatrix,
          directions
        );
        return { x, y: [y, end], dir: "vertical" };
      }

      isArranged = isFieldsAvailable(x, y, shipSize, "down", battlefieldMatrix);

      if (isArranged) {
        const end = verticallyArrangeShipToMatrix(
          y,
          x,
          shipSize,
          "down",
          directionsHash,
          battlefieldMatrix,
          directions
        );
        return { x, y: [y, end], dir: "vertical" };
      }

      tryAttempt++;
    }
  }
}

function cancelAbsoluteDisplay(target) {
  if (target) {
    target.style.transform = "";
    target.style.left = "";
    target.style.top = "";
  }
}

export function getCoordinates(field, pointer) {
  const gridRect = field.getBoundingClientRect();
  
  const relX = pointer.pageX - gridRect.left;
  const relY = pointer.pageY - gridRect.top;

  const cellSize = 30;

  const col = Math.floor(relX / cellSize);
  const row = Math.floor(relY / cellSize);

  const x = Math.max(0, Math.min(9, col));
  const y = Math.max(0, Math.min(9, row));

  return { xDir: x, yDir: y };
}

export { displayShip };
