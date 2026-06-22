// Prerequisite dependency map — keyed by entry ID
// required:    must watch to understand the story
// recommended: greatly enhances understanding / callbacks
// optional:    fun context but fully skippable
//
// All spoiler-free — explanations only say WHY without revealing plot.

export const DEPENDENCIES = {
  // ── Pre-MCU: Fox X-Men ────────────────────────────────────────────────────
  1:  { required: [], recommended: [], optional: [] }, // X-Men
  2:  { required: [1], recommended: [], optional: [] }, // X2
  3:  { required: [1, 2], recommended: [], optional: [] }, // Last Stand
  6:  { required: [1], recommended: [2, 3], optional: [] }, // Origins: Wolverine
  9:  { required: [], recommended: [], optional: [1, 2, 3] }, // First Class
  16: { required: [9], recommended: [1, 2, 3, 6], optional: [] }, // Days of Future Past
  13: { required: [1, 2, 3, 6], recommended: [9, 16], optional: [] }, // The Wolverine
  25: { required: [9, 16], recommended: [1, 2, 3], optional: [] }, // Apocalypse
  22: { required: [], recommended: [], optional: [] }, // Deadpool
  38: { required: [22], recommended: [], optional: [] }, // Deadpool 2
  45: { required: [9, 16, 25], recommended: [1, 2, 3], optional: [13] }, // Dark Phoenix
  28: { required: [1, 2, 3, 6, 13, 16], recommended: [9, 25], optional: [] }, // Logan
  48: { required: [9, 16, 25], recommended: [], optional: [1, 2, 3] }, // New Mutants

  // ── Pre-MCU: Sony Spider-Man (Tobey Maguire) ──────────────────────────────
  85: { required: [], recommended: [], optional: [] }, // Spider-Man
  86: { required: [85], recommended: [], optional: [] }, // Spider-Man 2
  87: { required: [85, 86], recommended: [], optional: [] }, // Spider-Man 3

  // ── Pre-MCU: Sony Spider-Man (Andrew Garfield) ────────────────────────────
  88: { required: [], recommended: [], optional: [] }, // Amazing Spider-Man
  89: { required: [88], recommended: [], optional: [] }, // Amazing Spider-Man 2

  // ── Spider-Verse ──────────────────────────────────────────────────────────
  90: { required: [], recommended: [], optional: [] }, // Into the Spider-Verse
  91: { required: [90], recommended: [], optional: [] }, // Across the Spider-Verse
  92: { required: [90, 91], recommended: [], optional: [] }, // Beyond the Spider-Verse

  // ── MCU Phase 1 ───────────────────────────────────────────────────────────
  4:  { required: [], recommended: [], optional: [] }, // Iron Man
  5:  { required: [], recommended: [4], optional: [] }, // Incredible Hulk
  7:  { required: [4], recommended: [5], optional: [] }, // Iron Man 2
  8:  { required: [], recommended: [4, 7], optional: [] }, // Thor
  10: { required: [], recommended: [4, 7, 8], optional: [] }, // Cap: TFA
  11: { required: [4, 5, 7, 8, 10], recommended: [], optional: [] }, // The Avengers

  // ── MCU Phase 2 ───────────────────────────────────────────────────────────
  12: { required: [4, 7, 11], recommended: [8, 10], optional: [5] }, // Iron Man 3
  14: { required: [8, 11], recommended: [10], optional: [] }, // Thor: Dark World
  15: { required: [10, 11], recommended: [4, 7], optional: [8] }, // Winter Soldier
  17: { required: [], recommended: [11], optional: [4, 8, 10] }, // Guardians
  19: { required: [11, 12, 14, 15, 17], recommended: [4, 7, 8, 10], optional: [5] }, // Age of Ultron
  20: { required: [], recommended: [15, 19], optional: [11] }, // Ant-Man

  // ── MCU Phase 3 ───────────────────────────────────────────────────────────
  24: { required: [10, 15, 19], recommended: [4, 7, 11, 12, 20], optional: [8, 14, 17] }, // Civil War
  27: { required: [], recommended: [11, 19], optional: [4, 8, 10, 24] }, // Doctor Strange
  30: { required: [17], recommended: [11, 19], optional: [] }, // GotG Vol. 2
  31: { required: [24], recommended: [4, 7, 11, 12], optional: [15, 19] }, // Homecoming
  33: { required: [8, 14], recommended: [11, 17, 19, 30], optional: [24] }, // Ragnarok
  35: { required: [24], recommended: [11, 19], optional: [15] }, // Black Panther
  37: { required: [24, 27, 30, 31, 33, 35], recommended: [4, 7, 8, 10, 11, 12, 14, 15, 17, 19, 20], optional: [5] }, // Infinity War
  40: { required: [20, 24], recommended: [37], optional: [15, 19] }, // Ant-Man & Wasp
  44: { required: [37, 40], recommended: [4, 7, 8, 10, 11, 12, 14, 15, 17, 19, 20, 24, 27, 30, 31, 33, 35], optional: [5] }, // Endgame
  47: { required: [31, 37, 44], recommended: [24, 33, 35], optional: [11, 19] }, // Far From Home
  57: { required: [31, 47], recommended: [37, 44, 85, 86, 87, 88, 89], optional: [24, 27, 19] }, // No Way Home

  // ── Netflix Marvel ────────────────────────────────────────────────────────
  18: { required: [], recommended: [], optional: [11] }, // Daredevil S1
  21: { required: [], recommended: [18], optional: [11] }, // Jessica Jones S1
  23: { required: [18], recommended: [21], optional: [] }, // Daredevil S2
  26: { required: [], recommended: [18, 21, 23], optional: [] }, // Luke Cage S1
  29: { required: [], recommended: [18, 23], optional: [21, 26] }, // Iron Fist S1
  32: { required: [18, 21, 23, 26, 29], recommended: [], optional: [] }, // The Defenders
  34: { required: [23], recommended: [32], optional: [18, 21] }, // Punisher S1
  36: { required: [21, 32], recommended: [18, 23], optional: [26, 29] }, // Jessica Jones S2
  39: { required: [26, 32], recommended: [18, 23], optional: [21] }, // Luke Cage S2
  41: { required: [29, 32], recommended: [18, 23], optional: [] }, // Iron Fist S2
  42: { required: [18, 23, 32], recommended: [21, 26, 29], optional: [] }, // Daredevil S3
  43: { required: [34], recommended: [32, 42], optional: [18, 23] }, // Punisher S2
  46: { required: [21, 36], recommended: [18, 23, 32], optional: [26, 29] }, // Jessica Jones S3

  // ── MCU Phase 4 ───────────────────────────────────────────────────────────
  49: { required: [37, 44], recommended: [11, 19], optional: [24] }, // WandaVision
  50: { required: [24, 44], recommended: [15, 37], optional: [10, 19] }, // Falcon & Winter Soldier
  51: { required: [44], recommended: [8, 33, 37], optional: [14, 30] }, // Loki S1
  52: { required: [24], recommended: [44], optional: [11, 19, 37] }, // Black Widow
  53: { required: [], recommended: [44], optional: [4, 8, 10, 11, 17, 24, 27, 31, 37] }, // What If S1
  54: { required: [], recommended: [44], optional: [11] }, // Shang-Chi
  55: { required: [], recommended: [44], optional: [37] }, // Eternals
  56: { required: [44], recommended: [37, 31, 47], optional: [24] }, // Hawkeye
  58: { required: [], recommended: [44], optional: [11] }, // Moon Knight
  59: { required: [27, 49], recommended: [51, 57], optional: [37, 44, 53] }, // Doctor Strange MoM
  60: { required: [], recommended: [44], optional: [11] }, // Ms. Marvel
  61: { required: [8, 14, 33, 44], recommended: [17, 30], optional: [37] }, // Love and Thunder
  62: { required: [17, 30], recommended: [], optional: [68] }, // I Am Groot
  63: { required: [], recommended: [44, 5], optional: [18, 23, 57] }, // She-Hulk
  64: { required: [], recommended: [], optional: [58] }, // Werewolf by Night
  65: { required: [35, 44], recommended: [37], optional: [24] }, // Wakanda Forever
  66: { required: [17, 30], recommended: [], optional: [] }, // GotG Holiday Special

  // ── MCU Phase 5 ───────────────────────────────────────────────────────────
  67: { required: [20, 40, 44, 51], recommended: [37], optional: [50] }, // Ant-Man: Quantumania
  68: { required: [17, 30, 66], recommended: [61, 62], optional: [37, 44] }, // GotG Vol. 3
  69: { required: [], recommended: [44, 37], optional: [11, 19, 52] }, // Secret Invasion
  70: { required: [51, 44], recommended: [67], optional: [8, 33] }, // Loki S2
  71: { required: [49, 60], recommended: [56, 69], optional: [37, 44] }, // The Marvels
  93: { required: [53], recommended: [70, 51], optional: [] }, // What If S2
  72: { required: [56], recommended: [18, 23, 42], optional: [32, 57] }, // Echo
  73: { required: [22, 38], recommended: [44, 70, 28], optional: [51, 67] }, // Deadpool & Wolverine
  74: { required: [49, 59], recommended: [37, 44], optional: [53] }, // Agatha All Along
  75: { required: [53, 93], recommended: [70, 51], optional: [] }, // What If S3
  76: { required: [50, 5], recommended: [35, 65, 44], optional: [24, 10] }, // Cap: Brave New World
  77: { required: [18, 23, 42], recommended: [32, 56, 72], optional: [21, 26, 34] }, // Daredevil: Born Again S1
  78: { required: [50, 52], recommended: [67, 76], optional: [24, 44] }, // Thunderbolts*
  79: { required: [65], recommended: [44], optional: [37] }, // Ironheart
  80: { required: [], recommended: [59, 44], optional: [27, 37] }, // Fantastic Four: First Steps

  // ── MCU Phase 6 ───────────────────────────────────────────────────────────
  81: { required: [77], recommended: [18, 23, 42, 32], optional: [72, 43] }, // Daredevil: Born Again S2
  82: { required: [77, 81], recommended: [34, 43], optional: [18, 23] }, // Punisher: One Last Kill
  83: { required: [24, 31, 37, 44, 47, 57], recommended: [18, 23, 42, 77, 81], optional: [72, 63, 56] }, // Brand New Day
  84: { required: [44, 67, 70, 76, 78, 80, 83], recommended: [37, 49, 50, 51, 54, 55, 59, 65, 68, 71, 73, 74], optional: [52, 53, 56, 58, 60, 61, 63, 72, 75, 77, 79] }, // Avengers: Doomsday
}

