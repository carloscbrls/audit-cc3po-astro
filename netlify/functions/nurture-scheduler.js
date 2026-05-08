const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const CTA_URL = "https://offers.cc3po.com/get-started/";

// Email templates (stage → subject + html generator)
const EMAIL_TEMPLATES = {
  1: {
    subject: (data) => `Your Business Health Score: ${data.health_score || "?"}/100`,
    html: (data) => buildEmail1(data),
    plain: (data) => buildEmail1Plain(data),
  },
  2: {
    subject: () => `What hiring separately costs vs. CC3PO`,
    html: (data) => buildEmail2(data),
    plain: (data) => buildEmail2Plain(data),
  },
  3: {
    subject: (data) => `The ${data.issue_count || "top"} things we'd fix on your website this week`,
    html: (data) => buildEmail3(data),
    plain: (data) => buildEmail3Plain(data),
  },
  4: {
    subject: (data) => `What happened after a business like yours joined CC3PO`,
    html: (data) => buildEmail4(data),
    plain: (data) => buildEmail4Plain(data),
  },
};

function daysSince(dateStr) {
  const created = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
}

// ── Email 1: Health Score ──
function buildEmail1(d) {
  return `<div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#e4e4e7;background:#0a0a0b;padding:40px 24px">
  <h1 style="font-size:28px;font-weight:800;margin:0 0 8px">Your Business Health Score</h1>
  <p style="font-size:42px;font-weight:800;margin:0 0 4px"><span style="background:linear-gradient(135deg,#e94560,#4cc9f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${d.health_score || "?"}/100</span></p>
  <p style="color:#a1a1aa;font-size:16px;margin:0 0 32px">for ${d.website || "your website"}</p>
  <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;margin-bottom:32px">
    <h2 style="font-size:18px;margin:0 0 16px">Issues We Found</h2>
    <div style="color:#a1a1aa;font-size:14px;line-height:1.8">${d.issues_html || "<p>Full details in your audit report</p>"}</div>
  </div>
  <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;margin-bottom:32px">
    <h2 style="font-size:18px;margin:0 0 16px">What CC3PO Would Do</h2>
    <div style="color:#a1a1aa;font-size:14px;line-height:1.8">${d.fixes_html || "<p>We'll walk you through everything on a call</p>"}</div>
  </div>
  <div style="text-align:center;margin:32px 0">
    <a href="${CTA_URL}" style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#e94560,#7209b7);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px">Book a Call →</a>
  </div>
  <p style="color:#71717a;font-size:13px;margin-top:24px">— Carlos Cabrales, CC3PO</p>
</div>`;
}

function buildEmail1Plain(d) {
  return `Your Business Health Score: ${d.health_score || "?"}/100\nfor ${d.website || "your website"}\n\nIssues We Found:\n${d.issues_plain || "Full details in your audit report"}\n\nWhat CC3PO Would Do:\n${d.fixes_plain || "We'll walk you through everything on a call"}\n\nBook a call: ${CTA_URL}\n\n— Carlos Cabrales, CC3PO`;
}

// ── Email 2: Cost Comparison ──
function buildEmail2(d) {
  return `<div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#e4e4e7;background:#0a0a0b;padding:40px 24px">
  <h1 style="font-size:28px;font-weight:800;margin:0 0 24px">Hiring separately vs. CC3PO</h1>
  <p style="color:#a1a1aa;font-size:16px;margin:0 0 32px">Most businesses piece together 5-6 people to do what we handle as one system. Here's what that actually costs.</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:32px">
    <thead><tr><th style="text-align:left;padding:12px 16px;background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.06);color:#a1a1aa">Role</th><th style="text-align:right;padding:12px 16px;background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.06);color:#a1a1aa">Avg Monthly</th></tr></thead>
    <tbody>
      <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">Web Developer</td><td style="text-align:right;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">$4,000</td></tr>
      <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">SEO Specialist</td><td style="text-align:right;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">$2,500</td></tr>
      <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">Social Media Manager</td><td style="text-align:right;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">$2,000</td></tr>
      <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">Compliance Consultant</td><td style="text-align:right;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">$3,000</td></tr>
      <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">Review Manager</td><td style="text-align:right;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">$1,500</td></tr>
      <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">IT Support</td><td style="text-align:right;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04)">$1,000</td></tr>
      <tr style="background:rgba(233,69,96,0.1)"><td style="padding:12px 16px;font-weight:700;color:#e94560">Total</td><td style="text-align:right;padding:12px 16px;font-weight:700;color:#e94560">$14,000/mo</td></tr>
    </tbody>
  </table>
  <div style="background:linear-gradient(135deg,rgba(76,201,240,0.08),rgba(67,97,238,0.08));border:1px solid rgba(76,201,240,0.2);border-radius:16px;padding:28px;text-align:center;margin-bottom:32px">
    <p style="color:#a1a1aa;font-size:14px;margin:0 0 8px">CC3PO covers all of it for</p>
    <p style="font-size:42px;font-weight:800;margin:0"><span style="background:linear-gradient(135deg,#4cc9f0,#4361ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent">$497/mo</span></p>
  </div>
  <div style="text-align:center;margin:32px 0">
    <a href="${CTA_URL}" style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#e94560,#7209b7);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px">Book a Call →</a>
  </div>
  <p style="color:#71717a;font-size:13px;margin-top:24px">— Carlos Cabrales, CC3PO</p>
</div>`;
}

