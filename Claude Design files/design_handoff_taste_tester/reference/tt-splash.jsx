// Taste Tester — 4 Splash Screen variants
// All sized for iOS phone viewport (402 x 874), placed inside IOSDevice frame.

// ── Splash 1: Gradient wash with glossy bubbles floating ────────────
function TTSplash1({ palette: p, fonts }) {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: `linear-gradient(155deg, ${p.melon} 0%, ${p.sun} 45%, ${p.mint} 100%)`,
      fontFamily: fonts.body,
    }}>
      {/* Floating glossy blobs */}
      <TTBlob size={180} color={p.ocean} style={{ position:'absolute', top:-40, left:-60 }}/>
      <TTBlob size={120} color={p.mint} style={{ position:'absolute', top:90, right:-30 }}/>
      <TTBlob size={90}  color={p.melon} style={{ position:'absolute', bottom:180, left:-20 }}/>
      <TTBlob size={160} color={p.plum} style={{ position:'absolute', bottom:-50, right:-40 }}/>
      <TTBlob size={60}  color={p.sun} style={{ position:'absolute', top:260, left:40 }}/>

      {/* Sparkles */}
      <TTStar size={32} color={p.cream} style={{ position:'absolute', top:140, right:60 }}/>
      <TTStar size={20} color={p.ink} style={{ position:'absolute', top:220, left:60 }}/>
      <TTStar size={44} color={p.cream} style={{ position:'absolute', bottom:280, right:40 }}/>

      {/* Content */}
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'0 24px',
        textAlign:'center', gap:32,
      }}>
        <div style={{ transform:'scale(.95)' }}>
          <TTLockup size={0.7} palette={p} layout="stacked" tone="dark" font={fonts.display}/>
        </div>
        <div style={{
          fontFamily: fonts.body, fontSize:16, fontWeight:700,
          color:p.ink, background:p.cream, padding:'10px 18px',
          borderRadius:999, border:`2.5px solid ${p.ink}`,
          boxShadow:`3px 3px 0 ${p.ink}`,
          textTransform:'uppercase', letterSpacing:1,
        }}>
          Sniff · Swirl · Settle the score
        </div>
      </div>

      {/* Bottom CTA area */}
      <div style={{ position:'absolute', bottom:56, left:0, right:0, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
        <TTPill color={p.ink} text={p.cream} outline={p.ink} size="lg" style={{ fontFamily: fonts.heading }}>
          Start tasting
        </TTPill>
        <div style={{ fontSize:13, color:p.ink, opacity:.7, fontWeight:600 }}>
          v1.0 · Pour one out
        </div>
      </div>
    </div>
  );
}

// ── Splash 2: Checkerboard floor + big stacked wordmark ─────────────
function TTSplash2({ palette: p, fonts }) {
  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background: p.cream, fontFamily: fonts.body,
    }}>
      {/* Top wavy strip */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:360,
        background: `linear-gradient(180deg, ${p.melon}, ${p.sun})`,
        borderBottomLeftRadius:'100% 40px',
        borderBottomRightRadius:'100% 40px',
      }}/>
      {/* Halftone dots on top strip */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:360, overflow:'hidden' }}>
        <TTDots color="rgba(255,255,255,.35)" size={18}/>
      </div>

      {/* Sparkles */}
      <TTStar size={36} color={p.cream} style={{ position:'absolute', top:110, left:40 }}/>
      <TTStar size={22} color={p.ink} style={{ position:'absolute', top:170, right:60 }}/>
      <TTFlower size={52} color={p.mint} center={p.sun} style={{ position:'absolute', top:30, right:30 }}/>

      {/* Logo stacked */}
      <div style={{ position:'absolute', top:130, left:0, right:0, display:'flex', justifyContent:'center' }}>
        <TTLockup size={0.75} palette={p} layout="stacked" tone="light" font={fonts.display}/>
      </div>

      {/* Bottom checker + CTA */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:340,
        background: `repeating-conic-gradient(${p.ink} 0% 25%, ${p.sun} 0% 50%) 50% / 40px 40px`,
        opacity:.15,
      }}/>
      <div style={{
        position:'absolute', bottom:120, left:0, right:0,
        display:'flex', flexDirection:'column', alignItems:'center', gap:18,
      }}>
        <div style={{
          fontFamily: fonts.body, fontSize:15, fontWeight:800,
          color:p.ink, letterSpacing:2, textTransform:'uppercase',
        }}>
          Party game · 4–12 players
        </div>
        <TTPill color={p.melon} text={p.cream} outline={p.ink} size="lg" style={{ fontFamily: fonts.heading }}>
          Let's Pour In
        </TTPill>
      </div>
    </div>
  );
}

