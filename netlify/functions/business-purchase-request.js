const MAX_FIELD_LENGTH = 1200;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const requestLog = new Map();

const requiredFields = [
  'first_name',
  'last_name',
  'work_email',
  'company_legal_name',
  'billing_address',
  'city',
  'region',
  'postal_code',
  'country',
  'seat_count',
  'license_term',
  'intended_use'
];

const fieldLabels = {
  first_name: 'Requester first name',
  last_name: 'Requester last name',
  work_email: 'Work email address',
  phone: 'Phone number',
  company_legal_name: 'Company legal name',
  billing_address: 'Billing address',
  city: 'City',
  region: 'State, province, or region',
  postal_code: 'Postal code',
  country: 'Country',
  seat_count: 'Number of licenses or seats requested',
  license_term: 'Requested license term',
  intended_use: 'Intended use or purchasing notes',
  requested_start_date: 'Requested license start date',
  requested_payment_terms: 'Requested payment terms',
  accounts_payable_name: 'Accounts payable contact name',
  accounts_payable_email: 'Accounts payable email',
  purchase_order_number: 'Purchase order number',
  tax_exempt_status: 'Tax-exempt status',
  vendor_onboarding_requirements: 'Vendor onboarding requirements',
  additional_comments: 'Additional comments'
};

const licenseTerms = new Set([
  'Individual annual license',
  'Team annual seats (5-25)',
  'Site license / annual volume licensing'
]);

const paymentTerms = new Set([
  '',
  'Payment upon receipt',
  'Net 15',
  'Net 30',
  'Other'
]);

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  },
  body: JSON.stringify(body)
});

const normalize = (value) => String(value || '').trim();

const escapeHtml = (value) => normalize(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const parseBody = (event) => {
  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';

  if (contentType.includes('application/json')) {
    return JSON.parse(rawBody || '{}');
  }

  const params = new URLSearchParams(rawBody);
  return Object.fromEntries(params.entries());
};

const getClientKey = (event) => {
  const forwardedFor = event.headers['x-forwarded-for'] || event.headers['X-Forwarded-For'] || '';
  return forwardedFor.split(',')[0].trim() || event.headers['client-ip'] || 'unknown';
};

const isRateLimited = (clientKey) => {
  const now = Date.now();
  const recent = (requestLog.get(clientKey) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLog.set(clientKey, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
};

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateSubmission = (data) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!normalize(data[field])) errors[field] = `${fieldLabels[field]} is required.`;
  });

  Object.entries(data).forEach(([field, value]) => {
    if (normalize(value).length > MAX_FIELD_LENGTH) {
      errors[field] = `${fieldLabels[field] || field} is too long.`;
    }
  });

  if (data.work_email && !validateEmail(normalize(data.work_email))) {
    errors.work_email = 'Enter a valid work email address.';
  }

  if (data.accounts_payable_email && !validateEmail(normalize(data.accounts_payable_email))) {
    errors.accounts_payable_email = 'Enter a valid accounts payable email address.';
  }

  const seatCount = Number(normalize(data.seat_count));
  if (!Number.isInteger(seatCount) || seatCount < 1 || seatCount > 999) {
    errors.seat_count = 'Number of licenses or seats requested must be a whole number between 1 and 999.';
  }

  if (data.license_term && !licenseTerms.has(normalize(data.license_term))) {
    errors.license_term = 'Select a valid requested license term.';
  }

  if (!paymentTerms.has(normalize(data.requested_payment_terms))) {
    errors.requested_payment_terms = 'Select a valid requested payment term.';
  }

  if (data.requested_start_date && Number.isNaN(Date.parse(data.requested_start_date))) {
    errors.requested_start_date = 'Enter a valid requested license start date.';
  }

  return errors;
};

const formatTextEmail = (data) => Object.entries(fieldLabels)
  .map(([field, label]) => `${label}: ${normalize(data[field]) || 'Not provided'}`)
  .join('\n');

const formatHtmlEmail = (data) => `
  <h1>RungTrace business purchase request</h1>
  <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
    ${Object.entries(fieldLabels).map(([field, label]) => `
      <tr>
        <th align="left" style="border:1px solid #ddd;background:#f5f5f5;">${escapeHtml(label)}</th>
        <td style="border:1px solid #ddd;white-space:pre-wrap;">${escapeHtml(data[field]) || 'Not provided'}</td>
      </tr>
    `).join('')}
  </table>
`;

const sendEmail = async ({ apiKey, fromEmail, to, replyTo, subject, text, html }) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      reply_to: replyTo,
      subject,
      text,
      html
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend returned ${response.status}: ${errorText}`);
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { message: 'Method not allowed.' });
  }

  const clientKey = getClientKey(event);
  if (isRateLimited(clientKey)) {
    return jsonResponse(429, { message: 'Too many requests. Please try again later.' });
  }

  let data;
  try {
    data = parseBody(event);
  } catch {
    return jsonResponse(400, { message: 'Invalid request body.' });
  }

  if (normalize(data['bot-field'])) {
    return jsonResponse(200, { ok: true });
  }

  const errors = validateSubmission(data);
  if (Object.keys(errors).length) {
    return jsonResponse(422, {
      message: 'Please review the highlighted fields and submit again.',
      errors
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BUSINESS_REQUEST_FROM_EMAIL || process.env.FROM_EMAIL;
  const businessEmail = process.env.BUSINESS_REQUEST_EMAIL || process.env.SALES_EMAIL || process.env.SUPPORT_EMAIL;
  const confirmationFromEmail = process.env.BUSINESS_CONFIRMATION_FROM_EMAIL || fromEmail;

  if (!apiKey || !fromEmail || !businessEmail) {
    console.error('Missing business purchase email configuration.');
    return jsonResponse(500, { message: 'Business request email is not configured.' });
  }

  const requesterName = `${normalize(data.first_name)} ${normalize(data.last_name)}`.trim();
  const subject = `RungTrace business purchase request - ${normalize(data.company_legal_name)}`;
  const text = formatTextEmail(data);
  const html = formatHtmlEmail(data);

  try {
    await sendEmail({
      apiKey,
      fromEmail,
      to: [businessEmail],
      replyTo: normalize(data.work_email),
      subject,
      text,
      html
    });

    if (process.env.SEND_BUSINESS_REQUEST_CONFIRMATION !== 'false') {
      try {
        await sendEmail({
          apiKey,
          fromEmail: confirmationFromEmail,
          to: [normalize(data.work_email)],
          replyTo: businessEmail,
          subject: 'RungTrace business purchase request received',
          text: `Thank you, ${requesterName || 'there'}.\n\nYour business purchase request has been received. We will review the information and contact you with a quote, invoice, or any additional vendor documentation requirements.\n\nRungTrace`,
          html: `<p>Thank you, ${escapeHtml(requesterName) || 'there'}.</p><p>Your business purchase request has been received. We will review the information and contact you with a quote, invoice, or any additional vendor documentation requirements.</p><p>RungTrace</p>`
        });
      } catch (confirmationError) {
        console.error('Business request received, but confirmation email failed:', confirmationError);
      }
    }
  } catch (error) {
    console.error('Unable to send business purchase request email:', error);
    return jsonResponse(502, { message: 'We could not send the request. Please try again or contact us directly.' });
  }

  return jsonResponse(200, { ok: true });
};
