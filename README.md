# Cell Deck

Bubble diagrams you pull apart, connect and present as a sequence of saved views.

**[▶ Open Cell Deck](https://aaronp.github.io/celldeck/)** ·
[Example deck](https://aaronp.github.io/celldeck/?src=examples/acme-architecture/deck.json&view=v-pulled-apart)

## Layout

| Path | What |
|---|---|
| `index.html` | The page: styles, markup, rendering and input (the "edge"). No build step. |
| `lib/core.js` | Pure core: data model (TypeBox schemas, incl. the `deck.json` format), scene reducers, physics. |
| `lib/store.js` | `createDeckStore(storage, key)`: CRUD over a deck (stage + views), validated on every write, backed by `localStorage` (or `memoryStorage()`). |
| `examples/` | Data-only repos that open in this viewer. Copy one with `make clone` from its folder. |
| `test/` | `npm test` (Node's built-in runner). |

## Data

A deck is one JSON file: `{ version, scene, camera, views: [{ id, name, scene, camera }] }`. See
`DeckSchema` in `lib/core.js`. `version` is the format version (currently `1`; a file without one is
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
