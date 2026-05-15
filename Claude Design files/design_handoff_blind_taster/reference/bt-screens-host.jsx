// Blind Taster — Host-side screens (home, menu, lists, forms, edit)

// ── Home screen (with tickertape background) ────────────────────────
function BTHome({ palette: p, fonts }) {
  const stripeRow = (color, textColor, text, top) => (
    <div style={{
      position: 'absolute', left: -40, top, width: '180%', height: 52,
      background: color, transform: 'rotate(-12deg)',
      display: 'flex', alignItems: 'center', overflow: 'hidden',
    }}>
      <span style={{
        whiteSpace: 'nowrap', fontFamily: fonts.display, fontSize: 28,
        fontWeight: 900, color: textColor, letterSpacing: 1.5, textTransform: 'uppercase',
      }}>
        {Array(10).fill(text).map((t, i) => <span key={i} style={{ marginRight: 16 }}>{t} ✦</span>)}
      </span>
    </div>
  );

  return (
    <BTScreen palette={p} bg={p.plum}>
      {stripeRow(p.sun, p.ink, 'Blind Taster', 70)}
      {stripeRow(p.mint, p.ink, 'Sniff Swirl', 142)}
      {stripeRow(p.melon, p.cream, 'Blind Taster', 700)}
      {stripeRow(p.sun, p.ink, 'Settle The Score', 772)}

      {/* Corner sparkles */}
      <TTStar size={32} color={p.sun} style={{ position: 'absolute', top: 90, right: 40 }}/>
      <TTStar size={22} color={p.mint} style={{ position: 'absolute', bottom: 120, left: 30 }}/>

      {/* Center card */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(-2deg)',
        width: 320,
      }}>
        <BTCard palette={p} radius={28} shadow={8} padding={28}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <TTMonogram size={104} palette={p}/>
            <div style={{
              fontFamily: fonts.display, fontSize: 44, fontWeight: 900,
              color: p.ink, letterSpacing: -0.6, lineHeight: 0.95, textAlign: 'center',
              textTransform: 'uppercase',
            }}>
              Blind<br/>Taster
            </div>
            <div style={{
              fontSize: 11, fontWeight: 900, color: p.ink, letterSpacing: 2,
              textTransform: 'uppercase', textAlign: 'center',
              padding: '8px 14px', border: `2px solid ${p.ink}`, borderRadius: 999,
              marginBottom: 4,
            }}>
              Sniff · Swirl · Settle the score
            </div>
            <BTCta palette={p} fonts={fonts}>Host a game</BTCta>
            <BTOutlineCta palette={p} fonts={fonts}>Join a game</BTOutlineCta>
          </div>
        </BTCard>
      </div>

      <BTSettingsFab palette={p}/>
    </BTScreen>
  );
}

// ── Host a Game menu ─────────────────────────────────────────────────
function BTHostMenu({ palette: p, fonts }) {
  return (
    <BTScreen palette={p}>
      <BTAppBar title="Host a Game" palette={p} fonts={fonts}/>

      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <TTMonogram size={88} palette={p}/>
          <div style={{
            fontFamily: fonts.display, fontSize: 36, fontWeight: 900, color: p.ink,
            letterSpacing: -0.5, marginTop: 16,
          }}>Host a Game</div>
          <div style={{ fontSize: 15, color: p.ink, opacity: 0.7, marginTop: 6 }}>
            Manage your questionnaires and saved games
          </div>
        </div>

        {/* Two big tiles */}
        <BTCard palette={p} color={p.melon} radius={28} shadow={6} padding={22}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: p.cream, border: `2.5px solid ${p.ink}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `3px 3px 0 ${p.ink}`,
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="3" width="20" height="22" rx="2" stroke={p.ink} strokeWidth="2.5"/>
                <path d="M8 9h12M8 14h12M8 19h7" stroke={p.ink} strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 900, color: p.cream, letterSpacing: -0.3, textTransform: 'uppercase' }}>Questionnaires</div>
              <div style={{ fontSize: 13, color: p.cream, opacity: 0.85 }}>Build your taste-test forms</div>
            </div>
          </div>
        </BTCard>

        <BTCard palette={p} color={p.mint} radius={28} shadow={6} padding={22}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: p.cream, border: `2.5px solid ${p.ink}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `3px 3px 0 ${p.ink}`,
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M4 8l10-5 10 5v12l-10 5-10-5V8z" stroke={p.ink} strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M14 3v22M4 8l10 5 10-5" stroke={p.ink} strokeWidth="2.5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 900, color: p.ink, letterSpacing: -0.3, textTransform: 'uppercase' }}>Games</div>
              <div style={{ fontSize: 13, color: p.ink, opacity: 0.85 }}>Pick a game and start hosting</div>
            </div>
          </div>
        </BTCard>
      </div>

      <BTSettingsFab palette={p}/>
    </BTScreen>
  );
}

