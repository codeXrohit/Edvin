import { motion, useTransform } from 'motion/react';
export default function Chapter({ progress, input, opacity, y, children }) {
  const o = useTransform(progress, input, opacity);
  const ty = useTransform(progress, input, y);
  const pe = useTransform(o, (v) => (v > 0.6 ? 'auto' : 'none'));
  return (
    <motion.div
      className="absolute inset-x-0 top-0 px-6 pt-28 sm:px-10 sm:pt-36 lg:px-20 lg:pt-40"
      style={{ opacity: o, y: ty, pointerEvents: pe }}
    >
      <div className="max-w-xl">{children}</div>
    </motion.div>
  );
}
