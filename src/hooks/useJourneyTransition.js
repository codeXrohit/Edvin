import { useCallback, useEffect, useRef } from 'react';
import { scrollToPosition } from '@/utils/smoothScroll';

const CLOUD_START = 0.42;
const JOURNEY_STOP = 0.86;
const GESTURE_IDLE_MS = 180;
const DOWN_KEYS = ['ArrowDown', 'PageDown', ' '];
const UP_KEYS = ['ArrowUp', 'PageUp', 'Home'];
const INTERACTIVE =
  'input, textarea, select, [contenteditable="true"], dialog, [role="dialog"], [data-lenis-prevent]';

export function useJourneyTransition(containerRef, progress, viewportRef) {
  const startRef = useRef(() => {});

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let previous = progress.get();
    let armed = true;
    let running = false;
    let settling = false;
    let lastDownInput = -Infinity;
    let touchY = 0;
    let releaseTimer = 0;
    let cancelScroll = null;

    const release = () => {
      clearTimeout(releaseTimer);
      settling = false;
    };
    const cancel = () => {
      cancelScroll?.();
      cancelScroll = null;
      running = false;
      lastDownInput = -Infinity;
      release();
    };
    const releaseAfterGesture = () => {
      clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(release, GESTURE_IDLE_MS);
    };
    const start = () => {
      if (running || document.body.style.overflow === 'hidden') return;
      const startY = section.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(
        1,
        section.offsetHeight - (viewportRef?.current?.offsetHeight ?? window.innerHeight),
      );
      const target = startY + span * JOURNEY_STOP;
      if (window.scrollY >= target) return;
      armed = false;
      running = true;
      release();
      cancelScroll = scrollToPosition(target, {
        onComplete: () => {
          running = false;
          cancelScroll = null;
          settling = performance.now() - lastDownInput < GESTURE_IDLE_MS;
          if (settling) releaseAfterGesture();
        },
      });
    };
    startRef.current = start;

    const unsubscribe = progress.on('change', (value) => {
      const crossedClouds = previous < CLOUD_START && value >= CLOUD_START;
      previous = value;
      if (!running && value < 0.025) armed = true;
      if (
        armed &&
        crossedClouds &&
        value < JOURNEY_STOP &&
        performance.now() - lastDownInput < 900 &&
        !reduced.matches
      )
        start();
    });
    const forwardInput = (event, delta) => {
      if (event.target.closest?.(INTERACTIVE) || event.ctrlKey) return;
      if (delta < 0) {
        lastDownInput = -Infinity;
        if (running || settling) cancel();
        return;
      }
      if (delta === 0) return;
      if (settling && performance.now() - lastDownInput >= GESTURE_IDLE_MS) release();
      lastDownInput = performance.now();
      if (!running && !settling) return;
      event.preventDefault();
      event.stopPropagation();
      if (settling) releaseAfterGesture();
    };
    const wheel = (event) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      forwardInput(event, event.deltaY);
    };
    const keydown = (event) => {
      if (event.target.closest?.(INTERACTIVE)) return;
      if (event.key === 'Escape' || event.key === 'Tab') cancel();
      if (UP_KEYS.includes(event.key) || (event.key === ' ' && event.shiftKey)) forwardInput(event, -1);
      else if (DOWN_KEYS.includes(event.key)) forwardInput(event, 1);
      else if (event.key === 'End') cancel();
    };
    const touchstart = (event) => {
      touchY = event.touches[0]?.clientY ?? 0;
      if (running || settling) cancel();
    };
    const touchmove = (event) => {
      if (event.touches.length !== 1) return;
      const nextY = event.touches[0].clientY;
      forwardInput(event, touchY - nextY);
      touchY = nextY;
    };
    const pointerdown = (event) => {
      if (event.target.closest?.('a, button')) cancel();
    };
    const preferences = () => {
      if (reduced.matches) cancel();
    };
    const visibility = () => {
      if (document.hidden) cancel();
    };

    window.addEventListener('wheel', wheel, { capture: true, passive: false });
    window.addEventListener('keydown', keydown, true);
    window.addEventListener('touchstart', touchstart, { passive: true });
    window.addEventListener('touchmove', touchmove, { capture: true, passive: false });
    window.addEventListener('pointerdown', pointerdown, true);
    window.addEventListener('click', pointerdown, true);
    window.addEventListener('resize', cancel);
    window.addEventListener('popstate', cancel);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', preferences);
    return () => {
      cancel();
      startRef.current = () => {};
      unsubscribe();
      window.removeEventListener('wheel', wheel, true);
      window.removeEventListener('keydown', keydown, true);
      window.removeEventListener('touchstart', touchstart);
      window.removeEventListener('touchmove', touchmove, true);
      window.removeEventListener('pointerdown', pointerdown, true);
      window.removeEventListener('click', pointerdown, true);
      window.removeEventListener('resize', cancel);
      window.removeEventListener('popstate', cancel);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', preferences);
    };
  }, [containerRef, progress, viewportRef]);

  return useCallback(() => startRef.current(), []);
}
