import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp, validateEnquiry } from './app.mjs';

const valid = {
  name: 'Website QA',
  email: 'qa@example.com',
  company: 'Test toy shop',
  city: 'Jaipur',
  topic: 'Retail partnership',
  message: 'This is a test enquiry about stocking wooden toys.',
};

async function fixture(t, options = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'edvin-contact-test-'));
  const dataDir = path.join(root, 'enquiries');
  const staticDir = path.join(root, 'dist');
  await mkdir(staticDir);
  await writeFile(path.join(staticDir, 'index.html'), '<!doctype html><title>Edvin</title>');
  await writeFile(path.join(staticDir, 'video.mp4'), '0123456789');
  const server = createApp({ dataDir, staticDir, logger: { error() {} }, ...options });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  });
  const submit = (body = valid, headers = {}) =>
    fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
  return { root, dataDir, base, submit };
}

test('server validates and normalizes enquiry fields', () => {
  assert.equal(validateEnquiry({ ...valid, name: ' Website QA ' }).name, valid.name);
  for (const invalid of [
    null,
    [],
    { ...valid, email: 'invalid' },
    { ...valid, name: ' ' },
    { ...valid, name: 'Name\nInjected' },
    { ...valid, message: 'short' },
    { ...valid, topic: 'unexpected' },
    { ...valid, company: {} },
  ])
    assert.equal(validateEnquiry(invalid), null);
});

test('a successful submission is durably saved before acknowledgment', async (t) => {
  const { submit, dataDir } = await fixture(t);
  const response = await submit();
  assert.equal(response.status, 201);
  const result = await response.json();
  assert.equal(result.success, true);
  const saved = JSON.parse(await readFile(path.join(dataDir, `${result.reference}.json`), 'utf8'));
  assert.equal(saved.email, valid.email);
  assert.equal(saved.message, valid.message);
  assert.equal(saved.notification, 'not_configured');
});

test('invalid input, oversized payloads and foreign browser origins are rejected', async (t) => {
  const { submit, dataDir } = await fixture(t);
  assert.equal((await submit({ ...valid, email: 'invalid' })).status, 400);
  assert.equal((await submit({ ...valid, message: 'x'.repeat(40000) })).status, 413);
  assert.equal((await submit(valid, { Origin: 'https://unrelated.example' })).status, 403);
  await assert.rejects(readdir(dataDir), { code: 'ENOENT' });
});

test('SMTP messages go to the owner and preserve the visitor as Reply-To', async (t) => {
  let message;
  const mailer = {
    async sendMail(value) {
      message = value;
      return { accepted: ['info@edvin.com'], rejected: [] };
    },
  };
  const { submit, dataDir } = await fixture(t, { mailer, mailFrom: 'website@example.com' });
  const result = await (await submit()).json();
  assert.equal(message.to, 'info@edvin.com');
  assert.equal(message.from, 'website@example.com');
  assert.equal(message.replyTo.address, valid.email);
  assert.ok(message.text.includes(valid.message));
  const record = JSON.parse(await readFile(path.join(dataDir, `${result.reference}.json`), 'utf8'));
  assert.equal(record.notification, 'sent');
});

test('SMTP failure retains the accepted enquiry for recovery', async (t) => {
  const mailer = {
    async sendMail() {
      throw new Error('Test SMTP failure');
    },
  };
  const { submit, dataDir } = await fixture(t, { mailer, mailFrom: 'website@example.com' });
  const response = await submit();
  assert.equal(response.status, 201);
  const { reference } = await response.json();
  const record = JSON.parse(await readFile(path.join(dataDir, `${reference}.json`), 'utf8'));
  assert.equal(record.notification, 'failed');
  assert.equal(record.message, valid.message);
});

test('storage failure cannot return a false success', async (t) => {
  const { submit, dataDir } = await fixture(t);
  await writeFile(dataDir, 'A file prevents directory creation');
  const response = await submit();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, false);
});

test('repeated submissions are rate limited', async (t) => {
  const { submit } = await fixture(t, { limit: 2 });
  assert.equal((await submit()).status, 201);
  assert.equal((await submit()).status, 201);
  const response = await submit();
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '900');
});

test('production supports direct page routes and video ranges without exposing records', async (t) => {
  const { base } = await fixture(t);
  const page = await fetch(`${base}/contact`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Edvin/);
  assert.equal((await fetch(`${base}/.data/enquiries/example.json`)).status, 404);
  assert.equal((await fetch(`${base}/.env`)).status, 404);
  assert.equal((await fetch(`${base}/api/contact`)).status, 405);
  const range = await fetch(`${base}/video.mp4`, { headers: { Range: 'bytes=2-5' } });
  assert.equal(range.status, 206);
  assert.equal(range.headers.get('content-range'), 'bytes 2-5/10');
  assert.equal(await range.text(), '2345');
  assert.equal((await fetch(`${base}/video.mp4`, { headers: { Range: 'bytes=20-' } })).status, 416);
});

test('trusted reverse proxies isolate visitor limits and cannot trust a forged leftmost address', async (t) => {
  const { submit } = await fixture(t, { limit: 1, trustedProxies: '127.0.0.1/32' });
  assert.equal((await submit(valid, { 'X-Forwarded-For': '192.0.2.1' })).status, 201);
  assert.equal((await submit(valid, { 'X-Forwarded-For': '192.0.2.2' })).status, 201);
  assert.equal((await submit(valid, { 'X-Forwarded-For': '192.0.2.99, 192.0.2.1' })).status, 429);
});

test('untrusted peers cannot bypass limits with forwarding headers', async (t) => {
  const { submit } = await fixture(t, { limit: 1 });
  assert.equal((await submit(valid, { 'X-Forwarded-For': '192.0.2.1' })).status, 201);
  assert.equal((await submit(valid, { 'X-Forwarded-For': '192.0.2.2' })).status, 429);
});

test('unknown page routes return an actual 404 while known pages stay available', async (t) => {
  const { base } = await fixture(t);
  for (const route of ['/about-us', '/products', '/contact-us'])
    assert.equal((await fetch(base + route)).status, 200);
  const missing = await fetch(base + '/this-page-does-not-exist');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Edvin/);
});

test('production serves per-page HTML metadata and the dedicated 404 document', async (t) => {
  const { base, root } = await fixture(t);
  await mkdir(path.join(root, 'dist', 'about-us'));
  await writeFile(path.join(root, 'dist', 'about-us', 'index.html'), '<title>About us · Edvin</title>');
  await writeFile(
    path.join(root, 'dist', '404.html'),
    '<title>Page not found · Edvin</title><meta name="robots" content="noindex, follow">',
  );
  assert.match(await (await fetch(base + '/about-us')).text(), /About us/);
  const missing = await fetch(base + '/missing-page');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /noindex/);
});
