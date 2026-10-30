import socialImage from '@/assets/images/journey-share.jpg';
import { SITE_PAGES, NOT_FOUND_META, canonicalPath } from '@/data/site';

export function updateMetadata(pathname) {
  const path = canonicalPath(pathname);
  const meta = SITE_PAGES[path] ?? NOT_FOUND_META;
  const current = document.querySelector('link[rel="canonical"]');
  const origin = current ? new URL(current.href).origin : window.location.origin;
  const url = origin + path;
  document.title = meta.title;
  const tag = (attribute, name, content) => {
    let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.append(element);
    }
    element.setAttribute('content', content);
  };
  tag('name', 'description', meta.description);
  tag('name', 'robots', SITE_PAGES[path] ? 'index, follow' : 'noindex, follow');
  tag('property', 'og:title', meta.title);
  tag('property', 'og:description', meta.description);
  tag('property', 'og:url', url);
  tag('property', 'og:image', new URL(socialImage, origin).href);
  tag('property', 'og:type', 'website');
  tag('name', 'twitter:card', 'summary_large_image');
  const canonical = current ?? document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = url;
  if (!current) document.head.append(canonical);
}
