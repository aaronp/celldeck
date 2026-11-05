import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_DECK, applyCommand, bubbleLayout, bubbleRadius, nextCell, cellWalls, parseDeck } from '../lib/core.js';

test('inner cells: new cell splits the layout, detaching clears it', () => {
  const s0 = EMPTY_DECK.scene; // bb-app with three elements, no cells
  assert.equal(bubbleLayout(s0, 'bb-app').cells.length, 0);
  const s1 = applyCommand(s0, { type: 'moveElement', id: 'el-ui', toBubbleId: 'bb-app', cell: nextCell(s0, 'bb-app') });
  const L = bubbleLayout(s1, 'bb-app');
  assert.deepEqual(L.cells.map((c) => c.cell).sort(), [0, 1]);
  assert.ok(L.R > bubbleRadius(s0, 'bb-app'), 'two cells need more room than one');
  const [a, b] = L.cells; // cells do not overlap
  assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= a.r + b.r);
  const s2 = applyCommand(s1, { type: 'detachElement', id: 'el-ui', newBubbleId: 'bb-x', x: 300, y: 0, hue: 'rose' });
  assert.equal(s2.elements.find((e) => e.id === 'el-ui').cell, undefined);
  assert.equal(bubbleLayout(s2, 'bb-app').cells.length, 0);
  const s3 = applyCommand(s2, { type: 'mergeBubble', fromId: 'bb-x', intoId: 'bb-app', titleElementId: 'el-t', cell: 2 });
  assert.equal(s3.elements.find((e) => e.id === 'el-ui').cell, 2);
});

test('cell walls: two equal cells split down the middle, three meet once', () => {
  const [w] = cellWalls([{ x: -50, y: 0, r: 40 }, { x: 50, y: 0, r: 40 }], 0, 0, 100);
  assert.ok(Math.abs(w.a.x) < 1e-9 && Math.abs(w.b.x) < 1e-9 && Math.abs(Math.abs(w.a.y - w.b.y) - 200) < 1e-6);
  const three = cellWalls([0, 1, 2].map((i) => ({ x: 60 * Math.cos(i * 2.0944), y: 60 * Math.sin(i * 2.0944), r: 40 })), 0, 0, 120);
  assert.equal(three.length, 3);
  for (const s of three) assert.ok(Math.min(Math.hypot(s.a.x, s.a.y), Math.hypot(s.b.x, s.b.y)) < 1e-6, 'walls meet at the centre');
});

test('bubble colour can be custom hex; space scales the membrane', () => {
  const withB = (patch) => ({ ...EMPTY_DECK, scene: { ...EMPTY_DECK.scene, bubbles: [{ ...EMPTY_DECK.scene.bubbles[0], ...patch }] } });
  parseDeck(withB({ hue: '#8a2be2', space: 0.5 }));
  parseDeck(withB({ hue: 'slate' }));
  assert.throws(() => parseDeck(withB({ hue: '#FFF' })));
  assert.throws(() => parseDeck(withB({ space: 3 })));
  const r = (space) => bubbleRadius(applyCommand(EMPTY_DECK.scene, { type: 'updateBubble', id: 'bb-app', patch: { space } }), 'bb-app');
  assert.equal(r(1), bubbleRadius(EMPTY_DECK.scene, 'bb-app'), 'space 1 keeps the old size');
  assert.ok(r(0.5) < r(1) && r(1) < r(2));
});
