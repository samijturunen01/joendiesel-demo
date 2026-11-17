import { logoGeometry as g } from '@/brand/logoGeometry';

/*
 * Joen Diesel Oy's authentic logo, rebuilt as vectors from the original bitmaps
 * (scripts/build-logo.mjs). Shapes, proportions, counters and the rough letterpress
 * edges of the wordmark are the original's – nothing is redrawn.
 */

const vb = (box: readonly number[]) => box.join(' ');

export function FrameRects({ className }: { className?: string }) {
  const o = g.frameOuter;
  const i = g.frameInner;
  return (
    <g className={className} fill="none" stroke="currentColor">
      <rect x={o.x} y={o.y} width={o.w} height={o.h} strokeWidth={o.stroke} />
      <rect x={i.x} y={i.y} width={i.w} height={i.h} strokeWidth={i.stroke} />
    </g>
  );
}

export function MonogramLetters({ className }: { className?: string }) {
  return (
    <g className={className} fill="currentColor">
      <path d={g.monogram.j} fillRule="evenodd" />
      <path d={g.monogram.d} fillRule="evenodd" />
    </g>
  );
}

/** Wordmark letters positioned for the stacked lockup (stacked-bitmap coordinates). */
export function WordmarkStacked({ letterClassName }: { letterClassName?: string }) {
  const t = g.wordToStacked;
  return (
    <g transform={`matrix(${t.s} 0 0 ${t.s} ${t.tx} ${t.ty})`} fill="currentColor">
      {g.word.map((l, idx) => (
        <g key={idx} transform={`translate(${+(l.stacked.dx / t.s).toFixed(2)} ${+(l.stacked.dy / t.s).toFixed(2)})`}>
          <path className={letterClassName} d={l.d} fillRule="evenodd" data-word={l.word} />
        </g>
      ))}
    </g>
  );
}

interface LogoProps {
  className?: string;
  title?: string;
}

/** Horizontal lockup – header and footer. */
export function LogoWide({ className, title = 'Joen Diesel Oy' }: LogoProps) {
  const t = g.monoToWide;
  return (
    <svg className={className} viewBox={vb(g.viewBox.wide)} role="img" aria-label={title} focusable="false">
      <g transform={`matrix(${t.s} 0 0 ${t.s} ${t.tx} ${t.ty})`}>
        <FrameRects />
        <MonogramLetters />
      </g>
      <g fill="currentColor">
        {g.word.map((l, idx) => (
          <path key={idx} d={l.d} fillRule="evenodd" />
        ))}
      </g>
    </svg>
  );
}

/** Stacked lockup – static version (404, footer on small screens). */
export function LogoStacked({ className, title = 'Joen Diesel Oy' }: LogoProps) {
  return (
    <svg className={className} viewBox={vb(g.viewBox.stacked)} role="img" aria-label={title} focusable="false">
      <FrameRects />
      <MonogramLetters />
      <WordmarkStacked />
    </svg>
  );
}

/** Monogram only – frame + JD. */
export function Monogram({ className, title = 'Joen Diesel Oy' }: LogoProps) {
  return (
    <svg className={className} viewBox={vb(g.viewBox.monogram)} role="img" aria-label={title} focusable="false">
      <FrameRects />
      <MonogramLetters />
    </svg>
  );
}

