'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const VERTICALS = [
  { value: 'club',      label: 'Private / social club' },
  { value: 'winery',    label: 'Winery / wine club' },
  { value: 'fitness',   label: 'Fitness studio / gym' },
  { value: 'coworking', label: 'Coworking space' },
  { value: 'insurance', label: 'Insurance / warranty' },
  { value: 'nonprofit', label: 'Nonprofit / alumni org' },
  { value: 'other',     label: 'Other' },
]

export default function DashboardAccess() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [company, setCompany]   = useState('')
  const [vertical, setVertical] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email))  e.email    = 'Please enter a valid email address.'
    if (!company.trim())          e.company  = 'Please enter your company name.'
    if (!vertical)                e.vertical = 'Please select your vertical.'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setSubmitting(true)

    try {
      await fetch('/api/dashboard-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, vertical }),
      })
    } catch {
      // Don't block access on API failure
    }

    router.push('/dashboard')
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#fefaf2', minHeight: '100vh', color: '#1f1a0e' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .field-input {
          width: 100%; padding: 16px 20px;
          border: 1px solid rgba(104,76,40,0.18);
          background: #fefaf2; font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: #1f1a0e; outline: none;
          transition: border-color 0.2s;
          appearance: none;
        }
        .field-input:focus { border-color: #b8681d; }
        .field-input::placeholder { color: rgba(31,26,14,0.35); }
        .field-input.error { border-color: #b55a3c; }

        .field-select {
          width: 100%; padding: 16px 40px 16px 20px;
          border: 1px solid rgba(104,76,40,0.18);
          background: #fefaf2; font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: #1f1a0e; outline: none;
          transition: border-color 0.2s; appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b8681d' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 16px center;
        }
        .field-select:focus { border-color: #b8681d; }
        .field-select.error { border-color: #b55a3c; }

        .error-msg {
          font-size: 13px; color: #b55a3c; margin-top: 6px;
        }

        .submit-btn {
          width: 100%; display: flex; align-items: center; justify-content: center;
          gap: 10px; background: #111008; color: #fefaf2;
          padding: 16px 28px; font-size: 15px; font-weight: 500;
          letter-spacing: 0.04em; border: none; cursor: pointer;
          transition: background 0.2s; font-family: 'DM Sans', sans-serif;
          margin-top: 32px;
        }
        .submit-btn:hover:not(:disabled) { background: #b8681d; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .field-label {
          font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(31,26,14,0.45); margin-bottom: 8px; display: block;
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        padding: '18px 60px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '1px solid rgba(104,76,40,0.15)',
        background: 'rgba(254,250,242,0.93)', backdropFilter: 'blur(16px)',
      }}>
        <a href="/" style={{
          fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700,
          color: '#1f1a0e', textDecoration: 'none',
        }}>sticksy</a>
        <span style={{
          fontSize: 12, color: 'rgba(31,26,14,0.35)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>Live Dashboard</span>
      </nav>

      {/* Gate */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Header */}
        <div style={{
          background: '#f0e8d6', padding: '32px 28px',
          borderLeft: '3px solid #e0a343', marginBottom: 48,
        }}>
          <p style={{
            fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#b8681d', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ display: 'block', width: 20, height: 1.5, background: '#b8681d', opacity: 0.6 }} />
            Live Dashboard Access
          </p>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            You're one step away.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(31,26,14,0.6)', lineHeight: 1.6 }}>
            The live dashboard shows real member intelligence on sample data. Tell us a little about your business first.
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Email */}
          <div>
            <label className="field-label">Work email</label>
            <input
              className={`field-input ${errors.email ? 'error' : ''}`}
              type="email"
              placeholder="you@yourbusiness.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>

          {/* Company */}
          <div>
            <label className="field-label">Company / club name</label>
            <input
              className={`field-input ${errors.company ? 'error' : ''}`}
              type="text"
              placeholder="The Grand Pavilion"
              value={company}
              onChange={e => { setCompany(e.target.value); setErrors(prev => ({ ...prev, company: '' })) }}
            />
            {errors.company && <p className="error-msg">{errors.company}</p>}
          </div>

          {/* Vertical */}
          <div>
            <label className="field-label">What kind of business are you?</label>
            <select
              className={`field-select ${errors.vertical ? 'error' : ''}`}
              value={vertical}
              onChange={e => { setVertical(e.target.value); setErrors(prev => ({ ...prev, vertical: '' })) }}
            >
              <option value="" disabled>Select your vertical</option>
              {VERTICALS.map(v => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
            {errors.vertical && <p className="error-msg">{errors.vertical}</p>}
          </div>

        </div>

        {/* Submit */}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'One moment...' : 'See the live dashboard'}
          {!submitting && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <p style={{
          fontSize: 12, color: 'rgba(31,26,14,0.3)',
          marginTop: 16, textAlign: 'center', lineHeight: 1.5,
        }}>
          No credit card. No commitment. We'll be in touch.
        </p>

      </div>

      {/* Footer */}
      <footer style={{
        padding: '32px 60px', borderTop: '1px solid rgba(104,76,40,0.15)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#f0e8d6',
      }}>
        <a href="/" style={{
          fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700,
          color: '#1f1a0e', textDecoration: 'none',
        }}>sticksy</a>
        <p style={{ fontSize: 12, color: 'rgba(31,26,14,0.4)' }}>
          © {new Date().getFullYear()} Sticksy · RSBR LLC
        </p>
      </footer>
    </div>
  )
}