import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react';

type Variant = 'primary' | 'ghost' | 'dark';

interface ButtonLinkProps {
  to: string;
  children: ReactNode;
  variant?: Variant;
  icon?: 'arrow' | 'phone' | 'external' | 'none';
  className?: string;
  /** Extra text for screen readers, e.g. where an external link goes */
  srHint?: string;
}

const isExternal = (to: string) => /^(https?:|mailto:|tel:)/.test(to);

/** Button-styled link. Internal paths use the router; tel:, mailto: and http(s) use <a>. */
export function ButtonLink({ to, children, variant = 'primary', icon = 'arrow', className = '', srHint }: ButtonLinkProps) {
  const cls = `btn btn-${variant} ${className}`;
  const Icon = icon === 'phone' ? Phone : icon === 'external' ? ArrowUpRight : icon === 'arrow' ? ArrowRight : null;
  const content = (
    <>
      {icon === 'phone' && Icon ? <Icon aria-hidden="true" className="size-4.5 shrink-0" strokeWidth={2} /> : null}
      <span>{children}</span>
      {srHint ? <span className="sr-only"> {srHint}</span> : null}
      {icon !== 'phone' && Icon ? <Icon aria-hidden="true" className="btn-arrow size-4.5 shrink-0" strokeWidth={2} /> : null}
    </>
  );
  if (isExternal(to)) {
    const external = /^https?:/.test(to);
    return (
      <a href={to} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {content}
    </Link>
  );
}

/** Mono section label: "02 ─── Laitehaku" */
export function SectionLabel({ code, children, className = '' }: { code?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      {code ? <span className="text-amber-400 [.on-paper_&]:text-amber-700">{code}</span> : null}
      <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  );
}

export function Ruler({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`ruler ${className}`} />;
}

/** Keeps a long Finnish compound together until it really must break. */
export function Nobr({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}
