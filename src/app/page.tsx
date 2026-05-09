'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

const VERTICALS = [
  { value: 'club', label: 'Private / social club' },
  { value: 'winery', label: 'Winery / wine club' },
  { value: 'fitness', label: 'Fitness studio / gym' },
  { value: 'coworking', label: 'Coworking space' },
  { value: 'insurance', label: 'Insurance / warranty' },
  { value: 'nonprofit', label: 'Nonprofit / alumni org' },
]

const SEGMENTS = [
  {
    dot: '#5a9e6f',
    name: 'The Anchor',
    desc: 'Multi-activity. Long-plan holder. Membership woven into their weekly life.',
    stat: 'Avg 3-yr CLV: $9,700',
  },
  {
    dot: '#e0a343',
    name: 'The Activator',
    desc: 'New member, months 1–4. Highest-leverage window in the lifecycle.',
    stat: '48% churn risk if single-anchor at month 4',
  },
  {
    dot: '#b8681d',
    name: 'The Fader',
    desc: 'Still paying. Not showing up. The decision is already forming.',
    stat: 'High churn probability within 60 days',
  },
  {
    dot: '#b55a3c',
    name: 'The Ghost',
    desc: 'Billing failure. Member unaware. 88% recovery if contacted within 72 hours.',
    stat: 'Act within 72 hours',
  },
]

