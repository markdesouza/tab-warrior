.PHONY: build

build: 
	yarn build

lint: 
	yarn eslint src/.

dist:
	test -d dist || mkdir dist

chrome: build dist
	zip -r dist/chrome.zip build/

firefox: build dist
	web-ext build -s build -a dist/firefox --overwrite-dest

safari: build dist
	xcrun safari-web-extension-converter build --project-location dist/safari --app-name "Tab Warrior" --bundle-identifier "com.tabwarrior.tabwarrior" --copy-resources --macos-only

clean:
	rm -rf build dist node_modules

prereq:
	npm install --global web-ext
	yarn install
