import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight } from '@/components/common/Icons';
import { CONTACT } from '@/data/contact';
export default function OfficeAddress() {
  return (
    <>
      <div className="contact-direct mt-8 pt-7 border-t border-[var(--contact-line)] [&_h3]:mb-[11px] [&_h3]:text-[length:12px] [&_h3]:font-bold [&_a]:flex [&_a]:items-center [&_a]:gap-[13px] [&_a]:min-h-11 [&_a]:text-[length:14px] [&>p]:flex [&>p]:items-center [&>p]:gap-[13px] [&>p]:min-h-11 [&>p]:text-[length:14px] [&_a>span]:[overflow-wrap:anywhere] [&>p>span]:[overflow-wrap:anywhere] [&_a_i:last-child]:ml-auto [&_a:hover]:text-[color:var(--contact-action)] contact-tablet:flex contact-tablet:flex-wrap contact-tablet:items-center contact-tablet:gap-[8px_24px] contact-tablet:mt-[26px] contact-tablet:pt-5 contact-tablet:[&_h3]:w-full contact-tablet:[&_h3]:m-0 contact-tablet:[&_a]:gap-[10px] contact-phone:gap-[1px_20px] contact-phone:mt-[23px] contact-phone:[&_a]:text-[length:13px]">
        <h3>Prefer a direct hello?</h3>
        <a href={`mailto:${CONTACT.email}`}>
          <Mail size={17} aria-hidden="true" />
          <span>{CONTACT.email}</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`}>
          <Phone size={17} aria-hidden="true" />
          <span>{CONTACT.phone}</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        {CONTACT.address && (
          <p>
            <MapPin size={17} aria-hidden="true" />
            <span>{CONTACT.address}</span>
          </p>
        )}
      </div>
      <Link
        to="/#retailers"
        className="contact-faq-link grid grid-cols-[1fr_16px] gap-[5px_12px] mt-[25px] pt-3 pb-3 text-[length:12px] font-bold [&>span]:block [&>span]:[grid-column:1_/_-1] [&>span]:text-[color:var(--contact-muted)] [&>span]:text-[length:11px] [&>span]:font-normal hover:text-[color:var(--contact-action)] contact-tablet:w-[fit-content] contact-tablet:mt-[10px] contact-phone:mt-3"
      >
        A few things worth knowing <ArrowUpRight size={16} aria-hidden="true" />
        <span>Explore our retailer FAQs</span>
      </Link>
    </>
  );
}
