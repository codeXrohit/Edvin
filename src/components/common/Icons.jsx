function createFontIcon(name, glyph, { brand = false, rotate = false } = {}) {
  function FontIcon({ size = 20, className = '', style, strokeWidth, absoluteStrokeWidth, ...props }) {
    return (
      <i
        {...props}
        aria-hidden={props['aria-hidden'] ?? true}
        className={`fa-ui ${brand ? 'fa-brands' : 'fa-solid'} fa-${name} inline-flex h-[1em] w-[1em] shrink-0 items-center justify-center text-[length:var(--icon-size)] not-italic normal-case leading-none tracking-normal [font-family:var(--fa-family,var(--fa-family-classic))] [font-weight:var(--fa-style,900)] ${className}`}
        style={{ '--icon-size': typeof size === 'number' ? `${size}px` : size, ...style }}
      >
        {rotate ? <span className="inline-flex rotate-45">{glyph}</span> : glyph}
      </i>
    );
  }
  FontIcon.displayName = name;
  return FontIcon;
}

export const ArrowDown = createFontIcon('arrow-down', '\uf063');
export const ArrowRight = createFontIcon('arrow-right', '\uf061');
export const ArrowUpRight = createFontIcon('arrow-up', '\uf062', { rotate: true });
export const Check = createFontIcon('check', '\uf00c');
export const CheckCircle2 = createFontIcon('circle-check', '\uf058');
export const ChevronDown = createFontIcon('chevron-down', '\uf078');
export const Heart = createFontIcon('heart', '\uf004');
export const LoaderCircle = createFontIcon('circle-notch', '\uf1ce');
export const Mail = createFontIcon('envelope', '\uf0e0');
export const MapPin = createFontIcon('location-dot', '\uf3c5');
export const Menu = createFontIcon('bars', '\uf0c9');
export const MessageCircle = createFontIcon('comment', '\uf075');
export const Minus = createFontIcon('minus', '\uf068');
export const Pause = createFontIcon('pause', '\uf04c');
export const Phone = createFontIcon('phone', '\uf095');
export const Play = createFontIcon('play', '\uf04b');
export const Plus = createFontIcon('plus', '\u002b');
export const RefreshCw = createFontIcon('arrows-rotate', '\uf021');
export const RotateCcw = createFontIcon('rotate-left', '\uf2ea');
export const Store = createFontIcon('store', '\uf54e');
export const X = createFontIcon('xmark', '\uf00d');
export const Asterisk = createFontIcon('asterisk', '\u002a');
export const Instagram = createFontIcon('instagram', '\uf16d', { brand: true });
export const Facebook = createFontIcon('facebook-f', '\uf39e', { brand: true });
export const Youtube = createFontIcon('youtube', '\uf167', { brand: true });
export const Pinterest = createFontIcon('pinterest-p', '\uf231', { brand: true });
