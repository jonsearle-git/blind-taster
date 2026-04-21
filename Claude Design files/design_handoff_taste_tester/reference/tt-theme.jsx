// Taste Tester — Theme, palettes, font stacks, and shared primitives
// Y2K candy pop: glossy bubbles, chunky letters, gradient sheens, sparkle accents

const TT_PALETTES = {
  'Candy Pop': {
    name: 'Candy Pop',
    cream:  '#FFF4E0',
    sun:    '#FFD166',
    melon:  '#EF476F',
    mint:   '#06D6A0',
    ocean:  '#118AB2',
    plum:   '#3D1766',
    ink:    '#2B1055',
  },
  'Sour Sweet': {
    name: 'Sour Sweet',
    cream:  '#FFF8E7',
    sun:    '#FFE14D',
    melon:  '#FF5D8F',
    mint:   '#7CFFB2',
    ocean:  '#4DA8FF',
    plum:   '#6B21A8',
    ink:    '#1B0B3A',
  },
  'Sorbet': {
    name: 'Sorbet',
    cream:  '#FFEFE0',
    sun:    '#FFB86B',
    melon:  '#FF6E9C',
    mint:   '#9AE8C5',
    ocean:  '#7CA9F5',
    plum:   '#4B1D6E',
    ink:    '#2D1A47',
  },
  'Arcade': {
    name: 'Arcade',
    cream:  '#1A0B2E',
    sun:    '#FFE600',
    melon:  '#FF2E93',
    mint:   '#00F0B5',
    ocean:  '#2DD4FF',
    plum:   '#8B2FC9',
    ink:    '#FFFFFF',
  },
};

const TT_FONTS = {
  'Rubik + Grotesk': {
    display: "'Rubik Mono One', 'Rubik', system-ui, sans-serif",
    heading: "'Rubik', system-ui, sans-serif",
    body:    "'Space Grotesk', system-ui, sans-serif",
    importance: 'display',
  },
  'Bungee + Inter': {
    display: "'Bungee', system-ui, sans-serif",
    heading: "'Bungee Inline', system-ui, sans-serif",
    body:    "'Nunito', system-ui, sans-serif",
    importance: 'display',
  },
  'Fraunces + DM': {
    display: "'Alfa Slab One', 'Fraunces', serif",
    heading: "'Fraunces', serif",
    body:    "'DM Sans', system-ui, sans-serif",
    importance: 'display',
  },
  'Chunky Script': {
    display: "'Lilita One', 'Fredoka', sans-serif",
    heading: "'Fredoka', sans-serif",
    body:    "'Nunito', system-ui, sans-serif",
    importance: 'display',
  },
};

const TT_CARD_FEELS = {
  'Jelly': {
    name: 'Jelly',
    radius: 36,
    shadow: '0 12px 0 rgba(0,0,0,.08), 0 20px 40px rgba(61, 23, 102, 0.18)',
    inner:  'inset 0 -8px 0 rgba(0,0,0,.06), inset 0 6px 0 rgba(255,255,255,.7)',
    border: 'none',
  },
  'Sticker': {
    name: 'Sticker',
    radius: 28,
    shadow: '6px 6px 0 #2B1055',
    inner:  'none',
    border: '3px solid #2B1055',
  },
  'Glossy Bubble': {
    name: 'Glossy Bubble',
    radius: 48,
    shadow: '0 24px 60px rgba(61,23,102,.22), 0 8px 12px rgba(61,23,102,.1)',
    inner:  'inset 0 -12px 20px rgba(0,0,0,.05), inset 0 18px 24px rgba(255,255,255,.55)',
    border: 'none',
  },
  'Chrome Inline': {
    name: 'Chrome Inline',
    radius: 24,
    shadow: '0 8px 24px rgba(0,0,0,.12)',
    inner:  'inset 0 0 0 2px rgba(255,255,255,.9), inset 0 0 0 5px rgba(0,0,0,.85)',
    border: 'none',
  },
};

