'use client'

import { useRouter } from 'next/navigation'

const SEGMENTS = [
  {
    name: 'The Anchor',
    pct: '~12% of members',
    clv: 'Avg 3-Year CLV: $9,700',
    color: '#5a9e6f',
    desc: 'Multi-activity engagement across dining, fitness, recreation, and events. Long-plan holder. Attends member-exclusive events. Refers new members regularly. Membership is integrated into their regular life rhythm.',
    risk: 'Anchors churn at low rates, and their departure is typically preceded by a period of feeling unrecognized. Personal acknowledgment is a retention investment with measurable referral returns.',
    action: 'Personal acknowledgment at milestones (Year 1, Year 2). Early access to new programming. Recognition at member appreciation events. Activate their referral potential with a structured program.',
  },
  {
    name: 'The Activator',
    pct: '~18% of members',
    clv: 'Avg 3-Year CLV: $7,200 when activated',
    color: '#e0a343',
    desc: 'New member, months 1–4. Joined with intent and connected to one activity so far. Emotional commitment deepens with each additional anchor activity discovered. This is the highest-leverage window in the membership lifecycle.',
    risk: 'Members with a single anchor by month 4 carry a 48% churn probability at month 6. Members who establish a second anchor before month 4 carry a 19% churn probability at month 6.',
    action: 'Proactive 30-day check-in. Personal invitation to one member-exclusive event before month 3. Staff introduction to a secondary activity matched to their profile.',
  },
  {
    name: 'The Routine',
    pct: '~24% of members',
    clv: 'Avg 3-Year CLV: $5,300',
    color: '#b8a060',
    desc: 'Consistent and predictable. Shows up on a reliable schedule within one primary activity category, with limited engagement outside their established pattern. Steady revenue, moderate engagement.',
    risk: 'Single-activity members carry higher churn exposure during schedule disruptions, seasonal transitions, or life events.',
    action: 'Seasonal outreach toward adjacent activities. Event invitations timed to their usual visit window. Personal staff conversations at their regular point of use.',
  },
  {
    name: 'The Pauser',
    pct: '~9% of members',
    clv: 'Avg 3-Year CLV: $3,100 without re-engagement',
    color: '#b8681d',
    desc: 'Seasonal or Monthly plan holder with a recent pause or sharp engagement drop in the past 30 days. Life events — travel, work, family — drive most pauses.',
    risk: '52% of Seasonal members who pause remain inactive beyond 90 days without a personal outreach.',
    action: 'Pause confirmation message with a forward-looking re-engagement hook. Personal re-welcome contact at the 45-day mark. Complimentary visit to reduce re-entry friction.',
  },
  {
    name: 'The Fader',
    pct: '~14% of members',
    clv: 'High churn probability within 60 days',
    color: '#c47a3a',
    desc: 'Annual or longer-plan member with no recorded activity in 21 or more days. Still paying. A value perception gap has opened between the membership fee and the member\'s felt benefit.',
    risk: 'Faders reach renewal with low intent to continue. The decision typically finalizes 30–60 days before the renewal date.',
    action: 'Personal call or text at the 21-day inactivity mark. Activity-specific reconnect message tied to something they previously engaged with.',
  },
  {
    name: 'The Ghost',
    pct: '~4% of members',
    clv: 'Act within 72 hours',
    color: '#b55a3c',
    desc: 'Billing failure with membership technically active. Most members are unaware. This is an administrative rescue opportunity — the member relationship remains intact.',
    risk: 'Payment Ghosts contacted within 72 hours recover at 88%. Recovery rate drops to 41% after day 7.',
    action: 'Immediate automated SMS with a billing update link. Personal call at day 3. Lead with access continuity: "We want to make sure your membership stays active."',
  },
]

