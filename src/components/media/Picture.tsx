import manifest from '../../manifest/images.json';

type Source = { w: number; src: string };
type Rendition = { width: number; height: number; avif: Source[]; webp: Source[] };
type Entry = { group: string; grid: Rendition; full: Rendition };

const images = manifest as unknown as Record<string, Entry>;

export function hasImage(key: string) {
  return key in images;
}

// React 18 has no fetchPriority prop; the lowercase attribute passes straight through.
const highPriority = { fetchpriority: 'high' } as Record<string, string>;

const srcset = (list: Source[]) => list.map((s) => `${s.src} ${s.w}w`).join(', ');

type Props = {
  /** Path under media/ without extension, e.g. "portfolio/theshen/dragon-chest". */
  imageKey: string;
  rendition?: 'grid' | 'full';
  alt: string;
  sizes: string;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
  className?: string;
};

export function Picture({ imageKey, rendition = 'grid', alt, sizes, priority, className }: Props) {
  const r = images[imageKey]?.[rendition];
  if (!r) return <PhotoTodo label={alt} detail={imageKey} className={className} />;
  const fallback = r.webp[r.webp.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(r.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(r.webp)} sizes={sizes} />
      <img
        src={fallback?.src}
        width={r.width}
        height={r.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? highPriority : {})}
        className={className}
      />
    </picture>
  );
}

const aspects = {
  portrait: 'aspect-[4/5] justify-end',
  /** Square boxes sit inside the hero circle, so the text is centred to stay clear of the edge. */
  square: 'aspect-square items-center justify-center px-[20%] text-center',
} as const;

/** Stand-in for a photo that has not been supplied. Same box as the real image, so nothing shifts later. */
export function PhotoTodo({
  label,
  className = '',
  aspect = 'portrait',
  detail,
}: {
  label: string;
  className?: string;
  aspect?: keyof typeof aspects;
  detail?: string;
}) {
  return (
    <span
      className={`flex w-full flex-col gap-2 border border-dashed border-pewter bg-soot p-4 text-left ${aspects[aspect]} ${className}`}
    >
      <span className="ui text-ash">TODO: photo</span>
      <span className="text-small text-smoke">{label}</span>
      {detail ? <span className="break-all text-small text-ash">{detail}</span> : null}
    </span>
  );
}
