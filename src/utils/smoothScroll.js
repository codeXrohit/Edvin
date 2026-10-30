import Lenis from 'lenis';
let lenis = null;
let scrollLockStyles = null;
export const BACK_TO_TOP_DURATION = 3.6;
/** Smooth, inertia-based page scroll. Skipped for people who prefer reduced motion. */
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
  let raf = 0;
  const loop = (t) => {
    lenis?.raf(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  lenis?.resize();
  if (lenis) lenis.scrollTo(el, { offset: -8, duration: 1.6 });
  else
    el.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
}
export function scrollToPosition(target, { duration = 2.8, onComplete } = {}) {
  const instance = lenis;
  if (!instance || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: target, behavior: 'instant' });
    onComplete?.();
    return () => {};
  }
  let active = true;
  instance.resize();
  instance.scrollTo(target, {
    duration,
    lerp: 0,
    lock: true,
    easing: (t) => (1 - Math.cos(Math.PI * t)) / 2,
    onComplete: () => {
      active = false;
      onComplete?.();
    },
  });
  return () => {
    if (!active || instance !== lenis) return;
    active = false;
    instance.scrollTo(window.scrollY, { immediate: true, force: true });
  };
}
export function resetScroll() {
  lenis?.resize();
  lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}
export function scrollToTop() {
  if (lenis)
    lenis.scrollTo(0, {
      duration: BACK_TO_TOP_DURATION,
      easing: (t) => (1 - Math.cos(Math.PI * t)) / 2,
    });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
export function lockScroll(locked) {
  const root = document.documentElement;
  const body = document.body;
  if (locked) {
    if (!scrollLockStyles) {
      const gap = Math.max(0, window.innerWidth - root.getBoundingClientRect().width);
      const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
      scrollLockStyles = {
        rootOverflow: root.style.overflow,
        gutter: root.style.scrollbarGutter,
        compensation: root.style.getPropertyValue('--scrollbar-compensation'),
        bodyOverflow: body.style.overflow,
        bodyPadding: body.style.paddingRight,
      };
      root.style.overflow = 'hidden';
      root.style.scrollbarGutter = 'auto';
      root.style.setProperty('--scrollbar-compensation', `${gap}px`);
      body.style.overflow = 'hidden';
      if (gap) body.style.paddingRight = `${padding + gap}px`;
    }
    lenis?.stop();
    return;
  }
  if (scrollLockStyles) {
    root.style.overflow = scrollLockStyles.rootOverflow;
    root.style.scrollbarGutter = scrollLockStyles.gutter;
    if (scrollLockStyles.compensation)
      root.style.setProperty('--scrollbar-compensation', scrollLockStyles.compensation);
    else root.style.removeProperty('--scrollbar-compensation');
    body.style.overflow = scrollLockStyles.bodyOverflow;
    body.style.paddingRight = scrollLockStyles.bodyPadding;
    scrollLockStyles = null;
  }
  lenis?.start();
}
