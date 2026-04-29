// Blind Taster — Round/Questionnaire screen + component samples + theme sheet

// ── Round Screen: taste questionnaire ───────────────────────────────
function TTRoundScreen({ palette: p, fonts, cardFeel }) {
  const [selected, setSelected] = React.useState(2);
  const [notes, setNotes] = React.useState('');

  const flavors = [
    { label: 'Buttery',  color: p.sun },
    { label: 'Tangy',    color: p.mint },
    { label: 'Smokey',   color: p.plum, textInvert: true },
    { label: 'Floral',   color: p.melon },
    { label: 'Oaky',     color: p.ocean, textInvert: true },
    { label: 'Zesty',    color: p.sun },
  ];

  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background: `linear-gradient(180deg, ${p.cream} 0%, ${p.cream} 60%, ${p.mint} 100%)`,
      fontFamily: fonts.body,
      display:'flex', flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{
        padding:'72px 20px 14px', display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          background: p.cream, padding:'6px 14px 6px 8px',
          border:`2.5px solid ${p.ink}`, borderRadius:999,
          boxShadow:`3px 3px 0 ${p.ink}`,
        }}>
          <div style={{
            width:26, height:26, borderRadius:'50%', background: p.melon,
            border:`2px solid ${p.ink}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:13, fontWeight:900, color:p.cream,
          }}>3</div>
          <span style={{ fontSize:13, fontWeight:800, color:p.ink, letterSpacing:1, textTransform:'uppercase' }}>
            of 7
          </span>
        </div>
        <div style={{
          background: p.sun, padding:'6px 14px', borderRadius:999,
          border:`2.5px solid ${p.ink}`, boxShadow:`3px 3px 0 ${p.ink}`,
          fontSize:13, fontWeight:900, color:p.ink, letterSpacing:1,
        }}>
          ⏱ 0:42
        </div>
      </div>

      {/* Sample label */}
      <div style={{ padding:'14px 20px 8px', textAlign:'center' }}>
        <div style={{ fontSize:12, fontWeight:800, color:p.ink, opacity:.65, letterSpacing:3, textTransform:'uppercase' }}>
          Sample
        </div>
        <div style={{
          display:'inline-block', marginTop:4,
          fontFamily: fonts.display, fontSize:56, fontWeight:900,
          color:p.melon, letterSpacing:-1, lineHeight:1,
          WebkitTextStroke:`3px ${p.ink}`, paintOrder:'stroke fill',
          textShadow:`3px 4px 0 ${p.ink}`,
          transform:'rotate(-2deg)',
        }}>
          GLASS C
        </div>
      </div>

      {/* Question card */}
      <div style={{
        margin:'10px 16px 14px', padding:'22px 22px 24px',
        background: p.cream,
        border: cardFeel.border, borderRadius: cardFeel.radius,
        boxShadow: `${cardFeel.shadow}${cardFeel.inner && cardFeel.inner !== 'none' ? ', ' + cardFeel.inner : ''}`,
        position:'relative',
      }}>
        <TTStar size={24} color={p.melon} style={{ position:'absolute', top:-12, right:20 }}/>
        <div style={{ fontSize:13, fontWeight:800, color:p.ink, opacity:.6, letterSpacing:2, textTransform:'uppercase' }}>
          Question 1 of 3
        </div>
        <div style={{
          fontFamily: fonts.heading, fontSize:26, fontWeight:800,
          color:p.ink, lineHeight:1.15, marginTop:6, letterSpacing:-.3,
        }}>
          Which flavors do you pick up?
        </div>
        <div style={{ fontSize:13, color:p.ink, opacity:.65, marginTop:6 }}>
          Tap all that apply — be honest, no judgement.
        </div>

        {/* Flavor chips */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:16 }}>
          {flavors.map((f, i) => {
            const on = i === selected || i === 1 || i === 4;
            return (
              <button key={f.label} onClick={()=>setSelected(i)}
                style={{
                  padding:'10px 16px', borderRadius:999,
                  fontSize:14, fontWeight:800, letterSpacing:.5,
                  fontFamily:'inherit', cursor:'pointer',
                  background: on ? f.color : 'transparent',
                  color: on ? (f.textInvert ? p.cream : p.ink) : p.ink,
                  border: `2.5px solid ${p.ink}`,
                  boxShadow: on ? `3px 3px 0 ${p.ink}` : 'none',
                  transform: on ? 'translate(-1px,-1px)' : 'none',
                }}>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating card */}
      <div style={{
        margin:'0 16px 14px', padding:'18px 22px',
        background: p.ocean,
        border: cardFeel.border, borderRadius: cardFeel.radius,
        boxShadow: `${cardFeel.shadow}${cardFeel.inner && cardFeel.inner !== 'none' ? ', ' + cardFeel.inner : ''}`,
      }}>
        <div style={{ fontSize:13, fontWeight:800, color:p.cream, opacity:.8, letterSpacing:2, textTransform:'uppercase' }}>
          Question 2 of 3
        </div>
        <div style={{
          fontFamily: fonts.heading, fontSize:22, fontWeight:800,
          color:p.cream, lineHeight:1.15, marginTop:6, letterSpacing:-.3,
        }}>
          Rate the vibe
        </div>
        {/* Slider track */}
        <div style={{ marginTop:16, position:'relative', height:40 }}>
          <div style={{
            position:'absolute', top:16, left:0, right:0, height:10,
            borderRadius:999, background: p.cream, border:`2px solid ${p.ink}`,
          }}/>
          <div style={{
            position:'absolute', top:16, left:0, width:'62%', height:10,
            borderRadius:999, background: p.sun, border:`2px solid ${p.ink}`,
          }}/>
          <div style={{
            position:'absolute', top:2, left:'58%', width:36, height:36,
            borderRadius:'50%', background: p.melon, border:`3px solid ${p.ink}`,
            boxShadow:`3px 3px 0 ${p.ink}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14, fontWeight:900, color:p.cream,
          }}>7</div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:11, fontWeight:800, color:p.cream, opacity:.85, letterSpacing:1, textTransform:'uppercase' }}>
          <span>Pond water</span>
          <span>Pure bliss</span>
        </div>
      </div>

      {/* Submit */}
      <div style={{ flex:1 }}/>
      <div style={{ padding:'0 16px 20px', display:'flex', justifyContent:'center' }}>
        <TTPill color={p.melon} text={p.cream} outline={p.ink} size="lg" style={{ fontFamily: fonts.heading, width:'100%', maxWidth:320 }}>
          Lock it in →
        </TTPill>
      </div>
    </div>
  );
}