function buildEmail2Plain() {
  return `Hiring separately vs. CC3PO\n\nWeb Developer: $4,000/mo\nSEO Specialist: $2,500/mo\nSocial Media Manager: $2,000/mo\nCompliance Consultant: $3,000/mo\nReview Manager: $1,500/mo\nIT Support: $1,000/mo\nTotal: $14,000/mo\n\nCC3PO covers all of it for $497/mo\n\nBook a call: ${CTA_URL}\n\n— Carlos Cabrales, CC3PO`;
}

// ── Email 3: Specific Fixes ──
function buildEmail3(d) {
  return `<div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#e4e4e7;background:#0a0a0b;padding:40px 24px">
  <h1 style="font-size:28px;font-weight:800;margin:0 0 24px">The ${d.issue_count || "top"} things we'd fix this week</h1>
  <p style="color:#a1a1aa;font-size:16px;margin:0 0 32px">Based on what we found scanning ${d.website || "your website"}, here's exactly what we'd tackle first.</p>
  <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;margin-bottom:32px">
    ${d.specific_fixes_html || "<p style='color:#a1a1aa;font-size:14px'>Your full fix list is ready — let's walk through it on a call.</p>"}
  </div>
  <p style="color:#a1a1aa;font-size:15px;margin:0 0 32px">These aren't hypothetical — they're the same fixes we apply for every client in week one. Your site could be in better shape by Friday.</p>
  <div style="text-align:center;margin:32px 0">
    <a href="${CTA_URL}" style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#e94560,#7209b7);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px">Book a Call →</a>
  </div>
  <p style="color:#71717a;font-size:13px;margin-top:24px">— Carlos Cabrales, CC3PO</p>
</div>`;
}

function buildEmail3Plain(d) {
  return `The ${d.issue_count || "top"} things we'd fix on your website this week\n\nBased on scanning ${d.website || "your website"}:\n\n${d.specific_fixes_plain || "Your full fix list is ready — let's walk through it on a call."}\n\nBook a call: ${CTA_URL}\n\n— Carlos Cabrales, CC3PO`;
}

// ── Email 4: Social Proof / Case Study ──
function buildEmail4(d) {
  return `<div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#e4e4e7;background:#0a0a0b;padding:40px 24px">
  <h1 style="font-size:28px;font-weight:800;margin:0 0 24px">What happened after they joined CC3PO</h1>
  <p style="color:#a1a1aa;font-size:16px;margin:0 0 32px">A business like yours came to us with the same issues we found on ${d.website || "your website"}. Here's what changed.</p>
  <div style="background:linear-gradient(135deg,rgba(76,201,240,0.06),rgba(67,97,238,0.06));border:1px solid rgba(76,201,240,0.15);border-radius:16px;padding:28px;margin-bottom:24px">
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 16px">Before CC3PO</p>
    <p style="font-size:36px;font-weight:800;margin:0 0 4px;color:#e94560">42/100</p>
    <p style="font-size:13px;color:#71717a;margin:0">Issues piling up, no system, reacting to everything</p>
  </div>
  <div style="text-align:center;font-size:24px;margin-bottom:24px">↓</div>
  <div style="background:linear-gradient(135deg,rgba(76,201,240,0.08),rgba(67,97,238,0.08));border:1px solid rgba(76,201,240,0.2);border-radius:16px;padding:28px;margin-bottom:24px">
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 16px">After CC3PO (30 days)</p>
    <p style="font-size:36px;font-weight:800;margin:0 0 4px"><span style="background:linear-gradient(135deg,#4cc9f0,#4361ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent">91/100</span></p>
    <p style="font-size:13px;color:#71717a;margin:0">Issues resolved, systems running, proactively managed</p>
  </div>
  <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;margin-bottom:32px">
    <h3 style="font-size:16px;margin:0 0 16px">The results</h3>
    <ul style="list-style:none;padding:0;margin:0;color:#a1a1aa;font-size:14px;line-height:2">
      <li>✅ Website issues fixed within the first week</li>
      <li>✅ Reviews responded to within 30 minutes</li>
      <li>✅ Social posts publishing daily</li>
      <li>✅ Compliance audit passed with zero flags</li>
      <li>✅ Competitor moves detected and countered</li>
    </ul>
  </div>
  <p style="color:#a1a1aa;font-size:15px;margin:0 0 24px">I'd love to do the same for ${d.website || "your website"}. If the timing's not right, no worries — just reply and let me know. I won't keep emailing if you're not interested.</p>
  <div style="text-align:center;margin:32px 0">
    <a href="${CTA_URL}" style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#e94560,#7209b7);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px">Book a Call →</a>
  </div>
  <p style="color:#71717a;font-size:13px;margin-top:24px">Or just reply to this email — I read every one.<br>— Carlos Cabrales, CC3PO</p>
</div>`;
}

