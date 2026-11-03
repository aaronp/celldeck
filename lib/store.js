// Deck store: CRUD over one deck (stage + views), kept as JSON under one key of a Storage
// (window.localStorage, or memoryStorage() for a deck opened from ?src= that must not overwrite local work).
// Every write is validated with parseDeck before it is stored, so storage never holds a deck the page can't load.
// Synchronous; a failed write (e.g. quota) throws and leaves the deck unchanged.
import { EMPTY_DECK, parseDeck } from './core.js';

/** A Storage-shaped Map, for decks that live only as long as the page. */
export function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => { m.set(k, String(v)); }, removeItem: (k) => { m.delete(k); } };
}

/**
 * @param storage  getItem/setItem, e.g. localStorage
 * @param key      where the deck lives in storage
 * @param initial  deck to store when the key is empty (default: EMPTY_DECK)
 * Throws if the stored deck is malformed (it is left in place, not overwritten).
 */
export function createDeckStore(storage, key, initial = EMPTY_DECK) {
  const raw = storage.getItem(key);
  let deck = raw === null ? parseDeck(structuredClone(initial)) : parseDeck(JSON.parse(raw), 'The deck saved in this browser');
  if (raw === null) storage.setItem(key, JSON.stringify(deck));
  const listeners = new Set();

  const commit = (next) => {
    const ok = parseDeck(next);
    storage.setItem(key, JSON.stringify(ok));
    deck = ok;
    listeners.forEach((f) => f(deck));
    return deck;
  };
  const indexOfView = (id) => {
    const i = deck.views.findIndex((v) => v.id === id);
    if (i < 0) throw new Error(`No view with id "${id}".`);
    return i;
  };
  const withViews = (views) => commit({ ...deck, views });

  return {
    /** The whole deck: { scene, camera, views }. */
    get: () => deck,
    /** Replace everything (opening a file). */
    replace: (next) => commit(next),
    /** Autosave of the editor stage. */
    saveStage: ({ scene, camera }) => commit({ ...deck, scene, camera }),

    listViews: () => deck.views,
    /** Find by id, else by name (case-insensitive); null if neither matches. */
    findView: (idOrName) => {
      const n = String(idOrName).trim().toLowerCase();
      return deck.views.find((v) => v.id === idOrName) ?? deck.views.find((v) => v.name.trim().toLowerCase() === n) ?? null;
    },
    createView: (view) => {
      if (deck.views.some((v) => v.id === view.id)) throw new Error(`A view with id "${view.id}" already exists.`);
      return withViews([...deck.views, view]);
    },
    /** patch: any of { name, scene, camera }. */
    updateView: (id, patch) => {
      const i = indexOfView(id);
      return withViews(deck.views.map((v, j) => (j === i ? { ...v, ...patch, id } : v)));
    },
    deleteView: (id) => {
      indexOfView(id);
      return withViews(deck.views.filter((v) => v.id !== id));
    },
    /** Move a view earlier (dir -1) or later (+1); a no-op at either end. */
    moveView: (id, dir) => {
      const i = indexOfView(id), j = i + dir;
      if (j < 0 || j >= deck.views.length) return deck;
      const views = [...deck.views];
      [views[i], views[j]] = [views[j], views[i]];
      return withViews(views);
    },

    /** Called with the new deck after every write; returns an unsubscribe function. */
    subscribe: (f) => { listeners.add(f); return () => listeners.delete(f); },
  };
}
