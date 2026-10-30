import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <section className="min-h-[70svh] px-[max(24px,calc((100vw-1240px)/2))] pb-[100px] pt-[170px]">
      <p className="text-[13px] uppercase tracking-[.12em]">404 / A little lost?</p>
      <h1 className="my-[25px] font-display text-[clamp(40px,6vw,80px)] font-black leading-[1.1]">
        This toy has wandered off.
      </h1>
      <Link to="/" className="inline-flex min-h-11 items-center underline underline-offset-[6px]">
        Let’s head home →
      </Link>
    </section>
  );
}
