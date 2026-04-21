// Taste Tester — Logo (chunky squishy wordmark)
// Built by custom-laying out each letter with rotation + fill variations.
// 4 variants: primary, stacked, mono-dark, mono-light

// Each letter is drawn as chunky filled text with a thick outline and a
// subtle gloss highlight — very Y2K bubble-letter.
function TTLetter({ char, color, outline, size = 96, rotate = 0, offsetY = 0, glossColor }) {
  const gloss = glossColor || 'rgba(255,255,255,.7)';
  return (
    <span style={{
      display: 'inline-block',
      position: 'relative',
      transform: `rotate(${rotate}deg) translateY(${offsetY}px)`,
      lineHeight: 0.85,
    }}>
      <span style={{
        position: 'relative',
        fontFamily: "'Lilita One', 'Fredoka', 'Rubik', sans-serif",
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        color: color,
        WebkitTextStroke: `${Math.max(2, size * 0.045)}px ${outline}`,
        paintOrder: 'stroke fill',
        textShadow: `${size * 0.03}px ${size * 0.05}px 0 ${outline}`,
        display: 'inline-block',
      }}>
        {char}
      </span>
    </span>
  );
}

// Primary horizontal wordmark
function TTLogo({
  size = 1,         // scale factor
  palette,          // { sun, melon, mint, ocean, plum, ink, cream }
  layout = 'inline',// 'inline' | 'stacked' | 'mono-dark' | 'mono-light'
  style = {},
}) {
  const p = palette || {
    sun:'#FFD166', melon:'#EF476F', mint:'#06D6A0', ocean:'#118AB2',
    plum:'#3D1766', ink:'#2B1055', cream:'#FFF4E0',
  };

  const s = size;
  const letterSize = 88 * s;
  const smallSize = 60 * s;

  let fills1, fills2, outline;
  if (layout === 'mono-dark') {
    fills1 = fills2 = Array(12).fill(p.ink);
    outline = p.ink;
  } else if (layout === 'mono-light') {
    fills1 = fills2 = Array(12).fill(p.cream);
    outline = p.cream;
  } else {
    fills1 = [p.melon, p.sun, p.mint, p.ocean, p.melon]; // TASTE
    fills2 = [p.sun, p.mint, p.ocean, p.melon, p.sun, p.mint]; // TESTER
    outline = p.ink;
  }

  const tilts1 = [-6, 3, -2, 4, -4];
  const tilts2 = [2, -3, 4, -2, 3, -4];
  const ys1 =    [0, 6, -4, 8, 2];
  const ys2 =    [-2, 6, 0, 8, -3, 4];

  const TasteRow = (
    <span style={{ whiteSpace: 'nowrap' }}>
      {'TASTE'.split('').map((ch, i) => (
        <TTLetter key={i} char={ch} color={fills1[i]} outline={outline}
          size={letterSize} rotate={tilts1[i]} offsetY={ys1[i]}/>
      ))}
    </span>
  );

  const TesterRow = (
    <span style={{ whiteSpace: 'nowrap' }}>
      {'TESTER'.split('').map((ch, i) => (
        <TTLetter key={i} char={ch} color={fills2[i]} outline={outline}
          size={layout === 'stacked' ? letterSize : smallSize}
          rotate={tilts2[i]} offsetY={ys2[i]}/>
      ))}
    </span>
  );

  if (layout === 'stacked') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: letterSize * 0.05, ...style }}>
        {TasteRow}
        {TesterRow}
      </div>
    );
  }

  // inline: TASTE TESTER with a tiny dot separator
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: letterSize * 0.12, ...style }}>
      {TasteRow}
      <span style={{
        width: letterSize * 0.22, height: letterSize * 0.22,
        borderRadius: '50%', background: outline,
        display: 'inline-block', flexShrink: 0,
        boxShadow: `inset -${letterSize * 0.05}px -${letterSize * 0.05}px 0 rgba(0,0,0,.25), inset ${letterSize * 0.05}px ${letterSize * 0.05}px 0 rgba(255,255,255,.25)`,
      }}/>
      {TesterRow}
    </div>
  );
}

// Compact circular app icon / badge
function TTMonogram({ size = 140, palette, style = {} }) {
  const p = palette;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: `radial-gradient(circle at 30% 26%, ${p.sun}, ${p.melon} 60%, ${p.plum})`,
      boxShadow: `inset 0 -${size * 0.1}px ${size * 0.14}px rgba(0,0,0,.25), inset 0 ${size * 0.12}px ${size * 0.12}px rgba(255,255,255,.35), 0 ${size * 0.08}px ${size * 0.16}px rgba(0,0,0,.2)`,
      border: `${Math.max(3, size * 0.025)}px solid ${p.ink}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <span style={{
        fontFamily: "'Lilita One', 'Fredoka', sans-serif",
        fontSize: size * 0.52, color: p.cream,
        WebkitTextStroke: `${size * 0.025}px ${p.ink}`,
        paintOrder: 'stroke fill',
        lineHeight: 1, letterSpacing: -size * 0.02,
        transform: 'rotate(-6deg)',
      }}>
        TT
      </span>
      {/* sparkle */}
      <div style={{ position: 'absolute', top: size * 0.12, right: size * 0.14 }}>
        <TTStar size={size * 0.14} color={p.cream}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TTLockup — monogram + "Taste Tester" wordmark
// Variants:
//   horizontal — monogram left, name stacked on right
//   stacked    — monogram on top, name below
//   mono-dark  — all ink color (for light backgrounds, single color wordmark + monogram still keeps its gradient)
//   mono-light — all cream color
// ─────────────────────────────────────────────────────────────
function TTLockup({
  size = 1,
  palette,
  layout = 'horizontal', // 'horizontal' | 'stacked'
  tone = 'color',        // 'color' | 'dark' | 'light'
  font = "'Alfa Slab One', 'Lilita One', 'Fredoka', sans-serif",
  style = {},
}) {
  const p = palette || {
    sun:'#FFD166', melon:'#EF476F', mint:'#06D6A0', ocean:'#118AB2',
    plum:'#3D1766', ink:'#2B1055', cream:'#FFF4E0',
  };
  const monogramSize = 140 * size;
  const nameSize = 56 * size;
  const subSize = 20 * size;

  const textColor = tone === 'light' ? p.cream : p.ink;

  const Name = (
    <div style={{ display:'flex', flexDirection:'column', lineHeight: 0.88, letterSpacing: -nameSize * 0.02 }}>
      <span style={{
        fontFamily: font, fontSize: nameSize, fontWeight: 900,
        color: textColor,
        textTransform: 'uppercase',
      }}>Taste</span>
      <span style={{
        fontFamily: font, fontSize: nameSize, fontWeight: 900,
        color: textColor,
        textTransform: 'uppercase',
        marginTop: nameSize * 0.04,
      }}>Tester</span>
    </div>
  );

  if (layout === 'stacked') {
    return (
      <div style={{ display:'inline-flex', flexDirection:'column', alignItems:'center', gap: monogramSize * 0.15, ...style }}>
        <TTMonogram size={monogramSize} palette={p}/>
        <div style={{ textAlign:'center', lineHeight: 0.9 }}>
          <div style={{
            fontFamily: font, fontSize: nameSize, fontWeight: 900,
            color: textColor, textTransform: 'uppercase',
            letterSpacing: -nameSize * 0.015,
          }}>Taste Tester</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap: monogramSize * 0.16, ...style }}>
      <TTMonogram size={monogramSize} palette={p}/>
      {Name}
    </div>
  );
}

Object.assign(window, { TTLogo, TTMonogram, TTLetter, TTLockup });
