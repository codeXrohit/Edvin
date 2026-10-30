export const SITE_PAGES = {
  '/': {
    title: 'Edvin · Toys for real play',
    description:
      'Toys for real play. Follow the Edvin journey from the sea to the toy shelf and find a new favourite.',
  },
  '/about-us': {
    title: 'About us · Edvin',
    description: 'Meet Edvin. Toys for the builders, the dreamers and the just-one-more-players.',
  },
  '/products': {
    title: 'Products · Edvin',
    description:
      'Explore Edvin building blocks, cuddly companions, little vehicles and toys for everyday adventures.',
  },
  '/contact': {
    title: 'Contact us · Edvin',
    description: 'Say hello to Edvin about our toys, stocking your store, or your next big idea.',
  },
};
export const NOT_FOUND_META = {
  title: 'Page not found · Edvin',
  description: 'This page has wandered off. Explore Edvin toys or get in touch with our team.',
};
export function canonicalPath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === '/contact-us' ? '/contact' : path;
}
