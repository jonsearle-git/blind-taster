// Blind Taster — Shared app chrome: top bar, FAB, status pills, etc.

// ── Top app bar with branded sticker back button ────────────────────
function BTAppBar({ title, palette: p, fonts, onBack = true, trailing = null }) {
  return (
    <div style={{
      paddingTop: 62, paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
      position: 'relative', display: 'flex', alignItems: 'center',
    }}>
      {onBack && (
        <div style={{
          width: 44, height: 44, borderRadius: 22,
          background: p.cream,
          border: `2.5px solid ${p.ink}`,
          boxShadow: `3px 3px 0 ${p.ink}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10 1L4 7l6 6" stroke={p.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 62, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: fonts.heading, fontSize: 22, fontWeight: 800,
          color: p.ink, letterSpacing: -0.3,
        }}>{title}</span>
      </div>
      <div style={{ flex: 1 }}/>
      {trailing}
    </div>
  );
}

// ── Section title (uppercase mini-cap) ───────────────────────────────
function BTSectionLabel({ children, palette: p, color, style = {} }) {
  return (
    <div style={{
      fontFamily: 'DM Sans, system-ui, sans-serif',
      fontSize: 12, fontWeight: 900, letterSpacing: 2,
      textTransform: 'uppercase', color: color || p.ink, opacity: 0.7,
      ...style,
    }}>{children}</div>
  );
}

// ── Branded settings FAB (replaces the grey cog) ─────────────────────
function BTSettingsFab({ palette: p, style = {} }) {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 16, zIndex: 20,
      width: 48, height: 48, borderRadius: 24,
      background: p.ocean, border: `2.5px solid ${p.ink}`,
      boxShadow: `3px 3px 0 ${p.ink}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 14a3 3 0 100-6 3 3 0 000 6z" stroke={p.cream} strokeWidth="2"/>
        <path d="M18 11a7 7 0 00-.15-1.42l2-1.55-2-3.46-2.36.95a7 7 0 00-2.47-1.42L13 1.5h-4l-.02 2.6a7 7 0 00-2.47 1.42L4.15 4.57l-2 3.46 2 1.55A7 7 0 004 11c0 .48.05.95.15 1.42l-2 1.55 2 3.46 2.36-.95a7 7 0 002.47 1.42L9 20.5h4l.02-2.6a7 7 0 002.47-1.42l2.36.95 2-3.46-2-1.55c.1-.47.15-.94.15-1.42z" stroke={p.cream} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ── Sticker card primitive (consistent for every screen) ─────────────
function BTCard({ children, palette: p, color, style = {}, padding = 18, radius = 24, shadow = 5, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: color || p.cream,
      border: `2.5px solid ${p.ink}`,
      borderRadius: radius,
      boxShadow: `${shadow}px ${shadow}px 0 ${p.ink}`,
      padding,
      ...style,
    }}>{children}</div>
  );
}

// ── Inline text input (sticker style) ────────────────────────────────
function BTInput({ value = '', placeholder, palette: p, fonts, style = {} }) {
  return (
    <div style={{
      background: p.cream,
      border: `2.5px solid ${p.ink}`,
      borderRadius: 999,
      boxShadow: `3px 3px 0 ${p.ink}`,
      padding: '14px 20px',
      fontFamily: fonts.body, fontSize: 16, fontWeight: 500,
      color: value ? p.ink : 'rgba(43,16,85,0.4)',
      ...style,
    }}>
      {value || placeholder}
    </div>
  );
}

// ── Selectable chip (used in MCQ-text questions and tag lists) ──────
function BTChip({ children, on, palette: p, color, textColor, style = {} }) {
  const fill = on ? (color || p.melon) : 'transparent';
  const text = on ? (textColor || p.cream) : p.ink;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '10px 18px', borderRadius: 999,
      fontSize: 14, fontWeight: 800, letterSpacing: 0.3,
      background: fill, color: text,
      border: `2.5px solid ${p.ink}`,
      boxShadow: on ? `3px 3px 0 ${p.ink}` : 'none',
      transform: on ? 'translate(-1px,-1px)' : 'none',
      ...style,
    }}>{children}</div>
  );
}

// ── Status pill (small) ─────────────────────────────────────────────
function BTPill({ children, palette: p, color, textColor, style = {} }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 12px', borderRadius: 999,
      fontSize: 11, fontWeight: 900, letterSpacing: 1.4, textTransform: 'uppercase',
      background: color || p.sun, color: textColor || p.ink,
      border: `2px solid ${p.ink}`,
      ...style,
    }}>{children}</div>
  );
}

