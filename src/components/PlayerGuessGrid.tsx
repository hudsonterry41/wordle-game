import React from 'react';
import { PlayerGuessResult, LeagueType, NFLPlayer, MLBPlayer } from '../types';
import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, Check, Shield } from 'lucide-react';

interface PlayerGuessGridProps {
  league: LeagueType;
  guesses: PlayerGuessResult[];
  maxGuesses: number;
}

export const PlayerGuessGrid: React.FC<PlayerGuessGridProps> = ({
  league,
  guesses,
  maxGuesses,
}) => {
  const isNFL = league === 'NFL';

  // Helper for background color classes
  const getCellClass = (status: 'green' | 'yellow' | 'orange' | 'gray') => {
    switch (status) {
      case 'green':
        return 'bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-950';
      case 'yellow':
        return 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-sm shadow-amber-950';
      case 'orange':
        return 'bg-orange-500 text-neutral-950 font-bold border-orange-400';
      case 'gray':
      default:
        return 'bg-neutral-800/90 text-neutral-300 border-neutral-700/60';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 my-2 overflow-x-auto">
      <div className="min-w-[720px] rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3 shadow-xl backdrop-blur-sm">
        
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-2 text-center text-xs font-sports font-bold tracking-wider text-neutral-400 border-b border-neutral-800 pb-2 mb-2 uppercase">
          <div className="col-span-2 text-left pl-2">Player</div>
          <div>Team</div>
          <div>{isNFL ? 'Conf' : 'League'}</div>
          <div>Div</div>
          <div>Pos</div>
          <div>Jersey #</div>
          <div>Age</div>
        </div>

        {/* Guesses list */}
        {guesses.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-2">
            <Shield className="w-8 h-8 opacity-40" />
            <p className="text-sm font-medium">
              Ready for kickoff. Search and select a player above to make your first play!
            </p>
            <p className="text-xs text-neutral-600 max-w-md">
              Colors will indicate exact matches (green), same division or close proximity (yellow), and higher/lower arrows for stats.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {guesses.map((guess, rowIdx) => {
              const p = guess.player;
              const nfl = isNFL ? (p as NFLPlayer) : null;
              const mlb = !isNFL ? (p as MLBPlayer) : null;

              // Team match color
              const teamStatus =
                guess.teamMatch === 'exact'
                  ? 'green'
                  : guess.teamMatch === 'same-div'
                  ? 'yellow'
                  : guess.teamMatch === 'same-conf'
                  ? 'orange'
                  : 'gray';

              // Conference / League match color
              const confStatus = guess.confMatch ? 'green' : 'gray';

              // Division match color
              const divStatus = guess.divMatch ? 'green' : 'gray';

              // Position match color
              const posStatus =
                guess.posMatch === 'exact'
                  ? 'green'
                  : guess.posMatch === 'same-group'
                  ? 'yellow'
                  : 'gray';

              // Jersey match color
              const jerseyStatus =
                guess.jerseyMatch.status === 'exact'
                  ? 'green'
                  : guess.jerseyMatch.status === 'close'
                  ? 'yellow'
                  : 'gray';

              // Age match color
              const ageStatus =
                guess.ageMatch.status === 'exact'
                  ? 'green'
                  : guess.ageMatch.status === 'close'
                  ? 'yellow'
                  : 'gray';

              return (
                <motion.div
                  key={`${p.id}-${rowIdx}`}
                  initial={{ opacity: 0, y: -12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="grid grid-cols-8 gap-2 items-center text-xs font-semibold"
                >
                  {/* Player Name Column (Spans 2) */}
                  <div className="col-span-2 flex items-center gap-2 p-2 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-sports text-xs shrink-0 font-bold ${
                        guess.isWin
                          ? 'bg-emerald-500 text-black animate-bounce'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {rowIdx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-neutral-100 truncate text-xs sm:text-sm">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">
                        {p.teamName}
                      </div>
                    </div>
                  </div>

                  {/* Team Column */}
                  <div
                    className={`h-12 rounded-xl flex flex-col items-center justify-center border transition-all ${getCellClass(
                      teamStatus
                    )}`}
                    title={`Team: ${p.team} (${
                      teamStatus === 'green'
                        ? 'Correct'
                        : teamStatus === 'yellow'
                        ? 'Same Division'
                        : teamStatus === 'orange'
                        ? 'Same Conference'
                        : 'Different'
                    })`}
                  >
                    <span className="font-sports font-bold text-sm tracking-wide">{p.team}</span>
                    {guess.teamMatch === 'same-div' && (
                      <span className="text-[9px] uppercase tracking-tighter opacity-80">Div Rival</span>
                    )}
                  </div>

                  {/* Conf / League Column */}
                  <div
                    className={`h-12 rounded-xl flex items-center justify-center border font-sports font-bold text-sm ${getCellClass(
                      confStatus
                    )}`}
                  >
                    {isNFL ? nfl?.conference : mlb?.league}
                  </div>

                  {/* Division Column */}
                  <div
                    className={`h-12 rounded-xl flex items-center justify-center border font-sports font-bold text-xs ${getCellClass(
                      divStatus
                    )}`}
                  >
                    {isNFL ? nfl?.division : mlb?.division}
                  </div>

                  {/* Position Column */}
                  <div
                    className={`h-12 rounded-xl flex flex-col items-center justify-center border ${getCellClass(
                      posStatus
                    )}`}
                    title={`Position: ${p.position} (${p.positionGroup})`}
                  >
                    <span className="font-sports font-bold text-sm">{p.position}</span>
                    <span className="text-[9px] opacity-80">
                      {isNFL ? p.positionGroup : (mlb?.positionGroup === 'Pitcher' ? 'Pitch' : mlb?.positionGroup)}
                    </span>
                  </div>

                  {/* Jersey Number Column */}
                  <div
                    className={`h-12 rounded-xl flex items-center justify-center gap-1 border font-sports font-bold text-sm ${getCellClass(
                      jerseyStatus
                    )}`}
                  >
                    <span>#{p.jersey}</span>
                    {guess.jerseyMatch.direction === 'higher' && (
                      <ArrowUp className="w-3.5 h-3.5 stroke-[3] text-rose-300" title="Target jersey is HIGHER" />
                    )}
                    {guess.jerseyMatch.direction === 'lower' && (
                      <ArrowDown className="w-3.5 h-3.5 stroke-[3] text-sky-300" title="Target jersey is LOWER" />
                    )}
                    {guess.jerseyMatch.direction === 'match' && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>

                  {/* Age Column */}
                  <div
                    className={`h-12 rounded-xl flex items-center justify-center gap-1 border font-sports font-bold text-sm ${getCellClass(
                      ageStatus
                    )}`}
                  >
                    <span>{p.age}</span>
                    {guess.ageMatch.direction === 'higher' && (
                      <ArrowUp className="w-3.5 h-3.5 stroke-[3] text-rose-300" title="Target age is OLDER" />
                    )}
                    {guess.ageMatch.direction === 'lower' && (
                      <ArrowDown className="w-3.5 h-3.5 stroke-[3] text-sky-300" title="Target age is YOUNGER" />
                    )}
                    {guess.ageMatch.direction === 'match' && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Empty remaining rows indicators */}
            {Array.from({ length: Math.max(0, maxGuesses - guesses.length) }).map((_, idx) => (
              <div
                key={`empty-row-${idx}`}
                className="grid grid-cols-8 gap-2 items-center text-xs opacity-25 py-1"
              >
                <div className="col-span-2 h-10 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 flex items-center px-3 gap-2">
                  <span className="w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-500 font-sports">
                    {guesses.length + idx + 1}
                  </span>
                  <span className="text-neutral-500 font-mono text-[11px]">Empty Drive Slot</span>
                </div>
                <div className="h-10 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20" />
                <div className="h-10 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20" />
                <div className="h-10 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20" />
                <div className="h-10 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20" />
                <div className="h-10 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20" />
                <div className="h-10 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20" />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
