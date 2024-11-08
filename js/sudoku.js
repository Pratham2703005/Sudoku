const newGrid = (size) => {
    let arr = Array.from({ length: size }, () => Array(size).fill(CONSTANT.UNASSIGNED));
    return arr;
};

const isColSafe = (grid, col, value) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        if (grid[row][col] === value) return false;
    }
    return true;
};

const isRowSafe = (grid, row, value) => {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
        if (grid[row][col] === value) return false;
    }
    return true;
};

const isBoxSafe = (grid, boxRow, boxCol, value) => {
    for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
        for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
            if (grid[row + boxRow][col + boxCol] === value) return false;
        }
    }
    return true;
};

const isSafe = (grid, row, col, value) => {
    return (
        isColSafe(grid, col, value) &&
        isRowSafe(grid, row, value) &&
        isBoxSafe(grid, row - (row % 3), col - (col % 3), value) &&
        value !== CONSTANT.UNASSIGNED
    );
};

const findUnassignedPos = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
};

const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const isFullGrid = (grid) => {
    return grid.every(row => row.every(value => value !== CONSTANT.UNASSIGNED));
};

const sudokuCreate = (grid) => {
    let unassignedPos = { row: -1, col: -1 };
    if (!findUnassignedPos(grid, unassignedPos)) return true;

    let numberList = shuffleArray([...CONSTANT.NUMBERS]);
    let row = unassignedPos.row;
    let col = unassignedPos.col;

    for (let num of numberList) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;

            if (sudokuCreate(grid)) return true;

            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    }

    return false;
};

const sudokuCheck = (grid) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            let value = grid[row][col];
            if (value !== CONSTANT.UNASSIGNED && !isSafe(grid, row, col, value)) {
                return false;
            }
        }
    }
    return true;
};

const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

const removeCells = (grid, level) => {
    let res = JSON.parse(JSON.stringify(grid));
    let attempts = level;
    while (attempts > 0) {
        let row = rand();
        let col = rand();
        if (res[row][col] !== CONSTANT.UNASSIGNED) {
            res[row][col] = CONSTANT.UNASSIGNED;
            attempts--;
        }
    }
    return res;
};

const sudokuGen = (level) => {
    let sudoku = newGrid(CONSTANT.GRID_SIZE);
    if (sudokuCreate(sudoku)) {
        let question = removeCells(sudoku, level);
        return { original: sudoku, question };
    }
    return undefined;
};
