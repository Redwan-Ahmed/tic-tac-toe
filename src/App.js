import { useState, useEffect } from "react";
import logo from "./assets/tic.png";
import Confetti from "react-confetti";
import Modal from "./Modal";

function Square({ value, onSquareClick, isWinningSq }) {
  const className = isWinningSq ? "square winning-square" : "square";

  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  let result;
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
      result = {
        winner: squares[a],
        winningSquares: [a, b, c],
      };
      return result;
    }
  }

  return result;
}

function Board({ isNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  function handleClick(i) {
    if (squares[i] || winner) return;

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
        {Array(3)
          .fill()
          .map((_, row) => (
            <div className="board-row" key={row}>
              {Array(3)
                .fill()
                .map((_, col) => {
                  const squareIndex = row * 3 + col;
                  return (
                    <Square
                      key={squareIndex}
                      value={squares[squareIndex]}
                      onSquareClick={() => handleClick(squareIndex)}
                      isWinningSq={
                        winner && winner.winningSquares.includes(squareIndex)
                      }
                    />
                  );
                })}
            </div>
          ))}
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
  const [status, setStatus] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clickClose, setClickClose] = useState(false);

  const [draw, setDraw] = useState(false);

  const closeModal = () => {
    setClickClose(true);
    setModalIsOpen(false);
  };

  const restart = () => {
    setHistory([Array(9).fill(null)]);
    setHasEntries(false);
    setModalIsOpen(false);
    setCurrentMove(0);
    setClickClose(false);
    setDraw(false);
  };

  useEffect(() => {
    if (currentMove === 9 && !winner) {
      setDraw(true);
      setModalIsOpen(true);
    }
  }, [currentMove, winner]);

  useEffect(() => {
    if (winner && !clickClose) {
      setModalIsOpen(true);
    }
  }, [winner, clickClose]);

  useEffect(() => {
    let status;

    if (winner) {
      status = `Winner : ${winner.winner}`;
    } else {
      status = `Current Player: ` + (isNext ? "X" : "O");
    }
    setStatus(status);
  }, [winner, isNext]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHasEntries(true);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    if (nextMove === 0) {
      restart();
    } else {
      setCurrentMove(nextMove);
      setClickClose(false);
    }
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
        <div key="awaiting-moves" className="animate-pulse">
          <h4>Awaiting Moves</h4>
        </div>
      );
    }
  });

  return (
    <>
      <div>
        {winner && (
          <>
            <Confetti />
            <div className="flex justify-center items-center">
              <Modal isOpen={modalIsOpen} onClose={closeModal}>
                <h2 className="text-lg text-center font-semibold mb-4">
                  🥇 {status} 🏆
                </h2>
                <button
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  style={{ marginRight: "10px" }}
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={restart}
                >
                  Start Again?
                </button>
              </Modal>
            </div>
          </>
        )}
        {draw && (
          <>
            <div className="flex justify-center items-center">
              <Modal isOpen={modalIsOpen} onClose={closeModal}>
                <h2 className="text-lg text-center font-semibold mb-4">
                  It's a Draw!
                </h2>
                <p className="text-center" style={{ fontSize: "40px" }}>
                  🤝
                </p>
                <button
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  style={{ marginRight: "10px" }}
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={restart}
                >
                  Start Again?
                </button>
              </Modal>
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div
          className="col-span-2 sm:col-1"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={logo}
            alt="logo"
            style={{ width: "10%", marginRight: "15px" }}
          />
          <h1 style={{ margin: 0 }}>Tic Tac Toe</h1>
        </div>
        <div
          className="col-3 sm:col-span-1"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <h2>{status}</h2>
        </div>
        <div
          className="col-span-3 sm:col-span-2"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Board isNext={isNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div
          className="col-span-3 sm:col-span-1"
          style={{ textAlign: "center" }}
        >
          <h2 style={{ marginBottom: "5px" }}>Game History</h2>
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}
