import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

test('API health and access controls', async () => {
  const server = createApp().listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const health = await fetch(base + '/api/health');
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { ok: true, service: 'truvexa-api' });
    const anonymous = await fetch(base + '/api/auth/me');
    assert.equal(anonymous.status, 401);
    const invalidOrigin = await fetch(base + '/api/auth/logout', { method: 'POST', headers: { Origin: 'https://untrusted.example' } });
    assert.equal(invalidOrigin.status, 403);
    const invalidInquiry = await fetch(base + '/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'short' }) });
    assert.equal(invalidInquiry.status, 400);
    const missing = await fetch(base + '/api/unknown-path');
    assert.equal(missing.status, 404);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
