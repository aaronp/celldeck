PORT ?= 8000

.PHONY: dev test schema dist publish bump-patch bump-minor bump-major
node_modules: package-lock.json
	npm ci
	@touch node_modules

test: node_modules
	npm test

# deck.schema.json: DeckSchema from lib/core.js as JSON Schema (a test checks it is up to date)
schema: node_modules
	node -e "import('./lib/core.js').then(m=>process.stdout.write(JSON.stringify(m.DeckSchema,null,2)+'\\n'))" > deck.schema.json

# Packs the `celldeck` CLI into pritzlaff-celldeck-<version>.tgz (install with: npm i -D ./pritzlaff-celldeck-*.tgz)
dist: test
	npm pack

# Bumps package.json, commits and tags v<version> (needs a clean tree)
bump-patch bump-minor bump-major:
	npm version $(@:bump-%=%)

# Publishes @pritzlaff/celldeck to npm. Bump first: make bump-patch|bump-minor|bump-major
publish: test
	npm publish

# No build step: Vite serves the repo as-is (so ?src=examples/... works) and reloads on save.
# Dev only: Vite resolves @sinclair/typebox from node_modules instead of index.html's CDN import map.
dev: node_modules
	@echo "Example: http://localhost:$(PORT)/?src=examples/acme-architecture/deck.json&view=v-pulled-apart"
	bunx vite@7 --port $(PORT) --strictPort
