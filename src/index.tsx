import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BoardProps, InfoProps, LocationXY, SquareProps, SquaresObject, MoveOrder } from './interface'
import { calculateWinner } from './calculateWinner';
import './index.css';

function Game() {
  const [history, setHistory] = useState([createInitialSquaresObject()]);
  const [move, setMove] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const current = history[move];
  const winner = calculateWinner(current.squares);
  
  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={current.squares}
          onClick={(i: number) => handleClick(i)}
        />
      </div>
      <Info history={history} move={move} winner={winner} xIsNext={xIsNext} 
      onJumpHistoryClick={handleJumpHistoryClick}/>
    </div>
  );

  function createInitialSquaresObject(): SquaresObject {
    return { squares: Array(9).fill(null), squareIndex: -1 };
  }

  function handleClick(i: number) {
    const changedHistory = history.slice(0, move + 1);
    const current = changedHistory[changedHistory.length - 1];
    const squares = [...current.squares];

    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(changedHistory.concat({ squares: squares, squareIndex: i }));
    setMove(changedHistory.length);
    setXIsNext(!xIsNext);
  }

  function handleJumpHistoryClick(step: number) {
    setMove(step);
    setXIsNext((step % 2) === 0);
  }
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

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Info(props: InfoProps) {
  const [moveOrder, setMoveOrder] = useState(MoveOrder.ascending);

  return (
    <div className="game-info">
      <div>{renderStatus()}</div>
      <button className='moveOrderToggleButton'>기록 정렬 방식 변경</button>
      <ol>{renderMoves(props.history, props.move)}</ol>
    </div>
  )

  function renderStatus() {
    let result = '';

    if (props.winner) {
      result += '승자: ' + props.winner;
    } else {
      result += '다음 플레이어: ' + (props.xIsNext ? 'X' : 'O');
    }

    return result;
  }

  function renderMoves(history: SquaresObject[], currentMove: number) {
    return history.map((squaresObject, move) => {
      if (move === 0) {
        return (
          <li key={move}>
            <button onClick={() => props.onJumpHistoryClick(move)}>게임 시작으로 돌아가기</button>
          </li>
        );
      } else {
        const locationXY = getLocationXY(squaresObject.squareIndex);

        return (
          <li key={move} className={(move === currentMove) ? "selected" : ""}>
            <button onClick={() => props.onJumpHistoryClick(move)}>{move}턴으로 돌아가기</button>
            <span>({locationXY.x},{locationXY.y})</span>
          </li>
        );
      }
    });
  }

  function getLocationXY(index: number): LocationXY {
    let result = { x: 0, y: 0 };
  
    result.x = Math.floor(index / 3);
    result.y = index % 3;
  
    return result;
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(<Game />);