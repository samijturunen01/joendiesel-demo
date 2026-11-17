import type { ReactNode } from 'react';

/*
 * Line illustrations in the "service manual" style of the site.
 * They are abstract and decorative (aria-hidden) – not technical drawings of specific parts,
 * and never presented as photographs. Every stroked shape carries pathLength="1" so
 * usePageMotion can draw it in; small amber details marked data-draw-fill fade in afterwards.
 */

interface DrawingProps {
  className?: string;
}

function Drawing({ viewBox, className, children }: { viewBox: string; className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      data-draw=""
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const AMBER = 'var(--color-amber-400)';

export function TesterDrawing({ className }: DrawingProps) {
  return (
    <Drawing viewBox="0 0 480 320" className={className}>
      <rect pathLength={1} x={60} y={40} width={300} height={210} rx={18} />
      <rect pathLength={1} x={84} y={64} width={210} height={150} rx={4} />
      <g strokeOpacity={0.35} strokeWidth={1}>
        <path pathLength={1} d="M84 104H294M84 139H294M84 174H294M136 64V214M189 64V214M241 64V214" />
      </g>
      <polyline
        pathLength={1}
        stroke={AMBER}
        strokeWidth={2.2}
        points="90,180 110,180 118,120 126,196 134,150 150,150 160,90 170,190 180,140 200,140 210,100 220,186 230,150 250,150 258,112 268,190 288,150"
      />
      <circle pathLength={1} cx={327} cy={96} r={12} />
      <circle pathLength={1} cx={327} cy={134} r={12} />
      <rect pathLength={1} x={312} y={170} width={30} height={30} rx={4} />
      <path pathLength={1} d="M210 250C210 302 330 304 380 286" />
      <path pathLength={1} d="M380 272H432L426 300H386Z" />
      <g data-draw-fill="" fill={AMBER} stroke="none">
        <circle cx={316} cy={58} r={4} />
        <circle cx={396} cy={284} r={2.2} />
        <circle cx={406} cy={284} r={2.2} />
        <circle cx={416} cy={284} r={2.2} />
      </g>
    </Drawing>
  );
}

export function InjectorDrawing({ className }: DrawingProps) {
  return (
    <Drawing viewBox="0 0 520 200" className={className}>
      <path pathLength={1} d="M233 0V48M247 0V48" />
      <rect pathLength={1} x={224} y={48} width={32} height={22} rx={2} />
      <path pathLength={1} d="M230 70V83M250 70V83" />
      <path pathLength={1} d="M40 92H60V108H40Z" />
      <rect pathLength={1} x={60} y={70} width={60} height={60} rx={6} />
      <path pathLength={1} d="M72 70V50H102V70" />
      <path pathLength={1} d="M120 83H340M120 117H340" />
      <path pathLength={1} d="M280 83V117M288 83V117" strokeWidth={1} />
      <rect pathLength={1} x={340} y={80} width={10} height={40} />
      <path pathLength={1} d="M350 78H390L410 86V114L390 122H350Z" />
      <path pathLength={1} d="M366 78V122M382 78V122" strokeWidth={1} />
      <path pathLength={1} d="M410 89H448M410 111H448" />
      <path pathLength={1} d="M448 89L462 95Q468 100 462 105L448 111" />
      <g data-draw-fill="" fill={AMBER} stroke="none">
        {[
          [480, 96, 2.2],
          [490, 92, 1.8],
          [494, 101, 2.4],
          [503, 88, 1.5],
          [506, 106, 1.9],
          [512, 97, 1.4],
          [486, 104, 1.6],
          [498, 112, 1.3],
          [500, 84, 1.2],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
    </Drawing>
  );
}

export function TimingBeltDrawing({ className }: DrawingProps) {
  // external tangents of the crank (140,230,r56) and cam (280,90,r66) pulleys
  return (
    <Drawing viewBox="0 0 400 330" className={className}>
      <path pathLength={1} d="M98.5 192.5L231 45.7A66 66 0 1 1 324.3 139L177.5 271.5A56 56 0 0 1 98.5 192.5Z" />
      <circle pathLength={1} cx={140} cy={230} r={48} />
      <circle pathLength={1} cx={140} cy={230} r={16} />
      <circle pathLength={1} cx={280} cy={90} r={58} />
      <circle pathLength={1} cx={280} cy={90} r={18} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          pathLength={1}
          cx={280 + 36 * Math.cos((a * Math.PI) / 180)}
          cy={90 + 36 * Math.sin((a * Math.PI) / 180)}
          r={7}
          strokeWidth={1.2}
        />
      ))}
      <circle pathLength={1} cx={262} cy={226} r={20} />
      <circle pathLength={1} cx={262} cy={226} r={6} />
      <path pathLength={1} d="M262 246V300M246 300H278" strokeWidth={1.2} />
      <g data-draw-fill="" fill={AMBER} stroke="none">
        <path d="M280 26l-6-10h12z" />
        <path d="M140 172l-6-10h12z" />
      </g>
    </Drawing>
  );
}

export function GlowPlugDrawing({ className }: DrawingProps) {
  const threads = Array.from({ length: 10 }, (_, i) => 244 + i * 8);
  return (
    <Drawing viewBox="0 0 480 140" className={className}>
      <rect pathLength={1} x={20} y={62} width={30} height={16} />
      <path pathLength={1} d="M50 56H70V84H50Z" />
      <path pathLength={1} d="M50 64H70M50 76H70" strokeWidth={1} />
      <rect pathLength={1} x={70} y={60} width={20} height={20} />
      <path pathLength={1} d="M90 48H150V92H90Z" />
      <path pathLength={1} d="M90 59H150M90 81H150" strokeWidth={1} />
      <path pathLength={1} d="M150 58H240M150 82H240" />
      <path pathLength={1} d="M240 56H320V84H240Z" />
      <path pathLength={1} d={threads.map((x) => `M${x} 56L${x + 6} 84`).join('')} strokeWidth={1} />
      <path pathLength={1} d="M320 60L336 64V76L320 80" />
      <path pathLength={1} d="M336 64H434Q442 70 434 76H336" />
      <g data-draw-fill="" stroke="none">
        <ellipse cx={430} cy={70} rx={20} ry={11} fill={AMBER} opacity={0.22} />
        <ellipse cx={432} cy={70} rx={9} ry={5} fill={AMBER} opacity={0.75} />
      </g>
    </Drawing>
  );
}

export function CrPumpDrawing({ className }: DrawingProps) {
  return (
    <Drawing viewBox="0 0 360 360" className={className}>
      <path pathLength={1} d="M38 160H60M38 200H60M38 160V200M322 160H300M322 200H300M322 160V200" />
      <circle pathLength={1} cx={180} cy={180} r={120} />
      <circle pathLength={1} cx={180} cy={180} r={92} />
      {[-90, 30, 150].map((a) => (
        <g key={a} transform={`rotate(${a + 90} 180 180)`}>
          <rect pathLength={1} x={168} y={92} width={24} height={50} />
          <path pathLength={1} d="M174 92V78H186V92" />
          <circle pathLength={1} cx={180} cy={46} r={12} />
          <path pathLength={1} d="M180 58V60" />
        </g>
      ))}
      <circle pathLength={1} cx={187} cy={175} r={32} />
      <circle pathLength={1} cx={180} cy={180} r={11} />
      <g data-draw-fill="" fill={AMBER} stroke="none">
        <circle cx={180} cy={180} r={5} />
        <circle cx={180} cy={46} r={4} />
      </g>
    </Drawing>
  );
}

export function InlinePumpDrawing({ className }: DrawingProps) {
  const xs = [100, 180, 260, 340];
  return (
    <Drawing viewBox="0 0 520 250" className={className}>
      <rect pathLength={1} x={40} y={110} width={380} height={100} rx={6} />
      <path pathLength={1} d="M40 190H420" strokeWidth={1} />
      <path pathLength={1} d="M60 132H400" strokeWidth={1} />
      <circle pathLength={1} cx={26} cy={180} r={14} />
      <path pathLength={1} d="M420 120H470Q490 120 490 140V190Q490 210 470 210H420" />
      {xs.map((x) => (
        <g key={x}>
          <rect pathLength={1} x={x - 14} y={64} width={28} height={46} />
          <rect pathLength={1} x={x - 18} y={42} width={36} height={22} rx={2} />
          <path pathLength={1} d={`M${x - 5} 42V18M${x + 5} 42V18`} />
          <path pathLength={1} d={`M${x - 14} 150H${x + 14}M${x - 10} 162H${x + 10}`} strokeWidth={1} />
        </g>
      ))}
      <g data-draw-fill="" fill={AMBER} stroke="none">
        {xs.map((x) => (
          <circle key={x} cx={x} cy={16} r={3.2} />
        ))}
      </g>
    </Drawing>
  );
}

export function DistributorPumpDrawing({ className }: DrawingProps) {
  return (
    <Drawing viewBox="0 0 520 250" className={className}>
      <rect pathLength={1} x={10} y={122} width={50} height={16} />
      <rect pathLength={1} x={60} y={84} width={20} height={92} rx={3} />
      <rect pathLength={1} x={80} y={74} width={250} height={112} rx={26} />
      <rect pathLength={1} x={330} y={94} width={90} height={72} rx={4} />
      {[104, 126, 148].map((y) => (
        <path key={y} pathLength={1} d={`M420 ${y}H446V${y + 12}H420`} />
      ))}
      <rect pathLength={1} x={120} y={30} width={180} height={44} rx={4} />
      <path pathLength={1} d="M300 40H328V64H300" />
      <path pathLength={1} d="M140 30V74M280 30V74" strokeWidth={1} />
      <circle pathLength={1} cx={375} cy={86} r={14} />
      <path pathLength={1} d="M110 186V206M300 186V206M96 206H314" strokeWidth={1.2} />
      <g data-draw-fill="" fill={AMBER} stroke="none">
        <circle cx={310} cy={52} r={3.2} />
        <circle cx={318} cy={52} r={3.2} />
        <circle cx={375} cy={86} r={4} />
      </g>
    </Drawing>
  );
}

/** Common rail principle – the only diagram with labels. Captioned as simplified wherever used. */
export function RailDiagram({ className }: DrawingProps) {
  const injectors = [330, 450, 570, 690];
  return (
    <Drawing viewBox="0 0 760 360" className={className}>
      {/* tank and low-pressure supply */}
      <rect pathLength={1} x={20} y={240} width={140} height={80} rx={8} />
      <path pathLength={1} d="M90 240V196H214" />
      {/* high-pressure pump */}
      <circle pathLength={1} cx={254} cy={236} r={40} />
      <circle pathLength={1} cx={254} cy={236} r={12} />
      <path pathLength={1} d="M254 196V176M290 252L306 260M218 252L202 260" />
      {/* high-pressure line to the rail */}
      <path pathLength={1} d="M254 176V130Q254 118 266 118H272" stroke={AMBER} strokeWidth={2.6} />
      {/* rail */}
      <rect pathLength={1} x={272} y={92} width={460} height={26} rx={13} stroke={AMBER} strokeWidth={2.2} />
      {/* injectors */}
      {injectors.map((x) => (
        <g key={x}>
          <path pathLength={1} d={`M${x} 118V158`} stroke={AMBER} strokeWidth={2.2} />
          <rect pathLength={1} x={x - 11} y={158} width={22} height={74} rx={3} />
          <path pathLength={1} d={`M${x - 6} 232L${x} 246L${x + 6} 232`} />
        </g>
      ))}
      {/* control unit and signal wires */}
      <rect pathLength={1} x={420} y={282} width={190} height={48} rx={4} />
      {injectors.map((x) => (
        <path key={x} pathLength={1} d={`M${x + 11} 196H${x + 30}V282`} strokeWidth={1} strokeOpacity={0.55} />
      ))}
      <g data-draw-fill="" stroke="none" fill="currentColor" fontFamily="var(--font-mono)" fontSize={12.5} letterSpacing="0.06em">
        <text x={90} y={284} textAnchor="middle">
          SÄILIÖ
        </text>
        <text x={254} y={304} textAnchor="middle">
          KORKEAPAINEPUMPPU
        </text>
        <text x={502} y={78} textAnchor="middle">
          YHTEISPAINEPUTKI (RAIL)
        </text>
        <text x={515} y={311} textAnchor="middle">
          OHJAINYKSIKKÖ
        </text>
        <text x={690} y={272} textAnchor="middle">
          SUUTTIMET
        </text>
        {injectors.map((x) => (
          <g key={x} fill={AMBER}>
            <circle cx={x - 5} cy={256} r={1.8} />
            <circle cx={x + 4} cy={259} r={1.5} />
            <circle cx={x} cy={264} r={2} />
          </g>
        ))}
      </g>
    </Drawing>
  );
}

