import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Choice = 'system' | 'reduced' | 'full';

type MotionState = {
  /** True when motion should be minimal, from the system setting or the footer toggle. */
  reduced: boolean;
  choice: Choice;
  setChoice: (c: Choice) => void;
};

/** Same key as public/boot.js, which sets data-motion before first paint. */
const KEY = 'tsr-motion';
const MotionContext = createContext<MotionState>({ reduced: true, choice: 'system', setChoice: () => {} });

function readChoice(): Choice {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'reduced' || v === 'full' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  // Server render and first client render both assume reduced motion, so nothing
  // waits on JavaScript and the footer toggle text matches the server HTML.
  const [choice, setChoiceState] = useState<Choice>('system');
  const [systemReduced, setSystemReduced] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // A transition lets React finish hydrating the lazy page first. A plain update here
    // reaches the still-dehydrated Suspense boundary and makes React discard the server HTML.
    startTransition(() => {
      setSystemReduced(mq.matches);
      setChoiceState(readChoice());
      setReady(true);
    });
    const onChange = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const reduced = choice === 'reduced' || (choice === 'system' && systemReduced);

  // boot.js already set the attribute; only write it once the real preference is known,
  // so it never flips to "reduced" for a frame on load.
  useEffect(() => {
    if (ready) document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  }, [ready, reduced]);

  const setChoice = useCallback((c: Choice) => {
    setChoiceState(c);
    try {
      if (c === 'system') window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, c);
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
  }, []);

  // Until the preference is read, report reduced so no motion code starts early.
  const value = useMemo(() => ({ reduced: !ready || reduced, choice, setChoice }), [ready, reduced, choice, setChoice]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  return useContext(MotionContext);
}
