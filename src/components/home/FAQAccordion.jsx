import { useId, useState } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { Minus, Plus } from '@/components/common/Icons';
const FAQS = [
  {
    q: 'What does stocking Edvin actually involve?',
    a: 'You pick the families you want, we pack and ship the sealed containers, and one contact at Edvin handles orders, restocking and any issues end to end.',
  },
  {
    q: 'Is there a minimum order to become a retailer?',
    a: 'Tell us about your store and the range you have in mind. Our team will confirm minimum quantities and order details before you place an order.',
  },
  {
    q: 'How long does delivery take once I order?',
    a: 'Delivery timing depends on your location, the products and availability. Ask our team for an estimated schedule for your order.',
  },
  {
    q: 'Can I return or exchange slow-moving stock?',
    a: 'Please discuss returns and exchange terms with our team before ordering. We’ll help you understand the options for your store.',
  },
  {
    q: 'Do you offer in-store display units?',
    a: 'Let us know your shelf or counter space. Our team can discuss the display options currently available for your chosen range.',
  },
  {
    q: 'Who do I talk to after my first order?',
    a: 'You get one direct contact at Edvin for everything — reorders, restocking schedules and any issue with a shipment.',
  },
];
function FAQAnswer({ children, labelledBy }) {
  const present = useIsPresent();
  const reduce = useReducedMotion();
  return (
    <motion.div
      role="region"
      aria-labelledby={labelledBy}
      aria-hidden={!present}
      inert={present ? undefined : ''}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <p className="border-t border-white/10 px-[22px] py-[24px] text-base leading-relaxed text-white/60 md:px-[28px]">
        {children}
      </p>
    </motion.div>
  );
}
export default function FAQAccordion() {
  const [open, setOpen] = useState(0);
  const prefix = useId();
  return (
    <div className="grid gap-[14px]">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <article key={item.q} className="overflow-hidden rounded-[18px] bg-black">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              id={`${prefix}-question-${i}`}
              aria-controls={`${prefix}-answer-${i}`}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left md:gap-[22px] md:px-[28px] md:py-6"
            >
              <span className="flex items-center gap-[22px]">
                <span className="text-lg font-extrabold text-white/40">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[17px] font-extrabold leading-6 text-white">{item.q}</span>
              </span>
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-toyred text-white">
                {isOpen ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
              </span>
            </button>
            <div id={`${prefix}-answer-${i}`}>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <FAQAnswer key={item.q} labelledBy={`${prefix}-question-${i}`}>
                    {item.a}
                  </FAQAnswer>
                )}
              </AnimatePresence>
            </div>
          </article>
        );
      })}
    </div>
  );
}
