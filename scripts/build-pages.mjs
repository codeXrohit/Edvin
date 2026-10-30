import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { SITE_PAGES, NOT_FOUND_META } from '../src/data/site.js';

const template = await readFile('dist/index.html', 'utf8');
const origin = process.env.PUBLIC_ORIGIN ? new URL(process.env.PUBLIC_ORIGIN).origin : '';
const image = (await readdir('dist/assets')).find(
  (name) => name.startsWith('journey-share-') && name.endsWith('.jpg'),
);
const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  );
function render(path, meta, missing = false) {
  const url = origin ? origin + path : '';
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Edvin" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...(image ? [`<meta property="og:image" content="${origin}/assets/${image}" />`] : []),
    ...(url
      ? [
          `<meta property="og:url" content="${escape(url)}" />`,
          `<link rel="canonical" href="${escape(url)}" />`,
        ]
      : []),
    ...(missing ? ['<meta name="robots" content="noindex, follow" />'] : []),
  ].join('\n    ');
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escape(meta.description)}" />`,
    )
    .replace('</head>', `    ${tags}\n  </head>`);
}
for (const [path, meta] of Object.entries(SITE_PAGES)) {
  const directory = path === '/' ? 'dist' : `dist${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, render(path, meta));
}
await mkdir('dist/contact-us', { recursive: true });
await writeFile('dist/contact-us/index.html', render('/contact', SITE_PAGES['/contact']));
await writeFile('dist/404.html', render('/404', NOT_FOUND_META, true));
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`,
);
if (origin)
  await writeFile(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
      SITE_PAGES,
    )
      .map((path) => `<url><loc>${escape(origin + path)}</loc></url>`)
      .join('')}</urlset>`,
  );
console.log('Built page metadata, social previews, robots.txt and the 404 document.');
if (!origin)
  console.log(
    'Set PUBLIC_ORIGIN when building for the live domain to include canonical URLs and sitemap.xml.',
  );
