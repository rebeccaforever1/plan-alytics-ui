import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

const VERTICAL_LABELS: Record<string, string> = {
  club:      'Private / Social Club',
  winery:    'Winery / Wine Club',
  fitness:   'Fitness Studio / Gym',
  coworking: 'Coworking Space',
  insurance: 'Insurance / Warranty',
  nonprofit: 'Nonprofit / Alumni Org',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      vertical,
      membersLabel,
      spendLabel,
      lostLabel,
      members,
      spend,
      lost,
    } = body

    // ── Validate ──────────────────────────────────────────────────────────────
    if (!email || !vertical || !members || !spend || !lost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── Build report URL ──────────────────────────────────────────────────────
    const params = new URLSearchParams({
      vertical,
      members:      members.toString(),
      membersLabel: membersLabel || '',
      spend:        spend.toString(),
      spendLabel:   spendLabel || '',
      lost:         lost.toString(),
      lostLabel:    lostLabel || '',
      email,
    })

    const reportUrl = `https://www.sticksy.ai/report/results?${params.toString()}`
    const verticalLabel = VERTICAL_LABELS[vertical] || vertical

    // ── Save to Supabase ──────────────────────────────────────────────────────
    const { error: dbError } = await supabase
      .from('report_requests')
      .insert({
        email,
        vertical,
        members_label: membersLabel,
        spend_label:   spendLabel,
        lost_label:    lostLabel,
        members_mid:   parseInt(members),
        spend_mid:     parseInt(spend),
        lost_mid:      parseInt(lost),
      })

    if (dbError) {
      console.error('Supabase error:', dbError)
      // Don't block the user — continue even if DB write fails
    }

    // ── Email to user ─────────────────────────────────────────────────────────
    await resend.emails.send({
      from: `Sticksy <${process.env.RESEND_FROM_EMAIL}>`,
      to:   email,
      subject: `Your Sticksy Member Intelligence Report`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0; background:#fefaf2; font-family:'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width:600px; margin:0 auto; padding:48px 32px;">

            <p style="font-size:24px; font-weight:700; color:#1f1a0e; margin:0 0 32px; letter-spacing:-0.02em;">
              sticksy
            </p>

            <div style="background:#f0e8d6; padding:32px; margin-bottom:32px; border-left:3px solid #e0a343;">
              <p style="font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#b8681d; margin:0 0 12px;">
                Member Intelligence Report
              </p>
              <p style="font-size:28px; font-weight:700; color:#1f1a0e; margin:0; line-height:1.1;">
                Your preliminary report is ready.
              </p>
            </div>

            <p style="font-size:16px; color:rgba(31,26,14,0.7); line-height:1.65; margin:0 0 16px;">
              Based on your ${verticalLabel} inputs, we've calculated your MRR at risk, estimated segment distribution, and the highest-impact intervention for your business.
            </p>

            <p style="font-size:16px; color:rgba(31,26,14,0.7); line-height:1.65; margin:0 0 32px;">
              Your report includes what your data likely shows — and what to do about it.
            </p>

            <a href="${reportUrl}"
               style="display:inline-block; background:#e0a343; color:#111008; padding:16px 32px;
                      font-size:15px; font-weight:500; text-decoration:none; letter-spacing:0.04em;">
              View your report →
            </a>

            <p style="font-size:13px; color:rgba(31,26,14,0.4); margin:32px 0 0; line-height:1.6;">
              Ready to see this on your actual data? Reply to this email or visit
              <a href="https://www.sticksy.ai/dashboard" style="color:#b8681d;">sticksy.ai/dashboard</a>
              to see the live product.
            </p>

            <hr style="border:none; border-top:1px solid rgba(104,76,40,0.15); margin:32px 0;">

            <p style="font-size:12px; color:rgba(31,26,14,0.3); margin:0;">
              Sticksy · Member Intelligence · sticksy.ai<br>
              © ${new Date().getFullYear()} RSBR LLC
            </p>

          </div>
        </body>
        </html>
      `,
    })

    // ── Notification to you ───────────────────────────────────────────────────
    await resend.emails.send({
      from:    `Sticksy <${process.env.RESEND_FROM_EMAIL}>`,
      to:      process.env.NOTIFY_EMAIL!,
      subject: `New report request — ${verticalLabel}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; padding:0; background:#fefaf2; font-family:'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width:500px; margin:0 auto; padding:40px 32px;">

            <p style="font-size:20px; font-weight:700; color:#1f1a0e; margin:0 0 24px;">
              New report request
            </p>

            <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
              ${[
                ['Email',           email],
                ['Vertical',        verticalLabel],
                ['Members',         membersLabel],
                ['Avg monthly spend', spendLabel],
                ['Lost last month', lostLabel],
              ].map(([label, value]) => `
                <tr>
                  <td style="padding:10px 0; font-size:13px; color:rgba(31,26,14,0.45);
                             border-bottom:1px solid rgba(104,76,40,0.1); width:40%;">${label}</td>
                  <td style="padding:10px 0; font-size:13px; color:#1f1a0e; font-weight:500;
                             border-bottom:1px solid rgba(104,76,40,0.1);">${value}</td>
                </tr>
              `).join('')}
            </table>

            <a href="${reportUrl}"
               style="display:inline-block; background:#111008; color:#fefaf2; padding:12px 24px;
                      font-size:13px; font-weight:500; text-decoration:none; letter-spacing:0.04em;">
              View their report →
            </a>

          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true, reportUrl })

  } catch (err) {
    console.error('API route error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
