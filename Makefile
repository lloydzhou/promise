
VERSION ?= 2.4.8
COMPRESSOR ?= yuicompressor-$(VERSION).jar
COMMAND ?= java -jar ./$(COMPRESSOR)

all: promise http concat

install:
	test -f $(COMPRESSOR) || wget https://github.com/yui/yuicompressor/releases/download/v$(VERSION)/$(COMPRESSOR)

promise: install
	$(COMMAND) promise.js > promise.min.js

http: install
	$(COMMAND) http.js > http.min.js

concat: install
	head -n -2 promise.js > promise.all.js
	tail -n +2 http.js >> promise.all.js
	$(COMMAND) promise.all.js > promise.all.min.js

