import { useEffect, useRef, useState } from 'react';
import { createStoreDiorama } from '@/components/home/store/createStoreDiorama';
export default function StoreDiorama({ progress }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const canvas = ref.current;
    let scene;
    try {
      scene = createStoreDiorama(canvas);
    } catch {
      setFailed(true);
      return;
    }
    let frame = 0;
    let visible = false;
    const draw = () => {
      frame = 0;
      if (visible) scene.draw(progress.get());
    };
    const requestDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) {
        scene.resize(width, height);
        requestDraw();
      }
    });
    resize.observe(canvas);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) requestDraw();
      },
      { rootMargin: '150px' },
    );
    observer.observe(canvas);
    const unsubscribe = progress.on('change', requestDraw);
    const lost = (event) => {
      event.preventDefault();
      setFailed(true);
    };
    canvas.addEventListener('webglcontextlost', lost);
    return () => {
      unsubscribe();
      resize.disconnect();
      observer.disconnect();
      cancelAnimationFrame(frame);
      canvas.removeEventListener('webglcontextlost', lost);
      scene.dispose();
    };
  }, [progress]);
  return (
    <>
      <canvas
        ref={ref}
        id="store-diorama"
        className="store-diorama-canvas block w-full h-full [&[hidden]]:hidden"
        role="img"
        aria-label="A miniature Edvin toy store. As you scroll, the door opens, a parent and child walk inside, and the door closes behind them."
        hidden={failed}
      />
      {failed && (
        <div className="store-scene-fallback flex h-full flex-col items-center justify-center gap-[14px] p-[30px] text-[color:var(--store-muted)] text-[length:13px] [&_span]:font-display [&_span]:font-black [&_span]:tracking-[.2em] [&_span]:text-[color:var(--store-ink)] [&_span]:text-[length:38px]">
          <span>EDVIN</span>
          <p>A little shop. A world of play.</p>
          <p>Visit our toy collection below.</p>
        </div>
      )}
    </>
  );
}
