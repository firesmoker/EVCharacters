// Protect every request, including direct requests for scripts and images.
export async function onRequest({ request, env, next }) {
    const headers = { 'Cache-Control': 'private, no-store' };
    if (!env.SITE_PASSWORD) {
        return new Response('Site access is not configured yet.', { status: 503, headers });
    }

    const authorization = request.headers.get('Authorization') || '';
    let credentials = '';
    try {
        if (/^Basic /i.test(authorization)) {
            const bytes = Uint8Array.from(atob(authorization.slice(6)), c => c.charCodeAt(0));
            credentials = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        }
    } catch {
        // Malformed credentials receive the same challenge as incorrect ones.
    }

    // Compare fixed-length digests without stopping at the first differing byte.
    const encoder = new TextEncoder();
    const [actual, expected] = await Promise.all(
        [credentials, `players:${env.SITE_PASSWORD}`].map(value =>
            crypto.subtle.digest('SHA-256', encoder.encode(value)))
    );
    const actualBytes = new Uint8Array(actual);
    const expectedBytes = new Uint8Array(expected);
    let difference = 0;
    for (let i = 0; i < actualBytes.length; i++) difference |= actualBytes[i] ^ expectedBytes[i];

    if (difference !== 0) {
        return new Response('Enter the shared player password to open Eternal Valor.', {
            status: 401,
            headers: { ...headers, 'WWW-Authenticate': 'Basic realm="Eternal Valor", charset="UTF-8"' },
        });
    }

    const upstream = await next();
    const response = new Response(upstream.body, upstream);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
}