const JOURNEYS = [
  {
    name: 'The Dining Discovery',
    clv: '$9,200 avg',
    retention: '76%',
    path: 'Visited as a public dining guest → observed a member receiving visible preferential treatment → initiated a membership discussion with staff → joined within 2 weeks.',
    action: 'Dining team members trained to open the membership discussion at the benefit interaction generate consistent acquisition from existing traffic.',
  },
  {
    name: 'The Online Sign-Up',
    clv: '$2,900 avg',
    retention: '42%',
    path: 'Discovered the club via social media or website → signed up online → arrived for first in-person visit after joining → received no personal onboarding contact.',
    action: 'A personal welcome call within 48 hours of sign-up is the primary retention intervention for this journey. One prompted in-person visit in month 1 raises 12-month retention by 34 percentage points.',
  },
  {
    name: 'The Referral Recruit',
    clv: '$10,100 avg',
    retention: '82%',
    path: 'Invited to the club by an existing member → attended an event or activity together → joined within 30 days of first visit.',
    action: 'Referral programs that sustain the connection between referrer and recruit — joint event invitations, paired activity access, visible recognition of the referring member — improve performance by an estimated 40%.',
  },
  {
    name: 'The Family Joiner',
    clv: '$10,600 avg',
    retention: '79%',
    path: 'Discovered the club through kids or family programming → parent engaged with dining or recreation during the same visit → converted to a multi-person household plan.',
    action: 'Reliability and consistency in family programming directly supports adult membership retention. Any reduction in kids programming availability produces a measurable churn increase.',
  },
]

const CHANNELS = [
  { name: 'Member referral program',       cac: '$30–$60',   clv: '$10,100', ratio: '168–337×', status: 'Informal / no program', statusColor: '#b8681d' },
  { name: 'In-person visibility conversion', cac: '$40–$80',  clv: '$9,200',  ratio: '115–230×', status: 'Ad hoc',                statusColor: '#b8681d' },
  { name: 'Google review leverage',         cac: '$0–$20',    clv: '$8,700',  ratio: '435×+',    status: 'Underdeployed',         statusColor: '#b8681d' },
  { name: 'Organic search / blog',          cac: '$40–$80',   clv: '$7,400',  ratio: '93–185×',  status: 'Near-zero reach',       statusColor: '#c47a3a' },
  { name: 'TripAdvisor',                    cac: '$20–$50',   clv: '$6,900',  ratio: '138–345×', status: 'No presence',           statusColor: '#b55a3c' },
  { name: 'Facebook paid',                  cac: '$90–$140',  clv: '$7,400',  ratio: '53–82×',   status: 'Audience too narrow',   statusColor: '#c47a3a' },
  { name: 'Instagram paid',                 cac: '$120–$180', clv: '$7,400',  ratio: '41–62×',   status: 'Members-only reach',    statusColor: '#c47a3a' },
  { name: 'Cold digital (untargeted)',       cac: '$280–$420', clv: '$2,900',  ratio: '7–10×',    status: 'Low priority',          statusColor: 'rgba(31,26,14,0.35)' },
]

