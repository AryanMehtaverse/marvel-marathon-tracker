import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Hero config ─────────────────────────────────────────────────────────────
const HERO_CONFIGS = {
  spider: {
    particles: ['🕷️', '🕸️', '🕷️'],
    color:  '#E63946',
    label:  'THWIP!',
    web:    true,
  },
  thor: {
    particles: ['🔨', '⚡', '🌩️', '🔨', '⚡', '🌩️'],
    color:  '#1A56DB',
    label:  'BY ODIN\'S BEARD!',
  },
  ironman: {
    particles: ['🔴', '⚡', '💛', '🔴', '⚡'],
    color:  '#E62429',
    label:  'I AM IRON MAN',
    ring:   true,
  },
  cap: {
    particles: ['🛡️', '⭐', '🛡️', '⭐', '🔵'],
    color:  '#1D4ED8',
    label:  'I CAN DO THIS ALL DAY.',
  },
  hulk: {
    particles: ['💚', '💥', '👊', '💚', '💥'],
    color:  '#16A34A',
    label:  'HULK SMASH!',
  },
  deadpool: {
    particles: ['🗡️', '💥', '❤️', '🌮', '💥', '🗡️'],
    color:  '#DC2626',
    label:  'MAXIMUM EFFORT!',
  },
  panther: {
    particles: ['💜', '⚫', '🐾', '💜', '⚫'],
    color:  '#7C3AED',
    label:  'WAKANDA FOREVER!',
  },
  groot: {
    particles: ['🌱', '🍃', '🌿', '🌱', '🍃', '⭐'],
    color:  '#65A30D',
    label:  'I AM GROOT!',
  },
  strange: {
    particles: ['✨', '🌀', '💫', '✨', '🌀', '⭕'],
    color:  '#F59E0B',
    label:  'BY THE VISHANTI!',
  },
  xmen: {
    particles: ['💛', '⚡', '🔱', '💛', '⚡'],
    color:  '#F59E0B',
    label:  'MUTANT AND PROUD!',
  },
  wolverine: {
    particles: ['💛', '🔱', '⚡', '💛', '🔱'],
    color:  '#F59E0B',
    label:  'THE BEST THERE IS.',
    claws:  true,
  },
  antman: {
    particles: ['🐜', '🐜', '🔬', '🐜', '⚡'],
    color:  '#DC2626',
    label:  'GOING SUBATOMIC!',
  },
  loki: {
    particles: ['💚', '🗡️', '👑', '✨', '💚'],
    color:  '#16A34A',
    label:  'GLORIOUS PURPOSE!',
  },
  widow: {
    particles: ['🕸️', '🔴', '⌛', '🕸️', '🔴'],
    color:  '#DC2626',
    label:  'WHATEVER IT TAKES.',
  },
  daredevil: {
    particles: ['🔴', '🎯', '⚖️', '🔴', '🎯'],
    color:  '#DC2626',
    label:  "HELL'S KITCHEN NEVER SLEEPS.",
  },
  avengers: {
    particles: ['⭐', '💥', '🌟', '✨', '💥'],
    color:  '#E62429',
    label:  'AVENGERS ASSEMBLE!',
  },
  guardians: {
    particles: ['🌟', '🎵', '🌱', '⭐', '🎶'],
    color:  '#8B5CF6',
    label:  'WE ARE THE GUARDIANS!',
  },
  wanda: {
    particles: ['🔴', '✨', '💫', '🔴', '✨'],
    color:  '#DC2626',
    label:  'CHAOS MAGIC!',
  },
  hawkeye: {
    particles: ['🏹', '🎯', '🏹', '🎯', '⭐'],
    color:  '#7C3AED',
    label:  "NEVER MISS.",
  },
  marvel: {
    particles: ['⭐', '✨', '💫', '🌟', '⭐'],
    color:  '#E62429',
    label:  'EXCELSIOR!',
  },
}

// ── Determine which hero effect to show based on entry ──────────────────────
export function getHeroEffect(entry) {
  if (!entry) return 'marvel'
  const t = (entry.title + ' ' + (entry.universe || '')).toLowerCase()

  if (t.includes('spider-man') || t.includes('spider man') || t.includes('spider-verse') || entry.universe === 'Sony Spider-Man' || entry.universe === 'Spider-Verse') return 'spider'
  if (t.includes('thor') || t.includes('love and thunder') || t.includes('dark world')) return 'thor'
  if (t.includes('iron man') || t.includes('iron-man')) return 'ironman'
  if (t.includes('captain america') || t.includes('brave new world') || t.includes('first avenger') || t.includes('winter soldier') || t.includes('civil war')) return 'cap'
  if (t.includes('hulk') || t.includes('incredible hulk')) return 'hulk'
  if (t.includes('deadpool')) return 'deadpool'
  if (t.includes('black panther') || t.includes('wakanda')) return 'panther'
  if (t.includes('guardians') || t.includes('groot')) return 'groot'
  if (t.includes('doctor strange') || t.includes('dr. strange') || t.includes('multiverse of madness')) return 'strange'
  if (t.includes('logan') || t.includes('wolverine') || t.includes('x-men origins')) return 'wolverine'
  if (t.includes('x-men') || t.includes('x men') || t.includes('apocalypse') || t.includes('dark phoenix') || t.includes('new mutants')) return 'xmen'
  if (t.includes('ant-man') || t.includes('ant man') || t.includes('quantumania')) return 'antman'
  if (t.includes('loki')) return 'loki'
  if (t.includes('black widow') || t.includes('natasha')) return 'widow'
  if (t.includes('daredevil') || t.includes('born again')) return 'daredevil'
  if (t.includes('wanda') || t.includes('scarlet') || t.includes('wandavision')) return 'wanda'
  if (t.includes('hawkeye') || t.includes('clint')) return 'hawkeye'
  if (t.includes('avengers')) return 'avengers'
  return 'marvel'
}

