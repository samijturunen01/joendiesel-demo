import { logoGeometry as g } from '@/brand/logoGeometry';
import { spriteId } from '@/brand/spriteIds';

/**
 * The logo's path data, defined ONCE per document. Every logo on the page (header, hero intro,
 * footer, 404) references these paths with <use>, so the prerendered HTML does not repeat
 * ~60 kB of wordmark outlines for each instance.
 */

export function LogoSprite() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
      <defs>
        <path id={spriteId.j} d={g.monogram.j} fillRule="evenodd" />
        <path id={spriteId.d} d={g.monogram.d} fillRule="evenodd" />
        {g.word.map((l, i) => (
          <path key={i} id={spriteId.letter(i)} d={l.d} fillRule="evenodd" />
        ))}
      </defs>
    </svg>
  );
}
