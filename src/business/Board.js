import { defaultCell } from "./Cell";
import { transferToBoard } from "./Tetrominoes";
import { movePlayer } from "../business/PlayerController";

export const buildBoard = ({ rows, columns }) => {
    const buildRows = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => ({ ...defaultCell }))
    );

    return {
        rows: buildRows,
        size: { rows, columns }
    };
};

export const nextBoard = ({ board, player, resetPlayer, addLinesCleared }) => {
    const { tetromino, position } = player;

    //copy and cleared spaces used by pieces that 
    //hadn't collided and occupied spaces permanently
    let rows = board.rows.map((row) =>
        row.map((cell) => (cell.occupied ? cell : { ...defaultCell }))
    );

    const dropPosition = findDropPosition({
        board,
        position,
        shape: tetromino.shape
    });

    const className = `${tetromino.className} ${player.isFastDropping ? "" : "ghost"}`;


    rows = transferToBoard({
        className,
        isOccupied: player.isFastDropping,
        position: dropPosition,
        rows,
        shape: tetromino.shape
    });

    //place the piece
    //if it collided, mark the board cells as collided
    if (!player.isFastDropping) {
        rows = transferToBoard({
            className: tetromino.className,
            isOccupied: player.collided,
            position,
            rows,
            shape: tetromino.shape
        });
    }

    //check for the cleared lines
    const blankRow = rows[0].map((_) => ({ ...defaultCell }));
    let linesCleared = 0;
    rows = rows.reduce((acc, row) => {
        if (row.every((column) => column.occupied)) {
            linesCleared++;
            acc.unshift([...blankRow]);
        } else {
            acc.push(row);
        }

        return acc;
    }, []);

    if (linesCleared > 0) {
        addLinesCleared(linesCleared);
    }

    //if we collided, reset the player 
    if (player.collided || player.isFastDropping) {
        resetPlayer();
    }

    //return the next board
    return {
        rows,
        size: { ...board.size }
    };
};

const findDropPosition = ({ board, position, shape }) => {
    let max = board.size.rows - position.row + 1;
    let row = 0;

    for (let i = 0; i < max; i++) {
        const delta = { row: i, column: 0 };
        const result = movePlayer({ delta, position, shape, board });
        const { collided } = result;

        if (collided) {
            break;
        }
        row = position.row + i;
    }
    return { ...position, row };
};

export const isWithinBoard = ({ board, position, shape }) => {
    for (let y = 0; y < shape.length; y++) {
        const row = y + position.row;

        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const column = x + position.column;
                const isValidPosition = board.rows[row] && board.rows[row][column];

                if (!isValidPosition) return false;
            }
        }
    }

    return true;
};


export const hasCollision = ({ board, position, shape }) => {
    for (let y = 0; y < shape.length; y++) {
        const row = y + position.row;

        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const column = x + position.column;

                if (
                    board.rows[row] &&
                    board.rows[row][column] &&
                    board.rows[row][column].occupied
                ) {
                    return true;
                }
            }
        }
    }
    return false;
};

