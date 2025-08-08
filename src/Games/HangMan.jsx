import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy, Skull, Target, Zap, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socket from '../socket';

const WORDS = [
  'JAVASCRIPT', 'REACT', 'COMPUTER', 'PROGRAMMING', 'DEVELOPER',
  'ALGORITHM', 'FUNCTION', 'VARIABLE', 'COMPONENT', 'INTERFACE',
  'DATABASE', 'FRAMEWORK', 'LIBRARY', 'TYPESCRIPT', 'FRONTEND',
  'BACKEND', 'RESPONSIVE', 'ANIMATION', 'DEBUGGING', 'TESTING',
  'BEKZOD', 'JAFARBEK', 'API', 'ABUBAKIR', 'WORDS', ' '
];

const MAX_WRONG_GUESSES = 6;

const HangmanGame = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    currentStreak: 0,
    bestStreak: 0
  });

  // --- КОИНЫ ---
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [serverCoins, setServerCoins] = useState(0);
  const currentUser = useSelector((state) => state.auth.user);
  const [coinsGiven, setCoinsGiven] = useState(false);

  // Получаем коины с сервера при заходе (только запрос, без начисления!)
  useEffect(() => {
    if (currentUser?._id) {
      socket.emit('get_user_stats', { userId: currentUser._id });
      const handler = ({ coins }) => setServerCoins(coins || 0);
      socket.on('user_stats', handler);
      return () => socket.off('user_stats', handler);
    }
  }, [currentUser]);

  // Функция начисления коинов (только при выигрыше)
  const sendCoinsToServer = useCallback((wrongGuessesCount) => {
    if (!currentUser?._id) return;
    let coins = 0;
    if (wrongGuessesCount === 0) coins = 20;
    else if (wrongGuessesCount <= 2) coins = 15;
    else coins = 10;
    setEarnedCoins(coins);

    socket.emit('typing_test_complete', {
      userId: currentUser._id,
      coins,
      bestWpm: 0,
      newTest: {
        wpm: 0,
        accuracy: 0,
        errors: wrongGuessesCount,
        time: 0,
        date: new Date().toISOString(),
        correctChars: 0,
        totalChars: 0,
        game: 'hangman',
        win: true,
      },
    });
    socket.emit('get_user_stats', { userId: currentUser._id });
  }, [currentUser]);

  // Следим за завершением игры и начисляем коины только при выигрыше и только один раз
  useEffect(() => {
    if (gameStatus === 'won' && !coinsGiven) {
      sendCoinsToServer(wrongGuesses.length);
      setCoinsGiven(true);
    }
    if (gameStatus === 'lost' && !coinsGiven) {
      setCoinsGiven(true); // проигрыш — коины не начисляем
    }
    // eslint-disable-next-line
  }, [gameStatus, coinsGiven, wrongGuesses.length]);

  // Сброс флага при старте новой игры
  const initializeGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses([]);
    setGameStatus('playing');
    setEarnedCoins(0);
    setCoinsGiven(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleLetterGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!currentWord.includes(letter)) {
      setWrongGuesses(prev => [...prev, letter]);
    }

    // Проверка на выигрыш/проигрыш
    const wordLetters = new Set(currentWord.split(''));
    const guessedWordLetters = new Set(
      [...newGuessedLetters].filter(l => currentWord.includes(l))
    );
    if ([...wordLetters].every(l => guessedWordLetters.has(l))) {
      setGameStatus('won');
      setStats(prev => {
        const newStreak = prev.currentStreak + 1;
        return {
          ...prev,
          wins: prev.wins + 1,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak)
        };
      });
    } else if (wrongGuesses.length + 1 >= MAX_WRONG_GUESSES && !currentWord.includes(letter)) {
      setGameStatus('lost');
      setStats(prev => ({
        ...prev,
        losses: prev.losses + 1,
        currentStreak: 0
      }));
    }
  };

  const displayWord = () => {
    return currentWord
      .split('')
      .map(letter => (guessedLetters.has(letter) ? letter : '_'))
      .join(' ');
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const getHangmanDrawing = () => {
    const parts = [
      '  ┌─────┐',
      '  │     │',
      '  │     O',
      '  │     │',
      '  │    /|\\',
      '  │    / \\',
      '──┴────────'
    ];

    const visibleParts = Math.min(wrongGuesses.length + 1, parts.length);
    const drawing = parts.slice(0, visibleParts);

    while (drawing.length < 7) {
      drawing.push('           ');
    }

    return drawing;
  };

  const getProgressColor = () => {
    const percentage = (wrongGuesses.length / MAX_WRONG_GUESSES) * 100;
    if (percentage < 33) return 'progress-success';
    if (percentage < 66) return 'progress-warning';
    return 'progress-error';
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            🎯 Hangman Game
          </h1>
          <p className="text-base-content/70 text-lg">
            Guess the programming word before it's too late!
          </p>
          <div className="mt-4">
            <span className="badge badge-warning text-lg">
              💰 Coins: {serverCoins}
            </span>
            {earnedCoins > 0 && (
              <span className="badge badge-success text-lg ml-2">
                +{earnedCoins} за игру
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-success">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="stat-title">Wins</div>
            <div className="stat-value text-success">{stats.wins}</div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-error">
              <Skull className="w-8 h-8" />
            </div>
            <div className="stat-title">Losses</div>
            <div className="stat-value text-error">{stats.losses}</div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-warning">
              <Zap className="w-8 h-8" />
            </div>
            <div className="stat-title">Current Streak</div>
            <div className="stat-value text-warning">{stats.currentStreak}</div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-info">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Best Streak</div>
            <div className="stat-value text-info">{stats.bestStreak}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center mb-6">
                <Target className="w-6 h-6" />
                Game Board
              </h2>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Wrong Guesses</span>
                  <span className="font-bold">{wrongGuesses.length}/{MAX_WRONG_GUESSES}</span>
                </div>
                <progress
                  className={`progress w-full ${getProgressColor()}`}
                  value={wrongGuesses.length}
                  max={MAX_WRONG_GUESSES}
                ></progress>
              </div>

              <div className="mockup-code mb-6">
                <div className="px-4 py-2">
                  {getHangmanDrawing().map((line, index) => (
                    <pre key={index} className="text-center">
                      <code>{line}</code>
                    </pre>
                  ))}
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl md:text-5xl font-bold text-primary tracking-widest mb-4 font-mono">
                  {displayWord()}
                </div>
                {wrongGuesses.length > 0 && (
                  <div className="badge badge-error badge-lg">
                    Wrong: {wrongGuesses.join(', ')}
                  </div>
                )}
              </div>

              {gameStatus !== 'playing' && (
                <div className="text-center mb-6">
                  {gameStatus === 'won' ? (
                    <div className="alert alert-success">
                      <Trophy className="w-6 h-6" />
                      <span className="font-bold">Congratulations! You Won! 🎉</span>
                    </div>
                  ) : (
                    <div className="alert alert-error">
                      <Skull className="w-6 h-6" />
                      <div>
                        <div className="font-bold">Game Over! 💀</div>
                        <div className="text-sm">The word was: <span className="font-bold">{currentWord}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="card-actions justify-center">
                <button
                  onClick={initializeGame}
                  className="btn btn-primary btn-lg gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  New Game
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
                Choose a Letter
              </h2>

              <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {alphabet.map(letter => {
                  const isGuessed = guessedLetters.has(letter);
                  const isCorrect = isGuessed && currentWord.includes(letter);
                  const isWrong = isGuessed && !currentWord.includes(letter);

                  let buttonClass = 'btn btn-lg';

                  if (isCorrect) {
                    buttonClass += ' btn-success';
                  } else if (isWrong) {
                    buttonClass += ' btn-error';
                  } else if (gameStatus === 'playing' && !isGuessed) {
                    buttonClass += ' btn-outline btn-primary hover:btn-primary';
                  } else {
                    buttonClass += ' btn-disabled';
                  }

                  return (
                    <button
                      key={letter}
                      onClick={() => handleLetterGuess(letter)}
                      disabled={isGuessed || gameStatus !== 'playing'}
                      className={buttonClass}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <div className="font-bold">How to Play</div>
                    <div className="text-sm">Click letters to guess the programming word. You have {MAX_WRONG_GUESSES} wrong guesses before the game ends!</div>
                  </div>
                </div>
                <div className="mt-2 ml-110">
                  <button onClick={() => navigate(-1)} className="btn btn-outline btn-error">
                    Назад
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HangmanGame;