import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  ChevronDown,
  LoaderCircle,
  CheckCircle2,
} from '@/components/common/Icons';
import { FormField, InputField, FORM_CONTROL } from '@/components/common/FormField';
import { CONTACT, CONTACT_TOPICS } from '@/data/contact';
const ACTION_BUTTON =
  'contact-submit inline-flex min-h-[50px] cursor-pointer items-center justify-center gap-[30px] rounded-[100px] border border-[#bd4323] bg-[#bd4323] px-[22px] py-[13px] text-[13px] font-bold text-white transition-colors duration-200 hover:bg-[#a6391d] disabled:cursor-wait disabled:opacity-70 contact-phone:min-h-[51px] contact-phone:gap-[23px]';
const ERROR_BOX =
  'contact-error-summary mt-6 rounded-[5px] border border-[#e5c0ba] bg-[#fff4f1] p-4 text-xs leading-[1.7] text-[#92281f] [&_a]:underline [&_a]:underline-offset-[3px]';
const EYEBROW =
  'contact-eyebrow flex items-center gap-[10px] text-[10px] font-bold leading-[1.6] tracking-[.13em]';
export default function ContactForm({ form }) {
  const {
    topic,
    values,
    errors,
    pending,
    received,
    failure,
    summaryRef,
    statusRef,
    chooseTopic,
    submit,
    setValues,
    reset,
  } = form;
  const update = (name, value) => setValues((current) => ({ ...current, [name]: value }));
  return (
    <div
      id="contact-form"
      className="contact-form-card min-w-0 scroll-mt-[104px] rounded-xl border border-[#e2e0da] bg-white p-[38px] shadow-[0_8px_32px_#1d304503] tablet-down:p-7 contact-phone:rounded-lg contact-phone:px-[21px] contact-phone:py-[25px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {received ? (
          <motion.div
            key="result"
            ref={statusRef}
            tabIndex={-1}
            className="contact-result flex min-h-[610px] flex-col items-start justify-center contact-phone:min-h-[450px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => statusRef.current?.focus({ preventScroll: true })}
          >
            <span className="contact-result-icon mb-7 grid h-[68px] w-[68px] place-items-center rounded-full bg-[#e9f5ed] text-[#236b4a]">
              <CheckCircle2 size={30} aria-hidden="true" />
            </span>
            <p className={EYEBROW}>A LITTLE HELLO, RECEIVED</p>
            <h2 className="mt-[14px] font-display text-[46px] font-[850] leading-[1.1] tracking-[-.04em] contact-phone:text-[39px]">
              Hello received.
            </h2>
            <p className="mt-[19px] max-w-[350px] text-[15px] leading-[1.8] text-[#626e77] contact-phone:text-[14px]">
              Thanks for getting in touch. Your enquiry is with Edvin, along with the email address you
              shared.
            </p>
            <button type="button" className={`${ACTION_BUTTON} mt-[30px]`} onClick={reset}>
              Send another message <ArrowRight size={17} aria-hidden="true" />
            </button>
            <Link
              to="/#toys"
              className="contact-inline-link mt-5 inline-flex min-h-11 items-center gap-3 text-[12px] font-bold hover:text-[#bd4323]"
            >
              A little more play? Meet the toys <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={submit}
            aria-labelledby="contact-form-title"
            aria-busy={pending}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="contact-form-heading flex items-center justify-between gap-[15px]">
              <div>
                <p className={`${EYEBROW} !text-[9px] text-[#626e77]`}>YOUR NEXT LITTLE STEP</p>
                <h2
                  id="contact-form-title"
                  className="mt-3 font-display text-[33px] font-[850] leading-[1.15] tracking-[-.04em] tablet-down:text-[29px]"
                >
                  Tell us a little more.
                </h2>
              </div>
              <Mail
                size={26}
                strokeWidth={1.5}
                aria-hidden="true"
                className="flex-none text-[#bd4323] contact-phone:hidden"
              />
            </div>
            <p className="contact-form-lead mt-3 text-[13px] leading-[1.7] text-[#626e77] contact-phone:text-[12px]">
              Start with a hello. We’ll take it from there.
            </p>
            {Object.keys(errors).length > 0 && (
              <div ref={summaryRef} tabIndex={-1} className={ERROR_BOX} role="alert">
                <strong>A couple of little details need your attention.</strong>
                <ul className="ml-[15px] mt-2 list-disc">
                  {Object.entries(errors).map(([name, message]) => (
                    <li key={name}>
                      <a href={`#contact-${name}`}>{message}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <fieldset
              disabled={pending}
              className="contact-fields mt-[31px] grid min-w-0 gap-6 border-0 p-0 disabled:opacity-[.65] contact-phone:mt-[27px] contact-phone:gap-[23px]"
            >
              <legend className="sr-only">Your contact details and enquiry</legend>
              <div className="contact-field-row grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 contact-phone:grid-cols-1 contact-phone:gap-[23px]">
                <InputField
                  name="name"
                  label="Your name"
                  value={values.name}
                  onChange={(value) => update('name', value)}
                  required
                  autoComplete="name"
                  error={errors.name}
                />
                <InputField
                  name="email"
                  label="Email address"
                  type="email"
                  value={values.email}
                  onChange={(value) => update('email', value)}
                  required
                  autoComplete="email"
                  error={errors.email}
                />
              </div>
              <div className="contact-field-row grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 contact-phone:grid-cols-1 contact-phone:gap-[23px]">
                <InputField
                  name="company"
                  label="Company / store"
                  value={values.company}
                  onChange={(value) => update('company', value)}
                  optional
                  autoComplete="organization"
                />
                <InputField
                  name="city"
                  label="City"
                  value={values.city}
                  onChange={(value) => update('city', value)}
                  optional
                  autoComplete="address-level2"
                />
              </div>
              <FormField name="topic" label="What’s it about?">
                <div className="contact-select relative">
                  <select
                    id="contact-topic"
                    name="topic"
                    value={topic.id}
                    onChange={(event) => chooseTopic(event.target.value)}
                    className={`${FORM_CONTROL} min-h-[49px] cursor-pointer appearance-none pr-[42px] text-sm`}
                  >
                    {CONTACT_TOPICS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-[14px] top-[18px]"
                    aria-hidden="true"
                  />
                </div>
              </FormField>
              <FormField name="message" label="Your message" required error={errors.message}>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  maxLength={5000}
                  value={values.message}
                  onChange={(event) => update('message', event.target.value)}
                  placeholder={
                    topic.id === 'retail'
                      ? 'Tell us about your store and the toys you’d love to stock…'
                      : topic.id === 'toys'
                        ? 'Which toy is on your mind? Tell us how we can help…'
                        : 'A question, an idea, a little introduction…'
                  }
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'error-message' : undefined}
                  className={`${FORM_CONTROL} min-h-[145px] resize-y text-sm placeholder:text-[#737d84] contact-phone:text-base`}
                />
              </FormField>
            </fieldset>
            {failure && (
              <div className={ERROR_BOX} role="alert">
                <p>{failure}</p>
                <a href={`mailto:${CONTACT.email}`}>You can also email {CONTACT.email}.</a>
              </div>
            )}
            <div className="contact-form-bottom mt-[27px] flex flex-wrap items-center justify-between gap-4 contact-phone:gap-[14px]">
              <motion.button
                type="submit"
                disabled={pending}
                className={ACTION_BUTTON}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                {pending ? 'Sending…' : 'Send your message'}
                {pending ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowUpRight size={18} aria-hidden="true" />
                )}
              </motion.button>
              <span className="contact-required-note text-[10px] text-[#626e77]">
                * The little essentials
              </span>
            </div>
            <p className="contact-delivery-note mt-[18px] text-[11px] leading-[1.7] text-[#626e77]">
              Your email helps us get back to you about this enquiry.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
