# Cell Deck

Bubble diagrams you pull apart, connect and present as a sequence of saved views.

**[▶ Open Cell Deck](https://aaronp.github.io/celldeck/)** ·
[Example deck](https://aaronp.github.io/celldeck/?src=examples/acme-architecture/deck.json&view=v-pulled-apart)

## Adding it to your project

From your project's root (Bun shown; `npm i -D`, `npm pkg set` and `npm run` work the same):

```sh
bun add -d @pritzlaff/celldeck
bun pm pkg set scripts.celldeck="celldeck docs/overview/deck.json"
bun run celldeck    # creates the deck if it's missing, serves it on localhost (loopback only) and opens it
```

The File menu's **Save to deck.json** writes the deck back to the file; commit it like any other source.
`PORT=…` fixes the port and `NO_OPEN=1` skips opening a browser, as for the other tools.

A deck is JSON rather than markdown, so it's edited in the viewer, not by hand. Its format is
**[deck.schema.json](deck.schema.json)** (JSON Schema, every field documented), also published at
<https://aaronp.github.io/celldeck/deck.schema.json> and shipped in the package as
`node_modules/@pritzlaff/celldeck/deck.schema.json`, so people and agents working in your repo can
read and check the version they run. [examples/acme-architecture/deck.json](examples/acme-architecture/deck.json)
is a complete deck. Cell Deck has no `card`/`badge` command yet;
[aaronp/template](https://github.com/aaronp/template) writes the deck's card itself
(`scripts/deck-card.ts`) and shows it beside its sibling tools (goals, architecture, decisions, risks,
schedule, delivery) on one dashboard.

## Layout

| Path | What |
|---|---|
| `index.html` | The page: styles, markup, rendering and input (the "edge"). No build step. |
| `lib/core.js` | Pure core: data model (TypeBox schemas, incl. the `deck.json` format), scene reducers, physics. |
| `lib/store.js` | `createDeckStore(storage, key)`: CRUD over a deck (stage + views), validated on every write, backed by `localStorage` (or `memoryStorage()`). |
| `examples/` | Data-only repos that open in this viewer. Copy one with `make clone` from its folder. |
| `test/` | `npm test` (Node's built-in runner). |
| `deck.schema.json` | The `deck.json` format as JSON Schema, from `DeckSchema` (`make schema`; a test checks it's current). |

## Data

A deck is one JSON file: `{ version, scene, camera, views: [{ id, name, scene, camera }] }`. See
[deck.schema.json](deck.schema.json), generated from `DeckSchema` in `lib/core.js` by `make schema`. `version` is the format version (currently `1`; a file without one is
read as `1`). A file with a newer version than the page knows is refused rather than misread. Edits are saved in your browser. Use **Download** to save
`deck.json`, and **Open** to load one from a file (drag-and-drop or pick it) or from a URL.

## Links

| Param | Effect |
|---|---|
| `?src=<url>` | open that `deck.json` (relative or absolute; another host must allow CORS). It is not saved in your browser, so a shared link never overwrites your work. |
| `?view=<id or name>` | open that saved view. The address bar follows as you switch views. |
| `?present` | start in present mode |

## Develop

```sh
make dev    # serves the repo on :8000 (python3); open the printed example URL
make test
```

Pushing to `main`/`master` runs the tests, then publishes to GitHub Pages
(Settings → Pages → Source: **GitHub Actions**).
