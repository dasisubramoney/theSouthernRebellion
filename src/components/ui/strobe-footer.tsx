import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DaggerShape } from '@/components/brand/Dagger';
import { Dagger } from '@/components/brand/Dagger';
import { StudioMark } from '@/components/brand/StudioMark';
import { TodoNote, TodoOr } from '@/components/content/TodoNote';
import { EmailLink } from '@/components/layout/EmailLink';
import { ExternalLink } from '@/components/layout/ExternalLink';
import { contactPath, primaryNav } from '@/components/layout/nav';
import { publishedArtists } from '@/content/artists';
import { studio } from '@/content/studio';
import { isTodo } from '@/content/todo';
import { instagramUrl } from '@/lib/links';
import { useMotion } from '@/lib/motion';
import { contentPreview } from '@/lib/preview';
import { useTheme } from '@/lib/theme';
import {
  ECHOES_PER_SIDE,
  barcodeBars,
  echoScale,
  fanAngle,
  fitScale,
  isSettled,
  pointerDrive,
  springFrame,
  stiffnessFor,
  type Spring,
} from './strobe-footer.math';
import './strobe-footer.css';

/** Dagger length in DaggerShape units (tip at 0, pommel at -156). */
const DAGGER_LENGTH = 156;
const LETTER_GAP = 46;

type Size = { w: number; h: number };

type Echo = { i: number; dir: -1 | 1; spring: Spring; released: boolean };

function echoList(): Echo[] {
  const list: Echo[] = [];
  for (const dir of [-1, 1] as const) {
    for (let i = 1; i <= ECHOES_PER_SIDE; i++) list.push({ i, dir, spring: { x: fanAngle(i, dir), v: 0 }, released: true });
  }
  return list;
}

/** Ink fades with each echo, like a copy of a copy. */
const echoInk = (i: number) => 0.5 - i * 0.06;

/* --------------------------------------------------------------- pieces */

function Seal({ text }: { text: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className="sf-seal sf-rise" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="sf-ring">
        <defs>
          <path id={`${id}-ring`} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1" />
        <text fontSize="15" fontWeight="600" letterSpacing="2.2" fill="currentColor">
          <textPath href={`#${id}-ring`} textLength={2 * Math.PI * 80 - 4} lengthAdjust="spacing">
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <StudioMark disc={false} className="sf-seal-mark" />
    </div>
  );
}

function Barcode({ digits, barRefs }: { digits: string; barRefs: React.MutableRefObject<(SVGRectElement | null)[]> }) {
  const { bars, width } = useMemo(() => barcodeBars(digits), [digits]);
  return (
    <div className="sf-barcode sf-rise" aria-hidden="true">
      <svg viewBox={`0 0 ${width} 40`} preserveAspectRatio="none">
        {bars.map((b, n) => (
          <rect
            key={b.x}
            ref={(el) => {
              barRefs.current[n] = el;
            }}
            className="sf-bar"
            x={b.x}
            y="0"
            width={b.w}
            height="40"
            fill="currentColor"
          />
        ))}
      </svg>
      <p className="sf-digits">{digits}</p>
    </div>
  );
}

type Col = { title: string; items: ReactNode[] };

