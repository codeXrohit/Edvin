import { motion } from 'motion/react';
import FAQAccordion from '@/components/home/FAQAccordion';
import RetailerForm from '@/components/home/RetailerForm';
function Eyebrow({ children, glow = false }) {
  return (
    <span className="inline-flex items-center gap-[10px] text-sm font-bold uppercase tracking-[0.08em] text-white/70">
      <span
        className={`h-[9px] w-[9px] rounded-full bg-toyred ${glow ? 'shadow-[0_0_18px_rgba(228,87,46,0.55)]' : ''}`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
export default function Retailers() {
  return (
    <section
      id="retailers"
      className="relative pb-0 pt-[76px] text-white md:pt-[100px]"
      style={{ backgroundColor: '#111111' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(228,87,46,0.16) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-[2] mx-auto max-w-7xl px-5 sm:px-8 lg:px-0">
        <div className="grid gap-[42px] lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            className="rounded-[22px] bg-black px-6 py-8 shadow-[0_26px_80px_rgba(0,0,0,0.35)] md:px-[34px] md:py-[42px] lg:sticky lg:top-28"
          >
            <Eyebrow glow>A little hello starts here</Eyebrow>
            <h3 className="mt-6 max-w-[420px] font-display text-[34px] font-extrabold leading-[1.2] md:text-[39px]">
              Sell Edvin toys in your store.
            </h3>
            <RetailerForm gridClassName="mt-6 grid gap-5" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 22, delay: 0.08 }}
            className="pt-1"
          >
            <Eyebrow>{'{06} FAQs'}</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-black leading-[1.08] tracking-[-0.01em]">
              What every store owner
              <span className="block text-toyred">wants to know first</span>
            </h2>
            <p className="mt-[18px] max-w-[620px] text-base leading-relaxed text-white/55">
              Something specific about stocking Edvin? Email us the question — a real person replies, not a
              bot.
            </p>
            <div className="mt-[46px]">
              <FAQAccordion />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
