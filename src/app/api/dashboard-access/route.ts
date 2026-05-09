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
  other:     'Other',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, company, vertical } = body

    if (!email || !company || !vertical) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const verticalLabel = VERTICAL_LABELS[vertical] || vertical

    // ── Save to Supabase ──────────────────────────────────────────────────────
    const { error: dbError } = await supabase
      .from('dashboard_access')
      .insert({ email, company, vertical })

    if (dbError) {
      console.error('Supabase error:', dbError)
    }

    // ── Notify you ────────────────────────────────────────────────────────────
    await resend.emails.send({
      from:    `Sticksy <${process.env.RESEND_FROM_EMAIL}>`,
      to:      process.env.NOTIFY_EMAIL!,
      subject: `Dashboard access request — ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; padding:0; background:#fefaf2; font-family:'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width:500px; margin:0 auto; padding:40px 32px;">

            <p style="font-size:20px; font-weight:700; color:#1f1a0e; margin:0 0 24px;">
              New dashboard access request
            </p>

            <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
              ${[
                ['Email',    email],
                ['Company',  company],
                ['Vertical', verticalLabel],
              ].map(([label, value]) => `
                <tr>
                  <td style="padding:10px 0; font-size:13px; color:rgba(31,26,14,0.45);
                             border-bottom:1px solid rgba(104,76,40,0.1); width:40%;">${label}</td>
                  <td style="padding:10px 0; font-size:13px; color:#1f1a0e; font-weight:500;
                             border-bottom:1px solid rgba(104,76,40,0.1);">${value}</td>
                </tr>
              `).join('')}
            </table>

            <p style="font-size:13px; color:rgba(31,26,14,0.5); line-height:1.6;">
              They are now viewing the live dashboard.
            </p>

          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Dashboard access error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}