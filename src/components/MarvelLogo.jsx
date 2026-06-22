export default function MarvelLogo({ size = 'md' }) {
  const dims = size === 'lg' ? { w: 120, h: 40, fs: 22 } : { w: 80, h: 27, fs: 15 }
  return (
    <svg
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Marvel"
    >
      <rect width={dims.w} height={dims.h} rx="3" fill="#E62429" />
      <text
        x={dims.w / 2}
        y={dims.h * 0.75}
        textAnchor="middle"
        fontFamily="'Arial Black', 'Impact', sans-serif"
        fontSize={dims.fs}
        fontWeight="900"
        fill="#FFFFFF"
        letterSpacing="1"
      >
        MARVEL
      </text>
    </svg>
  )
}