export default function SampleReport() {
  const router = useRouter()

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fefaf2', color: '#1f1a0e' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .section-label {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: #b8681d; margin-bottom: 20px;
        }
        .section-label::before {
          content: ''; display: block; width: 24px; height: 1.5px;
          background: #b8681d; opacity: 0.6;
        }

        .rule { height: 1px; background: rgba(104,76,40,0.15); }

        .seg-card {
          background: #fefaf2; border: 1px solid rgba(104,76,40,0.15);
          padding: 28px 24px; border-top: 3px solid transparent;
          transition: border-top-color 0.2s, box-shadow 0.2s;
        }
        .seg-card:hover {
          box-shadow: 0 6px 24px rgba(184,104,29,0.08);
        }

        .journey-card {
          border: 1px solid rgba(104,76,40,0.15);
          padding: 32px 28px; margin-bottom: 2px;
          background: #fefaf2;
        }

        table { width: 100%; border-collapse: collapse; }
        th {
          text-align: left; font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(31,26,14,0.4);
          padding: 12px 16px; border-bottom: 1px solid rgba(104,76,40,0.15);
          font-weight: 400;
        }
        td {
          padding: 14px 16px; font-size: 14px;
          border-bottom: 1px solid rgba(104,76,40,0.08);
          vertical-align: top;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(240,232,214,0.4); }

        .btn-gold {
          display: inline-flex; align-items: center; gap: 10px;
          background: #e0a343; color: #111008;
          padding: 15px 30px; font-size: 14px; font-weight: 500;
          letter-spacing: 0.04em; border: none; cursor: pointer;
          transition: background 0.2s; font-family: 'DM Sans', sans-serif;
          text-decoration: none;
        }
        .btn-gold:hover { background: #f2c14e; }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 10px;
          background: none; color: rgba(31,26,14,0.5);
          padding: 15px 28px; font-size: 13px;
          border: 1px solid rgba(104,76,40,0.2); cursor: pointer;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          text-decoration: none;
        }
        .btn-outline:hover { border-color: #b8681d; color: #b8681d; }

        .metric-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: #f0e8d6; padding: 8px 16px;
          border: 1px solid rgba(104,76,40,0.15);
          font-size: 13px; color: rgba(31,26,14,0.65);
        }

        .report-note {
          font-size: 12px; color: rgba(31,26,14,0.35);
          letter-spacing: 0.04em; font-style: italic;
        }

        @media (max-width: 768px) {
          .header-inner { padding: 60px 24px 40px !important; }
          .body-inner { padding: 0 24px !important; }
          .report-section { padding: 48px 0 !important; }
          .segments-grid { grid-template-columns: 1fr !important; }
          .snapshot-grid { grid-template-columns: 1fr 1fr !important; }
          nav { padding: 16px 24px !important; }
          footer { padding: 28px 24px !important; flex-direction: column; gap: 16px; text-align: center; }
          table { font-size: 12px; }
          th, td { padding: 10px 10px; }
        }

        @media print {
          nav { display: none !important; }
          .no-print { display: none !important; }
          .report-section { padding: 32px 0 !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        padding: '18px 60px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '1px solid rgba(104,76,40,0.15)',
        background: 'rgba(254,250,242,0.93)', backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <a href="/" style={{
          fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700,
          color: '#1f1a0e', textDecoration: 'none',
        }}>sticksy</a>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(31,26,14,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Sample Report · Illustrative Only
          </span>
          <button
            className="no-print"
            onClick={() => window.print()}
            style={{
              background: 'none', border: '1px solid rgba(104,76,40,0.2)',
              padding: '8px 16px', fontSize: 12, cursor: 'pointer',
              color: 'rgba(31,26,14,0.5)', fontFamily: 'inherit',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
          >
            Download PDF
          </button>
        </div>
      </nav>

      {/* ── REPORT HEADER ── */}
      <div style={{ background: '#f0e8d6', borderBottom: '1px solid rgba(104,76,40,0.15)' }}>
        <div className="header-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 60px 60px' }}>
          <p style={{
            fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#b8681d', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'block', width: 24, height: 1.5, background: '#b8681d', opacity: 0.6 }} />
            Member Intelligence Report · Sample · Illustrative Only
          </p>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 900, lineHeight: 0.95,
            letterSpacing: '-0.02em', maxWidth: 760, marginBottom: 24,
          }}>
            Retention and conversion,<br />
            <em style={{ fontStyle: 'italic', color: '#b8681d' }}>together.</em>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(31,26,14,0.6)', maxWidth: 560, lineHeight: 1.65, marginBottom: 36 }}>
            A snapshot of a sample club — illustrative figures based on a 680-member club, open select days for public dining, events, and recreation.
          </p>

          {/* Snapshot metrics */}
          <div className="snapshot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            {[
              { label: 'Active Members',     value: '680' },
              { label: 'Monthly Spend',      value: '$224' },
              { label: 'Avg Public Spend',   value: '$67' },
              { label: 'Monthly Churn',      value: '5.8%' },
              { label: 'Total MRR at Risk',  value: '$63K' },
              { label: 'Public Conversion',  value: '11%' },
            ].map(m => (
              <div key={m.label} style={{
                background: '#fefaf2', padding: '20px 16px',
                border: '1px solid rgba(104,76,40,0.15)', textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700,
                  color: '#b8681d', lineHeight: 1, marginBottom: 6,
                }}>{m.value}</p>
                <p style={{ fontSize: 11, color: 'rgba(31,26,14,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          <p className="report-note" style={{ marginTop: 16 }}>
            All figures in this report are illustrative. Your data will show where your numbers actually land.
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="body-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 60px' }}>

        {/* ── MEMBER SEGMENTS ── */}
        <section className="report-section" style={{ padding: '72px 0' }}>
          <p className="section-label">Member Segments</p>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(26px, 3vw, 38px)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            Eight heterogenous profiles means eight playbooks.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(31,26,14,0.6)', maxWidth: 600, lineHeight: 1.65, marginBottom: 48 }}>
            Members with multiple activity anchors generate the revenue to sustain the club. Members who connect with a second or third anchor within their first weeks retain at nearly 2× the rate of single-anchor members.
          </p>

          <div className="segments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {SEGMENTS.map(seg => (
              <div key={seg.name} className="seg-card" style={{ borderTopColor: seg.color }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12, gap: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                      {seg.name}
                    </h3>
                    <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.45)', letterSpacing: '0.05em' }}>{seg.pct}</p>
                  </div>
                  <span style={{
                    fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: seg.color, whiteSpace: 'nowrap', paddingTop: 2,
                  }}>{seg.clv}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(31,26,14,0.7)', marginBottom: 12 }}>
                  {seg.desc}
                </p>
                <div style={{ borderTop: '1px solid rgba(104,76,40,0.1)', paddingTop: 12, marginBottom: 8 }}>
                  <p style={{ fontSize: 12, color: '#b55a3c', marginBottom: 6 }}>
                    <strong style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10 }}>Risk: </strong>
                    {seg.risk}
                  </p>
                  <p style={{ fontSize: 12, color: '#5a9e6f' }}>
                    <strong style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10 }}>Action: </strong>
                    {seg.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="rule" />

        {/* ── MEMBER JOURNEYS ── */}
        <section className="report-section" style={{ padding: '72px 0' }}>
          <p className="section-label">Member Journeys</p>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(26px, 3vw, 38px)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            How members arrive — and what that predicts.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(31,26,14,0.6)', maxWidth: 580, lineHeight: 1.65, marginBottom: 48 }}>
            Not all acquisition paths produce the same member. The entry point predicts 12-month retention with meaningful accuracy.
          </p>

          {/* Conversion table */}
          <div style={{ background: '#f0e8d6', border: '1px solid rgba(104,76,40,0.15)', padding: '8px', marginBottom: 40 }}>
            <table>
              <thead>
                <tr>
                  <th>Guest Entry Point</th>
                  <th>Avg Visits Before Join</th>
                  <th>Conv. Rate</th>
                  <th>12-Mo Retention</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Referred by existing member',      '1.2', '34%', '82%'],
                  ['Attended a member-priority event',  '1.8', '19%', '74%'],
                  ['Kids or family programming',        '2.0', '16%', '79%'],
                  ['Regular dining guest (3+ visits)',  '2.3', '14%', '68%'],
                  ['Recurring public social event',     '3.1', '11%', '61%'],
                  ['Online or social media only',       '1.0',  '6%', '44%'],
                ].map(([entry, visits, conv, ret]) => (
                  <tr key={entry}>
                    <td style={{ fontWeight: 400 }}>{entry}</td>
                    <td style={{ color: 'rgba(31,26,14,0.55)' }}>{visits}</td>
                    <td style={{ color: '#b8681d', fontWeight: 500 }}>{conv}</td>
                    <td style={{ color: '#5a9e6f', fontWeight: 500 }}>{ret}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Journey cards */}
          <div>
            {JOURNEYS.map(j => (
              <div key={j.name} className="journey-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>{j.name}</h3>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span className="metric-pill">3-Yr CLV: {j.clv}</span>
                    <span className="metric-pill">12-Mo Retention: {j.retention}</span>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(31,26,14,0.55)', lineHeight: 1.6, marginBottom: 10 }}>
                  <strong style={{ color: '#b8681d', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Path: </strong>
                  {j.path}
                </p>
                <p style={{ fontSize: 14, color: 'rgba(31,26,14,0.7)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#5a9e6f', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Action: </strong>
                  {j.action}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="rule" />

        {/* ── MARKETING CHANNELS ── */}
        <section className="report-section" style={{ padding: '72px 0' }}>
          <p className="section-label">Marketing Channels</p>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(26px, 3vw, 38px)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            Estimated CAC by acquisition channel.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(31,26,14,0.6)', maxWidth: 580, lineHeight: 1.65, marginBottom: 40 }}>
            The channel with the highest CLV-to-CAC ratio is typically the member referral program. The second-highest is typically in-person guest conversion.
          </p>

          <div style={{ background: '#f0e8d6', border: '1px solid rgba(104,76,40,0.15)', padding: '8px' }}>
            <table>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Est. CAC</th>
                  <th>Avg 3-Yr CLV</th>
                  <th>CLV:CAC Ratio</th>
                  <th>Current Status</th>
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map(ch => (
                  <tr key={ch.name}>
                    <td style={{ fontWeight: 400 }}>{ch.name}</td>
                    <td style={{ color: 'rgba(31,26,14,0.55)' }}>{ch.cac}</td>
                    <td style={{ color: 'rgba(31,26,14,0.55)' }}>{ch.clv}</td>
                    <td style={{ color: '#b8681d', fontWeight: 500 }}>{ch.ratio}</td>
                    <td style={{ color: ch.statusColor, fontSize: 13 }}>{ch.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="report-note" style={{ marginTop: 12 }}>
            CLV figures reflect sample member spend including dining, recreation, and events.
          </p>
        </section>

        <div className="rule" />

        {/* ── EXAMPLE RECOMMENDATION ── */}
        <section className="report-section" style={{ padding: '72px 0' }}>
          <p className="section-label">Example Recommendation</p>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(26px, 3vw, 38px)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 40,
          }}>
            The single strongest predictor of 12-month retention.
          </h2>

          <div style={{
            background: '#111008', color: '#fefaf2',
            padding: '48px 44px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(254,250,242,0.78)', marginBottom: 24 }}>
              The single strongest predictor of 12-month retention is whether a new member adds a second activity category before month four. Members who do not add a second category by month four typically show a churn probability of 48% by month six.
            </p>
            <div style={{ borderTop: '1px solid rgba(254,250,242,0.1)', paddingTop: 24 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e0a343', marginBottom: 12 }}>
                Action If Confirmed
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(254,250,242,0.75)' }}>
                Personal outreach at day 30. Direct invitation to one member-exclusive event before month three. Staff introduction to a second category based on the member's recorded primary activity.
              </p>
            </div>
          </div>
          <p className="report-note">Figures in this section are illustrative. Your data will show the exact timing and probability for your member base.</p>
        </section>

        <div className="rule" />

        {/* ── CTA ── */}
        <section style={{ padding: '80px 0', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 900, lineHeight: 1.0,
            letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            Your data holds<br />
            <em style={{ fontStyle: 'italic', color: '#b8681d' }}>the answers.</em>
          </h2>
          <p style={{
            fontSize: 16, color: 'rgba(31,26,14,0.55)',
            maxWidth: 400, margin: '0 auto 40px', lineHeight: 1.65,
          }}>
            Get a preliminary report built around your business — or see the full dashboard on live data.
          </p>
          <div className="no-print" style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="/report" className="btn-gold">
              Get your preliminary report
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/dashboard/access" className="btn-outline">
              See the live dashboard
            </a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.3)', marginTop: 20 }} className="no-print">
            No commitment required
          </p>
        </section>

      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#f0e8d6', padding: '36px 60px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(104,76,40,0.15)',
      }}>
        <a href="/" style={{
          fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700,
          color: '#1f1a0e', textDecoration: 'none',
        }}>sticksy</a>
        <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.35)', maxWidth: 400, textAlign: 'center', lineHeight: 1.5 }}>
          All figures in this report are illustrative only. Sticksy Member Intelligence Reports are generated from your actual member data.
        </p>
        <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.4)' }}>
          © {new Date().getFullYear()} Sticksy · RSBR LLC
        </p>
      </footer>
    </div>
  )
}
