import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowDown, ArrowRight, Pause, Play, RotateCcw } from '@/components/common/Icons';
import { scrollToId } from '@/utils/smoothScroll';
const StoreDiorama = lazy(() => import('@/components/home/StoreDiorama'));
const PHASES = ['The last stop.', 'A little door opens.', 'Come on in.', 'Let the play begin.'];
const phaseFor = (p) => (p < 0.09 ? 0 : p < 0.32 ? 1 : p < 0.85 ? 2 : 3);
export default function StoreScene() {
  const ref = useRef(null);
  const playback = useRef(null);
  const [reduce, setReduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useMotionValue(0);
  const [nearby, setNearby] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState(0);
  const meterRef = useRef(null);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: '1000px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setPlaying(false);
    setPaused(false);
    progress.set(reduce ? 1 : scrollYProgress.get());
    return () => playback.current?.stop();
  }, [reduce, progress, scrollYProgress]);
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    playback.current?.stop();
    setPlaying(false);
    setPaused(false);
    if (!reduce) progress.set(value);
  });
  useMotionValueEvent(progress, 'change', (value) => {
    setPhase(phaseFor(value));
    if (meterRef.current) meterRef.current.style.transform = `scaleX(${value})`;
  });
  const play = () => {
    if (reduce) {
      progress.set(progress.get() > 0.5 ? 0.3 : 1);
      return;
    }
    if (playing) {
      playback.current?.stop();
      setPlaying(false);
      setPaused(true);
      return;
    }
    if (!paused) progress.set(0);
    setPlaying(true);
    setPaused(false);
    playback.current = animate(progress, 1, {
      duration: (1 - progress.get()) * 7.5,
      ease: 'linear',
      onComplete: () => setPlaying(false),
    });
  };
  return (
    <section
      id="store"
      ref={ref}
      className={`store-section [--store-ink:#1d3045] [--store-accent:#d65e36] [--store-muted:#64717b] [background:#fff] text-[color:var(--store-ink)] [scroll-margin-top:0] relative h-[260svh] [&.store-reduced]:h-auto [&.store-reduced_.store-pin]:relative [&.store-reduced_.store-pin]:h-[min(880px,_100svh)] phone-down:h-[180svh] phone-down:[&.store-reduced]:h-auto phone-down:[&.store-reduced_.store-pin]:h-auto phone-down:[&.store-reduced_.store-pin]:min-h-0 landscape-phone:h-auto landscape-phone:[&_.store-pin]:relative landscape-phone:[&_.store-pin]:h-auto landscape-phone:[&_.store-pin]:min-h-0${reduce ? ' store-reduced' : ''}`}
      aria-labelledby="store-title"
    >
      <div className="store-pin sticky top-0 h-[100svh] min-h-[620px] overflow-hidden phone-down:min-h-[700px] short-desktop:min-h-[580px] short-phone:min-h-0 compact-desktop:min-h-0">
        <div className="store-stage w-[min(1400px,_calc(100%_-_112px))] ml-auto mr-auto flex flex-col h-full pt-[110px] pb-7 tablet-down:w-[calc(100%_-_64px)] phone-down:w-[calc(100%_-_40px)] phone-down:pt-[94px] phone-down:pb-[22px] tablet-landscape:pt-[100px] short-desktop:pt-[90px] short-desktop:pb-[18px] short-phone:pt-[88px] short-phone:pb-4 compact-desktop:pt-20 compact-desktop:pb-3">
          <div className="store-topline flex items-center justify-between gap-3 pb-[22px] border-b border-[#1d30451c] phone-down:pb-[17px] compact-desktop:pb-3">
            <span className="collection-eyebrow inline-flex items-center gap-[10px] text-[length:11px] font-semibold leading-[1.5] tracking-[.13em] uppercase phone-down:text-[length:9px] phone-down:gap-2">
              <span className="collection-dot w-[7px] h-[7px] flex-none rounded-full [background:#e4572e]" />{' '}
              Edvin | The store
            </span>
            <span className="store-chapter font-mono text-[10px] leading-[normal] tracking-[.1em] text-[color:var(--store-muted)] small-phone:hidden phone-down:text-[length:8px]">
              03 / THE LAST STOP
            </span>
          </div>
          <div className="store-composition grid grid-cols-[.85fr_1.4fr] items-center flex-1 min-h-0 gap-3 pt-6 pb-6 tablet-landscape:grid-cols-[1fr_1.4fr] phone-down:flex phone-down:flex-col phone-down:justify-center phone-down:items-stretch phone-down:gap-[6px] phone-down:pt-[23px] phone-down:pb-3 short-phone:pt-[14px] short-phone:pb-[9px] short-phone:gap-0 compact-desktop:pt-2 compact-desktop:pb-2 portrait-tablet:flex portrait-tablet:flex-col portrait-tablet:items-stretch portrait-tablet:justify-center portrait-tablet:gap-1">
            <div className="store-copy relative z-[1] [&_h2]:font-display [&_h2]:text-[length:clamp(42px,_4.7vw,_72px)] [&_h2]:font-black [&_h2]:leading-[1.02] [&_h2]:tracking-[-.045em] [&_h2_span]:text-[color:#e4572e] [&>p]:max-w-[365px] [&>p]:mt-[26px] [&>p]:text-[color:var(--store-muted)] [&>p]:text-[length:15px] [&>p]:leading-[1.8] tablet-landscape:[&_h2]:text-[length:clamp(36px,_4.4vw,_49px)] tablet-landscape:[&>p]:text-[length:14px] phone-down:[&_h2]:text-[length:clamp(35px,_9.3vw,_52px)] phone-down:[&>p]:mt-[15px] phone-down:[&>p]:max-w-[420px] phone-down:[&>p]:text-[length:13px] phone-down:[&>p]:leading-[1.65] short-desktop:[&_h2]:text-[length:44px] short-desktop:[&>p]:mt-5 short-phone:[&_h2]:text-[length:clamp(29px,_8vw,_38px)] short-phone:[&>p]:text-[length:12px] short-phone:[&>p]:mt-3 compact-desktop:[&>p]:hidden compact-desktop:[&_h2]:text-[length:34px] portrait-tablet:[&_h2]:text-[length:48px] portrait-tablet:[&>p]:max-w-[500px] portrait-tablet:[&>p]:mt-[18px]">
              <span className="store-kicker block mb-[22px] text-[color:var(--store-muted)] text-[length:13px] phone-down:text-[length:11px] phone-down:mb-[13px] short-desktop:mb-[15px] short-phone:hidden compact-desktop:hidden portrait-tablet:mb-[14px]">
                From the port. To the shelf.
              </span>
              <h2 id="store-title">
                Little doors.
                <br />
                Big <span>possibilities.</span>
              </h2>
              <p>
                Follow the journey inside. A familiar shop, a new favourite toy, and a little world of play.
              </p>
              <div className="store-actions flex flex-col items-start gap-[18px] mt-[30px] phone-down:flex-row phone-down:items-center phone-down:flex-wrap phone-down:gap-[4px_17px] phone-down:mt-[17px] phone-down:[&_.collection-button]:min-h-11 phone-down:[&_.collection-button]:pt-[10px] phone-down:[&_.collection-button]:pr-[17px] phone-down:[&_.collection-button]:pb-[10px] phone-down:[&_.collection-button]:pl-[17px] phone-down:[&_.collection-button]:text-[length:11px] phone-down:[&_.collection-button]:gap-[10px] phone-down:[&_.collection-text-link]:text-[length:10px] phone-down:[&_.collection-text-link]:gap-[7px] short-desktop:mt-5 short-desktop:gap-[10px] short-phone:mt-3 compact-desktop:mt-[15px] compact-desktop:gap-[3px] portrait-tablet:flex-row portrait-tablet:items-center portrait-tablet:gap-6 portrait-tablet:mt-[22px]">
                <button
                  type="button"
                  className="collection-button inline-flex justify-center items-center gap-[22px] min-h-[50px] pt-[13px] pr-[23px] pb-[13px] pl-[23px] border border-[#e4572e] rounded-[999px] [background:#e4572e] text-[color:#fff] text-[length:13px] font-bold cursor-pointer [transition:background_.2s,_color_.2s,_transform_.2s] hover:[background:#ce4722] hover:[transform:translateY(-2px)] phone-down:text-[length:12px] phone-down:min-h-[46px] phone-down:pt-3 phone-down:pr-5 phone-down:pb-3 phone-down:pl-5 phone-down:gap-4 motion-reduce:[transition:none] motion-reduce:hover:[transform:none]"
                  onClick={() => scrollToId('toys')}
                >
                  Meet the toys <ArrowDown size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="collection-text-link inline-flex items-center gap-4 min-h-11 text-[color:#1d3045] text-[length:12px] font-bold cursor-pointer [&_i]:[transition:transform_.2s] [&:hover_i]:[transform:translateX(4px)] phone-down:text-[length:11px] phone-down:gap-[10px] motion-reduce:[&_i]:[transition:none] motion-reduce:[&:hover_i]:[transform:none]"
                  onClick={() => scrollToId('retailers')}
                >
                  Become a retail partner <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="store-visual min-w-0 ml-[-18px] mr-[-25px] tablet-landscape:ml-[-15px] tablet-landscape:mr-[-15px] phone-down:ml-[-20px] phone-down:mr-[-20px] portrait-tablet:ml-[-32px] portrait-tablet:mr-[-32px]">
              <div className="store-diorama relative w-full h-[min(56svh,_38vw,_580px)] min-h-[300px] tablet-landscape:min-h-[280px] phone-down:h-[clamp(230px,_33svh,_330px)] phone-down:min-h-0 short-desktop:h-[320px] short-desktop:min-h-0 short-phone:h-[200px] compact-desktop:h-[210px] portrait-tablet:h-[clamp(300px,_40svh,_450px)] portrait-tablet:min-h-0">
                {nearby && (
                  <Suspense
                    fallback={
                      <div className="store-scene-loading flex h-full flex-col items-center justify-center gap-[14px] p-[30px] text-[color:var(--store-muted)] text-[length:13px]">
                        Getting the little shop ready…
                      </div>
                    }
                  >
                    <StoreDiorama progress={progress} />
                  </Suspense>
                )}
              </div>
              <div className="store-scene-controls flex items-center justify-between gap-3 mt-[-8px] mr-[30px] mb-0 ml-[30px] phone-down:mt-[-10px] phone-down:mr-5 phone-down:mb-0 phone-down:ml-5 short-phone:mt-[-18px] compact-desktop:mt-[-18px] portrait-tablet:mt-[-12px] portrait-tablet:mr-8 portrait-tablet:mb-0 portrait-tablet:ml-8">
                <span className="store-scene-caption inline-flex items-center gap-[9px] text-[length:12px] text-[color:var(--store-muted)] [&_.collection-dot]:w-[5px] [&_.collection-dot]:h-[5px] phone-down:text-[length:11px]">
                  <span className="collection-dot w-[7px] h-[7px] flex-none rounded-full [background:#e4572e]" />
                  {PHASES[phase]}
                </span>
                <button
                  type="button"
                  onClick={play}
                  aria-controls="store-diorama"
                  className="store-play-button inline-flex items-center justify-center gap-2 min-h-11 pl-[14px] pr-[14px] border border-[#dfe3e6] rounded-[999px] text-[color:var(--store-ink)] [background:#fff] text-[length:11px] font-semibold cursor-pointer [transition:background_.2s] hover:[background:#f1f3f3] phone-down:text-[length:10px] phone-down:pl-[11px] phone-down:pr-[11px]"
                >
                  {playing ? (
                    <Pause size={13} aria-hidden="true" />
                  ) : phase === 3 ? (
                    <RotateCcw size={13} aria-hidden="true" />
                  ) : (
                    <Play size={13} aria-hidden="true" />
                  )}
                  {reduce
                    ? 'Change scene'
                    : playing
                      ? 'Pause scene'
                      : paused
                        ? 'Resume scene'
                        : phase === 3
                          ? 'Replay scene'
                          : 'Play scene'}
                </button>
              </div>
              <p id="store-scene-description" className="sr-only">
                Scroll to open the toy shop door and follow a parent and child as they walk inside. Scroll
                back to reverse the scene, or use the play button to watch it.
              </p>
            </div>
          </div>
          <div className="store-route flex items-center justify-between gap-[30px] pt-6 border-t border-[#1d30451c] phone-down:gap-[18px] phone-down:pt-[17px] short-desktop:pt-4 short-phone:pt-3 compact-desktop:pt-[10px]">
            <span className="store-route-label inline-flex items-center gap-3 whitespace-nowrap font-mono text-[10px] leading-[normal] tracking-[.07em] text-[color:var(--store-muted)] phone-down:text-[length:8px] phone-down:gap-2">
              {reduce ? 'A LITTLE WORLD OF PLAY' : 'SCROLL TO STEP INSIDE'}
              <ArrowDown size={13} aria-hidden="true" />
            </span>
            <div
              className="store-story-progress flex-1 max-w-[360px] h-[2px] [background:#e9ecec] overflow-hidden [&>span]:block [&>span]:w-full [&>span]:h-full [&>span]:[transform:scaleX(0)] [&>span]:origin-left [&>span]:[background:var(--store-accent)] phone-down:max-w-[160px]"
              aria-hidden="true"
            >
              <span ref={meterRef} />
            </div>
            <span className="store-route-end text-[color:var(--store-muted)] text-[length:11px] phone-down:hidden">
              The start of something fun.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
