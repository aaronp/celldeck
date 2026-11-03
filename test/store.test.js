import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { EMPTY_DECK, parseDeck } from '../lib/core.js';
import { createDeckStore, memoryStorage } from '../lib/store.js';

const view = (id, name = id) => ({ id, name, scene: EMPTY_DECK.scene, camera: EMPTY_DECK.camera });

test('every example deck.json is valid', () => {
  for (const d of readdirSync('examples', { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name)) parseDeck(JSON.parse(readFileSync(`examples/${d}/deck.json`, 'utf8')), d);
});

test('element label style is optional and validated', () => {
  const withEl = (patch) => ({ ...EMPTY_DECK, scene: { ...EMPTY_DECK.scene, elements: [{ ...EMPTY_DECK.scene.elements[0], ...patch }] } });
  parseDeck(withEl({ textHue: 'rose', strike: true, fill: true, icon: 'watch' }));
  assert.throws(() => parseDeck(withEl({ fill: 1 })));
  assert.throws(() => parseDeck(withEl({ textHue: 'red' })));
  assert.throws(() => parseDeck(withEl({ strike: 'yes' })));
});

test('slide notes live on the stage and are optional', () => {
  const withStage = (patch) => ({ ...EMPTY_DECK, scene: { ...EMPTY_DECK.scene, stage: { ...EMPTY_DECK.scene.stage, ...patch } } });
  parseDeck(withStage({ description: '<b>Intro</b>', showDescription: true }));
  assert.throws(() => parseDeck(withStage({ description: 'x'.repeat(4001) })), /malformed/);
});

test('deck version: missing means 1, newer is refused', () => {
  const { version, ...old } = EMPTY_DECK;
  assert.equal(parseDeck(old).version, 1);
  assert.throws(() => parseDeck({ ...EMPTY_DECK, version: 2 }), /newer Cell Deck/);
  assert.throws(() => parseDeck({ ...EMPTY_DECK, version: 'x' }), /malformed at \/version/);
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
  s.createView(view('c'));
  s.moveViewTo('c', 0);
  assert.deepEqual(s.listViews().map((v) => v.id), ['c', 'b', 'a']);
  s.moveViewTo('c', 99);
  assert.deepEqual(s.listViews().map((v) => v.id), ['b', 'a', 'c']);
  s.deleteView('c');
  s.deleteView('b');
  assert.throws(() => s.deleteView('b'), /No view/);
  assert.equal(seen, 9); // the no-op move does not write
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

test('a slide with no backdrop colour keeps the previous one in present mode', async () => {
  const { presentedScene, ownedScene } = await import('../lib/core.js');
  const at = (id, color, opacity = 1) => ({ ...view(id), scene: { ...EMPTY_DECK.scene, stage: { ...EMPTY_DECK.scene.stage, color, opacity } } });
  const views = [at('a', null), at('b', '#101828', 0.8), at('c', null), at('d', '#ffffff', 0), at('e', null)];
  const bg = (id) => presentedScene(views, id).stage;
  assert.equal(bg('a').color, null);
  assert.deepEqual([bg('c').color, bg('c').opacity], ['#101828', 0.8]);
  assert.deepEqual([bg('e').color, bg('e').opacity], ['#ffffff', 0]); // 0% resets to the theme
  assert.equal(views[2].scene.stage.color, null); // the saved view is untouched
  assert.equal(ownedScene(views, 'c', presentedScene(views, 'c')).stage.color, null); // saving it back keeps it following
  assert.equal(ownedScene(views, 'c', at('x', '#000000').scene).stage.color, '#000000');
});
