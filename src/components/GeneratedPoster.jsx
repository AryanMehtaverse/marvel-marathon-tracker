const UNIVERSE_PALETTES = {
  MCU:              { bg1: '#0d0005', bg2: '#1a000a', bg3: '#2d0010', accent: '#E62429', letter: 'M' },
  'Fox X-Men':      { bg1: '#080600', bg2: '#141000', bg3: '#201800', accent: '#F59E0B', letter: 'X' },
  'Netflix Marvel': { bg1: '#0d0000', bg2: '#1a0000', bg3: '#250000', accent: '#E50914', letter: 'N' },
  'Sony Spider-Man':{ bg1: '#00060f', bg2: '#000e1f', bg3: '#001530', accent: '#3B82F6', letter: 'S' },
  'Spider-Verse':   { bg1: '#070010', bg2: '#0f0020', bg3: '#180035', accent: '#A855F7', letter: '∞' },
}

const PHASE_COLORS = {
  'Pre-MCU': '#F59E0B', 'Phase 1': '#3B82F6', 'Phase 2': '#8B5CF6',
  'Phase 3': '#E62429', 'Phase 4': '#10B981', 'Phase 5': '#F59E0B',
  'Phase 6': '#FFD700', 'Netflix': '#E50914',
}

function seeded(str, offset = 0) {
  let h = offset
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return (h >>> 0) / 0xFFFFFFFF
}

function wrapText(text, maxChars) {
  const words = text.split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= maxChars) { cur = (cur + ' ' + w).trim() }
    else { if (cur) lines.push(cur); cur = w }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 3)
}

export default function GeneratedPoster({ entry, watched, className = '' }) {
  const { title, year, universe, phase, type, id } = entry
  const pal    = UNIVERSE_PALETTES[universe] || UNIVERSE_PALETTES.MCU
  const accent = pal.accent
  const phaseC = PHASE_COLORS[phase] || accent

  const s1 = seeded(title, 1), s2 = seeded(title, 2)
  const s3 = seeded(title, 3), s4 = seeded(title, 4)

  const lines    = wrapText(title, 13)
  const fontSize = lines.length === 1 ? 17 : lines.length === 2 ? 14 : 12
  const lineH    = fontSize * 1.35
  // title block sits in lower-center of poster
  const textY    = 148 - (lines.length * lineH) / 2

  const gId  = `gp-${id}`
  const g2Id = `gp2-${id}`
  const cId  = `cp-${id}`

  return (
    <svg
      viewBox="0 0 160 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor={pal.bg1} />
          <stop offset="55%"  stopColor={pal.bg2} />
          <stop offset="100%" stopColor={pal.bg3} />
        </linearGradient>
        {/* Vignette — darkens edges so title pops */}
        <radialGradient id={g2Id} cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <clipPath id={cId}>
          <rect width="160" height="240" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${cId})`}>
        {/* Base */}
        <rect width="160" height="240" fill={`url(#${gId})`} />

        {/* Soft radial glow — unique per entry */}
        <ellipse
          cx={30 + s1 * 100} cy={30 + s2 * 80}
          rx={55 + s3 * 45} ry={45 + s4 * 35}
          fill={accent} fillOpacity="0.09"
        />
        <ellipse
          cx={160 - s2 * 100} cy={160 + s1 * 60}
          rx={50 + s4 * 40} ry={40 + s3 * 30}
          fill={phaseC} fillOpacity="0.06"
        />

        {/* Subtle diagonal stripe */}
        {[0,1,2,3,4,5].map(i => (
          <line
            key={i}
            x1={-30 + i * 40 + s1 * 15} y1="0"
            x2={-70 + i * 40 + s1 * 15} y2="240"
            stroke={accent} strokeOpacity="0.03" strokeWidth="22"
          />
        ))}

        {/* Vignette */}
        <rect width="160" height="240" fill={`url(#${g2Id})`} />

        {/* Big faint monogram */}
        <text
          x="80" y="95"
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Arial Black, Impact, sans-serif"
          fontSize="120" fontWeight="900"
          fill={accent} fillOpacity="0.055"
        >
          {pal.letter}
        </text>

        {/* Thin accent top bar */}
        <rect x="0" y="0" width="160" height="2.5" fill={accent} fillOpacity="0.9" />

        {/* ── Title block (no clashing badges) ── */}
        {/* Semi-transparent scrim behind title */}
        <rect
          x="0" y={textY - 10}
          width="160" height={lines.length * lineH + 22}
          fill="rgba(0,0,0,0.38)"
        />

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
            fillOpacity={watched ? 1 : 0.92}
          >
            {line}
          </text>
        ))}

        {/* ── Bottom bar — type · year ── */}
        <rect x="0" y="218" width="160" height="22" fill="rgba(0,0,0,0.6)" />

        {/* Universe color strip on left edge of bottom bar */}
        <rect x="0" y="218" width="3" height="22" fill={accent} />

        <text
          x="10" y="230"
          dominantBaseline="middle"
          fontFamily="Arial, sans-serif"
          fontSize="7.5" fontWeight="700"
          fill={accent} fillOpacity="0.85"
          letterSpacing="0.5"
        >
          {type.toUpperCase()}
        </text>

        <text
          x="152" y="230"
          textAnchor="end" dominantBaseline="middle"
          fontFamily="Arial, sans-serif"
          fontSize="8" fontWeight="600"
          fill="white" fillOpacity="0.4"
        >
          {year}
        </text>

        {/* Watched overlay */}
        {watched && (
          <>
            <rect width="160" height="240" fill="#22C55E" fillOpacity="0.04" />
            <circle cx="139" cy="29" r="11" fill="#22C55E" fillOpacity="0.95" />
            <path
              d="M134.5 29 L138 32.5 L143.5 25.5"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
            />
          </>
        )}
      </g>
    </svg>
  )
}
