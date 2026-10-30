import { motion, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from '@/components/common/Icons';
import { useVideoScrub } from '@/hooks/useVideoScrub';
import { useJourneyTransition } from '@/hooks/useJourneyTransition';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { scrollToId } from '@/utils/smoothScroll';
import cloudPoster from '@/assets/images/cloud-poster.webp';
import journeyPoster from '@/assets/images/journey-poster.webp';

const CLOUD_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4';
const shipOpacity = (p) => Math.max(0, Math.min(1, (p - 0.68) / 0.08));

function Stagger({ visible, delay = 0, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible || reduce ? 0 : 18 }}
      transition={{ duration: reduce ? 0 : 0.45, delay: visible && !reduce ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}

export default function ArrivalHero() {
  const containerRef = useRef(null);
  const phone = useMediaQuery('(max-width: 767px)');
  const reduce = useReducedMotion();
  const {
    videoRef,
    canvasRef,
    scrollProgress: p,
    canvasLive,
    mediaFailed,
  } = useVideoScrub(CLOUD_VIDEO, containerRef);
  const startJourney = useJourneyTransition(containerRef, p);
  const [entered, setEntered] = useState(false);
  const [phase, setPhase] = useState('welcome');
  const previousPhase = useRef('welcome');
  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), 150);
    return () => clearTimeout(timer);
  }, []);
  useMotionValueEvent(p, 'change', (value) => {
    const next = value < 0.05 ? 'welcome' : shipOpacity(value) > 0.3 ? 'ship' : 'cloud';
    if (next !== previousPhase.current) {
      const active = document.activeElement;
      if (
        (next === 'ship' && active?.closest('[data-journey-intro]')) ||
        (next !== 'ship' && active?.closest('[data-journey-ship]')) ||
        (next !== 'welcome' && active?.closest('[data-journey-cue]'))
      )
        document.getElementById('main-content')?.focus({ preventScroll: true });
      previousPhase.current = next;
      setPhase(next);
    }
  });
  const shipVisible = phase === 'ship';
  const oCue = useTransform(p, [0, 0.05], [1, 0]);
  const oWelcome = useTransform(p, [0, 0.08], [1, 0]);
  const oShip = useTransform(() => shipOpacity(p.get()));
  const oIntro = useTransform(p, [0.57, 0.68], [1, 0]);
  const fade = useTransform(p, [0.94, 1], [0, 1]);
  const mediaClass = 'absolute inset-0 h-full w-full object-cover phone-down:object-[22%_center]';
  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative h-[560vh] phone-down:h-[340svh]"
      aria-label="Edvin intro: from the clouds to the cargo ship"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#fdfaf6] phone-down:h-[100dvh]">
        <div className="absolute inset-0 overflow-hidden bg-[#dfe6ec]">
          <img
            src={shipVisible ? journeyPoster : cloudPoster}
            alt=""
            width={1280}
            height={720}
            className={mediaClass}
            fetchpriority="high"
          />
          <video
            ref={videoRef}
            src={CLOUD_VIDEO}
            poster={shipVisible ? journeyPoster : cloudPoster}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            className={`${mediaClass} ${mediaFailed ? 'invisible' : ''}`}
          />
          <canvas
            ref={canvasRef}
            width={phone ? 960 : 1600}
            height={phone ? 540 : 900}
            aria-hidden="true"
            className={`${mediaClass} transition-opacity duration-300 ${canvasLive && !mediaFailed ? 'opacity-100' : 'opacity-0'}`}
          />
          <div
            className={`pointer-events-none absolute inset-0 hidden phone-down:block ${shipVisible ? 'bg-[linear-gradient(180deg,#14233a33_0%,#14233a66_45%,#14233a99_100%)]' : 'bg-gradient-to-t from-navy/90 via-transparent to-transparent'}`}
          />
          <div
            className="absolute inset-x-0 bottom-0 hidden h-[3px] bg-navy/10 phone-down:block"
            aria-hidden="true"
          >
            <motion.div className="h-full origin-left bg-toyred" style={{ scaleX: p }} />
          </div>
        </div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-4 pt-[20vh] phone-down:justify-start phone-down:px-6 phone-down:pt-[20svh] landscape-phone:pt-[28svh]"
          style={{ opacity: oWelcome }}
        >
          <h1
            aria-label="Welcome to Edvin"
            className="select-none text-center font-display text-[clamp(1.9rem,9vw,6.5rem)] font-black uppercase leading-none tracking-wide text-navy [mask-image:linear-gradient(to_bottom,black_48%,transparent_90%)] phone-down:max-w-[10ch] phone-down:text-left phone-down:text-[clamp(42px,13.5vw,64px)] phone-down:leading-[.98] phone-down:tracking-[-.04em] phone-down:[mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] landscape-phone:text-[36px]"
          >
            <span aria-hidden="true">
              {['Welcome', 'to Edvin'].map((line, lineIndex) => (
                <span key={line} className="whitespace-nowrap phone-down:block">
                  {lineIndex === 1 && <span className="phone-down:hidden"> </span>}
                  {line.split('').map((ch, i) => (
                    <span
                      key={i}
                      className="inline-block"
                      style={{
                        opacity: entered ? 1 : 0,
                        transform: entered || reduce ? 'none' : 'translateY(18px)',
                        transition: `opacity .6s ease-out ${reduce ? 0 : (i + lineIndex * 8) * (phone ? 35 : 80)}ms, transform .6s ease-out ${reduce ? 0 : (i + lineIndex * 8) * (phone ? 35 : 80)}ms`,
                      }}
                    >
                      {ch === ' ' ? ' ' : ch}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </h1>
        </motion.div>

        <motion.div
          data-journey-cue
          className="absolute inset-x-0 bottom-10 flex justify-center phone-down:hidden"
          style={{ opacity: oCue }}
          aria-hidden={phase !== 'welcome'}
        >
          <button
            type="button"
            aria-label="Scroll to start the journey"
            onClick={startJourney}
            disabled={phase !== 'welcome'}
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-navy disabled:pointer-events-none"
          >
            <ArrowDown
              size={34}
              className="animate-[cue_1.8s_ease-in-out_infinite] motion-reduce:animate-none"
              aria-hidden="true"
            />
          </button>
        </motion.div>

        <motion.div
          data-journey-intro
          className="absolute inset-x-0 bottom-0 hidden h-[34svh] flex-col justify-center px-6 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 phone-down:flex short-phone:h-[40svh] landscape-phone:h-[52svh] landscape-phone:w-1/2 landscape-phone:pb-4 landscape-phone:pt-2"
          style={{ opacity: oIntro }}
          aria-hidden={shipVisible}
        >
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.17em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-toyred" /> A little world of play
          </div>
          <h2 className="mt-3 font-display text-[32px] font-black leading-[1.02] tracking-[-.035em] short-phone:text-[28px] text-white">
            Small toys.
            <br />
            <span className="text-[#ffac89]">Big possibilities.</span>
          </h2>
          <p className="mt-2 max-w-[30ch] text-[13px] leading-5 text-white/75 short-phone:hidden">
            Follow a little adventure from the sea to the toy shelf.
          </p>
          <button
            type="button"
            aria-label="Scroll to start the journey"
            onClick={startJourney}
            disabled={shipVisible}
            className="mt-4 inline-flex min-h-11 w-fit cursor-pointer items-center gap-4 rounded-full bg-white px-5 font-display text-xs font-extrabold text-navy disabled:pointer-events-none"
          >
            Follow the journey <ArrowDown size={15} aria-hidden="true" />
          </button>
        </motion.div>

        <motion.div
          data-journey-ship
          className="pointer-events-none absolute inset-0 flex items-center justify-end px-6 sm:px-8 md:px-20 lg:px-32 phone-down:items-start phone-down:justify-start phone-down:px-6 phone-down:pt-[24svh] landscape-phone:pt-[25svh]"
          style={{ opacity: oShip }}
          aria-hidden={!shipVisible}
        >
          <div className="max-w-xl text-left">
            <Stagger visible={shipVisible}>
              <p className="mb-4 text-base tracking-wide text-white/70 sm:text-lg phone-down:mb-3 phone-down:text-[10px] phone-down:font-bold phone-down:uppercase phone-down:tracking-[.16em] phone-down:text-white/80">
                Edvin | The journey
              </p>
            </Stagger>
            <Stagger visible={shipVisible} delay={0.1}>
              <h2 className="mb-8 font-display text-[clamp(2rem,3.6vw,3.6rem)] font-black uppercase leading-[1.08] tracking-wide text-white phone-down:mb-5 phone-down:text-[clamp(27px,8vw,34px)] phone-down:tracking-[-.025em] phone-down:text-white">
                Packed with care,
                <br />
                shipped to play.
              </h2>
            </Stagger>
            <Stagger visible={shipVisible} delay={0.2}>
              <button
                type="button"
                aria-label="Follow the shipment to the port"
                disabled={!shipVisible}
                onClick={() => scrollToId('port')}
                className="pointer-events-auto inline-flex min-h-11 cursor-pointer items-center gap-4 rounded-full bg-white px-5 font-display text-xs font-extrabold text-navy transition-colors hover:bg-sun disabled:pointer-events-none phone-down:bg-white phone-down:text-navy"
              >
                Follow the shipment <ArrowRight size={17} aria-hidden="true" />
              </button>
            </Stagger>
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0 bg-white"
          style={{ opacity: fade }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
