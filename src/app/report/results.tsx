'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// ── VERTICAL CONFIG ───────────────────────────────────────────────────────────

const VERTICAL_CONFIG: Record<string, {
  label: string
  memberNoun: string
  activityNoun: string
  churnBenchmark: number
  anchorPct: number
  activatorPct: number
  faderPct: number
  ghostPct: number
  insight: string
  intervention: string
}> = {
  club: {
    label: 'Private / Social Club',
    memberNoun: 'members',
    activityNoun: 'facility categories',
    churnBenchmark: 0.058,
    anchorPct: 0.12,
    activatorPct: 0.18,
    faderPct: 0.14,
    ghostPct: 0.04,
    insight: 'Members who engage with two or more facility categories in their first 90 days retain at nearly 2× the rate of single-activity members.',
    intervention: 'A personal check-in at day 30 with a direct invitation to one secondary activity is the highest-leverage action available for new members.',
  },
  winery: {
    label: 'Winery / Wine Club',
    memberNoun: 'club members',
    activityNoun: 'tasting experiences',
    churnBenchmark: 0.065,
    anchorPct: 0.14,
    activatorPct: 0.20,
    faderPct: 0.16,
    ghostPct: 0.03,
    insight: 'Wine club members who attend at least one tasting event per quarter retain at significantly higher rates than those who receive shipments only.',
    intervention: 'A personal invitation to a member-exclusive tasting within the first 60 days is the single strongest retention action for new wine club members.',
  },
  fitness: {
    label: 'Fitness Studio / Gym',
    memberNoun: 'members',
    activityNoun: 'class formats',
    churnBenchmark: 0.072,
    anchorPct: 0.10,
    activatorPct: 0.22,
    faderPct: 0.18,
    ghostPct: 0.05,
    insight: 'Members who try two or more class formats in their first 30 days are significantly less likely to cancel within six months.',
    intervention: 'A staff introduction to a second class format — matched to their primary activity — within the first two weeks produces the strongest early retention results.',
  },
  coworking: {
    label: 'Coworking Space',
    memberNoun: 'members',
    activityNoun: 'space types',
    churnBenchmark: 0.062,
    anchorPct: 0.11,
    activatorPct: 0.19,
    faderPct: 0.15,
    ghostPct: 0.04,
    insight: 'Coworking members who attend at least one community event per month retain at higher rates and refer new members more frequently.',
    intervention: 'A personal welcome and community event invitation within the first week sets the retention trajectory for coworking members.',
  },
  insurance: {
    label: 'Insurance / Warranty',
    memberNoun: 'policyholders',
    activityNoun: 'policy types',
    churnBenchmark: 0.045,
    anchorPct: 0.15,
    activatorPct: 0.16,
    faderPct: 0.12,
    ghostPct: 0.06,
    insight: 'Policyholders who add a second product within 90 days show significantly lower lapse rates at renewal.',
    intervention: 'A proactive outreach at the 45-day mark — focused on policy review and cross-sell — produces the strongest retention and lifetime value outcomes.',
  },
  nonprofit: {
    label: 'Nonprofit / Alumni Org',
    memberNoun: 'members',
    activityNoun: 'program types',
    churnBenchmark: 0.055,
    anchorPct: 0.13,
    activatorPct: 0.17,
    faderPct: 0.14,
    ghostPct: 0.03,
    insight: 'Members who participate in at least one event or program per quarter are significantly more likely to renew and increase their giving level.',
    intervention: 'A personal acknowledgment at the one-year anniversary — tied to their specific contributions — is the highest-ROI retention action for nonprofit members.',
  },
}

// ── CALCULATIONS ──────────────────────────────────────────────────────────────

function calcReport(params: URLSearchParams) {
  const vertical     = params.get('vertical') || 'club'
  const membersMid   = parseInt(params.get('members') || '375')
  const spendMid     = parseInt(params.get('spend') || '175')
  const lostMid      = parseInt(params.get('lost') || '8')
  const membersLabel = params.get('membersLabel') || ''
  const spendLabel   = params.get('spendLabel') || ''
  const lostLabel    = params.get('lostLabel') || ''

  const config = VERTICAL_CONFIG[vertical] || VERTICAL_CONFIG.club

  const mrr              = membersMid * spendMid
  const arr              = mrr * 12
  const churnRate        = lostMid / membersMid
  const mrrAtRisk        = Math.round(mrr * churnRate)
  const annualChurnCost  = mrrAtRisk * 12
  const threeYearCost    = Math.round(annualChurnCost * 3.4) // compounding effect
  const benchmarkChurn   = config.churnBenchmark
  const vsIndustry       = ((churnRate - benchmarkChurn) / benchmarkChurn) * 100
  const lifetimeMonths   = churnRate > 0 ? Math.round(1 / churnRate) : 36
  const avgLTV           = spendMid * lifetimeMonths

  // Segment estimates
  const anchors    = Math.round(membersMid * config.anchorPct)
  const activators = Math.round(membersMid * config.activatorPct)
  const faders     = Math.round(membersMid * config.faderPct)
  const ghosts     = Math.round(membersMid * config.ghostPct)
  const atRisk     = faders + ghosts

  // Format helpers
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString()}`
  const fmtBig = (n: number) =>
    n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`

  return {
    vertical, config, membersLabel, spendLabel, lostLabel,
    membersMid, spendMid, lostMid,
    mrr, arr, churnRate, mrrAtRisk, annualChurnCost, threeYearCost,
    benchmarkChurn, vsIndustry, lifetimeMonths, avgLTV,
    anchors, activators, faders, ghosts, atRisk,
    fmt, fmtBig, pct,
  }
}

