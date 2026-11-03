# Acme — architecture deck

**[▶ View the deck](https://aaronp.github.io/celldeck-example/)**

The data lives in [`deck.json`](deck.json). The viewer comes from
[aaronp/celldeck](https://github.com/aaronp/celldeck).

## Using this as a template

1. Create an empty repo on GitHub, then from this directory run
   `make clone REPO=you/your-repo` (or `./clone.sh`, which prompts).
   It copies the files to `../your-repo`, points the View link above at
   your Pages site and sets the git remote.
2. Edit the deck in the viewer (Open → choose your `deck.json`), then
   Download and replace `deck.json`. Commit and push.
3. On GitHub: Settings → Pages → Source: **GitHub Actions**.
4. Optional: on the repo page, open About (⚙) → tick **Use your GitHub Pages
   website** so the link also shows in the sidebar.

The workflow deploys from `main` or `master`. "Branch … is not allowed to
deploy to github-pages"? Add your branch under Settings → Environments →
github-pages → Deployment branches and tags.

## Links

Your site redirects to the viewer with `?src=` pointing at your `deck.json`.
Query params you add are passed on:

| Param | Effect |
|---|---|
| `?view=<id or name>` | open that saved view, e.g. `?view=v-pulled-apart` or `?view=Pulled%20apart` |
| `?present` | start in present mode (→ / ← step through views) |

No Pages? Link straight to the raw file:
`https://aaronp.github.io/celldeck/?src=https://raw.githubusercontent.com/<you>/<repo>/<branch>/deck.json`
