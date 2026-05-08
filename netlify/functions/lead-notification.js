const RESEND_API_KEY = process.env.RESEND_API_KEY;

function getEmailHtml(data) {
  const { name, email, phone, company, website, service_interest, message, source, lead_type } = data;
  return `
    <h2>New Lead Submission</h2>
    <table style="border-collapse:collapse;font-family:sans-serif">
      <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Source</strong></td><td style="padding:6px 12px">${source || 'N/A'}</td></tr>
      <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Type</strong></td><td style="padding:6px 12px">${lead_type || 'N/A'}</td></tr>
      <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Name</strong></td><td style="padding:6px 12px">${name || 'N/A'}</td></tr>
      <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Email</strong></td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Phone</strong></td><td style="padding:6px 12px">${phone}</td></tr>` : ''}
      ${company ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Company</strong></td><td style="padding:6px 12px">${company}</td></tr>` : ''}
      ${website ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Website</strong></td><td style="padding:6px 12px">${website}</td></tr>` : ''}
      ${service_interest ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Service Interest</strong></td><td style="padding:6px 12px">${service_interest}</td></tr>` : ''}
      ${message ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Message</strong></td><td style="padding:6px 12px">${message.replace(/\n/g, '<br>')}</td></tr>` : ''}
    </table>
    <p style="font-size:12px;color:#999;margin-top:20px">Submitted at ${new Date().toISOString()}</p>
  `;
}

function getAuditEmailHtml(data) {
  const { name, email, website, url, tier, focus, message, source } = data;
  const displayUrl = website || url || 'N/A';
  return `
    <h2 style="color:#e94560">🔍 New Audit Request</h2>
    <table style="border-collapse:collapse;font-family:sans-serif">
      <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Source</strong></td><td style="padding:6px 12px">${source || 'audit.cc3po.com'}</td></tr>
      <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Tier</strong></td><td style="padding:6px 12px">${tier || 'free'}</td></tr>
      <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Name</strong></td><td style="padding:6px 12px">${name || 'Not provided'}</td></tr>
      <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Email</strong></td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Website</strong></td><td style="padding:6px 12px"><a href="${displayUrl}">${displayUrl}</a></td></tr>
      ${focus ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Focus</strong></td><td style="padding:6px 12px">${focus}</td></tr>` : ''}
      ${message ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Message</strong></td><td style="padding:6px 12px">${message.replace(/\n/g, '<br>')}</td></tr>` : ''}
    </table>
    <hr style="margin:16px 0;border-color:#eee">
    <p style="font-size:14px"><strong>Action needed:</strong> Run audit for <code>${displayUrl}</code> and deliver report to <code>${email}</code></p>
    <p style="font-size:12px;color:#999;margin-top:20px">Submitted at ${new Date().toISOString()}</p>
  `;
}

async function sendEmail({ to, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'CC3PO Audit <onboarding@resend.dev>',
      to: to,
      subject,
      html
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend error: ${err}`);
  }
  return response;
}

exports.handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { table, source, lead_type, name, email } = data;

  if (!email) {
    return { statusCode: 400, body: 'Email is required' };
  }

  // Determine recipients
  const importantTypes = ['audit', 'consultation'];
  const isImportant = importantTypes.includes(lead_type) || table === 'audit_requests';

  const to = ['info@cc3po.com', 'alerts@cc3po.com'];
  if (isImportant) {
    to.push('910gokat@zohomail.com');
  }

  // Build email
  let subject, html;
  if (table === 'audit_requests') {
    subject = `🔍 New Audit Request: ${data.website || data.url || name || email}`;
    html = getAuditEmailHtml(data);
  } else {
    subject = `✨ New Lead: ${name || email} (${source || 'unknown'})`;
    html = getEmailHtml(data);
  }

  try {
    await sendEmail({ to, subject, html });
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('Email send failed:', err);
    // Still return success to the user — we don't want to block them
    // The form data was captured, we'll retry or handle manually
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, note: 'Email delivery deferred' })
    };
  }
};