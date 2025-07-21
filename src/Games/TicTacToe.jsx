import React, { useState, useEffect } from 'react';
import { FaTimes, FaCircle, FaTrophy, FaRedo, FaGamepad } from 'react-icons/fa';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameCount, setGameCount] = useState(0);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (squares) => {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combination };
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setScores(prev => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1
      }));
    } else if (newBoard.every(cell => cell !== null)) {
      setWinner('draw');
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setGameCount(prev => prev + 1);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    setGameCount(0);
    resetGame();
  };

  const renderCell = (index) => {
    const cellValue = board[index];
    const isWinningCell = winningLine.includes(index);
    
    return (
      <div
        key={index}
        className={`game-cell btn btn-outline ${isWinningCell ? 'winning-cell' : ''} ${
          cellValue === 'X' ? 'player-x' : cellValue === 'O' ? 'player-o' : ''
        }`}
        onClick={() => handleClick(index)}
      >
        {cellValue === 'X' && <FaTimes className="animate-bounce" />}
        {cellValue === 'O' && <FaCircle className="animate-spin" />}
      </div>
    );
  };

  const getStatusMessage = () => {
    if (winner === 'draw') return "It's a draw! 🤝";
    if (winner) return `Player ${winner} wins! 🎉`;
    return `Player ${isXNext ? 'X' : 'O'}'s turn`;
  };

  const getStatusColor = () => {
    if (winner === 'draw') return 'alert-warning';
    if (winner === 'X') return 'alert-error';
    if (winner === 'O') return 'alert-info';
    return isXNext ? 'alert-error' : 'alert-info';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 flex items-center justify-center gap-4">
            <FaGamepad className="text-secondary" />
            Tic Tac Toe
          </h1>
          <p className="text-lg text-base-content/70">Classic game with modern design</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body p-6">
                {/* Status */}
                <div className={`alert ${getStatusColor()} mb-6`}>
                  <div className="flex items-center gap-2">
                    {winner && <FaTrophy />}
                    <span className="font-semibold text-lg">{getStatusMessage()}</span>
                  </div>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto">
                  {Array(9).fill(null).map((_, index) => renderCell(index))}
                </div>

                {/* Game Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                  <button 
                    className="btn btn-primary btn-lg gap-2"
                    onClick={resetGame}
                  >
                    <FaRedo />
                    New Game
                  </button>
                  <button 
                    className="btn btn-outline btn-lg"
                    onClick={resetScores}
                  >
                    Reset Scores
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                  <FaTrophy className="text-warning" />
                  Scoreboard
                </h2>
                
                <div className="space-y-4">
                  {/* Player X Score */}
                  <div className="flex items-center justify-between p-4 bg-error/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaTimes className="text-2xl text-error" />
                      <span className="font-semibold text-lg">Player X</span>
                    </div>
                    <div className="badge badge-error badge-lg">{scores.X}</div>
                  </div>

                  {/* Player O Score */}
                  <div className="flex items-center justify-between p-4 bg-info/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaCircle className="text-2xl text-info" />
                      <span className="font-semibold text-lg">Player O</span>
                    </div>
                    <div className="badge badge-info badge-lg">{scores.O}</div>
                  </div>

                  {/* Draws */}
                  <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🤝</span>
                      <span className="font-semibold text-lg">Draws</span>
                    </div>
                    <div className="badge badge-warning badge-lg">{scores.draws}</div>
                  </div>

                  {/* Games Played */}
                  <div className="divider"></div>
                  <div className="text-center">
                    <div className="stat">
                      <div className="stat-title">Games Played</div>
                      <div className="stat-value text-primary">{gameCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Player Indicator */}
            
          </div>
        </div>

        {/* Footer */}
        
      </div>
    </div>
  );
};

export default TicTacToe;