// ─────────────────────────────────────────────────────────────
// Y2K decorative primitives
// ─────────────────────────────────────────────────────────────

// Four-point sparkle / star
function TTStar({ size = 24, color = '#fff', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M12 0 C12 7, 17 12, 24 12 C17 12, 12 17, 12 24 C12 17, 7 12, 0 12 C7 12, 12 7, 12 0 Z"
        fill={color} />
    </svg>
  );
}

// Flower / daisy (Y2K staple)
function TTFlower({ size = 40, color = '#EF476F', center = '#FFD166', style = {} }) {
  const petals = Array.from({ length: 6 });
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={style}>
      {petals.map((_, i) => {
        const a = (i * 60 * Math.PI) / 180;
        const cx = Math.cos(a) * 22;
        const cy = Math.sin(a) * 22;
        return <circle key={i} cx={cx} cy={cy} r="18" fill={color} />;
      })}
      <circle cx="0" cy="0" r="14" fill={center} />
    </svg>
  );
}

// Glossy blob with highlight
function TTBlob({ size = 120, color = '#EF476F', style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,.85), rgba(255,255,255,0) 38%), ${color}`,
      boxShadow: `inset 0 -${size * 0.1}px ${size * 0.15}px rgba(0,0,0,.18)`,
      ...style,
    }} />
  );
}

// Wavy gradient background
function TTWavyBg({ colors, opacity = 0.9, style = {} }) {
  // colors: array of hex
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', ...style,
    }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 400 800">
        <defs>
          <linearGradient id="ttg1" x1="0" y1="0" x2="1" y2="1">
            {colors.map((c, i) => <stop key={i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={c}/>)}
          </linearGradient>
        </defs>
        <rect width="400" height="800" fill={`url(#ttg1)`} opacity={opacity}/>
      </svg>
    </div>
  );
}

// Checker / halftone dots pattern overlay
function TTDots({ color = 'rgba(255,255,255,.5)', size = 14, style = {} }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.6px)`,
      backgroundSize: `${size}px ${size}px`,
      ...style,
    }} />
  );
}

// Sticker wrapper (thick outline + drop shadow offset)
function TTSticker({ children, color, outline = '#2B1055', offset = 5, radius = 28, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      background: color,
      border: `3px solid ${outline}`,
      borderRadius: radius,
      boxShadow: `${offset}px ${offset}px 0 ${outline}`,
      ...style,
    }}>{children}</div>
  );
}

// Bouncy pill button
function TTPill({ children, color = '#EF476F', text = '#fff', outline = '#2B1055', size = 'md', style = {}, onClick }) {
  const sizes = {
    sm: { h: 36, px: 16, fs: 13 },
    md: { h: 52, px: 28, fs: 17 },
    lg: { h: 68, px: 40, fs: 22 },
    xl: { h: 84, px: 52, fs: 28 },
  }[size] || { h: 52, px: 28, fs: 17 };
  return (
    <button onClick={onClick} style={{
      height: sizes.h, padding: `0 ${sizes.px}px`,
      fontSize: sizes.fs, fontWeight: 800, letterSpacing: 0.5,
      color: text, background: color,
      border: `3px solid ${outline}`,
      borderRadius: sizes.h,
      boxShadow: `0 6px 0 ${outline}`,
      boxSizing: 'border-box',
      cursor: 'pointer', fontFamily: 'inherit',
      textTransform: 'uppercase',
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <span style={{
        position: 'absolute', top: 4, left: '10%', right: '10%', height: '40%',
        borderRadius: 999,
        background: 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0))',
        pointerEvents: 'none',
      }}/>
      <span style={{ position: 'relative' }}>{children}</span>
    </button>
  );
}

Object.assign(window, {
  TT_PALETTES, TT_FONTS, TT_CARD_FEELS,
  TTStar, TTFlower, TTBlob, TTWavyBg, TTDots, TTSticker, TTPill,
});