// ── Lobby screen: waiting for players ───────────────────────────────
function TTLobbyScreen({ palette: p, fonts, cardFeel }) {
  const players = [
    { name:'Maya',     color:p.melon, ready:true },
    { name:'Theo',     color:p.mint,  ready:true },
    { name:'Priya',    color:p.sun,   ready:true },
    { name:'Jules',    color:p.ocean, ready:false },
    { name:'Sam',      color:p.plum,  ready:false },
  ];
  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background: `linear-gradient(180deg, ${p.sun}, ${p.melon})`,
      fontFamily: fonts.body,
      display:'flex', flexDirection:'column',
    }}>
      {/* Sparkles */}
      <TTStar size={28} color={p.cream} style={{ position:'absolute', top:90, right:30 }}/>
      <TTStar size={18} color={p.ink} style={{ position:'absolute', top:160, left:30 }}/>

      <div style={{ padding:'72px 20px 0', textAlign:'center' }}>
        <div style={{ fontSize:12, fontWeight:800, color:p.ink, opacity:.7, letterSpacing:3, textTransform:'uppercase' }}>
          Room code
        </div>
        <div style={{
          display:'inline-block', marginTop:6, padding:'6px 20px',
          fontFamily: fonts.display, fontSize:42, fontWeight:900,
          color:p.ink, letterSpacing:4, lineHeight:1,
          background: p.cream,
          border:`3px solid ${p.ink}`, borderRadius:16,
          boxShadow:`5px 5px 0 ${p.ink}`,
        }}>
          BRIE7
        </div>
      </div>

      <div style={{ padding:'24px 16px 12px' }}>
        <div style={{
          fontFamily: fonts.heading, fontSize:22, fontWeight:800,
          color:p.ink, letterSpacing:-.2,
        }}>
          The crew {'('}3/5 ready{')'}
        </div>
      </div>

      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:10 }}>
        {players.map((pl, i) => (
          <div key={pl.name} style={{
            display:'flex', alignItems:'center', gap:12,
            padding:'12px 14px',
            background: p.cream,
            border: cardFeel.border, borderRadius: cardFeel.radius,
            boxShadow: cardFeel.shadow,
          }}>
            <div style={{
              width:40, height:40, borderRadius:'50%',
              background: pl.color, border:`2.5px solid ${p.ink}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, fontWeight:900, color:p.cream,
            }}>{pl.name[0]}</div>
            <div style={{ flex:1, fontSize:16, fontWeight:800, color:p.ink }}>{pl.name}</div>
            <div style={{
              fontSize:11, fontWeight:900, letterSpacing:1, textTransform:'uppercase',
              padding:'4px 10px', borderRadius:999,
              background: pl.ready ? p.mint : 'transparent',
              color: pl.ready ? p.ink : p.ink,
              border:`2px solid ${p.ink}`, opacity: pl.ready ? 1 : .55,
            }}>{pl.ready ? 'Ready' : 'Pouring…'}</div>
          </div>
        ))}
      </div>

      <div style={{ flex:1 }}/>
      <div style={{ padding:'0 16px 20px', display:'flex', justifyContent:'center' }}>
        <TTPill color={p.ink} text={p.cream} outline={p.ink} size="lg" style={{ fontFamily: fonts.heading, width:'100%', maxWidth:320 }}>
          Start the round
        </TTPill>
      </div>
    </div>
  );
}

// ── Theme / Style Guide sheet ───────────────────────────────────────
function TTThemeSheet({ palette: p, fonts, cardFeel }) {
  const SwatchBlock = ({ name, hex, text }) => (
    <div style={{ background: hex, padding:'18px 14px 14px', borderRadius:18, border:`2px solid ${p.ink}`, color: text, minHeight:100 }}>
      <div style={{ fontSize:11, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase', opacity:.85 }}>{name}</div>
      <div style={{ fontFamily: fonts.display, fontSize:20, fontWeight:900, marginTop:20, letterSpacing:-.2 }}>{hex}</div>
    </div>
  );

  return (
    <div style={{
      width:'100%', height:'100%', background: p.cream, fontFamily: fonts.body,
      padding:'32px 28px', overflow:'auto', color: p.ink, boxSizing:'border-box',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <div style={{ fontSize:12, fontWeight:800, letterSpacing:3, textTransform:'uppercase', opacity:.6 }}>
            Brand System · v1.0
          </div>
          <div style={{ fontFamily: fonts.display, fontSize:62, fontWeight:900, lineHeight:.95, letterSpacing:-1, marginTop:4 }}>
            Blind Taster
          </div>
          <div style={{ fontSize:16, fontWeight:600, marginTop:6, opacity:.75 }}>
            Sniff · Swirl · Settle the score
          </div>
        </div>
        <TTMonogram size={110} palette={p}/>
      </div>

      {/* Palette */}
      <div style={{ fontSize:12, fontWeight:900, letterSpacing:2, textTransform:'uppercase', marginBottom:10, opacity:.65 }}>Palette</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10, marginBottom:26 }}>
        <SwatchBlock name="Cream"  hex={p.cream}  text={p.ink}/>
        <SwatchBlock name="Sun"    hex={p.sun}    text={p.ink}/>
        <SwatchBlock name="Melon"  hex={p.melon}  text={p.cream}/>
        <SwatchBlock name="Mint"   hex={p.mint}   text={p.ink}/>
        <SwatchBlock name="Ocean"  hex={p.ocean}  text={p.cream}/>
        <SwatchBlock name="Plum"   hex={p.plum}   text={p.cream}/>
        <SwatchBlock name="Ink"    hex={p.ink}    text={p.cream}/>
        <div style={{
          padding:'18px 14px', borderRadius:18, border:`2px solid ${p.ink}`,
          background:`linear-gradient(135deg, ${p.melon}, ${p.sun}, ${p.mint}, ${p.ocean})`,
          color: p.cream, minHeight:100,
        }}>
          <div style={{ fontSize:11, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase' }}>Party Mix</div>
          <div style={{ fontFamily: fonts.display, fontSize:17, fontWeight:900, marginTop:20 }}>Gradient</div>
        </div>
      </div>

      {/* Typography */}
      <div style={{ fontSize:12, fontWeight:900, letterSpacing:2, textTransform:'uppercase', marginBottom:10, opacity:.65 }}>Typography</div>
      <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:26 }}>
        <div style={{ padding:'16px 18px', background:p.cream, border:`2.5px solid ${p.ink}`, borderRadius:18, boxShadow:`4px 4px 0 ${p.ink}` }}>
          <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', opacity:.6 }}>Display · chunky</div>
          <div style={{ fontFamily: fonts.display, fontSize:52, fontWeight:900, lineHeight:1, letterSpacing:-.8 }}>Glass C, please.</div>
        </div>
        <div style={{ padding:'16px 18px', background:p.sun, border:`2.5px solid ${p.ink}`, borderRadius:18, boxShadow:`4px 4px 0 ${p.ink}` }}>
          <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', opacity:.6 }}>Heading</div>
          <div style={{ fontFamily: fonts.heading, fontSize:30, fontWeight:800, letterSpacing:-.3 }}>Which flavors do you pick up?</div>
        </div>
        <div style={{ padding:'16px 18px', background:p.mint, border:`2.5px solid ${p.ink}`, borderRadius:18, boxShadow:`4px 4px 0 ${p.ink}` }}>
          <div style={{ fontSize:11, fontWeight:900, letterSpacing:2, textTransform:'uppercase', opacity:.6 }}>Body</div>
          <div style={{ fontFamily: fonts.body, fontSize:16, lineHeight:1.4, color:p.ink }}>
            Tap all that apply — be honest, no judgement. Your answers stay secret until everyone locks in.
          </div>
        </div>
      </div>

      {/* Decorative motifs */}
      <div style={{ fontSize:12, fontWeight:900, letterSpacing:2, textTransform:'uppercase', marginBottom:10, opacity:.65 }}>Motifs</div>
      <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap', marginBottom:26,
        padding:'22px 18px', background:`radial-gradient(circle at 20% 30%, ${p.melon}, ${p.plum})`,
        borderRadius:24, border:`2.5px solid ${p.ink}` }}>
        <TTStar size={48} color={p.sun}/>
        <TTStar size={32} color={p.cream}/>
        <TTFlower size={64} color={p.mint} center={p.sun}/>
        <TTBlob size={60} color={p.ocean}/>
        <TTBlob size={48} color={p.sun}/>
        <TTFlower size={48} color={p.cream} center={p.melon}/>
      </div>

      {/* Components preview */}
      <div style={{ fontSize:12, fontWeight:900, letterSpacing:2, textTransform:'uppercase', marginBottom:10, opacity:.65 }}>Buttons</div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:18 }}>
        <TTPill color={p.melon} text={p.cream} outline={p.ink} size="md" style={{fontFamily:fonts.heading}}>Primary</TTPill>
        <TTPill color={p.mint}  text={p.ink}   outline={p.ink} size="md" style={{fontFamily:fonts.heading}}>Success</TTPill>
        <TTPill color={p.sun}   text={p.ink}   outline={p.ink} size="md" style={{fontFamily:fonts.heading}}>Attention</TTPill>
        <TTPill color={p.ink}   text={p.cream} outline={p.ink} size="md" style={{fontFamily:fonts.heading}}>Dark</TTPill>
        <TTPill color={p.cream} text={p.ink}   outline={p.ink} size="md" style={{fontFamily:fonts.heading}}>Ghost</TTPill>
      </div>

      <div style={{ fontSize:12, fontWeight:900, letterSpacing:2, textTransform:'uppercase', marginBottom:10, opacity:.65 }}>Card feels</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
        {Object.values(TT_CARD_FEELS).map((cf) => (
          <div key={cf.name} style={{
            background: p.cream, padding:'22px 12px 18px',
            border: cf.border, borderRadius: cf.radius,
            boxShadow: cf.shadow + (cf.inner && cf.inner !== 'none' ? ', ' + cf.inner : ''),
            textAlign:'center', minHeight:120,
          }}>
            <div style={{ fontFamily: fonts.heading, fontSize:16, fontWeight:800, color:p.ink }}>{cf.name}</div>
            <div style={{ fontSize:11, color:p.ink, opacity:.55, marginTop:6, fontWeight:700 }}>r {cf.radius}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App Icon grid ───────────────────────────────────────────────────
function TTAppIconGrid({ palette: p, fonts }) {
  return (
    <div style={{
      width:'100%', height:'100%', background: p.plum,
      padding:'48px 36px', boxSizing:'border-box',
      display:'flex', flexDirection:'column', gap:30, alignItems:'center',
      fontFamily: fonts.body,
    }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:12, fontWeight:900, letterSpacing:3, textTransform:'uppercase', color:p.sun, opacity:.8 }}>App Icon</div>
        <div style={{ fontFamily: fonts.display, fontSize:36, fontWeight:900, color:p.cream, letterSpacing:-.4 }}>Blind Taster</div>
      </div>

      <div style={{ display:'flex', gap:18 }}>
        <TTMonogram size={180} palette={p}/>
      </div>

      <div style={{ display:'flex', gap:14 }}>
        <TTMonogram size={80} palette={p}/>
        <TTMonogram size={60} palette={p}/>
        <TTMonogram size={44} palette={p}/>
      </div>

      <div style={{
        padding:'12px 18px', background: p.cream, color: p.ink,
        borderRadius:16, border:`2.5px solid ${p.ink}`,
        boxShadow:`4px 4px 0 ${p.ink}`, fontSize:13, fontWeight:800, letterSpacing:1, textTransform:'uppercase',
      }}>
        Radius · 28%  ·  Gloss gradient  ·  Sun → Plum
      </div>
    </div>
  );
}

Object.assign(window, { TTRoundScreen, TTLobbyScreen, TTThemeSheet, TTAppIconGrid });
