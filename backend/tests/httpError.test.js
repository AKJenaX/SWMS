import test from 'node:test';
import assert from 'node:assert/strict';
import { httpError } from '../utils/httpError.js';

test('httpError creates structured error object', () => {
  const err = httpError(400, 'VALIDATION_ERROR', 'Invalid payload', { field: 'name' });
  assert.equal(err.status, 400);
  assert.equal(err.code, 'VALIDATION_ERROR');
  assert.equal(err.message, 'Invalid payload');
  assert.deepEqual(err.details, { field: 'name' });
});
