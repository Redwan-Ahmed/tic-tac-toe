import { useState } from "react";
import logo from "./assets/tic.png";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({ isNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();

    if (isNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  return (
    <>
      <div className="board">
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [hasEntries, setHasEntries] = useState(false);
  const currentSquares = history[currentMove];
  const isNext = currentMove % 2 === 0;
  const winner = calculateWinner(currentSquares);

  let status;

  if (winner) {
    status = `Winner : ${winner}`;
  } else {
    status = `Next Player: ` + (isNext ? "X" : "O");
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHasEntries(true);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    if (nextMove === 0) {
      setHistory([Array(9).fill(null)]);
      setHasEntries(false);
    }

    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;

    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Start Again?";
    }

    if (hasEntries) {
      return (
        <li key={move}>
          <button
            style={{ margin: "4px", padding: "4px" }}
            className="btn btn-purple transition duration-500 ease-in-out bg-purple-500 hover:bg-pink-500 transform hover:-translate-y-1 hover:scale-110 text-white rounded"
            onClick={() => jumpTo(move)}
          >
            {description}
          </button>
        </li>
      );
    } else {
      return (
        <div className="animate-pulse">
          <h4>Awaiting Moves</h4>
        </div>
      );
    }
  });

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 sm:col-1">
        <img src={logo} alt="logo" style={{ width: "10%", float: "left" }} />
        <h1 style={{ float: "left", marginLeft: "15px" }}>Tic Tac Toe</h1>
      </div>
      <div className="col-3 sm:col-span-1">
        <h2 style={{float: 'right'}}>{status}</h2>
      </div>
      <div className="col-span-3 sm:col-span-2" style={{display: 'flex', justifyContent: 'center'}}>
        <Board isNext={isNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="col-span-3 sm:col-span-1" style={{textAlign: 'center'}}>
        <h2 style={{ marginBottom: "5px" }}>Game History</h2>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