// ── Questionnaires list ──────────────────────────────────────────────
function BTQuestionnairesList({ palette: p, fonts }) {
  const rows = [
    { name: 'Beer',          q: 6, color: p.sun },
    { name: 'Wine',          q: 6, color: p.melon },
    { name: 'Sparkling Wine',q: 6, color: p.mint },
    { name: 'Chocolate',     q: 6, color: p.plum },
    { name: 'Whisky',        q: 6, color: p.ocean },
    { name: 'Coffee',        q: 6, color: p.sun },
  ];
  return (
    <BTScreen palette={p}>
      <BTAppBar title="Questionnaires" palette={p} fonts={fonts}/>

      <div style={{ padding: '12px 16px 0' }}>
        <BTOutlineCta palette={p} fonts={fonts}>+ Create New</BTOutlineCta>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
        {rows.map((r, i) => (
          <BTCard key={i} palette={p} radius={20} shadow={4} padding={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: r.color, border: `2px solid ${p.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fonts.display, fontSize: 22, fontWeight: 900,
                color: p.ink, flexShrink: 0,
              }}>{r.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.heading, fontSize: 17, fontWeight: 800, color: p.ink }}>{r.name}</div>
                <div style={{ fontSize: 12, color: p.ink, opacity: 0.6, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>
                  {r.q} questions · Locked
                </div>
              </div>
              <button style={{
                width: 34, height: 34, borderRadius: 10,
                background: p.cream, border: `2px solid ${p.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="3" y="3" width="8" height="8" rx="1" stroke={p.ink} strokeWidth="1.8"/>
                  <rect x="1" y="1" width="8" height="8" rx="1" stroke={p.ink} strokeWidth="1.8" fill={p.cream}/>
                </svg>
              </button>
              <button style={{
                width: 34, height: 34, borderRadius: 10,
                background: p.melon, border: `2px solid ${p.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3l8 8M11 3l-8 8" stroke={p.cream} strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </BTCard>
        ))}
      </div>

      <BTSettingsFab palette={p}/>
    </BTScreen>
  );
}

// ── New Questionnaire form ───────────────────────────────────────────
function BTNewQuestionnaire({ palette: p, fonts }) {
  return (
    <BTScreen palette={p}>
      <BTAppBar title="New Questionnaire" palette={p} fonts={fonts}/>

      <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <BTSectionLabel palette={p}>Questionnaire name</BTSectionLabel>
        <BTInput placeholder="e.g. Wine Tasting 2025" palette={p} fonts={fonts}/>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, padding: 24 }}>
          <div style={{ opacity: 0.55 }}>
            <TTStar size={36} color={p.melon}/>
          </div>
          <div style={{ fontSize: 14, color: p.ink, opacity: 0.55, textAlign: 'center', fontWeight: 700 }}>
            No questions yet.<br/>Tap Add Question to start.
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <BTOutlineCta palette={p} fonts={fonts}>+ Add Question</BTOutlineCta>
        <BTCta palette={p} fonts={fonts}>Save Questionnaire</BTCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 160 }}/>
    </BTScreen>
  );
}

// ── Choose Question Type modal ───────────────────────────────────────
function BTChooseType({ palette: p, fonts }) {
  const types = [
    { label: 'Multiple Choice — Text',   color: p.melon, icon: '◉' },
    { label: 'Multiple Choice — Number', color: p.sun,   icon: '#' },
    { label: 'Slider / Number',          color: p.mint,  icon: '⎯' },
    { label: 'Tags',                     color: p.ocean, icon: '#' },
    { label: 'Price',                    color: p.plum,  icon: '£', textColor: p.cream },
  ];

  return (
    <BTScreen palette={p} bg="rgba(43,16,85,0.55)">
      {/* faded background hint */}
      <div style={{ flex: 1 }}/>

      {/* Bottom sheet */}
      <div style={{
        background: p.cream,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        border: `2.5px solid ${p.ink}`, borderBottom: 'none',
        padding: '22px 20px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontFamily: fonts.heading, fontSize: 22, fontWeight: 800, color: p.ink }}>Choose Question Type</div>
          <button style={{
            width: 34, height: 34, borderRadius: 17,
            background: p.cream, border: `2px solid ${p.ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke={p.ink} strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {types.map((t, i) => (
            <BTCard key={i} palette={p} radius={18} shadow={3} padding={14} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: t.color, border: `2px solid ${p.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fonts.display, fontSize: 20, fontWeight: 900,
                color: t.textColor || p.ink, flexShrink: 0,
              }}>{t.icon}</div>
              <div style={{ flex: 1, fontFamily: fonts.heading, fontSize: 16, fontWeight: 700, color: p.ink }}>
                {t.label}
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 2l5 5-5 5" stroke={p.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </BTCard>
          ))}
        </div>
      </div>
    </BTScreen>
  );
}

// ── Edit Questionnaire ───────────────────────────────────────────────
function BTEditQuestionnaire({ palette: p, fonts }) {
  const qs = [
    { type: 'Multiple Choice — Text',   text: 'What style of beer is this?',         color: p.melon },
    { type: 'Multiple Choice — Text',   text: 'How bitter is it?',                   color: p.sun },
    { type: 'Multiple Choice — Text',   text: 'How would you describe the body…',    color: p.mint },
    { type: 'Tags',                     text: 'Aroma & flavour notes',               color: p.ocean },
    { type: 'Multiple Choice — Text',   text: 'What country is it from?',            color: p.plum, textColor: p.cream },
  ];
  return (
    <BTScreen palette={p}>
      <BTAppBar title="Edit Questionnaire" palette={p} fonts={fonts}/>

      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflowY: 'auto' }}>
        <div>
          <BTSectionLabel palette={p}>Questionnaire name</BTSectionLabel>
          <div style={{ marginTop: 6 }}>
            <BTInput value="Beer (copy)" palette={p} fonts={fonts}/>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {qs.map((q, i) => (
            <BTCard key={i} palette={p} radius={18} shadow={3} padding={14}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: q.color, border: `2px solid ${p.ink}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: fonts.display, fontSize: 14, fontWeight: 900,
                  color: q.textColor || p.ink, flexShrink: 0,
                }}>Q{i+1}</div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, textTransform: 'uppercase', color: p.ink, opacity: 0.55 }}>
                    {q.type}
                  </div>
                  <div style={{ fontFamily: fonts.heading, fontSize: 15, fontWeight: 700, color: p.ink, marginTop: 3, lineHeight: 1.25 }}>
                    {q.text}
                  </div>
                </div>
                <button style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: p.melon, border: `2px solid ${p.ink}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 3l6 6M9 3l-6 6" stroke={p.cream} strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </BTCard>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <BTOutlineCta palette={p} fonts={fonts} size="md">+ Add Question</BTOutlineCta>
        <BTCta palette={p} fonts={fonts}>Save Questionnaire</BTCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 152 }}/>
    </BTScreen>
  );
}

// ── Edit Question (Multiple Choice — Text) ──────────────────────────
function BTEditQuestion({ palette: p, fonts }) {
  const options = ['Lager', 'Pale Ale', 'IPA', 'Stout', 'Porter', 'Wheat Beer'];
  return (
    <BTScreen palette={p}>
      <BTAppBar title="Edit Question" palette={p} fonts={fonts}/>

      <div style={{ padding: '12px 16px 0' }}>
        <BTPill palette={p} color={p.sun}>Multiple Choice — Text</BTPill>
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflowY: 'auto' }}>
        <BTCard palette={p} radius={20} shadow={4} padding={18}>
          <BTSectionLabel palette={p}>Question</BTSectionLabel>
          <div style={{
            fontFamily: fonts.heading, fontSize: 22, fontWeight: 800,
            color: p.ink, lineHeight: 1.2, marginTop: 6,
          }}>
            What style of beer is this?
          </div>
        </BTCard>

        <BTCard palette={p} radius={20} shadow={4} padding={16}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <BTSectionLabel palette={p}>Options</BTSectionLabel>
            <BTPill palette={p} color={p.mint}>{options.length}</BTPill>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {options.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  flex: 1, padding: '12px 16px',
                  background: p.cream, border: `2px solid ${p.ink}`,
                  borderRadius: 999, boxShadow: `2px 2px 0 ${p.ink}`,
                  fontFamily: fonts.heading, fontSize: 16, fontWeight: 700, color: p.ink,
                }}>{o}</div>
                <button style={{
                  width: 36, height: 36, borderRadius: 18,
                  background: p.melon, border: `2px solid ${p.ink}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M3 3l7 7M10 3l-7 7" stroke={p.cream} strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
            <button style={{
              marginTop: 4, padding: '10px 14px', border: `2px dashed ${p.ink}`,
              background: 'transparent', borderRadius: 999, cursor: 'pointer',
              fontFamily: fonts.body, fontSize: 14, fontWeight: 800, color: p.ink,
              letterSpacing: 1, textTransform: 'uppercase',
            }}>+ Add Option</button>
          </div>
        </BTCard>
      </div>

      <div style={{ padding: '12px 16px 20px' }}>
        <BTCta palette={p} fonts={fonts}>Save Question</BTCta>
      </div>

      <BTSettingsFab palette={p} style={{ left: 'auto', right: 16, bottom: 110 }}/>
    </BTScreen>
  );
}

Object.assign(window, {
  BTHome, BTHostMenu, BTQuestionnairesList, BTNewQuestionnaire,
  BTChooseType, BTEditQuestionnaire, BTEditQuestion,
});
