import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_DECK, applyCommand, createRuntime, fillAction, fillText, messageCommand, parseDeck } from '../lib/core.js';

test('fillText replaces known $fields, keeps unknown ones, and turns $$ into $', () => {
  assert.equal(fillText('$foo-$bar costs $$5 ($nope)', { foo: 'a', bar: 'b' }), 'a-b costs $5 ($nope)');
});

// Stage: UI --m1--> Identity --m2--> Storage. m1 asks for foo and bar, adds an element, then makes Identity send m2,
// mapping m2's own field "fizz" to $foo.
const add = { kind: 'add', label: 'svc $foo', icon: null, tags: ['$bar', 'fixed'], hue: null };
const send = { kind: 'send', from: { kind: 'target' }, message: 'm2', args: { fizz: '$foo' } };
const m1 = { id: 'm1', label: 'm1', fields: ['foo', 'bar'], actions: [add, send] };
const m2 = { id: 'm2', label: 'm2', fields: ['fizz'], actions: [{ kind: 'add', label: 'got $fizz', icon: null, tags: [], hue: null }] };
const link = (id, from, to, messages) => ({ id, from, to, label: '', head: 'end', dash: 'solid', elasticity: 0, tags: [], messages });
let scene = EMPTY_DECK.scene;
scene = applyCommand(scene, { type: 'addLink', link: link('l1', 'el-ui', 'el-identity', [m1]) });
scene = applyCommand(scene, { type: 'addLink', link: link('l2', 'el-identity', 'el-storage', [m2]) });
const rt = createRuntime(scene, EMPTY_DECK.camera);

test('a deck with fields and send args is valid', () => {
  parseDeck({ ...EMPTY_DECK, scene });
});

test('sent values fill the steps, and a send step maps them onto the next message\'s fields', () => {
  const r = messageCommand(scene, rt, 'l1', 'm1', 's', { foo: 'Auth', bar: 'Core Team' });
  const el = r.cmd.cmds[0].element;
  assert.equal(el.label, 'svc Auth');
  assert.deepEqual(el.tags, ['core team', 'fixed']);
  assert.deepEqual(r.sends, [{ linkId: 'l2', messageId: 'm2', values: { fizz: 'Auth' } }]);
  const next = messageCommand(applyCommand(scene, r.cmd), rt, 'l2', 'm2', 't', r.sends[0].values);
  assert.equal(next.cmd.cmds[0].element.label, 'got Auth');
});

test('a value that makes a bad tag skips that step with a note instead of failing the message', () => {
  const r = messageCommand(scene, rt, 'l1', 'm1', 's', { foo: 'x', bar: 'Not a tag!' });
  assert.equal(r.cmd.cmds.length, 0);
  assert.match(r.notes[0], /not a usable tag/);
  assert.equal(r.sends.length, 1);
});

test('an add step whose label fills to nothing is refused', () => {
  assert.throws(() => fillAction({ kind: 'add', label: ' $foo ', icon: null, tags: [], hue: null }, { foo: '' }), /came out empty/);
});

test('remove can target a query whose tag comes from a field', () => {
  const rm = { id: 'rm', label: 'drop', fields: ['env'], actions: [{ kind: 'remove', which: { kind: 'query', q: '', tags: ['$env'], icons: [] } }] };
  const sc = applyCommand(scene, { type: 'addLink', link: link('l3', 'el-storage', 'el-ui', [rm]) });
  parseDeck({ ...EMPTY_DECK, scene: sc });
  const r = messageCommand(sc, rt, 'l3', 'rm', 's', { env: 'Security' });
  assert.deepEqual(r.cmd.cmds[0].cmds.map((c) => c.id), ['el-identity']); // EMPTY_DECK tags Identity "security"
  assert.throws(() => messageCommand(sc, rt, 'l3', 'rm', 's', { env: 'nothing-has-this' }), /nothing matched #nothing-has-this/);
  // Without "which" it still removes the target, as before.
  const old = { id: 'old', label: 'old', actions: [{ kind: 'remove' }] };
  const sc2 = applyCommand(scene, { type: 'addLink', link: link('l4', 'el-storage', 'el-ui', [old]) });
  assert.equal(messageCommand(sc2, rt, 'l4', 'old', 's').cmd.cmds[0].id, 'el-ui');
});
