import { useEffect, useRef, useState } from 'react';
import { useMotionValue } from 'motion/react';
const clamp = (value) => Math.max(0, Math.min(1, value));
export function useVideoScrub(source, containerRef, options) {
  const viewportRef = options?.viewportRef;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollProgress = useMotionValue(0);
  const [canvasLive, setCanvasLive] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const progressSource = useRef(options?.getProgress);
  progressSource.current = options?.getProgress;
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const section = containerRef.current;
    if (!video || !canvas || !section) return;
    const context = canvas.getContext('2d');
    const frames = [];
    const cache = new Map();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(max-width: 767px)').matches;
    const supportsWorker = typeof Worker !== 'undefined' && typeof VideoDecoder !== 'undefined';
    const cacheLimit = mobile ? 3 : 4;
    const frameBudget = (mobile ? 4 : 8) * 1024 * 1024;
    let frameBytes = 0;
    let disposed = false;
    let nearby = false;
    let complete = false;
    let painted = false;
    let drawn = -1;
    let duration = 0;
    let current = 0;
    let lastTime = performance.now();
    let start = 0;
    let span = 1;
    let raf = 0;
    let worker = null;
    let workerFailed = false;
    let watchdog = 0;
    let primed = false;
    let priming = false;
    const measure = () => {
      drawn = -1;
      start = section.getBoundingClientRect().top + scrollY;
      span = Math.max(1, section.offsetHeight - (viewportRef?.current?.offsetHeight ?? innerHeight));
      schedule();
    };
    const closeCache = () => {
      for (const entry of cache.values()) entry.bitmap?.close();
      cache.clear();
    };
    const nearest = (time) => {
      const timestamp = time * 1e6;
      let low = 0;
      let high = frames.length - 1;
      while (low < high) {
        const middle = (low + high) >> 1;
        if (frames[middle].timestamp < timestamp) low = middle + 1;
        else high = middle;
      }
      return low > 0 &&
        Math.abs(frames[low - 1].timestamp - timestamp) <= Math.abs(frames[low].timestamp - timestamp)
        ? low - 1
        : low;
    };
    const warm = (index) => {
      for (let i = index - 1; i <= index + (mobile ? 1 : 2); i++) {
        if (i < 0 || i >= frames.length) continue;
        const existing = cache.get(i);
        if (existing) {
          cache.delete(i);
          cache.set(i, existing);
          continue;
        }
        const entry = { bitmap: null };
        cache.set(i, entry);
        createImageBitmap(frames[i].blob)
          .then((bitmap) => {
            if (!disposed && cache.get(i) === entry) {
              entry.bitmap = bitmap;
              schedule();
            } else bitmap.close();
          })
          .catch(() => {
            if (cache.get(i) === entry) cache.delete(i);
          });
      }
      while (cache.size > cacheLimit) {
        const oldest = cache.keys().next().value;
        cache.get(oldest)?.bitmap?.close();
        cache.delete(oldest);
      }
    };
    const showCanvas = (visible) => {
      if (painted === visible) return;
      painted = visible;
      setCanvasLive(visible);
      if (visible) setMediaFailed(false);
    };
    const tick = (time) => {
      raf = 0;
      if (!nearby || document.hidden || disposed) return;
      const progress = clamp(progressSource.current ? progressSource.current() : (scrollY - start) / span);
      scrollProgress.set(progress);
      const target = progress * duration;
      const elapsed = Math.min(0.1, Math.max(0.001, (time - lastTime) / 1000));
      lastTime = time;
      current = reduced.matches ? target : current + (target - current) * (1 - Math.exp(-elapsed * 8));
      if (Math.abs(target - current) < 0.002) current = target;
      const covered =
        frames.length > 0 && (complete || current * 1e6 <= frames[frames.length - 1].timestamp - 100000);
      if (covered && context) {
        const index = nearest(current);
        warm(index);
        const bitmap = cache.get(index)?.bitmap;
        if (bitmap) {
          if (index !== drawn) {
            const scale = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
            const width = bitmap.width * scale;
            const height = bitmap.height * scale;
            context.drawImage(
              bitmap,
              (canvas.width - width) / 2,
              (canvas.height - height) / 2,
              width,
              height,
            );
            drawn = index;
          }
          showCanvas(true);
        }
      } else showCanvas(false);
      if (
        !painted &&
        !priming &&
        (mobile || reduced.matches || !supportsWorker || (workerFailed && !complete)) &&
        video.readyState >= 1 &&
        duration > 0 &&
        !video.seeking &&
        Math.abs(video.currentTime - current) > 0.02
      )
        video.currentTime = Math.min(current, Math.max(0, duration - 0.04));
      if (Math.abs(target - current) >= 0.002) schedule();
    };
    function schedule() {
      if (!raf && nearby && !document.hidden && !disposed) raf = requestAnimationFrame(tick);
    }
    const stopWorker = () => {
      workerFailed = true;
      worker?.terminate();
      worker = null;
      clearTimeout(watchdog);
      if (nearby) video.preload = 'auto';
    };
    const syncWorker = () => {
      const paused = document.hidden || !nearby;
      worker?.postMessage({ type: 'visibility', paused });
      clearTimeout(watchdog);
      if (worker && !paused && !frames.length)
        watchdog = window.setTimeout(
          () => {
            if (!frames.length) stopWorker();
          },
          mobile ? 8000 : 60000,
        );
    };
    const startWorker = () => {
      if (
        worker ||
        workerFailed ||
        reduced.matches ||
        typeof Worker === 'undefined' ||
        typeof VideoDecoder === 'undefined'
      )
        return;
      try {
        worker = new Worker(new URL('../workers/video-scrub.worker.js', import.meta.url), { type: 'module' });
        worker.onmessage = (event) => {
          if (disposed) return;
          const message = event.data;
          if (message.type === 'metadata' && Number.isFinite(message.duration)) duration = message.duration;
          if (message.type === 'frame') {
            frameBytes += message.blob.size;
            if (frameBytes > frameBudget) {
              stopWorker();
              frames.length = 0;
              closeCache();
              showCanvas(false);
              schedule();
              return;
            }
            frames.push({ timestamp: message.timestamp, blob: message.blob });
            clearTimeout(watchdog);
          }
          if (message.type === 'complete') {
            complete = true;
            worker?.terminate();
            worker = null;
            workerFailed = true;
            clearTimeout(watchdog);
          }
          if (message.type === 'error') {
            stopWorker();
            frames.length = 0;
            closeCache();
            showCanvas(false);
          }
          schedule();
        };
        worker.onerror = () => {
          stopWorker();
          frames.length = 0;
          closeCache();
          showCanvas(false);
          schedule();
        };
        worker.postMessage({
          type: 'build',
          source,
          maxWidth: mobile ? 960 : 1440,
          fps: mobile ? 12 : 15,
          quality: mobile ? 0.72 : 0.76,
        });
        syncWorker();
      } catch {
        stopWorker();
      }
    };
    const metadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) duration = video.duration;
      schedule();
    };
    const failed = () => {
      if (!painted) setMediaFailed(true);
      schedule();
    };
    const loaded = () => {
      setMediaFailed(false);
      metadata();
    };
    const primeNative = () => {
      if (!nearby || painted || primed || priming) return;
      if (!mobile && supportsWorker && !workerFailed && !reduced.matches) return;
      video.preload = 'auto';
      if (video.networkState === 0) video.load();
      priming = true;
      Promise.resolve(video.play())
        .then(() => {
          if (disposed) return;
          video.pause();
          primed = true;
        })
        .catch(() => {})
        .finally(() => {
          priming = false;
          schedule();
        });
    };
    const online = () => {
      if (video.error) video.load();
      if (workerFailed && !complete) {
        workerFailed = false;
        frames.length = 0;
        frameBytes = 0;
        if (nearby) startWorker();
      }
    };
    const visibility = () => {
      syncWorker();
      cancelAnimationFrame(raf);
      raf = 0;
      schedule();
    };
    const preferences = () => {
      if (reduced.matches) {
        stopWorker();
        closeCache();
        frames.length = 0;
        frameBytes = 0;
        complete = false;
        showCanvas(false);
      } else {
        workerFailed = false;
        if (nearby) startWorker();
      }
      schedule();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        nearby = entry.isIntersecting;
        if (nearby) {
          if (reduced.matches || !supportsWorker || (workerFailed && !complete)) video.preload = 'auto';
          else if (mobile) video.preload = 'metadata';
          startWorker();
          lastTime = performance.now();
          schedule();
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
          closeCache();
        }
        syncWorker();
      },
      { rootMargin: '120% 0px' },
    );
    observer.observe(section);
    const resize = new ResizeObserver(measure);
    resize.observe(section);
    if (viewportRef?.current) resize.observe(viewportRef.current);
    measure();
    metadata();
    video.addEventListener('loadedmetadata', metadata);
    video.addEventListener('loadeddata', loaded);
    video.addEventListener('error', failed);
    video.addEventListener('seeked', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('online', online);
    window.addEventListener('touchstart', primeNative, { passive: true });
    window.addEventListener('pointerdown', primeNative, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', preferences);
    return () => {
      disposed = true;
      video.pause();
      cancelAnimationFrame(raf);
      clearTimeout(watchdog);
      worker?.terminate();
      closeCache();
      observer.disconnect();
      resize.disconnect();
      video.removeEventListener('loadedmetadata', metadata);
      video.removeEventListener('loadeddata', loaded);
      video.removeEventListener('error', failed);
      video.removeEventListener('seeked', schedule);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('online', online);
      window.removeEventListener('touchstart', primeNative);
      window.removeEventListener('pointerdown', primeNative);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', preferences);
    };
  }, [source, containerRef, scrollProgress, viewportRef]);
  return { videoRef, canvasRef, scrollProgress, canvasLive, mediaFailed };
}
