// Blind Taster — Game management + host-side round screens

// ── Games List ───────────────────────────────────────────────────────
function BTGamesList({ palette: p, fonts }) {
  const rows = [
    { name: 'Beer Night',          q: 'Beer · 3 rounds',          color: p.sun },
    { name: 'Wine Night',          q: 'Wine · 3 rounds',          color: p.melon, textInvert: true },
    { name: 'Sparkling Wine',      q: 'Sparkling · 3 rounds',     color: p.mint },
    { name: 'Chocolate Tasting',   q: 'Chocolate · 3 rounds',     color: p.plum, textInvert: true },
    { name: 'Whisky Tasting',      q: 'Whisky · 3 rounds',        color: p.ocean, textInvert: true },
    { name: 'Coffee Tasting',      q: 'Coffee · 3 rounds',        color: p.sun },
  ];
  return (
    <BTScreen palette={p}>
      <BTAppBar title="Games" palette={p} fonts={fonts}
        trailing={
          <BTPill palette={p} color={p.melon} textColor={p.cream}>Edit</BTPill>
        }/>

      <div style={{ padding: '12px 16px 0' }}>
        <BTOutlineCta palette={p} fonts={fonts}>+ Create New Game</BTOutlineCta>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
        {rows.map((r, i) => (
          <BTCard key={i} palette={p} radius={20} shadow={4} padding={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: r.color, border: `2.5px solid ${p.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fonts.display, fontSize: 22, fontWeight: 900,
                color: r.textInvert ? p.cream : p.ink, flexShrink: 0,
              }}>{r.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 800, color: p.ink, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: p.ink, opacity: 0.6, fontWeight: 700, marginTop: 2 }}>{r.q}</div>
              </div>
              <button style={{
                padding: '8px 12px', borderRadius: 999,
                background: p.cream, border: `2px solid ${p.ink}`,
                fontFamily: fonts.body, fontSize: 12, fontWeight: 900,
                color: p.ink, letterSpacing: 0.5, cursor: 'pointer',
              }}>Answers</button>
              <button style={{
                padding: '8px 14px 8px 12px', borderRadius: 999,
                background: p.melon, border: `2px solid ${p.ink}`,
                boxShadow: `2px 2px 0 ${p.ink}`,
                fontFamily: fonts.body, fontSize: 12, fontWeight: 900,
                color: p.cream, letterSpacing: 0.5, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>Host <span style={{ fontSize: 9 }}>▶</span></button>
            </div>
          </BTCard>
        ))}
      </div>

      <BTSettingsFab palette={p}/>
    </BTScreen>
  );
}

// ── Game Info modal (over games list) ────────────────────────────────
function BTGameInfoModal({ palette: p, fonts }) {
  return (
    <BTScreen palette={p} bg={p.cream} style={{ position: 'relative' }}>
      {/* dimmed list behind */}
      <BTAppBar title="Games" palette={p} fonts={fonts}/>
      <div style={{ padding: '12px 16px 0', opacity: 0.3, pointerEvents: 'none' }}>
        <BTOutlineCta palette={p} fonts={fonts}>+ Create New Game</BTOutlineCta>
      </div>
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1, opacity: 0.3, pointerEvents: 'none' }}>
        {[1,2,3,4].map(i => (
          <BTCard key={i} palette={p} radius={20} shadow={4} padding={12} style={{ height: 70 }}/>
        ))}
      </div>

      {/* dim overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(43,16,85,0.55)' }}/>

      {/* Modal sticker card */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(-1deg)',
        width: 300,
      }}>
        <BTCard palette={p} radius={28} shadow={8} padding={24}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <BTSectionLabel palette={p} color={p.melon}>Beer · 3 rounds</BTSectionLabel>
              <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 900, color: p.ink, letterSpacing: -0.4, marginTop: 4 }}>
                Beer Night
              </div>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: p.sun, border: `2.5px solid ${p.ink}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: fonts.display, fontSize: 22, fontWeight: 900, color: p.ink,
            }}>B</div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: 1, t: 'Peroni Nastro Azzurro', c: p.sun },
              { n: 2, t: 'BrewDog Punk IPA',      c: p.mint },
              { n: 3, t: 'Guinness Draught',      c: p.plum, invert: true },
            ].map(r => (
              <div key={r.n} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px',
                background: p.cream, border: `2px solid ${p.ink}`, borderRadius: 14,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: r.c, border: `2px solid ${p.ink}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: fonts.display, fontSize: 14, fontWeight: 900,
                  color: r.invert ? p.cream : p.ink,
                }}>{r.n}</div>
                <div style={{ fontFamily: fonts.heading, fontSize: 15, fontWeight: 700, color: p.ink }}>{r.t}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <BTCta palette={p} fonts={fonts}>Done</BTCta>
          </div>
        </BTCard>
      </div>
    </BTScreen>
  );
}

// ── New Game form ────────────────────────────────────────────────────
function BTNewGame({ palette: p, fonts }) {
  return (
    <BTScreen palette={p}>
      <BTAppBar title="New Game" palette={p} fonts={fonts}/>

      <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
        <div>
          <BTSectionLabel palette={p}>Game name</BTSectionLabel>
          <div style={{ marginTop: 6 }}>
            <BTInput placeholder="e.g. Wine Night 2025" palette={p} fonts={fonts}/>
          </div>
        </div>

        <div>
          <BTSectionLabel palette={p}>Questionnaire</BTSectionLabel>
          <div style={{ marginTop: 6, position: 'relative' }}>
            <BTInput placeholder="Tap to select…" palette={p} fonts={fonts}/>
            <div style={{
              position: 'absolute', top: '50%', right: 18,
              transform: 'translateY(-50%)',
              width: 28, height: 28, borderRadius: 8,
              background: p.sun, border: `2px solid ${p.ink}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div>
          <BTSectionLabel palette={p}>Number of rounds</BTSectionLabel>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{
              width: 50, height: 50, borderRadius: 999,
              background: p.cream, border: `2.5px solid ${p.ink}`,
              boxShadow: `3px 3px 0 ${p.ink}`,
              fontFamily: fonts.display, fontSize: 22, fontWeight: 900,
              color: p.ink, cursor: 'pointer',
            }}>−</button>
            <div style={{
              flex: 1, height: 50,
              background: p.cream, border: `2.5px solid ${p.ink}`,
              boxShadow: `3px 3px 0 ${p.ink}`, borderRadius: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: fonts.display, fontSize: 22, fontWeight: 900,
              color: p.ink,
            }}>3</div>
            <button style={{
              width: 50, height: 50, borderRadius: 999,
              background: p.mint, border: `2.5px solid ${p.ink}`,
              boxShadow: `3px 3px 0 ${p.ink}`,
              fontFamily: fonts.display, fontSize: 22, fontWeight: 900,
              color: p.ink, cursor: 'pointer',
            }}>+</button>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px 20px' }}>
        <BTCta palette={p} fonts={fonts}>Continue →</BTCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 110 }}/>
    </BTScreen>
  );
}