function Column({ col }: { col: Col }) {
  return (
    <div className="sf-col">
      <h2 className="sf-tracked">{col.title}</h2>
      <ul>
        {col.items.map((item, n) => (
          <li key={n}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- footer */

type Props = {
  /** Set edge to edge in the black band. Defaults to the content file. */
  wordmark?: string;
};

/**
 * The site footer as a screen-printed poster: a paper head (seal, est., barcode), a stage
 * where the logo's dagger stands on the floor of a black band holding the wordmark, with
 * echo daggers fanning behind it, and a black legal bar.
 */
export function StrobeFooter({ wordmark = studio.footer.wordmark }: Props) {
  const { reduced, choice, setChoice } = useMotion();
  const { theme, toggle } = useTheme();
  const uid = useId().replace(/:/g, '');

  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLButtonElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const lensRef = useRef<SVGCircleElement>(null);
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const letterRefs = useRef<(SVGTextElement | null)[]>([]);
  const paperEchoRefs = useRef<(SVGGElement | null)[]>([]);
  const bandEchoRefs = useRef<(SVGGElement | null)[]>([]);

  const echoes = useRef<Echo[]>(echoList());
  const drive = useRef({ swing: 0, spread: 1 });
  const frame = useRef(0);
  const last = useRef(0);
  const visible = useRef(false);
  const timers = useRef<number[]>([]);

  /** Stage and band sizes in px. Server and first render use a nominal size; CSS reserves the real box. */
  const [stage, setStage] = useState<Size>({ w: 1000, h: 620 });
  const [band, setBand] = useState<Size>({ w: 1000, h: 273 });
  /** Wordmark measurement: per-letter x, ink box, and the fit transform. Null until measured. */
  const [fit, setFit] = useState<null | { xs: number[]; left: number; ascent: number; sx: number; sy: number }>(null);
  /** Pointer effects: fine pointer, footer at least 768px wide, motion on. */
  const [pointerOn, setPointerOn] = useState(false);
  /** Where the link columns sit on the stage, so the echoes can fade out behind them. */
  const [flanks, setFlanks] = useState<{ x: number; y: number; w: number; h: number }[]>([]);
  /** Point-to-pommel length of the dagger in px, set so the pommel sits just inside the top of the disc. */
  const [reach, setReach] = useState(0);

  const year = new Date().getFullYear();
  const est = isTodo(studio.established) ? null : studio.established;

  /* ------------------------------------------------------------ measure */

  useEffect(() => {
    const st = stageRef.current;
    const bd = bandRef.current;
    if (!st || !bd) return;
    const cols = colsRef.current;
    const ro = new ResizeObserver(() => {
      // Columns over the stage (wide and mid): grow the stage so they always fit above the band.
      const over = cols && getComputedStyle(cols).position === 'absolute';
      if (over) {
        const cs = getComputedStyle(cols);
        const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
        const tallest = Math.max(0, ...[...cols.querySelectorAll<HTMLElement>('.sf-flank')].map((f) => f.offsetHeight));
        const need = Math.ceil(tallest + pad + bd.offsetHeight);
        st.style.minHeight = `${need}px`;
      } else {
        st.style.minHeight = '';
      }
      const s = st.getBoundingClientRect();
      const b = bd.getBoundingClientRect();
      setStage({ w: Math.round(s.width), h: Math.round(s.height) });
      setBand({ w: Math.round(b.width), h: Math.round(b.height) });
      setPointerOn(!reduced && window.matchMedia('(pointer: fine)').matches && s.width >= 768);
      // Keep the disc clear of the columns: at most the gap between the two flanks.
      const fl = over ? [...cols.querySelectorAll<HTMLElement>('.sf-flank')].map((f) => f.getBoundingClientRect()) : [];
      const wrap = st.querySelector<HTMLElement>('.sf-discwrap');
      if (wrap && fl.length === 2) {
        const mid = s.left + s.width / 2;
        const room = 2 * Math.min(mid - fl[0]!.right, fl[1]!.left - mid) - 48;
        wrap.style.setProperty('--sf-disc-max', `${Math.max(160, Math.floor(room))}px`);
      } else {
        wrap?.style.removeProperty('--sf-disc-max');
      }
      if (wrap) setReach(Math.round(s.height - (wrap.offsetTop + wrap.offsetHeight * 0.1)));
      setFlanks(
        over
          ? [...cols.querySelectorAll<HTMLElement>('.sf-col')].map((c) => {
              const r = c.getBoundingClientRect();
              return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
            })
          : [],
      );
    });
    ro.observe(st);
    if (cols) ro.observe(cols);
    return () => ro.disconnect();
  }, [reduced]);

  // Fit the wordmark's ink box edge to edge. Letter positions come from the probe, which is
  // set in the same font as the letters, so they always match what is drawn. Ink edges come
  // from canvas measureText once the font is loaded, otherwise from the probe's getBBox.
  const measure = useCallback(() => {
    if (!band.w || !band.h) return;
    const probe = document.querySelector<SVGTextElement>(`#${uid}-probe`);
    if (!probe) return;
    const box = probe.getBBox();
    const advance = probe.getComputedTextLength();
    if (!box.width || !advance) return;
    const xs = [...wordmark].map((_, n) => probe.getStartPositionOfChar(n).x);
    let left = -box.x;
    let right = box.x + box.width;
    let ascent = -box.y;
    let descent = box.y + box.height;
    const family = getComputedStyle(probe).fontFamily || 'serif';
    const font = `400 100px ${family}`;
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx && document.fonts?.check(font, wordmark)) {
      ctx.font = font;
      const m = ctx.measureText(wordmark);
      // Canvas advance should agree with the SVG; if not, canvas is using another face.
      if (Math.abs(m.width - advance) / advance < 0.03 && m.actualBoundingBoxAscent > 0) {
        left = m.actualBoundingBoxLeft;
        right = m.actualBoundingBoxRight;
        ascent = m.actualBoundingBoxAscent;
        descent = m.actualBoundingBoxDescent;
      }
    }
    const { sx, sy } = fitScale(band.w, band.h, left + right, ascent + descent);
    setFit({ xs, left, ascent, sx, sy });
  }, [band.w, band.h, wordmark, uid]);

  useEffect(() => {
    measure();
    let alive = true;
    const fonts = document.fonts;
    if (fonts) {
      const family = getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim() || 'serif';
      fonts
        .load(`400 100px ${family}`, wordmark)
        .catch(() => undefined)
        .then(() => fonts.ready)
        .then(() => alive && measure());
      fonts.addEventListener('loadingdone', measure);
    }
    return () => {
      alive = false;
      fonts?.removeEventListener('loadingdone', measure);
    };
  }, [measure, wordmark]);

  /* ------------------------------------------------------------- the fan */

  const pivot = { x: stage.w / 2, y: stage.h };
  const base = (reach > 0 ? reach : stage.h * 0.86) / DAGGER_LENGTH;
  const bandTop = stage.h - band.h;
  /** Read by the animation loop, which outlives any one render. */
  const geom = useRef({ pivot, base });
  geom.current = { pivot, base };

  const echoTransform = (e: Echo) => {
    const g = geom.current;
    return `translate(${g.pivot.x} ${g.pivot.y}) rotate(${e.spring.x.toFixed(2)}) scale(${(g.base * echoScale(e.i)).toFixed(4)})`;
  };

  const write = useCallback(() => {
    echoes.current.forEach((e, n) => {
      const t = echoTransform(e);
      paperEchoRefs.current[n]?.setAttribute('transform', t);
      bandEchoRefs.current[n]?.setAttribute('transform', t);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const targetOf = (e: Echo) => (e.released ? fanAngle(e.i, e.dir, drive.current.spread, drive.current.swing) : 0);

  const tick = useCallback(
    (now: number) => {
      const dt = last.current ? (now - last.current) / 1000 : 1 / 60;
      last.current = now;
      let settled = true;
      for (const e of echoes.current) {
        const target = targetOf(e);
        e.spring = springFrame(e.spring, target, stiffnessFor(e.i), dt);
        if (!isSettled(e.spring, target)) settled = false;
      }
      write();
      frame.current = !settled && visible.current ? requestAnimationFrame(tick) : 0;
      if (!frame.current) last.current = 0;
    },
    [write],
  );

  const wake = useCallback(() => {
    if (!frame.current && visible.current && !reduced) frame.current = requestAnimationFrame(tick);
  }, [tick, reduced]);

  // Keep the drawn transforms in step with the stage size.
  useEffect(() => write(), [write, stage.w, stage.h]);

  /* ------------------------------------------------------------ entrance */

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const setDelays = useCallback(() => {
    barRefs.current.forEach((el, n) => el?.style.setProperty('animation-delay', `${n * 18}ms`));
    letterRefs.current.forEach((el, n) => el?.style.setProperty('animation-delay', `${220 + n * LETTER_GAP}ms`));
    rootRef.current?.querySelectorAll<HTMLElement>('.sf-rise').forEach((el, n) => el.style.setProperty('animation-delay', `${Math.min(n, 2) * 60}ms`));
    rootRef.current?.querySelector<HTMLElement>('.sf-cols')?.style.setProperty('animation-delay', '1000ms');
    rootRef.current?.querySelector<HTMLElement>('.sf-legal-row')?.style.setProperty('animation-delay', '1100ms');
  }, []);

  const play = useCallback(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    clearTimers();
    root.dataset.sf = 'pre';
    // Collapse the echoes behind the blade, then fan them out one by one.
    for (const e of echoes.current) {
      e.released = false;
      e.spring = { x: 0, v: 0 };
    }
    write();
    void root.offsetHeight;
    root.dataset.sf = 'play';
    const order = [...echoes.current].sort((a, b) => a.i - b.i);
    order.forEach((e, n) => {
      timers.current.push(
        window.setTimeout(() => {
          e.released = true;
          wake();
        }, 820 + Math.floor(n / 2) * 70),
      );
    });
  }, [reduced, write, wake]);

  // After hydration only: hide, then play once when 20% of the footer is on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reduced) {
      clearTimers();
      delete root.dataset.sf;
      for (const e of echoes.current) {
        e.released = true;
        e.spring = { x: fanAngle(e.i, e.dir), v: 0 };
      }
      drive.current = { swing: 0, spread: 1 };
      write();
      return;
    }
    setDelays();
    let played = false;
    root.dataset.sf = 'pre';
    for (const e of echoes.current) {
      e.released = false;
      e.spring = { x: 0, v: 0 };
    }
    write();
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = Boolean(entry?.isIntersecting);
        if (visible.current && !played && (entry?.intersectionRatio ?? 0) >= 0.2) {
          played = true;
          play();
        }
        if (visible.current) wake();
      },
      { threshold: [0, 0.2] },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      clearTimers();
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Letter refs change once measured; set their delays then.
  useEffect(() => {
    if (fit && !reduced) setDelays();
  }, [fit, reduced, setDelays]);

  /* ------------------------------------------------------------- pointer */

  const onMove = (ev: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerOn) return;
    const r = ev.currentTarget.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width;
    const y = (ev.clientY - r.top) / r.height;
    drive.current = pointerDrive(x, y);
    wake();
    if (discRef.current) discRef.current.style.transform = `translate(${(-(x - 0.5) * 6).toFixed(2)}%, ${(-(y - 0.5) * 6).toFixed(2)}%)`;
    const lens = lensRef.current;
    const b = bandRef.current?.getBoundingClientRect();
    if (lens && b) {
      lens.setAttribute('cx', String(ev.clientX - b.left));
      lens.setAttribute('cy', String(ev.clientY - b.top));
      lens.setAttribute('r', String(Math.max(b.height * 0.9, 120)));
    }
  };

  const onLeave = () => {
    if (!pointerOn) return;
    drive.current = { swing: 0, spread: 1 };
    wake();
    if (discRef.current) discRef.current.style.transform = '';
    lensRef.current?.setAttribute('r', '0');
  };

  const replay = () => {
    const p = pulseRef.current;
    if (p) {
      delete p.dataset.on;
      void p.offsetWidth;
      p.dataset.on = '';
    }
    play();
  };

  /* ------------------------------------------------------------ content */

  const cols: Col[] = [
    {
      title: 'Studio',
      items: [
        ...primaryNav
          .filter((n) => n.id !== 'visit')
          .map((n) => (
            <Link key={n.id} to={n.to}>
              {n.label}
            </Link>
          )),
      ],
    },
    {
      title: 'Artists',
      items: publishedArtists.map((a) => (
        <Link key={a.slug} to={`/#artist-${a.slug}`}>
          {a.name}
        </Link>
      )),
    },
    {
      title: 'Visit',
      items: [
        <TodoOr key="street" value={studio.location.street} />,
        <span key="area">
          {studio.location.centre}, {studio.location.city}
        </span>,
        <TodoOr key="hours" value={studio.hours} />,
        <ExternalLink key="wa" href={studio.whatsapp} className="whitespace-nowrap">
          WhatsApp <span className="num">{studio.phoneDisplay}</span>
        </ExternalLink>,
        <EmailLink key="email" {...studio.email} />,
      ],
    },
    {
      title: 'Follow',
      items: [
        <ExternalLink key="studio" href={instagramUrl(studio.instagram)}>
          @{studio.instagram}
        </ExternalLink>,
        ...publishedArtists.map((a) => (
          <ExternalLink key={a.slug} href={instagramUrl(a.instagram)}>
            @{a.instagram}
          </ExternalLink>
        )),
      ],
    },
  ];
  const half = Math.ceil(cols.length / 2);

  /* -------------------------------------------------------------- render */

  const grit = 0.25;
  const disp = (grit * band.h * 0.03).toFixed(2);
  const speckFreq = Math.min(0.9, 0.25 * (260 / Math.max(band.h, 120))).toFixed(3);
  const ty = band.h * 0.07;

  const wordmarkText = (letterRefsOn: boolean) =>
    fit ? (
      <g transform={`translate(0 ${ty.toFixed(1)}) scale(1 ${(fit.sy / fit.sx).toFixed(4)})`}>
        {[...wordmark].map((ch, n) => (
          <text
            key={n}
            ref={
              letterRefsOn
                ? (el) => {
                    letterRefs.current[n] = el;
                  }
                : undefined
            }
            className={letterRefsOn ? 'sf-letter' : undefined}
            x={((fit.left + (fit.xs[n] ?? 0)) * fit.sx).toFixed(2)}
            y={(fit.ascent * fit.sx).toFixed(2)}
            fontSize={(100 * fit.sx).toFixed(2)}
          >
            {ch}
          </text>
        ))}
      </g>
    ) : (
      // Before measurement (and without JavaScript): fill the band with textLength.
      <text x="0" y={band.h * 1.02} fontSize={band.h * 1.18} textLength={band.w} lengthAdjust="spacingAndGlyphs">
        {wordmark}
      </text>
    );

  const echoShapes = (layer: 'paper' | 'band') =>
    echoes.current.map((e, n) => (
      <g
        key={`${e.dir}${e.i}`}
        ref={(el) => {
          (layer === 'paper' ? paperEchoRefs : bandEchoRefs).current[n] = el;
        }}
        transform={echoTransform(e)}
        opacity={echoInk(e.i)}
        {...(layer === 'paper'
          ? { fill: 'var(--sf-ink)', fillOpacity: 0.12, stroke: 'var(--sf-ink)', color: 'var(--sf-ink)' }
          : { fill: 'none', stroke: 'var(--sf-paper)', color: 'var(--sf-paper)' })}
      >
        <DaggerShape />
      </g>
    ));

  return (
    <footer ref={rootRef} className="sf-root" aria-labelledby={`${uid}-name`}>
      <p id={`${uid}-name`} className="visually-hidden">
        {studio.legalName}: {wordmark}
      </p>
      <div className="sf-frame">
        {/* Paper head */}
        <div className="sf-head">
          <Seal text={studio.footer.sealText} />
          <div className="sf-est sf-rise">
            {est ? (
              <>
                <p className="sf-tracked">Est.</p>
                <p className="sf-est-year num">{est}</p>
              </>
            ) : contentPreview && isTodo(studio.established) ? (
              <TodoNote item={studio.established} />
            ) : null}
            <Link to={contactPath} className="sf-tracked sf-cta">
              Send a booking enquiry
              <Dagger point="right" className="h-2.5 w-auto" />
            </Link>
          </div>
          <Barcode digits={studio.footer.barcodeDigits} barRefs={barRefs} />
        </div>

        {/* Stage */}
        <div className="sf-stagewrap">
          <div ref={stageRef} className="sf-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
            <div className="sf-discwrap">
              <button ref={discRef} type="button" className="sf-disc" aria-label="Replay the footer animation" onClick={replay}>
                <span ref={pulseRef} className="sf-pulse" aria-hidden="true" />
              </button>
            </div>

            <div ref={bandRef} className="sf-band" aria-hidden="true">
              <svg viewBox={`0 0 ${band.w} ${band.h}`} preserveAspectRatio="none" className="sf-wordmark">
                <defs>
                  <filter id={`${uid}-grit`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="warp" />
                    <feDisplacementMap in="SourceGraphic" in2="warp" scale={disp} xChannelSelector="R" yChannelSelector="G" result="ragged" />
                    <feTurbulence type="turbulence" baseFrequency={`${speckFreq} ${(Number(speckFreq) * 0.22).toFixed(3)}`} numOctaves="1" seed="9" result="noise" />
                    <feColorMatrix in="noise" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${(14 + grit * 16).toFixed(1)} ${(-12 - grit * 3).toFixed(1)}`} result="specks" />
                    <feComposite in="specks" in2="ragged" operator="in" result="holes" />
                    <feComposite in="ragged" in2="holes" operator="out" />
                  </filter>
                  <radialGradient id={`${uid}-lensfill`}>
                    <stop offset="0" stopColor="#fff" />
                    <stop offset="0.6" stopColor="#fff" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                  </radialGradient>
                  <mask id={`${uid}-lens`} maskUnits="userSpaceOnUse" x="0" y="0" width={band.w} height={band.h}>
                    <circle ref={lensRef} cx="0" cy="0" r="0" fill={`url(#${uid}-lensfill)`} />
                  </mask>
                </defs>
                {/* Hidden probe for the getBBox fallback measurement. */}
                <text id={`${uid}-probe`} x="0" y="0" fontSize="100" opacity="0">
                  {wordmark}
                </text>
                <g filter={`url(#${uid}-grit)`}>{wordmarkText(true)}</g>
                <g mask={`url(#${uid}-lens)`}>{wordmarkText(false)}</g>
              </svg>
            </div>

            <svg className="sf-fan" viewBox={`0 0 ${stage.w} ${stage.h}`} aria-hidden="true">
              <defs>
                <clipPath id={`${uid}-paper`}>
                  <rect x="0" y="0" width={stage.w} height={bandTop} />
                </clipPath>
                <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
                <mask id={`${uid}-quiet`} maskUnits="userSpaceOnUse" x="0" y="0" width={stage.w} height={stage.h}>
                  <rect x="0" y="0" width={stage.w} height={stage.h} fill="#fff" />
                  {flanks.map((f, n) => (
                    <rect key={n} x={f.x - 16} y={f.y - 16} width={f.w + 32} height={f.h + 32} fill="#000" fillOpacity="0.88" filter={`url(#${uid}-soft)`} />
                  ))}
                </mask>
                <clipPath id={`${uid}-band`}>
                  <rect x="0" y={bandTop} width={stage.w} height={stage.h - bandTop} />
                </clipPath>
              </defs>
              <g clipPath={`url(#${uid}-paper)`}>
                <g mask={`url(#${uid}-quiet)`}>{echoShapes('paper')}</g>
              </g>
              <g clipPath={`url(#${uid}-band)`}>{echoShapes('band')}</g>
            </svg>

            <svg className="sf-blade" viewBox={`0 0 ${stage.w} ${stage.h}`} aria-hidden="true">
              <g fill="var(--sf-paper)" stroke="var(--sf-ink)" color="var(--sf-paper)">
                <g transform={`translate(${pivot.x} ${pivot.y}) scale(${base.toFixed(4)})`}>
                  <DaggerShape />
                </g>
              </g>
            </svg>
          </div>

          <div ref={colsRef} className="sf-cols sf-late">
            <nav className="sf-flank" aria-label="Footer: studio and artists">
              {cols.slice(0, half).map((c) => (
                <Column key={c.title} col={c} />
              ))}
            </nav>
            <nav className="sf-flank" aria-label="Footer: visit and follow">
              {cols.slice(half).map((c) => (
                <Column key={c.title} col={c} />
              ))}
            </nav>
          </div>
        </div>

        {/* Legal bar */}
        <div className="sf-legal sf-on-ink">
          <svg className="sf-floor" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
            {Array.from({ length: 13 }, (_, n) => (
              <line key={n} x1="50" y1="-30" x2={n * (100 / 12)} y2="20" stroke="currentColor" strokeWidth="0.15" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <div className="sf-legal-row sf-late">
            <p className="num">
              © {year} {studio.legalName}
            </p>
            <div className="sf-legal-links">
              <Link to="/privacy">Privacy (POPIA)</Link>
              <button type="button" aria-pressed={theme === 'dark'} onClick={toggle}>
                Dark mode: {theme === 'dark' ? 'on' : 'off'}
              </button>
              <button type="button" aria-pressed={reduced} onClick={() => setChoice(reduced ? 'full' : 'reduced')}>
                Reduce motion: {reduced ? 'on' : 'off'}
                {choice === 'system' && reduced ? ' (device setting)' : ''}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
                  document.getElementById('main')?.focus({ preventScroll: true });
                }}
              >
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
