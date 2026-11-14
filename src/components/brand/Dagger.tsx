import { daggerParts } from './geometry';

type Props = {
  /** Which way the point faces. */
  point?: 'down' | 'up' | 'left' | 'right';
  className?: string;
  title?: string;
};

const turn = { down: 0, up: 180, left: 90, right: -90 } as const;
const box = {
  down: '-36 -160 72 164',
  up: '-36 -160 72 164',
  left: '-80 -114 160 72',
  right: '-80 -114 160 72',
} as const;

export function DaggerShape() {
  const { blade, grip, guard, quillons, pommel } = daggerParts;
  return (
    <>
      <path d={blade} />
      <path d={grip} />
      <path d={guard} fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
      {quillons.map(([cx, cy, r]) => (
        <circle key={cx} cx={cx} cy={cy} r={r} />
      ))}
      <circle cx={pommel[0]} cy={pommel[1]} r={pommel[2]} />
    </>
  );
}

/** A single dagger from the studio mark. Decorative unless given a title. */
export function Dagger({ point = 'down', className, title }: Props) {
  return (
    <svg
      viewBox={box[point]}
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <g transform={`rotate(${turn[point]} 0 -78)`}>
        <DaggerShape />
      </g>
    </svg>
  );
}
