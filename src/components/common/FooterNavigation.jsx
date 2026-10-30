import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { Plus, Minus } from '@/components/common/Icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FooterLinkGroup from '@/components/common/FooterLinkGroup';

function MobileLinkPanel({ group, labelledBy, onClose }) {
  const present = useIsPresent();
  const reduce = useReducedMotion();
  return (
    <motion.div
      role="region"
      aria-labelledby={labelledBy}
      aria-hidden={!present}
      inert={present ? undefined : ''}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden text-left"
    >
      <ul className="space-y-1 pb-1 pt-3">
        {group.links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              onClick={onClose}
              className="flex min-h-11 w-full items-center px-4 text-base text-white/75 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function FooterNavigation({ groups }) {
  const phone = useMediaQuery('(max-width: 767px)');
  const [openGroup, setOpenGroup] = useState(null);
  const id = useId();
  const panelId = `${id}-links`;
  const active = groups.find((group) => group.title === openGroup);
  if (!phone) return groups.map((group) => <FooterLinkGroup key={group.title} {...group} />);
  return (
    <nav aria-label="Footer links" className="col-span-2">
      <div className="grid grid-cols-2 gap-3">
        {groups.map((group) => {
          const open = openGroup === group.title;
          const ToggleIcon = open ? Minus : Plus;
          return (
            <button
              key={group.title}
              id={`${id}-${group.title}`}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenGroup((current) => (current === group.title ? null : group.title))}
              className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-[.08em] text-white/75 transition-colors hover:border-white/25 hover:text-white"
            >
              {group.title}
              <ToggleIcon size={11} aria-hidden="true" className="shrink-0 text-white/60" />
            </button>
          );
        })}
      </div>
      <div id={panelId}>
        <AnimatePresence initial={false} mode="wait">
          {active && (
            <MobileLinkPanel
              key={active.title}
              group={active}
              labelledBy={`${id}-${active.title}`}
              onClose={() => setOpenGroup(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
