import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
const NAVY = '#1D3045';
const TOYRED = '#E4572E';
const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, .cursor-hover';
const TRAIL = [
  { stiffness: 700, damping: 32, size: 7, opacity: 0.4 },
  { stiffness: 380, damping: 30, size: 6, opacity: 0.3 },
  { stiffness: 220, damping: 28, size: 5, opacity: 0.2 },
  { stiffness: 130, damping: 26, size: 4, opacity: 0.12 },
];
/* Fine-pointer-only custom cursor accent: a small solid dot that grows into
   a hollow ring over interactive elements. Move it fast and a little comet
   trail of fading, shrinking dots streams out behind it. Skipped on touch
   and for people who prefer reduced motion; the native pointer stays
   visible underneath it. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const finePointer = useMediaQuery('(pointer: fine) and (min-width: 768px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { damping: 24, stiffness: 240, mass: 0.5 });
  const dotY = useSpring(y, { damping: 24, stiffness: 240, mass: 0.5 });
  const t0x = useSpring(x, { stiffness: TRAIL[0].stiffness, damping: TRAIL[0].damping, mass: 0.6 });
  const t0y = useSpring(y, { stiffness: TRAIL[0].stiffness, damping: TRAIL[0].damping, mass: 0.6 });
  const t1x = useSpring(x, { stiffness: TRAIL[1].stiffness, damping: TRAIL[1].damping, mass: 0.6 });
  const t1y = useSpring(y, { stiffness: TRAIL[1].stiffness, damping: TRAIL[1].damping, mass: 0.6 });
  const t2x = useSpring(x, { stiffness: TRAIL[2].stiffness, damping: TRAIL[2].damping, mass: 0.6 });
  const t2y = useSpring(y, { stiffness: TRAIL[2].stiffness, damping: TRAIL[2].damping, mass: 0.6 });
  const t3x = useSpring(x, { stiffness: TRAIL[3].stiffness, damping: TRAIL[3].damping, mass: 0.6 });
  const t3y = useSpring(y, { stiffness: TRAIL[3].stiffness, damping: TRAIL[3].damping, mass: 0.6 });
  const trailSprings = [
    { x: t0x, y: t0y },
    { x: t1x, y: t1y },
    { x: t2x, y: t2y },
    { x: t3x, y: t3y },
  ];
  useEffect(() => {
    if (!finePointer || reducedMotion) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const el = e.target?.closest?.(HOVER_SELECTOR);
      setHovering(!!el);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y, finePointer, reducedMotion]);
  if (!enabled) return null;
  return (
    <>
      {trailSprings.map((s, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[9997] rounded-full"
          style={{
            x: s.x,
            y: s.y,
            translateX: '-50%',
            translateY: '-50%',
            width: TRAIL[i].size,
            height: TRAIL[i].size,
            background: TOYRED,
            opacity: TRAIL[i].opacity,
          }}
        />
      ))}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          borderStyle: 'solid',
          borderColor: NAVY,
        }}
        animate={{
          width: hovering ? 42 : 10,
          height: hovering ? 42 : 10,
          borderWidth: hovering ? 1.5 : 0,
          backgroundColor: hovering ? 'transparent' : NAVY,
          scale: down ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22, mass: 0.5 }}
      />
    </>
  );
}
