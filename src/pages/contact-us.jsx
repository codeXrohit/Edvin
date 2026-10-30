import { Link } from 'react-router-dom';
import { ArrowRight } from '@/components/common/Icons';
import ContactHero from '@/components/contact-us/contact-hero';
import ContactTopics from '@/components/contact-us/contact-topics';
import ContactForm from '@/components/contact-us/contact-form';
import ContactDiscover from '@/components/contact-us/contact-discover';
import { useContactForm } from '@/hooks/useContactForm';
export default function ContactUs() {
  const form = useContactForm();
  return (
    <div className="contact-page [--contact-ink:#1d3045] [--contact-muted:#626e77] [--contact-orange:#e4572e] [--contact-action:#bd4323] [--contact-line:#e2e0da] [background:#fdfaf6] text-[color:var(--contact-ink)] pt-[108px] pr-0 pb-[90px] pl-0 contact-phone:pt-24 contact-phone:pb-12 motion-reduce:[&_*]:!animate-[none] motion-reduce:[&_*]:![transition:none] motion-reduce:[&_*::before]:!animate-[none] motion-reduce:[&_*::before]:![transition:none] motion-reduce:[&_*::after]:!animate-[none] motion-reduce:[&_*::after]:![transition:none]">
      <div className="contact-container w-[min(1280px,_calc(100%_-_96px))] ml-auto mr-auto tablet-down:w-[calc(100%_-_64px)] contact-phone:w-[calc(100%_-_40px)]">
        <nav
          className="contact-breadcrumb flex items-center gap-3 text-[length:12px] text-[color:var(--contact-muted)] [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11 [&_a:hover]:text-[color:var(--contact-action)] [&_[aria-current]]:text-[color:var(--contact-ink)] contact-phone:text-[length:11px]"
          aria-label="Breadcrumb"
        >
          <Link to="/">Home</Link>
          <ArrowRight size={12} aria-hidden="true" />
          <span aria-current="page">Contact us</span>
        </nav>
        <ContactHero />
        <section
          className="contact-conversation grid grid-cols-[.88fr_1.35fr] [align-items:start] gap-20 pt-14 border-t border-[var(--contact-line)] tablet-down:gap-10 tablet-down:grid-cols-[.9fr_1.25fr] contact-tablet:grid-cols-[1fr] contact-tablet:gap-[35px] contact-phone:pt-[37px] contact-phone:gap-[27px]"
          aria-labelledby="conversation-title"
        >
          <ContactTopics form={form} />
          <ContactForm form={form} />
        </section>
        <ContactDiscover />
      </div>
    </div>
  );
}
