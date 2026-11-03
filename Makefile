PORT ?= 8000

.PHONY: dev test
node_modules: package-lock.json
	npm ci
	@touch node_modules

test: node_modules
	npm test

# No build step: serve the repo as GitHub Pages does, so ?src=examples/... works.
dev:
	@echo "Example: http://localhost:$(PORT)/?src=examples/acme-architecture/deck.json&view=v-pulled-apart"
	python3 -m http.server $(PORT)
