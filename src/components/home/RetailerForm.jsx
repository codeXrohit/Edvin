import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from '@/components/common/Icons';
import { CONTACT } from '@/data/contact';
import { deliverEnquiry } from '@/api/contact';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
const field =
  'mt-2 w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder:text-white/35 transition-colors focus:border-toyred focus:outline-none';
export default function RetailerForm({ gridClassName = 'grid gap-5' }) {
  const [searchParams] = useSearchParams();
  const product = PRODUCTS.find((item) => item.id === searchParams.get('product'));
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    setSent(false);
    setError('');
  }, [product?.id]);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;
    const data = new FormData(e.currentTarget);
    setPending(true);
    setError('');
    try {
      await deliverEnquiry({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        city: String(data.get('city') ?? ''),
        company: '',
        topic: 'Retail partnership',
        message: `${product ? `Product: ${product.name}\n` : ''}${String(data.get('message') ?? '').trim() || 'I would like information about stocking Edvin toys.'}${data.get('updates') ? '\nPlease include the retailer starter kit.' : ''}`,
      });
      setSent(true);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Please try again in a moment.');
    } finally {
      setPending(false);
    }
  };
  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="flex min-h-[220px] flex-col items-center justify-center text-center"
          role="status"
        >
          <CheckCircle2 size={40} className="text-leaf" aria-hidden="true" />
          <h3 className="mt-4 font-display text-2xl font-black">Request sent</h3>
          <p className="mt-3 max-w-xs text-base text-white/75">
            Thanks for reaching out. We’ll reply to the email you gave us.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-6 cursor-pointer rounded-full border border-white/30 px-5 py-2.5 text-base font-medium transition-colors hover:border-white"
          >
            Send another request
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          aria-busy={pending}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className={gridClassName}
        >
          {product && (
            <p
              role="status"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80"
            >
              Enquiring about <strong className="text-white">{product.name}</strong>
            </p>
          )}
          <label className="block text-base font-medium text-white/85">
            Your name
            <input
              disabled={pending}
              required
              name="name"
              maxLength={120}
              autoComplete="name"
              className={field}
            />
          </label>
          <label className="block text-base font-medium text-white/85">
            City
            <input
              disabled={pending}
              required
              name="city"
              maxLength={120}
              autoComplete="address-level2"
              className={field}
            />
          </label>
          <label className="block text-base font-medium text-white/85">
            Email
            <input
              disabled={pending}
              required
              type="email"
              name="email"
              maxLength={254}
              autoComplete="email"
              className={field}
            />
          </label>
          <label className="block text-base font-medium text-white/85">
            Message (optional)
            <textarea
              disabled={pending}
              name="message"
              rows={1}
              maxLength={4900}
              className={`${field} resize-none`}
              placeholder="Which toys are you interested in?"
            />
          </label>
          <label className="flex items-center gap-3 text-base text-white/70">
            <input
              disabled={pending}
              type="checkbox"
              name="updates"
              className="h-[18px] w-[18px] rounded border border-white/28 bg-transparent accent-toyred"
            />
            Send me the retailer starter kit
          </label>
          <motion.button
            type="submit"
            disabled={pending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="inline-flex h-[52px] w-fit cursor-pointer items-center gap-3 rounded-full bg-white/10 pl-1.5 pr-6 font-display text-base font-extrabold text-white transition-colors duration-300 hover:bg-toyred"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-toyred text-white">
              <ArrowRight size={16} aria-hidden="true" />
            </span>
            {pending ? 'Sending…' : 'Send request'}
          </motion.button>
          {error && (
            <p role="alert" className="text-sm leading-relaxed text-white">
              {error}{' '}
              <a className="underline" href={`mailto:${CONTACT.email}`}>
                Email {CONTACT.email}
              </a>
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
