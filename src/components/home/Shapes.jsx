/* Soft, render-like shapes used by the store scene.
   Flat SVG, but shaded with gradients and contact shadows so they read
   as objects in a white studio rather than as clip art. */
export function SceneDefs() {
  return (
    <defs>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <filter id="softer" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="22" />
      </filter>
      <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2A4560" />
        <stop offset="1" stopColor="#152536" />
      </linearGradient>
      <linearGradient id="keel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E8603A" />
        <stop offset="1" stopColor="#B83F1E" />
      </linearGradient>
      <linearGradient id="cabin" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#E3E9EE" />
      </linearGradient>
      <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
        <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="1" stopColor="#000000" stopOpacity="0.18" />
      </linearGradient>
      {[
        ['ballRed', '#FF8A6B', '#E4572E', '#9E3216'],
        ['ballSun', '#FFE29A', '#F6B93B', '#C2861A'],
        ['ballTeal', '#7FD8D2', '#1F9E9A', '#0F6763'],
        ['ballBlue', '#A9D3F7', '#5DA9E9', '#2D74B5'],
      ].map(([id, a, b, c]) => (
        <radialGradient key={id} id={id} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={a} />
          <stop offset="0.55" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </radialGradient>
      ))}
    </defs>
  );
}
const SHADES = {
  red: ['#F07A57', '#E4572E', '#B9431F'],
  sun: ['#FFD56E', '#F6B93B', '#CF9422'],
  teal: ['#4CC0BA', '#1F9E9A', '#147570'],
  leaf: ['#62C38E', '#3BA272', '#2A7A54'],
  blue: ['#8EC6F2', '#5DA9E9', '#3D86C7'],
  cream: ['#FFFFFF', '#F5EEE6', '#E2D6C8'],
};
/** Isometric cube centred on (0,0) top vertex at y=-s. */
export function Cube({ s = 60, color = 'red' }) {
  const [top, left, right] = SHADES[color];
  const h = s * 0.58;
  return (
    <g>
      <path d={`M0 ${-s} L${s} ${-s + h} L0 ${-s + 2 * h} L${-s} ${-s + h} Z`} fill={top} />
      <path d={`M${-s} ${-s + h} L0 ${-s + 2 * h} L0 ${s * 1.16} L${-s} ${s * 0.58} Z`} fill={left} />
      <path d={`M${s} ${-s + h} L0 ${-s + 2 * h} L0 ${s * 1.16} L${s} ${s * 0.58} Z`} fill={right} />
    </g>
  );
}
export function Ball({ r = 50, fill = 'ballRed' }) {
  return (
    <g>
      <circle r={r} fill={`url(#${fill})`} />
      <ellipse
        cx={-r * 0.32}
        cy={-r * 0.38}
        rx={r * 0.22}
        ry={r * 0.14}
        fill="#fff"
        opacity={0.55}
        transform={`rotate(-30 ${-r * 0.32} ${-r * 0.38})`}
      />
    </g>
  );
}
export function Cone({ h = 140, w = 70, color = 'sun' }) {
  const [light, mid, dark] = SHADES[color];
  return (
    <g>
      <path d={`M0 ${-h} L${w} 0 Q0 ${w * 0.32} ${-w} 0 Z`} fill={mid} />
      <path
        d={`M0 ${-h} L${-w} 0 Q${-w * 0.5} ${w * 0.22} ${-w * 0.25} ${w * 0.3} Z`}
        fill={light}
        opacity={0.75}
      />
      <path
        d={`M0 ${-h} L${w} 0 Q${w * 0.6} ${w * 0.2} ${w * 0.35} ${w * 0.28} Z`}
        fill={dark}
        opacity={0.55}
      />
    </g>
  );
}
/** Soft contact shadow on the floor. */
export function Shadow({ rx, ry = rx * 0.18, opacity = 0.18 }) {
  return <ellipse rx={rx} ry={ry} fill="#1D3045" opacity={opacity} filter="url(#soft)" />;
}
const CONTAINERS = ['#E4572E', '#F6B93B', '#1F9E9A', '#3BA272', '#5DA9E9'];
function Box({ x, y, c }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={90} height={50} rx={4} fill={c} />
      {[14, 28, 42, 56, 70].map((lx) => (
        <rect key={lx} x={lx} y={6} width={3} height={38} rx={1.5} fill="#000" opacity={0.12} />
      ))}
      <rect width={90} height={50} rx={4} fill="url(#sheen)" />
    </g>
  );
}
/** The Edvin ship, waterline at y=0, bow to the right, ~540 wide. */
export function Ship() {
  return (
    <g>
      <path d="M0 -70 L540 -70 L500 26 L40 26 Z" fill="url(#hull)" />
      <path d="M14 -6 L526 -6 L500 26 L40 26 Z" fill="url(#keel)" />
      <path d="M0 -70 L540 -70 L536 -60 L4 -60 Z" fill="#FFFFFF" opacity={0.18} />
      <text
        x={150}
        y={-26}
        fontFamily="'Nunito Variable', Nunito, sans-serif"
        fontWeight={900}
        fontSize={30}
        fill="#FFFFFF"
        letterSpacing={3}
      >
        EDVIN
      </text>
      <rect x={24} y={-172} width={78} height={102} rx={6} fill="url(#cabin)" />
      <rect x={34} y={-160} width={58} height={14} rx={3} fill="#5DA9E9" />
      <rect x={34} y={-138} width={58} height={8} rx={3} fill="#C9D6E0" />
      <rect x={58} y={-206} width={22} height={36} rx={4} fill="url(#keel)" />
      <Box x={120} y={-120} c={CONTAINERS[1]} />
      <Box x={215} y={-120} c={CONTAINERS[2]} />
      <Box x={310} y={-120} c={CONTAINERS[3]} />
      <Box x={405} y={-120} c={CONTAINERS[4]} />
      <Box x={120} y={-170} c={CONTAINERS[3]} />
      <Box x={215} y={-170} c={CONTAINERS[0]} />
      <Box x={310} y={-170} c={CONTAINERS[0]} />
      <Box x={405} y={-170} c={CONTAINERS[1]} />
      <g transform="translate(500 -70)">
        <ellipse cx={0} cy={-14} rx={18} ry={13} fill="url(#ballSun)" />
        <circle cx={10} cy={-30} r={10} fill="url(#ballSun)" />
        <path d="M18 -31 l10 3 l-10 3 z" fill="#E4572E" />
        <circle cx={12} cy={-33} r={1.8} fill="#1D3045" />
      </g>
    </g>
  );
}
