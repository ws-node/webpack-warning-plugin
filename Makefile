install:
	yarn

build:
	rm -rf dist
	yarn build
	cp README.md dist/

rc: build
	TS_NODE_PROJECT=tsconfig.build.json npx ts-node ./scripts/publish.rc.ts

publish: build
	TS_NODE_PROJECT=tsconfig.build.json npx ts-node ./scripts/publish.ts