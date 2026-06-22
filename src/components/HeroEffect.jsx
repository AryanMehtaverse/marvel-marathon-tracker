import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const HERO_CONFIGS = {
  spider: {
    particles: ['🕷️', '🕸️', '🕷️'],
    color: '#E63946',
    label: 'THWIP!',
    web: true,
  },
  thor: {
    particles: ['🔨', '⚡', '🌩️', '🔨', '⚡', '🌩️'],
    color: '#1A56DB',
    label: "BY ODIN'S BEARD!",
  },
  ironman: {
    particles: ['🔴', '⚡', '💛', '🔴', '⚡'],
    color: '#E62429',
    label: 'I AM IRON MAN',
    ring: true,
  },
  cap: {
    particles: ['🛡️', '⭐', '🛡️', '⭐', '🔵'],
    color: '#1D4ED8',
    label: 'I CAN DO THIS ALL DAY.',
  },
  hulk: {
    particles: ['💚', '💥', '👊', '💚', '💥'],
    color: '#16A34A',
    label: 'HULK SMASH!',
  },
  deadpool: {
    particles: ['🗡️', '💥', '❤️', '🌮', '💥', '🗡️'],
    color: '#DC2626',
    label: 'MAXIMUM EFFORT!',
  },
  panther: {
    particles: ['💜', '⚫', '🐾', '💜', '⚫'],
    color: '#7C3AED',
    label: 'WAKANDA FOREVER!',
  },
  groot: {
    particles: ['🌿', '🍃', '🌱', '⭐', '🌿'],
    color: '#65A30D',
    label: 'I AM GROOT!',
  },
  guardians: {
    particles: ['🌟', '🎵', '⭐', '🎶', '🌌'],
    color: '#8B5CF6',
    label: 'WE ARE THE GUARDIANS!',
  },
  strange: {
    particles: ['✨', '🌀', '💫', '✨', '🌀', '⭕'],
    color: '#F59E0B',
    label: 'BY THE VISHANTI!',
  },
  xmen: {
    particles: ['💛', '⚡', '🔱', '💛', '⚡'],
    color: '#F59E0B',
    label: 'MUTANT AND PROUD!',
  },
  wolverine: {
    particles: ['💛', '🔱', '⚡', '💛', '🔱'],
    color: '#F59E0B',
    label: 'THE BEST THERE IS.',
    claws: true,
  },
  antman: {
    particles: ['🐜', '🐜', '🔬', '🐜', '⚡'],
    color: '#DC2626',
    label: 'GOING SUBATOMIC!',
  },
  loki: {
    particles: ['💚', '🗡️', '👑', '✨', '💚'],
    color: '#16A34A',
    label: 'GLORIOUS PURPOSE!',
  },
  widow: {
    particles: ['🕸️', '🔴', '⌛', '🕸️', '🔴'],
    color: '#DC2626',
    label: 'WHATEVER IT TAKES.',
  },
  daredevil: {
    particles: ['🔴', '🎯', '⚖️', '🔴', '🎯'],
    color: '#DC2626',
    label: "HELL'S KITCHEN NEVER SLEEPS.",
  },
  avengers: {
    particles: ['⭐', '💥', '🌟', '✨', '💥'],
    color: '#E62429',
    label: 'AVENGERS ASSEMBLE!',
  },
  wanda: {
    particles: ['🔴', '✨', '💫', '🔴', '✨'],
    color: '#DC2626',
    label: 'CHAOS MAGIC!',
  },
  hawkeye: {
    particles: ['🏹', '🎯', '🏹', '🎯', '⭐'],
    color: '#7C3AED',
    label: 'NEVER MISS.',
  },
  marvel: {
    particles: ['⭐', '✨', '💫', '🌟', '⭐'],
    color: '#E62429',
    label: 'EXCELSIOR!',
  },
}

