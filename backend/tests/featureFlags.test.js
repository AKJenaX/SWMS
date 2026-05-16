import test from 'node:test';
import assert from 'node:assert/strict';
import { requireFeature } from '../middleware/featureFlags.js';

function mockRes() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    }
  };
}

test('requireFeature passes when enabled', () => {
  process.env.ENABLE_SAMPLE = 'true';
  const middleware = requireFeature('ENABLE_SAMPLE');
  let passed = false;
  middleware({ context: {} }, mockRes(), () => {
    passed = true;
  });
  assert.equal(passed, true);
});

test('requireFeature blocks when disabled', () => {
  process.env.ENABLE_SAMPLE = 'false';
  const middleware = requireFeature('ENABLE_SAMPLE');
  const res = mockRes();
  middleware({ context: { requestId: 'r1' } }, res, () => {});
  assert.equal(res.statusCode, 503);
  assert.equal(res.payload.code, 'FEATURE_DISABLED');
});
