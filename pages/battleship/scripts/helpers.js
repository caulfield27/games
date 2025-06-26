const arrangeStatus = {
  canArrange: false,
  coordinates: null
};

let lastTempElem = null;


function filterDirections(ship, array) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (ship.includes(array[i])) continue;
    newArray.push(array[i]);
  }

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
      ship.style.border = "3px solid blue";
      ship.style.cursor = "grab";
      const { x, y } = randomlyArrangeShip(1, directions, directionsHash, battlefieldMatrix);
      ship.dataset.coordinates = JSON.stringify({x,y,dir: null});
      ship.style.gridRow = y + 2;
      ship.style.gridColumn = x + 2;
      const draggableShip = new Draggabilly(ship, {
        containment: myField,
      });

      draggableShip.on("dragMove", (_, pointer) => {
        if(lastTempElem){
          myField.removeChild(lastTempElem);
          lastTempElem = null;
        };

        const { x, y } = getCoordinates(myField, pointer);
        checkPosition(x,y,battlefieldMatrix,null, true, myField);
      });

      draggableShip.on("dragEnd", (event, _) => {
        cancelAbsoluteDisplay(event.target);
        if(lastTempElem){
          myField.removeChild(lastTempElem);
          lastTempElem = null;
        };

        if(arrangeStatus.canArrange && arrangeStatus.coordinates){
          const {coordinates} = arrangeStatus;

          battlefieldMatrix[coordinates.y][coordinates.x] = true;
        };
      });

      myField.appendChild(ship);
    }
  } else {
    const amount = size === 2 ? 3 : size === 3 ? 2 : 1;

    for (let i = 0; i < amount; i++) {
      const ship = document.createElement("div");
      ship.style.cursor = "grab";
      ship.style.border = "3px solid blue";
      const { x, y, dir } = randomlyArrangeShip(
        size,
        directions,
        directionsHash,
        battlefieldMatrix
      );

      ship.dataset.coordinates = JSON.stringify({x,y,dir});

      switch (dir) {
        case "horizontal":
          const xStart = Math.min(x[0], x[1]);
          const xEnd = Math.max(x[0], x[1]);
          ship.style.gridRow = y + 2;
          ship.style.gridColumn = `${xStart + 2} / ${xEnd + 3}`;
          break;
        case "vertical":
          const yStart = Math.min(y[0], y[1]);
          const yEnd = Math.max(y[0], y[1]);
          ship.style.gridColumn = x + 2;
          ship.style.gridRow = `${yStart + 2} / ${yEnd + 3}`;
          break;
      }

      const draggableShip = new Draggabilly(ship, {
        containment: true,
      });

      // draggableShip.on("dragMove", (_, pointer) => {
      //   const { x, y } = getCoordinates(myField, pointer);
      //   canArrange(x,y,battlefieldMatrix);
      // });

      // draggableShip.on("dragEnd", () => {
      //   cancelAbsoluteDisplay();
      // });

      myField.appendChild(ship);
    }
  }
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
  target.style.transform = "";
  target.style.left = "";
  target.style.top = "";
}

function getCoordinates(field, pointer) {
  const gridRect = field.getBoundingClientRect();

  const relX = pointer.pageX - gridRect.left;
  const relY = pointer.pageY - gridRect.top;

  const cellSize = field.clientWidth / 10;

  const col = Math.floor(relX / cellSize);
  const row = Math.floor(relY / cellSize);

  const x = Math.max(0, Math.min(9, col));
  const y = Math.max(0, Math.min(9, row));

  return { x, y };
}

function checkPosition(x, y, battlefieldMatrix, dir, isSingle, myField) {
  if(isSingle){
    if(
      !battlefieldMatrix[y][x] &&
      !battlefieldMatrix[y][x+1] &&
      !battlefieldMatrix[y][x-1] &&
      !battlefieldMatrix[y-1]?.[x] &&
      !battlefieldMatrix[y-1]?.[x-1] &&
      !battlefieldMatrix[y-1]?.[x+1] &&
      !battlefieldMatrix[y+1]?.[x] &&
      !battlefieldMatrix[y+1]?.[x-1] &&
      !battlefieldMatrix[y+1]?.[x+1]
    ){
      lastTempElem = document.createElement("div");
      lastTempElem.style.border = "3px solid lightgreen";
      lastTempElem.style.gridRow = y+2;
      lastTempElem.style.gridColumn = x+2;
      
      myField.appendChild(lastTempElem);
      
      arrangeStatus.canArrange = true;
      arrangeStatus.coordinates = {x,y};
    }else{
      arrangeStatus.canArrange = false;
      arrangeStatus.coordinates = null;
    }
  }
}

export { displayShip };
