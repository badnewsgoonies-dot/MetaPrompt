import type { Grid, Cell, Position, CellType } from '../types/grid';
import type { Tower } from '../types/tower';
import { Ok, Err, type Result } from '../utils/result';

/**
 * Create a grid with specified dimensions and path
 */
export const createGrid = (
  width: number,
  height: number,
  pathPositions: readonly Position[]
): Grid => {
  const pathSet = new Set(pathPositions.map((p) => `${p.x},${p.y}`));

  // Determine spawn (first path cell) and portal (last path cell)
  const spawn = pathPositions[0];
  const portal = pathPositions[pathPositions.length - 1];

  const cells: Cell[][] = [];

  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      const posKey = `${x},${y}`;
      let type: CellType;

      if (spawn && x === spawn.x && y === spawn.y) {
        type = 'spawn';
      } else if (portal && x === portal.x && y === portal.y) {
        type = 'portal';
      } else if (pathSet.has(posKey)) {
        type = 'path';
      } else {
        type = 'placeable';
      }

      row.push({
        position: { x, y },
        type,
        tower: null,
      });
    }
    cells.push(row);
  }

  return {
    width,
    height,
    cells,
    path: pathPositions,
  };
};

/**
 * Get cell at position
 */
export const getCell = (grid: Grid, pos: Position): Result<Cell, string> => {
  if (pos.x < 0 || pos.x >= grid.width || pos.y < 0 || pos.y >= grid.height) {
    return Err(`Position out of bounds: (${pos.x}, ${pos.y})`);
  }

  const cell = grid.cells[pos.y]?.[pos.x];
  if (!cell) {
    return Err(`Cell not found at position: (${pos.x}, ${pos.y})`);
  }

  return Ok(cell);
};

/**
 * Place tower at position
 */
export const placeTower = (
  grid: Grid,
  tower: Tower
): Result<Grid, string> => {
  const cellResult = getCell(grid, tower.position);
  if (!cellResult.ok) return cellResult;

  const cell = cellResult.value;

  if (cell.type !== 'placeable') {
    return Err(`Cannot place tower on ${cell.type} cell`);
  }

  if (cell.tower !== null) {
    return Err(`Cell already occupied by tower`);
  }

  // Create new grid with tower placed
  const newCells = grid.cells.map((row, y) =>
    row.map((c, x) => {
      if (x === tower.position.x && y === tower.position.y) {
        return { ...c, tower };
      }
      return c;
    })
  );

  return Ok({
    ...grid,
    cells: newCells,
  });
};

/**
 * Remove tower at position
 */
export const removeTower = (
  grid: Grid,
  pos: Position
): Result<Grid, string> => {
  const cellResult = getCell(grid, pos);
  if (!cellResult.ok) return cellResult;

  const cell = cellResult.value;
  if (cell.tower === null) {
    return Err(`No tower at position: (${pos.x}, ${pos.y})`);
  }

  const newCells = grid.cells.map((row, y) =>
    row.map((c, x) => {
      if (x === pos.x && y === pos.y) {
        return { ...c, tower: null };
      }
      return c;
    })
  );

  return Ok({
    ...grid,
    cells: newCells,
  });
};

/**
 * Get all placeable cells
 */
export const getPlaceableCells = (grid: Grid): Cell[] => {
  const placeable: Cell[] = [];

  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell.type === 'placeable' && cell.tower === null) {
        placeable.push(cell);
      }
    }
  }

  return placeable;
};

/**
 * Get neighbors of a position (4-directional)
 */
export const getNeighbors = (grid: Grid, pos: Position): Position[] => {
  const neighbors: Position[] = [];
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 },  // right
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }, // left
  ];

  for (const dir of directions) {
    const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
    if (newPos.x >= 0 && newPos.x < grid.width && newPos.y >= 0 && newPos.y < grid.height) {
      neighbors.push(newPos);
    }
  }

  return neighbors;
};

/**
 * Calculate distance between two positions (Euclidean)
 */
export const distance = (a: Position, b: Position): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Get path position by index
 */
export const getPathPosition = (
  grid: Grid,
  pathIndex: number
): Result<Position, string> => {
  if (pathIndex < 0 || pathIndex >= grid.path.length) {
    return Err(`Path index out of bounds: ${pathIndex}`);
  }

  const pos = grid.path[pathIndex];
  if (!pos) {
    return Err(`Path position not found at index: ${pathIndex}`);
  }

  return Ok(pos);
};

/**
 * Get progress along path (0 to 1)
 */
export const getPathProgress = (grid: Grid, pathIndex: number): number => {
  return pathIndex / (grid.path.length - 1);
};

/**
 * Check if position is on path
 */
export const isOnPath = (grid: Grid, pos: Position): boolean => {
  return grid.path.some((p) => p.x === pos.x && p.y === pos.y);
};
