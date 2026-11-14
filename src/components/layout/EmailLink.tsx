import { useEffect, useState } from 'react';
import { joinEmail } from '../../lib/email';

type Props = { user: string; domain: string; className?: string; subject?: string };

/**
 * Server HTML shows the address spelled out; the mailto link is built after hydration.
 */
export function EmailLink({ user, domain, className, subject }: Props) {
  const [address, setAddress] = useState<string | null>(null);
  useEffect(() => setAddress(joinEmail(user, domain)), [user, domain]);

  if (!address) {
    return (
      <span className={className}>
        {user} at {domain.replace(/\./g, ' dot ')}
      </span>
    );
  }
  const href = `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  return (
    <a className={className} href={href}>
      {user}@<wbr />
      {domain}
    </a>
  );
}
