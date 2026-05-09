'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

// ── DATA ──────────────────────────────────────────────────────────────────────

const VERTICALS = [
  { value: 'club',      label: 'Private / social club' },
  { value: 'winery',    label: 'Winery / wine club' },
  { value: 'fitness',   label: 'Fitness studio / gym' },
  { value: 'coworking', label: 'Coworking space' },
  { value: 'insurance', label: 'Insurance / warranty' },
  { value: 'nonprofit', label: 'Nonprofit / alumni org' },
]

// Spend ranges keyed by vertical — calibrated to each industry
const SPEND_RANGES: Record<string, { label: string; value: string; mid: number }[]> = {
  club: [
    { label: 'Under $100 / mo',    value: 'under_100',   mid: 70 },
    { label: '$100 – $250 / mo',   value: '100_250',     mid: 175 },
    { label: '$250 – $500 / mo',   value: '250_500',     mid: 375 },
    { label: '$500 – $1,000 / mo', value: '500_1000',    mid: 750 },
    { label: '$1,000+ / mo',       value: 'over_1000',   mid: 1200 },
  ],
  winery: [
    { label: 'Under $50 / mo',     value: 'under_50',    mid: 35 },
    { label: '$50 – $100 / mo',    value: '50_100',      mid: 75 },
    { label: '$100 – $200 / mo',   value: '100_200',     mid: 150 },
    { label: '$200 – $400 / mo',   value: '200_400',     mid: 300 },
    { label: '$400+ / mo',         value: 'over_400',    mid: 500 },
  ],
  fitness: [
    { label: 'Under $30 / mo',     value: 'under_30',    mid: 22 },
    { label: '$30 – $60 / mo',     value: '30_60',       mid: 45 },
    { label: '$60 – $120 / mo',    value: '60_120',      mid: 90 },
    { label: '$120 – $250 / mo',   value: '120_250',     mid: 185 },
    { label: '$250+ / mo',         value: 'over_250',    mid: 320 },
  ],
  coworking: [
    { label: 'Under $100 / mo',    value: 'under_100',   mid: 70 },
    { label: '$100 – $250 / mo',   value: '100_250',     mid: 175 },
    { label: '$250 – $500 / mo',   value: '250_500',     mid: 375 },
    { label: '$500 – $1,000 / mo', value: '500_1000',    mid: 750 },
    { label: '$1,000+ / mo',       value: 'over_1000',   mid: 1200 },
  ],
  insurance: [
    { label: 'Under $20 / mo',     value: 'under_20',    mid: 14 },
    { label: '$20 – $50 / mo',     value: '20_50',       mid: 35 },
    { label: '$50 – $100 / mo',    value: '50_100',      mid: 75 },
    { label: '$100 – $200 / mo',   value: '100_200',     mid: 150 },
    { label: '$200+ / mo',         value: 'over_200',    mid: 260 },
  ],
  nonprofit: [
    { label: 'Under $10 / mo',     value: 'under_10',    mid: 7 },
    { label: '$10 – $25 / mo',     value: '10_25',       mid: 17 },
    { label: '$25 – $75 / mo',     value: '25_75',       mid: 50 },
    { label: '$75 – $150 / mo',    value: '75_150',      mid: 112 },
    { label: '$150+ / mo',         value: 'over_150',    mid: 200 },
  ],
}

// Member count ranges
const MEMBER_RANGES = [
  { label: 'Under 250',     value: 'under_250',  mid: 150,  max: 250 },
  { label: '250 – 500',     value: '250_500',    mid: 375,  max: 500 },
  { label: '500 – 1,000',   value: '500_1000',   mid: 750,  max: 1000 },
  { label: '1,000 – 2,500', value: '1000_2500',  mid: 1750, max: 2500 },
  { label: '2,500+',        value: 'over_2500',  mid: 3500, max: 9999 },
]

