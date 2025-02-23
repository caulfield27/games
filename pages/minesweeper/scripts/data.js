const rows = 8;
let edgeTrack = rows - 1;
const leftEdge = new Set();
const rightEdge = new Set();
export const fields = new Array(72).fill(null).map((_, i) => {
    if (i === edgeTrack) {
        leftEdge.add(edgeTrack + 1);
        rightEdge.add(edgeTrack + rows);
        edgeTrack = edgeTrack + rows;
    }
    const bottomLeft = i === 0;
    const bottomRight = i === (rows - 1);
    const topLeft = i === (rows * rows);
    const topRight = i === ((rows * (rows + 1)) - 1);

    if ((bottomLeft || bottomRight || topLeft || topRight) && (leftEdge.has(i) || rightEdge.has(i))) {
        if (leftEdge.has(i)) {
            leftEdge.delete(i);
        } else {
            rightEdge.delete(i);
        }
    }
    const edgeCase = leftEdge.has(i) ? 1 : rightEdge.has(i) ? 2 : bottomLeft ? 3 : bottomRight ? 4 : topLeft ? 5 : topRight ? 6 : 7;
    return {
        id: i + 1,
        isMine: false,
        isFlaged: false,
        isOpen: false,
        edgeCase
    }
})

