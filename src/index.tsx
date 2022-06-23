import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { calculateWinner } from './calculateWinner';
import './index.css';

interface SquareProps {
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

interface BoardProps {
  squares: string[]
  onClick: (i: number) => void;
}

interface SquaresObject {
  squares: string[];
  index: number;
}

interface LocationXY {
  x: number;
  y: number;
}

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props: BoardProps) {
  return (
    <div>
      {renderBoardRows()}
    </div>
  );
  
  function renderBoardRows() {
    let result: JSX.Element[] = [];

    for (let i = 0; i < 3; i++) {
      let squares: JSX.Element[] = [];

      for (let j = i * 3; j < (i + 1) * 3; j++) {
        squares.push(renderSquare(j));
      }

      result.push(<div className="board-row">{squares}</div>);
    }

    return result;
  }

  function renderSquare(i: number) {
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)} />
    );
  }
}

function Game() {
  const [history, setHistory] = useState<SquaresObject[]>([createInitialSquaresObject()]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXisNext] = useState(true);

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  
  const moves = history.map((step, move) => {
    if (!move) {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>게임 시작으로 돌아가기</button>
        </li>
      )
    } else {
      const locationXY = getLocationXY(step.index);
      
      return (
        <li key={move} className={(move === stepNumber) ? "selected" : ""}>
          <button onClick={() => jumpTo(move)}>{move}턴으로 돌아가기</button><span>({locationXY.x},{locationXY.y})</span>
        </li>
      )
    }
  });

  let status;
  if (winner) {
    status = '승자: ' + winner;
  } else {
    status = '다음 플레이어: ' + (xIsNext ? 'X' : 'O');
  }

  function handleClick(i: number) {
    const changedHistory = history.slice(0, stepNumber + 1);
    const current = changedHistory[changedHistory.length - 1];
    const squares = [...current.squares];

    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(changedHistory.concat({ squares: squares, index: i }));
    setStepNumber(changedHistory.length);
    setXisNext(!xIsNext);
  }

  function jumpTo(step: number) {
    setStepNumber(step);
    setXisNext((step % 2) === 0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={current.squares}
          onClick={(i: number) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );

  function createInitialSquaresObject() {
    return { squares: Array(9).fill(null), index: -1 };
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(<Game />);

function getLocationXY(index: number): LocationXY {
  let result = { x: 0, y: 0 };

  result.x = Math.floor(index / 3);
  result.y = index % 3;

  return result;
}