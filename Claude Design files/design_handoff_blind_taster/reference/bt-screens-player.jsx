// Blind Taster — Player-side screens (in-game round, results, end of game)

// ── Player Round (questionnaire, with mix of Q types) ────────────────
function BTPlayerRound({ palette: p, fonts, page = 1 }) {
  return (
    <BTScreen palette={p}>
      {/* Top bar */}
      <div style={{
        paddingTop: 62, paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
        borderBottom: `2.5px solid ${p.ink}`, background: p.cream,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <BTSectionLabel palette={p} color={p.melon}>Olive Oil</BTSectionLabel>
          <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 900, color: p.ink, letterSpacing: -0.3 }}>
            Round 1 of 3
          </div>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 999,
          background: p.sun, border: `2.5px solid ${p.ink}`,
          boxShadow: `3px 3px 0 ${p.ink}`,
          fontFamily: fonts.display, fontSize: 15, fontWeight: 900, color: p.ink,
        }}>0 pts</div>
      </div>

      <div style={{ padding: '20px 16px 0', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Q1 — country chips (MCQ-text) */}
        <div>
          <BTSectionLabel palette={p} color={p.sun} style={{ marginBottom: 8 }}>Question 1</BTSectionLabel>
          <BTCard palette={p} radius={20} shadow={4} padding={16}>
            <div style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 800, color: p.ink, lineHeight: 1.2 }}>
              Which country is this oil from?
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
              <BTChip palette={p} on color={p.melon} textColor={p.cream}>Italian</BTChip>
              <BTChip palette={p}>Spanish</BTChip>
              <BTChip palette={p}>Greek</BTChip>
              <BTChip palette={p}>Tunisian</BTChip>
              <BTChip palette={p}>Moroccan</BTChip>
              <BTChip palette={p}>Portuguese</BTChip>
              <BTChip palette={p}>Australian</BTChip>
            </div>
          </BTCard>
        </div>

        {/* Q2 — fruitiness vertical */}
        <div>
          <BTSectionLabel palette={p} color={p.sun} style={{ marginBottom: 8 }}>Question 2</BTSectionLabel>
          <BTCard palette={p} radius={20} shadow={4} padding={16}>
            <div style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 800, color: p.ink, lineHeight: 1.2 }}>
              What character does the fruitiness have?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              <BTChip palette={p} on color={p.mint} textColor={p.ink} style={{ justifyContent: 'flex-start' }}>
                Green — grassy, artichoke, green almond, tomato leaf
              </BTChip>
              <BTChip palette={p} style={{ justifyContent: 'flex-start' }}>
                Ripe — melon, fig, stone fruit, sweet
              </BTChip>
            </div>
          </BTCard>
        </div>

        {/* Q3 — intensity vertical */}
        <div>
          <BTSectionLabel palette={p} color={p.sun} style={{ marginBottom: 8 }}>Question 3</BTSectionLabel>
          <BTCard palette={p} radius={20} shadow={4} padding={16}>
            <div style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 800, color: p.ink, lineHeight: 1.2 }}>
              How intense is the overall flavour?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              <BTChip palette={p} style={{ justifyContent: 'flex-start' }}>Delicate — subtle, mild, gentle</BTChip>
              <BTChip palette={p} style={{ justifyContent: 'flex-start' }}>Medium — clear olive character</BTChip>
              <BTChip palette={p} on color={p.ocean} textColor={p.cream} style={{ justifyContent: 'flex-start' }}>Robust — powerful, assertive</BTChip>
            </div>
          </BTCard>
        </div>
      </div>

      <div style={{ padding: '12px 16px 20px' }}>
        <BTCta palette={p} fonts={fonts}>Submit Answers</BTCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 110 }}/>
    </BTScreen>
  );
}