const STATS = [
  { number: '8', label: 'Member segments identified' },
  { number: '120d', label: 'Window to predict 12-month retention' },
  { number: '72hr', label: 'Payment ghost recovery window' },
  { number: '9.4×', label: 'ROI on highest-impact interventions' },
]

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, visible } = useFadeIn()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [vertical, setVertical] = useState('club')
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  const handleReport = () => {
    router.push(`/report?vertical=${vertical}`)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fefaf2', color: '#1f1a0e' }}>

      {/* ── FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        :root {
          --cream: #fefaf2;
          --cream-dark: #f0e8d6;
          --cream-deep: #e8dec6;
          --black: #111008;
          --honey: #b8681d;
          --gold: #e0a343;
          --gold-light: #f2c14e;
          --text: #1f1a0e;
          --text-soft: rgba(31,26,14,0.65);
          --text-muted: rgba(31,26,14,0.4);
          --border: rgba(104,76,40,0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .hero-glow-1 {
          position: absolute; top: -80px; right: -80px;
          width: 560px; height: 560px; pointer-events: none;
          background: radial-gradient(circle, rgba(224,163,67,0.13) 0%, transparent 70%);
        }
        .hero-glow-2 {
          position: absolute; bottom: 0; left: -120px;
          width: 480px; height: 480px; pointer-events: none;
          background: radial-gradient(circle, rgba(184,104,29,0.08) 0%, transparent 70%);
        }
        .cta-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 360px; pointer-events: none;
          background: radial-gradient(ellipse, rgba(224,163,67,0.18) 0%, transparent 70%);
        }

        @keyframes heroFade {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-eyebrow { animation: heroFade 0.65s ease forwards 0.15s; opacity: 0; }
        .hero-h1      { animation: heroFade 0.65s ease forwards 0.30s; opacity: 0; }
        .hero-sub     { animation: heroFade 0.65s ease forwards 0.45s; opacity: 0; }
        .hero-actions { animation: heroFade 0.65s ease forwards 0.60s; opacity: 0; }
        .stats-band   { animation: heroFade 0.65s ease forwards 0.75s; opacity: 0; }

        .seg-card {
          background: var(--cream);
          border: 1px solid var(--border);
          border-top: 3px solid transparent;
          padding: 26px 22px 22px;
          transition: border-top-color 0.25s, box-shadow 0.25s, transform 0.25s;
          cursor: default;
        }
        .seg-card:hover {
          border-top-color: #e0a343;
          box-shadow: 0 8px 28px rgba(184,104,29,0.09);
          transform: translateY(-2px);
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 12px;
          background: var(--black); color: var(--cream);
          padding: 15px 30px; font-size: 14px; font-weight: 500;
          letter-spacing: 0.04em; text-decoration: none;
          transition: background 0.2s; border: none; cursor: pointer;
        }
        .btn-primary:hover { background: #b8681d; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(31,26,14,0.4); text-decoration: none; font-size: 13px;
          border-bottom: 1px solid rgba(31,26,14,0.2); padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s; background: none;
          cursor: pointer; font-family: inherit;
        }
        .btn-ghost:hover { color: #b8681d; border-color: #b8681d; }

        .btn-gold {
          display: inline-flex; align-items: center; gap: 10px;
          background: #e0a343; color: #111008;
          padding: 16px 28px; font-size: 14px; font-weight: 500;
          letter-spacing: 0.04em; border: none; cursor: pointer;
          transition: background 0.2s; font-family: inherit;
          text-decoration: none;
        }
        .btn-gold:hover { background: #f2c14e; }

        .btn-underline {
          display: inline-flex; align-items: center; gap: 10px;
          color: #b8681d; text-decoration: none; font-size: 14px;
          font-weight: 500; letter-spacing: 0.04em;
          border-bottom: 1px solid rgba(184,104,29,0.35); padding-bottom: 3px;
          transition: gap 0.2s, border-color 0.2s;
        }
        .btn-underline:hover { gap: 14px; border-color: #b8681d; }

        .vertical-select {
          appearance: none; background: transparent; border: none;
          border-right: 1px solid rgba(104,76,40,0.15);
          padding: 16px 36px 16px 20px; font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #1f1a0e; cursor: pointer; outline: none;
          min-width: 240px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b8681d' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 16px center;
        }

        .nav-cta {
          background: #111008 !important; color: #fefaf2 !important;
          padding: 10px 22px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.06em;
          transition: background 0.2s !important; text-decoration: none;
          font-size: 13px;
        }
        .nav-cta:hover { background: #b8681d !important; }

        .rule { height: 1px; background: rgba(104,76,40,0.15); margin: 0 60px; }

        .section-label {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: #b8681d; margin-bottom: 20px;
        }
        .section-label::before {
          content: ''; display: block; width: 24px; height: 1.5px;
          background: #b8681d; opacity: 0.6;
        }

        @media (max-width: 768px) {
          .hero-h1 { font-size: 64px !important; }
          .problem-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .reveal-header { grid-template-columns: 1fr !important; gap: 40px !important; }
          .segments { grid-template-columns: 1fr 1fr !important; }
          .proof-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .stats-band { flex-wrap: wrap; gap: 24px; }
          .stat-cell { border-right: none !important; padding: 0 !important; }
          .report-form { flex-direction: column; }
          .vertical-select { border-right: none !important; border-bottom: 1px solid rgba(104,76,40,0.15) !important; min-width: unset; width: 100%; }
          .rule { margin: 0 24px; }
          nav { padding: 16px 24px !important; }
          .hero { padding: 140px 24px 60px !important; }
          .problem { padding: 80px 24px !important; }
          .reveal { padding: 80px 24px !important; }
          .proof-section { padding: 80px 24px !important; }
          .final-cta { padding: 80px 24px !important; }
          footer { padding: 28px 24px !important; flex-direction: column; gap: 20px; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
          .stats-band { padding: 28px 24px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 60px',
        background: 'rgba(254,250,242,0.93)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(104,76,40,0.15)',
      }}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <Image src="/sticksy_logo.png" alt="Sticksy" width={120} height={32}
            style={{ height: 32, width: 'auto', objectFit: 'contain' }} priority />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ gap: 36, alignItems: 'center' }}>
          {[['problem', 'Why'], ['reveal', 'Product'], ['proof', 'Research']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(31,26,14,0.55)', fontSize: 13,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#b8681d')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(31,26,14,0.55)')}
            >{label}</button>
          ))}
          <button onClick={() => scrollTo('report')} className="nav-cta">
            See Your Data →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {mobileOpen
              ? <path d="M4 4l14 14M18 4L4 18" stroke="#1f1a0e" strokeWidth="1.5" strokeLinecap="round"/>
              : <path d="M3 6h16M3 11h16M3 16h16" stroke="#1f1a0e" strokeWidth="1.5" strokeLinecap="round"/>}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 99,
          background: 'rgba(254,250,242,0.97)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(104,76,40,0.15)',
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {[['problem', 'Why'], ['reveal', 'Product'], ['proof', 'Research']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#1f1a0e', fontSize: 15, textAlign: 'left',
              fontFamily: "'DM Sans', sans-serif", padding: '4px 0',
            }}>{label}</button>
          ))}
          <button onClick={() => { scrollTo('report'); setMobileOpen(false) }} className="btn-primary" style={{ marginTop: 8 }}>
            See Your Data →
          </button>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero" style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '160px 60px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <p className="hero-eyebrow" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#b8681d', marginBottom: 32,
        }}>
          <span style={{ display: 'block', width: 28, height: 1.5, background: '#b8681d', opacity: 0.7 }} />
          Member Intelligence Platform
        </p>

        <h1 className="hero-h1" style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(70px, 9.5vw, 130px)',
          fontWeight: 900, lineHeight: 0.9,
          letterSpacing: '-0.03em', maxWidth: 860,
        }}>
          Member<br />
          <em style={{ fontStyle: 'italic', color: '#e0a343' }}>Intelligence.</em>
        </h1>

        <p className="hero-sub" style={{
          fontSize: 'clamp(17px, 1.8vw, 21px)', fontWeight: 300,
          color: 'rgba(31,26,14,0.65)', marginTop: 36,
          maxWidth: 440, lineHeight: 1.55,
        }}>
          Know who stays, who leaves, and what to do about it.
        </p>

        <div className="hero-actions" style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 48 }}>
          <button className="btn-primary" onClick={() => scrollTo('report')}>
            See what your data shows
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="btn-ghost" onClick={() => scrollTo('proof')}>
            Read a sample report
          </button>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="stats-band" style={{
        background: '#f0e8d6', padding: '36px 60px',
        display: 'flex',
        borderTop: '1px solid rgba(104,76,40,0.15)',
        borderBottom: '1px solid rgba(104,76,40,0.15)',
      }}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-cell" style={{
            flex: 1, padding: '0 36px',
            borderRight: i < STATS.length - 1 ? '1px solid rgba(104,76,40,0.15)' : 'none',
            paddingLeft: i === 0 ? 0 : undefined,
          }}>
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 700,
              color: '#b8681d', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.01em',
            }}>{s.number}</div>
            <div style={{
              fontSize: 11, color: 'rgba(31,26,14,0.55)',
              letterSpacing: '0.09em', textTransform: 'uppercase',
              maxWidth: 170, lineHeight: 1.45,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── PROBLEM ── */}
      <section id="problem" style={{ padding: 0 }}>
        <div className="problem" style={{ padding: '130px 60px', maxWidth: 1240, margin: '0 auto' }}>
          <div className="problem-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 80, alignItems: 'start' }}>
            <FadeIn>
              <p className="section-label">The Problem</p>
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(32px, 3.5vw, 46px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
              }}>
                You track renewals.<br />
                <em style={{ fontStyle: 'italic', color: '#b8681d' }}>Not what predicts them.</em>
              </h2>
            </FadeIn>
            <FadeIn delay={120}>
              <p style={{
                fontSize: 21, fontWeight: 400, lineHeight: 1.5, color: '#1f1a0e',
                paddingLeft: 24, borderLeft: '3px solid #e0a343', marginBottom: 20,
              }}>
                Most membership businesses track renewals. Why not track the behaviors that predict them?
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(31,26,14,0.65)' }}>
                Your members are signaling their intentions weeks before they act. The data that would tell you exactly who — and what to do about it — is already in your system.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ── REVEAL ── */}
      <section className="reveal" id="reveal" style={{
        background: '#f0e8d6', padding: '120px 60px',
        borderTop: '1px solid rgba(104,76,40,0.15)',
        borderBottom: '1px solid rgba(104,76,40,0.15)',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div className="reveal-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 64, alignItems: 'start' }}>
            <FadeIn>
              <p className="section-label">What Sticksy Sees</p>
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(32px, 3.5vw, 46px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
              }}>
                Every member follows a pattern.
              </h2>
            </FadeIn>
            <FadeIn delay={120}>
              <div style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(31,26,14,0.65)', paddingTop: 8 }}>
                <p>Some are deepening their relationship with your business. Others are quietly disconnecting. A small number are one missed interaction away from leaving.</p>
                <br />
                <p><strong style={{ color: '#1f1a0e', fontWeight: 500 }}>Sticksy reads those patterns and tells you who is who — and what to do about each one.</strong></p>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="segments" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {SEGMENTS.map((seg) => (
                <div key={seg.name} className="seg-card">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: seg.dot, marginBottom: 14 }} />
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: '#1f1a0e', marginBottom: 8, letterSpacing: '-0.01em' }}>
                    {seg.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(31,26,14,0.65)', lineHeight: 1.55, marginBottom: 16 }}>
                    {seg.desc}
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b8681d' }}>
                    {seg.stat}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="rule" />

      {/* ── PROOF ── */}
      <section id="proof" style={{ padding: 0 }}>
        <div className="proof-section proof-grid" style={{
          padding: '120px 60px', maxWidth: 1240, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start',
        }}>
          <FadeIn>
            <div style={{ background: '#111008', color: '#fefaf2', padding: '48px 44px' }}>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(254,250,242,0.78)' }}>
                Sticksy is built on customer heterogeneity research pioneered by Peter Fader at the Wharton School — the same framework used by leading organizations to predict customer behavior at scale. Now applied to membership businesses.
              </p>
              <p style={{ marginTop: 28, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e0a343' }}>
                Academic Foundation
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <p className="section-label">See It In Action</p>
            <h3 style={{
              fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700,
              lineHeight: 1.15, letterSpacing: '-0.01em', margin: '8px 0 14px',
            }}>
              A Member Intelligence Report built for your vertical.
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(31,26,14,0.65)', marginBottom: 28 }}>
              Read a sample report to see exactly what Sticksy surfaces — segment breakdown, revenue at risk, intervention playbook, and channel diagnostics.
            </p>
            <a href="/sample-report" className="btn-underline">
              Read the Sample Report
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta" id="report" style={{
        background: '#e8dec6', padding: '130px 60px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        borderTop: '1px solid rgba(104,76,40,0.15)',
      }}>
        <div className="cta-glow" />
        <FadeIn>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(38px, 5vw, 64px)',
            fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.02em',
            maxWidth: 640, margin: '0 auto 16px', color: '#1f1a0e',
            position: 'relative',
          }}>
            Your data holds<br />
            <em style={{ fontStyle: 'italic', color: '#b8681d' }}>the answers.</em>
          </h2>
          <p style={{
            fontSize: 16, color: 'rgba(31,26,14,0.6)',
            maxWidth: 380, margin: '0 auto 40px', lineHeight: 1.6,
            position: 'relative',
          }}>
            Select your vertical. Get a preliminary report built around your business.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative' }}>
            <div className="report-form" style={{
              display: 'inline-flex', alignItems: 'center',
              background: '#fefaf2', overflow: 'hidden',
              border: '1px solid rgba(104,76,40,0.28)',
              boxShadow: '0 4px 20px rgba(184,104,29,0.08)',
            }}>
              <select
                className="vertical-select"
                value={vertical}
                onChange={e => setVertical(e.target.value)}
              >
                {VERTICALS.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
              <button className="btn-gold" onClick={handleReport}>
                See your report
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.4)', letterSpacing: '0.04em' }}>
              No signup required for the sample report
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#f0e8d6', padding: '36px 60px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(104,76,40,0.15)',
      }}>
        <a href="/" style={{
          fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700,
          color: '#1f1a0e', textDecoration: 'none', letterSpacing: '-0.01em',
        }}>sticksy</a>
        <div className="footer-links" style={{ display: 'flex', gap: 28 }}>
          {[['Sample Report', '/sample-report'], ['Dashboard', '/dashboard'], ['Contact', 'mailto:hello@sticksy.ai']].map(([label, href]) => (
            <a key={label} href={href} style={{
              color: 'rgba(31,26,14,0.4)', textDecoration: 'none',
              fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#b8681d')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(31,26,14,0.4)')}
            >{label}</a>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.4)' }}>
          © {new Date().getFullYear()} Sticksy · RSBR LLC
        </p>
      </footer>

    </div>
  )
}
