PORT ?= 8000

.PHONY: dev test dist publish bump-patch bump-minor bump-major
node_modules: package-lock.json
	npm ci
	@touch node_modules

test: node_modules
	npm test

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
