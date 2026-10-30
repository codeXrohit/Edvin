const required = [
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
  'PUBLIC_ORIGIN',
  'CONTACT_DATA_DIR',
];
const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  console.error(`Production configuration still needs: ${missing.join(', ')}.`);
  console.error(
    'Set these in .env or hosting secrets. Enquiries remain saved locally until SMTP is configured.',
  );
  process.exitCode = 1;
} else {
  const origin = new URL(process.env.PUBLIC_ORIGIN);
  if (origin.protocol !== 'https:') {
    console.error('PUBLIC_ORIGIN must be the HTTPS website origin for production.');
    process.exitCode = 1;
  } else
    console.log(
      'Required production settings are present. SMTP delivery still needs a real end-to-end verification.',
    );
}
