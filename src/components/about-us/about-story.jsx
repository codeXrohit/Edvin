import { Link } from 'react-router-dom';
import { ArrowRight } from '@/components/common/Icons';
import bearImage from '@/assets/images/bear.webp';

const IDEAS = [
  {
    title: 'Make a little world.',
    copy: 'A tower, a train track, a road across the living room. There’s room for every kind of imagination.',
  },
  {
    title: 'Find a new favourite.',
    copy: 'From colourful building blocks to cuddly companions, explore toys for all the ways children love to play.',
  },
  {
    title: 'Keep the play going.',
    copy: 'Discover the collection, ask us a question, or talk to our team about bringing Edvin to your toy shop.',
  },
];

export default function AboutStory() {
  return (
    <>
      <section
        className="grid items-center gap-10 py-10 md:grid-cols-[1.15fr_1fr] md:gap-14 md:pb-20 md:pt-12"
        aria-labelledby="about-title"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#bd4323]">Edvin / About us</p>
          <h1
            id="about-title"
            className="mt-6 font-display text-[clamp(48px,6.5vw,88px)] font-black leading-[1.02] tracking-[-.05em]"
          >
            Little toys.
            <br />
            <span className="text-toyred">A world of play.</span>
          </h1>
          <p className="mt-7 max-w-[43ch] text-base leading-relaxed text-navy/70 md:text-lg">
            For the builders, the dreamers, and the just-one-more-players. Edvin brings together toys that
            turn everyday moments into little adventures.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex min-h-12 items-center gap-5 rounded-full bg-navy px-6 font-display text-sm font-extrabold text-white transition-colors hover:bg-[#bd4323]"
          >
            Meet the toys <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <figure className="overflow-hidden rounded-[24px] bg-[#f1ebe2]">
          <img
            src={bearImage}
            alt="Bruno the bear, an Edvin cuddly companion"
            width={800}
            height={800}
            className="aspect-square w-full object-contain mix-blend-multiply"
          />
          <figcaption className="px-6 pb-6 text-xs text-navy/65">
            A little companion. A whole lot of adventures.
          </figcaption>
        </figure>
      </section>
      <section
        aria-label="A little more about Edvin"
        className="grid gap-8 border-t border-navy/15 py-10 md:grid-cols-3 md:gap-12 md:py-16"
      >
        {IDEAS.map((idea, i) => (
          <div key={idea.title}>
            <span className="font-mono text-xs text-[#bd4323]">0{i + 1}</span>
            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight">{idea.title}</h2>
            <p className="mt-3 text-sm leading-7 text-navy/70">{idea.copy}</p>
          </div>
        ))}
      </section>
      <section
        className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-navy px-7 py-9 text-white sm:flex-row sm:items-center sm:px-10"
        aria-labelledby="about-retail-title"
      >
        <div>
          <h2 id="about-retail-title" className="font-display text-2xl font-extrabold">
            A little more play for your shelves?
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Run a toy shop? Let’s talk about stocking Edvin.
          </p>
        </div>
        <Link
          to="/contact?topic=retail"
          className="inline-flex min-h-12 shrink-0 items-center gap-4 rounded-full bg-white px-6 font-display text-sm font-extrabold text-navy transition-colors hover:bg-sun"
        >
          For retailers <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
