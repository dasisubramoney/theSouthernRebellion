import { useEffect, useState, type ReactNode } from 'react';
import { joinEmail } from '../../lib/email';

type Props = {
  user: string;
  domain: string;
  className?: string;
  subject?: string;
  /**
   * Custom content, given the address as text to place where it belongs. Before hydration
   * the address is spelled out ("info at ... dot co dot za"), so it is never in the HTML.
   */
  children?: (address: ReactNode) => ReactNode;
};

/**
 * Server HTML shows the address spelled out; the mailto link is built after hydration.
 */
export function EmailLink({ user, domain, className, subject, children }: Props) {
  const [address, setAddress] = useState<string | null>(null);
  useEffect(() => setAddress(joinEmail(user, domain)), [user, domain]);

  if (!address) {
    const spelled = `${user} at ${domain.replace(/\./g, ' dot ')}`;
    return <span className={className}>{children ? children(spelled) : spelled}</span>;
  }
  const href = `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  const shown = (
    <>
      {user}@<wbr />
      {domain}
    </>
  );
  return (
    <a className={className} href={href}>
      {children ? children(shown) : shown}
    </a>
  );
}
