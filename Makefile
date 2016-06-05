REPORTER = spec

test:
	@NODE_ENV=test `npm bin`/mocha -b \
	--compilers js:babel-core/register \
	--reporter $(REPORTER) \
	test/polyfills.js test/*.js

test_coverage:
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@$(MAKE) test
	@NODE_ENV=test `npm bin`/istanbul cover \
	`npm bin`/_mocha \
	-- -u exports --compilers js:babel-core/register \
	--report lcovonly \
	test/polyfills.js test/*.js && \
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js || true \
	&& rm -rf ./coverage

.PHONY: test
