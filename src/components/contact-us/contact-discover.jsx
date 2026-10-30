import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@/components/common/Icons';
import blocksImage from '@/assets/images/blocks.webp';
export default function ContactDiscover() {
  return (
    <section
      className="contact-toys-note grid grid-cols-[1.4fr_1fr] items-center relative isolate overflow-hidden min-h-[300px] mt-[85px] pt-[45px] pr-[58px] pb-[45px] pl-[58px] rounded-[12px] [background:#e8f0f1] [&_h2]:mt-5 [&_h2]:font-display [&_h2]:text-[length:clamp(32px,_3.4vw,_45px)] [&_h2]:font-[850] [&_h2]:leading-[1.12] [&_h2]:tracking-[-.04em] [&_h2_span]:text-[color:#346d72] [&_a]:inline-flex [&_a]:items-center [&_a]:gap-[25px] [&_a]:min-h-11 [&_a]:mt-[19px] [&_a]:text-[length:13px] [&_a]:font-bold [&_a:hover]:underline [&_a:hover]:[text-underline-offset:5px] [&_img]:absolute [&_img]:right-[25px] [&_img]:bottom-[-48px] [&_img]:w-[355px] [&_img]:h-[355px] [&_img]:object-contain [&_img]:mix-blend-multiply [&_img]:[transform:rotate(-7deg)] [&_img]:z-[-1] contact-tablet:mt-[50px] contact-tablet:pl-[35px] contact-tablet:pr-[35px] contact-tablet:[&_img]:w-[300px] contact-tablet:[&_img]:h-[300px] contact-tablet:[&_img]:right-[-10px] contact-tablet:[&_img]:bottom-[-20px] contact-phone:grid-cols-[1fr] contact-phone:[align-items:start] contact-phone:min-h-[410px] contact-phone:mt-9 contact-phone:p-7 contact-phone:[&_h2]:text-[length:32px] contact-phone:[&_img]:w-[240px] contact-phone:[&_img]:h-[240px] contact-phone:[&_img]:right-[-13px] contact-phone:[&_img]:bottom-[-42px] contact-phone:[&_a]:gap-[15px] contact-phone:[&_a]:text-[length:12px]"
      aria-labelledby="contact-toys-title"
    >
      <div>
        <p className="contact-eyebrow flex items-center gap-[10px] text-[length:10px] font-bold tracking-[.13em] leading-[1.6] [&>span]:w-[7px] [&>span]:h-[7px] [&>span]:flex-none [&>span]:[background:var(--contact-orange)] [&>span]:rounded-full">
          WHILE YOU’RE HERE
        </p>
        <h2 id="contact-toys-title">
          There’s a little more
          <br />
          <span>play to discover.</span>
        </h2>
        <Link to="/#toys">
          Meet the Edvin collection <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <img
        src={blocksImage}
        alt="Colourful wooden stacking blocks from the Edvin collection"
        width={800}
        height={800}
        loading="lazy"
      />
    </section>
  );
}
