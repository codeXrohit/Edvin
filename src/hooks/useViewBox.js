import { useEffect, useState } from 'react';
/** viewBox 900 units tall at the bottom; wider screens see more width,
    tall screens get extra sky above. */
export function useViewBox(minW = 760, maxW = 1800) {
  const get = () => {
    const aspect = window.innerWidth / Math.max(1, window.innerHeight);
    const w = Math.min(maxW, Math.max(minW, 900 * aspect));
    return { w, h: w / aspect };
  };
  const [vb, setVb] = useState(get);
  useEffect(() => {
    const on = () => setVb(get());
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => {
      window.removeEventListener('resize', on);
      window.removeEventListener('orientationchange', on);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return vb;
}
