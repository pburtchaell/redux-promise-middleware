#!/bin/bash

# Description: run tests normally, for local testing
# Param 1: the reporter to use, defaults to spec
runTests()
{
  `npm bin`/mocha -b \
  --compilers js:babel-core/register \
  --reporter ${1-spec} \
  test/setup.js test/*.js examples/**/*.spec.js
}

# Description: run tests with Istanbul coverage
runIstanbul()
{
  NODE_ENV=test `npm bin`/istanbul cover \
  `npm bin`/_mocha \
  -- -u exports --compilers js:babel-core/register \
  --report lcovonly \
  test/setup.js test/*.js examples/**/*.spec.js
}

# If on Travis, run tests with Istanbul
if [ -n "${TRAVIS_JOB_ID}" ]; then
  echo "Running tests with Istanbul..."
  NODE_ENV=test runIstanbul

  echo "Sending coverage information to Coveralls..."
  cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js || true \
  > /dev/null 2>&1
  rm -rf ./coverage
else
  NODE_ENV=test runTests ${REPORTER}
fi
