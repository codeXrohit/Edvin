export const CONTACT = {
  email: (import.meta.env.VITE_CONTACT_EMAIL || 'info@edvin.com').trim(),
  phone: (import.meta.env.VITE_CONTACT_PHONE || '74120 21880').trim(),
  address: (import.meta.env.VITE_CONTACT_ADDRESS ?? '').trim(),
};
export const CONTACT_TOPICS = [
  {
    id: 'retail',
    title: 'Stock a little more joy.',
    label: 'Retail partnership',
    description: 'Bring Edvin to your store. Let’s talk ranges, orders and working together.',
  },
  {
    id: 'toys',
    title: 'A question about a toy?',
    label: 'Product question',
    description: 'Tell us which toy you have in mind. We’ll help with the little details.',
  },
  {
    id: 'hello',
    title: 'Something else in mind?',
    label: 'General enquiry',
    description: 'An idea, a collaboration or just a hello. There’s room for that, too.',
  },
];
