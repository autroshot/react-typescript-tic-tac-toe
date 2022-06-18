import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { calculateWinner } from './calculateWinner';
import './index.css';

interface SquareProps {
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

interface squaresObject {
  squares: string[];
}

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props: any) {
  const renderSquare = (i: number) => {
    return (
      <Square 
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState<squaresObject[]>([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXisNext] = useState(true);

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? 
      'Go to move #' + move : 
      'Go to game start';
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const handleClick = (i: number) => {
    const changedHistory = history.slice(0, stepNumber + 1);
    const current = changedHistory[changedHistory.length - 1];
    const squares = [...current.squares];

    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(changedHistory.concat({squares: squares}));
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
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(<Game />);

