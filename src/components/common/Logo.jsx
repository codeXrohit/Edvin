import logoImage from '@/assets/images/new-logo.svg';
export default function Logo({ light = false, fixedSize = false }) {
  return (
    <span
      className={`inline-flex items-center ${light ? 'rounded-xl bg-white px-2.5 py-1.5' : ''} ${fixedSize ? 'h-full' : ''}`}
    >
      <img
        src={logoImage}
        alt="Edvin"
        className={
          fixedSize
            ? 'block h-full w-[110px] object-contain phone-down:w-24 phone-down:object-cover'
            : 'block h-9 w-auto max-w-[160px] object-contain phone-down:h-11 sm:h-12 sm:max-w-[200px]'
        }
      />
    </span>
  );
}
