import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_DECK, ICONS, applyCommand, createRuntime, describeAction, fillAction, fillText, messageCommand, parseDeck, resolveSelector } from '../lib/core.js';

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
  assert.equal(messageCommand(sc2, rt, 'l4', 'old', 's').cmd.cmds[0].cmds[0].id, 'el-ui');
});

test('query tags must all match, and a bubble\'s tags count for its elements', () => {
  const db = (id, bubbleId) => ({ id, bubbleId, label: 'DB', icon: 'database', imageId: null, tags: ['database'], hue: null });
  const bub = (id, tag, x) => ({ id, title: tag, hue: 'teal', x, y: 0, orbit: null, tags: [tag] });
  let sc = applyCommand(scene, { type: 'addBubble', bubble: bub('s1', 'system1', 400), elements: [db('db1'), { ...db('api1'), label: 'API', tags: ['api'] }] });
  sc = applyCommand(sc, { type: 'addBubble', bubble: bub('s2', 'system2', 800), elements: [db('db2')] });
  const q = { kind: 'query', q: '', tags: ['system1', 'database'], icons: [] };
  assert.deepEqual(resolveSelector(sc, q, { from: 'el-ui', to: 'el-ui' }), ['db1']);
  assert.deepEqual(resolveSelector(sc, { ...q, tags: ['system2'] }, { from: 'el-ui', to: 'el-ui' }), ['db2']);
});

test('split and clone can act on a query instead of the target', () => {
  const msgs = [
    { id: 'cl', label: 'clone', fields: ['t'], actions: [{ kind: 'clone', which: { kind: 'query', q: '', tags: ['$t'], icons: [] } }] },
    { id: 'sp', label: 'split', actions: [{ kind: 'split', which: { kind: 'query', q: '', tags: ['security'], icons: [] } }] },
    { id: 'old', label: 'old', actions: [{ kind: 'clone' }] },
  ];
  const sc = applyCommand(scene, { type: 'addLink', link: link('l5', 'el-storage', 'el-ui', msgs) });
  parseDeck({ ...EMPTY_DECK, scene: sc });
  const c = messageCommand(sc, rt, 'l5', 'cl', 's', { t: 'frontend' }); // only UI is tagged frontend
  assert.deepEqual(c.cmd.cmds[0].cmds.map((x) => x.id), ['el-ui']);
  const sp = messageCommand(sc, rt, 'l5', 'sp', 's').cmd.cmds[0].cmds;
  assert.deepEqual(sp.map((x) => [x.type, x.id]), [['detachElement', 'el-identity']]);
  assert.equal(messageCommand(sc, rt, 'l5', 'old', 's').cmd.cmds[0].cmds[0].id, 'el-ui'); // no "which": the target
});

test('an add step may leave the label empty when it has an icon', () => {
  const add = (label, icon) => ({ kind: 'add', label, icon, tags: [], hue: null });
  assert.deepEqual(fillAction(add('', 'events'), {}).label, '');
  assert.equal(fillAction(add(' $foo ', 'events'), { foo: '' }).label, '', 'a field that fills in empty is fine with an icon');
  assert.throws(() => fillAction(add('', null), {}), /neither a label nor an icon/);
  assert.equal(describeAction(add('', 'events'), EMPTY_DECK.scene), `Add ${ICONS.events[0]} icon`);
});
