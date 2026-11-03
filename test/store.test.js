import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { EMPTY_DECK, parseDeck } from '../lib/core.js';
import { createDeckStore, memoryStorage } from '../lib/store.js';

const view = (id, name = id) => ({ id, name, scene: EMPTY_DECK.scene, camera: EMPTY_DECK.camera });

test('every example deck.json is valid', () => {
  for (const d of readdirSync('examples')) parseDeck(JSON.parse(readFileSync(`examples/${d}/deck.json`, 'utf8')), d);
});

test('parseDeck rejects bad decks with a readable message', () => {
  assert.throws(() => parseDeck([]), /not a JSON object/);
  assert.throws(() => parseDeck({ ...EMPTY_DECK, views: [view('a'), view('a')] }), /share the id "a"/);
  const broken = { ...EMPTY_DECK.scene, elements: [{ ...EMPTY_DECK.scene.elements[0], bubbleId: 'nope' }] };
  assert.throws(() => parseDeck({ ...EMPTY_DECK, scene: broken }), /broken references/);
});

test('store CRUD persists to storage and notifies', () => {
  const storage = memoryStorage();
  const s = createDeckStore(storage, 'k');
  let seen = 0;
  s.subscribe(() => seen++);
  s.createView(view('a', 'Intro'));
  s.createView(view('b'));
  assert.throws(() => s.createView(view('a')), /already exists/);
  s.updateView('a', { name: 'Start' });
  s.moveView('b', -1);
  s.moveView('b', -1); // already first: no-op
  assert.deepEqual(s.listViews().map((v) => v.id), ['b', 'a']);
  assert.equal(s.findView('START').id, 'a');
  assert.equal(s.findView('b').id, 'b');
  assert.equal(s.findView('zzz'), null);
  s.deleteView('b');
  assert.throws(() => s.deleteView('b'), /No view/);
  assert.equal(seen, 5); // the no-op move does not write
  // a fresh store on the same storage sees the same deck
  assert.deepEqual(createDeckStore(storage, 'k').get(), s.get());
});

test('an invalid write is refused and leaves storage untouched', () => {
  const storage = memoryStorage();
  const s = createDeckStore(storage, 'k');
  const before = storage.getItem('k');
  assert.throws(() => s.createView({ id: 'bad id!', name: 'x', scene: EMPTY_DECK.scene, camera: EMPTY_DECK.camera }), /malformed/);
  assert.equal(storage.getItem('k'), before);
});

test('a corrupt stored deck throws and is not overwritten', () => {
  const storage = memoryStorage();
  storage.setItem('k', '{"scene":1}');
  assert.throws(() => createDeckStore(storage, 'k'), /saved in this browser/);
  assert.equal(storage.getItem('k'), '{"scene":1}');
});
