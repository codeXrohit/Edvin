import { useCallback, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from '@/components/common/Icons';
import { useNavigate } from 'react-router-dom';
import ProductDialog from '@/components/products/product-dialog';
import { PRODUCTS } from '@/data/products';
import { scrollToId } from '@/utils/smoothScroll';
const FILTERS = ['All toys', 'Build & create', 'Soft & cuddly', 'On the move', 'Play & discover'];
export default function ProductGrid({ standalone = false }) {
  const navigate = useNavigate();
  const Heading = standalone ? 'h1' : 'h2';
  const [filter, setFilter] = useState('All toys');
  const [selected, setSelected] = useState(null);
  const reduce = useReducedMotion();
  const visible = PRODUCTS.filter((p) => filter === 'All toys' || p.group === filter);
  const close = useCallback(() => setSelected(null), []);
  const enquire = () => {
    const product = selected;
    close();
    if (standalone) navigate(`/contact?topic=retail${product ? `&product=${product.id}` : ''}`);
    else {
      if (product) navigate(`/?product=${product.id}#retailers`);
      requestAnimationFrame(() => scrollToId('retailers'));
    }
  };
  return (
    <section
      id="toys"
      className={`toys-section [--store-ink:#1d3045] [--store-accent:#d65e36] [--store-muted:#64717b] [background:#fff] text-[color:var(--store-ink)] [scroll-margin-top:80px] pb-0 ${standalone ? 'pt-6 phone-down:pt-6' : 'pt-[110px] phone-down:pt-[65px]'}`}
      aria-labelledby="toys-title"
    >
      <div className="collection-container w-[min(1400px,_calc(100%_-_112px))] ml-auto mr-auto tablet-down:w-[calc(100%_-_64px)] phone-down:w-[calc(100%_-_40px)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="toys-heading [&_:is(h1,h2)]:font-display [&_:is(h1,h2)]:text-[length:clamp(42px,_4.4vw,_66px)] [&_:is(h1,h2)]:font-black [&_:is(h1,h2)]:leading-[1.02] [&_:is(h1,h2)]:tracking-[-.045em] [&_:is(h1,h2)]:mt-[26px] [&_:is(h1,h2)_span]:text-[color:#e4572e] flex items-end justify-between gap-[35px] pb-[50px] phone-down:items-start phone-down:flex-col phone-down:gap-[22px] phone-down:pb-[30px] phone-down:[&_:is(h1,h2)]:mt-[21px] phone-down:[&_:is(h1,h2)]:text-[length:clamp(42px,_9vw,_62px)]"
        >
          <div>
            <span className="collection-eyebrow inline-flex items-center gap-[10px] text-[length:11px] font-semibold leading-[1.5] tracking-[.13em] uppercase phone-down:text-[length:9px] phone-down:gap-2">
              <span className="collection-dot w-[7px] h-[7px] flex-none rounded-full [background:#e4572e]" />{' '}
              Edvin | The collection
            </span>
            <Heading id="toys-title">
              Small toys.
              <br />
              <span>Big possibilities.</span>
            </Heading>
          </div>
          <div className="toys-heading-note pb-1 [&_p]:text-[length:15px] [&_p]:leading-[1.7] [&>span]:block [&>span]:mt-[15px] [&>span]:text-[color:#75808a] [&>span]:text-[length:11px] phone-down:[&_p]:text-[length:13px] phone-down:[&_p_br]:hidden phone-down:[&>span]:text-[length:10px] phone-down:[&>span]:mt-[6px]">
            <p>
              For the builders, the dreamers, <br />
              and the just-one-more-players.
            </p>
            <span>A little peek inside an Edvin box.</span>
          </div>
        </motion.div>
        <div className="toys-toolbar flex items-center justify-between gap-5 pt-[21px] pb-[21px] [border-block:1px_solid_#1d30451c] mb-8 phone-down:pt-[15px] phone-down:pb-[15px] phone-down:mb-[23px]">
          <div
            className="toys-filters flex gap-[7px] flex-wrap [&_button]:inline-flex [&_button]:items-center [&_button]:gap-[10px] [&_button]:min-h-10 [&_button]:pt-[9px] [&_button]:pr-4 [&_button]:pb-[9px] [&_button]:pl-4 [&_button]:border [&_button]:border-[transparent] [&_button]:rounded-[999px] [&_button]:text-[length:11px] [&_button]:font-semibold [&_button]:text-[color:#6c7882] [&_button]:cursor-pointer [&_button]:[transition:color_.2s,_background_.2s] [&_button:hover]:text-[color:#1d3045] [&_button:hover]:[background:#f1f3f4] [&_.is-active]:[background:#1d3045] [&_.is-active]:text-[color:#fff] [&_.is-active:hover]:[background:#1d3045] [&_.is-active:hover]:text-[color:#fff] [&_button>span]:text-[color:#b4c1ca] [&_button>span]:font-mono [&_button>span]:text-[9px] [&_button>span]:leading-[normal] phone-down:gap-[5px] phone-down:[&_button]:text-[length:10px] phone-down:[&_button]:pl-[11px] phone-down:[&_button]:pr-[11px] phone-down:[&_button]:min-h-11"
            role="group"
            aria-label="Filter toy collections"
          >
            {FILTERS.map((label) => (
              <button
                key={label}
                type="button"
                aria-pressed={filter === label}
                className={filter === label ? 'is-active' : ''}
                onClick={() => setFilter(label)}
              >
                {label}
                {label === 'All toys' && <span>{PRODUCTS.length.toString().padStart(2, '0')}</span>}
              </button>
            ))}
          </div>
          <span
            className="toys-count whitespace-nowrap text-[color:#75808a] font-mono text-[9px] leading-[normal] tablet-down:hidden"
            role="status"
          >
            {visible.length.toString().padStart(2, '0')} favourites to explore
          </span>
        </div>
        <motion.ul
          layout={!reduce}
          className="toys-grid grid grid-cols-[repeat(3,_minmax(0,_1fr))] gap-[38px_26px] [list-style:none] tablet-down:gap-[32px_20px] phone-down:grid-cols-1 phone-down:gap-8 small-phone:grid-cols-[1fr]"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.id}
                layout={!reduce}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
                transition={{ duration: reduce ? 0 : 0.28 }}
              >
                <button
                  type="button"
                  className="toy-card block w-full text-left cursor-pointer [&:hover_.toy-card-image>img]:[transform:scale(1.045)_translateY(-3px)] [&:hover_.toy-card-explore]:opacity-[1] [&:hover_.toy-card-explore]:[transform:translateY(0)] [&:focus-visible_.toy-card-explore]:opacity-[1] [&:focus-visible_.toy-card-explore]:[transform:translateY(0)] [&:hover_.toy-card-arrow]:text-[color:#fff] [&:hover_.toy-card-arrow]:[background:#e4572e] [&:hover_.toy-card-arrow]:border-[#e4572e] motion-reduce:[&:hover_.toy-card-image>img]:[transform:none]"
                  onClick={() => setSelected(p)}
                  aria-label={`Explore ${p.name}`}
                >
                  <div className="toy-card-image relative overflow-hidden isolate [background:#f5f6f6] rounded-[4px] [&>img]:block [&>img]:w-full [&>img]:h-auto [&>img]:[aspect-ratio:1_/_1] [&>img]:object-cover [&>img]:mix-blend-multiply [&>img]:[transition:transform_.6s_cubic-bezier(.2,_.7,_.3,_1)] motion-reduce:[&>img]:[transition:none]">
                    <span className="toy-card-category absolute z-[1] left-[21px] top-[19px] text-[color:#687680] text-[length:10px] tablet-down:top-[14px] tablet-down:left-[14px] phone-down:top-[10px] phone-down:left-[10px] phone-down:text-[length:8px]">
                      {p.type}
                    </span>
                    <img
                      src={p.image}
                      alt={p.name}
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="toy-card-explore absolute flex items-center gap-4 left-[21px] bottom-[17px] text-[length:10px] text-[color:#1d3045] opacity-[0] [transform:translateY(7px)] [transition:opacity_.25s,_transform_.25s] phone-down:hidden motion-reduce:[transition:none]">
                      Take a closer look <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="toy-card-caption flex items-center justify-between gap-[10px] pt-[19px] pr-0 pb-0 pl-0 [&_p]:text-[color:#75808a] [&_p]:text-[length:10px] [&_p]:mb-[5px] [&_h3]:font-display [&_h3]:text-[length:clamp(18px,_1.6vw,_23px)] [&_h3]:leading-[1.3] [&_h3]:font-extrabold [&_h3]:tracking-[-.025em] phone-down:pt-[13px] phone-down:items-start phone-down:gap-[6px] phone-down:[&_p]:text-[length:11px] phone-down:[&_p]:mb-1 phone-down:[&_h3]:text-[length:22px]">
                    <div>
                      <p>{p.group}</p>
                      <h3>{p.name}</h3>
                    </div>
                    <span className="toy-card-arrow grid [place-items:center] w-[37px] h-[37px] flex-none border border-[#dfe3e6] rounded-full [transition:color_.2s,_background_.2s,_border-color_.2s] phone-down:w-[26px] phone-down:h-[26px] phone-down:[&_i]:text-[length:14px] phone-down:[&_i]:w-[14px] phone-down:[&_i]:h-[14px] motion-reduce:[transition:none]">
                      <ArrowUpRight size={20} aria-hidden="true" />
                    </span>
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <div className="toys-partner-note flex items-center justify-between gap-6 mt-[65px] pt-[30px] pb-[30px] border-t border-[#1d30451c] [&_p]:font-display [&_p]:text-[length:20px] [&_p]:font-extrabold [&_p]:tracking-[-.02em] phone-down:flex-col phone-down:items-start phone-down:gap-2 phone-down:mt-[38px] phone-down:pt-[25px] phone-down:pb-[25px] phone-down:[&_p]:text-[length:18px]">
          <p>A little more play for your shelves?</p>
          <button
            type="button"
            className="collection-text-link inline-flex items-center gap-4 min-h-11 text-[color:#1d3045] text-[length:12px] font-bold cursor-pointer [&_i]:[transition:transform_.2s] [&:hover_i]:[transform:translateX(4px)] phone-down:text-[length:11px] phone-down:gap-[10px] motion-reduce:[&_i]:[transition:none] motion-reduce:[&:hover_i]:[transform:none]"
            onClick={enquire}
          >
            Let’s stock your store <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
      <ProductDialog product={selected} onClose={close} onEnquire={enquire} />
    </section>
  );
}