// Lost members ranges — calculated relative to total members mid
function getLostRanges(membersMid: number) {
  const p = (pct: number) => Math.max(1, Math.round(membersMid * pct))
  return [
    { label: `${p(0.001)} – ${p(0.01)}`,  value: 'very_low',  mid: p(0.005)  },
    { label: `${p(0.01)} – ${p(0.03)}`,   value: 'low',       mid: p(0.02)   },
    { label: `${p(0.03)} – ${p(0.06)}`,   value: 'moderate',  mid: p(0.045)  },
    { label: `${p(0.06)} – ${p(0.10)}`,   value: 'high',      mid: p(0.08)   },
    { label: `${p(0.10)}+`,               value: 'very_high', mid: p(0.13)   },
  ]
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

function ReportForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialVertical = searchParams.get('vertical') || 'club'

  const [step, setStep] = useState(1)
  const [vertical, setVertical]     = useState(initialVertical)
  const [members, setMembers]       = useState('')
  const [spend, setSpend]           = useState('')
  const [lost, setLost]             = useState('')
  const [email, setEmail]           = useState('')
  const [emailError, setEmailError] = useState('')

  const memberRange  = MEMBER_RANGES.find(r => r.value === members)
  const spendRanges  = SPEND_RANGES[vertical] || SPEND_RANGES.club
  const spendRange   = spendRanges.find(r => r.value === spend)
  const lostRanges   = memberRange ? getLostRanges(memberRange.mid) : []
  const lostRange    = lostRanges.find(r => r.value === lost)

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps) setStep(s => s + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1)
  }

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError('')

    const params = new URLSearchParams({
      vertical,
      members:      memberRange?.mid.toString() || '',
      membersLabel: memberRange?.label || '',
      spend:        spendRange?.mid.toString() || '',
      spendLabel:   spendRange?.label || '',
      lost:         lostRange?.mid.toString() || '',
      lostLabel:    lostRange?.label || '',
      email,
    })

    router.push(`/report/results?${params.toString()}`)
  }

  const canProceed = () => {
    if (step === 1) return !!vertical
    if (step === 2) return !!members
    if (step === 3) return !!spend
    if (step === 4) return !!lost
    if (step === 5) return email.length > 0
    return false
  }

  const verticalLabel = VERTICALS.find(v => v.value === vertical)?.label || ''

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fefaf2', minHeight: '100vh', color: '#1f1a0e' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .option-btn {
          display: block; width: 100%; text-align: left;
          padding: 16px 20px; background: #fefaf2;
          border: 1px solid rgba(104,76,40,0.18);
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          color: #1f1a0e; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .option-btn:hover { border-color: #e0a343; background: #fdf6e8; }
        .option-btn.selected {
          border-color: #b8681d; background: #fdf6e8;
          font-weight: 500;
        }
        .option-btn.selected::after {
          content: '✓';
          float: right;
          color: #b8681d;
        }

        .next-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #111008; color: #fefaf2;
          padding: 14px 28px; font-size: 14px; font-weight: 500;
          letter-spacing: 0.04em; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .next-btn:hover:not(:disabled) { background: #b8681d; }
        .next-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer;
          color: rgba(31,26,14,0.4); font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s; padding: 0;
        }
        .back-btn:hover { color: #b8681d; }

        .email-input {
          width: 100%; padding: 16px 20px;
          border: 1px solid rgba(104,76,40,0.18);
          background: #fefaf2; font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: #1f1a0e; outline: none;
          transition: border-color 0.2s;
        }
        .email-input:focus { border-color: #b8681d; }
        .email-input::placeholder { color: rgba(31,26,14,0.35); }

        .progress-bar {
          height: 2px; background: rgba(104,76,40,0.12);
          margin-bottom: 48px;
        }
        .progress-fill {
          height: 100%; background: #e0a343;
          transition: width 0.4s ease;
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        padding: '18px 60px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '1px solid rgba(104,76,40,0.15)',
        background: 'rgba(254,250,242,0.93)', backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <a href="/" style={{
          fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700,
          color: '#1f1a0e', textDecoration: 'none', letterSpacing: '-0.01em',
        }}>sticksy</a>
        <span style={{ fontSize: 12, color: 'rgba(31,26,14,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Member Intelligence Report
        </span>
      </nav>

      {/* Form */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px' }}>

        {/* Progress */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>

        {/* Step indicator */}
        <p style={{
          fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#b8681d', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ display: 'block', width: 24, height: 1.5, background: '#b8681d', opacity: 0.6 }} />
          Step {step} of {totalSteps}
        </p>

        {/* ── STEP 1: VERTICAL ── */}
        {step === 1 && (
          <div>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 8,
            }}>
              What kind of membership business are you?
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(31,26,14,0.55)', marginBottom: 32, lineHeight: 1.6 }}>
              We'll calibrate your report to your vertical.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {VERTICALS.map(v => (
                <button
                  key={v.value}
                  className={`option-btn ${vertical === v.value ? 'selected' : ''}`}
                  onClick={() => setVertical(v.value)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: MEMBERS ── */}
        {step === 2 && (
          <div>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 8,
            }}>
              Approximately how many active members do you have?
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(31,26,14,0.55)', marginBottom: 32, lineHeight: 1.6 }}>
              A rough number is fine.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MEMBER_RANGES.map(r => (
                <button
                  key={r.value}
                  className={`option-btn ${members === r.value ? 'selected' : ''}`}
                  onClick={() => setMembers(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: SPEND ── */}
        {step === 3 && (
          <div>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 8,
            }}>
              What does a typical member pay per month?
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(31,26,14,0.55)', marginBottom: 32, lineHeight: 1.6 }}>
              Based on your {verticalLabel.toLowerCase()} — pick the closest range.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {spendRanges.map(r => (
                <button
                  key={r.value}
                  className={`option-btn ${spend === r.value ? 'selected' : ''}`}
                  onClick={() => setSpend(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: LOST ── */}
        {step === 4 && (
          <div>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 8,
            }}>
              How many members did you lose last month?
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(31,26,14,0.55)', marginBottom: 32, lineHeight: 1.6 }}>
              Approximate is fine. Out of your {memberRange?.label.toLowerCase() || ''} members.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lostRanges.map(r => (
                <button
                  key={r.value}
                  className={`option-btn ${lost === r.value ? 'selected' : ''}`}
                  onClick={() => setLost(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 5: EMAIL ── */}
        {step === 5 && (
          <div>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 8,
            }}>
              Where should we send your report?
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(31,26,14,0.55)', marginBottom: 32, lineHeight: 1.6 }}>
              Your report is ready to generate. Enter your email to receive it.
            </p>

            {/* Summary */}
            <div style={{
              background: '#f0e8d6', padding: '20px 24px',
              border: '1px solid rgba(104,76,40,0.15)', marginBottom: 28,
            }}>
              <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b8681d', marginBottom: 12 }}>
                Your inputs
              </p>
              {[
                ['Vertical', verticalLabel],
                ['Members', memberRange?.label || ''],
                ['Avg monthly spend', spendRange?.label || ''],
                ['Lost last month', lostRange?.label || ''],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 14, paddingBottom: 8, marginBottom: 8,
                  borderBottom: '1px solid rgba(104,76,40,0.1)',
                }}>
                  <span style={{ color: 'rgba(31,26,14,0.5)' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>

            <input
              className="email-input"
              type="email"
              placeholder="you@yourbusiness.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError('') }}
              onKeyDown={e => { if (e.key === 'Enter' && canProceed()) handleSubmit() }}
            />
            {emailError && (
              <p style={{ fontSize: 13, color: '#b55a3c', marginTop: 8 }}>{emailError}</p>
            )}
            <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.35)', marginTop: 12, lineHeight: 1.5 }}>
              We'll email you a copy of your report.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 40,
        }}>
          <div>
            {step > 1 && (
              <button className="back-btn" onClick={handleBack}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M10 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
            )}
          </div>

          {step < totalSteps ? (
            <button className="next-btn" onClick={handleNext} disabled={!canProceed()}>
              Continue
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <button className="next-btn" onClick={handleSubmit} disabled={!canProceed()}>
              Generate my report
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fefaf2', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8681d' }}>
        Loading...
      </div>
    }>
      <ReportForm />
    </Suspense>
  )
}
