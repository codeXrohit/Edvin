import { Link } from 'react-router-dom';

export default function FooterLinkGroup({ title, links }) {
  return (
    <nav aria-label={title} className="col-span-1 self-start">
      <h3 className="text-xs font-extrabold uppercase tracking-[.18em] text-white/45">{title}</h3>
      <ul className="mt-5 space-y-1">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="inline-flex min-h-11 items-center text-base text-white/75 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
