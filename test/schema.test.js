import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DeckSchema, parseDeck } from '../lib/core.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));

test('deck.schema.json matches DeckSchema (run `make schema` after changing it)', () => {
  assert.deepEqual(read('../deck.schema.json'), JSON.parse(JSON.stringify(DeckSchema)));
});

test('the example deck reads', () => {
  parseDeck(read('../examples/acme-architecture/deck.json'));
});
