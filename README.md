# Edvin

React + JavaScript (JSX) + Vite, with Tailwind CSS, Motion and a Node contact API. Requires Node.js 22.9 or newer.

```sh
npm install
npm run dev
```

The dev command runs the website on port 5173 and the API on port 3001. Vite proxies `/api` to the backend. Open `http://localhost:5173`. Vite binds to IPv4 loopback and requires port 5173, so a second project instance fails instead of silently creating a conflicting preview. Tailwind resolves its configuration and source paths relative to this project.

## Project structure

```text
src/
  api/                    HTTP client and contact API calls
  assets/
    css/tailwind.css      Tailwind entry, global defaults and Lenis integration
    images/               All image assets, imported by components or data modules
  components/
    common/               Navigation, footer, logo, truck loader and shared UI
    about-us/             About page story and retailer invitation
    contact-us/           Contact hero, topics, form, contact details and collection link
    home/                 Existing scroll scenes, toy collection and retailer form
      store/              Three.js scene construction
    products/             Contained, keyboard-accessible toy details dialog
  data/                   Contact details, enquiry topics and product catalogue
  hooks/                  Contact form state, video scrubbing and responsive hooks
  layout/MainLayout.jsx   Shared website shell
  pages/                  Home, About Us, Products, Contact Us and 404 route composition
  utils/                  Scroll and math helpers
  workers/                Video decoding and frame preparation away from the UI thread
server/
  routes/                 Contact endpoint and submission limits
  services/               Enquiry storage and SMTP notifications
  validation/             Server-side enquiry validation
  utils/                  HTTP response helpers
  app.mjs                 HTTP routing and production static-file serving
  index.mjs               Environment configuration and server startup
scripts/dev.mjs           Starts the frontend and API together
```

Pages compose components; form state lives in hooks; network calls live in `src/api`. Styling uses Tailwind utilities, with shared tokens, responsive breakpoints and loader keyframes in `tailwind.config.js`. Inline styles are reserved for values driven by animation or measured scene geometry.

## Routes and contact setup

- `/` — existing scroll story, store, toys and retailer section.
- `/contact` — Contact Us.
- `/contact?topic=retail` — Contact Us with the retailer topic selected.
- `/contact-us` — redirect to `/contact`.
- `/about-us` — About Us.
- `/products` — filterable toy collection and product enquiries.
- Other paths — the 404 page.

Public contact details are `info@edvin.com` and `7412021880`. Copy `.env.example` to `.env` to override them. `VITE_API_BASE_URL` defaults to `/api`; both forms post to `/api/contact` through the same client.

The API validates fields, checks browser origins, limits request size and rate-limits submissions. It confirms success only after saving a private JSON record in `.data/enquiries/`, or `CONTACT_DATA_DIR`. Records are not exposed through the website.

To enable email notifications, set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` and `SMTP_FROM`. Use port 587 for STARTTLS or 465 for implicit TLS. Notifications go to `CONTACT_TO`, with the visitor as Reply-To. Missing SMTP configuration or delivery failures leave the saved record available for recovery. SMTP credentials belong in `.env` or hosting secrets; never use a `VITE_` prefix for secrets. Live email delivery still requires real SMTP configuration.

## Images and animation

All images, including `loder.png`, product photos and the port poster, live in `src/assets/images`. Update product imports in `src/data/products.js` to replace photos. Videos retain their existing external sources.

The road-and-truck loader appears while a route and its critical images/fonts are getting ready. It respects reduced motion and does not add a forced loading delay.

In the first banner, scrolling past the second cloud scene starts a single smooth transition to the ship and “The journey” text. It stops before the fade to the port; the next gesture continues normal scrolling. Scrolling upward, pressing Escape, navigating away or changing viewport width cancels the transition. Touch advancement waits for the finger to lift. Repeated forward swipes keep the automatic transition running; an upward swipe cancels it. Mobile browser-toolbar height changes do not cancel it. The mobile intro uses a shorter scroll track while retaining a full-height banner. Automatic advancement is skipped for reduced motion. The intro arrow reaches the same journey stop.

Video frame preparation runs in a Web Worker. Sections start preparing near the viewport, pause preparation when off-screen or hidden, and use a small bitmap cache. Unsupported browsers retain native video seeking. Scroll progress uses Motion values rather than React state updates for every frame. The port scene caches geometry instead of reading each card's layout during every update. Three.js is loaded only when the store approaches the viewport.

## Build and checks

```sh
npm test
npm run build
npm start
```

The production Node server serves the built website and API together, including direct page URLs and video byte-range requests. Set `HOST=0.0.0.0`, the host's assigned `PORT`, `PUBLIC_ORIGIN`, and a persistent `CONTACT_DATA_DIR` when deploying. Back up the enquiry directory. A static-only host needs a separate API and SPA rewrites; `npm run preview` does not start the backend.

## Mobile presentation and resilience

The first banner keeps its full-screen mobile video and text overlays. The separate mobile port chapter uses a larger 4:3 video window on a white background, with its heading and caption outside the media; this avoids the earlier narrow video strip and heavy portrait crop. The port video uses 4.8 viewports of scrolling on mobile and 2.4 on desktop, configured separately in `src/data/journey.js`, followed by native swipeable toy cards on mobile; desktop retains its original horizontal story. Product grids use one column on phones. Explore and Pages in the footer are collapsed by default on phones and open by tap or keyboard. Opening either group closes the other; desktop links remain expanded. The store chapter is shorter on phones. Both banner scenes have local poster images from their original videos, including offline/error fallbacks. Hidden scene controls are removed from keyboard interaction, and FAQ answers animate open and closed, with reduced-motion support and immediate removal of closing answers from assistive technology.

The video worker samples at up to 12 fps / 960px on phones and 15 fps / 1440px on desktop. JPEG frame banks are capped at 4 MB / 8 MB, with 3 / 4 decoded bitmaps. Off-screen workers pause without consuming their startup timeout. On mobile, native metadata and gesture-primed seeking bridge worker preparation immediately; worker startup falls back after eight seconds without frames. Native video seeking remains the fallback. UI arrows and controls use Font Awesome solid font icons through `src/components/common/Icons.jsx`. Social profiles use Font Awesome brand fonts; add their URLs in `src/data/socials.js`. Only the solid and brand styles are imported.

Page errors have a reload/home recovery screen. Product enquiries retain the selected toy on the contact page and the home retailer form. Instagram and Facebook appear as an icon followed by the profile name, with URLs configured in `src/data/socials.js`; the business email remains available below them. Unconfigured profiles are non-interactive icons until URLs are added. Inactive legal placeholders were removed. FAQ commercial terms defer to the team until approved policies are supplied.

## Production configuration

Run `npm run check:config` before launching. SMTP credentials and a persistent enquiry directory still need real hosting configuration; this command checks settings without sending email. Set `PUBLIC_ORIGIN` to the actual HTTPS website origin **before building** to generate canonical URLs and `sitemap.xml`. The build also produces page-specific HTML titles, descriptions, social-preview metadata, `robots.txt` and a dedicated 404 document.

If a reverse proxy sits in front of Node, set `TRUSTED_PROXIES` to only that proxy's IP addresses or CIDR ranges, comma separated. For a local Nginx proxy this is commonly `127.0.0.1,::1`. The proxy must append the real incoming client address to `X-Forwarded-For`; forwarding headers from untrusted peers are ignored. This keeps per-visitor limits separate without allowing a forged leftmost address to bypass limits. Leave the setting empty for direct connections.
