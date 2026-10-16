import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { onRequest } from '../functions/_middleware.js';

const password = 'test-only:password-123';
const basic = value => `Basic ${Buffer.from(value).toString('base64')}`;

async function request(authorization, secret = password, path = '/') {
    let served = false;
    const response = await onRequest({
        request: new Request(`https://example.com${path}`, {
            headers: authorization ? { Authorization: authorization } : {},
        }),
        env: { SITE_PASSWORD: secret },
        next: async () => { served = true; return new Response('protected content'); },
    });
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
    return { response, served };
}

test('missing, incorrect, malformed, and wrong-user credentials cannot reach any assets', async () => {
    for (const path of ['/', '/assets/app.js', '/portrait.png']) {
        for (const authorization of [undefined, basic('players:wrong'), basic(`other:${password}`), 'Basic !!!', 'Bearer token']) {
            const { response, served } = await request(authorization, password, path);
            assert.equal(response.status, 401);
            assert.match(response.headers.get('WWW-Authenticate'), /^Basic /);
            assert.equal(served, false);
        }
    }
});

test('valid password allows content, including colons and Unicode', async () => {
    for (const secret of [password, 'test-é-שלום']) {
        const { response, served } = await request(basic(`players:${secret}`), secret);
        assert.equal(served, true);
        assert.equal(await response.text(), 'protected content');
    }
});

test('missing configuration fails closed', async () => {
    const { response, served } = await request(basic(`players:${password}`), '');
    assert.equal(response.status, 503);
    assert.equal(served, false);
});

test('all deployed paths pass through the password gate', async () => {
    const routes = JSON.parse(await readFile(new URL('../public/_routes.json', import.meta.url)));
    assert.deepEqual(routes.include, ['/*']);
    assert.deepEqual(routes.exclude, []);
});