// ── Host's "Set Answers for round" screen (round 1 of 3 setup) ───────
function BTHostSetAnswers({ palette: p, fonts }) {
  return (
    <BTScreen palette={p}>
      <BTAppBar title="Round 1 of 3" palette={p} fonts={fonts}/>

      <div style={{ padding: '12px 16px 0', display: 'flex', justifyContent: 'center' }}>
        <BTPill palette={p} color={p.sun}>Host · Set the answers</BTPill>
      </div>

      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflowY: 'auto' }}>
        {/* Sample answer field */}
        <BTCard palette={p} color={p.plum} radius={20} shadow={4} padding={18}>
          <BTSectionLabel palette={p} color={p.sun}>Sample · revealed after the round</BTSectionLabel>
          <div style={{
            marginTop: 8, padding: '12px 16px',
            background: p.cream, border: `2px solid ${p.ink}`, borderRadius: 999,
            fontFamily: fonts.heading, fontSize: 16, fontWeight: 700,
            color: 'rgba(43,16,85,0.4)',
          }}>e.g. Château Margaux 2018</div>
        </BTCard>

        {/* Q1 MCQ-text — selected answer */}
        <div>
          <BTSectionLabel palette={p} color={p.melon} style={{ marginBottom: 8 }}>Q1 · the correct answer</BTSectionLabel>
          <BTCard palette={p} radius={20} shadow={4} padding={18}>
            <div style={{ fontFamily: fonts.heading, fontSize: 19, fontWeight: 800, color: p.ink, lineHeight: 1.2 }}>
              What style of beer is this?
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              <BTChip palette={p}>Lager</BTChip>
              <BTChip palette={p} on color={p.mint} textColor={p.ink}>Pale Ale ✓</BTChip>
              <BTChip palette={p}>IPA</BTChip>
              <BTChip palette={p}>Stout</BTChip>
              <BTChip palette={p}>Porter</BTChip>
              <BTChip palette={p}>Wheat Beer</BTChip>
            </div>
          </BTCard>
        </div>

        {/* Q2 MCQ-text vertical */}
        <div>
          <BTSectionLabel palette={p} color={p.melon} style={{ marginBottom: 8 }}>Q2 · the correct answer</BTSectionLabel>
          <BTCard palette={p} radius={20} shadow={4} padding={18}>
            <div style={{ fontFamily: fonts.heading, fontSize: 19, fontWeight: 800, color: p.ink, lineHeight: 1.2 }}>
              How bitter is it?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              <BTChip palette={p} style={{ justifyContent: 'flex-start' }}>Low — soft & barely there</BTChip>
              <BTChip palette={p} on color={p.mint} textColor={p.ink} style={{ justifyContent: 'flex-start' }}>Medium — balanced, clean finish ✓</BTChip>
              <BTChip palette={p} style={{ justifyContent: 'flex-start' }}>High — sharp & lingering</BTChip>
            </div>
          </BTCard>
        </div>
      </div>

      <div style={{ padding: '12px 16px 20px', display: 'flex', gap: 10 }}>
        <BTOutlineCta palette={p} fonts={fonts} size="md" style={{ flex: 1 }}>← Back</BTOutlineCta>
        <BTCta palette={p} fonts={fonts} size="md" style={{ flex: 1 }}>Next →</BTCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 110 }}/>
    </BTScreen>
  );
}

