export function json(response, status, body, extra = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extra,
  });
  response.end(JSON.stringify(body));
}
