import path from 'node:path';
import { json } from '../utils/http.mjs';
import { validateEnquiry } from '../validation/contact.mjs';
import { enquiryEmail } from '../services/mail.mjs';
import { saveEnquiry, updateNotification } from '../services/enquiries.mjs';
import { createClientIpResolver } from '../utils/client-ip.mjs';

export function createContactHandler({
  dataDir,
  mailer = null,
  mailFrom,
  mailTo = 'info@edvin.com',
  publicOrigin,
  logger = console,
  limit = 5,
  trustedProxies = '',
} = {}) {
  const attempts = new Map();
  const clientIp = createClientIpResolver(trustedProxies);
  const directory = path.resolve(dataDir ?? '.data/enquiries');
  return async function contact(request, response) {
    if (request.method !== 'POST')
      return json(
        response,
        405,
        { success: false, error: 'Use POST to submit an enquiry.' },
        { Allow: 'POST' },
      );
    if (request.headers.origin) {
      try {
        const origin = new URL(request.headers.origin);
        if (origin.host !== request.headers.host && origin.origin !== publicOrigin)
          return json(response, 403, { success: false, error: 'Origin not allowed.' });
      } catch {
        return json(response, 403, { success: false, error: 'Invalid origin.' });
      }
    }
    if (!request.headers['content-type']?.startsWith('application/json'))
      return json(response, 415, { success: false, error: 'Use application/json.' });
    const now = Date.now();
    for (const [key, attempt] of attempts) if (now - attempt.since >= 900000) attempts.delete(key);
    const ip = clientIp(request);
    const attempt = attempts.get(ip) ?? { since: now, count: 0 };
    if (attempt.count >= limit || (attempts.size >= 10000 && !attempts.has(ip)))
      return json(
        response,
        429,
        { success: false, error: 'Please wait before sending another enquiry.' },
        { 'Retry-After': '900' },
      );
    attempt.count += 1;
    attempts.set(ip, attempt);
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of request) {
        size += chunk.length;
        if (size > 32768) {
          json(response, 413, { success: false, error: 'Message too large.' });
          return;
        }
        chunks.push(chunk);
      }
      let body;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        return json(response, 400, { success: false, error: 'Invalid JSON.' });
      }
      const enquiry = validateEnquiry(body);
      if (!enquiry)
        return json(response, 400, {
          success: false,
          error: 'Please check your name, email, topic and message.',
        });
      const { record, filename } = await saveEnquiry(directory, enquiry, Boolean(mailer));
      if (mailer) {
        try {
          const delivery = await mailer.sendMail(enquiryEmail(record, { from: mailFrom, to: mailTo }));
          record.notification = delivery?.rejected?.length ? 'failed' : 'sent';
        } catch {
          record.notification = 'failed';
          logger.error(`Enquiry ${record.id} saved; SMTP delivery failed.`);
        }
        try {
          await updateNotification(filename, record);
        } catch {
          logger.error(`Enquiry ${record.id} saved; notification status update failed.`);
        }
      }
      return json(response, 201, { success: true, reference: record.id });
    } catch {
      logger.error('Contact request could not be saved.');
      return json(response, 503, {
        success: false,
        error: 'We couldn’t save your enquiry. Please try again.',
      });
    }
  };
}