// ── Host's Lobby (QR code + room code) ───────────────────────────────
function BTHostLobby({ palette: p, fonts, withJoiners = false }) {
  // Fake QR pattern: 21x21 squares
  const grid = [];
  // Deterministic pseudo-random pattern
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      const on = ((r * 13 + c * 7) % 5) < 2;
      // Finder corners
      const inFinder = (r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7);
      if (inFinder) continue;
      if (on) grid.push({ r, c });
    }
  }
  const finder = (cx, cy) => (
    <>
      <rect x={cx} y={cy} width={7} height={7} fill={p.ink}/>
      <rect x={cx + 1} y={cy + 1} width={5} height={5} fill={p.cream}/>
      <rect x={cx + 2} y={cy + 2} width={3} height={3} fill={p.ink}/>
    </>
  );

  return (
    <BTScreen palette={p}>
      {/* Top bar with chip + meatballs */}
      <div style={{
        background: p.cream, paddingTop: 62, paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
        borderBottom: `2.5px solid ${p.ink}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <BTSectionLabel palette={p} color={p.melon}>Beer · Hosting</BTSectionLabel>
          <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 900, color: p.ink, letterSpacing: -0.3 }}>
            Beer Night
          </div>
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: 12,
          background: p.cream, border: `2px solid ${p.ink}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="4" viewBox="0 0 20 4">
            <circle cx="2" cy="2" r="2" fill={p.ink}/>
            <circle cx="10" cy="2" r="2" fill={p.ink}/>
            <circle cx="18" cy="2" r="2" fill={p.ink}/>
          </svg>
        </button>
      </div>

      {/* gradient body */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(180deg, ${p.sun} 0%, ${p.melon} 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 24,
      }}>
        <TTStar size={28} color={p.cream} style={{ position: 'absolute', top: 40, right: 30 }}/>
        <TTStar size={18} color={p.ink} style={{ position: 'absolute', top: 220, left: 30 }}/>

        {/* QR card */}
        <BTCard palette={p} radius={24} shadow={6} padding={14} style={{ background: p.cream }}>
          <svg width="180" height="180" viewBox="0 0 21 21" shapeRendering="crispEdges">
            <rect width="21" height="21" fill={p.cream}/>
            {grid.map((g, i) => <rect key={i} x={g.c} y={g.r} width="1" height="1" fill={p.ink}/>)}
            {finder(0, 0)}
            {finder(14, 0)}
            {finder(0, 14)}
          </svg>
        </BTCard>

        {/* Room code */}
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <BTSectionLabel palette={p} color={p.cream} style={{ textShadow: `1px 1px 0 ${p.ink}` }}>Room code</BTSectionLabel>
          <div style={{ marginTop: 6 }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 22px',
              background: p.cream,
              border: `3px solid ${p.ink}`,
              borderRadius: 16,
              boxShadow: `5px 5px 0 ${p.ink}`,
              fontFamily: fonts.display, fontSize: 32, fontWeight: 900,
              letterSpacing: 3, color: p.ink,
            }}>B9CCHU33</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: p.ink, opacity: 0.7, marginTop: 6, letterSpacing: 1 }}>
            TAP TO COPY
          </div>
        </div>

        {/* Waiting / Crew */}
        <div style={{ width: '100%', padding: '20px 16px 0', flex: 1, overflowY: 'auto' }}>
          {withJoiners && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: fonts.heading, fontSize: 18, fontWeight: 800, color: p.ink, marginBottom: 8 }}>Waiting to join</div>
              <BTCard palette={p} radius={16} shadow={3} padding={10}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <BTAvatar name="Jon" palette={p} color={p.sun}/>
                  <div style={{ flex: 1, fontFamily: fonts.heading, fontSize: 16, fontWeight: 800, color: p.ink }}>Jon</div>
                  <button style={{
                    width: 38, height: 38, borderRadius: 19,
                    background: p.mint, border: `2.5px solid ${p.ink}`,
                    boxShadow: `2px 2px 0 ${p.ink}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7l3 3 7-7" stroke={p.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                  </button>
                  <button style={{
                    width: 38, height: 38, borderRadius: 19,
                    background: p.melon, border: `2.5px solid ${p.ink}`,
                    boxShadow: `2px 2px 0 ${p.ink}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 13 13"><path d="M3 3l7 7M10 3l-7 7" stroke={p.cream} strokeWidth="2.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </BTCard>
            </div>
          )}

          <div style={{ fontFamily: fonts.heading, fontSize: 18, fontWeight: 800, color: p.ink, marginBottom: 8 }}>
            The crew (0)
          </div>
          <div style={{
            textAlign: 'center', padding: '14px 0', color: p.ink, opacity: 0.7,
            fontSize: 13, fontWeight: 700,
          }}>
            Share the room code to invite players.
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '12px 16px 20px', background: p.cream, borderTop: `2.5px solid ${p.ink}` }}>
        <BTCta palette={p} fonts={fonts} disabled>Start Game</BTCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 110 }}/>
    </BTScreen>
  );
}