// ── Primary CTA pill (with gloss) ───────────────────────────────────
function BTCta({ children, palette: p, fonts, color, textColor, size = 'lg', disabled = false, style = {} }) {
  const sizes = { md: { h: 52, fs: 16 }, lg: { h: 62, fs: 19 } }[size];
  return (
    <button disabled={disabled} style={{
      width: '100%', height: sizes.h,
      background: disabled ? 'rgba(239,71,111,0.45)' : (color || p.melon),
      border: `2.5px solid ${disabled ? 'rgba(43,16,85,.45)' : p.ink}`,
      boxShadow: disabled ? 'none' : `5px 5px 0 ${p.ink}`,
      borderRadius: 999,
      fontFamily: fonts.display, fontSize: sizes.fs, fontWeight: 900,
      letterSpacing: 1, textTransform: 'uppercase',
      color: disabled ? 'rgba(43,16,85,.45)' : (textColor || p.cream),
      cursor: disabled ? 'default' : 'pointer',
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      {!disabled && (
        <span style={{
          position: 'absolute', top: 4, left: '10%', right: '10%', height: '40%',
          borderRadius: 999,
          background: 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0))',
          pointerEvents: 'none',
        }}/>
      )}
      <span style={{ position: 'relative' }}>{children}</span>
    </button>
  );
}

// ── Outline CTA pill (secondary) ────────────────────────────────────
function BTOutlineCta({ children, palette: p, fonts, size = 'lg', style = {} }) {
  const sizes = { md: { h: 52, fs: 16 }, lg: { h: 62, fs: 19 } }[size];
  return (
    <button style={{
      width: '100%', height: sizes.h,
      background: p.cream,
      border: `2.5px solid ${p.ink}`,
      boxShadow: `5px 5px 0 ${p.ink}`,
      borderRadius: 999,
      fontFamily: fonts.display, fontSize: sizes.fs, fontWeight: 900,
      letterSpacing: 1, textTransform: 'uppercase', color: p.ink,
      cursor: 'pointer',
      ...style,
    }}>
      {children}
    </button>
  );
}

// ── Avatar circle ───────────────────────────────────────────────────
function BTAvatar({ name, palette: p, color, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color || p.melon,
      border: `2.5px solid ${p.ink}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      fontWeight: 900, fontSize: size * 0.4, color: p.cream,
      flexShrink: 0,
    }}>{name[0].toUpperCase()}</div>
  );
}

// ── Wrapper for screens — full-bleed cream bg ───────────────────────
function BTScreen({ children, palette: p, bg, style = {} }) {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: bg || p.cream,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      ...style,
    }}>{children}</div>
  );
}

// ── Dialog (modal with title, message, Cancel + OK buttons) ─────────
// Variants:
//   intent="default"  — OK button melon (primary)
//   intent="danger"   — OK button melon, with a melon header tile + warning glyph
//   intent="success"  — OK button mint
// `behind` slot lets you render a faded screen behind it (otherwise plum scrim only).
function BTDialog({
  palette: p, fonts,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  okLabel = 'OK',
  cancelLabel = 'Cancel',
  intent = 'default',
  icon = null,           // optional override
  behind = null,         // optional ReactNode rendered + dimmed behind dialog
  rotate = -1,
  width = 296,
}) {
  const accent = intent === 'danger' ? p.melon : intent === 'success' ? p.mint : p.sun;
  const accentText = intent === 'danger' ? p.cream : p.ink;
  const okColor = intent === 'success' ? p.mint : p.melon;
  const okText  = intent === 'success' ? p.ink   : p.cream;
  const defaultIcon = intent === 'danger' ? '!' : intent === 'success' ? '✓' : '?';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50 }}>
      {/* Behind (optional dimmed app content) + scrim */}
      {behind && (
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
          {behind}
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(43,16,85,0.55)' }}/>

      {/* Dialog card */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        width,
      }}>
        <div style={{
          background: p.cream,
          border: `3px solid ${p.ink}`,
          borderRadius: 26,
          boxShadow: `8px 8px 0 ${p.ink}`,
          padding: '22px 22px 20px',
        }}>
          {/* Icon tile */}
          <div style={{
            width: 54, height: 54, borderRadius: 14,
            background: accent, border: `2.5px solid ${p.ink}`,
            boxShadow: `3px 3px 0 ${p.ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fonts.display, fontSize: 28, fontWeight: 900, color: accentText,
            marginBottom: 14, transform: 'rotate(-3deg)',
          }}>{icon ?? defaultIcon}</div>

          {/* Title */}
          <div style={{
            fontFamily: fonts.heading, fontSize: 22, fontWeight: 800,
            color: p.ink, letterSpacing: -0.2, lineHeight: 1.15,
          }}>{title}</div>

          {/* Message */}
          <div style={{
            fontFamily: fonts.body, fontSize: 14, fontWeight: 500,
            color: p.ink, opacity: 0.75, marginTop: 6, lineHeight: 1.4,
          }}>{message}</div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <BTOutlineCta palette={p} fonts={fonts} size="md" style={{ flex: 1 }}>
              {cancelLabel}
            </BTOutlineCta>
            <BTCta palette={p} fonts={fonts} size="md" color={okColor} textColor={okText} style={{ flex: 1 }}>
              {okLabel}
            </BTCta>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  BTAppBar, BTSectionLabel, BTSettingsFab, BTCard, BTInput, BTChip, BTPill,
  BTCta, BTOutlineCta, BTAvatar, BTScreen, BTDialog,
});