// ── Splash 3: Full-bleed tickertape pattern ─────────────────────────
function TTSplash3({ palette: p, fonts }) {
  const stripe = (color, angle) => ({
    position:'absolute', width:'180%', height:70,
    background: color, left:-40,
    transform: `rotate(${angle}deg)`,
    display:'flex', alignItems:'center', overflow:'hidden',
  });
  const repeatText = (text, color) => (
    <span style={{
      whiteSpace:'nowrap', fontFamily: fonts.display,
      fontSize:38, fontWeight:900, color, letterSpacing:2,
      textTransform:'uppercase',
    }}>
      {Array(10).fill(text).map((t,i)=>(
        <span key={i} style={{ marginRight:18 }}>{t} ✦</span>
      ))}
    </span>
  );

  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background: p.plum, fontFamily: fonts.body,
    }}>
      {/* Diagonal text stripes */}
      <div style={{ ...stripe(p.sun, -12), top:80 }}>{repeatText('Taste Tester', p.ink)}</div>
      <div style={{ ...stripe(p.mint, -12), top:170 }}>{repeatText('Sip Score Scandal', p.ink)}</div>
      <div style={{ ...stripe(p.melon, -12), top:260 }}>{repeatText('Taste Tester', p.cream)}</div>
      <div style={{ ...stripe(p.ocean, -12), top:580 }}>{repeatText('Sniff Swirl Settle', p.cream)}</div>
      <div style={{ ...stripe(p.sun, -12), top:670 }}>{repeatText('Taste Tester', p.ink)}</div>

      {/* Centered logo card */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%, -50%) rotate(-3deg)',
      }}>
        <TTSticker color={p.cream} outline={p.ink} offset={8} radius={32} style={{ padding:'28px 28px 24px' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
            <TTLockup size={0.65} palette={p} layout="stacked" tone="dark" font={fonts.display}/>
            <TTPill color={p.melon} text={p.cream} outline={p.ink} size="md" style={{ fontFamily: fonts.heading }}>
              Tap to start
            </TTPill>
          </div>
        </TTSticker>
      </div>

      {/* Corner sparkles */}
      <TTStar size={40} color={p.sun} style={{ position:'absolute', top:30, right:30 }}/>
      <TTStar size={28} color={p.mint} style={{ position:'absolute', bottom:60, left:30 }}/>
    </div>
  );
}

// ── Splash 4: Concentric bubble rings + app icon hero ───────────────
function TTSplash4({ palette: p, fonts }) {
  const rings = [540, 440, 340, 240];
  const ringColors = [p.ocean, p.mint, p.sun, p.melon];

  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background: p.cream, fontFamily: fonts.body,
    }}>
      {/* Concentric rings centered */}
      {rings.map((r, i) => (
        <div key={r} style={{
          position:'absolute', top:'38%', left:'50%',
          width:r, height:r, borderRadius:'50%',
          transform:'translate(-50%, -50%)',
          background: ringColors[i],
          boxShadow: `inset 0 -${r*0.06}px ${r*0.08}px rgba(0,0,0,.1), inset 0 ${r*0.07}px ${r*0.07}px rgba(255,255,255,.5)`,
          border: `3px solid ${p.ink}`,
        }}/>
      ))}

      {/* Center monogram */}
      <div style={{
        position:'absolute', top:'38%', left:'50%',
        transform:'translate(-50%, -50%)',
        zIndex: 2,
      }}>
        <TTMonogram size={140} palette={p}/>
      </div>

      {/* Sparkles around */}
      <TTStar size={30} color={p.ink} style={{ position:'absolute', top:80, left:50 }}/>
      <TTStar size={24} color={p.ink} style={{ position:'absolute', top:120, right:70 }}/>
      <TTStar size={20} color={p.cream} style={{ position:'absolute', top:320, left:60 }}/>

      {/* Wordmark + tagline at bottom */}
      <div style={{
        position:'absolute', bottom:120, left:0, right:0,
        display:'flex', flexDirection:'column', alignItems:'center', gap:20,
      }}>
        <div style={{
          fontFamily: fonts.display, fontSize:44, fontWeight:900,
          color:p.ink, textTransform:'uppercase', letterSpacing:-.5, lineHeight:1,
        }}>Taste Tester</div>
        <div style={{
          fontFamily: fonts.body, fontSize:14, fontWeight:800,
          color:p.ink, letterSpacing:3, textTransform:'uppercase',
          padding:'6px 14px', border:`2px solid ${p.ink}`, borderRadius:999,
        }}>
          The taste-off party game
        </div>
        <TTPill color={p.mint} text={p.ink} outline={p.ink} size="md" style={{ fontFamily: fonts.heading, marginTop:8 }}>
          New game →
        </TTPill>
      </div>
    </div>
  );
}

Object.assign(window, { TTSplash1, TTSplash2, TTSplash3, TTSplash4 });