export function getHeroEffect(entry) {
  if (!entry) return 'marvel'
  const t = (entry.title + ' ' + (entry.universe || '')).toLowerCase()

  if (t.includes('spider-man') || t.includes('spider man') || t.includes('spider-verse') ||
      entry.universe === 'Sony Spider-Man' || entry.universe === 'Spider-Verse') return 'spider'
  if (t.includes('thor') || t.includes('love and thunder') || t.includes('dark world')) return 'thor'
  if (t.includes('iron man') || t.includes('iron-man')) return 'ironman'
  if (t.includes('captain america') || t.includes('brave new world') || t.includes('first avenger') ||
      t.includes('winter soldier') || t.includes('civil war')) return 'cap'
  if (t.includes('hulk') || t.includes('incredible hulk')) return 'hulk'
  if (t.includes('deadpool')) return 'deadpool'
  if (t.includes('black panther') || t.includes('wakanda')) return 'panther'
  if (t.includes('guardians') || t.includes('holiday special')) return 'guardians'
  if (t.includes('groot')) return 'groot'
  if (t.includes('doctor strange') || t.includes('multiverse of madness')) return 'strange'
  if (t.includes('logan') || t.includes('wolverine') || t.includes('x-men origins')) return 'wolverine'
  if (t.includes('x-men') || t.includes('x men') || t.includes('apocalypse') ||
      t.includes('dark phoenix') || t.includes('new mutants') || t.includes('x2') || t.includes('first class')) return 'xmen'
  if (t.includes('ant-man') || t.includes('ant man') || t.includes('quantumania')) return 'antman'
  if (t.includes('loki')) return 'loki'
  if (t.includes('black widow') || t.includes('natasha')) return 'widow'
  if (t.includes('daredevil') || t.includes('born again')) return 'daredevil'
  if (t.includes('wanda') || t.includes('scarlet') || t.includes('wandavision')) return 'wanda'
  if (t.includes('hawkeye') || t.includes('clint')) return 'hawkeye'
  if (t.includes('avengers')) return 'avengers'
  return 'marvel'
}

