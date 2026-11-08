import test from 'node:test';
import assert from 'node:assert/strict';
import { slug, positiveId, nonempty, httpError } from '../src/utils.js';
test('slug normalizes URL-safe names', () => {
  assert.equal(slug('Travel & Tourism'), 'travel-tourism');
  assert.equal(slug('  Business Connections  '), 'business-connections');
});
test('positive IDs reject invalid values', () => {
  assert.equal(positiveId.safeParse('3').success, true);
  assert.equal(positiveId.safeParse('-1').success, false);
  assert.equal(positiveId.safeParse('abc').success, false);
});
test('text inputs are trimmed and length limited', () => {
  assert.equal(nonempty(20).parse('  Hello  '), 'Hello');
  assert.equal(nonempty(3).safeParse('long').success, false);
});
test('HTTP error preserves status', () => {
  assert.equal(httpError(403, 'Forbidden').status, 403);
});
