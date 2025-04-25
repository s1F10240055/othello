import { useState } from 'react';
import styles from './index.module.css';

const DIRECTIONS = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

const getPuttablePositions = (board: number[][], x: number, y: number, turn: number) => {
  if (board[y][x] === 1 || board[y][x] === 2) {
    return false;
  }

  for (const direction of DIRECTIONS) {
    const [dx, dy] = direction;
    let i = 1;
    let foundOpponent = false;

    while (true) {
      const nx = x + i * dx;
      const ny = y + i * dy;

      if (board[ny] === undefined || board[ny][nx] === undefined) break;

      if (board[ny][nx] === 0 || board[ny][nx] === 3) break;

      if (board[ny][nx] === turn) {
        if (foundOpponent) {
          return true;
        } else {
          break;
        }
      }

      if (board[ny][nx] === 3 - turn) {
        foundOpponent = true;
      }

      i++;
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

  const [turn, setturn] = useState(1);

  const handleOnClick = (x: number, y: number) => {
    if (board[y][x] !== 3) {
      return;
    }

    const newBoard = structuredClone(board);

    for (const direction of DIRECTIONS) {
      const [dx, dy] = direction;
      let i = 1;

      while (true) {
        const nx = x + i * dx;
        const ny = y + i * dy;

        if (newBoard[ny] === undefined || newBoard[ny][nx] === undefined) break;

        if (newBoard[ny][nx] === 0 || newBoard[ny][nx] === 3) break;

        if (newBoard[ny][nx] === turn) {
          for (let k = 1; k < i; k++) {
            newBoard[y + k * dy][x + k * dx] = turn;
          }
          break;
        }

        i++;
      }
    }

    newBoard[y][x] = turn;

    // 次のターンの石を置ける場所を更新
    for (let k = 0; k < 8; k++) {
      for (let i = 0; i < 8; i++) {
        if (newBoard[k][i] === 3) {
          newBoard[k][i] = 0; // 前のターンの候補をリセット
        }
        if (getPuttablePositions(newBoard, i, k, 3 - turn)) {
          newBoard[k][i] = 3; // 次のターンの候補を設定
        }
      }
    }

    // ボードとターンを更新
    setBoard(newBoard);
    setturn(3 - turn);
  };

  const getStonecount = (color: 1 | 2) => {
    let result = 0;
    for (const row of board) {
      for (const cellColor of row) {
        if (cellColor === color) {
          result++;
        }
      }
    }
    return result;
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              key={`${x}-${y}`}
              className={styles.cell}
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

      <div className={styles.whichturn}>
        <span
          className={`${styles.turnText} ${
            turn === 1 ? styles.black : turn === 2 ? styles.white : ''
          }`}
        >
          {turn === 1 ? '黒のターン' : '白のターン'}
        </span>
      </div>

      <div className={styles.scoreBoard}>
        <div className={styles.scoreItem}>
          <span className={styles.stoneIcon} style={{ backgroundColor: 'black' }} />
          <span className={styles.scoreText}>黒の個数: {getStonecount(1)}</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.stoneIcon} style={{ backgroundColor: 'white' }} />
          <span className={styles.scoreText}>白の個数: {getStonecount(2)}</span>
        </div>
      </div>
    </div>
  );
};
export default Home;
