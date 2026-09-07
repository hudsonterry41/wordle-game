import React from 'react';
import { X, HelpCircle, ArrowUp, ArrowDown, Radio, Eye, Flame, Award, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LeagueType } from '../types';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: LeagueType;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  league,
}) => {
  if (!isOpen) return null;

  const isNFL = league === 'NFL';

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

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-neutral-800">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="font-sports font-bold text-xl uppercase tracking-wider">
                How To Play {league} Wordle
              </h2>
              <p className="text-xs text-neutral-400">
                8 drives to identify the mystery sports superstar
              </p>
            </div>
          </div>

          {/* Section 1: Core Guessing */}
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="font-sports font-bold text-sm text-neutral-200 uppercase tracking-wide mb-1.5">
                1. Attribute Color Coding
              </h3>
              <p className="text-neutral-400 mb-2 leading-relaxed">
                After each guess, the tiles will change colors to show how close your guess was to the mystery star:
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 font-bold text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold text-emerald-400 uppercase">Green: Exact Match</span>
                    <p className="text-neutral-400">Correct team, conference, division, position, jersey #, or age.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="w-8 h-8 rounded-lg bg-amber-500 font-bold text-neutral-950 flex items-center justify-center shrink-0">
                    ~
                  </span>
                  <div>
                    <span className="font-bold text-amber-400 uppercase">Yellow: Close / Division Rival</span>
                    <p className="text-neutral-400">Same division (Team), same unit group (Position), or Jersey/Age is very close.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="w-8 h-8 rounded-lg bg-orange-500 font-bold text-neutral-950 flex items-center justify-center shrink-0">
                    Conf
                  </span>
                  <div>
                    <span className="font-bold text-orange-400 uppercase">Orange: Same Conference / League</span>
                    <p className="text-neutral-400">{isNFL ? 'Plays in the same conference (AFC or NFC).' : 'Plays in the same league (AL or NL).'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="flex gap-1 shrink-0">
                    <span className="w-6 h-8 rounded-lg bg-neutral-800 font-bold text-rose-300 flex items-center justify-center">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-6 h-8 rounded-lg bg-neutral-800 font-bold text-sky-300 flex items-center justify-center">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-200 uppercase">Arrows: Higher or Lower</span>
                    <p className="text-neutral-400">Indicates whether the target player&apos;s jersey number or age is higher or lower.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Exclusive Special Features */}
            <div className="pt-2 border-t border-neutral-800">
              <h3 className="font-sports font-bold text-sm text-neutral-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                2. Exclusive Special Features & Perks
              </h3>
              <p className="text-neutral-400 mb-2 leading-relaxed">
                Unlike ordinary Wordle, you have special in-game coaching tools to crack tough rosters:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="font-sports font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    <Radio className="w-3.5 h-3.5" />
                    {isNFL ? 'Call Audible' : 'Sign Steal'}
                  </span>
                  <p className="text-neutral-400">
                    Reveals scouting background: {isNFL ? 'College/Alma Mater' : 'Bat/Throw hand orientation'}.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="font-sports font-bold text-sky-400 flex items-center gap-1 mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    {isNFL ? "Coach's Challenge" : 'Umpire Review'}
                  </span>
                  <p className="text-neutral-400">
                    Instant radar check confirming {isNFL ? 'AFC vs NFC' : 'AL vs NL'} without burning a guess.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="font-sports font-bold text-amber-400 flex items-center gap-1 mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    Heat Check
                  </span>
                  <p className="text-neutral-400">
                    Reveals exact jersey number quadrant range (1-20, 21-50, 51+).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="font-sports font-bold text-purple-400 flex items-center gap-1 mb-1">
                    <Award className="w-3.5 h-3.5" />
                    Hail Mary / Walk-Off
                  </span>
                  <p className="text-neutral-400">
                    Unlocks after drive 4 to provide +1 clutch extra guess safety net!
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: 5-Letter Franchise Cipher */}
            <div className="pt-2 border-t border-neutral-800">
              <h3 className="font-sports font-bold text-sm text-neutral-200 uppercase tracking-wide mb-1.5">
                3. Franchise Cipher Sub-Mode
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Toggle between <span className="text-neutral-200 font-semibold">Player Identity Mode</span> and <span className="text-neutral-200 font-semibold">5-Letter Cipher</span> in the header to play classic 5-letter Wordle themed specifically around sports terms, legends, and team nicknames!
              </p>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-sports font-bold text-sm transition-colors"
            >
              Let&apos;s Play!
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
