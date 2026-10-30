import { motion } from 'motion/react';
import { ArrowDown, Heart, Asterisk, Plus } from '@/components/common/Icons';
import bearImage from '@/assets/images/bear.webp';
export default function ContactHero() {
  return (
    <section
      className="contact-hero grid grid-cols-[1.25fr_1fr] items-center gap-6 pt-12 pr-0 pb-[68px] pl-0 [&_h1]:mt-6 [&_h1]:font-display [&_h1]:text-[length:clamp(58px,_6.6vw,_91px)] [&_h1]:font-black [&_h1]:tracking-[-.055em] [&_h1]:leading-[1.04] [&_h1>span]:text-[color:var(--contact-orange)] tablet-down:[&_h1]:text-[length:clamp(54px,_6.5vw,_75px)] contact-tablet:gap-0 contact-tablet:pb-[45px] contact-tablet:[&_h1]:text-[length:clamp(42px,_6.5vw,_54px)] contact-phone:grid-cols-[1fr] contact-phone:pt-[30px] contact-phone:pb-7 contact-phone:[&_h1]:text-[length:clamp(45px,_11.8vw,_70px)] contact-phone:[&_h1]:mt-5"
      aria-labelledby="contact-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 24 }}
      >
        <p className="contact-eyebrow flex items-center gap-[10px] text-[length:10px] font-bold tracking-[.13em] leading-[1.6] [&>span]:w-[7px] [&>span]:h-[7px] [&>span]:flex-none [&>span]:[background:var(--contact-orange)] [&>span]:rounded-full">
          <span /> EDVIN / SAY HELLO
        </p>
        <h1 id="contact-title">
          Little questions.
          <br />
          <span>Big hello.</span>
        </h1>
        <p className="contact-intro mt-[27px] text-[length:15px] leading-[1.85] text-[color:var(--contact-muted)] contact-phone:mt-[22px] contact-phone:text-[length:14px]">
          A new toy for your shelves. A question on your mind.
          <br className="contact-desktop-break contact-tablet:hidden" /> Whatever brings you here, we’re happy
          to talk.
        </p>
        <a
          href="#contact-form"
          className="contact-hero-link inline-flex gap-[25px] items-center min-h-11 mt-[22px] text-[length:13px] font-bold [&_i]:text-[color:var(--contact-action)] [&_i]:[transition:transform_.2s] [&:hover_i]:[transform:translateY(3px)] contact-phone:mt-[15px] contact-phone:text-[length:12px] motion-reduce:[&:hover_i]:[transform:none]"
        >
          Let’s start a conversation <ArrowDown size={16} aria-hidden="true" />
        </a>
      </motion.div>
      <div
        className="contact-illustration relative h-[350px] isolate tablet-down:[transform:scale(.88)] tablet-down:[transform-origin:center] tablet-down:ml-[-15px] tablet-down:mr-[-15px] contact-tablet:[transform:scale(.72)] contact-tablet:[transform-origin:left_center] contact-tablet:w-[380px] contact-tablet:mr-[-100px] contact-phone:justify-self-center contact-phone:w-[min(370px,_100%)] contact-phone:h-[270px] contact-phone:mt-[18px] contact-phone:mr-0 contact-phone:mb-0 contact-phone:ml-0 contact-phone:[transform:none]"
        aria-hidden="true"
      >
        <div className="contact-illustration-circle absolute w-[310px] h-[310px] top-4 left-[70px] rounded-full [background:#e7eff0] contact-phone:w-[230px] contact-phone:h-[230px] contact-phone:left-[60px] contact-phone:top-5" />
        <div className="contact-letter absolute z-[2] left-[13px] top-[22px] w-[236px] pt-6 pr-[26px] pb-6 pl-[26px] [transform:rotate(-9deg)] [background:#fff] border border-[#e8e3dc] shadow-[0_12px_26px_#1d30450a] [&_p]:text-[length:13px] [&_strong]:block [&_strong]:mt-[13px] [&_strong]:font-display [&_strong]:text-[length:28px] [&_strong]:font-[850] [&_strong]:tracking-[-.035em] [&_strong]:leading-[1.18] [&>i]:absolute [&>i]:right-[23px] [&>i]:bottom-5 [&>i]:text-[color:var(--contact-action)] [&>i]:[transform:rotate(13deg)] contact-phone:w-[185px] contact-phone:left-3 contact-phone:top-5 contact-phone:pt-[18px] contact-phone:pr-[21px] contact-phone:pb-[18px] contact-phone:pl-[21px] contact-phone:[&_p]:text-[length:11px] contact-phone:[&_strong]:text-[length:24px] contact-phone:[&_strong]:mt-[10px] contact-phone:[&>i]:text-[length:21px] contact-phone:[&>i]:w-[21px] contact-phone:[&>i]:h-[21px] contact-phone:[&>i]:right-[18px] contact-phone:[&>i]:bottom-4">
          <span className="contact-letter-dot block w-[10px] h-[10px] rounded-full [background:var(--contact-orange)] mb-[19px] contact-phone:mb-[13px] contact-phone:w-2 contact-phone:h-2" />
          <p>Dear Edvin,</p>
          <strong>
            A little hello.
            <br />A world of play.
          </strong>
          <span className="contact-letter-signoff block mt-6 text-[color:var(--contact-muted)] text-[length:12px] contact-phone:mt-[17px] contact-phone:text-[length:10px]">
            From, you.
          </span>
          <Heart size={26} strokeWidth={1.5} />
        </div>
        <img
          className="contact-hero-bear absolute right-[-4px] bottom-0 w-[275px] h-[275px] object-contain mix-blend-multiply [transform:rotate(7deg)] contact-phone:w-[220px] contact-phone:h-[220px] contact-phone:right-0 contact-phone:bottom-0"
          src={bearImage}
          alt=""
          width={800}
          height={800}
        />
        <div className="contact-hello-stamp absolute z-[3] right-4 top-[5px] grid [place-content:center] w-[101px] h-[101px] rounded-full [transform:rotate(13deg)] [background:var(--contact-orange)] text-[color:#fff] text-center font-display text-[length:35px] font-[850] tracking-[-.04em] [&_span]:block [&_span]:font-body [&_span]:text-[length:7px] [&_span]:tracking-[.12em] contact-phone:w-[77px] contact-phone:h-[77px] contact-phone:text-[length:29px] contact-phone:right-2 contact-phone:top-[10px] contact-phone:[&_span]:text-[length:6px]">
          hello<span>LET’S TALK PLAY</span>
        </div>
        <Asterisk
          size={36}
          className="contact-spark absolute left-[10px] bottom-[10px] rotate-12 text-[#dfab37] contact-phone:left-[7px] contact-phone:bottom-[15px] contact-phone:text-[25px]"
        />
        <Plus
          size={24}
          className="contact-spark absolute right-1 bottom-[2px] text-[color:var(--contact-ink)]"
        />
      </div>
    </section>
  );
}
