import React, { useState, useEffect, useCallback } from 'react';
import { LeagueType } from '../types';
import { NFL_CIPHER_WORDS, MLB_CIPHER_WORDS, CipherWordItem } from '../data/franchiseWords';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { RotateCcw, HelpCircle, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface FranchiseWordleProps {
  league: LeagueType;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export const FranchiseWordle: React.FC<FranchiseWordleProps> = ({ league }) => {
  const isNFL = league === 'NFL';
  const wordList = isNFL ? NFL_CIPHER_WORDS : MLB_CIPHER_WORDS;

  // Pick target word
  const [targetItem, setTargetItem] = useState<CipherWordItem>(() => {
    return wordList[Math.floor(Math.random() * wordList.length)];
  });

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showClue, setShowClue] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);

  // Reset when league changes or manual reset
  const handleReset = useCallback(() => {
    const nextList = league === 'NFL' ? NFL_CIPHER_WORDS : MLB_CIPHER_WORDS;
    const randomItem = nextList[Math.floor(Math.random() * nextList.length)];
    setTargetItem(randomItem);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setShowClue(false);
  }, [league]);

  useEffect(() => {
    handleReset();
  }, [league, handleReset]);

  // Key evaluation states
  const letterStatuses = React.useMemo(() => {
    const statuses: Record<string, 'correct' | 'present' | 'absent'> = {};
    const targetWord = targetItem.word;

    guesses.forEach((guess) => {
      guess.split('').forEach((letter, index) => {
        if (targetWord[index] === letter) {
          statuses[letter] = 'correct';
        } else if (targetWord.includes(letter) && statuses[letter] !== 'correct') {
          statuses[letter] = 'present';
        } else if (!statuses[letter]) {
          statuses[letter] = 'absent';
        }
      });
    });

    return statuses;
  }, [guesses, targetItem.word]);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5) {
      setShakeRow(true);
      soundManager.playBuzzer();
      setTimeout(() => setShakeRow(false), 500);
      return;
    }

    const nextGuesses = [...guesses, currentGuess];
    setGuesses(nextGuesses);
    setCurrentGuess('');

    if (currentGuess === targetItem.word) {
      setGameStatus('won');
      soundManager.playCheer();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: isNFL ? ['#10B981', '#34D399', '#FFFFFF'] : ['#F59E0B', '#FBBF24', '#FFFFFF'],
        });
      } catch {}
    } else if (nextGuesses.length >= 6) {
      setGameStatus('lost');
      soundManager.playBuzzer();
    } else {
      if (isNFL) {
        soundManager.playWhistle();
      } else {
        soundManager.playBatCrack();
      }
    }
  }, [currentGuess, guesses, targetItem.word, isNFL]);

  // Physical keyboard listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (gameStatus !== 'playing') return;

      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        soundManager.playClick();
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length < 5) {
          soundManager.playClick();
          setCurrentGuess((prev) => (prev + e.key.toUpperCase()).slice(0, 5));
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, currentGuess, submitGuess]);

  const handleVirtualKey = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      soundManager.playClick();
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      soundManager.playClick();
      setCurrentGuess((prev) => (prev + key).slice(0, 5));
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-4 px-2 flex flex-col items-center">
      {/* Sub-header info */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="font-sports font-bold text-sm uppercase text-neutral-200">
            {isNFL ? '🏈 NFL 5-Letter Cipher' : '⚾ MLB 5-Letter Cipher'}
          </span>
          <span className="text-[11px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-medium">
            Category: {targetItem.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="cipher-hint-btn"
            onClick={() => {
              soundManager.playClick();
              setShowClue(!showClue);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
              showClue
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showClue ? 'Hide Clue' : 'Get Clue'}</span>
          </button>

          <button
            id="cipher-reset-btn"
            onClick={() => {
              soundManager.playClick();
              handleReset();
            }}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
            title="Next Mystery Word"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clue banner if toggled */}
      {showClue && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full bg-neutral-900 border border-amber-500/30 rounded-xl p-3 mb-3 text-xs text-amber-200 flex items-start gap-2"
        >
          <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Scouting Report Clue: </span>
            <span>{targetItem.clue}</span>
          </div>
        </motion.div>
      )}

      {/* 6x5 Letter Grid */}
      <div className="grid grid-rows-6 gap-2 mb-4">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const isCurrentRow = rowIndex === guesses.length;
          const guess = rowIndex < guesses.length ? guesses[rowIndex] : isCurrentRow ? currentGuess : '';

          return (
            <div
              key={`cipher-row-${rowIndex}`}
              className={`flex gap-2 ${isCurrentRow && shakeRow ? 'animate-shake' : ''}`}
            >
              {Array.from({ length: 5 }).map((_, colIndex) => {
                const char = guess[colIndex] || '';
                let tileBg = 'bg-neutral-900 border-neutral-800 text-neutral-100';

                // If row already submitted, color code
                if (rowIndex < guesses.length) {
                  if (targetItem.word[colIndex] === char) {
                    tileBg = 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950';
                  } else if (targetItem.word.includes(char)) {
                    tileBg = 'bg-amber-500 border-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-950';
                  } else {
                    tileBg = 'bg-neutral-800 border-neutral-700 text-neutral-400';
                  }
                } else if (isCurrentRow && char) {
                  tileBg = 'bg-neutral-800 border-neutral-600 text-white scale-105';
                }

                return (
                  <div
                    key={`tile-${rowIndex}-${colIndex}`}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center font-sports font-bold text-xl sm:text-2xl uppercase transition-all duration-200 ${tileBg}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Game Over Message */}
      {gameStatus !== 'playing' && (
        <div
          className={`w-full p-3 rounded-xl mb-4 border flex items-center justify-between gap-3 text-sm ${
            gameStatus === 'won'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {gameStatus === 'won' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="font-bold">
                {gameStatus === 'won' ? 'Touchdown / Home Run!' : 'Turnover on Downs / Struck Out!'}
              </div>
              <div className="text-xs opacity-80">
                The mystery sports cipher was <span className="font-bold uppercase tracking-wider">{targetItem.word}</span> ({targetItem.clue})
              </div>
            </div>
          </div>
          <button
            id="cipher-play-again-btn"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-900 font-bold text-xs shrink-0 hover:bg-neutral-200 transition-colors"
          >
            Play Next
          </button>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div className="w-full max-w-lg space-y-1.5 select-none">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={`kb-row-${rIdx}`} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => {
              const status = letterStatuses[key];
              let keyClass = 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-750';
              if (status === 'correct') {
                keyClass = 'bg-emerald-600 text-white font-bold border-emerald-500';
              } else if (status === 'present') {
                keyClass = 'bg-amber-500 text-neutral-950 font-bold border-amber-400';
              } else if (status === 'absent') {
                keyClass = 'bg-neutral-900 text-neutral-600 border-neutral-850';
              }

              const isWide = key === 'ENTER' || key === 'BACKSPACE';

              return (
                <button
                  key={`key-${key}`}
                  id={`kb-key-${key.toLowerCase()}`}
                  onClick={() => handleVirtualKey(key)}
                  className={`h-11 sm:h-12 rounded-lg font-sports font-bold text-xs sm:text-sm border transition-all active:scale-95 flex items-center justify-center ${
                    isWide ? 'px-2.5 sm:px-3 text-[11px] sm:text-xs' : 'flex-1'
                  } ${keyClass}`}
                >
                  {key === 'BACKSPACE' ? 'DEL' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