// ── Spider Web SVG ──────────────────────────────────────────────────────────
function SpiderWeb({ corner, delay }) {
  const NUM_LINES = 9
  const NUM_RINGS = 5
  const SPREAD    = 90   // degrees
  const MAX_LEN   = 420

  const [tl, tr, bl, br] = [
    corner === 'tl', corner === 'tr', corner === 'bl', corner === 'br',
  ]

  // Base angle: direction the web fans out from this corner
  const baseAngle = tl ? 0 : tr ? 90 : bl ? 270 : 180

  const angles = Array.from({ length: NUM_LINES }, (_, i) =>
    ((baseAngle + (SPREAD / (NUM_LINES - 1)) * i) * Math.PI) / 180
  )

  const originX = tr || br ? 0 : 0
  const originY = 0

  // Map angle to screen direction
  const getPoint = (angle, dist) => ({
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
  })

  const pos = {
    top:    tl || tr ? 0    : 'auto',
    bottom: bl || br ? 0    : 'auto',
    left:   tl || bl ? 0    : 'auto',
    right:  tr || br ? 0    : 'auto',
  }

  const flipX = tr || br
  const flipY = bl || br

  return (
    <svg
      className="absolute w-72 h-72 sm:w-96 sm:h-96 pointer-events-none"
      style={pos}
      viewBox="-400 -400 400 400"
      overflow="visible"
    >
      <g transform={`scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`}>
        {/* Radial lines */}
        {angles.map((angle, i) => {
          const p = getPoint(angle, MAX_LEN)
          return (
            <motion.line
              key={`l${i}`}
              x1="0" y1="0" x2={p.x} y2={p.y}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.55, delay: delay + i * 0.04, ease: 'easeOut' }}
            />
          )
        })}

        {/* Concentric arc segments connecting radial lines */}
        {Array.from({ length: NUM_RINGS }, (_, ri) => {
          const r = ((ri + 1) / NUM_RINGS) * MAX_LEN * 0.85
          const pts = angles.map(a => getPoint(a, r))
          const d = pts.reduce(
            (acc, pt, i) => acc + (i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`),
            ''
          )
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
      </g>
    </svg>
  )
}

// ── Claw Slash ──────────────────────────────────────────────────────────────
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

// ── Arc Reactor Ring ────────────────────────────────────────────────────────
function ArcRing({ delay }) {
  const rings = [80, 130, 180, 230]
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {rings.map((r, i) => (
        <motion.circle
          key={r}
          cx="50%" cy="50%" r={r}
          fill="none"
          stroke="#E62429"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: [0, 1.5], opacity: [0.8, 0] }}
          transition={{ duration: 0.8, delay: delay + i * 0.12, ease: 'easeOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />
      ))}
    </svg>
  )
}

// ── Floating Particle ────────────────────────────────────────────────────────
function Particle({ emoji, index, total }) {
  const startX = Math.random() * 90 + 5
  const targetX = startX + (Math.random() - 0.5) * 25
  const delay = Math.random() * 0.4
  const size = 28 + Math.floor(Math.random() * 20)
  const spin = (Math.random() - 0.5) * 720

  return (
    <motion.div
      className="absolute select-none pointer-events-none"
      style={{ left: `${startX}%`, top: '-5%', fontSize: size }}
      initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: ['0vh', '110vh'],
        x: [`0px`, `${(Math.random() - 0.5) * 120}px`],
        opacity: [0, 1, 1, 0],
        rotate: spin,
      }}
      transition={{
        duration: 1.6 + Math.random() * 0.8,
        delay,
        ease: 'easeIn',
        times: [0, 0.1, 0.75, 1],
      }}
    >
      {emoji}
    </motion.div>
  )
}

// ── Label Flash ──────────────────────────────────────────────────────────────
function HeroLabel({ label, color }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.15, 1, 0.9] }}
      transition={{ duration: 1.6, times: [0, 0.15, 0.6, 1], ease: 'easeOut' }}
    >
      <span
        className="text-4xl sm:text-5xl font-black tracking-widest text-center px-6 drop-shadow-2xl"
        style={{
          color: 'white',
          textShadow: `0 0 30px ${color}, 0 0 60px ${color}80, 2px 2px 0 rgba(0,0,0,0.8)`,
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
  const isSpider = config.web
  const isWolverine = config.claws
  const isIronMan = config.ring

  // Build particle list: use 20-ish particles
  const particleCount = 22
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    emoji: config.particles[i % config.particles.length],
    key: i,
  }))

  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Coloured vignette flash */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, ${config.color}22 0%, transparent 70%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8 }}
      />

      {/* Spider webs from all four corners */}
      {isSpider && (
        <>
          <SpiderWeb corner="tl" delay={0}    />
          <SpiderWeb corner="tr" delay={0.08} />
          <SpiderWeb corner="bl" delay={0.12} />
          <SpiderWeb corner="br" delay={0.18} />
        </>
      )}

      {/* Wolverine claw slashes */}
      {isWolverine && <ClawSlash delay={0.1} />}

      {/* Iron Man arc rings */}
      {isIronMan && <ArcRing delay={0.05} />}

      {/* Emoji particles falling */}
      {particles.map(p => (
        <Particle key={p.key} emoji={p.emoji} index={p.key} total={particleCount} />
      ))}

      {/* Hero label */}
      <HeroLabel label={config.label} color={config.color} />
    </div>
  )
}
