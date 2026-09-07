export type LeagueType = 'NFL' | 'MLB';
export type GameSubMode = 'player' | 'cipher'; // Player identity Wordle vs 5-Letter Franchise Cipher

export interface BasePlayer {
  id: string;
  name: string;
  team: string; // e.g. 'KC' or 'LAD'
  teamName: string; // e.g. 'Kansas City Chiefs'
  jersey: number;
  age: number;
  accoladesCount: number; // Pro Bowls or All-Stars
  rings?: number; // Super Bowls or World Series
}

export interface NFLPlayer extends BasePlayer {
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'OT' | 'DE' | 'DT' | 'LB' | 'CB' | 'S' | 'K';
  positionGroup: 'Offense' | 'Defense' | 'Special';
  college: string;
  draftYear?: number;
}

export interface MLBPlayer extends BasePlayer {
  league: 'AL' | 'NL';
  division: 'East' | 'Central' | 'West';
  position: 'SP' | 'RP' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'OF' | 'DH';
  positionGroup: 'Infield' | 'Outfield' | 'Pitcher' | 'Catcher' | 'DH';
  batsThrows: string; // e.g., 'R/R', 'L/R', 'L/L', 'S/R'
  debutYear?: number;
}

export type AnyPlayer = NFLPlayer | MLBPlayer;

export type MatchStatus = 'exact' | 'close' | 'different';
export type Direction = 'higher' | 'lower' | 'match';

export interface PlayerGuessResult {
  player: AnyPlayer;
  isWin: boolean;
  teamMatch: 'exact' | 'same-div' | 'same-conf' | 'none';
  confMatch: boolean;
  divMatch: boolean;
  posMatch: 'exact' | 'same-group' | 'none';
  jerseyMatch: {
    status: MatchStatus;
    direction: Direction;
    diff: number;
  };
  ageMatch: {
    status: MatchStatus;
    direction: Direction;
    diff: number;
  };
  accoladeMatch: {
    status: MatchStatus;
    direction: Direction;
    diff: number;
  };
}

export interface PowerUpState {
  audibleRevealed: boolean; // reveals college / bats-throws
  challengeUsed: boolean; // verifies conference/division radar
  heatCheckUsed: boolean; // reveals jersey proximity gauge (within 5? within 10?)
  hailMaryUsed: boolean; // bonus 4th down/extra inning lifeline
}

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: { [key: number]: number };
  lastPlayedDate?: string;
  unlockedTrophies: string[];
}

export interface CipherLetterResult {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'empty';
}
