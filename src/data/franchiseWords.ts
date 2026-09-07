export interface CipherWordItem {
  word: string;
  clue: string;
  category: 'Team' | 'Term' | 'Legend';
}

export const NFL_CIPHER_WORDS: CipherWordItem[] = [
  { word: 'CHIEF', clue: 'Super Bowl champion franchise in Kansas City', category: 'Team' },
  { word: 'EAGLE', clue: 'NFC East powerhouse with passionate Philly fans', category: 'Team' },
  { word: 'RAVEN', clue: 'Baltimore bird of prey with fierce defensive history', category: 'Team' },
  { word: 'COLTS', clue: 'Indianapolis franchise with horseshoe emblem', category: 'Team' },
  { word: 'GIANT', clue: 'New York franchise with multiple Lombardi trophies', category: 'Team' },
  { word: 'TITAN', clue: 'Nashville AFC South contender with sword logo', category: 'Team' },
  { word: 'LIONS', clue: 'Honolulu Blue pride in the Motor City', category: 'Team' },
  { word: 'NINER', clue: 'Gold Rush legacy franchise in the Bay Area', category: 'Team' },
  { word: 'BEARS', clue: 'Historic Monsters of the Midway in Chicago', category: 'Team' },
  { word: 'BLITZ', clue: 'Aggressive defensive charge bringing extra rushers', category: 'Term' },
  { word: 'FIELD', clue: 'The 100-yard battleground with end zones', category: 'Term' },
  { word: 'DRAFT', clue: 'Annual event where college prospects enter the league', category: 'Term' },
  { word: 'SUPER', clue: 'The ultimate Sunday showdown in February', category: 'Term' },
  { word: 'FIRST', clue: 'The essential opening down needed for chains to move', category: 'Term' },
  { word: 'TOUCH', clue: 'First half of a six-point scoring play', category: 'Term' },
  { word: 'YARDS', clue: 'Unit of progression towards the goal line', category: 'Term' },
  { word: 'SACKS', clue: 'Tackling the quarterback behind the line of scrimmage', category: 'Term' },
  { word: 'GUARD', clue: 'Offensive lineman flanking the center', category: 'Term' },
  { word: 'BRADY', clue: 'The 7-time Lombardi winning GOAT quarterback', category: 'Legend' },
  { word: 'ELWAY', clue: 'Hall of Fame Denver quarterback legendary #7', category: 'Legend' },
  { word: 'FAVRE', clue: 'Green Bay gunslinger #4 legendary ironman', category: 'Legend' },
  { word: 'BROWN', clue: 'Cleveland franchise name and legendary back Jim', category: 'Team' },
  { word: 'SPIKE', clue: 'Celebrating a touchdown by slamming ball down', category: 'Term' },
  { word: 'CLOCK', clue: 'Game manager keeping track of the final 2 minutes', category: 'Term' },
];

export const MLB_CIPHER_WORDS: CipherWordItem[] = [
  { word: 'ASTRO', clue: 'Houston powerhouse in the AL West', category: 'Team' },
  { word: 'BRAVE', clue: 'Atlanta franchise with tomahawk symbol', category: 'Team' },
  { word: 'PADRE', clue: 'San Diego NL West contenders with brown & gold', category: 'Team' },
  { word: 'TWINS', clue: 'Minnesota club named for Minneapolis-St. Paul', category: 'Team' },
  { word: 'YANKS', clue: 'Bronx Bombers with 27 World Series titles', category: 'Team' },
  { word: 'HOMER', clue: 'Four-bagger blast that clears the outfield fence', category: 'Term' },
  { word: 'PITCH', clue: 'Delivery hurled from the mound toward the plate', category: 'Term' },
  { word: 'CURVE', clue: 'Deceptive breaking ball with sharp downward drop', category: 'Term' },
  { word: 'GLOVE', clue: 'Leather fielding essential worn on the non-throwing hand', category: 'Term' },
  { word: 'BASES', clue: 'The diamond markers: first, second, and third', category: 'Term' },
  { word: 'SLIDE', clue: 'Diving feet-first or head-first to evade a tag', category: 'Term' },
  { word: 'CYCLE', clue: 'Hitting a single, double, triple, and homer in one game', category: 'Term' },
  { word: 'SAVER', clue: 'Bullpen specialist finishing off the final out for the win', category: 'Term' },
  { word: 'SHORT', clue: 'Key defensive infield position between 2nd & 3rd', category: 'Term' },
  { word: 'CLEAT', clue: 'Spiked footwear for grip on dirt and grass', category: 'Term' },
  { word: 'RUTHS', clue: 'The Bambino who transformed the longball', category: 'Legend' },
  { word: 'JETER', clue: 'The Captain #2 famous for the jump throw', category: 'Legend' },
  { word: 'BONDS', clue: 'All-time home run record holder with 762 blasts', category: 'Legend' },
  { word: 'GRIFF', clue: 'The Kid with the sweetest swing in Seattle & Cincy', category: 'Legend' },
  { word: 'FOULS', clue: 'Balls hit outside the first or third base line', category: 'Term' },
  { word: 'SCORE', clue: 'Crossing home plate safely to record a run', category: 'Term' },
];
