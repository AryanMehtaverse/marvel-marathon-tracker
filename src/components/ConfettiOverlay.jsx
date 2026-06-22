import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function ConfettiOverlay({ show, onClose }) {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [run, setRun] = useState(false)

  useEffect(() => {
    const handler = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    if (show) {
      setRun(true)
      const t = setTimeout(() => setRun(false), 8000)
      return () => clearTimeout(t)
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <>
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            recycle={run}
            numberOfPieces={300}
            colors={['#E62429', '#FFD700', '#FFFFFF', '#B11313', '#FFA500']}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="glass rounded-3xl p-10 text-center max-w-md mx-4 pointer-events-auto relative"
              style={{ boxShadow: '0 0 60px rgba(255,215,0,0.3), 0 0 120px rgba(230,36,41,0.2)' }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/40 hover:text-white/80"
              >
                <X size={20} />
              </button>
              <div className="text-6xl mb-4 no-select">🌅</div>
              <div className="text-3xl font-black text-gradient mb-2">Brand New Day!</div>
              <div className="text-white/60 text-sm">
                You've watched Spider-Man: Brand New Day.<br />
                The Marvel Marathon is complete!
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
