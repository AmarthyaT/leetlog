import type { Card } from '@/types'

interface DigestData {
  userName: string
  userEmail: string
  dueCount: number
  streak: number
  weakPattern: string
  topDue: Card[]
}

export async function sendWeeklyDigest(data: DigestData) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY!)

  const topProblems = data.topDue.slice(0, 3).map((c, i) => {
    const dot = c.difficulty === 'Hard' ? '🔴' : c.difficulty === 'Medium' ? '🟡' : '🟢'
    return `<tr>
      <td style="padding:8px 0;color:#fafafa;font-family:Inter,sans-serif">${i + 1}. ${dot} ${c.problem_title}</td>
      <td style="padding:8px 0;color:#71717a;font-family:monospace;text-align:right">${c.pattern_tags[0] ?? ''}</td>
    </tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>LeetLog Weekly Digest</title></head>
<body style="background:#0a0a0a;margin:0;padding:40px 0">
<div style="max-width:540px;margin:0 auto;background:#111111;border:1px solid #2a2a2a;border-radius:16px;overflow:hidden">
  <div style="background:#6366f1;padding:32px;text-align:center">
    <h1 style="color:#fff;font-family:Inter,sans-serif;font-size:24px;margin:0;font-weight:700">🧠 LeetLog</h1>
    <p style="color:#c7d2fe;font-family:Inter,sans-serif;margin:8px 0 0;font-size:14px">Your Weekly Digest</p>
  </div>
  <div style="padding:32px">
    <p style="color:#fafafa;font-family:Inter,sans-serif;font-size:16px;margin:0 0 24px">Hi ${data.userName},</p>
    <div style="display:flex;gap:16px;margin-bottom:24px">
      <div style="flex:1;background:#1a1a1a;border-radius:12px;padding:16px;text-align:center;border:1px solid #2a2a2a">
        <div style="color:#6366f1;font-size:28px;font-weight:700;font-family:Inter,sans-serif">${data.dueCount}</div>
        <div style="color:#71717a;font-size:12px;font-family:Inter,sans-serif;margin-top:4px">Due this week</div>
      </div>
      <div style="flex:1;background:#1a1a1a;border-radius:12px;padding:16px;text-align:center;border:1px solid #2a2a2a">
        <div style="color:#f59e0b;font-size:28px;font-weight:700;font-family:Inter,sans-serif">🔥 ${data.streak}</div>
        <div style="color:#71717a;font-size:12px;font-family:Inter,sans-serif;margin-top:4px">Day streak</div>
      </div>
    </div>
    ${data.weakPattern ? `<div style="background:#2d1b4e;border:1px solid #4c1d95;border-radius:12px;padding:16px;margin-bottom:24px">
      <p style="color:#a78bfa;font-size:12px;font-weight:600;font-family:Inter,sans-serif;margin:0 0 4px;letter-spacing:0.05em">WEAKEST PATTERN</p>
      <p style="color:#fafafa;font-size:16px;font-weight:600;font-family:Inter,sans-serif;margin:0">⚠️ ${data.weakPattern}</p>
    </div>` : ''}
    ${topProblems ? `<p style="color:#71717a;font-size:12px;font-weight:600;letter-spacing:0.05em;font-family:Inter,sans-serif;margin:0 0 8px">TOP PROBLEMS TO REVIEW</p>
    <table style="width:100%;border-collapse:collapse">${topProblems}</table>` : ''}
    <div style="margin-top:32px;text-align:center">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/recall" style="background:#6366f1;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-family:Inter,sans-serif;font-weight:600;font-size:15px;display:inline-block">Start This Week's Review →</a>
    </div>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #2a2a2a;text-align:center">
    <p style="color:#71717a;font-size:12px;font-family:Inter,sans-serif;margin:0">LeetLog · <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#6366f1">Manage notifications</a></p>
  </div>
</div>
</body>
</html>`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: data.userEmail,
    subject: `Your LeetLog Digest — ${data.dueCount} problems due 📚`,
    html,
  })
}
