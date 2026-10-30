import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { BACK_TO_TOP_DURATION, scrollToTop } from '@/utils/smoothScroll';
import truckOff from '@/assets/images/back-to-top.svg';
import truckOn from '@/assets/images/back-to-top-on.svg';
/* A little truck, parked bottom-right once you've scrolled a screen or two.
   It's shot from above with its cab pointing up, so driving it "forward"
   doubles as the back-to-top cue. Click drives the page back to the top and
   switches its headlights on for the ride. */
export default function BackToTopTruck() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    let threshold = 700;
    const onScroll = () => setVisible(window.scrollY > threshold);
    const measure = () => {
      const store = document.getElementById('store');
      threshold = window.innerWidth < 768 && store ? store.offsetTop + window.innerHeight * 0.75 : 700;
      onScroll();
    };
    const observer = new ResizeObserver(measure);
    const main = document.getElementById('main-content');
    if (main) observer.observe(main);
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, [pathname]);
  const handleClick = () => {
    setLit(true);
    scrollToTop();
    window.setTimeout(() => setLit(false), BACK_TO_TOP_DURATION * 1000);
  };
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          onHoverStart={() => setLit(true)}
          onHoverEnd={() => setLit(false)}
          onFocus={() => setLit(true)}
          onBlur={() => setLit(false)}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.8 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 360, damping: 26 }}
          style={{ WebkitTapHighlightColor: 'transparent' }}
          className="fixed bottom-5 right-3 z-40 mr-[var(--scrollbar-compensation,0px)] flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2 sm:bottom-8 sm:right-8"
        >
          <span className="relative block h-12 sm:h-[4.5rem]" style={{ aspectRatio: '684 / 2048' }}>
            <img
              src={truckOff}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500 motion-reduce:transition-none"
              style={{ opacity: lit ? 0 : 1 }}
            />
            <img
              src={truckOn}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-500 motion-reduce:transition-none"
              style={{ opacity: lit ? 1 : 0, transform: lit ? 'scale(1.2)' : 'scale(1)' }}
            />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
