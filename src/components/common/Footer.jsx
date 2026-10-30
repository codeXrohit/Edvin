import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Facebook } from '@/components/common/Icons';
import { CONTACT } from '@/data/contact';
import { SOCIAL_LINKS } from '@/data/socials';
import footerLogo from '@/assets/images/fav-icon.svg';
import FooterNavigation from '@/components/common/FooterNavigation';
const SOCIAL_ICONS = { instagram: Instagram, facebook: Facebook };
const EXPLORE = [
  { to: '/#journey', label: 'The journey' },
  { to: '/#port', label: 'The port' },
  { to: '/#store', label: 'The store' },
  { to: '/#toys', label: 'Our toys' },
];
const PAGES = [
  { to: '/contact', label: 'Contact us' },
  { to: '/about-us', label: 'About us' },
  { to: '/products', label: 'Products' },
];
export default function Footer() {
  return (
    <footer className="bg-[#111111] font-display font-bold text-white phone-down:text-center">
      <div className="mx-auto max-w-7xl px-5 pb-0 pt-16 sm:px-8 sm:pt-20">
        <div className="flex flex-col gap-6 phone-down:items-center sm:flex-row phone-down:flex-col sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-black leading-tight">
              Let’s keep the <span className="text-toyred">play</span> going.
            </h2>
            <p className="mt-2 max-w-sm phone-down:mx-auto text-base leading-relaxed text-white/65">
              Be the first to know about new toys, restocks, exclusive offers and more.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-white px-6 py-3 text-base text-navy transition-colors duration-300 hover:border-white/25 hover:bg-transparent hover:text-white"
          >
            Let’s talk
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 border-t border-white/10" />

        <div className="grid grid-cols-2 gap-x-3 gap-y-4 py-10 md:gap-y-10 md:py-14 md:grid-cols-[1.5fr_1fr_1fr] md:gap-10 lg:grid-cols-[1.5fr_.85fr_.85fr_1.1fr] lg:gap-12">
          <div className="col-span-2 pb-5 md:col-span-1 md:pb-0">
            <img
              src={footerLogo}
              alt="Edvin"
              width={600}
              height={330}
              className="block h-auto w-36 phone-down:mx-auto phone-down:w-[120px]"
            />
            <p className="mt-4 max-w-xs phone-down:mx-auto text-base leading-relaxed text-white/60">
              Toys for real play, packed with care and shipped across the sea to stores near you.
            </p>
            <div
              className="mt-5 flex flex-wrap gap-x-6 gap-y-2 phone-down:justify-center"
              aria-label="Edvin social media"
            >
              {SOCIAL_LINKS.map(({ id, label, href }) => {
                const Icon = SOCIAL_ICONS[id];
                const className =
                  'inline-flex min-h-11 items-center gap-2 text-sm text-white/80 transition-colors';
                return href ? (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`${className} hover:text-white`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </a>
                ) : (
                  <span key={id} role="img" aria-label={label} className={className}>
                    <Icon size={16} />
                    <span>{label}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <FooterNavigation
            groups={[
              { title: 'Explore', links: EXPLORE },
              { title: 'Pages', links: PAGES },
            ]}
          />

          <div className="col-span-2 pt-5 md:col-span-3 md:pt-0 lg:col-span-1">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">
              Sell Edvin
            </p>
            <p className="mt-5 text-base leading-relaxed text-white/75">
              Run a toy shop? We’ll get Edvin on your shelves.
            </p>
            <Link
              to="/contact?topic=retail"
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 font-display text-sm font-extrabold transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
            >
              For retailers
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col-reverse items-center gap-3 border-t border-white/10 py-6 text-base text-white/45 sm:flex-row sm:justify-between phone-down:flex-col-reverse phone-down:justify-center">
          <p>© {new Date().getFullYear()} Edvin. All rights reserved.</p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex min-h-11 items-center text-sm text-white/65 transition-colors hover:text-white"
          >
            {CONTACT.email} <ArrowRight size={14} aria-hidden="true" className="ml-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
