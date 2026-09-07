import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LeagueType, GameSubMode, AnyPlayer, PlayerGuessResult, PowerUpState } from './types';
import { NFL_PLAYERS } from './data/nflPlayers';
import { MLB_PLAYERS } from './data/mlbPlayers';
import { getDailyPlayer, getRandomPlayer, evaluatePlayerGuess, updateGameStats } from './utils/gameLogic';
import { soundManager } from './utils/audio';
import confetti from 'canvas-confetti';

import { Header } from './components/Header';
import { PlayerSearchInput } from './components/PlayerSearchInput';
import { PlayerGuessGrid } from './components/PlayerGuessGrid';
import { SpecialPerksBar } from './components/SpecialPerksBar';
import { FranchiseWordle } from './components/FranchiseWordle';
import { GameOverModal } from './components/GameOverModal';
import { StatsModal } from './components/StatsModal';
import { HowToPlayModal } from './components/HowToPlayModal';

export default function App() {
  const [league, setLeague] = useState<LeagueType>('NFL');
  const [subMode, setSubMode] = useState<GameSubMode>('player');
  const [isDaily, setIsDaily] = useState<boolean>(true);
  const [practiceSeed, setPracticeSeed] = useState<number>(0);

  // Target player selection
  const targetPlayer = useMemo<AnyPlayer>(() => {
    if (isDaily) {
      return getDailyPlayer(league);
    } else {
      return getRandomPlayer(league);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [league, isDaily, practiceSeed]);

  // Guesses state
  const [guesses, setGuesses] = useState<PlayerGuessResult[]>([]);
  const [maxGuesses, setMaxGuesses] = useState<number>(8);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Special power-up perks
  const [powerUps, setPowerUps] = useState<PowerUpState>({
    audibleRevealed: false,
    challengeUsed: false,
    heatCheckUsed: false,
    hailMaryUsed: false,
  });

  // Modals state
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState<boolean>(false);

  // Reset game on league or daily change
  const resetGame = useCallback(() => {
    setGuesses([]);
    setMaxGuesses(8);
    setGameStatus('playing');
    setIsGameOverModalOpen(false);
    setPowerUps({
      audibleRevealed: false,
      challengeUsed: false,
      heatCheckUsed: false,
      hailMaryUsed: false,
    });
    setPracticeSeed((prev) => prev + 1);
  }, []);

  // Handle league change
  const handleLeagueChange = (newLeague: LeagueType) => {
    if (newLeague !== league) {
      setLeague(newLeague);
      resetGame();
    }
  };

  // Handle daily toggle
  const handleToggleDaily = () => {
    setIsDaily((prev) => !prev);
    resetGame();
  };

  // Submit player guess
  const handleSelectPlayer = (guessedPlayer: AnyPlayer) => {
    if (gameStatus !== 'playing') return;

    const result = evaluatePlayerGuess(guessedPlayer, targetPlayer, league);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);

    if (result.isWin) {
      setGameStatus('won');
      soundManager.playCheer();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 },
          colors: league === 'NFL' ? ['#10B981', '#059669', '#FBBF24'] : ['#F59E0B', '#D97706', '#3B82F6'],
        });
      } catch {}
      updateGameStats(league, true, newGuesses.length);
      setTimeout(() => setIsGameOverModalOpen(true), 1100);
    } else if (newGuesses.length >= maxGuesses) {
      setGameStatus('lost');
      soundManager.playBuzzer();
      updateGameStats(league, false, newGuesses.length);
      setTimeout(() => setIsGameOverModalOpen(true), 1100);
    }
  };

  // Power-up handlers
  const handleUseAudible = () => {
    setPowerUps((prev) => ({ ...prev, audibleRevealed: true }));
  };

  const handleUseChallenge = () => {
    setPowerUps((prev) => ({ ...prev, challengeUsed: true }));
  };

  const handleUseHeatCheck = () => {
    setPowerUps((prev) => ({ ...prev, heatCheckUsed: true }));
  };

  const handleUseHailMary = () => {
    if (powerUps.hailMaryUsed) return;
    setPowerUps((prev) => ({ ...prev, hailMaryUsed: true }));
    setMaxGuesses((prev) => prev + 1);
  };

  const guessedPlayerIds = useMemo(() => guesses.map((g) => g.player.id), [guesses]);
  const availablePlayers = league === 'NFL' ? NFL_PLAYERS : MLB_PLAYERS;
  const isNFL = league === 'NFL';

  return (
    <div
      className={`min-h-screen flex flex-col text-neutral-100 transition-colors duration-500 ${
        isNFL
          ? 'bg-neutral-950 bg-gridiron-pattern selection:bg-emerald-500 selection:text-black'
          : 'bg-neutral-950 bg-diamond-pattern selection:bg-amber-500 selection:text-black'
      }`}
    >
      {/* Top Header */}
      <Header
        league={league}
        subMode={subMode}
        onLeagueChange={handleLeagueChange}
        onSubModeChange={setSubMode}
        onOpenHowToPlay={() => setIsHowToPlayModalOpen(true)}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onResetGame={resetGame}
        isDaily={isDaily}
        onToggleDaily={handleToggleDaily}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col items-center">
        {subMode === 'player' ? (
          <>
            {/* Special Perks & Audibles Bar */}
            <SpecialPerksBar
              league={league}
              target={targetPlayer}
              powerUps={powerUps}
              onUseAudible={handleUseAudible}
              onUseChallenge={handleUseChallenge}
              onUseHeatCheck={handleUseHeatCheck}
              onUseHailMary={handleUseHailMary}
              disabled={gameStatus !== 'playing'}
              guessesCount={guesses.length}
            />

            {/* Player Search Input */}
            <PlayerSearchInput
              league={league}
              availablePlayers={availablePlayers}
              guessedPlayerIds={guessedPlayerIds}
              onSelectPlayer={handleSelectPlayer}
              disabled={gameStatus !== 'playing'}
              guessCount={guesses.length}
              maxGuesses={maxGuesses}
            />

            {/* Player Guesses Grid */}
            <PlayerGuessGrid
              league={league}
              guesses={guesses}
              maxGuesses={maxGuesses}
            />

            {/* Game Concluded Quick Bar */}
            {gameStatus !== 'playing' && (
              <div className="mt-4 w-full max-w-lg mx-auto flex items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
                <span className="text-xs font-semibold text-neutral-300">
                  {gameStatus === 'won' ? '🏆 Victory recorded!' : '🛡️ Drive ended.'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsGameOverModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 transition-colors"
                  >
                    View Player Bio
                  </button>
                  <button
                    onClick={resetGame}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* 5-Letter Franchise Cipher Mode */
          <FranchiseWordle league={league} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 py-4 text-center text-xs text-neutral-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-sports font-semibold text-neutral-400">
              {isNFL ? '🏈 NFL Gridiron Wordle' : '⚾ MLB Diamond Wordle'}
            </span>
            <span>•</span>
            <span>Special Audibles, Radars & Sound FX</span>
          </div>
          <div>All NFL and MLB player stats, team trademarks belong to their respective leagues.</div>
        </div>
      </footer>

      {/* Modals */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        isWin={gameStatus === 'won'}
        targetPlayer={targetPlayer}
        guesses={guesses}
        league={league}
        isDaily={isDaily}
        maxGuesses={maxGuesses}
        onClose={() => setIsGameOverModalOpen(false)}
        onPlayAgain={resetGame}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        activeLeague={league}
      />

      <HowToPlayModal
        isOpen={isHowToPlayModalOpen}
        onClose={() => setIsHowToPlayModalOpen(false)}
        league={league}
      />
    </div>
  );
}
