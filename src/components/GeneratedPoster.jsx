// Generates a unique, beautiful SVG poster for each entry — no external API needed.

const UNIVERSE_GRADIENTS = {
  MCU: [
    ['#1a0000', '#3d0000', '#E62429'],
    ['#0a0010', '#1a0030', '#E62429'],
    ['#000a1a', '#001a3d', '#c41e21'],
    ['#0d0000', '#2a0a0a', '#B11313'],
  ],
  'Fox X-Men': [
    ['#0a0800', '#1a1400', '#F59E0B'],
    ['#100500', '#221000', '#D97706'],
    ['#080a00', '#121800', '#EAB308'],
  ],
  'Netflix Marvel': [
    ['#1a0000', '#2a0000', '#E50914'],
    ['#0d0000', '#200000', '#DC2626'],
  ],
  'Sony Spider-Man': [
    ['#00060a', '#001833', '#1d4ed8'],
    ['#000a14', '#001020', '#1e3a8a'],
    ['#050010', '#0a0030', '#3730a3'],
  ],
  'Spider-Verse': [
    ['#0a0014', '#1a0030', '#7C3AED'],
    ['#050020', '#120040', '#6D28D9'],
    ['#0a0010', '#200030', '#A855F7'],
  ],
}

const PHASE_ACCENT = {
  'Pre-MCU': '#F59E0B', 'Phase 1': '#3B82F6', 'Phase 2': '#8B5CF6',
  'Phase 3': '#E62429',  'Phase 4': '#10B981', 'Phase 5': '#F59E0B',
  'Phase 6': '#FFD700',  'Netflix': '#E50914',
}

// deterministic "random" seeded by title string
function seeded(str, offset = 0) {
  let h = offset
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return ((h >>> 0) / 0xFFFFFFFF)
}

function hashIndex(str, len, offset = 0) {
  return Math.floor(seeded(str, offset) * len)
}

function wrapText(text, maxChars) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim()
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3) // max 3 lines
}

export default function GeneratedPoster({ entry, watched, className = '' }) {
  const { title, year, universe, phase, type } = entry

  const gradients  = UNIVERSE_GRADIENTS[universe] || UNIVERSE_GRADIENTS.MCU
  const gradIdx    = hashIndex(title, gradients.length)
  const [c1, c2, c3] = gradients[gradIdx]
  const accent     = PHASE_ACCENT[phase] || '#E62429'

  // Geometric pattern seed values
  const s1 = seeded(title, 1)
  const s2 = seeded(title, 2)
  const s3 = seeded(title, 3)
  const s4 = seeded(title, 4)
  const s5 = seeded(title, 5)

  const lines      = wrapText(title, 14)
  const fontSize   = lines.length === 1 ? 18 : lines.length === 2 ? 16 : 14
  const lineH      = fontSize * 1.3
  const textY      = 130 - (lines.length * lineH) / 2

  const gradId = `g-${entry.id}`
  const clipId = `c-${entry.id}`

  return (
    <svg
      viewBox="0 0 160 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={c1} />
          <stop offset="50%"  stopColor={c2} />
          <stop offset="100%" stopColor={c3} stopOpacity="0.4" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="160" height="240" rx="0" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Base gradient */}
        <rect width="160" height="240" fill={`url(#${gradId})`} />

        {/* Geometric background elements */}
        <circle
          cx={20 + s1 * 120} cy={20 + s2 * 80}
          r={40 + s3 * 60}
          fill={accent} fillOpacity="0.06"
        />
        <circle
          cx={s4 * 160} cy={160 + s5 * 80}
          r={50 + s1 * 50}
          fill={accent} fillOpacity="0.05"
        />

        {/* Diagonal lines pattern */}
        {[0,1,2,3,4,5,6].map(i => (
          <line
            key={i}
            x1={-20 + i * 35 + s2 * 20} y1="0"
            x2={-60 + i * 35 + s2 * 20} y2="240"
            stroke={accent} strokeOpacity="0.04" strokeWidth="18"
          />
        ))}

        {/* Top accent bar */}
        <rect x="0" y="0" width="160" height="3" fill={accent} fillOpacity="0.8" />

        {/* Universe monogram - large faint letter */}
        <text
          x="80" y="100"
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Arial Black, Impact, sans-serif"
          fontSize="110"
          fontWeight="900"
          fill={accent}
          fillOpacity="0.05"
        >
          {universe === 'MCU' ? 'M' : universe === 'Fox X-Men' ? 'X' : universe === 'Sony Spider-Man' ? 'S' : universe === 'Spider-Verse' ? '∞' : 'N'}
        </text>

        {/* MARVEL badge at top */}
        <rect x="8" y="10" width="48" height="16" rx="2" fill="#E62429" />
        <text
          x="32" y="22"
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Arial Black, Impact, sans-serif"
          fontSize="9" fontWeight="900" fill="white" letterSpacing="0.5"
        >
          MARVEL
        </text>

        {/* Phase pill */}
        <rect
          x="160" y="10" width={phase.length * 6 + 10} height="15"
          rx="7"
          fill={accent} fillOpacity="0.9"
          transform={`translate(-${phase.length * 6 + 18}, 0)`}
        />
        <text
          x={152} y={20}
          textAnchor="end" dominantBaseline="middle"
          fontFamily="Arial, sans-serif"
          fontSize="7" fontWeight="700" fill="white" fillOpacity="0.95"
        >
          {phase}
        </text>

        {/* Center glow */}
        <ellipse cx="80" cy="130" rx="55" ry="40" fill={accent} fillOpacity="0.07" />

        {/* Title text */}
        {lines.map((line, i) => (
          <text
            key={i}
            x="80"
            y={textY + i * lineH}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Arial Black, Impact, sans-serif"
            fontSize={fontSize}
            fontWeight="900"
            fill="white"
            fillOpacity={watched ? 1 : 0.9}
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))' }}
          >
            {line}
          </text>
        ))}

        {/* Bottom section */}
        <rect x="0" y="210" width="160" height="30" fill="rgba(0,0,0,0.5)" />

        {/* Type badge */}
        <rect x="8" y="216" width={type.length * 6 + 8} height="14" rx="3" fill={accent} fillOpacity="0.3" />
        <text
          x={12} y={225}
          dominantBaseline="middle"
          fontFamily="Arial, sans-serif"
          fontSize="7" fontWeight="700"
          fill={accent}
        >
          {type.toUpperCase()}
        </text>

        {/* Year */}
        <text
          x="152" y="225"
          textAnchor="end" dominantBaseline="middle"
          fontFamily="Arial, sans-serif"
          fontSize="9" fontWeight="700"
          fill="white" fillOpacity="0.5"
        >
          {year}
        </text>

        {/* Watched overlay */}
        {watched && (
          <>
            <rect x="0" y="0" width="160" height="240" fill="#E62429" fillOpacity="0.04" />
            {/* Checkmark circle */}
            <circle cx="138" cy="32" r="12" fill="#E62429" />
            <path
              d="M133 32 L137 36 L143 28"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
            />
          </>
        )}
      </g>
    </svg>
  )
}
