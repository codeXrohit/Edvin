import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from '@/components/common/Icons';
import { motion } from 'motion/react';
import { useVideoScrub } from '@/hooks/useVideoScrub';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { scrollToId } from '@/utils/smoothScroll';
import { MOBILE_PORT_VIDEO_SCROLL_SCREENS } from '@/data/journey';

export default function MobilePort({ source, poster, cards }) {
  const track = useRef(null);
  const viewportRef = useRef(null);
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)');
  const landscape = useMediaQuery('(max-height: 500px)');
  const flat = reduce || landscape;
  const { videoRef, canvasRef, canvasLive, scrollProgress, mediaFailed } = useVideoScrub(source, track, {
    viewportRef,
  });
  return (
    <section
      id="port"
      aria-label="At the port, and the toys we bring"
      className="scroll-mt-0 bg-[#f6f2eb] text-navy"
    >
      <div
        ref={track}
        className="relative"
        style={flat ? undefined : { height: `${(1 + MOBILE_PORT_VIDEO_SCROLL_SCREENS) * 100}svh` }}
      >
        <div
          ref={viewportRef}
          className={`${flat ? 'relative' : 'sticky top-0'} isolate flex min-h-[100svh] flex-col overflow-hidden bg-white`}
        >
          <div className="px-5 pb-6 pt-24 short-phone:pb-4 short-phone:pt-[88px]">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.16em] text-navy/65">
              <span>02 / At the port</span>
              <span className="h-1.5 w-1.5 rounded-full bg-toyred" aria-hidden="true" />
            </div>
            <h2 className="mt-3 font-display text-[clamp(32px,9vw,40px)] font-black leading-[.98] tracking-[-.04em] text-navy short-phone:mt-2">
              A little closer
              <br />
              <span className="text-toyred">to play.</span>
            </h2>
          </div>
          <div className="relative my-auto aspect-[4/3] w-full shrink-0 overflow-hidden">
            <img
              src={poster}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <video
              ref={videoRef}
              src={source}
              poster={poster}
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover ${mediaFailed ? 'invisible' : ''}`}
            />
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${canvasLive && !mediaFailed ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          <div className="px-5 pt-5 text-navy short-phone:pt-4">
            <p className="font-display text-[23px] font-extrabold leading-tight tracking-tight">
              Unloaded with care.
            </p>
            <div className="mt-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[.14em] text-navy/65 short-phone:mt-3">
              <span>The sea</span>
              <span className="relative h-px flex-1 overflow-hidden bg-navy/20">
                <motion.span
                  className="absolute inset-0 origin-left bg-toyred"
                  style={{ scaleX: scrollProgress }}
                />
              </span>
              <span>The toy shelf</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-5 px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 short-phone:pb-[max(20px,env(safe-area-inset-bottom))] short-phone:pt-4">
            <p className="max-w-[24ch] text-xs leading-5 text-navy/65">
              Packed, shipped and ready for a new adventure.
            </p>
            <button
              type="button"
              aria-label="Continue to the toy store"
              onClick={() => scrollToId('store')}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy text-white transition-colors hover:bg-toyred"
            >
              <ArrowDown size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div className="pb-12 pt-10">
        <div className="px-5">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8c4934]">
            Inside an Edvin box
          </p>
          <h2 className="mt-3 max-w-[15ch] font-display text-[32px] font-black leading-[1.05] tracking-tight">
            For every kind
            <br />
            of little adventure.
          </h2>
        </div>
        <ul
          className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-4 [scroll-padding-inline:20px]"
          aria-label="Explore toy collections"
        >
          {cards.map((card) => (
            <li key={card.img} className="w-[72vw] max-w-[280px] shrink-0 snap-start">
              <Link
                to="/products"
                className="group block overflow-hidden rounded-[20px] border border-navy/10 bg-white"
              >
                <div className="overflow-hidden bg-[#f3f3f0]">
                  <img
                    src={card.img}
                    alt={card.title.join(' ')}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="aspect-[5/4] w-full object-cover mix-blend-multiply transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
                <div className="flex min-h-[74px] items-center justify-between gap-4 px-5 py-4">
                  <h3 className="font-display text-xl font-extrabold tracking-tight">
                    {card.title.join(' ')}
                  </h3>
                  <ArrowRight size={18} aria-hidden="true" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/products" className="ml-5 mt-2 inline-flex min-h-11 items-center gap-4 text-sm font-bold">
          Explore all toys <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