// ── Spider Web ───────────────────────────────────────────────────────────────
// Web always drawn from (0,0) going right+down in SVG space.
// CSS transform on the wrapper div flips it to the correct screen corner.
function SpiderWeb({ corner, delay }) {
  const NUM_LINES = 9
  const NUM_RINGS = 5
  const MAX_LEN   = 380

  const angles = Array.from({ length: NUM_LINES }, (_, i) =>
    (i / (NUM_LINES - 1)) * (Math.PI / 2)   // 0° → 90°
  )

  const cssTransform = {
    tl: 'none',
    tr: 'scaleX(-1)',
    bl: 'scaleY(-1)',
    br: 'scale(-1,-1)',
  }[corner]

  const transformOrigin = {
    tl: '0 0',
    tr: '100% 0',
    bl: '0 100%',
    br: '100% 100%',
  }[corner]

  const pos = {
    top:    corner.startsWith('t') ? 0 : 'auto',
    bottom: corner.startsWith('b') ? 0 : 'auto',
    left:   corner.endsWith('l')   ? 0 : 'auto',
    right:  corner.endsWith('r')   ? 0 : 'auto',
  }

  return (
    <div
      className="absolute w-64 h-64 sm:w-80 sm:h-80 pointer-events-none"
      style={{ ...pos, transform: cssTransform, transformOrigin }}
    >
      <svg viewBox="0 0 380 380" className="w-full h-full" overflow="visible">
        {/* Radial lines from origin */}
        {angles.map((angle, i) => (
          <motion.line
            key={`l${i}`}
            x1="0" y1="0"
            x2={Math.cos(angle) * MAX_LEN}
            y2={Math.sin(angle) * MAX_LEN}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.55, delay: delay + i * 0.04, ease: 'easeOut' }}
          />
        ))}

        {/* Concentric ring segments */}
        {Array.from({ length: NUM_RINGS }, (_, ri) => {
          const r   = ((ri + 1) / NUM_RINGS) * MAX_LEN * 0.85
          const pts = angles.map(a => ({ x: Math.cos(a) * r, y: Math.sin(a) * r }))
          const d   = pts.reduce((acc, pt, i) =>
            acc + (i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`), '')
          return (
            <motion.path
              key={`r${ri}`}
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.6, delay: delay + 0.35 + ri * 0.07, ease: 'easeOut' }}
            />
          )
        })}
      </svg>
    </div>
  )
}

// ── Wolverine Claw Slash ─────────────────────────────────────────────────────
function ClawSlash({ delay }) {
  const slashes = [
    { x1: '35%', y1: '20%', x2: '55%', y2: '85%' },
    { x1: '45%', y1: '20%', x2: '65%', y2: '85%' },
    { x1: '55%', y1: '20%', x2: '75%', y2: '85%' },
  ]
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {slashes.map((s, i) => (
        <motion.line
          key={i}
          x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="#F59E0B"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.4, delay: delay + i * 0.05, times: [0, 0.1, 0.6, 1] }}
        />
      ))}
    </svg>
  )
}

// ── Iron Man Arc Rings ───────────────────────────────────────────────────────
function ArcRing({ delay }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {[80, 140, 200, 260].map((r, i) => (
        <motion.circle
          key={r}
          cx="50%" cy="50%" r={r}
          fill="none"
          stroke="#E62429"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: [0, 1.4], opacity: [0.8, 0] }}
          transition={{ duration: 0.9, delay: delay + i * 0.12, ease: 'easeOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />
      ))}
    </svg>
  )
}

// ── Falling Particle ─────────────────────────────────────────────────────────
function Particle({ emoji }) {
  const startX = Math.random() * 88 + 4
  const size   = 26 + Math.floor(Math.random() * 22)
  const delay  = Math.random() * 0.45
  const spin   = (Math.random() - 0.5) * 720
  const drift  = (Math.random() - 0.5) * 130

  return (
    <motion.div
      className="absolute select-none pointer-events-none"
      style={{ left: `${startX}%`, top: '-6%', fontSize: size }}
      initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: ['0vh', '112vh'],
        x: [0, drift],
        opacity: [0, 1, 1, 0],
        rotate: spin,
      }}
      transition={{
        duration: 1.5 + Math.random() * 0.9,
        delay,
        ease: 'easeIn',
        times: [0, 0.08, 0.75, 1],
      }}
    >
      {emoji}
    </motion.div>
  )
}

// ── Hero Label ───────────────────────────────────────────────────────────────
function HeroLabel({ label, color }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.1, 1, 0.95] }}
      transition={{ duration: 1.7, times: [0, 0.12, 0.6, 1], ease: 'easeOut' }}
    >
      <span
        className="text-3xl sm:text-5xl font-black tracking-widest text-center px-6 drop-shadow-2xl"
        style={{
          color: 'white',
          textShadow: `0 0 30px ${color}, 0 0 60px ${color}80, 2px 2px 0 rgba(0,0,0,0.9)`,
          fontFamily: 'Arial Black, Impact, sans-serif',
        }}
      >
        {label}
      </span>
    </motion.div>
  )
}

// ── Main Export ──────────────────────────────────────────────────────────────
export default function HeroEffect({ effectType, onDone }) {
  const config = HERO_CONFIGS[effectType] || HERO_CONFIGS.marvel

  const particles = Array.from({ length: 22 }, (_, i) => ({
    emoji: config.particles[i % config.particles.length],
    key:   i,
  }))

  useEffect(() => {
    const t = setTimeout(onDone, 2700)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Vignette flash */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, ${config.color}25 0%, transparent 70%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.9 }}
      />

      {/* Spider webs from all four corners — now correct for tr/br */}
      {config.web && (
        <>
          <SpiderWeb corner="tl" delay={0}    />
          <SpiderWeb corner="tr" delay={0.08} />
          <SpiderWeb corner="bl" delay={0.12} />
          <SpiderWeb corner="br" delay={0.18} />
        </>
      )}

      {config.claws && <ClawSlash delay={0.1} />}
      {config.ring  && <ArcRing  delay={0.05} />}

      {particles.map(p => <Particle key={p.key} emoji={p.emoji} />)}

      <HeroLabel label={config.label} color={config.color} />
    </div>
  )
}
