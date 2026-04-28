import { compare, resolveZone } from './src/index.js';
import assert from 'node:assert';

function it(name, fn) {
  try { fn(); console.log(`  ok ${name}`); }
  catch (e) { console.error(`  FAIL ${name}: ${e.message}`); process.exitCode = 1; }
}

console.log('tzdiff smoke tests');

it('resolves PST', () => assert.equal(resolveZone('PST'), 'America/Los_Angeles'));
it('resolves IDT', () => assert.equal(resolveZone('IDT'), 'Asia/Jerusalem'));
it('resolves IANA passthrough', () => assert.equal(resolveZone('Europe/London'), 'Europe/London'));
it('rejects unknown', () => assert.equal(resolveZone('BLAH'), null));
it('compare returns rows for each zone', () => {
  const rows = compare(['UTC', 'IDT', 'TYO']);
  assert.equal(rows.length, 3);
});
it('compare error for unknown', () => {
  const rows = compare(['BLAH']);
  assert.equal(rows[0].error, 'unknown timezone');
});
it('compare at fixed moment', () => {
  const at = new Date('2026-04-28T12:00:00Z');
  const rows = compare(['UTC', 'IDT'], at);
  assert.equal(rows.length, 2);
  // UTC should show 12:00, IDT (UTC+3) should show 15:00
  assert.equal(rows[0].time, '12:00');
  assert.equal(rows[1].time, '15:00');
});

console.log('done');
