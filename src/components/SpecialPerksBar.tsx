import React from 'react';
import { AnyPlayer, LeagueType, NFLPlayer, MLBPlayer, PowerUpState } from '../types';
import { Radio, Eye, Flame, Award, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SpecialPerksBarProps {
  league: LeagueType;
  target: AnyPlayer;
  powerUps: PowerUpState;
  onUseAudible: () => void;
  onUseChallenge: () => void;
  onUseHeatCheck: () => void;
  onUseHailMary: () => void;
  disabled: boolean;
  guessesCount: number;
}

export const SpecialPerksBar: React.FC<SpecialPerksBarProps> = ({
  league,
  target,
  powerUps,
  onUseAudible,
  onUseChallenge,
  onUseHeatCheck,
  onUseHailMary,
  disabled,
  guessesCount,
}) => {
  const isNFL = league === 'NFL';
  const nfl = isNFL ? (target as NFLPlayer) : null;
  const mlb = !isNFL ? (target as MLBPlayer) : null;

  return (
    <div className="w-full max-w-4xl mx-auto my-3 px-2">
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <span className="text-sm font-sports font-bold tracking-wider text-neutral-200 uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              {isNFL ? 'Playbook Audibles & Coach Perks' : 'Dugout Signals & Umpire Reviews'}
            </span>
            <span className="text-[11px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
              Exclusive Features
            </span>
          </div>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            1 use per perk to crack tough players
          </span>
        </div>

        {/* Perks Button Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          
          {/* Perk 1: Audible / Sign Steal */}
          <button
            id="perk-audible-btn"
            type="button"
            disabled={disabled || powerUps.audibleRevealed}
            onClick={() => {
              soundManager.playWhistle();
              onUseAudible();
            }}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
              powerUps.audibleRevealed
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                : disabled
                ? 'opacity-50 cursor-not-allowed bg-neutral-950 border-neutral-800 text-neutral-500'
                : 'bg-neutral-950/80 border-neutral-800 hover:border-emerald-500/40 hover:bg-neutral-800/50 text-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-sports font-bold text-xs uppercase flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                {isNFL ? 'Call Audible' : 'Sign Steal'}
              </span>
              {powerUps.audibleRevealed && (
                <span className="text-[10px] text-emerald-400 font-semibold uppercase">Active</span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              {powerUps.audibleRevealed ? (
                <span className="text-emerald-300 font-semibold">
                  {isNFL ? `College: ${nfl?.college}` : `Bats/Throws: ${mlb?.batsThrows}`}
                </span>
              ) : (
                isNFL ? 'Reveals player college' : 'Reveals bats / throws style'
              )}
            </p>
          </button>

          {/* Perk 2: Coach Challenge / Umpire Review */}
          <button
            id="perk-challenge-btn"
            type="button"
            disabled={disabled || powerUps.challengeUsed}
            onClick={() => {
              soundManager.playClick();
              onUseChallenge();
            }}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
              powerUps.challengeUsed
                ? 'bg-sky-950/40 border-sky-500/50 text-sky-300 ring-1 ring-sky-500/30'
                : disabled
                ? 'opacity-50 cursor-not-allowed bg-neutral-950 border-neutral-800 text-neutral-500'
                : 'bg-neutral-950/80 border-neutral-800 hover:border-sky-500/40 hover:bg-neutral-800/50 text-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-sports font-bold text-xs uppercase flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                {isNFL ? "Coach's Flag" : 'Umpire Review'}
              </span>
              {powerUps.challengeUsed && (
                <span className="text-[10px] text-sky-400 font-semibold uppercase">Active</span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              {powerUps.challengeUsed ? (
                <span className="text-sky-300 font-semibold">
                  {isNFL ? `${nfl?.conference} Conference confirmed` : `${mlb?.league} League confirmed`}
                </span>
              ) : (
                isNFL ? 'Confirms AFC or NFC' : 'Confirms AL or NL'
              )}
            </p>
          </button>

          {/* Perk 3: Heat Check Radar */}
          <button
            id="perk-heatcheck-btn"
            type="button"
            disabled={disabled || powerUps.heatCheckUsed}
            onClick={() => {
              soundManager.playClick();
              onUseHeatCheck();
            }}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
              powerUps.heatCheckUsed
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30'
                : disabled
                ? 'opacity-50 cursor-not-allowed bg-neutral-950 border-neutral-800 text-neutral-500'
                : 'bg-neutral-950/80 border-neutral-800 hover:border-amber-500/40 hover:bg-neutral-800/50 text-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-sports font-bold text-xs uppercase flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Heat Check
              </span>
              {powerUps.heatCheckUsed && (
                <span className="text-[10px] text-amber-400 font-semibold uppercase">Active</span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              {powerUps.heatCheckUsed ? (
                <span className="text-amber-300 font-semibold">
                  Jersey #{target.jersey <= 20 ? '1 to 20' : target.jersey <= 50 ? '21 to 50' : '51+'}
                </span>
              ) : (
                'Proximity scan on jersey range'
              )}
            </p>
          </button>

          {/* Perk 4: 4th & Inches / Walk-Off Lifeline */}
          <button
            id="perk-hailmary-btn"
            type="button"
            disabled={disabled || powerUps.hailMaryUsed || guessesCount < 4}
            onClick={() => {
              soundManager.playCheer();
              onUseHailMary();
            }}
            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
              powerUps.hailMaryUsed
                ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 ring-1 ring-purple-500/30'
                : disabled || guessesCount < 4
                ? 'opacity-50 cursor-not-allowed bg-neutral-950 border-neutral-800 text-neutral-500'
                : 'bg-neutral-950/80 border-neutral-800 hover:border-purple-500/40 hover:bg-neutral-800/50 text-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-sports font-bold text-xs uppercase flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                {isNFL ? 'Hail Mary +1' : 'Extra Inning +1'}
              </span>
              {powerUps.hailMaryUsed && (
                <span className="text-[10px] text-purple-400 font-semibold uppercase">Unlocked</span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              {powerUps.hailMaryUsed ? (
                <span className="text-purple-300 font-semibold">
                  +1 Extra guess added!
                </span>
              ) : guessesCount < 4 ? (
                'Unlocks after 4th guess'
              ) : (
                '+1 Extra guess safety net'
              )}
            </p>
          </button>

        </div>
      </div>
    </div>
  );
};
