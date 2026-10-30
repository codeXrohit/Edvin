import { PRODUCTS } from '@/data/products';
import { PORT_VIDEO_SCROLL_SCREENS } from '@/data/journey';
import portPoster from '@/assets/images/port-poster.jpg';
import { useLayoutEffect, useRef } from 'react';
import { scrollToId } from '@/utils/smoothScroll';
import { useVideoScrub } from '@/hooks/useVideoScrub';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobilePort from './MobilePort';
/* The handling clip: a reach-stacker lifts a container and loads it onto
   a truck, then the camera pulls back onto a black band. The vehicles are
   only ever in the clip. The clip is never played, only scrubbed. */
const CLIP_1080 =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/409763c0-95f4-49d3-a601-dc564d55072b.mp4';
const CLIP_720 =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/b3718419-7a0a-478d-bfb0-0ff8bef7f3f7.mp4';
const POSTER = portPoster;
const A = PORT_VIDEO_SCROLL_SCREENS;
const FINAL_EDGE = 0.448; // band edge in the last frame, share of clip height
export const PORT_CARDS = [
  {
    img: PRODUCTS.find((product) => product.id === 'blocks').image,
    title: ['Building', 'blocks'],
    text: 'Colourful wooden shapes for small hands, tall towers and big imaginations.',
  },
  {
    img: PRODUCTS.find((product) => product.id === 'bear').image,
    title: ['Soft', 'toys'],
    text: 'Plush friends with soft fabric and stitched faces, made for naps and long car rides.',
  },
  {
    img: PRODUCTS.find((product) => product.id === 'racer').image,
    title: ['Toy', 'vehicles'],
    text: 'Little cars and racers with rolling wheels for every imaginary road.',
  },
  {
    img: PRODUCTS.find((product) => product.id === 'train').image,
    title: ['Train', 'sets'],
    text: 'Engines and carriages that link together, so the line grows with every set.',
  },
  {
    img: PRODUCTS.find((product) => product.id === 'puzzle').image,
    title: ['Puzzles', 'and games'],
    text: 'Chunky puzzles and table games for quiet afternoons and family evenings.',
  },
];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export default function PortServices() {
  const phone = useMediaQuery('(max-width: 767px)');
  return phone ? (
    <MobilePort source={CLIP_720} poster={POSTER} cards={PORT_CARDS} />
  ) : (
    <DesktopPortServices />
  );
}
function DesktopPortServices() {
  const small = useMediaQuery('(max-width: 900px)');
  const source = small ? CLIP_720 : CLIP_1080;
  const trackRef = useRef(null);
  const sceneRef = useRef(null);
  const giantRef = useRef(null);
  const stripRef = useRef(null);
  const speedRef = useRef(null);
  const progressRef = useRef(0);
  // Scrubbing goes through the same decode-to-canvas frame bank as the cloud
  // intro, so the crane clip no longer stutters on fast or reversed scroll.
  const { videoRef, canvasRef, canvasLive } = useVideoScrub(source, trackRef, {
    getProgress: () => progressRef.current,
  });
  useLayoutEffect(() => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const giant = giantRef.current;
    const strip = stripRef.current;
    const speed = speedRef.current;
    const cards = Array.from(strip.querySelectorAll('.port-card'));
    let disposed = false;
    const L = {
      vw: 0,
      vh: 0,
      B: 1,
      stripW: 0,
      lettersW: 0,
      fontPx: 0,
      start: 0,
      height: 0,
      cardOffsets: [],
    };
    const layout = () => {
      if (disposed) return;
      const vw = document.documentElement.clientWidth;
      const vh = scene.clientHeight || window.innerHeight;
      const phone = vw < 768 || vw <= vh;
      const u = phone ? Math.min(vw / 430, 1.4) : Math.min(vw / 1440, vh / 960);
      scene.style.setProperty('--u', `${u}px`);
      scene.classList.toggle('is-phone', phone);
      let w, h, left, top;
      if (!phone) {
        const s = Math.max(vw / 1920, vh / 1080);
        w = 1920 * s;
        h = 1080 * s;
        left = (vw - w) / 2;
        top = (vh - h) / 2;
      } else {
        w = vw * 1.55;
        h = (w * 9) / 16;
        left = vw / 2 - 0.4 * w;
        top = 0.36 * vh - FINAL_EDGE * h;
      }
      const frame = { width: `${w}px`, height: `${h}px`, left: `${left}px`, top: `${top}px` };
      Object.assign(video.style, frame);
      Object.assign(canvas.style, frame);
      const edge = top + FINAL_EDGE * h;
      scene.style.setProperty('--edge-px', `${edge}px`);
      // white above the final band edge, #111 below: only visible where the clip doesn't cover
      scene.style.setProperty('--bg-line', `${edge}px`);
      L.start = track.getBoundingClientRect().top + window.scrollY;
      L.cardOffsets = cards.map((card) => card.offsetLeft);
      L.vw = vw;
      L.vh = vh;
      L.stripW = strip.scrollWidth;
      L.lettersW = giant.scrollWidth;
      L.fontPx = parseFloat(getComputedStyle(giant).fontSize) || 0;
      L.B = ((L.stripW + 0.45 * vw) / vw) * 1.1;
      L.height = (1 + A + L.B) * vh;
      track.style.height = `${L.height}px`;
      schedule();
    };
    let lastY = window.scrollY;
    let lastT = performance.now();
    let smoothSpeed = 0;
    let shownSpeed = -1;
    let ph = -1;
    let raf = 0;
    const tick = (now) => {
      raf = 0;
      const local = window.scrollY - L.start;
      // only work while the section is near the viewport
      if (document.hidden || local > L.height + L.vh || local < -L.vh * 2) {
        lastY = window.scrollY;
        lastT = now;
        return;
      }
      const { vw, vh } = L;
      const q = clamp(local / (A * vh));
      progressRef.current = q;
      // the caption appears early, as soon as the crane is clearly lifting,
      // well before the clip settles at the end
      scene.style.setProperty('--cap', String(clamp((q - 0.06) / 0.1)));
      const settled = q >= 0.94 ? 1 : 0;
      if (settled !== ph) {
        ph = settled;
        scene.style.setProperty('--ph', String(ph));
        scene.dataset.settled = String(ph);
      }
      const r = clamp((local - A * vh) / (L.B * vh));
      const stripX = vw - r * (L.stripW + 0.45 * vw);
      strip.style.transform = `translate3d(${stripX}px,0,0)`;
      giant.style.transform = `translate3d(${vw - r * (L.lettersW + vw)}px,${L.fontPx * 0.07}px,0)`;
      for (let index = 0; index < cards.length; index++) {
        const c = cards[index];
        const left = stripX + L.cardOffsets[index];
        const s = clamp((0.98 - left / vw) / 0.3, -0.4, 1.6) * 100;
        c.style.setProperty('--s', `${s}%`);
        c.style.setProperty('--s-num', String(s));
      }
      const y = window.scrollY;
      const dt = Math.max(1, now - lastT);
      const v = ((Math.abs(y - lastY) / dt) * 1000) / 32;
      smoothSpeed += (v - smoothSpeed) * 0.12;
      lastY = y;
      lastT = now;
      const n = Math.min(99, Math.round(smoothSpeed));
      if (n !== shownSpeed) {
        shownSpeed = n;
        speed.textContent = String(n).padStart(2, '0');
      }
      if (smoothSpeed > 0.5) schedule();
    };
    function schedule() {
      if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
    }
    layout();
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', layout);
    document.fonts?.ready.then(layout);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', layout);
      window.removeEventListener('orientationchange', layout);
    };
    // videoRef/canvasRef are stable across renders, so this still only runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section
      id="port"
      ref={trackRef}
      className="port-track relative [background:#fff]"
      aria-label="At the port, and the toys we bring"
    >
      <div
        ref={sceneRef}
        className="port-scene [--u:1px] [--edge-px:60vh] [--bg-line:60%] [--ph:0] sticky top-0 h-[100lvh] overflow-hidden bg-[linear-gradient(#fff_0_var(--bg-line),_#111_var(--bg-line))] isolate [&.is-phone_.port-caption]:left-[calc(22_*_var(--u))] [&.is-phone_.port-caption]:right-[calc(22_*_var(--u))] [&.is-phone_.port-caption]:max-w-none [&.is-phone_.port-caption]:min-w-0 [&.is-phone_.port-caption_h2]:text-[length:calc(26_*_var(--u))] [&[data-settled='1']_.port-pill]:pointer-events-auto [&.is-phone_.port-giant]:text-[length:calc(180_*_var(--u))] [&.is-phone_.port-speed]:text-[length:11px] [&.is-phone_.port-speed]:left-5 [&.is-phone_.port-speed]:top-[22px] [&.is-phone_.port-strip]:top-[calc(44_*_var(--u))] [&.is-phone_.port-strip]:gap-[calc(56_*_var(--u))] [&.is-phone_.port-strip]:pl-[22px] [&.is-phone_.port-lead]:flex-col [&.is-phone_.port-lead]:gap-[calc(20_*_var(--u))] [&.is-phone_.port-lead_h2]:text-[length:calc(46_*_var(--u))] [&.is-phone_.port-paras]:w-[calc(300_*_var(--u))] [&.is-phone_.port-paras]:text-[length:max(12px,_calc(13_*_var(--u)))] [&.is-phone_.port-card]:w-[calc(250_*_var(--u))] [&.is-phone_.port-card_p]:text-[length:max(12px,_calc(13_*_var(--u)))]"
      >
        <video
          ref={videoRef}
          src={source}
          className="port-video absolute block max-w-none"
          poster={POSTER}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
        />
        <canvas
          ref={canvasRef}
          width={small ? 960 : 1600}
          height={small ? 540 : 900}
          className={`port-video absolute block max-w-none transition-opacity duration-300 ${canvasLive ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
        />

        <div
          ref={giantRef}
          className="port-giant absolute left-0 bottom-[calc(100%_-_var(--edge-px))] font-display font-black text-[length:calc(330_*_var(--u))] leading-[0.8] tracking-[-0.02em] text-[color:#e9e9e9] whitespace-nowrap mix-blend-darken pointer-events-none [will-change:transform]"
          aria-hidden="true"
        >
          OUR TOYS
        </div>

        <div
          className="port-speed absolute left-[calc(26_*_var(--u))] top-[calc(52_*_var(--u))] font-mono text-[length:max(11px,_calc(10.5_*_var(--u)))] tracking-[0.06em] text-[color:#111] opacity-[var(--ph)] [transition:opacity_0.5s_ease]"
          aria-hidden="true"
        >
          <span ref={speedRef}>00</span> KM/H
        </div>

        <div className="port-caption absolute left-[calc(26_*_var(--u))] top-[clamp(84px,_9vh,_140px)] max-w-[calc(380_*_var(--u))] min-w-[220px] text-left opacity-[var(--cap,_0)] [transform:translateY(calc((1_-_var(--cap,_0))_*_16px))] [transition:opacity_0.5s_ease,_transform_0.5s_cubic-bezier(0.16,_1,_0.3,_1)] pointer-events-none [&_h2]:font-display [&_h2]:font-extrabold [&_h2]:text-[length:calc(20_*_var(--u))] [&_h2]:leading-[1.2] [&_h2]:uppercase [&_h2]:text-[color:#1d3045] [&_h2]:tracking-[-0.005em] [&_h2]:m-0">
          <p className="port-caption-eyebrow text-[length:max(11px,_calc(10.5_*_var(--u)))] tracking-[0.12em] uppercase text-[color:rgba(29,_48,_69,_0.5)] mt-0 mr-0 mb-[calc(8_*_var(--u))] ml-0">
            Edvin | The port
          </p>
          <h2>Unloaded with care.</h2>
        </div>

        <div className="port-band absolute left-0 right-0 top-[var(--edge-px)] bottom-0 overflow-hidden">
          <div
            ref={stripRef}
            className="port-strip absolute left-0 top-[calc(76_*_var(--u))] flex items-start gap-[calc(120_*_var(--u))] text-[color:#fff] [will-change:transform]"
          >
            <div className="port-lead flex gap-[calc(64_*_var(--u))] flex-none [&_h2]:font-display [&_h2]:font-black [&_h2]:text-[length:calc(64_*_var(--u))] [&_h2]:leading-[0.98] [&_h2]:uppercase [&_h2]:whitespace-nowrap [&_h2]:tracking-[-0.01em] [&_h2_.accent]:text-[color:#e4572e]">
              <h2>
                Everything a
                <br />
                toy shelf needs.
                <br />
                <span className="accent">In one Edvin box.</span>
              </h2>
              <div className="port-paras w-[calc(250_*_var(--u))] grid gap-[calc(12_*_var(--u))] text-[length:max(12px,_calc(12_*_var(--u)))] leading-[1.55] text-[color:rgba(255,_255,_255,_0.62)]">
                <p>
                  From the factory floor to the shop shelf, every Edvin toy travels in a sealed container
                  across the sea.
                </p>
                <p>
                  One team packs, ships and delivers, so a store deals with one partner from the port to the
                  shelf.
                </p>
              </div>
            </div>
            <div className="port-cards flex flex-none">
              {PORT_CARDS.map((c) => (
                <article
                  key={c.img}
                  className="port-card [--s:-40%] w-[calc(270_*_var(--u))] pt-0 pr-[calc(30_*_var(--u))] pb-0 pl-[calc(30_*_var(--u))] border-l border-[rgba(255,_255,_255,_0.12)] flex-none first:border-l-0 [&_img]:block [&_img]:w-full [&_img]:[aspect-ratio:4_/_3] [&_img]:object-cover [&_img]:rounded-[calc(12_*_var(--u))] [&_img]:mb-[calc(20_*_var(--u))] [&_img]:opacity-[clamp(0,_calc((var(--s-num,_0)_+_20)_/_60),_1)] [&_h3]:font-display [&_h3]:font-black [&_h3]:text-[length:calc(26_*_var(--u))] [&_h3]:leading-[1] [&_h3]:uppercase [&_h3]:mb-[calc(12_*_var(--u))] [&_p]:text-[length:max(12px,_calc(12.4_*_var(--u)))] [&_p]:leading-[1.55]"
                >
                  <img src={c.img} alt="" loading="lazy" />
                  <h3>
                    {c.title[0]}
                    <br />
                    {c.title[1]}
                  </h3>
                  <p>{c.text}</p>
                </article>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="port-pill absolute left-1/2 bottom-[calc(36_*_var(--u))] [transform:translate(-50%,_calc((1_-_var(--ph))_*_24px))] opacity-[var(--ph)] pointer-events-none [transition:opacity_0.6s_ease,_transform_0.6s_cubic-bezier(0.16,_1,_0.3,_1)] border border-[rgba(255,_255,_255,_0.55)] rounded-[999px] pt-[calc(10_*_var(--u))] pr-[calc(22_*_var(--u))] pb-[calc(10_*_var(--u))] pl-[calc(22_*_var(--u))] text-[color:#fff] font-medium text-[length:max(11px,_calc(10_*_var(--u)))] tracking-[0.1em] uppercase whitespace-nowrap cursor-pointer [background:transparent] hover:border-[#fff]"
            onClick={() => scrollToId('toys')}
          >
            Our toys
          </button>
        </div>
      </div>
    </section>
  );
}
