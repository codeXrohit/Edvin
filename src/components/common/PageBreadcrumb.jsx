import { Link } from 'react-router-dom';
import { ArrowRight } from '@/components/common/Icons';

export default function PageBreadcrumb({ label }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-xs text-navy/65">
      <Link to="/" className="inline-flex min-h-11 items-center transition-colors hover:text-toyred">
        Home
      </Link>
      <ArrowRight size={12} aria-hidden="true" />
      <span aria-current="page" className="text-navy">
        {label}
      </span>
    </nav>
  );
}
