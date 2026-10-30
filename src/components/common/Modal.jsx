import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from '@/components/common/Icons';
import { lockScroll } from '@/utils/smoothScroll';
export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/70 p-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative w-full max-w-xl rounded-[28px] bg-black p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
            {title && <h3 className="mb-6 font-display text-2xl font-black">{title}</h3>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