// ── RESULT COMPONENT ─────────────────────────────────────────────────────────

function ReportResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const r = calcReport(searchParams)
  const { config, fmt, fmtBig, pct } = r

  const aboveIndustry = r.vsIndustry > 0

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fefaf2', color: '#1f1a0e' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .metric-card {
          background: #fefaf2;
          border: 1px solid rgba(104,76,40,0.15);
          padding: 28px 24px;
        }
        .metric-card.highlight {
          background: #111008;
          color: #fefaf2;
          border-color: #111008;
        }
        .metric-card.warning {
          background: #fdf0e0;
          border-color: rgba(184,104,29,0.3);
          border-left: 3px solid #b8681d;
        }

        .seg-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 0; border-bottom: 1px solid rgba(104,76,40,0.1);
        }
        .seg-row:last-child { border-bottom: none; }

        .bar-bg {
          height: 6px; background: rgba(104,76,40,0.1);
          flex: 1; margin: 0 16px;
        }
        .bar-fill { height: 100%; transition: width 0.6s ease; }

        .btn-gold {
          display: inline-flex; align-items: center; gap: 10px;
          background: #e0a343; color: #111008;
          padding: 16px 32px; font-size: 15px; font-weight: 500;
          letter-spacing: 0.04em; border: none; cursor: pointer;
          transition: background 0.2s; font-family: 'DM Sans', sans-serif;
          text-decoration: none;
        }
        .btn-gold:hover { background: #f2c14e; }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 10px;
          background: none; color: rgba(31,26,14,0.5);
          padding: 16px 32px; font-size: 14px; font-weight: 400;
          border: 1px solid rgba(104,76,40,0.2); cursor: pointer;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          text-decoration: none;
        }
        .btn-outline:hover { border-color: #b8681d; color: #b8681d; }

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

        @media (max-width: 768px) {
          .metrics-grid { grid-template-columns: 1fr 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; gap: 24px !important; }
          .cta-actions { flex-direction: column !important; align-items: stretch !important; }
          .report-header { padding: 60px 24px 40px !important; }
          .report-body { padding: 0 24px !important; }
          .report-section { padding: 48px 0 !important; }
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
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(31,26,14,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Member Intelligence Report
          </span>
          <button
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

      {/* ── HEADER ── */}
      <div className="report-header" style={{
        background: '#f0e8d6', padding: '80px 60px 60px',
        borderBottom: '1px solid rgba(104,76,40,0.15)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p className="section-label">Preliminary Report · {config.label}</p>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 900, lineHeight: 0.95,
            letterSpacing: '-0.02em', maxWidth: 800,
            marginBottom: 24,
          }}>
            Your member data<br />
            <em style={{ fontStyle: 'italic', color: '#b8681d' }}>tells a story.</em>
          </h1>
          <p style={{
            fontSize: 17, color: 'rgba(31,26,14,0.6)',
            maxWidth: 560, lineHeight: 1.65,
          }}>
            Based on {r.membersLabel.toLowerCase()} {config.memberNoun} at {r.spendLabel.toLowerCase()} per month.
            This report uses vertical benchmarks to surface what your data likely shows —
            and what to do about it.
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="report-body" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 60px' }}>

        {/* ── LAYER 1: MIRROR ── */}
        <section className="report-section" style={{ padding: '72px 0' }}>
          <p className="section-label">Your Numbers</p>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(26px, 3vw, 36px)',
            fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 36,
          }}>
            Here is what your business looks like right now.
          </h2>

          <div className="metrics-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
          }}>
            {[
              { label: 'Monthly Recurring Revenue', value: fmt(r.mrr), sub: 'Based on your inputs' },
              { label: 'Annual Revenue Run Rate',   value: fmtBig(r.arr), sub: 'At current member base' },
              { label: 'Monthly Churn Rate',        value: pct(r.churnRate), sub: `${r.lostMid} members lost last month` },
              { label: 'MRR at Risk This Month',    value: fmt(r.mrrAtRisk), sub: 'From current churn rate', highlight: true },
              { label: 'Avg Member Lifetime',       value: `${r.lifetimeMonths} months`, sub: 'At current churn rate' },
              { label: 'Avg Member Lifetime Value', value: fmt(r.avgLTV), sub: 'Revenue per member before churn' },
            ].map((m) => (
              <div key={m.label} className={`metric-card ${m.highlight ? 'highlight' : ''}`}>
                <p style={{
                  fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: m.highlight ? 'rgba(254,250,242,0.5)' : 'rgba(31,26,14,0.4)',
                  marginBottom: 10,
                }}>{m.label}</p>
                <p style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(28px, 3vw, 40px)',
                  fontWeight: 700, lineHeight: 1,
                  color: m.highlight ? '#e0a343' : '#1f1a0e',
                  marginBottom: 8, letterSpacing: '-0.01em',
                }}>{m.value}</p>
                <p style={{
                  fontSize: 12,
                  color: m.highlight ? 'rgba(254,250,242,0.4)' : 'rgba(31,26,14,0.4)',
                }}>{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Industry comparison */}
          <div className="metric-card warning" style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{
                  fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#b8681d', marginBottom: 8,
                }}>Industry Comparison</p>
                <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5, maxWidth: 600 }}>
                  {aboveIndustry
                    ? `Your monthly churn rate of ${pct(r.churnRate)} is ${Math.abs(r.vsIndustry).toFixed(0)}% above the ${config.label.toLowerCase()} benchmark of ${pct(r.benchmarkChurn)}. There is meaningful retention opportunity here.`
                    : `Your monthly churn rate of ${pct(r.churnRate)} is ${Math.abs(r.vsIndustry).toFixed(0)}% below the ${config.label.toLowerCase()} benchmark of ${pct(r.benchmarkChurn)}. Your retention is performing well — the opportunity is now in identifying which segments to protect.`
                  }
                </p>
              </div>
              <div style={{ textAlign: 'right', minWidth: 120 }}>
                <p style={{ fontSize: 11, color: 'rgba(31,26,14,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                  Your churn
                </p>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, color: aboveIndustry ? '#b55a3c' : '#5a9e6f' }}>
                  {pct(r.churnRate)}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(31,26,14,0.4)', marginTop: 4 }}>
                  vs {pct(r.benchmarkChurn)} industry avg
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="rule" />

        {/* ── LAYER 2: REVEAL ── */}
        <section className="report-section" style={{ padding: '72px 0' }}>
          <p className="section-label">What Your Data Likely Shows</p>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(26px, 3vw, 36px)',
            fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            Your {config.memberNoun} are not one group.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(31,26,14,0.6)', maxWidth: 600, lineHeight: 1.65, marginBottom: 48 }}>
            Based on your churn rate and vertical benchmarks, here is how your {config.memberNoun} are likely distributed across behavioral segments right now.
          </p>

          {/* Segment bars */}
          <div style={{
            background: '#f0e8d6', border: '1px solid rgba(104,76,40,0.15)',
            padding: '32px 28px', marginBottom: 24,
          }}>
            {[
              { name: 'The Anchor',    count: r.anchors,    pct: r.config.anchorPct,    color: '#5a9e6f', desc: 'High-value, multi-activity. Your revenue foundation.' },
              { name: 'The Activator', count: r.activators, pct: r.config.activatorPct, color: '#e0a343', desc: 'New members in the critical first 120 days.' },
              { name: 'The Fader',     count: r.faders,     pct: r.config.faderPct,     color: '#b8681d', desc: 'Disengaging. Decision forming. Act now.' },
              { name: 'The Ghost',     count: r.ghosts,     pct: r.config.ghostPct,     color: '#b55a3c', desc: 'Billing failure. Member unaware. 72-hour window.' },
            ].map((seg) => (
              <div key={seg.name} className="seg-row">
                <div style={{ minWidth: 130 }}>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, marginBottom: 2 }}>
                    {seg.name}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.45)' }}>~{seg.count} {config.memberNoun}</p>
                </div>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${seg.pct * 100 * 3}%`, background: seg.color }} />
                </div>
                <div style={{ minWidth: 200, textAlign: 'right' }}>
                  <p style={{ fontSize: 13, color: 'rgba(31,26,14,0.55)', lineHeight: 1.4 }}>{seg.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Three-year cost */}
          <div style={{
            background: '#111008', color: '#fefaf2',
            padding: '36px 32px', marginBottom: 24,
          }}>
            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e0a343', marginBottom: 12 }}>
                  The Cost of Inaction
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(254,250,242,0.75)' }}>
                  At your current churn rate, the compounding three-year cost of member attrition — accounting for lost lifetime value and replacement cost — is estimated at:
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 900, color: '#e0a343',
                  lineHeight: 1, letterSpacing: '-0.02em',
                }}>
                  {fmtBig(r.threeYearCost)}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(254,250,242,0.35)', marginTop: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  3-year compounding cost
                </p>
              </div>
            </div>
          </div>

          {/* Key insight */}
          <div style={{
            borderLeft: '3px solid #e0a343',
            paddingLeft: 24, marginBottom: 24,
          }}>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b8681d', marginBottom: 10 }}>
              Key Finding for {config.label}
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: '#1f1a0e' }}>
              {config.insight}
            </p>
          </div>

          {/* Top intervention */}
          <div style={{
            background: '#fdf6e8', border: '1px solid rgba(184,104,29,0.2)',
            padding: '28px 24px',
          }}>
            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b8681d', marginBottom: 10 }}>
              Highest-Impact Intervention
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: '#1f1a0e' }}>
              {config.intervention}
            </p>
          </div>
        </section>

        <div className="rule" />

        {/* ── LAYER 3: WITHHOLD ── */}
        <section className="report-section" style={{ padding: '72px 0' }}>
          <p className="section-label">What Your Data Would Show</p>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(26px, 3vw, 36px)',
            fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            This report uses benchmarks.<br />
            <em style={{ fontStyle: 'italic', color: '#b8681d' }}>Your data would show the names.</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(31,26,14,0.6)', maxWidth: 580, lineHeight: 1.65, marginBottom: 48 }}>
            The segment estimates above are based on industry patterns. Connected to your actual member data, Sticksy identifies exactly which of your {config.memberNoun} are in each segment — and generates a specific action for each one.
          </p>

          {[
            {
              locked: true,
              title: 'Full Segment Breakdown',
              desc: `Which of your ${r.membersMid.toLocaleString()} ${config.memberNoun} are Anchors, Activators, Faders, and Ghosts — by name.`,
            },
            {
              locked: true,
              title: 'Intervention Playbook',
              desc: 'Segment-by-segment outreach plan with timing, channel, message, and expected ROI — calibrated to your actual data.',
            },
            {
              locked: true,
              title: 'Channel CAC Analysis',
              desc: 'Which acquisition channels produce your highest-LTV members. Where to invest and where to stop.',
            },
            {
              locked: true,
              title: 'Churn Prediction Model',
              desc: `Which of your ${config.memberNoun} are most likely to cancel in the next 60 days — before they decide.`,
            },
          ].map((item) => (
            <div key={item.title} style={{
              display: 'flex', alignItems: 'start', gap: 20,
              padding: '20px 0', borderBottom: '1px solid rgba(104,76,40,0.1)',
            }}>
              <div style={{
                width: 32, height: 32, minWidth: 32,
                background: 'rgba(104,76,40,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 2,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="3" y="6" width="8" height="7" rx="0.5" stroke="#b8681d" strokeWidth="1.2"/>
                  <path d="M5 6V4.5a2 2 0 014 0V6" stroke="#b8681d" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 500, color: '#1f1a0e', marginBottom: 4 }}>{item.title}</p>
                <p style={{ fontSize: 14, color: 'rgba(31,26,14,0.5)', lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            </div>
          ))}
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
            See this on your<br />
            <em style={{ fontStyle: 'italic', color: '#b8681d' }}>actual data.</em>
          </h2>
          <p style={{
            fontSize: 16, color: 'rgba(31,26,14,0.55)',
            maxWidth: 420, margin: '0 auto 40px', lineHeight: 1.65,
          }}>
            Connect your member data and get the full report — with names, predictions, and a specific playbook for each segment.
          </p>
          <div className="cta-actions" style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
            <a href="/dashboard" className="btn-gold">
              See the live dashboard
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="mailto:hello@sticksy.ai" className="btn-outline">
              Talk to us first
            </a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.3)', marginTop: 20, letterSpacing: '0.04em' }}>
            No commitment required to see the dashboard
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
          Figures in this report are illustrative, based on vertical benchmarks and your inputs. Your actual data will show where your numbers land.
        </p>
        <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.4)' }}>
          © {new Date().getFullYear()} Sticksy · RSBR LLC
        </p>
      </footer>
    </div>
  )
}

export default function ReportResultsPage() {
  return (
    <Suspense fallback={
      <div style={{
        fontFamily: "'DM Sans', sans-serif", background: '#fefaf2',
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#b8681d', fontSize: 16,
      }}>
        Generating your report...
      </div>
    }>
      <ReportResults />
    </Suspense>
  )
}
