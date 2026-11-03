// Cell Deck core: schemas, scene reducers, physics. Pure — no DOM, no clock, no randomness.
// Ids and timestamps are always passed in from the edge. Runs in the browser (via the page's
// import map) and in Node (npm test).
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

// === CORE START ===
// Pure core: schemas, scene reducers, physics. No DOM, no clock, no randomness.
// Ids and timestamps are always passed in from the edge.

export const HUES = ['teal', 'violet', 'amber', 'rose', 'blue', 'green'];

// 24×24 stroke icons (Path2D / SVG path data).
export const ICONS = {
  ui: ['Interface', 'M3 5h18v14H3z M3 9h18 M6 7h.01 M9 7h.01'],
  user: ['Identity', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 4-6 8-6s8 2 8 6'],
  users: ['People', 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14.6c2.4.6 4 2.4 4 5.4'],
  storage: ['Storage', 'M3 4h18v4H3z M5 8v12h14V8 M10 12h4'],
  database: ['Database', 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'],
  doc: ['Document', 'M6 2h9l5 5v15H6z M14 2v6h6'],
  api: ['API', 'M8 4c-2 0-3 1-3 3v2c0 1.5-1 3-2 3 1 0 2 1.5 2 3v2c0 2 1 3 3 3 M16 4c2 0 3 1 3 3v2c0 1.5 1 3 2 3-1 0-2 1.5-2 3v2c0 2-1 3-3 3'],
  server: ['Server', 'M4 4h16v6H4z M4 14h16v6H4z M8 7h.01 M8 17h.01'],
  cloud: ['Cloud', 'M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 8a4 4 0 0 1 0 10z'],
  fn: ['Function', 'M5 20l7-11 M7 4h2c1.5 0 2.5 1 3 2.5L18 20h2'],
  queue: ['Queue', 'M2 10h5v9H2z M9.5 10h5v9h-5z M17 10h5v9h-5z M3 5.5h17 M17 3l3 2.5-3 2.5'],
  events: ['Events', 'M13 2L4 14h7l-1 8 9-12h-7z'],
  chip: ['Cache', 'M6 6h12v12H6z M9 2v4 M15 2v4 M9 18v4 M15 18v4 M2 9h4 M2 15h4 M18 9h4 M18 15h4'],
  key: ['Key', 'M8 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M10.8 12.2L20 3 M17 6l3 3 M15 8l2 2'],
  lock: ['Lock', 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4'],
  shield: ['Shield', 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'],
  phone: ['Phone', 'M7 2h10v20H7z M11 18h2'],
  tablet: ['Tablet', 'M5 3h14v18H5z M11 18h2'],
  laptop: ['Laptop', 'M5 5h14v10H5z M4 15h16l2 4H2z'],
  desktop: ['Desktop', 'M3 4h18v12H3z M12 16v4 M8 20h8'],
  office: ['Office', 'M5 21V4h10v17 M15 9h4v12 M3 21h18 M8 7h1 M11 7h1 M8 11h1 M11 11h1 M8 15h1 M11 15h1 M17 13h.01 M17 17h.01'],
  store: ['Store', 'M4 9l1.5-5h13L20 9 M4 9a2.67 2.67 0 0 0 5.33 0a2.67 2.67 0 0 0 5.34 0a2.67 2.67 0 0 0 5.33 0 M5 11v9h14v-9 M10 20v-5h4v5'],
  globe: ['Web', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z'],
  mail: ['Mail', 'M3 5h18v14H3z M3 6l9 7 9-7'],
  chart: ['Analytics', 'M4 20V10 M10 20V4 M16 20v-7 M3 20h18'],
  search: ['Search', 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M16 16l5 5'],
  card: ['Payments', 'M3 6h18v12H3z M3 10h18 M7 15h4'],
  wallet: ['Wallet', 'M4 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a3 3 0 0 1 3-3h10v2 M14 11h7v4h-7z M16.5 13h.01'],
  bell: ['Notify', 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 21h4'],
  gear: ['Config', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M4.9 19.1L7 17 M17 7l2.1-2.1'],
  cog: ['Settings', 'M18.7 9.9 L21.4 10.4 L21.4 13.6 L18.7 14.1 L18.2 15.3 L19.8 17.5 L17.5 19.8 L15.3 18.2 L14.1 18.7 L13.6 21.4 L10.4 21.4 L9.9 18.7 L8.7 18.2 L6.5 19.8 L4.2 17.5 L5.8 15.3 L5.3 14.1 L2.6 13.6 L2.6 10.4 L5.3 9.9 L5.8 8.7 L4.2 6.5 L6.5 4.2 L8.7 5.8 L9.9 5.3 L10.4 2.6 L13.6 2.6 L14.1 5.3 L15.3 5.8 L17.5 4.2 L19.8 6.5 L18.2 8.7z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  spark: ['AI', 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z'],
  trash: ['Trash', 'M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13 M10 11v6 M14 11v6'],
  noentry: ['No entry', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M7 12h10'],
  yield: ['Yield', 'M3 4h18L12 20z M7.5 6.5h9L12 15z'],
  x: ['Cross', 'M6 6l12 12 M18 6L6 18'],
  car: ['Car', 'M5 11l2-5h10l2 5 M3 11h18v6H3z M7 14h.01 M17 14h.01 M6 17v2 M18 17v2'],
  train: ['Train', 'M6 3h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M4 11h16 M8 14h.01 M16 14h.01 M8 17l-2 4 M16 17l2 4'],
  eye: ['Eye', 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  watch: ['Timer', 'M12 6a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z M12 10v3.5l2.5 1.5 M10 2h4 M12 2v4 M18.5 6.5L20 5'],
  plane: ['Plane', 'M12 2c1 0 1.5 1 1.5 2.5V9l7.5 4.5V16l-7.5-2.5V18l2.5 2v1.5L12 20.5l-4 1V20l2.5-2v-4.5L3 16v-2.5L10.5 9V4.5C10.5 3 11 2 12 2z'],
};
export const ICON_KEYS = Object.keys(ICONS);

export const LIMITS = { bubbles: 40, elements: 80 };

// ---------- schemas ----------
const Id = (what, example) => Type.String({
  pattern: '^[A-Za-z0-9_-]{1,40}$',
  description: `Stable id of ${what}. Views are matched by id, so the same ${what} in two views morphs between them instead of popping in and out.`,
  examples: [example],
});

export const TAG_PATTERN = '^[a-z0-9][a-z0-9 _-]{0,23}$';
const Tags = (what) => Type.Array(Type.String({ pattern: TAG_PATTERN, description: 'One lowercase tag: letters, digits, spaces, - and _; at most 24 characters.' }), {
  maxItems: 12, uniqueItems: true,
  description: `Free-form tags on ${what}. The filter bar matches them as text and lists them as toggles, so tag by layer, owner or concern (e.g. "frontend", "data", "pii").`,
  examples: [['data', 'pii']],
});

/** Turn typed text into a valid tag, or throw a UserError explaining why it cannot be one. */
export function normalizeTag(raw) {
  const t = String(raw).toLowerCase().trim().replace(/\s+/g, ' ');
  if (!new RegExp(TAG_PATTERN).test(t)) throw new UserError('Tags are up to 24 characters of letters, digits, spaces, - and _, starting with a letter or digit.');
  return t;
}

const HueLiteral = Type.Union(HUES.map((h) => Type.Literal(h)));
const IconLiteral = Type.Union(ICON_KEYS.map((k) => Type.Literal(k)));

export const ElementSchema = Type.Object({
  id: Id('an element', 'el-ui'),
  bubbleId: Type.String({ pattern: '^[A-Za-z0-9_-]{1,40}$', description: 'Id of the bubble this element sits in. When it differs between two views, the element travels from one bubble to the other during the morph.', examples: ['bb-app'] }),
  label: Type.String({ maxLength: 60, description: 'Caption drawn under the icon or image. With no icon and no image the label alone is the element, drawn larger.', examples: ['Identity'] }),
  icon: Type.Union([Type.Null(), Type.Union(ICON_KEYS.map((k) => Type.Literal(k)))], { description: 'Built-in line icon, or null for none. Ignored when imageId is set.', examples: ['user'] }),
  imageId: Type.Union([Type.Null(), Type.String({ pattern: '^[0-9a-f]{32}$' })], { description: 'Uploaded image asset id (served at /_blob/<id>), or null. Takes precedence over the icon so a logo or screenshot can stand in for it.', examples: [null] }),
  tags: Tags('this element'),
  hue: Type.Union([Type.Null(), HueLiteral], { description: 'Colour of the element\'s chip ring, or null to follow its bubble\'s membrane colour. Lets an element added by a message stand out from its neighbours.', examples: [null, 'amber'] }),
  textHue: Type.Optional(Type.Union([Type.Null(), HueLiteral], { description: 'Colour of the label text, or null (or absent) for the default text colour.', examples: [null, 'rose'] })),
  description: Type.Optional(Type.String({ maxLength: 4000, description: 'Rich-text notes as a small HTML subset (b, i, u, ul, ol, li, a href, p, br). The page sanitises it before showing it, so any other markup is dropped. Absent or empty for none.', examples: ['<b>Primary</b> store<ul><li>EU only</li></ul>'] })),
  showDescription: Type.Optional(Type.Boolean({ description: 'In present mode, show the description along the footer when this element is clicked. Absent means false.', examples: [true] })),
  seq: Type.Optional(Type.Integer({ minimum: 1, description: 'Creation counter: elements added later have a higher number. Builds between views add elements in this order. Absent on elements from before it existed; those come first, in deck order.', examples: [12] })),
  fill: Type.Optional(Type.Boolean({ description: 'Fill the icon chip with its colour instead of only ringing it. Absent means false.', examples: [false] })),
  strike: Type.Optional(Type.Boolean({ description: 'Draw the label struck through, e.g. for something removed or deprecated. Absent means false.', examples: [false] })),
}, { additionalProperties: false, description: 'One draggable thing inside a bubble: an icon, an image or a text label.' });

export const BubbleSchema = Type.Object({
  id: Id('a bubble', 'bb-app'),
  title: Type.String({ maxLength: 40, description: 'Name of the bubble. Drawn under the membrane when the bubble has elements, or in its centre when it is empty. Empty string for none.', examples: ['Web app'] }),
  hue: Type.Union(HUES.map((h) => Type.Literal(h)), { description: 'Membrane colour, one of six theme-aware cell hues so it reads in light and dark mode.', examples: ['teal'] }),
  x: Type.Number({ description: 'Resting position in world units (CSS px at zoom 1). Free bubbles spring back here; bubbles in orbit ignore it and sit on their ring.', examples: [0] }),
  y: Type.Number({ description: 'Resting position in world units; +y is down.', examples: [0] }),
  orbit: Type.Union([Type.Null(), Type.Object({
    hubId: Type.String({ pattern: '^[A-Za-z0-9_-]{1,40}$', description: 'Bubble this one circles. All satellites of a hub are spaced evenly around it, so adding one pushes the rest round.', examples: ['bb-storage'] }),
  }, { additionalProperties: false })], { description: 'Ring membership, or null for a free bubble.', examples: [null] }),
  tags: Tags('this bubble; a tag here also matches every element inside it'),
}, { additionalProperties: false, description: 'A cell: a gooey membrane holding zero or more elements.' });

// Message fields: a message can ask for values when it is sent; text in its steps refers to them as $name ($$ is a literal $).
export const FIELD_PATTERN = '^[a-z][a-z0-9_]{0,23}$';
const PLACEHOLDER = /\$\$|\$([a-z][a-z0-9_]{0,23})/g;
/** Replace $name with values[name]; $$ becomes $. A $name that is not in values is left as written. */
export const fillText = (text, values) => text.replace(PLACEHOLDER, (m, name) => (name === undefined ? '$' : Object.hasOwn(values, name) ? values[name] : m));
/** Field names a piece of text refers to. */
export const fieldRefs = (text) => [...text.matchAll(PLACEHOLDER)].map((m) => m[1]).filter(Boolean);
// Tags inside message steps may contain $field placeholders; they are checked as real tags once filled in.
export const TEMPLATE_TAG_PATTERN = '^[a-z0-9$][a-z0-9 _$-]{0,23}$';
const TagList = (why) => Type.Array(Type.String({ pattern: TEMPLATE_TAG_PATTERN }), { maxItems: 12, uniqueItems: true, description: `${why} May use $field placeholders.` });
const TargetSelector = Type.Object({ kind: Type.Literal('target') }, { additionalProperties: false, description: 'The element the message arrives at.' });
const QuerySelector = Type.Object({
    kind: Type.Literal('query'),
    q: Type.String({ maxLength: 60, description: 'Text matched against labels, tags, icon names and bubble titles, as in the filter bar. Empty for no text condition.', examples: ['cache'] }),
    tags: TagList('Elements with all of these tags, counting their bubble\'s tags as theirs (so ["system1", "database"] is the databases in the system1 bubble). Empty for no tag condition.'),
    icons: Type.Array(IconLiteral, { maxItems: ICON_KEYS.length, uniqueItems: true, description: 'Elements showing any of these icons. Empty for no icon condition.' }),
}, { additionalProperties: false, description: 'Every element on the stage matching all the conditions given, evaluated when the message arrives. A query with no conditions matches nothing.' });
/** Which elements a split, clone or remove step acts on. */
const Which = (verb) => Type.Optional(Type.Union([TargetSelector, QuerySelector], { description: `What to ${verb}: the target (the default when absent), or every element a query matches when the message arrives. Query text and tags may use $fields, e.g. a tag of "$env".` }));
export const SelectorSchema = Type.Union([
  Type.Object({ kind: Type.Literal('source') }, { additionalProperties: false, description: 'The element the message was sent from.' }),
  TargetSelector,
  QuerySelector,
], { description: 'Which elements one end of a new connection attaches to.' });

export const ActionSchema = Type.Union([
  Type.Object({
    kind: Type.Literal('add'),
    label: Type.String({ minLength: 1, maxLength: 60, description: 'Label of the element the message creates.', examples: ['Postgres'] }),
    icon: Type.Union([Type.Null(), IconLiteral], { description: 'Icon of the new element, or null for a text-only element.', examples: ['database'] }),
    tags: TagList('Tags given to the new element.'),
    hue: Type.Union([Type.Null(), HueLiteral], { description: 'Chip colour of the new element, or null to follow its bubble.', examples: ['blue'] }),
  }, { additionalProperties: false, description: 'Create a new element in the target\'s bubble; it buds out of the target.' }),
  Type.Object({ kind: Type.Literal('split'), which: Which('split out') }, { additionalProperties: false, description: 'Knock elements (the target by default) out of their bubbles into new bubbles, carried on in the direction the message travelled.' }),
  Type.Object({ kind: Type.Literal('clone'), which: Which('clone') }, { additionalProperties: false, description: 'Elements (the target by default) divide: a copy of each (label, icon, image, tags, colour; not its connections) appears beside it in the same bubble.' }),
  Type.Object({
    kind: Type.Literal('remove'),
    which: Which('delete'),
  }, { additionalProperties: false, description: 'Delete elements (the target by default), and with them their connections; a bubble left empty and untitled goes too.' }),
  Type.Object({
    kind: Type.Literal('connect'),
    from: SelectorSchema,
    to: SelectorSchema,
    label: Type.String({ maxLength: 60, description: 'Label for each new connection.', examples: ['reads'] }),
    head: Type.Union([Type.Literal('none'), Type.Literal('end'), Type.Literal('both')], { description: 'Arrowheads on each new connection.', examples: ['end'] }),
    dash: Type.Union([Type.Literal('solid'), Type.Literal('dashed'), Type.Literal('flow')], { description: 'Line style of each new connection.', examples: ['flow'] }),
    elasticity: Type.Number({ minimum: 0, maximum: 1, description: 'Elasticity of each new connection: 0 is a rigid straight line; above 0 it behaves like a rubber band (sags, wobbles, tugs its ends together), looser as it rises.', examples: [0, 0.5] }),
  }, { additionalProperties: false, description: 'Draw a connection from every "from" element to every "to" element, skipping an element to itself and any identical connection that already exists (same direction and label). Two elements can have several connections; parallel ones bow apart.' }),
  Type.Object({
    kind: Type.Literal('send'),
    from: SelectorSchema,
    message: Type.String({ minLength: 1, maxLength: 40, description: 'Label of the message to send. Every element the selector picks sends each of its messages with this label along the connection that carries it, so one message can set off the next.', examples: ['archive'] }),
    args: Type.Optional(Type.Record(Type.String({ pattern: FIELD_PATTERN }), Type.String({ maxLength: 60 }), { additionalProperties: false, description: 'Values for the sent message\'s fields, by field name. Each may use this message\'s own $fields, e.g. { "fizz": "$foo" }. Fields not listed are sent empty.', examples: [{ fizz: '$foo' }] })),
  }, { additionalProperties: false, description: 'Make other elements send one of their own messages: a chain reaction. Chains stop after a fixed number of hops so a loop cannot run forever.' }),
], { description: 'One step of what happens when the message reaches the target.' });
export const LIMIT_ACTIONS = 8;
export const LIMIT_CHAIN = 12;

export const MessageSchema = Type.Object({
  id: Id('a message', 'msg-provision'),
  label: Type.String({ minLength: 1, maxLength: 40, description: 'Shown on the send button and on the packet as it travels.', examples: ['provision DB'] }),
  fields: Type.Optional(Type.Array(Type.String({ pattern: FIELD_PATTERN }), { maxItems: 8, uniqueItems: true, description: 'Input fields asked for when the message is sent from its button. Steps refer to them as $name in labels, tags, query text and message names.', examples: [['name', 'env']] })),
  actions: Type.Array(ActionSchema, { minItems: 1, maxItems: LIMIT_ACTIONS, description: 'Steps applied in order when the packet arrives; each sees the stage as the previous step left it (e.g. split, then send a message from the target).' }),
}, { additionalProperties: false, description: 'Something the start element can send along this connection. Sending animates a packet to the end element, then applies its actions.' });
export const LIMIT_MESSAGES = 12;

const ElementRef = (end, example) => Type.String({ pattern: '^[A-Za-z0-9_-]{1,40}$', description: `Id of the element at the ${end} of the line. The line follows that element wherever it goes, including into other bubbles; deleting the element deletes the line.`, examples: [example] });
export const LinkSchema = Type.Object({
  id: Id('a connection', 'ln-ui-identity'),
  from: ElementRef('start', 'el-ui'),
  to: ElementRef('end', 'el-identity'),
  label: Type.String({ maxLength: 60, description: 'Text drawn on a pill at the middle of the line. Empty string for none.', examples: ['signs in'] }),
  head: Type.Union([Type.Literal('none'), Type.Literal('end'), Type.Literal('both')], { description: 'Arrowheads: none (a plain association), end (from → to, a call or data flow), both (two-way).', examples: ['end'] }),
  dash: Type.Union([Type.Literal('solid'), Type.Literal('dashed'), Type.Literal('flow')], { description: 'solid; dashed (weak or optional dependency); flow (dashes that march from → to, for traffic or data moving now).', examples: ['flow'] }),
  tags: Tags('this connection; matching one in the filter lights the line and both of its ends'),
  messages: Type.Array(MessageSchema, { maxItems: LIMIT_MESSAGES, description: 'Messages the start element can send along this line, in button order.' }),
  opacity: Type.Optional(Type.Number({ minimum: 0, maximum: 1, description: 'How solid the line, its arrowheads and its label are drawn: 0 invisible, 1 (the default when absent) fully opaque. Handy for background relationships.', examples: [1, 0.4] })),
  elasticity: Type.Number({ minimum: 0, maximum: 1, description: '0 is a rigid straight line. Above 0 the line acts like a rubber band: it sags, lags and wobbles when its ends move, and tugs its two elements slightly toward each other. Higher is looser.', examples: [0, 0.5] }),
}, { additionalProperties: false, description: 'A line between two elements.' });
export const LIMIT_LINKS = 120;

export const StageSchema = Type.Object({
  grid: Type.Boolean({ description: 'Show the dot grid. Turn it off for a clean backdrop when presenting or taking screenshots.', examples: [true] }),
  color: Type.Union([Type.Null(), Type.String({ pattern: '^#[0-9a-f]{6}$' })], { description: 'Custom backdrop colour as #rrggbb, or null for none. In present mode a slide with none keeps the colour (and opacity) of the nearest earlier slide that set one; set a colour at opacity 0 to go back to the theme background.', examples: [null, '#101828'] }),
  opacity: Type.Number({ minimum: 0, maximum: 1, description: 'How strongly the custom colour covers the theme background: 0 shows the theme background, 1 the colour at full strength. Ignored when color is null.', examples: [1] }),
  description: Type.Optional(Type.String({ maxLength: 4000, description: 'Rich-text notes for this slide, in the same HTML subset as an element description. Absent or empty for none.', examples: ['Next: <a href="https://example.com">rollout plan</a>'] })),
  showDescription: Type.Optional(Type.Boolean({ description: 'In present mode, show the description along the footer while no element with shown notes is clicked. Absent means false.', examples: [true] })),
}, { additionalProperties: false, description: 'Backdrop behind the bubbles, plus the slide notes. Saved with each view, so a talk can change backdrop between slides.' });
export const DEFAULT_STAGE = Object.freeze({ grid: true, color: null, opacity: 1 });

/** The scene a view presents: with no colour of its own it keeps the nearest earlier view's backdrop colour and opacity. */
const carriedStage = (views, i) => views.slice(0, i).findLast((v) => v.scene.stage.color !== null)?.scene.stage;
export function presentedScene(views, id) {
  const i = views.findIndex((v) => v.id === id);
  const scene = views[i].scene, from = carriedStage(views, i);
  if (scene.stage.color !== null || !from) return scene;
  return { ...scene, stage: { ...scene.stage, color: from.color, opacity: from.opacity } };
}
/** The inverse when saving over view `id`: a backdrop that just repeats the carried one is stored as none, so it keeps following earlier slides. */
export function ownedScene(views, id, scene) {
  const i = views.findIndex((v) => v.id === id), from = carriedStage(views, i);
  if (!from || scene.stage.color !== from.color || scene.stage.opacity !== from.opacity) return scene;
  return { ...scene, stage: { ...scene.stage, color: null, opacity: views[i].scene.stage.opacity } };
}

/** What the backdrop is easing toward: custom colour and its strength (0 = theme background), and grid visibility. */
export function stageTarget(stage) {
  return stage.color === null ? { rgb: [0, 0, 0], a: 0, grid: stage.grid ? 1 : 0 } : { rgb: hexRgb(stage.color), a: stage.opacity, grid: stage.grid ? 1 : 0 };
}
/** Pure #rrggbb → [r, g, b] in 0..1; throws on anything else. */
export function hexRgb(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) throw new Error(`bug: not a #rrggbb colour: "${hex}"`);
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export const SceneSchema = Type.Object({
  stage: StageSchema,
  bubbles: Type.Array(BubbleSchema, { maxItems: LIMITS.bubbles, description: 'Bubbles in draw order (later on top).' }),
  elements: Type.Array(ElementSchema, { maxItems: LIMITS.elements, description: 'Elements; their order within a bubble sets their slot order.' }),
  links: Type.Array(LinkSchema, { maxItems: LIMIT_LINKS, description: 'Connections between elements, drawn under the elements and over the membranes.' }),
}, { additionalProperties: false, description: 'Everything on the stage that a view captures, apart from the camera.' });

/**
 * Explicit format migrations for scenes saved by earlier versions of the page:
 *  v2 → v3: connections added (`links`).
 *  v3 → v4: tags added on bubbles, elements and connections (`tags`).
 *  v4 → v5: backdrop settings added (`stage`), defaulting to the grid on the theme background as before.
 *  v5 → v6: messages on connections (`messages`) and an optional own colour on elements (`hue`, null = follow the bubble).
 *  v6 → v7: connect steps in messages gain `elasticity` for the lines they draw (0 = rigid, as before).
 * Only those exact absences are filled in; anything else passes through untouched for the schema to judge.
 */
export function migrateScene(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;
  const addKey = (key, value) => (xs) => (Array.isArray(xs) ? xs.map((x) => (x && typeof x === 'object' && !(key in x) ? { ...x, [key]: value } : x)) : xs);
  const addTags = addKey('tags', []);
  const connectElastic = (l) => (l && typeof l === 'object' && Array.isArray(l.messages)
    ? { ...l, messages: l.messages.map((m) => (m && Array.isArray(m.actions) ? { ...m, actions: m.actions.map((a) => (a && a.kind === 'connect' && !('elasticity' in a) ? { ...a, elasticity: 0 } : a)) } : m)) }
    : l);
  const links = 'links' in raw ? addKey('messages', [])(addTags(raw.links)).map(connectElastic) : [];
  return { ...raw, stage: 'stage' in raw ? raw.stage : { ...DEFAULT_STAGE }, links, bubbles: addTags(raw.bubbles), elements: addKey('hue', null)(addTags(raw.elements)) };
}

// ---------- filter ----------
export const EMPTY_FILTER = Object.freeze({ q: '', tags: Object.freeze([]), icons: Object.freeze([]) });
export const filterActive = (f) => f.q.trim() !== '' || f.tags.length > 0 || f.icons.length > 0;

/** Which elements and bubbles a filter keeps lit; null when no filter is active. Text matches labels, titles, tags and icon names; tag and icon toggles are OR within a group and AND across groups. */
export function filterMatch(scene, f) {
  if (!filterActive(f)) return null;
  const ix = indexOf(scene);
  const q = f.q.trim().toLowerCase();
  const T = new Set(f.tags), I = new Set(f.icons);
  const text = (xs) => !q || xs.some((x) => x.toLowerCase().includes(q));
  const elements = new Set(), bubbles = new Set();
  for (const e of scene.elements) {
    const b = ix.bubbles.get(e.bubbleId);
    const okQ = text([e.label, ...e.tags, ...(e.icon ? [e.icon, ICONS[e.icon][0]] : []), b.title, ...b.tags]);
    const okT = !T.size || [...e.tags, ...b.tags].some((t) => T.has(t));
    const okI = !I.size || (e.icon !== null && I.has(e.icon));
    if (okQ && okT && okI) { elements.add(e.id); bubbles.add(b.id); }
  }
  if (!I.size) {
    for (const b of scene.bubbles) if (text([b.title, ...b.tags]) && (!T.size || b.tags.some((t) => T.has(t)))) bubbles.add(b.id);
  }
  // A connection is lit when both of its ends are, or when it matches on its own label/tags
  // (then its two ends light up with it, so the matched relationship reads in context).
  const links = new Set();
  for (const l of scene.links) {
    if (elements.has(l.from) && elements.has(l.to)) { links.add(l.id); continue; }
    const self = !I.size && text([l.label, ...l.tags]) && (!T.size || l.tags.some((t) => T.has(t))) && (q !== '' || T.size > 0);
    if (self) {
      links.add(l.id);
      for (const eid of [l.from, l.to]) { elements.add(eid); bubbles.add(ix.elements.get(eid).bubbleId); }
    }
  }
  return { elements, bubbles, links };
}
/** Opacity for a body's filter highlight (1 = matched, 0 = filtered out but still faintly visible for context). */
export const litAlpha = (lit) => 0.13 + 0.87 * lit;
export const tagsInScene = (scene) => [...new Set([...scene.bubbles, ...scene.elements, ...scene.links].flatMap((x) => x.tags))].sort();
export const iconsInScene = (scene) => ICON_KEYS.filter((k) => scene.elements.some((e) => e.icon === k));

export const CameraSchema = Type.Object({
  x: Type.Number({ description: 'World x at the centre of the stage.', examples: [0] }),
  y: Type.Number({ description: 'World y at the centre of the stage.', examples: [0] }),
  zoom: Type.Number({ minimum: 0.25, maximum: 3, description: 'Screen px per world unit. Views store it so a talk can zoom in on one ring.', examples: [1] }),
}, { additionalProperties: false });

export const ViewSchema = Type.Object({
  id: Id('a view', 'v-pulled-apart'),
  name: Type.String({ maxLength: 60, description: 'Shown on the view chip and in the presenter HUD; ?view=<id or name> opens it.', examples: ['Pulled apart'] }),
  scene: SceneSchema,
  camera: CameraSchema,
}, { additionalProperties: false, description: 'One saved view (slide): a snapshot of the stage and camera.' });
export const LIMIT_VIEWS = 100;

/** deck.json format version. Bump on a breaking change and teach parseDeck to migrate the old shape. */
export const DECK_VERSION = 1;

export const DeckSchema = Type.Object({
  version: Type.Literal(DECK_VERSION, { description: 'Format version of this file. Files without one are version 1. A newer version than this page knows is refused rather than misread.', examples: [DECK_VERSION] }),
  scene: SceneSchema,
  camera: CameraSchema,
  views: Type.Array(ViewSchema, { maxItems: LIMIT_VIEWS, description: 'Saved views in presenting order.' }),
}, { additionalProperties: false, description: 'A whole deck — the editor stage as last left plus its saved views. This is the deck.json file format.' });

/** The deck a new page starts with. */
export const EMPTY_DECK = Object.freeze({
  version: DECK_VERSION,
  scene: {
    bubbles: [{ id: 'bb-app', title: 'Web app', hue: 'teal', x: 0, y: 0, orbit: null, tags: [] }],
    elements: [
      { id: 'el-ui', bubbleId: 'bb-app', label: 'UI', icon: 'ui', imageId: null, tags: ['frontend'], hue: null },
      { id: 'el-identity', bubbleId: 'bb-app', label: 'Identity', icon: 'user', imageId: null, tags: ['security'], hue: null },
      { id: 'el-storage', bubbleId: 'bb-app', label: 'Storage', icon: 'storage', imageId: null, tags: ['data'], hue: null },
    ],
    links: [],
    stage: { grid: true, color: null, opacity: 1 },
  },
  camera: { x: 0, y: 0, zoom: 1 },
  views: [],
});

/**
 * Validate untrusted deck JSON (a file, a URL, local storage): migrates scenes from older versions, then checks
 * the schema, scene references and view-id uniqueness. Returns the deck or throws a message fit to show the user.
 */
export function parseDeck(raw, what = 'The deck') {
  const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
  if (!isObj(raw)) throw new Error(`${what} is not a JSON object.`);
  const version = raw.version ?? 1; // files saved before versioning are version 1
  if (typeof version === 'number' && version > DECK_VERSION) throw new Error(`${what} was saved by a newer Cell Deck (format version ${version}; this page reads up to ${DECK_VERSION}). Reload to get the latest version.`);
  const migrated = { version, ...raw, scene: migrateScene(raw.scene), views: Array.isArray(raw.views) ? raw.views.map((v) => (isObj(v) ? { ...v, scene: migrateScene(v.scene) } : v)) : raw.views };
  const deck = parseOrThrow(DeckSchema, migrated, what);
  const check = (scene, where) => { try { checkScene(scene); } catch (err) { throw new Error(`${what}: ${where} has broken references: ${err.message}`); } };
  check(deck.scene, 'the stage');
  const ids = new Set();
  for (const v of deck.views) {
    if (ids.has(v.id)) throw new Error(`${what}: two views share the id "${v.id}".`);
    ids.add(v.id);
    check(v.scene, `view "${v.name}"`);
  }
  return deck;
}

export function parseOrThrow(schema, value, what) {
  if (Value.Check(schema, value)) return value;
  const first = [...Value.Errors(schema, value)][0];
  throw new Error(`${what} is malformed at ${first?.path || '/'}: ${first?.message ?? 'unknown error'}`);
}

export class UserError extends Error {}

// ---------- layout ----------
export const K = {
  ELEM_R: 26,          // icon chip radius
  ELEM_BALL: 40,       // metaball radius an element adds to its membrane
  SLOT: 100,           // centre spacing between elements in a bubble
  PAD: 58,             // membrane padding beyond the outermost slot
  TITLE_ONLY_R: 64,
  SINGLE_R: 70,
  BLEND: 34,           // smooth-union radius inside one bubble
  LANE: 46,           // sideways bow between parallel connections joining the same two elements
  DETACH_GAP: 70,      // how far past the membrane an element pulls before it pinches off
  BREAK_GAP: 18,       // gap at which a bud/merge bridge snaps
  RING_GAP: 70,
  DT: 1 / 120,
};

const layoutMemo = new Map();
export function slotLayout(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error(`bug: slotLayout(${n})`);
  const hit = layoutMemo.get(n);
  if (hit) return hit;
  let out;
  if (n === 0) out = { offsets: [], R: K.TITLE_ONLY_R };
  else if (n === 1) out = { offsets: [{ x: 0, y: 0 }], R: K.SINGLE_R };
  else if (n <= 6) {
    const rho = (K.SLOT / 2) / Math.sin(Math.PI / n);
    const start = n === 2 ? Math.PI : -Math.PI / 2;
    out = { offsets: Array.from({ length: n }, (_, i) => ({ x: rho * Math.cos(start + (i * 2 * Math.PI) / n), y: rho * Math.sin(start + (i * 2 * Math.PI) / n) })), R: rho + K.PAD };
  } else {
    const c = K.SLOT * 0.56;
    out = { offsets: Array.from({ length: n }, (_, i) => ({ x: c * Math.sqrt(i + 0.5) * Math.cos(i * 2.39996), y: c * Math.sqrt(i + 0.5) * Math.sin(i * 2.39996) })), R: c * Math.sqrt(n - 0.5) + K.PAD };
  }
  Object.freeze(out);
  layoutMemo.set(n, out);
  return out;
}

const indexMemo = new WeakMap();
export function indexOf(scene) {
  const hit = indexMemo.get(scene);
  if (hit) return hit;
  const bubbles = new Map(scene.bubbles.map((b) => [b.id, b]));
  const elements = new Map(scene.elements.map((e) => [e.id, e]));
  const members = new Map(scene.bubbles.map((b) => [b.id, []]));
  for (const e of scene.elements) {
    const list = members.get(e.bubbleId);
    if (!list) throw new Error(`bug: element ${e.id} points at missing bubble ${e.bubbleId}`);
    list.push(e.id);
  }
  const satellites = new Map();
  for (const b of scene.bubbles) {
    if (b.orbit) {
      if (!bubbles.has(b.orbit.hubId)) throw new Error(`bug: bubble ${b.id} orbits missing hub ${b.orbit.hubId}`);
      satellites.set(b.orbit.hubId, [...(satellites.get(b.orbit.hubId) ?? []), b.id]);
    }
  }
  const links = new Map(scene.links.map((l) => [l.id, l]));
  for (const l of scene.links) {
    if (!elements.has(l.from) || !elements.has(l.to)) throw new Error(`bug: connection ${l.id} points at a missing element`);
  }
  const ix = { bubbles, elements, members, satellites, links };
  indexMemo.set(scene, ix);
  return ix;
}

export function bubbleRadius(scene, id) {
  const m = indexOf(scene).members.get(id);
  if (!m) throw new Error(`bug: bubbleRadius of missing bubble ${id}`);
  return slotLayout(m.length).R;
}

export function slotOffset(scene, elementId) {
  const ix = indexOf(scene);
  const e = ix.elements.get(elementId);
  if (!e) throw new Error(`bug: slotOffset of missing element ${elementId}`);
  const m = ix.members.get(e.bubbleId);
  return slotLayout(m.length).offsets[m.indexOf(elementId)];
}

export function ringRadius(scene, hubId) {
  const sats = indexOf(scene).satellites.get(hubId) ?? [];
  const maxSat = sats.reduce((a, id) => Math.max(a, bubbleRadius(scene, id)), K.SINGLE_R);
  return bubbleRadius(scene, hubId) + maxSat + K.RING_GAP;
}

// ---------- scene reducers ----------
export function checkScene(scene) {
  const ids = new Set();
  for (const x of [...scene.bubbles, ...scene.elements, ...scene.links]) {
    if (ids.has(x.id)) throw new Error(`bug: duplicate id ${x.id}`);
    ids.add(x.id);
  }
  const ix = indexOf(scene); // throws on dangling refs
  for (const b of scene.bubbles) {
    const seen = new Set([b.id]);
    let cur = b.orbit?.hubId;
    while (cur) {
      if (seen.has(cur)) throw new UserError('That would make two bubbles orbit each other.');
      seen.add(cur);
      cur = ix.bubbles.get(cur).orbit?.hubId;
    }
  }
  return scene;
}

const mapBubble = (scene, id, f) => {
  if (!indexOf(scene).bubbles.has(id)) throw new Error(`bug: unknown bubble ${id}`);
  return scene.bubbles.map((b) => (b.id === id ? f(b) : b));
};
const mapElement = (scene, id, f) => {
  if (!indexOf(scene).elements.has(id)) throw new Error(`bug: unknown element ${id}`);
  return scene.elements.map((e) => (e.id === id ? f(e) : e));
};
const dropEmptyUntitled = (scene, bubbleId) => {
  const ix = indexOf(scene);
  const b = ix.bubbles.get(bubbleId);
  if (!b || b.title || ix.members.get(bubbleId).length) return scene;
  return removeBubble(scene, bubbleId);
};
function removeBubble(scene, id) {
  return pruneLinks({
    ...scene,
    bubbles: scene.bubbles.filter((b) => b.id !== id).map((b) => (b.orbit?.hubId === id ? { ...b, orbit: null } : b)),
    elements: scene.elements.filter((e) => e.bubbleId !== id),
    links: scene.links,
  });
}
function pruneLinks(scene) {
  const alive = new Set(scene.elements.map((e) => e.id));
  return { ...scene, links: scene.links.filter((l) => alive.has(l.from) && alive.has(l.to)) };
}
const mapLink = (scene, id, f) => {
  if (!indexOf(scene).links.has(id)) throw new Error(`bug: unknown connection ${id}`);
  return scene.links.map((l) => (l.id === id ? f(l) : l));
};

// ---------- builds: step from one view to the next an element at a time ----------
/** Build order: elements without a creation counter first (deck order), then by counter. */
export function buildOrder(elements) {
  return elements.map((e, i) => [e, i]).sort(([a, i], [b, j]) => ((a.seq ?? 0) - (b.seq ?? 0)) || i - j).map(([e]) => e);
}
const sameItem = (a, b) => JSON.stringify(a.orbit ? { ...a, x: 0, y: 0 } : a) === JSON.stringify(b.orbit ? { ...b, x: 0, y: 0 } : b);

/**
 * Scenes to step through from `from` to `to`, ending exactly at `to`. The first step removes what `to` drops and
 * applies changes to what both share (when there are any); then each element new in `to` arrives on its own step,
 * with its bubble if that is new too. New empty bubbles come last. Connections appear once both ends are present.
 * Returns [to] when there is nothing to add one at a time.
 */
export function buildSteps(from, to) {
  const had = new Set([...from.bubbles, ...from.elements, ...from.links].map((x) => x.id));
  const present = new Set([...to.bubbles, ...to.elements].filter((x) => had.has(x.id)).map((x) => x.id));
  for (const e of to.elements) if (present.has(e.id)) present.add(e.bubbleId);
  const project = () => {
    const bubbles = to.bubbles.filter((b) => present.has(b.id)).map((b) => (b.orbit && !present.has(b.orbit.hubId) ? { ...b, orbit: null } : b));
    const elements = to.elements.filter((e) => present.has(e.id));
    const links = to.links.filter((l) => present.has(l.from) && present.has(l.to));
    return checkScene({ ...to, bubbles, elements, links });
  };
  const units = [
    ...buildOrder(to.elements.filter((e) => !present.has(e.id))).map((e) => [e.bubbleId, e.id]),
    ...to.bubbles.filter((b) => !present.has(b.id) && !to.elements.some((e) => e.bubbleId === b.id)).map((b) => [b.id]),
  ];
  if (!units.length) return [to];
  const fromIx = indexOf(from);
  const first = project();
  const changed = from.bubbles.length + from.elements.length + from.links.length !== first.bubbles.length + first.elements.length + first.links.length
    || JSON.stringify(from.stage) !== JSON.stringify(to.stage)
    || first.bubbles.some((b) => !fromIx.bubbles.has(b.id) || !sameItem(b, fromIx.bubbles.get(b.id)))
    || first.elements.some((e) => !sameItem(e, fromIx.elements.get(e.id)))
    || first.links.some((l) => JSON.stringify(l) !== JSON.stringify(fromIx.links.get(l.id)));
  const steps = changed ? [first] : [];
  for (const ids of units) { for (const id of ids) present.add(id); steps.push(project()); }
  steps[steps.length - 1] = to;
  return steps;
}

/** Next creation counter for a new element in this scene. */
const nextSeq = (scene) => scene.elements.reduce((m, e) => Math.max(m, e.seq ?? 0), 0) + 1;

export function applyCommand(scene, cmd) {
  switch (cmd.type) {
    case 'batch':
      return cmd.cmds.reduce(applyCommand, scene);
    case 'addBubble': {
      if (scene.bubbles.length >= LIMITS.bubbles) throw new UserError(`A stage holds up to ${LIMITS.bubbles} bubbles.`);
      if (scene.elements.length + cmd.elements.length > LIMITS.elements) throw new UserError(`A stage holds up to ${LIMITS.elements} elements.`);
      return checkScene({
        ...scene,
        bubbles: [...scene.bubbles, cmd.bubble],
        elements: [...scene.elements, ...cmd.elements.map((e, i) => ({ ...e, bubbleId: cmd.bubble.id, seq: nextSeq(scene) + i }))],
      });
    }
    case 'addElement': {
      if (scene.elements.length >= LIMITS.elements) throw new UserError(`A stage holds up to ${LIMITS.elements} elements.`);
      if (!indexOf(scene).bubbles.has(cmd.bubbleId)) throw new Error(`bug: unknown bubble ${cmd.bubbleId}`);
      return checkScene({ ...scene, elements: [...scene.elements, { ...cmd.element, bubbleId: cmd.bubbleId, seq: nextSeq(scene) }] });
    }
    case 'duplicateElement': {
      if (scene.elements.length >= LIMITS.elements) throw new UserError(`A stage holds up to ${LIMITS.elements} elements.`);
      const src = indexOf(scene).elements.get(cmd.id);
      if (!src) throw new Error(`bug: unknown element ${cmd.id}`);
      const at = scene.elements.indexOf(src) + 1;
      return checkScene({ ...scene, elements: [...scene.elements.slice(0, at), { ...src, id: cmd.newId, seq: nextSeq(scene) }, ...scene.elements.slice(at)] });
    }
    case 'updateElement':
      return checkScene({ ...scene, elements: mapElement(scene, cmd.id, (e) => ({ ...e, ...cmd.patch })) });
    case 'updateBubble':
      return checkScene({ ...scene, bubbles: mapBubble(scene, cmd.id, (b) => ({ ...b, ...cmd.patch })) });
    case 'deleteElement': {
      const e = indexOf(scene).elements.get(cmd.id);
      if (!e) throw new Error(`bug: unknown element ${cmd.id}`);
      return checkScene(dropEmptyUntitled(pruneLinks({ ...scene, elements: scene.elements.filter((x) => x.id !== cmd.id) }), e.bubbleId));
    }
    case 'addLink': {
      const ix = indexOf(scene);
      if (scene.links.length >= LIMIT_LINKS) throw new UserError(`A stage holds up to ${LIMIT_LINKS} connections.`);
      if (cmd.link.from === cmd.link.to) throw new UserError('Connect two different elements.');
      if (!ix.elements.has(cmd.link.from) || !ix.elements.has(cmd.link.to)) throw new Error('bug: connection to a missing element');
      if (scene.links.some((l) => l.from === cmd.link.from && l.to === cmd.link.to && l.label === cmd.link.label)) throw new UserError(cmd.link.label ? `Those two elements already have a “${cmd.link.label}” connection in that direction.` : 'Those two elements are already connected in that direction. Give the new connection a label to add another.');
      return checkScene({ ...scene, links: [...scene.links, cmd.link] });
    }
    case 'updateLink':
      return checkScene({ ...scene, links: mapLink(scene, cmd.id, (l) => ({ ...l, ...cmd.patch })) });
    case 'deleteLink':
      if (!indexOf(scene).links.has(cmd.id)) throw new Error(`bug: unknown connection ${cmd.id}`);
      return checkScene({ ...scene, links: scene.links.filter((l) => l.id !== cmd.id) });
    case 'deleteBubble':
      if (!indexOf(scene).bubbles.has(cmd.id)) throw new Error(`bug: unknown bubble ${cmd.id}`);
      return checkScene(removeBubble(scene, cmd.id));
    case 'moveElement': {
      const e = indexOf(scene).elements.get(cmd.id);
      if (!e) throw new Error(`bug: unknown element ${cmd.id}`);
      if (!indexOf(scene).bubbles.has(cmd.toBubbleId)) throw new Error(`bug: unknown bubble ${cmd.toBubbleId}`);
      if (e.bubbleId === cmd.toBubbleId) return scene;
      const moved = { ...scene, elements: [...scene.elements.filter((x) => x.id !== cmd.id), { ...e, bubbleId: cmd.toBubbleId }] };
      return checkScene(dropEmptyUntitled(moved, e.bubbleId));
    }
    case 'detachElement': {
      if (scene.bubbles.length >= LIMITS.bubbles) throw new UserError(`A stage holds up to ${LIMITS.bubbles} bubbles.`);
      const withBubble = { ...scene, bubbles: [...scene.bubbles, { id: cmd.newBubbleId, title: '', hue: cmd.hue, x: cmd.x, y: cmd.y, orbit: null, tags: [] }] };
      return checkScene({ ...withBubble, elements: mapElement(withBubble, cmd.id, (e) => ({ ...e, bubbleId: cmd.newBubbleId })) });
    }
    case 'mergeBubble': {
      const ix = indexOf(scene);
      const from = ix.bubbles.get(cmd.fromId);
      if (!from || !ix.bubbles.has(cmd.intoId) || cmd.fromId === cmd.intoId) throw new Error(`bug: bad merge ${cmd.fromId} → ${cmd.intoId}`);
      const titleEl = from.title ? [{ id: cmd.titleElementId, bubbleId: cmd.intoId, label: from.title, icon: null, imageId: null, tags: from.tags, hue: null, seq: nextSeq(scene) }] : [];
      if (scene.elements.length + titleEl.length > LIMITS.elements) throw new UserError(`A stage holds up to ${LIMITS.elements} elements.`);
      const moved = {
        ...scene,
        elements: [...scene.elements.filter((e) => e.bubbleId !== cmd.fromId), ...scene.elements.filter((e) => e.bubbleId === cmd.fromId).map((e) => ({ ...e, bubbleId: cmd.intoId })), ...titleEl],
      };
      return checkScene(removeBubble(moved, cmd.fromId));
    }
    case 'setStage': {
      const stage = { ...scene.stage, ...cmd.patch };
      if (!Value.Check(StageSchema, stage)) throw new Error(`bug: bad stage patch ${JSON.stringify(cmd.patch)}`);
      return { ...scene, stage };
    }
    case 'setHome':
      return checkScene({ ...scene, bubbles: mapBubble(scene, cmd.id, (b) => ({ ...b, x: cmd.x, y: cmd.y })) });
    case 'setOrbit': {
      if (cmd.hubId === cmd.id) throw new UserError('A bubble cannot orbit itself.');
      if (cmd.hubId !== null && !indexOf(scene).bubbles.has(cmd.hubId)) throw new Error(`bug: unknown hub ${cmd.hubId}`);
      return checkScene({ ...scene, bubbles: mapBubble(scene, cmd.id, (b) => ({ ...b, orbit: cmd.hubId === null ? null : { hubId: cmd.hubId } })) });
    }
    default:
      throw new Error(`bug: unknown command ${cmd.type}`);
  }
}

// ---------- runtime (physics state) ----------
export function hashPhase(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) / 4294967296) * Math.PI * 2;
}

const bubbleBody = (b, x, y, r) => ({ id: b.id, x, y, vx: 0, vy: 0, r, vr: 0, w2: 0, v2: 0, w3: 0, v3: 0, phase: hashPhase(b.id), dying: false, followId: null, hue: b.hue, title: b.title, lit: 1 });
const elementBody = (e, x, y, s) => ({ id: e.id, x, y, vx: 0, vy: 0, s, vs: 0, dying: false, lit: 1, bubbleId: e.bubbleId, label: e.label, icon: e.icon, imageId: e.imageId, hue: e.hue, textHue: e.textHue ?? null, strike: !!e.strike, fill: !!e.fill });
const kick = (b, amt) => ({ ...b, v2: b.v2 + amt, v3: b.v3 - amt * 0.7 });
const linkBody = (l, elements, a) => {
  const A = elements[l.from], B = elements[l.to];
  if (!A || !B) throw new Error(`bug: connection ${l.id} has an end without a body`);
  return { id: l.id, from: l.from, to: l.to, label: l.label, head: l.head, dash: l.dash, e: l.elasticity, op: l.opacity ?? 1, cx: (A.x + B.x) / 2, cy: (A.y + B.y) / 2, vx: 0, vy: 0, a, lit: 1, dying: false };
};

export function createRuntime(scene, camera) {
  const bubbles = {};
  for (const b of scene.bubbles) bubbles[b.id] = bubbleBody(b, b.x, b.y, bubbleRadius(scene, b.id));
  const t0 = { bubbles, elements: {}, bridges: [], camera: { ...camera } };
  // Satellites start on their ring so a reload does not replay the bud animation.
  const ot = orbitTargets(scene, t0);
  for (const [id, p] of Object.entries(ot)) bubbles[id] = { ...bubbles[id], x: p.x, y: p.y };
  const elements = {};
  for (const e of scene.elements) {
    const b = bubbles[e.bubbleId];
    const o = slotOffset(scene, e.id);
    elements[e.id] = elementBody(e, b.x + o.x, b.y + o.y, 1);
  }
  const links = Object.fromEntries(scene.links.map((l) => [l.id, linkBody(l, elements, 1)]));
  return { ...t0, bubbles, elements, links, t: 0, stage: stageTarget(scene.stage) };
}

const centroid = (pts) => ({ x: pts.reduce((a, p) => a + p.x, 0) / pts.length, y: pts.reduce((a, p) => a + p.y, 0) / pts.length });
const argmaxCount = (xs) => {
  const c = new Map();
  for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1);
  let best = null, n = 0;
  for (const [k, v] of c) if (v > n) { best = k; n = v; }
  return best;
};

/** Reconcile physics bodies with a new scene. Newborn bubbles bud from where their members are now; removed ones shrink toward where their members went. */
export function syncRuntime(rt, prev, next, hints = { spawnFrom: {} }) {
  const bubbles = { ...rt.bubbles };
  const elements = { ...rt.elements };
  const bridges = [...rt.bridges];
  const nix = indexOf(next);
  const living = (id) => bubbles[id] && !bubbles[id].dying;

  // 1. bubbles that are new (or revived ghosts)
  const spawnAt = {};
  for (const b of next.bubbles) {
    if (living(b.id)) { bubbles[b.id] = { ...bubbles[b.id], hue: b.hue, title: b.title }; continue; }
    if (bubbles[b.id]?.dying) { bubbles[b.id] = { ...bubbles[b.id], dying: false, followId: null, hue: b.hue, title: b.title }; continue; }
    const present = nix.members.get(b.id).filter((eid) => elements[eid] && !elements[eid].dying);
    let pos, parent = null, r0;
    if (present.length) {
      pos = centroid(present.map((eid) => elements[eid]));
      parent = argmaxCount(present.map((eid) => elements[eid].bubbleId).filter(living));
      r0 = K.ELEM_BALL;
    } else if (b.orbit && living(b.orbit.hubId)) {
      const h = bubbles[b.orbit.hubId];
      pos = { x: h.x + (b.x - h.x) * 0.3, y: h.y + (b.y - h.y) * 0.3 };
      parent = b.orbit.hubId;
      r0 = 10;
    } else {
      pos = { x: b.x, y: b.y };
      r0 = 4;
    }
    bubbles[b.id] = kick(bubbleBody(b, pos.x, pos.y, r0), 0.6);
    spawnAt[b.id] = pos;
    if (parent) {
      bridges.push({ a: parent, b: b.id, k: K.BLEND, broken: false });
      bubbles[parent] = kick(bubbles[parent], 0.9);
    }
  }

  // 2. bubbles that are gone become shrinking ghosts
  for (const [id, body] of Object.entries(bubbles)) {
    if (body.dying || nix.bubbles.has(id)) continue;
    const dests = Object.values(elements).filter((e) => e.bubbleId === id && !e.dying && nix.elements.has(e.id)).map((e) => nix.elements.get(e.id).bubbleId);
    const follow = argmaxCount(dests);
    bubbles[id] = { ...body, dying: true, followId: follow };
    if (follow) {
      bridges.push({ a: follow, b: id, k: K.BLEND, broken: false });
      bubbles[follow] = kick(bubbles[follow], 0.9);
    }
  }

  // 3. elements
  for (const e of next.elements) {
    const cur = elements[e.id];
    const srcId = hints.spawnFrom[e.id];
    if (!cur && srcId) {
      const src = elements[srcId];
      if (!src) throw new Error(`bug: duplicate source ${srcId} has no body`);
      elements[e.id] = { ...elementBody(e, src.x + 1, src.y + 1, 0.55), vx: 140, vy: -60 };
      elements[srcId] = { ...src, vx: src.vx - 140, vy: src.vy + 60 };
      if (living(e.bubbleId)) bubbles[e.bubbleId] = kick(bubbles[e.bubbleId], 0.8);
      continue;
    }
    if (!cur || cur.dying) {
      const bp = spawnAt[e.bubbleId] ?? bubbles[e.bubbleId];
      const o = slotOffset(next, e.id);
      elements[e.id] = { ...elementBody(e, bp.x + o.x, bp.y + o.y, 0), ...(cur ? { x: cur.x, y: cur.y, s: cur.s } : {}) };
      continue;
    }
    if (cur.bubbleId !== e.bubbleId && living(e.bubbleId)) bubbles[e.bubbleId] = kick(bubbles[e.bubbleId], 0.7);
    elements[e.id] = { ...cur, bubbleId: e.bubbleId, label: e.label, icon: e.icon, imageId: e.imageId, hue: e.hue, textHue: e.textHue ?? null, strike: !!e.strike, fill: !!e.fill };
  }
  for (const [id, body] of Object.entries(elements)) {
    if (!body.dying && !nix.elements.has(id)) elements[id] = { ...body, dying: true };
  }

  // 4. connections fade in and out
  const links = { ...rt.links };
  for (const l of next.links) {
    const cur = links[l.id];
    const meta = { from: l.from, to: l.to, label: l.label, head: l.head, dash: l.dash, e: l.elasticity, op: l.opacity ?? 1 };
    links[l.id] = cur ? { ...cur, ...meta, dying: false } : linkBody(l, elements, 0);
  }
  for (const [id, body] of Object.entries(links)) {
    if (!body.dying && !nix.links.has(id)) links[id] = { ...body, dying: true };
  }
  return { ...rt, bubbles, elements, bridges, links };
}

/** Even angular spacing of each hub's satellites, keeping their current cyclic order. */
export function orbitTargets(scene, rt) {
  const ix = indexOf(scene);
  const out = {};
  for (const [hubId, sats] of ix.satellites) {
    const hub = rt.bubbles[hubId];
    if (!hub) continue;
    const ring = ringRadius(scene, hubId);
    const withAngle = sats.map((id) => {
      const body = rt.bubbles[id];
      const p = body ?? ix.bubbles.get(id);
      return { id, th: Math.atan2(p.y - hub.y, p.x - hub.x) };
    }).sort((a, b) => a.th - b.th || (a.id < b.id ? -1 : 1));
    const n = withAngle.length;
    const stepA = (Math.PI * 2) / n;
    let sx = 0, sy = 0;
    withAngle.forEach((s, i) => { sx += Math.cos(s.th - i * stepA); sy += Math.sin(s.th - i * stepA); });
    const off = Math.atan2(sy, sx);
    withAngle.forEach((s, i) => { out[s.id] = { x: hub.x + ring * Math.cos(off + i * stepA), y: hub.y + ring * Math.sin(off + i * stepA) }; });
  }
  return out;
}

/** Angle (radians) in the widest gap between a hub's satellites; where a new one should bud. */
export function gapAngle(scene, rt, hubId) {
  const hub = rt.bubbles[hubId];
  if (!hub) throw new Error(`bug: gapAngle for missing hub ${hubId}`);
  const sats = indexOf(scene).satellites.get(hubId) ?? [];
  const ths = sats.map((id) => rt.bubbles[id]).filter(Boolean).map((b) => Math.atan2(b.y - hub.y, b.x - hub.x)).sort((a, b) => a - b);
  if (ths.length === 0) return 0;
  if (ths.length === 1) return ths[0] + Math.PI;
  let best = 0, bestGap = -1;
  ths.forEach((th, i) => {
    const nxt = i === ths.length - 1 ? ths[0] + Math.PI * 2 : ths[i + 1];
    if (nxt - th > bestGap) { bestGap = nxt - th; best = th + (nxt - th) / 2; }
  });
  return best;
}

/** Write current ring positions into the homes of orbiting bubbles so a saved view reproduces the layout. */
export function freezeScene(scene, rt) {
  return { ...scene, bubbles: scene.bubbles.map((b) => (b.orbit && rt.bubbles[b.id] && !rt.bubbles[b.id].dying ? { ...b, x: Math.round(rt.bubbles[b.id].x), y: Math.round(rt.bubbles[b.id].y) } : b)) };
}

export function detachGap(scene, rt, elementId, px, py) {
  const e = rt.elements[elementId];
  if (!e) throw new Error(`bug: detachGap for missing element ${elementId}`);
  const b = rt.bubbles[e.bubbleId];
  return Math.hypot(px - b.x, py - b.y) - bubbleRadius(scene, e.bubbleId);
}

const P = { PULL: 60, LEAN: 22, TUG: 900, KB: 40, CB: 6.5, KE: 160, CE: 11, KR: 180, CR: 10, KS: 220, CS: 16, W2: 15, W3: 20.7, CW: 3.2, EXC: 0.0006, REP: 30, TEN: 14, WMAX: 0.16 };
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Lane of each connection among those joining the same two elements: 0 when alone, else spread ±0.5, ±1, … around the middle. */
const laneMemo = new WeakMap();
export function linkLanes(scene) {
  const hit = laneMemo.get(scene);
  if (hit) return hit;
  const groups = new Map();
  for (const l of scene.links) {
    const k = l.from < l.to ? `${l.from}|${l.to}` : `${l.to}|${l.from}`;
    groups.set(k, [...(groups.get(k) ?? []), l.id]);
  }
  const out = new Map();
  for (const ids of groups.values()) ids.forEach((id, i) => out.set(id, i - (ids.length - 1) / 2));
  laneMemo.set(scene, out);
  return out;
}

/** Advance the simulation by dt seconds. Pure: same inputs, same output. */
export function step(rt, scene, input, dt) {
  const drag = input.drag;
  const ix = indexOf(scene);
  const ot = orbitTargets(scene, rt);
  const ids = Object.keys(rt.bubbles);
  const f = Object.fromEntries(ids.map((id) => [id, { x: 0, y: 0 }]));
  const draggedBubble = drag?.kind === 'bubble' ? drag.id : null;
  const bridged = new Set(rt.bridges.filter((b) => !b.broken).flatMap((b) => [`${b.a}|${b.b}`, `${b.b}|${b.a}`]));

  for (let i = 0; i < ids.length; i++) {
    const A = rt.bubbles[ids[i]];
    if (A.dying || A.id === draggedBubble) continue;
    for (let j = i + 1; j < ids.length; j++) {
      const B = rt.bubbles[ids[j]];
      if (B.dying || B.id === draggedBubble || bridged.has(`${A.id}|${B.id}`)) continue;
      const dx = B.x - A.x, dy = B.y - A.y;
      const d = Math.hypot(dx, dy) || 0.001;
      const overlap = A.r + B.r + 16 - d;
      if (overlap <= 0) continue;
      const push = Math.min(overlap, 60) * P.REP;
      f[A.id].x -= (dx / d) * push; f[A.id].y -= (dy / d) * push;
      f[B.id].x += (dx / d) * push; f[B.id].y += (dy / d) * push;
    }
  }
  // A grabbed connection pulls the bubbles at both ends toward the pointer once it is stretched past
  // the distance each had when grabbed, and makes the end elements lean out of their bubbles.
  const rope = drag?.kind === 'rope' && rt.links[drag.id] ? { id: drag.id, x: drag.x, y: drag.y, rest: drag.rest } : null;
  const ropeTug = {};
  if (rope) {
    const l = rt.links[rope.id];
    for (const eid of [l.from, l.to]) {
      const e = rt.elements[eid];
      if (!e || e.dying) continue;
      const b = rt.bubbles[e.bubbleId];
      if (!b || b.dying) continue;
      const dx = rope.x - b.x, dy = rope.y - b.y, d = Math.hypot(dx, dy) || 1;
      const rest = rope.rest[eid];
      if (rest === undefined) throw new Error(`bug: no rest length for rope end ${eid}`);
      const over = clamp(d - rest, 0, 500);
      f[b.id].x += (dx / d) * over * P.PULL; f[b.id].y += (dy / d) * over * P.PULL;
      const ex = rope.x - e.x, ey = rope.y - e.y, ed = Math.hypot(ex, ey) || 1;
      const lean = Math.min(over, 120) * P.LEAN;
      ropeTug[eid] = { x: (ex / ed) * lean, y: (ey / ed) * lean };
    }
  }
  let tether = null;
  if (drag?.kind === 'element' && drag.tether) {
    const e = rt.elements[drag.id];
    const b = rt.bubbles[e.bubbleId];
    const dx = drag.x - b.x, dy = drag.y - b.y;
    const d = Math.hypot(dx, dy) || 0.001;
    const gap = d - bubbleRadius(scene, e.bubbleId);
    if (gap > 0) {
      const t = Math.min(gap, K.DETACH_GAP) * P.TEN;
      f[b.id].x += (dx / d) * t; f[b.id].y += (dy / d) * t;
    }
    tether = { bubbleId: b.id, elementId: e.id, gap };
  }

  const bubbles = {};
  for (const id of ids) {
    const b = rt.bubbles[id];
    let x, y, vx, vy;
    if (id === draggedBubble) {
      x = drag.x; y = drag.y;
      vx = b.vx + ((x - b.x) / dt - b.vx) * 0.25;
      vy = b.vy + ((y - b.y) / dt - b.vy) * 0.25;
    } else {
      let tx = b.x, ty = b.y;
      if (b.dying) {
        const fb = b.followId && rt.bubbles[b.followId];
        if (fb) { tx = fb.x; ty = fb.y; }
      } else {
        const sb = ix.bubbles.get(id);
        if (!sb) throw new Error(`bug: living body ${id} has no scene bubble`);
        const o = ot[id];
        tx = o ? o.x : sb.x; ty = o ? o.y : sb.y;
      }
      const ax = P.KB * (tx - b.x) - P.CB * b.vx + f[id].x;
      const ay = P.KB * (ty - b.y) - P.CB * b.vy + f[id].y;
      vx = b.vx + ax * dt; vy = b.vy + ay * dt;
      x = b.x + vx * dt; y = b.y + vy * dt;
    }
    const tr = b.dying ? 0 : bubbleRadius(scene, id);
    const vr = b.vr + (P.KR * (tr - b.r) - P.CR * b.vr) * dt;
    const r = Math.max(0, b.r + vr * dt);
    if (b.dying && r < 1.5) continue;
    const dv = Math.hypot(vx - b.vx, vy - b.vy);
    const exc = Math.min(dv * P.EXC, 0.5);
    const v2 = b.v2 + (-P.W2 * P.W2 * b.w2 - P.CW * b.v2) * dt + exc;
    const v3 = b.v3 + (-P.W3 * P.W3 * b.w3 - P.CW * b.v3) * dt - exc * 0.6;
    const litT = !input.match || b.dying || input.match.bubbles.has(id) ? 1 : 0;
    bubbles[id] = { ...b, lit: b.lit + (litT - b.lit) * (1 - Math.exp(-dt * 9)), x, y, vx, vy, r, vr, v2, v3, w2: clamp(b.w2 + v2 * dt, -P.WMAX, P.WMAX), w3: clamp(b.w3 + v3 * dt, -P.WMAX, P.WMAX) };
  }

  // Elastic connections tug their two elements toward each other.
  const tug = {};
  for (const l of Object.values(rt.links)) {
    if (l.dying || l.e <= 0) continue;
    const A = rt.elements[l.from], B = rt.elements[l.to];
    if (!A || !B) continue;
    const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1;
    const m = l.e * P.TUG;
    tug[A.id] = { x: (tug[A.id]?.x ?? 0) + (dx / d) * m, y: (tug[A.id]?.y ?? 0) + (dy / d) * m };
    tug[B.id] = { x: (tug[B.id]?.x ?? 0) - (dx / d) * m, y: (tug[B.id]?.y ?? 0) - (dy / d) * m };
  }

  const elements = {};
  for (const [id, e] of Object.entries(rt.elements)) {
    let x, y, vx, vy;
    if (drag?.kind === 'element' && drag.id === id) {
      x = drag.x; y = drag.y;
      vx = e.vx + ((x - e.x) / dt - e.vx) * 0.25;
      vy = e.vy + ((y - e.y) / dt - e.vy) * 0.25;
    } else {
      let tx = e.x, ty = e.y;
      const host = bubbles[e.bubbleId];
      if (!e.dying) {
        if (!host) throw new Error(`bug: element ${id} lost its bubble ${e.bubbleId}`);
        const o = slotOffset(scene, id);
        tx = host.x + o.x; ty = host.y + o.y;
      } else if (host) {
        tx = host.x; ty = host.y;
      }
      const tg = e.dying ? null : tug[id];
      const rg = e.dying ? null : ropeTug[id];
      vx = e.vx + (P.KE * (tx - e.x) - P.CE * e.vx + (tg ? tg.x : 0) + (rg ? rg.x : 0)) * dt;
      vy = e.vy + (P.KE * (ty - e.y) - P.CE * e.vy + (tg ? tg.y : 0) + (rg ? rg.y : 0)) * dt;
      x = e.x + vx * dt; y = e.y + vy * dt;
    }
    const ts = e.dying ? 0 : 1;
    const vs = e.vs + (P.KS * (ts - e.s) - P.CS * e.vs) * dt;
    const s = Math.max(0, e.s + vs * dt);
    if (e.dying && s < 0.03) continue;
    const litT = !input.match || e.dying || input.match.elements.has(id) ? 1 : 0;
    elements[id] = { ...e, lit: e.lit + (litT - e.lit) * (1 - Math.exp(-dt * 9)), x, y, vx, vy, s, vs };
  }

  const bridges = [];
  for (const br of rt.bridges) {
    const A = bubbles[br.a], B = bubbles[br.b];
    if (!A || !B) continue;
    const gap = Math.hypot(A.x - B.x, A.y - B.y) - A.r - B.r;
    const broken = br.broken || gap > K.BREAK_GAP;
    const k = br.k + ((broken ? 0 : K.BLEND) - br.k) * (1 - Math.exp(-dt * 14));
    if (broken && k < 0.5) continue;
    bridges.push({ ...br, k, broken });
  }

  const ct = input.cameraTarget;
  const a = 1 - Math.exp(-dt * 5);
  const c = rt.camera;
  const camera = { x: c.x + (ct.x - c.x) * a, y: c.y + (ct.y - c.y) * a, zoom: c.zoom * Math.exp(Math.log(ct.zoom / c.zoom) * a) };

  const lanes = linkLanes(scene);
  const links = {};
  for (const [id, l] of Object.entries(rt.links)) {
    const A = elements[l.from], B = elements[l.to];
    if (!A || !B) continue;
    const a = l.a + ((l.dying ? 0 : 1) - l.a) * (1 - Math.exp(-dt * 10));
    if (l.dying && a < 0.02) continue;
    // Parallel connections between the same two elements bow apart, each in its own lane.
    const laneN = lanes.get(id) ?? 0;
    const [P, Q] = l.from < l.to ? [A, B] : [B, A];
    const ux = Q.x - P.x, uy = Q.y - P.y, ul = Math.hypot(ux, uy) || 1;
    const mx = (A.x + B.x) / 2 + (-uy / ul) * laneN * K.LANE, my = (A.y + B.y) / 2 + (ux / ul) * laneN * K.LANE;
    const lit = l.lit + ((!input.match || l.dying || input.match.links.has(id) ? 1 : 0) - l.lit) * (1 - Math.exp(-dt * 9));
    if (rope && rope.id === id) {
      // Grabbed: the curve passes through the pointer (linkGeometry adds the chips' vertical offset back).
      const chipOff = ((A.icon || A.imageId ? -8 : 0) + (B.icon || B.imageId ? -8 : 0)) / 2;
      links[id] = { ...l, a, lit, cx: rope.x, cy: rope.y - chipOff, vx: (rope.x - l.cx) / dt * 0.2, vy: (rope.y - chipOff - l.cy) / dt * 0.2 };
      continue;
    }
    if (l.e <= 0) { links[id] = { ...l, a, lit, cx: mx, cy: my, vx: 0, vy: 0 }; continue; }
    const sag = l.e * Math.hypot(B.x - A.x, B.y - A.y) * 0.14;
    const k = 420 * (1 - l.e) + 14 * l.e;
    const c = 34 * (1 - l.e) + 2.4 * l.e;
    const vx = l.vx + (k * (mx - l.cx) - c * l.vx) * dt;
    const vy = l.vy + (k * (my + sag - l.cy) - c * l.vy) * dt;
    links[id] = { ...l, a, lit, vx, vy, cx: l.cx + vx * dt, cy: l.cy + vy * dt };
  }

  const st = stageTarget(scene.stage);
  const sa = 1 - Math.exp(-dt * 6);
  const stage = {
    // Hold the old colour while fading out, so a custom backdrop dissolves into the theme instead of flashing through black.
    rgb: st.a > 0 ? rt.stage.rgb.map((v, i) => v + (st.rgb[i] - v) * sa) : rt.stage.rgb,
    a: rt.stage.a + (st.a - rt.stage.a) * sa,
    grid: rt.stage.grid + (st.grid - rt.stage.grid) * sa,
  };

  return { bubbles, elements, bridges, camera, tether, links, t: rt.t + dt, stage };
}

/** World-space polyline of a connection, trimmed at both chips, plus its label point and end tangents. Null when an end has no body. */
export function linkGeometry(rt, l) {
  const A = rt.elements[l.from], B = rt.elements[l.to];
  if (!A || !B) return null;
  const chipY = (e) => (e.icon || e.imageId ? -8 : 0);
  const p0 = { x: A.x, y: A.y + chipY(A) }, p2 = { x: B.x, y: B.y + chipY(B) };
  const c = { x: l.cx, y: l.cy + (chipY(A) + chipY(B)) / 2 };
  const q = { x: 2 * c.x - (p0.x + p2.x) / 2, y: 2 * c.y - (p0.y + p2.y) / 2 };
  const at = (t) => ({ x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * q.x + t * t * p2.x, y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * q.y + t * t * p2.y });
  const N = 32;
  const all = Array.from({ length: N + 1 }, (_, i) => at(i / N));
  const ra = (K.ELEM_R + 6) * A.s, rb = (K.ELEM_R + 6) * B.s;
  const pts = all.filter((p) => Math.hypot(p.x - p0.x, p.y - p0.y) > ra && Math.hypot(p.x - p2.x, p.y - p2.y) > rb);
  if (pts.length < 2) return null;
  return { pts, mid: at(0.5) };
}

/** Element ids a connect selector resolves to when the message lands. */
export function resolveSelector(scene, sel, link) {
  switch (sel.kind) {
    case 'source': return [link.from];
    case 'target': return [link.to];
    case 'query': {
      const f = { q: sel.q, tags: sel.tags, icons: sel.icons };
      if (!filterActive(f)) return [];
      // Connections are left out: in the filter a matching connection lights its ends, but a selector wants elements matching on their own.
      const own = filterMatch({ ...scene, links: [] }, f);
      // Unlike the filter bar (any of), a selector wants every tag: system1 + database means system1's databases.
      // An element carries its bubble's tags too.
      const ix = indexOf(scene);
      const hasAll = (e) => sel.tags.every((t) => e.tags.includes(t) || ix.bubbles.get(e.bubbleId).tags.includes(t));
      return scene.elements.filter((e) => own.elements.has(e.id) && hasAll(e)).map((e) => e.id);
    }
    default: throw new Error(`bug: unknown selector kind ${sel.kind}`);
  }
}

/** Short human summary of a message's effect, e.g. "Add “Postgres”". */
export function describeAction(a, scene) {
  const sel = (s) => (s.kind === 'source' ? 'source' : s.kind === 'target' ? 'target'
    : [s.q && `“${s.q}”`, ...s.tags.map((t) => `#${t}`), ...s.icons.map((k) => ICONS[k][0])].filter(Boolean).join(' + ') || 'nothing');
  switch (a.kind) {
    case 'add': return `Add “${a.label}”`;
    case 'split': return `Split ${sel(a.which ?? { kind: 'target' })} out`;
    case 'clone': return `Clone ${sel(a.which ?? { kind: 'target' })}`;
    case 'remove': return `Remove ${sel(a.which ?? { kind: 'target' })}`;
    case 'connect': return `Connect ${sel(a.from)} → ${sel(a.to)}`;
    case 'send': return `Send “${a.message}” from ${sel(a.from)}`;
    default: throw new Error(`bug: unknown action ${a.kind}`);
  }
}
export const describeMessage = (m, scene) => m.actions.map((a) => describeAction(a, scene)).join(', then ');

/** Labels of the messages each of these elements can send, for the editor's "send" picker. */
export function sendableMessages(scene, elementIds) {
  const ix = indexOf(scene);
  const out = new Map(); // label → { senders: Set, fields: Set }
  for (const id of elementIds) {
    if (!ix.elements.has(id)) continue;
    for (const l of scene.links) if (l.from === id) for (const m of l.messages) {
      const o = out.get(m.label) ?? { senders: new Set(), fields: new Set() };
      o.senders.add(ix.elements.get(id).label || 'unnamed');
      for (const f of m.fields ?? []) o.fields.add(f);
      out.set(m.label, o);
    }
  }
  return [...out.entries()].map(([label, o]) => ({ label, senders: [...o.senders], fields: [...o.fields] })).sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * What one action does, given the stage as earlier actions of the same message left it.
 * Returns { cmd | null, hints, sends } or throws a UserError saying why it has nothing to do.
 */
/** The action with this message's field values filled into its text; throws a UserError when a result is unusable. */
export function fillAction(a, values) {
  const t = (s) => fillText(s, values);
  const tags = (list) => [...new Set(list.map((x) => t(x).toLowerCase().trim().replace(/\s+/g, ' ')).filter(Boolean))].map((tag) => {
    if (!new RegExp(TAG_PATTERN).test(tag)) throw new UserError(`“${tag}” is not a usable tag (up to 24 letters, digits, spaces, - and _).`);
    return tag;
  });
  const sel = (x) => (x.kind === 'query' ? { ...x, q: t(x.q).slice(0, 60), tags: tags(x.tags) } : x);
  switch (a.kind) {
    case 'add': {
      const label = t(a.label).trim().slice(0, 60);
      if (!label) throw new UserError(`the new element's label (“${a.label}”) came out empty.`);
      return { ...a, label, tags: tags(a.tags) };
    }
    case 'connect': return { ...a, from: sel(a.from), to: sel(a.to), label: t(a.label).slice(0, 60) };
    case 'remove': case 'split': case 'clone': return a.which ? { ...a, which: sel(a.which) } : a;
    case 'send': return { ...a, from: sel(a.from), message: t(a.message), args: Object.fromEntries(Object.entries(a.args ?? {}).map(([k, v]) => [k, t(v)])) };
    default: return a;
  }
}

function actionCommand(scene, rt, link, msg, template, seed, values) {
  const ix = indexOf(scene);
  let a;
  try { a = fillAction(template, values); } catch (err) { if (err instanceof UserError) err.message = `“${msg.label}”: ${err.message}`; throw err; }
  const id = (n) => `${seed}-${n}`;
  const none = { spawnFrom: {} };
  const target = ix.elements.get(link.to);
  const needTarget = () => { if (!target) throw new UserError(`“${msg.label}”: the target was removed by an earlier step, so “${describeAction(a, scene)}” was skipped.`); return target; };
  /** Element ids a split/clone/remove step acts on: the target, or what its query matches now. */
  const picked = () => {
    if (a.which?.kind !== 'query') return [needTarget().id];
    const ids = resolveSelector(scene, a.which, link).filter((x) => ix.elements.has(x));
    if (!ids.length) throw new UserError(`“${msg.label}”: nothing matched ${describeAction(a, scene).replace(/^\S+ /, '').replace(/ out$/, '')} to ${a.kind === 'split' ? 'split out' : a.kind}.`);
    return ids;
  };
  switch (a.kind) {
    case 'add': {
      const t = needTarget();
      if (scene.elements.length >= LIMITS.elements) throw new UserError(`“${msg.label}”: the stage already has ${LIMITS.elements} elements.`);
      return { cmd: { type: 'addElement', bubbleId: t.bubbleId, element: { id: id(0), label: a.label, icon: a.icon, imageId: null, tags: a.tags, hue: a.hue } }, hints: { spawnFrom: { [id(0)]: t.id } }, sends: [] };
    }
    case 'clone': {
      const ids = picked();
      if (scene.elements.length + ids.length > LIMITS.elements) throw new UserError(`“${msg.label}”: cloning ${ids.length} would pass the stage's limit of ${LIMITS.elements} elements.`);
      return { cmd: { type: 'batch', cmds: ids.map((x, i) => ({ type: 'duplicateElement', id: x, newId: id(i) })) }, hints: { spawnFrom: Object.fromEntries(ids.map((x, i) => [id(i), x])) }, sends: [] };
    }
    case 'remove':
      return { cmd: { type: 'batch', cmds: picked().map((x) => ({ type: 'deleteElement', id: x })) }, hints: none, sends: [] };
    case 'split': {
      // Each element flies out away from the sender; several from one bubble fan out a little so they don't stack.
      const ids = picked();
      const src = rt.elements[link.from];
      let cur = scene;
      const cmds = [], alone = [];
      ids.forEach((x, k) => {
        const cix = indexOf(cur);
        const e = cix.elements.get(x), b = cix.bubbles.get(e.bubbleId);
        if (cix.members.get(b.id).length < 2 && !b.title) { alone.push(e.label || 'the target'); return; }
        const el = rt.elements[x], hb = rt.bubbles[b.id];
        if (!el || !hb) throw new Error('bug: split element has no body');
        const dx = src ? el.x - src.x : 1, dy = src ? el.y - src.y : 0, d = Math.hypot(dx, dy);
        const ang = (d > 1 ? Math.atan2(dy, dx) : 0) + (k - (ids.length - 1) / 2) * 0.35;
        const dist = bubbleRadius(cur, b.id) + K.SINGLE_R + 90;
        const cmd = { type: 'detachElement', id: x, newBubbleId: id(k), x: Math.round(hb.x + Math.cos(ang) * dist), y: Math.round(hb.y + Math.sin(ang) * dist), hue: HUES[cur.bubbles.length % HUES.length] };
        cur = applyCommand(cur, cmd);
        cmds.push(cmd);
      });
      if (!cmds.length) throw new UserError(`“${msg.label}”: ${alone.join(', ')} ${alone.length > 1 ? 'are' : 'is'} already in a bubble of ${alone.length > 1 ? 'their' : 'its'} own.`);
      return { cmd: { type: 'batch', cmds }, hints: none, sends: [] };
    }
    case 'connect': {
      const live = (ids) => ids.filter((x) => ix.elements.has(x));
      const froms = live(resolveSelector(scene, a.from, link)), tos = live(resolveSelector(scene, a.to, link));
      const key = (f, t) => `${f}|${t}|${a.label}`;
      const have = new Set(scene.links.map((l) => `${l.from}|${l.to}|${l.label}`));
      const pairs = [];
      for (const f of froms) for (const t of tos) {
        if (f === t || have.has(key(f, t))) continue;
        have.add(key(f, t));
        pairs.push([f, t]);
      }
      if (!pairs.length) throw new UserError(`“${msg.label}” found nothing new to connect (${describeAction(a, scene)}${a.label ? `, labelled “${a.label}”` : ''}): every pair already has that connection.${a.label ? '' : ' Give the new line a label in this step to add one alongside the existing line.'}`);
      if (scene.links.length + pairs.length > LIMIT_LINKS) throw new UserError(`“${msg.label}” would make ${pairs.length} connections, more than the stage's limit of ${LIMIT_LINKS}.`);
      return { cmd: { type: 'batch', cmds: pairs.map(([f, t], i) => ({ type: 'addLink', link: { id: id(i), from: f, to: t, label: a.label, head: a.head, dash: a.dash, elasticity: a.elasticity, tags: [], messages: [] } })) }, hints: none, sends: [] };
    }
    case 'send': {
      const froms = new Set(resolveSelector(scene, a.from, link).filter((x) => ix.elements.has(x)));
      // Each sent message gets its own fields from this step's mapping (by name); unmapped fields are empty.
      const sends = scene.links.filter((l) => froms.has(l.from)).flatMap((l) => l.messages.filter((m) => m.label === a.message).map((m) => ({ linkId: l.id, messageId: m.id, values: Object.fromEntries((m.fields ?? []).map((f) => [f, a.args?.[f] ?? ''])) })));
      if (!sends.length) throw new UserError(`“${msg.label}”: nothing could send “${a.message}” (${describeAction(a, scene)}).`);
      return { cmd: null, hints: none, sends };
    }
    default:
      throw new Error(`bug: unknown message action ${a.kind}`);
  }
}

/**
 * Everything a message does when it arrives: its actions applied in order, each on the stage the previous left.
 * Pure: positions come from rt, new ids are derived from seed. Returns
 * { cmd, hints, sends: [{ linkId, messageId }] (messages to launch next), notes: [why a step was skipped] };
 * throws a UserError when no step had anything to do.
 */
export function messageCommand(scene, rt, linkId, messageId, seed, values = {}) {
  const link = indexOf(scene).links.get(linkId);
  if (!link) throw new UserError('The connection was removed before the message arrived.');
  const msg = link.messages.find((m) => m.id === messageId);
  if (!msg) throw new UserError('The message was deleted before it arrived.');
  const vals = Object.fromEntries((msg.fields ?? []).map((f) => [f, String(values[f] ?? '')]));
  let cur = scene;
  const cmds = [], sends = [], notes = [];
  const spawnFrom = {};
  msg.actions.forEach((a, i) => {
    try {
      const r = actionCommand(cur, rt, link, msg, a, `${seed}${i}`, vals);
      if (r.cmd) { cur = applyCommand(cur, r.cmd); cmds.push(r.cmd); }
      Object.assign(spawnFrom, r.hints.spawnFrom);
      sends.push(...r.sends);
    } catch (err) {
      if (!(err instanceof UserError)) throw err;
      notes.push(err.message);
    }
  });
  if (!cmds.length && !sends.length) throw new UserError(notes.join(' '));
  return { cmd: { type: 'batch', cmds }, hints: { spawnFrom }, sends, notes };
}

/** Point a fraction p (0..1) of the way along a polyline, by length. */
export function pointAlong(pts, p) {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q.x - pts[i].x, q.y - pts[i].y));
  const total = segs.reduce((x, y) => x + y, 0);
  let want = clamp(p, 0, 1) * total;
  for (let i = 0; i < segs.length; i++) {
    if (want <= segs[i] || i === segs.length - 1) {
      const t = segs[i] ? want / segs[i] : 0;
      return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t, total };
    }
    want -= segs[i];
  }
  throw new Error('bug: pointAlong on an empty polyline');
}

/** Topmost thing under a world point: an element chip first, then the smallest bubble containing it. */
export function hitTest(rt, scene, wx, wy) {
  const ix = indexOf(scene);
  let best = null, bestD = Infinity;
  for (const e of Object.values(rt.elements)) {
    if (e.dying || !ix.elements.has(e.id)) continue;
    const d = Math.hypot(wx - e.x, wy - e.y);
    if (d < 36 && d < bestD) { best = { kind: 'element', id: e.id }; bestD = d; }
  }
  if (best) return best;
  const tol = 9 / rt.camera.zoom;
  for (const l of Object.values(rt.links)) {
    if (l.dying || !ix.links.has(l.id)) continue;
    const g = linkGeometry(rt, l);
    if (!g) continue;
    if (Math.hypot(wx - g.mid.x, wy - g.mid.y) < 18 / rt.camera.zoom) return { kind: 'link', id: l.id };
    for (let i = 1; i < g.pts.length; i++) {
      if (segDist(wx, wy, g.pts[i - 1], g.pts[i]) < tol) return { kind: 'link', id: l.id };
    }
  }
  return bubbleAt(rt, scene, wx, wy, null);
}
function segDist(px, py, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const L = dx * dx + dy * dy || 1;
  const t = clamp(((px - a.x) * dx + (py - a.y) * dy) / L, 0, 1);
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
}

export function elementAt(rt, scene, wx, wy, excludeId) {
  const ix = indexOf(scene);
  let best = null, bestD = 36;
  for (const e of Object.values(rt.elements)) {
    if (e.dying || e.id === excludeId || !ix.elements.has(e.id)) continue;
    const d = Math.hypot(wx - e.x, wy - e.y);
    if (d < bestD) { best = e.id; bestD = d; }
  }
  return best;
}

export function bubbleAt(rt, scene, wx, wy, excludeId) {
  const ix = indexOf(scene);
  let best = null, bestR = Infinity;
  for (const b of Object.values(rt.bubbles)) {
    if (b.dying || b.id === excludeId || !ix.bubbles.has(b.id)) continue;
    if (Math.hypot(wx - b.x, wy - b.y) < b.r && b.r < bestR) { best = { kind: 'bubble', id: b.id }; bestR = b.r; }
  }
  return best;
}
// === CORE END ===