// ── Player Round — Tags + Price questions screen ─────────────────────
function BTPlayerTagsPrice({ palette: p, fonts }) {
  return (
    <BTScreen palette={p}>
      <div style={{
        paddingTop: 62, paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
        borderBottom: `2.5px solid ${p.ink}`, background: p.cream,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <BTSectionLabel palette={p} color={p.melon}>Olive Oil</BTSectionLabel>
          <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 900, color: p.ink, letterSpacing: -0.3 }}>
            Round 1 of 3
          </div>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 999,
          background: p.sun, border: `2.5px solid ${p.ink}`,
          boxShadow: `3px 3px 0 ${p.ink}`,
          fontFamily: fonts.display, fontSize: 15, fontWeight: 900, color: p.ink,
        }}>0 pts</div>
      </div>

      <div style={{ padding: '20px 16px 0', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Q5 — tags */}
        <div>
          <BTSectionLabel palette={p} color={p.sun} style={{ marginBottom: 8 }}>Question 5 · Tags</BTSectionLabel>
          <BTCard palette={p} radius={20} shadow={4} padding={16}>
            <div style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 800, color: p.ink }}>
              Tasting notes
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <div style={{
                flex: 1, padding: '12px 16px',
                background: p.cream, border: `2px solid ${p.ink}`,
                borderRadius: 999, boxShadow: `2px 2px 0 ${p.ink}`,
                fontFamily: fonts.body, fontSize: 14, color: 'rgba(43,16,85,0.4)', fontWeight: 500,
              }}>Type a note and press Add…</div>
              <button style={{
                padding: '0 16px', height: 44, borderRadius: 999,
                background: p.melon, border: `2px solid ${p.ink}`,
                boxShadow: `2px 2px 0 ${p.ink}`,
                fontFamily: fonts.display, fontSize: 14, fontWeight: 900, color: p.cream,
                letterSpacing: 0.5, cursor: 'pointer',
              }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 999,
                background: p.plum, color: p.cream,
                border: `2px solid ${p.ink}`,
                fontSize: 13, fontWeight: 800,
              }}>
                Buttery
                <span style={{ fontSize: 14, opacity: 0.8 }}>×</span>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 999,
                background: p.sun, color: p.ink,
                border: `2px solid ${p.ink}`,
                fontSize: 13, fontWeight: 800,
              }}>
                Peppery finish
                <span style={{ fontSize: 14, opacity: 0.8 }}>×</span>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 999,
                background: p.mint, color: p.ink,
                border: `2px solid ${p.ink}`,
                fontSize: 13, fontWeight: 800,
              }}>
                Grassy
                <span style={{ fontSize: 14, opacity: 0.8 }}>×</span>
              </div>
            </div>
          </BTCard>
        </div>

        {/* Q6 — price */}
        <div>
          <BTSectionLabel palette={p} color={p.sun} style={{ marginBottom: 8 }}>Question 6 · Price</BTSectionLabel>
          <BTCard palette={p} radius={20} shadow={4} padding={16}>
            <div style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 800, color: p.ink }}>
              Price per 500ml?
            </div>
            <div style={{ display: 'flex', gap: 0, marginTop: 14, alignItems: 'stretch' }}>
              <div style={{
                width: 54, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: p.sun, border: `2.5px solid ${p.ink}`,
                borderTopLeftRadius: 14, borderBottomLeftRadius: 14, borderRight: 'none',
                fontFamily: fonts.display, fontSize: 24, fontWeight: 900, color: p.ink,
              }}>£</div>
              <div style={{
                flex: 1, padding: '14px 16px',
                background: p.cream, border: `2.5px solid ${p.ink}`,
                borderTopRightRadius: 14, borderBottomRightRadius: 14,
                fontFamily: fonts.display, fontSize: 22, fontWeight: 900, color: p.ink,
              }}>50.00</div>
            </div>
          </BTCard>
        </div>

        {/* Q7 — slider example */}
        <div>
          <BTSectionLabel palette={p} color={p.sun} style={{ marginBottom: 8 }}>Question 7 · Slider</BTSectionLabel>
          <BTCard palette={p} color={p.ocean} radius={20} shadow={4} padding={16}>
            <div style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 800, color: p.cream }}>
              Rate the vibe
            </div>
            <div style={{ marginTop: 14, position: 'relative', height: 40 }}>
              <div style={{ position: 'absolute', top: 16, left: 0, right: 0, height: 10, borderRadius: 999, background: p.cream, border: `2px solid ${p.ink}` }}/>
              <div style={{ position: 'absolute', top: 16, left: 0, width: '62%', height: 10, borderRadius: 999, background: p.sun, border: `2px solid ${p.ink}` }}/>
              <div style={{
                position: 'absolute', top: 2, left: 'calc(62% - 18px)', width: 36, height: 36, borderRadius: '50%',
                background: p.melon, border: `3px solid ${p.ink}`, boxShadow: `3px 3px 0 ${p.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fonts.display, fontSize: 13, fontWeight: 900, color: p.cream,
              }}>7</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, fontWeight: 800, color: p.cream, opacity: 0.85, letterSpacing: 1, textTransform: 'uppercase' }}>
              <span>Pond water</span>
              <span>Pure bliss</span>
            </div>
          </BTCard>
        </div>
      </div>

      <div style={{ padding: '12px 16px 20px' }}>
        <BTCta palette={p} fonts={fonts}>Submit Answers</BTCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 110 }}/>
    </BTScreen>
  );
}

// ── Player Round — results (after reveal) ────────────────────────────
function BTPlayerResults({ palette: p, fonts }) {
  const rows = [
    { q: 'Which country is this oil from?',                your: 'Italian',                       correct: 'Italian',                  ok: true,  pts: 100 },
    { q: 'What character does the fruitiness have?',       your: 'Green — grassy, artichoke, green almond, tomato leaf', correct: 'Green — grassy, artichoke, green almond, tomato leaf', ok: true,  pts: 100 },
    { q: 'How intense is the overall flavour?',             your: 'Delicate — subtle, mild, gentle', correct: 'Robust — powerful, assertive', ok: false, pts: 0 },
    { q: 'Do you feel peppery pungency in the back of your throat?', your: 'None — no burn at all', correct: 'Strong — makes you want to cough', ok: false, pts: 0 },
  ];

  return (
    <BTScreen palette={p}>
      <div style={{
        paddingTop: 62, paddingLeft: 16, paddingRight: 16, paddingBottom: 12,
        borderBottom: `2.5px solid ${p.ink}`, background: p.cream,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <BTSectionLabel palette={p} color={p.melon}>Olive Oil</BTSectionLabel>
          <div style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 900, color: p.ink, letterSpacing: -0.3 }}>
            Round 1 of 3
          </div>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 999,
          background: p.mint, border: `2.5px solid ${p.ink}`,
          boxShadow: `3px 3px 0 ${p.ink}`,
          fontFamily: fonts.display, fontSize: 15, fontWeight: 900, color: p.ink,
        }}>200 pts</div>
      </div>

      <div style={{ padding: '20px 16px 0', flex: 1, overflowY: 'auto' }}>
        {/* Big reveal */}
        <BTCard palette={p} color={p.plum} radius={24} shadow={6} padding={20} style={{ position: 'relative', overflow: 'hidden' }}>
          <TTStar size={22} color={p.sun} style={{ position: 'absolute', top: 12, right: 14 }}/>
          <BTSectionLabel palette={p} color={p.sun}>The answer</BTSectionLabel>
          <div style={{
            fontFamily: fonts.display, fontSize: 32, fontWeight: 900,
            color: p.cream, letterSpacing: -0.5, lineHeight: 1.05, marginTop: 6,
          }}>
            Frantoio Muraglia EVOO
          </div>
        </BTCard>

        <div style={{ marginTop: 18 }}>
          <BTSectionLabel palette={p} color={p.sun} style={{ marginBottom: 10 }}>Round results</BTSectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rows.map((r, i) => (
              <BTCard key={i} palette={p} radius={18} shadow={3} padding={14}
                style={{ borderLeft: `8px solid ${r.ok ? p.mint : p.melon}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, fontFamily: fonts.heading, fontSize: 15, fontWeight: 800, color: p.ink, lineHeight: 1.25 }}>
                    {r.q}
                  </div>
                  <BTPill palette={p} color={r.ok ? p.mint : 'rgba(239,71,111,0.2)'} textColor={r.ok ? p.ink : p.melon}>
                    {r.ok ? `+${r.pts}` : `0`}
                  </BTPill>
                </div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 12, color: p.ink, opacity: 0.6, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Your answer</div>
                  <div style={{ fontSize: 14, color: p.ink, fontWeight: 600 }}>{r.your}</div>
                  <div style={{ fontSize: 12, color: p.ink, opacity: 0.6, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 4 }}>Correct</div>
                  <div style={{ fontSize: 14, color: r.ok ? p.ink : p.melon, fontWeight: 800 }}>{r.correct}</div>
                </div>
              </BTCard>
            ))}
          </div>
        </div>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 24 }}/>
    </BTScreen>
  );
}

