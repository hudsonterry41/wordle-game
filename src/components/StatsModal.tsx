import React, { useState } from 'react';
import { GameStats, LeagueType } from '../types';
import { getStoredStats } from '../utils/gameLogic';
import { X, Trophy, Flame, Award, BarChart3, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLeague: LeagueType;
}

const TROPHY_DEFINITIONS = [
  { id: 'FIRST_WIN', title: 'First Down / Base Hit', desc: 'Score your very first game victory', icon: '🏆' },
  { id: 'QUICK_STRIKE', title: 'Quick Strike Offense', desc: 'Identify the star in 3 or fewer drives', icon: '⚡' },
  { id: 'HOLE_IN_ONE', title: 'Pick-Six Ace', desc: 'Nail the mystery player on your very first guess', icon: '🎯' },
  { id: 'HAIL_MARY_CLUTCH', title: 'Hail Mary / Walk-Off', desc: 'Clutch victory on the final 8th guess', icon: '🛡️' },
  { id: 'HOT_STREAK_5', title: '5-Game Win Streak', desc: 'Win 5 consecutive games without a loss', icon: '🔥' },
  { id: 'LEGEND_STREAK_10', title: 'Hall of Fame Streak', desc: 'Win 10 consecutive games in a row', icon: '👑' },
];

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  activeLeague,
}) => {
  const [selectedLeague, setSelectedLeague] = useState<LeagueType>(activeLeague);

  if (!isOpen) return null;

  const stats: GameStats = getStoredStats(selectedLeague);
  const winPercentage = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;

  // Max guess count for bar scale
  const maxBarVal = Math.max(...Object.values(stats.guessDistribution), 1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-6 shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header & League Toggle */}
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="font-sports font-bold text-xl uppercase tracking-wider">
                Career Stats & Trophies
              </h2>
            </div>

            <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
              <button
                onClick={() => setSelectedLeague('NFL')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  selectedLeague === 'NFL' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                NFL
              </button>
              <button
                onClick={() => setSelectedLeague('MLB')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  selectedLeague === 'MLB' ? 'bg-amber-600 text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                MLB
              </button>
            </div>
          </div>

          {/* Top Numbers Grid */}
          <div className="grid grid-cols-4 gap-2 text-center mb-6">
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80">
              <div className="font-sports font-bold text-2xl text-neutral-100">{stats.played}</div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Played</div>
            </div>
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80">
              <div className="font-sports font-bold text-2xl text-emerald-400">{winPercentage}%</div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Win Rate</div>
            </div>
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80">
              <div className="font-sports font-bold text-2xl text-amber-400">{stats.currentStreak}</div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Streak</div>
            </div>
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80">
              <div className="font-sports font-bold text-2xl text-purple-400">{stats.maxStreak}</div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Max Streak</div>
            </div>
          </div>

          {/* Guess Distribution Chart */}
          <div className="mb-6">
            <h3 className="font-sports font-bold text-xs uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-neutral-400" />
              Drive / Guess Distribution
            </h3>
            <div className="space-y-1.5 text-xs font-semibold">
              {Array.from({ length: 8 }).map((_, idx) => {
                const count = stats.guessDistribution[idx + 1] || 0;
                const pct = Math.max(8, (count / maxBarVal) * 100);

                return (
                  <div key={`dist-${idx}`} className="flex items-center gap-2">
                    <span className="w-4 text-neutral-400 font-sports">{idx + 1}</span>
                    <div className="flex-1 bg-neutral-950 rounded-lg overflow-hidden h-6 p-0.5">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded flex items-center justify-end px-2 font-sports text-xs transition-all duration-500 ${
                          count > 0
                            ? selectedLeague === 'NFL'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-amber-600 text-white font-bold'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trophy Room */}
          <div>
            <h3 className="font-sports font-bold text-xs uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Trophy Showcase & Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TROPHY_DEFINITIONS.map((trophy) => {
                const isUnlocked = stats.unlockedTrophies?.includes(trophy.id);

                return (
                  <div
                    key={trophy.id}
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all ${
                      isUnlocked
                        ? 'bg-neutral-950 border-amber-500/40 text-neutral-200 shadow-sm shadow-amber-950/20'
                        : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-500 opacity-50'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{trophy.icon}</span>
                    <div>
                      <div className="font-sports font-bold text-xs flex items-center gap-1 text-neutral-200">
                        <span>{trophy.title}</span>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                        {trophy.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
