const TOPICS = new Set(['Retail partnership', 'Product question', 'General enquiry']);

export function validateEnquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const enquiry = {};
  for (const key of ['name', 'email', 'company', 'city', 'topic', 'message']) {
    const value = body[key] ?? '';
    if (typeof value !== 'string') return null;
    enquiry[key] = value.trim();
  }
  if (!enquiry.name || enquiry.name.length > 120 || /[\r\n]/.test(enquiry.name)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email) || enquiry.email.length > 254) return null;
  if (enquiry.company.length > 120 || enquiry.city.length > 120) return null;
  if (!TOPICS.has(enquiry.topic) || enquiry.message.length < 10 || enquiry.message.length > 5000) return null;
  return enquiry;
}
