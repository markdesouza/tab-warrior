.PHONY: build

build:
	yarn build

dist:
	test -d dist || mkdir dist

chrome: build dist
	zip -r dist/chrome.zip build/

firefox: build dist
	web-ext build -s build -a dist --overwrite-dest

safari: build 
	xcrun safari-web-extension-converter build --project-location safari

clean:
	rm -rf build dist node_modules

prereq:
	npm install --global web-ext
	yarn install