// ── End of game ─────────────────────────────────────────────────────
function BTEndGame({ palette: p, fonts }) {
  const rounds = [
    { n: 1, name: 'Frantoio Muraglia EVOO',  pts: 200, color: p.mint },
    { n: 2, name: 'Iliada PDO Kalamata',     pts: 208, color: p.sun },
    { n: 3, name: 'Carbonell Extra Virgin',  pts: 222, color: p.melon, textInvert: true },
  ];

  return (
    <BTScreen palette={p} bg={`linear-gradient(180deg, ${p.cream} 0%, ${p.sun} 100%)`}>
      {/* Top title bar */}
      <div style={{ paddingTop: 70, paddingLeft: 20, paddingRight: 20, paddingBottom: 12 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 900, color: p.ink, letterSpacing: -0.4 }}>
          Your Results
        </div>
      </div>

      {/* Trophy hero */}
      <div style={{ padding: '8px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {/* sparkles */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TTStar size={30} color={p.melon} style={{ position: 'absolute', left: -40, top: 10 }}/>
          <TTStar size={22} color={p.mint} style={{ position: 'absolute', right: -36, top: 30 }}/>
          <TTStar size={18} color={p.ocean} style={{ position: 'absolute', left: -30, bottom: 0 }}/>

          <div style={{
            padding: '12px 20px 8px',
            background: p.melon, border: `3px solid ${p.ink}`, borderRadius: 28,
            boxShadow: `8px 8px 0 ${p.ink}`,
            transform: 'rotate(-3deg)',
            textAlign: 'center',
          }}>
            <BTSectionLabel palette={p} color={p.cream} style={{ opacity: 1 }}>Winner</BTSectionLabel>
            <div style={{
              fontFamily: fonts.display, fontSize: 88, fontWeight: 900,
              color: p.cream, letterSpacing: -3, lineHeight: 1,
              WebkitTextStroke: `2px ${p.ink}`, paintOrder: 'stroke fill',
              textShadow: `4px 5px 0 ${p.ink}`,
            }}>1st</div>
            <div style={{
              fontFamily: fonts.display, fontSize: 22, fontWeight: 900,
              color: p.cream, letterSpacing: -0.4, marginTop: 4,
            }}>630 pts</div>
          </div>
        </div>
      </div>

      {/* Round breakdown */}
      <div style={{ padding: '24px 16px 0', flex: 1 }}>
        <BTSectionLabel palette={p} style={{ marginBottom: 10 }}>Round by round</BTSectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rounds.map((r) => (
            <BTCard key={r.n} palette={p} radius={18} shadow={3} padding={14}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: r.color, border: `2.5px solid ${p.ink}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: fonts.display, fontSize: 18, fontWeight: 900,
                  color: r.textInvert ? p.cream : p.ink, flexShrink: 0,
                }}>R{r.n}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: fonts.heading, fontSize: 15, fontWeight: 800, color: p.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.name}
                  </div>
                </div>
                <BTPill palette={p} color={p.mint}>+{r.pts}</BTPill>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1l5 5 5-5" stroke={p.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </BTCard>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px 20px' }}>
        <BTCta palette={p} fonts={fonts}>Done</BTCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 110 }}/>
    </BTScreen>
  );
}

Object.assign(window, { BTPlayerRound, BTPlayerTagsPrice, BTPlayerResults, BTEndGame });
