import truckImage from '@/assets/images/loder.png';

export default function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Edvin"
      className="fixed inset-0 z-[10002] grid place-items-center bg-[#fdfaf6] text-navy"
    >
      <div className="w-[min(200px,calc(100%_-_48px))] text-center">
        <div className="mx-auto w-full" aria-hidden="true">
          <div className="relative mx-auto aspect-[2102/496] w-[91.6667%] animate-truck-bob overflow-hidden motion-reduce:animate-none">
            <img
              src={truckImage}
              alt=""
              width={2172}
              height={724}
              loading="eager"
              decoding="async"
              className="absolute left-[-1.8078%] top-[-28.2258%] h-auto w-[103.3302%] max-w-none"
            />
          </div>
          <div className="relative -mt-px h-[11px] overflow-hidden rounded-[3px] bg-navy">
            <div className="absolute inset-x-0 top-[5px] h-px animate-truck-road bg-[repeating-linear-gradient(to_right,#fdfaf6_0_15px,transparent_15px_30px)] opacity-80 motion-reduce:animate-none" />
          </div>
        </div>
        <p className="mt-4 font-display text-[13px] font-extrabold tracking-tight">
          A little play is on its way.
        </p>
        <p className="mt-1 text-[10px] text-navy/60">Loading Edvin…</p>
      </div>
    </div>
  );
}
