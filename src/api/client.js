const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
export async function post(endpoint, body) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(35000),
    });
    const result = await response.json().catch(() => null);
    if (response.status === 429)
      throw new Error(
        'You’ve sent a few messages already. Please try again in 15 minutes, or email us directly.',
      );
    if (!response.ok || !result)
      throw new Error('We couldn’t send your message. Your details are still here — please try again.');
    return result;
  } catch (error) {
    if (error instanceof TypeError || (error instanceof DOMException && error.name === 'TimeoutError')) {
      throw new Error('We couldn’t reach Edvin just now. Please check your connection and try again.');
    }
    throw error;
  }
}
