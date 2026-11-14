import { Dagger } from './Dagger';

type Props = {
  className?: string;
  /** Where the dagger sits along the rule. */
  align?: 'start' | 'centre' | 'end';
};

const place = {
  start: 'justify-start',
  centre: 'justify-center',
  end: 'justify-end',
} as const;

/**
 * Section divider: a hairline that ends in a dagger pointing into the next section.
 */
export function DaggerRule({ className = '', align = 'centre' }: Props) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-3 ${place[align]} ${className}`}>
      {align !== 'start' ? <span data-reveal="draw-end" className="h-px flex-1 bg-current opacity-40" /> : null}
      <Dagger className="h-10 w-auto shrink-0" />
      {align !== 'end' ? <span data-reveal="draw-start" className="h-px flex-1 bg-current opacity-40" /> : null}
    </div>
  );
}
