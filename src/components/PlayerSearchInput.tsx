import React, { useState, useRef, useEffect } from 'react';
import { AnyPlayer, LeagueType, NFLPlayer, MLBPlayer } from '../types';
import { Search, ChevronDown, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PlayerSearchInputProps {
  league: LeagueType;
  availablePlayers: AnyPlayer[];
  guessedPlayerIds: string[];
  onSelectPlayer: (player: AnyPlayer) => void;
  disabled: boolean;
  guessCount: number;
  maxGuesses: number;
}

export const PlayerSearchInput: React.FC<PlayerSearchInputProps> = ({
  league,
  availablePlayers,
  guessedPlayerIds,
  onSelectPlayer,
  disabled,
  guessCount,
  maxGuesses,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isNFL = league === 'NFL';

  // Filter players based on search query
  const filteredPlayers = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return availablePlayers.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchTeam = p.team.toLowerCase().includes(q) || p.teamName.toLowerCase().includes(q);
      const matchPos = p.position.toLowerCase() === q;
      const matchJersey = String(p.jersey) === q;
      return matchName || matchTeam || matchPos || matchJersey;
    }).slice(0, 10);
  }, [query, availablePlayers]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (player: AnyPlayer) => {
    if (guessedPlayerIds.includes(player.id)) return;
    onSelectPlayer(player);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(0);
    if (isNFL) {
      soundManager.playWhistle();
    } else {
      soundManager.playBatCrack();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredPlayers.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredPlayers.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredPlayers.length) % filteredPlayers.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredPlayers[selectedIndex];
      if (target) {
        handleSelect(target);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Sports-themed down / inning labels
  const getProgressLabel = () => {
    const current = guessCount + 1;
    if (isNFL) {
      if (current === 1) return '1st Down: Clean Pocket';
      if (current === 2) return '2nd Down: Mid-Field';
      if (current === 3) return '3rd & Long: Pressure On';
      if (current === 4) return '4th & Goal: Red Zone';
      if (current === 5) return '2-Minute Warning';
      if (current === 6) return 'Hail Mary Distance';
      if (current === 7) return 'Overtime Snap';
      return 'Sudden Death Overtime';
    } else {
      if (current === 1) return 'Top 1st Inning: Lead-Off';
      if (current === 2) return 'Top 3rd Inning: Bases Loaded';
      if (current === 3) return '5th Inning: Bullpen Warming';
      if (current === 4) return '7th Inning Stretch';
      if (current === 5) return 'Bottom 8th: Setup Man';
      if (current === 6) return 'Bottom 9th: 2 Outs';
      if (current === 7) return 'Full Count: 3-2 Pitch';
      return 'Bottom 10th: Walk-Off Chance';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4 px-2" ref={wrapperRef}>
      {/* Game situation banner */}
      <div className="flex items-center justify-between text-xs font-semibold px-1 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              isNFL ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span className="font-sports tracking-wide text-neutral-300 uppercase">
            {getProgressLabel()}
          </span>
        </div>
        <div className="text-neutral-400 font-sports">
          Guess <span className="text-neutral-100 font-bold">{guessCount}</span> of{' '}
          <span className="text-neutral-100 font-bold">{maxGuesses}</span>
        </div>
      </div>

      {/* Input container */}
      <div className="relative">
        <div
          className={`flex items-center gap-2 bg-neutral-900/90 border rounded-2xl px-4 py-3 shadow-lg transition-all ${
            isOpen
              ? isNFL
                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                : 'border-amber-500 ring-2 ring-amber-500/20'
              : 'border-neutral-700/80 hover:border-neutral-600'
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            id="player-search-input"
            ref={inputRef}
            type="text"
            value={query}
            disabled={disabled}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? 'Game concluded'
                : isNFL
                ? 'Type an NFL player (e.g. Mahomes, Jefferson, Allen, Lamar)...'
                : 'Type an MLB player (e.g. Ohtani, Judge, Harper, Soto)...'
            }
            className="w-full bg-transparent text-neutral-100 text-sm sm:text-base outline-none placeholder:text-neutral-500 font-medium"
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded bg-neutral-800"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown menu */}
        {isOpen && query.trim() !== '' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-700/90 rounded-xl shadow-2xl overflow-hidden z-40 max-h-80 overflow-y-auto">
            {filteredPlayers.length === 0 ? (
              <div className="p-4 text-center text-sm text-neutral-400">
                No active {league} players found matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              <ul className="divide-y divide-neutral-800">
                {filteredPlayers.map((player, idx) => {
                  const alreadyGuessed = guessedPlayerIds.includes(player.id);
                  const isSelected = idx === selectedIndex;
                  const nfl = isNFL ? (player as NFLPlayer) : null;
                  const mlb = !isNFL ? (player as MLBPlayer) : null;

                  return (
                    <li key={player.id}>
                      <button
                        id={`player-option-${player.id}`}
                        type="button"
                        disabled={alreadyGuessed}
                        onClick={() => handleSelect(player)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                          alreadyGuessed
                            ? 'opacity-40 cursor-not-allowed bg-neutral-900'
                            : isSelected
                            ? isNFL
                              ? 'bg-emerald-950/70 text-white'
                              : 'bg-amber-950/70 text-white'
                            : 'hover:bg-neutral-800/60 text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-10 h-7 rounded flex items-center justify-center text-xs font-sports font-bold tracking-wider ${
                              isNFL
                                ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-600/40'
                                : 'bg-amber-800/80 text-amber-200 border border-amber-600/40'
                            }`}
                          >
                            #{player.jersey}
                          </span>
                          <div>
                            <div className="font-semibold text-sm flex items-center gap-2">
                              <span>{player.name}</span>
                              {alreadyGuessed && (
                                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Guessed
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                              <span className="font-semibold text-neutral-300">{player.team}</span>
                              <span>•</span>
                              <span>{player.teamName}</span>
                              <span>•</span>
                              <span className="text-neutral-300 font-medium">{player.position}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-xs text-neutral-400 shrink-0 hidden sm:block">
                          {isNFL && nfl && (
                            <div>
                              <span>{nfl.conference} {nfl.division}</span>
                              <div className="text-[11px] text-neutral-500">{nfl.college}</div>
                            </div>
                          )}
                          {!isNFL && mlb && (
                            <div>
                              <span>{mlb.league} {mlb.division}</span>
                              <div className="text-[11px] text-neutral-500">Bats: {mlb.batsThrows}</div>
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
