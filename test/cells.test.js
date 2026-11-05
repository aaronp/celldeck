import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_DECK, applyCommand, bubbleLayout, bubbleRadius, nextCell, cellWalls, parseDeck, membraneBlend, lobeField } from '../lib/core.js';

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

test('cell walls: run between the pinch points of touching lobes, and meet once for three', () => {
  const [w] = cellWalls([{ x: -50, y: 0, r: 60 }, { x: 50, y: 0, r: 60 }]);
  assert.ok(Math.abs(w.a.x) < 1e-9 && Math.abs(w.b.x) < 1e-9);
  assert.ok(Math.abs(Math.abs(w.a.y - w.b.y) - 2 * Math.sqrt(60 ** 2 - 50 ** 2)) < 1e-6, 'wall spans the shared chord');
  assert.equal(cellWalls([{ x: -50, y: 0, r: 40 }, { x: 50, y: 0, r: 40 }]).length, 0, 'lobes that do not touch have no wall');
  const three = cellWalls([0, 1, 2].map((i) => ({ x: 60 * Math.cos(i * 2.0944), y: 60 * Math.sin(i * 2.0944), r: 70 })));
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

test('uneven cells round a ring each touch their neighbours', () => {
  let s = EMPTY_DECK.scene; // three elements in cell 0
  s = applyCommand(s, { type: 'addElement', bubbleId: 'bb-app', element: { id: 'el-a', label: 'a', icon: null, imageId: null, tags: [], hue: null, cell: 1 } });
  s = applyCommand(s, { type: 'addElement', bubbleId: 'bb-app', element: { id: 'el-b', label: 'b', icon: null, imageId: null, tags: [], hue: null, cell: 2 } });
  const { cells } = bubbleLayout(s, 'bb-app');
  assert.equal(cells.length, 3);
  for (let i = 0; i < 3; i++) {
    const p = cells[i], q = cells[(i + 1) % 3];
    assert.ok(Math.hypot(p.x - q.x, p.y - q.y) < p.m + q.m, `lobes ${i} and ${(i + 1) % 3} overlap`);
  }
  assert.equal(cellWalls(cells.map((c) => ({ x: c.x, y: c.y, r: c.m }))).length, 3);
});

test('pinch: lower fills the waist between lobes', () => {
  const lobes = [{ x: -60, y: 0, r: 70 }, { x: 60, y: 0, r: 70 }];
  const waist = Math.sqrt(70 ** 2 - 60 ** 2); // where the two circles cross
  const rim = (pinch) => { const k = membraneBlend({ pinch }); let y = waist; while (lobeField(lobes, k, 0, y + 1) < 0) y++; return y; };
  assert.ok(rim(0) > rim(0.6) && rim(0.6) >= rim(1), `${rim(0)} > ${rim(0.6)} >= ${rim(1)}`);
  assert.ok(rim(1) - waist < 8, 'pinch 1 stays creased');
});