function buildEmail4Plain(d) {
  return `What happened after they joined CC3PO\n\nBefore: 42/100 — Issues piling up, no system\nAfter: 91/100 — Issues resolved, systems running\n\nResults:\n- Website issues fixed within the first week\n- Reviews responded to within 30 minutes\n- Social posts publishing daily\n- Compliance audit passed with zero flags\n- Competitor moves detected and countered\n\nI'd love to do the same for ${d.website || "your website"}. If the timing's not right, just reply and let me know.\n\nBook a call: ${CTA_URL}\nOr reply to this email — I read every one.\n\n— Carlos Cabrales, CC3PO`;
}

// ── Send email via Resend ──
async function sendEmail({ to, subject, html, plain }) {
  const body = {
    from: "Carlos Cabrales <audit@cc3po.com>",
    to,
    subject,
    html,
    reply_to: "info@cc3po.com",
  };
  if (plain) body.text = plain;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend error: ${err}`);
  }

  return response.json();
}

// ── Main handler ──
exports.handler = async function (event) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars" }) };
  }
  if (!RESEND_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing RESEND_API_KEY env var" }) };
  }

  try {
    // Query leads that need nurturing
    const leadsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/client_forms?select=*&or=(status.eq.new,status.eq.nurturing)&order=created_at.asc`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!leadsRes.ok) {
      throw new Error(`Supabase query failed: ${await leadsRes.text()}`);
    }

    const leads = await leadsRes.json();
    const results = { sent: [], skipped: [], errors: [] };

    for (const lead of leads) {
      try {
        const days = daysSince(lead.created_at);
        const currentStage = lead.email_stage || 0;
        let targetStage = currentStage;

        // Determine which email to send based on time elapsed
        if (days >= 14 && currentStage < 4) targetStage = 4;
        else if (days >= 7 && currentStage < 3) targetStage = 3;
        else if (days >= 3 && currentStage < 2) targetStage = 2;
        else if (days >= 0 && currentStage < 1) targetStage = 1;

        // Skip if already at or past this stage
        if (targetStage <= currentStage) {
          results.skipped.push({ id: lead.id, reason: `already at stage ${currentStage}` });
          continue;
        }

        const template = EMAIL_TEMPLATES[targetStage];
        if (!template) {
          results.skipped.push({ id: lead.id, reason: `no template for stage ${targetStage}` });
          continue;
        }

        // Build template data from lead record
        const templateData = {
          website: lead.website || lead.url || "your website",
          health_score: lead.health_score || null,
          issue_count: lead.issue_count || null,
          issues_html: lead.issues_html || null,
          issues_plain: lead.issues_plain || null,
          fixes_html: lead.fixes_html || null,
          fixes_plain: lead.fixes_plain || null,
          specific_fixes_html: lead.specific_fixes_html || null,
          specific_fixes_plain: lead.specific_fixes_plain || null,
        };

        const subject = template.subject(templateData);
        const html = template.html(templateData);
        const plain = template.plain(templateData);

        await sendEmail({ to: lead.email, subject, html, plain });

        // Update lead stage in Supabase
        const updateData = { email_stage: targetStage };
        if (targetStage === 4) {
          updateData.status = "nurtured";
        } else if (targetStage > 0) {
          updateData.status = "nurturing";
        }

        const updateRes = await fetch(
          `${SUPABASE_URL}/rest/v1/client_forms?id=eq.${lead.id}`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_SERVICE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify(updateData),
          }
        );

        if (!updateRes.ok) {
          console.error(`Failed to update lead ${lead.id}: ${await updateRes.text()}`);
        }

        results.sent.push({ id: lead.id, email: lead.email, stage: targetStage });
        console.log(`✉️ Sent email stage ${targetStage} to ${lead.email} (lead ${lead.id}, ${days} days old)`);
      } catch (err) {
        results.errors.push({ id: lead.id, error: String(err) });
        console.error(`❌ Error processing lead ${lead.id}:`, err);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        processed: leads.length,
        sent: results.sent.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
        details: results,
      }),
    };
  } catch (err) {
    console.error("Nurture scheduler error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};