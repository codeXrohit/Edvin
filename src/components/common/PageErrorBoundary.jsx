import { Component, createRef } from 'react';
import { RefreshCw, ArrowRight } from '@/components/common/Icons';
import { lockScroll } from '@/utils/smoothScroll';

export default class PageErrorBoundary extends Component {
  state = { failed: false };
  fallbackRef = createRef();

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    lockScroll(false);
    this.fallbackRef.current?.focus({ preventScroll: true });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section
        ref={this.fallbackRef}
        tabIndex={-1}
        role="alert"
        className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-start justify-center px-6 pb-16 pt-32 text-navy focus:outline-none sm:px-10"
      >
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#bd4323]">A little pause</p>
        <h1 className="mt-5 font-display text-[clamp(38px,6vw,64px)] font-black leading-[1.05] tracking-tight">
          Let’s give that
          <br />
          another try.
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-navy/70">
          This page couldn’t finish loading. Check your connection, then reload to pick up where you left off.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-7 inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full bg-navy px-6 font-display text-sm font-extrabold text-white hover:bg-[#bd4323]"
        >
          Reload this page <RefreshCw size={16} aria-hidden="true" />
        </button>
        <a
          href="/"
          className="mt-3 inline-flex min-h-11 items-center gap-3 text-sm font-bold hover:text-[#bd4323]"
        >
          Back to home <ArrowRight size={16} aria-hidden="true" />
        </a>
      </section>
    );
  }
}
