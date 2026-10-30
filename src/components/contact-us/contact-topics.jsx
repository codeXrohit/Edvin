import { Store, Heart, MessageCircle, Check, ArrowUpRight } from '@/components/common/Icons';
import { CONTACT_TOPICS as TOPICS } from '@/data/contact';
import OfficeAddress from './office-address';
const icons = { retail: Store, toys: Heart, hello: MessageCircle };
export default function ContactTopics({ form }) {
  const { topic, pending, chooseTopic } = form;
  return (
    <aside className="contact-sidebar [&_h2]:mt-5 [&_h2]:font-display [&_h2]:text-[length:clamp(35px,_3.5vw,_46px)] [&_h2]:font-[850] [&_h2]:tracking-[-.04em] [&_h2]:leading-[1.12] contact-tablet:[&_h2_br]:hidden contact-phone:[&_h2]:text-[length:35px] contact-phone:[&_h2]:mt-[14px]">
      <p className="contact-eyebrow flex items-center gap-[10px] text-[length:10px] font-bold tracking-[.13em] leading-[1.6] [&>span]:w-[7px] [&>span]:h-[7px] [&>span]:flex-none [&>span]:[background:var(--contact-orange)] [&>span]:rounded-full">
        A GOOD PLACE TO START
      </p>
      <h2 id="conversation-title">
        What brings
        <br />
        you our way?
      </h2>
      <p className="contact-sidebar-intro mt-[17px] text-[color:var(--contact-muted)] text-[length:14px] leading-[1.7] contact-phone:text-[length:13px] contact-phone:mt-3">
        Pick a topic and tell us a little more.
      </p>
      <div
        className="contact-topics grid mt-[31px] gap-2 contact-tablet:grid-cols-[repeat(3,_minmax(0,_1fr))] contact-tablet:gap-3 contact-phone:grid-cols-[1fr] contact-phone:gap-[7px] contact-phone:mt-[23px]"
        role="group"
        aria-label="Choose an enquiry topic"
      >
        {TOPICS.map(({ id, title, description }) => {
          const Icon = icons[id];
          return (
            <button
              key={id}
              type="button"
              disabled={pending}
              onClick={() => chooseTopic(id)}
              aria-pressed={topic.id === id}
              className={`contact-topic grid grid-cols-[21px_1fr_17px] gap-[14px] [align-items:start] pt-5 pr-[17px] pb-5 pl-[17px] border border-[transparent] rounded-[8px] text-left cursor-pointer [transition:background_.2s,_border-color_.2s] hover:[background:#f3eee7] [&>i]:mt-[2px] [&>i:last-child]:mt-1 [&_strong]:block [&_strong]:font-display [&_strong]:text-[length:18px] [&_strong]:font-[850] [&_strong]:tracking-[-.02em] [&_span>span]:block [&_span>span]:mt-[7px] [&_span>span]:text-[length:12px] [&_span>span]:leading-[1.75] [&_span>span]:text-[color:var(--contact-muted)] [&.is-selected]:[background:#fff0e7] [&.is-selected]:border-[#efcdbb] [&.is-selected>i]:text-[color:var(--contact-action)] tablet-down:pt-[17px] tablet-down:pr-3 tablet-down:pb-[17px] tablet-down:pl-3 tablet-down:gap-[10px] contact-tablet:grid-cols-[1fr_17px] contact-tablet:p-[18px] contact-tablet:border-[var(--contact-line)] contact-tablet:[&>i:first-child]:[grid-column:1] contact-tablet:[&>span]:[grid-column:1_/_-1] contact-tablet:[&>span]:[grid-row:2] contact-tablet:[&>i:last-child]:[grid-column:2] contact-tablet:[&>i:last-child]:[grid-row:1] contact-tablet:[&_strong]:text-[length:17px] contact-phone:grid-cols-[21px_1fr_17px] contact-phone:items-center contact-phone:p-4 contact-phone:[&>span]:[grid-column:2] contact-phone:[&>span]:[grid-row:1] contact-phone:[&>i:last-child]:[grid-column:3] contact-phone:[&_span>span]:mt-[5px] contact-phone:[&_span>span]:text-[length:11px] ${topic.id === id ? 'is-selected' : ''}`}
            >
              <Icon size={20} aria-hidden="true" />
              <span>
                <strong>{title}</strong>
                <span>{description}</span>
              </span>
              {topic.id === id ? (
                <Check size={17} aria-hidden="true" />
              ) : (
                <ArrowUpRight size={17} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
      <OfficeAddress />
    </aside>
  );
}
