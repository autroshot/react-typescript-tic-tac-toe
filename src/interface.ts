export interface SquareProps {
  value: string;
  isWinSquare: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export interface BoardProps {
  squares: string[];
  winSquares: number[];
  onClick: (i: number) => void;
}

export interface InfoProps {
  history: SquaresObject[];
  move: number;
  winner: string | null;
  xIsNext: boolean;
  onJumpHistoryClick: (step: number) => void;
}

export interface SquaresObject {
  squares: string[];
  squareIndex: number;
}

export interface LocationXY {
  x: number;
  y: number;
}

export interface WinnerObject {
  winner: string;
  winSquares: number[];
}

export enum MoveOrder {
  ascending = 'ascending',
  descending = 'descending',
}