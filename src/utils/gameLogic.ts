import { AnyPlayer, NFLPlayer, MLBPlayer, PlayerGuessResult, LeagueType, GameStats } from '../types';
import { NFL_PLAYERS, NFL_DIVISIONS } from '../data/nflPlayers';
import { MLB_PLAYERS, MLB_DIVISIONS } from '../data/mlbPlayers';

export function evaluatePlayerGuess(guess: AnyPlayer, target: AnyPlayer, league: LeagueType): PlayerGuessResult {
  const isWin = guess.id === target.id;

  let teamMatch: 'exact' | 'same-div' | 'same-conf' | 'none' = 'none';
  let confMatch = false;
  let divMatch = false;

  if (league === 'NFL') {
    const g = guess as NFLPlayer;
    const t = target as NFLPlayer;

    confMatch = g.conference === t.conference;
    divMatch = g.division === t.division;

    if (g.team === t.team) {
      teamMatch = 'exact';
    } else if (g.conference === t.conference && g.division === t.division) {
      teamMatch = 'same-div';
    } else if (g.conference === t.conference) {
      teamMatch = 'same-conf';
    }
  } else {
    const g = guess as MLBPlayer;
    const t = target as MLBPlayer;

    confMatch = g.league === t.league;
    divMatch = g.division === t.division;

    if (g.team === t.team) {
      teamMatch = 'exact';
    } else if (g.league === t.league && g.division === t.division) {
      teamMatch = 'same-div';
    } else if (g.league === t.league) {
      teamMatch = 'same-conf';
    }
  }

  // Position match
  let posMatch: 'exact' | 'same-group' | 'none' = 'none';
  if (guess.position === target.position) {
    posMatch = 'exact';
  } else if (guess.positionGroup === target.positionGroup) {
    posMatch = 'same-group';
  }

  // Jersey
  const jerseyDiff = Math.abs(guess.jersey - target.jersey);
  const jerseyMatch = {
    status: guess.jersey === target.jersey ? ('exact' as const) : (jerseyDiff <= 4 ? ('close' as const) : ('different' as const)),
    direction: guess.jersey === target.jersey ? ('match' as const) : (guess.jersey < target.jersey ? ('higher' as const) : ('lower' as const)),
    diff: jerseyDiff,
  };

  // Age
  const ageDiff = Math.abs(guess.age - target.age);
  const ageMatch = {
    status: guess.age === target.age ? ('exact' as const) : (ageDiff <= 2 ? ('close' as const) : ('different' as const)),
    direction: guess.age === target.age ? ('match' as const) : (guess.age < target.age ? ('higher' as const) : ('lower' as const)),
    diff: ageDiff,
  };

  // Accolades
  const accDiff = Math.abs(guess.accoladesCount - target.accoladesCount);
  const accoladeMatch = {
    status: guess.accoladesCount === target.accoladesCount ? ('exact' as const) : (accDiff <= 2 ? ('close' as const) : ('different' as const)),
    direction: guess.accoladesCount === target.accoladesCount ? ('match' as const) : (guess.accoladesCount < target.accoladesCount ? ('higher' as const) : ('lower' as const)),
    diff: accDiff,
  };

  return {
    player: guess,
    isWin,
    teamMatch,
    confMatch,
    divMatch,
    posMatch,
    jerseyMatch,
    ageMatch,
    accoladeMatch,
  };
}

export function getDailyPlayer(league: LeagueType, seedOffset: number = 0): AnyPlayer {
  const players = league === 'NFL' ? NFL_PLAYERS : MLB_PLAYERS;
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + seedOffset;
  
  // Deterministic pseudo-random index
  const index = Math.abs((dateSeed * 9301 + 49297) % 233280) % players.length;
  return players[index];
}

export function getRandomPlayer(league: LeagueType, excludeId?: string): AnyPlayer {
  const players = league === 'NFL' ? NFL_PLAYERS : MLB_PLAYERS;
  const filtered = excludeId ? players.filter(p => p.id !== excludeId) : players;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getDailyCipherIndex(length: number, seedOffset: number = 0): number {
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + seedOffset;
  return Math.abs((dateSeed * 7919 + 104729) % 233280) % length;
}

const STATS_KEY = 'sportsdle_stats_v1';

export function getStoredStats(league: LeagueType): GameStats {
  try {
    const raw = localStorage.getItem(`${STATS_KEY}_${league}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Default fallback
  }

  return {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
    unlockedTrophies: [],
  };
}

export function saveStoredStats(league: LeagueType, stats: GameStats) {
  try {
    localStorage.setItem(`${STATS_KEY}_${league}`, JSON.stringify(stats));
  } catch {
    // Handled
  }
}

export function updateGameStats(league: LeagueType, isWin: boolean, guessCount: number): GameStats {
  const stats = getStoredStats(league);
  stats.played += 1;
  const todayStr = new Date().toISOString().split('T')[0];
  stats.lastPlayedDate = todayStr;

  if (isWin) {
    stats.won += 1;
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
    const countKey = Math.min(Math.max(guessCount, 1), 8);
    stats.guessDistribution[countKey] = (stats.guessDistribution[countKey] || 0) + 1;

    // Check trophies
    const trophies = new Set(stats.unlockedTrophies);
    trophies.add('FIRST_WIN');
    if (guessCount <= 3) trophies.add('QUICK_STRIKE');
    if (guessCount === 1) trophies.add('HOLE_IN_ONE');
    if (guessCount === 8) trophies.add('HAIL_MARY_CLUTCH');
    if (stats.currentStreak >= 5) trophies.add('HOT_STREAK_5');
    if (stats.currentStreak >= 10) trophies.add('LEGEND_STREAK_10');
    stats.unlockedTrophies = Array.from(trophies);
  } else {
    stats.currentStreak = 0;
  }

  saveStoredStats(league, stats);
  return stats;
}

export function generateShareText(
  league: LeagueType,
  guesses: PlayerGuessResult[],
  isWin: boolean,
  isDaily: boolean,
  maxGuesses: number = 8
): string {
  const icon = league === 'NFL' ? '🏈' : '⚾';
  const header = `${icon} ${league} Wordle ${isDaily ? 'Daily' : 'Free Play'} - ${isWin ? guesses.length : 'X'}/${maxGuesses}`;

  const rows = guesses.map(g => {
    // 5 icons: Team, Conf/League, Division, Position, Jersey
    const teamEmoji = g.teamMatch === 'exact' ? '🟩' : g.teamMatch === 'same-div' ? '🟨' : g.teamMatch === 'same-conf' ? '🟧' : '⬛';
    const confEmoji = g.confMatch ? '🟩' : '⬛';
    const divEmoji = g.divMatch ? '🟩' : '⬛';
    const posEmoji = g.posMatch === 'exact' ? '🟩' : g.posMatch === 'same-group' ? '🟨' : '⬛';
    const jerseyEmoji = g.jerseyMatch.status === 'exact' ? '🟩' : g.jerseyMatch.direction === 'higher' ? '⬆️' : '⬇️';

    return `${teamEmoji}${confEmoji}${divEmoji}${posEmoji}${jerseyEmoji}`;
  }).join('\n');

  return `${header}\n\n${rows}\n\nPlay at: ${window.location.origin}`;
}
