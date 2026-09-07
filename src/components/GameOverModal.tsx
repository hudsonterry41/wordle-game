import React, { useState } from 'react';
import { AnyPlayer, LeagueType, NFLPlayer, MLBPlayer, PlayerGuessResult } from '../types';
import { generateShareText } from '../utils/gameLogic';
import { Trophy, Share2, Check, RotateCcw, X, Shield, Award, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/audio';

interface GameOverModalProps {
  isOpen: boolean;
  isWin: boolean;
  targetPlayer: AnyPlayer;
  guesses: PlayerGuessResult[];
  league: LeagueType;
  isDaily: boolean;
  maxGuesses: number;
  onClose: () => void;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isWin,
  targetPlayer,
  guesses,
  league,
  isDaily,
  maxGuesses,
  onClose,
  onPlayAgain,
}) => {
  const [copied, setCopied] = useState(false);
  const isNFL = league === 'NFL';
  const nfl = isNFL ? (targetPlayer as NFLPlayer) : null;
  const mlb = !isNFL ? (targetPlayer as MLBPlayer) : null;

  if (!isOpen) return null;

  const handleCopyShare = () => {
    soundManager.playClick();
    const shareText = generateShareText(league, guesses, isWin, isDaily, maxGuesses);
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-3xl p-6 shadow-2xl text-neutral-100 relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Outcome Header Banner */}
          <div className="text-center mb-5">
            <div className="inline-flex p-3 rounded-2xl mb-2 bg-neutral-800/80 border border-neutral-700">
              {isWin ? (
                <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
              ) : (
                <Shield className="w-10 h-10 text-rose-400" />
              )}
            </div>
            <h2 className="font-sports font-bold text-2xl uppercase tracking-wider">
              {isWin
                ? isNFL
                  ? 'Touchdown! Game Won!'
                  : 'Walk-Off Home Run!'
                : isNFL
                ? 'Turnover on Downs!'
                : 'Struck Out! Game Over!'}
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              {isWin
                ? `You cracked the player identity in ${guesses.length} ${
                    guesses.length === 1 ? 'drive' : 'drives'
                  }!`
                : 'The opposing defense held strong. Here was the mystery star:'}
            </p>
          </div>

          {/* Player Bio Card */}
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 mb-5 shadow-inner">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-sports font-bold border ${
                  isNFL
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-emerald-950'
                    : 'bg-amber-950 text-amber-300 border-amber-500/50 shadow-amber-950'
                }`}
              >
                <span className="text-xs opacity-75">{targetPlayer.team}</span>
                <span className="text-lg">#{targetPlayer.jersey}</span>
              </div>
              <div>
                <h3 className="font-sports font-bold text-lg text-neutral-100 leading-tight">
                  {targetPlayer.name}
                </h3>
                <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-neutral-300">{targetPlayer.teamName}</span>
                  <span>•</span>
                  <span>{targetPlayer.position}</span>
                </div>
              </div>
            </div>

            {/* Stats Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-neutral-800/80">
              <div className="bg-neutral-900/90 p-2 rounded-xl border border-neutral-800/60">
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                  {isNFL ? 'Conf & Division' : 'League & Division'}
                </span>
                <span className="font-semibold text-neutral-200">
                  {isNFL
                    ? `${nfl?.conference} ${nfl?.division}`
                    : `${mlb?.league} ${mlb?.division}`}
                </span>
              </div>

              <div className="bg-neutral-900/90 p-2 rounded-xl border border-neutral-800/60">
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                  Age & Experience
                </span>
                <span className="font-semibold text-neutral-200">
                  {targetPlayer.age} years old
                </span>
              </div>

              <div className="bg-neutral-900/90 p-2 rounded-xl border border-neutral-800/60">
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                  {isNFL ? 'Alma Mater' : 'Bat / Throw Hand'}
                </span>
                <span className="font-semibold text-neutral-200">
                  {isNFL ? nfl?.college : mlb?.batsThrows}
                </span>
              </div>

              <div className="bg-neutral-900/90 p-2 rounded-xl border border-neutral-800/60">
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                  {isNFL ? 'Pro Bowls & Rings' : 'All-Stars & Rings'}
                </span>
                <span className="font-semibold text-neutral-200">
                  {targetPlayer.accoladesCount} Accolades • {targetPlayer.rings || 0} Rings
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <button
              id="share-game-result-btn"
              onClick={handleCopyShare}
              className={`w-full py-3 px-4 rounded-xl font-sports font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-lg shadow-emerald-950/40'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Result Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share Grid Result (Wordle Emojis)</span>
                </>
              )}
            </button>

            <button
              id="play-again-modal-btn"
              onClick={() => {
                onClose();
                onPlayAgain();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isDaily ? 'Switch to Free Play Practice' : 'Play Another Star Target'}</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
