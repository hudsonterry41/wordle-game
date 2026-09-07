import React from 'react';
import { LeagueType, GameSubMode } from '../types';
import { Volume2, VolumeX, HelpCircle, Trophy, RotateCcw, Shield, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  league: LeagueType;
  subMode: GameSubMode;
  onLeagueChange: (league: LeagueType) => void;
  onSubModeChange: (mode: GameSubMode) => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onResetGame: () => void;
  isDaily: boolean;
  onToggleDaily: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  league,
  subMode,
  onLeagueChange,
  onSubModeChange,
  onOpenHowToPlay,
  onOpenStats,
  onResetGame,
  isDaily,
  onToggleDaily,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.getMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playClick();
    }
  };

  const isNFL = league === 'NFL';

  return (
    <header className="w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3">
        {/* Top bar: Brand, League Switcher & Action Icons */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-sports font-bold text-lg shadow-md transition-colors ${
                isNFL
                  ? 'bg-emerald-600 text-white shadow-emerald-900/40 border border-emerald-400/30'
                  : 'bg-amber-600 text-white shadow-amber-900/40 border border-amber-400/30'
              }`}
            >
              {isNFL ? 'NFL' : 'MLB'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sports font-bold tracking-wider text-lg sm:text-xl text-neutral-100 uppercase">
                  {isNFL ? 'Gridiron Wordle' : 'Diamond Wordle'}
                </h1>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                    isNFL ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  Pro Edition
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                {isNFL ? 'Guess the mystery NFL star & unlock scouting audibles' : 'Identify the MLB star & decode the diamond'}
              </p>
            </div>
          </div>

          {/* League Selector (NFL vs MLB) */}
          <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 shadow-inner">
            <button
              id="select-nfl-league-btn"
              onClick={() => {
                soundManager.playWhistle();
                onLeagueChange('NFL');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                isNFL
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <span>🏈</span>
              <span>NFL</span>
            </button>
            <button
              id="select-mlb-league-btn"
              onClick={() => {
                soundManager.playBatCrack();
                onLeagueChange('MLB');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                !isNFL
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <span>⚾</span>
              <span>MLB</span>
            </button>
          </div>

          {/* Utility buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="toggle-daily-mode-btn"
              onClick={() => {
                soundManager.playClick();
                onToggleDaily();
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border ${
                isDaily
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-700/50 hover:bg-indigo-900/60'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
              }`}
              title="Toggle Daily Challenge vs Practice Free Play"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">{isDaily ? 'Daily Target' : 'Free Play'}</span>
            </button>

            <button
              id="reset-practice-btn"
              onClick={() => {
                soundManager.playClick();
                onResetGame();
              }}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
              title="New Practice Target"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="audio-toggle-btn"
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
              title={isMuted ? 'Unmute Stadium Sounds' : 'Mute Sounds'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              id="stats-modal-btn"
              onClick={() => {
                soundManager.playClick();
                onOpenStats();
              }}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
              title="View Career Stats & Trophies"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
            </button>

            <button
              id="how-to-play-btn"
              onClick={() => {
                soundManager.playClick();
                onOpenHowToPlay();
              }}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors"
              title="How to Play & Special Features"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-mode navigation bar: Player Identity vs 5-Letter Cipher */}
        <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 bg-neutral-900/80 p-0.5 rounded-lg border border-neutral-800">
            <button
              id="mode-player-identity-btn"
              onClick={() => {
                soundManager.playClick();
                onSubModeChange('player');
              }}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                subMode === 'player'
                  ? 'bg-neutral-800 text-neutral-100 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="font-sports font-semibold">Player Identity Mode</span> (Full Roster)
            </button>
            <button
              id="mode-franchise-cipher-btn"
              onClick={() => {
                soundManager.playClick();
                onSubModeChange('cipher');
              }}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                subMode === 'cipher'
                  ? 'bg-neutral-800 text-neutral-100 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="font-sports font-semibold">5-Letter Cipher</span> (Franchise Wordle)
            </button>
          </div>

          <div className="text-neutral-400 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-neutral-500" />
            <span>
              {isNFL ? '32 Franchises • All Divisions' : '30 Ballclubs • AL & NL'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
