import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_DECK, applyCommand, buildSteps, checkScene } from '../lib/core.js';

const A = EMPTY_DECK.scene;
const add = (scene, bubbleId, id, label) => applyCommand(scene, { type: 'addElement', bubbleId, element: { id, label, icon: null, imageId: null, tags: [], hue: null } });

test('new elements get increasing creation counters', () => {
  const s = add(add(A, 'bb-app', 'e1', 'one'), 'bb-app', 'e2', 'two');
  assert.ok(s.elements.at(-1).seq > s.elements.at(-2).seq);
});

test('buildSteps adds one element per step in creation order and ends exactly at the target', () => {
  // e2 is created after e1 but placed earlier in the array (as a duplicate would be): seq order must win.
  let B = add(A, 'bb-app', 'e1', 'one');
  B = applyCommand(B, { type: 'addBubble', bubble: { id: 'bb-new', title: 'New', hue: 'rose', x: 300, y: 0, orbit: { hubId: 'bb-app' }, tags: [] }, elements: [{ id: 'e2', label: 'two', icon: null, imageId: null, tags: [], hue: null }] });
  B = applyCommand(B, { type: 'addLink', link: { id: 'l1', from: 'e1', to: 'e2', label: '', head: 'end', dash: 'solid', elasticity: 0, tags: [], messages: [] } });
  B = { ...B, elements: [B.elements.at(-1), ...B.elements.slice(0, -1)] };
  const steps = buildSteps(A, B);
  assert.equal(steps.length, 2);
  assert.deepEqual(steps[0].elements.map((e) => e.id).filter((id) => /^e\d$/.test(id)), ['e1']);
  assert.equal(steps[0].links.length, 0); // e2 not there yet
  assert.equal(steps.at(-1), B);
  steps.forEach(checkScene);
});

test('buildSteps removes and changes first, and is a single step when nothing is added', () => {
  const B = applyCommand(applyCommand(A, { type: 'deleteElement', id: 'el-ui' }), { type: 'updateBubble', id: 'bb-app', patch: { title: 'Renamed' } });
  assert.deepEqual(buildSteps(A, B), [B]);
  const C = add(B, 'bb-app', 'e9', 'nine');
  const steps = buildSteps(A, C);
  assert.equal(steps.length, 2);
  assert.equal(steps[0].bubbles[0].title, 'Renamed');
  assert.ok(!steps[0].elements.some((e) => e.id === 'el-ui' || e.id === 'e9'));
});
