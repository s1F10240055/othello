import { useState } from 'react';
import styles from './index.module.css';

const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

const getPuttablePositions = (board: number[][], x: number, y: number, turn: number) => {
  if (board[y][x] === 1 || board[y][x] === 2) {
    return false;
  }
  for (const direction of DIRECTIONS) {
    const [dx, dy] = direction;
    let t = 1;
    let searchOpponent = false;
    while (true) {
      const nx = x + dx * t;
      const ny = y + dy * t;
      if (board[ny] === undefined || board[ny][nx] === undefined) break;
      if (board[ny][nx] === 0 || board[ny][nx] === 3) break;
      if (board[ny][nx] === turn) {
        if (searchOpponent) {
          return true;
        } else {
          break;
        }
      }
      if (board[ny][nx] === 3 - turn) {
        searchOpponent = true;
      }
      t++;
    }
  }
  return false;
};

const Home = () => {
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [turn, setTurn] = useState(1);

  const handleOnClick = (x: number, y: number) => {
    if (board[y][x] !== 3) {
      return;
    }

    const newboard = structuredClone(board);

    for (const direction of DIRECTIONS) {
      const [dx, dy] = direction;
      let t = 1;

      while (true) {
        const nx = x + dx * t;
        const ny = y + dy * t;

        if (newboard[ny] === undefined || newboard[ny][nx] === undefined) break;
        if (newboard[ny][nx] === 0 || newboard[ny][nx] === 3) break;

        if (newboard[ny][nx] === turn) {
          for (let k = 0; k < t; k++) {
            newboard[y + dy * k][x + dx * k] = turn;
          }
          break;
        }

        t++;
      }
    }

    newboard[y][x] = turn;

    for (let k = 0; k < 8; k++) {
      for (let i = 0; i < 8; i++) {
        if (newboard[i][k] === 3) {
          newboard[i][k] = 0;
        }
        if (getPuttablePositions(newboard, k, i, 3 - turn)) {
          newboard[i][k] = 3;
        }
      }
    }
    setBoard(newboard);
    setTurn(3 - turn);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.cell}
              key={`${x}-${y}`}
              onClick={() => {
                handleOnClick(x, y);
              }}
            >
              <div
                className={styles.stone}
                style={{
                  width: color === 3 ? '20%' : '70%',
                  height: color === 3 ? '20%' : '70%',
                  backgroundColor:
                    color === 1 ? 'black' : color === 2 ? 'white' : color === 3 ? 'red' : '',
                }}
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
