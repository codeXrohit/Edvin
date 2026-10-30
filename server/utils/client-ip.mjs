import { BlockList, isIP } from 'node:net';

function normalize(value) {
  return value?.startsWith('::ffff:') && isIP(value.slice(7)) === 4 ? value.slice(7) : value;
}

export function createClientIpResolver(proxies = '') {
  const trusted = new BlockList();
  for (const entry of proxies
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)) {
    const [raw, prefix] = entry.split('/');
    const address = normalize(raw);
    const version = isIP(address);
    if (!version) throw new Error('TRUSTED_PROXIES must contain IP addresses or CIDR ranges.');
    const type = version === 4 ? 'ipv4' : 'ipv6';
    if (prefix === undefined) trusted.addAddress(address, type);
    else {
      const bits = Number(prefix);
      if (!Number.isInteger(bits) || bits < 0 || bits > (version === 4 ? 32 : 128))
        throw new Error('Invalid TRUSTED_PROXIES CIDR prefix.');
      trusted.addSubnet(address, bits, type);
    }
  }
  const isTrusted = (ip) => trusted.check(ip, isIP(ip) === 4 ? 'ipv4' : 'ipv6');
  return (request) => {
    const peer = normalize(request.socket.remoteAddress) || 'unknown';
    if (!isIP(peer) || !isTrusted(peer)) return peer;
    const header = request.headers['x-forwarded-for'];
    if (typeof header !== 'string' || header.length > 2048) return peer;
    const chain = header.split(',').map((value) => normalize(value.trim()));
    if (!chain.length || chain.some((ip) => !isIP(ip))) return peer;
    chain.push(peer);
    while (chain.length > 1 && isTrusted(chain[chain.length - 1])) chain.pop();
    return chain[chain.length - 1];
  };
}
