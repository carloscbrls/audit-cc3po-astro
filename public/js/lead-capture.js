// Lead Capture Module — submits to Supabase cc3po-ops / client_forms
// All forms across all CC3PO sites write to one unified table
// Usage: import { submitLeadCapture, submitAuditRequest } from './lead-capture.js';

const SUPABASE_URL = 'https://cdrcgmdvepxwsbqaifxv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcmNnbWR2ZXB4d3NicWFpZnh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUwNjgwOSwiZXhwIjoyMDg5MDgyODA5fQ.IXD7n4w6GadXsoqxL9SpI3Bc-CZWLF6ykUkpgas15FQ';

/**
 * Submit to client_forms table on cc3po-ops
 * All CC3PO site forms write here — single source of truth
 * @param {Object} data
 * @param {string} data.source_site - which site (e.g. 'audit.cc3po.com')
 * @param {string} data.source_page - which page (e.g. '/hero-form')
 * @param {string} data.form_type - 'contact', 'audit_request', 'scanner', 'lead', 'custom'
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.website - optional
 * @param {string} data.phone - optional
 * @param {string} data.company - optional
 * @param {string} data.service_interest - optional
 * @param {string} data.message - optional
 * @param {Object} data.metadata - optional extra data
 */
export async function submitToClientForms(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/client_forms`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });

  if (!res.ok && res.status !== 201) {
    const err = await res.text().catch(() => 'Supabase error');
    throw new Error(err);
  }

  // Trigger email notification (fire-and-forget)
  try {
    fetch('/.netlify/functions/lead-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {});
  } catch (_) {}

  return { success: true };
}

/**
 * Convenience: Lead capture (contact form, general inquiries)
 */
export function submitLeadCapture(payload, source, leadType = 'contact') {
  return submitToClientForms({
    source_site: source.split('-')[0] + '.cc3po.com',
    source_page: '/',
    form_type: 'contact',
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    company: payload.company || null,
    service_interest: payload.service_interest || null,
    message: payload.message || null,
    metadata: { original_source: source, lead_type: leadType }
  });
}

/**
 * Convenience: Audit request
 */
export function submitAuditRequest(payload, source) {
  return submitToClientForms({
    source_site: 'audit.cc3po.com',
    source_page: source.includes('hero') ? '/hero-form' : '/full-form',
    form_type: 'audit_request',
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    company: payload.website || null,
    message: payload.focus || payload.message || null,
    metadata: { website: payload.website, focus: payload.focus, original_source: source }
  });
}