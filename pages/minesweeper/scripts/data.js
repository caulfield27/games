const isMobile = window.innerWidth <= 480;

export const levels = {
  easy: {
    label: "Лёгкий",
    rows: 10,
    cols: 8,
    mines: 10,
    size: !isMobile ? "45px" : "34.6px",
    mineSize: !isMobile ? "35px" : "25px",
    flagSize: !isMobile ? "35px" : "25px",
  },
  medium: {
    label: "Средний",
    rows: !isMobile ? 18 : 12,
    cols: !isMobile ? 14 : 21,
    mines: 40,
    size: !isMobile ? "35px" : "28.8px",
    mineSize: !isMobile ? "30px" : "20px",
    flagSize: !isMobile ? "35px" : "20px",
  },
  hard: {
    label: "Сложный",
    rows: !isMobile ? 24 : 16,
    cols: !isMobile ? 20 : 30,
    mines: 99,
    size: !isMobile ? "25px" : "21.5px",
    mineSize: !isMobile ? "30px" : "15px",
    flagSize: !isMobile ? "35px" : "15px",
  },
};

export const dropdownOptions = [
  {
    title: "Лёгкий",
    value: "easy"
  },
  {
    title: "Средний",
    value: "medium"
  },
  {
    title: "Сложный",
    value: "hard"
  }
]

window.level = levels['easy'];

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
