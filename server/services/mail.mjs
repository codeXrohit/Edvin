import nodemailer from 'nodemailer';

export function createMailer(env = process.env) {
  const smtpReady = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'].every((key) =>
    Boolean(env[key]),
  );
  const smtpPort = Number(env.SMTP_PORT || 587);
  return smtpReady
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465,
        requireTLS: smtpPort !== 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
      })
    : null;
}

export function enquiryEmail(record, { from, to }) {
  return {
    from,
    to,
    replyTo: { name: record.name, address: record.email },
    subject: `Edvin enquiry · ${record.topic}`,
    text: `New Edvin website enquiry\nReference: ${record.id}\nReceived: ${record.receivedAt}\n\nName: ${record.name}\nEmail: ${record.email}\nCompany / store: ${record.company || '—'}\nCity: ${record.city || '—'}\nTopic: ${record.topic}\n\n${record.message}`,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}
