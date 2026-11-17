'use client';

import {
  Fragment,
  useSyncExternalStore,
  Children,
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { ChevronDown } from 'lucide-react';

/** CSS keeps the full desktop content in place; only mobile uses the disclosure. */
export function MobileDisclosure({
  title,
  hint,
  className = '',
  defaultOpen = false,
  children,
}: {
  title: string;
  hint?: string;
  className?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const contentId = useId();
  return (
    <div className={`mn-mobile-disclosure ${className}`} data-expanded={expanded}>
      <button
        className="mn-disclosure-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((value) => !value)}
      >
        <span>
          {title}
          {hint && <small>{hint}</small>}
        </span>
        <ChevronDown size={20} aria-hidden="true" />
      </button>
      <div className="mn-disclosure-body" id={contentId}>
        {children}
      </div>
    </div>
  );
}

/** Keep footer links as direct grid children so desktop selectors remain unchanged. */
export function MobileFooterLinks({ title, children }: { title: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const groupId = useId();
  const links = Children.toArray(children).filter(isValidElement) as ReactElement<{
    id?: string;
  }>[];
  const ids = links.map((_, index) => `${groupId}-${index}`);
  return (
    <div className="mn-footer-link-group" data-expanded={expanded}>
      <h2>
        <span className="mn-footer-desktop-label">{title}</span>
        <button
          className="mn-footer-toggle"
          type="button"
          aria-expanded={expanded}
          aria-controls={ids.join(' ')}
          onClick={() => setExpanded((value) => !value)}
        >
          {title}
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </h2>
      {links.map((link, index) => cloneElement(link, { id: ids[index] }))}
    </div>
  );
}

const mobileQuery = '(max-width: 900px)';
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const getMobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;

export function ResponsiveHomeContent({
  about,
  process,
  services,
  coverage,
  projects,
}: {
  about: ReactNode;
  process: ReactNode;
  services: ReactNode;
  coverage: ReactNode;
  projects: ReactNode;
}) {
  const mobile = useSyncExternalStore(subscribe, getMobileSnapshot, getServerSnapshot);
  // Keep visual order, reading order and keyboard order aligned at each breakpoint.
  const sections = mobile
    ? ([
        ['services', services],
        ['process', process],
        ['about', about],
        ['coverage', coverage],
        ['projects', projects],
      ] as const)
    : ([
        ['about', about],
        ['process', process],
        ['services', services],
        ['coverage', coverage],
        ['projects', projects],
      ] as const);
  return (
    <div className="mn-home-content">
      {sections.map(([key, content]) => (
        <Fragment key={key}>{content}</Fragment>
      ))}
    </div>
  );
}
