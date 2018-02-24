fetchContributors() {
  node ./bin/contributors.js
}

setupGit() {
  echo "Adding Travis CI as the Git user..."
  git config --global user.email "builds@pburtchaell.com"
  git config --global user.name "Travis CI"

  echo "Adding Git remote..."
  git remote add origin-travis https://${GITHUB_TOKEN}@github.com/pburtchaell/redux-promise-middleware.git > /dev/null 2>&1
}

commitFiles() {
  # Use Travis default environment variables to get the branch name
  # See more: https://docs.travis-ci.com/user/environment-variables/
  if git diff-index --quiet HEAD; then
    echo "Checking out the branch ${TRAVIS_BRANCH}..."
    git checkout ${TRAVIS_BRANCH}
    git add CONTRIBUTORS.md
    git commit --message "Update CONTRIBUTORS.md" --no-verify > /dev/null 2>&1
    uploadFiles
  fi
}

uploadFiles() {
  echo "Uploading commit to GitHub..."
  git push --quiet origin-travis ${TRAVIS_BRANCH}
}

if [ -n "${TRAVIS_PULL_REQUEST}" ]; then
  fetchContributors
  setupGit
  commitFiles
fi
