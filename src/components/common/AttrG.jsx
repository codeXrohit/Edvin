import { useRef } from 'react';
import { useMotionValueEvent } from 'motion/react';
/** <g> whose SVG transform attribute follows a MotionValue. Attribute
    transforms keep rotate/scale origins exact (CSS transforms on SVG don't). */
export default function AttrG({ transform, children, opacity }) {
  const ref = useRef(null);
  useMotionValueEvent(transform, 'change', (v) => ref.current?.setAttribute('transform', v));
  return (
    <g ref={ref} transform={transform.get()} opacity={opacity}>
      {children}
    </g>
  );
}
