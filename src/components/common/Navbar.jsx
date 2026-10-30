import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ArrowUpRight, Menu, X } from '@/components/common/Icons';
import Logo from '@/components/common/Logo';
import menuLogo from '@/assets/images/fav-icon.svg';
import { CONTACT } from '@/data/contact';
import { lockScroll } from '@/utils/smoothScroll';
const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#journey', label: 'The journey' },
  { to: '/#toys', label: 'Our toys' },
  { to: '/#retailers', label: 'For retailers' },
];
const spring = { type: 'spring', stiffness: 380, damping: 32 };
export default function Navbar() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const contact = location.pathname.startsWith('/contact');
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24);
    setHidden(y > 400 && y > (scrollY.getPrevious() ?? 0) + 2);
  });
  useEffect(() => {
    setHidden(false);
    setOpen(false);
  }, [location.key]);
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const trigger = triggerRef.current;
    menuRef.current?.querySelector('button')?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab') return;
      const items = menuRef.current?.querySelectorAll('a[href], button');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden && !open ? -110 : 0, opacity: 1 }}
        transition={spring}
        className="fixed inset-x-0 top-0 z-50 mr-[var(--scrollbar-compensation,0px)] px-4 phone-down:pt-[max(16px,env(safe-area-inset-top))] sm:px-6"
      >
        <nav
          aria-label="Main"
          className={`mx-auto flex h-20 max-w-7xl phone-down:h-16 items-center justify-between rounded-full px-4 font-display font-bold transition-[background-color,box-shadow] duration-300 sm:px-6 ${scrolled ? 'bg-white/95 shadow-[0_8px_30px_rgba(29,48,69,0.10)]' : 'phone-down:bg-white/90'}`}
        >
          <Link to="/" className="h-full py-3 phone-down:py-2" aria-label="Edvin home">
            <Logo fixedSize />
          </Link>
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  aria-current={location.pathname + location.hash === link.to ? 'page' : undefined}
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-[15px] text-navy/80 transition-colors hover:bg-navy/5 hover:text-navy aria-[current=page]:text-toyred"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              aria-current={contact ? 'page' : undefined}
              className="hidden min-h-11 items-center gap-3 rounded-full border border-navy bg-navy px-5 text-[15px] text-white transition-colors hover:bg-white hover:text-navy sm:inline-flex"
            >
              Contact us <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-navy hover:bg-navy/5 lg:hidden"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[100] flex items-start justify-end bg-navy/45 p-4 pt-[max(16px,env(safe-area-inset-top))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              data-lenis-prevent
              className="flex max-h-[calc(100dvh_-_max(16px,env(safe-area-inset-top))_-_16px)] w-full max-w-[380px] flex-col overflow-y-auto overscroll-contain rounded-[28px] border border-white/10 bg-navy font-display font-bold text-white shadow-[0_24px_80px_#10203355]"
              initial={{ y: reduce ? 0 : -12, scale: reduce ? 1 : 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: reduce ? 0 : -8, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between px-6 pt-6">
                <img src={menuLogo} alt="Edvin" width={600} height={330} className="h-auto w-28" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-toyred hover:bg-toyred hover:text-white"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <p className="px-6 pb-2 pt-6 text-[10px] font-extrabold uppercase tracking-[.2em] text-white/45">
                Explore Edvin
              </p>
              <ul className="flex flex-col px-6">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { ...spring, delay: 0.06 + i * 0.04 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      aria-current={location.pathname + location.hash === link.to ? 'page' : undefined}
                      className="group flex min-h-14 w-full items-center gap-4 border-b border-white/10 py-3 text-[25px] font-black tracking-[-.025em] text-white/90 transition-colors hover:text-[#ffac89] aria-[current=page]:text-[#ffac89]"
                    >
                      <span
                        aria-hidden="true"
                        className="text-[10px] font-bold tabular-nums tracking-[.08em] text-white/35"
                      >
                        0{i + 1}
                      </span>
                      <span className="flex-1">{link.label}</span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="text-white/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="px-6 pb-4 pt-6">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  aria-current={contact ? 'page' : undefined}
                  className="flex min-h-14 items-center justify-between rounded-full bg-toyred px-6 py-3 text-base font-extrabold text-white transition-colors hover:bg-[#c74620]"
                >
                  Contact us <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="mt-3 flex min-h-11 items-center justify-center text-xs font-bold tracking-wide text-white/55 transition-colors hover:text-white"
                >
                  {CONTACT.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
