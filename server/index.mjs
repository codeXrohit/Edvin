import { createApp } from './app.mjs';
import { createMailer } from './services/mail.mjs';

const mailer = createMailer();
const server = createApp({
  dataDir: process.env.CONTACT_DATA_DIR,
  mailer,
  mailFrom: process.env.SMTP_FROM,
  mailTo: process.env.CONTACT_TO || 'info@edvin.com',
  publicOrigin: process.env.PUBLIC_ORIGIN,
  trustedProxies: process.env.TRUSTED_PROXIES,
});
const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '127.0.0.1';
server.listen(port, host, () => {
  console.log(`Edvin website + contact API: http://${host}:${port}`);
  console.log(
    mailer
      ? 'SMTP notifications enabled.'
      : 'Enquiries are saved locally. Set SMTP settings in .env to enable email notifications.',
  );
});
server.on('error', (error) => {
  console.error(`Edvin server could not start (${error.code ?? 'unknown error'}).`);
  process.exit(1);
});
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