// Spoiler-free reason WHY each entry is a prerequisite for various stories.
// Keyed as "from-to" e.g. "24-83" means "Civil War is required for Brand New Day"
export const DEP_REASONS = {
  // Brand New Day
  '24-83':  'Introduces our Spider-Man to the MCU alongside key hero relationships',
  '31-83':  'Establishes Peter Parker as Spider-Man in the MCU',
  '37-83':  'A pivotal moment for Peter personally that drives his arc',
  '44-83':  'Peter\'s world changes completely in the aftermath',
  '47-83':  'Direct continuation of Peter\'s story from this film',
  '57-83':  'Immediate direct prequel — Brand New Day begins where this ends',
  '18-83':  'Daredevil becomes a key figure in Peter\'s world',
  '23-83':  'Deepens Daredevil\'s role leading into their team-up',
  '42-83':  'Sets up the New York street-level hero connection',
  '77-83':  'Daredevil\'s new era directly ties into Brand New Day',
  '81-83':  'Ongoing storylines from Born Again feed into this film',
  '72-83':  'Echo\'s story intersects with the New York hero network',
  '63-83':  'She-Hulk introduces legal elements that resurface',
  '56-83':  'Hawkeye\'s events set up key characters in New York',
  // Endgame
  '37-44':  'Endgame is the direct continuation of Infinity War\'s cliffhanger',
  '40-44':  'Scott Lang\'s situation from this film becomes crucial in Endgame',
  // Infinity War
  '24-37':  'Alliances formed here determine who fights in Infinity War',
  '27-37':  'Doctor Strange and his role are essential to this film\'s climax',
  '30-37':  'The Guardians are central characters in Infinity War',
  '31-37':  'Spider-Man\'s MCU debut leads directly into Infinity War',
  '33-37':  'Thor\'s arc from Ragnarok continues immediately here',
  '35-37':  'Wakanda and its resources are at the heart of Infinity War',
  // No Way Home
  '85-57':  'Tobey Maguire\'s Spider-Man appears — his trilogy provides his full backstory',
  '86-57':  'Spider-Man 2 is the most important Tobey film to understand his arc',
  '88-57':  'Andrew Garfield\'s Spider-Man appears — his story matters here',
  '89-57':  'The Amazing Spider-Man 2\'s ending is directly relevant',
}
