export interface SquareProps {
  value: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export interface BoardProps {
  squares: string[]
  onClick: (i: number) => void;
}

export interface SquaresObject {
  squares: string[];
  squareIndex: number;
}

export interface LocationXY {
  x: number;
  y: number;
}