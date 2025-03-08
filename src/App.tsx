import { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Settings } from 'lucide-react';

type Player = 'X' | 'O';
type BoardState = (Player | null)[];

function App() {
  const [size, setSize] = useState<number>(3);
  const [board, setBoard] = useState<BoardState>(Array(size * size).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);

  useEffect(() => {
    resetGame();
  }, [size]);

  const checkWinner = (squares: BoardState): Player | 'Draw' | null => {
    // Check rows
    for (let i = 0; i < size; i++) {
      const row = Array(size).fill(0).map((_, j) => i * size + j);
      if (row.every(idx => squares[idx] === squares[row[0]] && squares[idx] !== null)) {
        return squares[row[0]];
      }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
      const col = Array(size).fill(0).map((_, j) => i + j * size);
      if (col.every(idx => squares[idx] === squares[col[0]] && squares[idx] !== null)) {
        return squares[col[0]];
      }
    }

    // Check main diagonal
    const diagonal1 = Array(size).fill(0).map((_, i) => i * (size + 1));
    if (diagonal1.every(idx => squares[idx] === squares[diagonal1[0]] && squares[idx] !== null)) {
      return squares[diagonal1[0]];
    }

    // Check anti-diagonal
    const diagonal2 = Array(size).fill(0).map((_, i) => (i + 1) * (size - 1));
    if (diagonal2.every(idx => squares[idx] === squares[diagonal2[0]] && squares[idx] !== null)) {
      return squares[diagonal2[0]];
    }

    if (squares.every(square => square !== null)) {
      return 'Draw';
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isConfiguring) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(size * size).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const handleSizeChange = (newSize: number) => {
    if (newSize >= 3 && newSize <= 10) {
      setSize(newSize);
      setIsConfiguring(false);
    }
  };

  const getSquareSize = () => {
    if (size <= 3) return 'size-3';
    if (size <= 5) return 'size-4-5';
    if (size <= 7) return 'size-6-7';
    return 'size-8-plus';
  };

  const renderSquare = (index: number) => {
    const value = board[index];
    return (
      <button
        className={`square ${getSquareSize()} ${value ? value.toLowerCase() : ''}`}
        onClick={() => handleClick(index)}
        disabled={!!winner || isConfiguring}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="container">
      <div className="game-wrapper">
        <div className="game-container">
          <div className="game-board">
            <div className="header">
              <h1 className="title">Tic Tac Toe</h1>
              <button
                onClick={() => setIsConfiguring(!isConfiguring)}
                className="settings-button"
              >
                <Settings size={24} />
              </button>
              
              {isConfiguring ? (
                <div className="board-size-selector">
                  <h2 className="board-size-title">Choose Board Size</h2>
                  <div className="size-buttons">
                    {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => handleSizeChange(n)}
                        className={`size-button ${size === n ? 'active' : ''}`}
                      >
                        {n}x{n}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {!winner && (
                    <p className="status">
                      Current Player: <span className={currentPlayer === 'X' ? 'player-x' : 'player-o'}>{currentPlayer}</span>
                    </p>
                  )}
                  {winner && (
                    <div className="winner-display">
                      <Trophy className={
                        winner === 'Draw' ? 'text-gray-500' : 
                        winner === 'X' ? 'player-x' : 'player-o'
                      } />
                      <p className={
                        winner === 'Draw' ? 'text-gray-500' : 
                        winner === 'X' ? 'player-x' : 'player-o'
                      }>
                        {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div 
              className="game-grid"
              style={{ 
                gridTemplateColumns: `repeat(${size}, 1fr)`,
              }}
            >
              {Array(size * size).fill(null).map((_, index) => (
                <div key={index}>
                  {renderSquare(index)}
                </div>
              ))}
            </div>

            <button
              onClick={resetGame}
              className="reset-button"
            >
              <RotateCcw size={18} />
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;