export const levels = {
  easy: {
    rows: 10,
    cols: 8,
    mines: 10,
    size: "45px",
    mineSize: "35px",
    flagSize: "35px",
  },
  medium: {
    rows: 18,
    cols: 14,
    mines: 40,
    size: "35px",
    mineSize: "30px",
    flagSize: "25px",
  },
  hard: {
    rows: 24,
    cols: 20,
    mines: 99,
    size: "25px",
    mineSize: "25px",
    flagSize: "20px",
  },
};

window.level = levels['medium'];

export function getFields(level) {
  const rows = level.rows;
  let edgeTrack = level.rows - 1;
  const leftEdge = new Set();
  const rightEdge = new Set();
  return new Array(rows * level.cols).fill(null).map((_, i) => {
    if (i === edgeTrack) {
      leftEdge.add(edgeTrack + 1);
      rightEdge.add(edgeTrack + rows);
      edgeTrack = edgeTrack + rows;
    }
    const bottomLeft = i === 0;
    const bottomRight = i === rows - 1;
    const topLeft = i === rows * rows;
    const topRight = i === rows * (rows + 1) - 1;

    if (
      (bottomLeft || bottomRight || topLeft || topRight) &&
      (leftEdge.has(i) || rightEdge.has(i))
    ) {
      if (leftEdge.has(i)) {
        leftEdge.delete(i);
      } else {
        rightEdge.delete(i);
      }
    }
    const edgeCase = leftEdge.has(i)
      ? 1
      : rightEdge.has(i)
      ? 2
      : bottomLeft
      ? 3
      : bottomRight
      ? 4
      : topLeft
      ? 5
      : topRight
      ? 6
      : 7;
    return {
      id: i + 1,
      isMine: false,
      isFlaged: false,
      isOpen: false,
      edgeCase,
    };
  });
}

export const digitSegments = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "g", "e", "d"],
  3: ["a", "b", "c", "d", "g"],
  4: ["f", "g", "b", "c"],
  5: ["a", "f", "g", "c", "d"],
  6: ["a", "f", "e", "d", "c", "g"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "g", "f"],
};
