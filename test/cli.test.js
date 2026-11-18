import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseDeck } from '../lib/core.js';

test('celldeck <deck.json> creates, serves and saves the deck', async (t) => {
  const deck = join(mkdtempSync(join(tmpdir(), 'celldeck-')), 'deck.json');
  const child = spawn(process.execPath, ['bin/celldeck.mjs', deck], { env: { ...process.env, NO_OPEN: '1', PORT: '0' } });
  t.after(() => child.kill());
  const url = await new Promise((ok) => child.stdout.on('data', (d) => { const m = String(d).match(/http:\S+/); if (m) ok(new URL(m[0])); }));
  const file = new URL(url.searchParams.get('src'), url);

  parseDeck(JSON.parse(readFileSync(deck, 'utf8'))); // created as a valid empty deck
  const got = await fetch(file);
  assert.equal(got.headers.get('x-celldeck-writable'), '1');
  assert.equal((await fetch(new URL('/', url))).headers.get('x-celldeck-writable'), null);
  assert.equal((await fetch(new URL('/package.json', url))).status, 404);

  const body = JSON.stringify({ ...(await got.json()), views: [] }, null, 1);
  assert.equal((await fetch(file, { method: 'PUT', body })).status, 204);
  assert.equal(readFileSync(deck, 'utf8'), body);
  assert.equal((await fetch(file, { method: 'PUT', body: 'not json' })).status, 400);
  assert.equal(readFileSync(deck, 'utf8'), body);
  assert.equal((await fetch(new URL('/', url), { method: 'PUT', body })).status, 405);
});