// ── Host's monitoring (during round) ─────────────────────────────────
function BTHostMonitor({ palette: p, fonts }) {
  return (
    <BTScreen palette={p}>
      {/* Top bar with round badge */}
      <div style={{
        background: p.cream, paddingTop: 62, paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
        borderBottom: `2.5px solid ${p.ink}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BTPill palette={p} color={p.melon} textColor={p.cream}>R 1/3</BTPill>
          <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 900, color: p.ink, letterSpacing: -0.3 }}>
            Beer Night
          </div>
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: 12,
          background: p.cream, border: `2px solid ${p.ink}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="4" viewBox="0 0 20 4">
            <circle cx="2" cy="2" r="2" fill={p.ink}/>
            <circle cx="10" cy="2" r="2" fill={p.ink}/>
            <circle cx="18" cy="2" r="2" fill={p.ink}/>
          </svg>
        </button>
      </div>

      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {/* Players */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BTSectionLabel palette={p}>Players</BTSectionLabel>
          <button style={{
            width: 34, height: 34, borderRadius: 17,
            background: p.sun, border: `2px solid ${p.ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 4a4 4 0 11-8 1M11 4V1M11 4h-3" stroke={p.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Not answered */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 800, color: p.ink }}>Not answered</span>
            <BTPill palette={p} color={p.melon} textColor={p.cream}>1</BTPill>
          </div>
          <BTCard palette={p} radius={18} shadow={3} padding={10} style={{ border: `2.5px solid ${p.melon}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <BTAvatar name="Jon" palette={p} color={p.melon}/>
              <div style={{ flex: 1, fontFamily: fonts.heading, fontSize: 16, fontWeight: 800, color: p.ink }}>Jon</div>
              <div style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 900, color: p.ink, opacity: 0.7 }}>0 pts</div>
              <button style={{
                width: 32, height: 32, borderRadius: 8,
                background: p.cream, border: `2px solid ${p.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="4" viewBox="0 0 14 4">
                  <circle cx="2" cy="2" r="1.5" fill={p.ink}/>
                  <circle cx="7" cy="2" r="1.5" fill={p.ink}/>
                  <circle cx="12" cy="2" r="1.5" fill={p.ink}/>
                </svg>
              </button>
            </div>
          </BTCard>
        </div>

        {/* Answered */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 800, color: p.ink }}>Answered</span>
            <BTPill palette={p} color={p.mint}>2</BTPill>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'Maya', color: p.sun, pts: 200 },
              { name: 'Theo', color: p.ocean, pts: 180, invert: true },
            ].map((pl) => (
              <BTCard key={pl.name} palette={p} radius={18} shadow={3} padding={10} style={{ background: p.cream }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <BTAvatar name={pl.name} palette={p} color={pl.color}/>
                  <div style={{ flex: 1, fontFamily: fonts.heading, fontSize: 16, fontWeight: 800, color: p.ink }}>{pl.name}</div>
                  <BTPill palette={p} color={p.mint}>{pl.pts} pts</BTPill>
                </div>
              </BTCard>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px 20px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: `2px solid rgba(43,16,85,0.1)` }}>
        <BTCta palette={p} fonts={fonts} disabled>Reveal Answers</BTCta>
        <BTOutlineCta palette={p} fonts={fonts}>Next Round →</BTOutlineCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 152 }}/>
    </BTScreen>
  );
}

Object.assign(window, {
  BTGamesList, BTGameInfoModal, BTNewGame,
  BTHostSetAnswers, BTHostLobby, BTHostMonitor,
});
