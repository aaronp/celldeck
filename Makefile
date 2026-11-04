PORT ?= 8000

.PHONY: dev test
node_modules: package-lock.json
	npm ci
	@touch node_modules

test: node_modules
	npm test

# No build step: Vite serves the repo as-is (so ?src=examples/... works) and reloads on save.
# Dev only: Vite resolves @sinclair/typebox from node_modules instead of index.html's CDN import map.
dev: node_modules
	@echo "Example: http://localhost:$(PORT)/?src=examples/acme-architecture/deck.json&view=v-pulled-apart"
	bunx vite@7 --port $(PORT) --strictPort
