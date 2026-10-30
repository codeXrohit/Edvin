import { mkdir, rename, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

export async function saveEnquiry(directory, enquiry, notify) {
  const record = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    ...enquiry,
    notification: notify ? 'pending' : 'not_configured',
  };
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const filename = path.join(directory, `${record.id}.json`);
  await writeFile(filename, JSON.stringify(record, null, 2), { flag: 'wx', mode: 0o600 });
  return { record, filename };
}

export async function updateNotification(filename, record) {
  const updated = `${filename}.tmp`;
  try {
    await writeFile(updated, JSON.stringify(record, null, 2), { flag: 'wx', mode: 0o600 });
    await rename(updated, filename);
  } catch (error) {
    await unlink(updated).catch(() => {});
    throw error;
  }
}
