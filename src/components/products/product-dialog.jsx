import { useEffect, useRef } from 'react';
import { ArrowRight, X } from '@/components/common/Icons';
import { lockScroll } from '@/utils/smoothScroll';

export default function ProductDialog({ product, onClose, onEnquire }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
    lockScroll(Boolean(product));
    return () => {
      if (dialog.open) dialog.close();
      lockScroll(false);
    };
  }, [product]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="toy-dialog-title"
      aria-describedby="toy-dialog-description"
      data-lenis-prevent
      className="toy-dialog fixed inset-0 m-auto max-h-[calc(100dvh_-_48px)] w-[min(760px,calc(100%_-_48px))] max-w-none overflow-y-auto overscroll-contain rounded-2xl border-0 bg-white p-0 text-navy shadow-[0_24px_80px_#14233a33] backdrop:bg-navy/35 phone-down:max-h-[calc(100dvh_-_32px)] phone-down:w-[min(420px,calc(100%_-_32px))]"
      onClose={onClose}
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons = event.currentTarget.querySelectorAll('button:not(:disabled)');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {product && (
        <div className="relative grid grid-cols-[.95fr_1.05fr] phone-down:grid-cols-1">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close toy details"
            autoFocus
            className="absolute right-3 top-3 z-10 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-navy/10 bg-white text-navy transition-colors hover:bg-paper"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div className="flex items-center justify-center bg-[#f5f6f6] p-3 phone-down:px-8 phone-down:py-4">
            <img
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="h-auto max-h-[380px] w-full object-contain mix-blend-multiply phone-down:h-[min(23dvh,190px)]"
            />
          </div>
          <div className="self-center px-8 pb-8 pt-16 phone-down:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#bd4323]">{product.type}</p>
            <h2
              id="toy-dialog-title"
              className="mt-3 font-display text-[32px] font-black leading-[1.08] tracking-[-.035em] phone-down:text-[28px]"
            >
              {product.name}
            </h2>
            <p id="toy-dialog-description" className="mt-4 text-sm leading-7 text-navy/70">
              {product.description}
            </p>
            <button
              type="button"
              onClick={onEnquire}
              className="mt-6 inline-flex min-h-12 cursor-pointer items-center justify-center gap-4 rounded-full bg-[#bd4323] px-5 text-xs font-bold text-white transition-colors hover:bg-navy"
            >
              Stock this collection <ArrowRight size={17} aria-hidden="true" />
            </button>
            <p className="mt-4 text-xs leading-5 text-navy/65">
              Available through toy shops and partner stores.
            </p>
          </div>
        </div>
      )}
    </dialog>
  );
}
