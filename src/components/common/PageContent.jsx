import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageLoader from './PageLoader';
import { lockScroll, resetScroll, scrollToId } from '@/utils/smoothScroll';
export default function PageContent({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const previous = useRef(location);
  useEffect(() => {
    let cancelled = false;
    let timeout = 0;
    const main = document.getElementById('main-content');
    main?.setAttribute('aria-busy', 'true');
    lockScroll(false);
    resetScroll();
    const images = Array.from(document.querySelectorAll('main img:not([loading="lazy"]), header img'));
    const ready = Promise.allSettled([
      document.fonts.ready,
      ...images.map((image) => image.decode().catch(() => {})),
    ]);
    const deadline = new Promise((resolve) => {
      timeout = window.setTimeout(resolve, 8000);
    });
    Promise.race([ready, deadline]).then(() => {
      clearTimeout(timeout);
      if (cancelled) return;
      main?.removeAttribute('aria-busy');
      setLoading(false);
      main?.focus({ preventScroll: true });
    });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      main?.removeAttribute('aria-busy');
    };
  }, []);
  useEffect(() => {
    if (loading) return;
    const searchOnly = previous.current.search !== location.search && previous.current.hash === location.hash;
    previous.current = location;
    if (searchOnly) return;
    const frame = requestAnimationFrame(() => {
      if (location.hash) scrollToId(location.hash.slice(1));
      else resetScroll();
    });
    return () => cancelAnimationFrame(frame);
  }, [loading, location]);
  return (
    <>
      {children}
      {loading && <PageLoader />}
    </>
  );
}
