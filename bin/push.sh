fetchContributors() {
  node ./bin/contributors.js
}

setupGit() {
  echo "Adding Patrick Burtchaell as a Git user..."
  git config --global user.email "patrick@pburtchaell.com"
  git config --global user.name "Patrick Burtchaell"
}

commitFiles() {
  # Use Travis default environment variables to get the branch name
  # See more: https://docs.travis-ci.com/user/environment-variables/
  git checkout master
  git branch -d ${TRAVIS_PULL_REQUEST_BRANCH}
  git checkout -b ${TRAVIS_PULL_REQUEST_BRANCH}
  git add CONTRIBUTORS.md
  git commit --message "Update CONTRIBUTORS.md" --no-verify > /dev/null 2>&1
}

uploadFiles() {
  echo "Uploading commit to GitHub..."
  git remote add origin-travis https://${GITHUB_TOKEN}@github.com/pburtchaell/redux-promise-middleware.git > /dev/null 2>&1

  git push --quiet --force origin-travis ${TRAVIS_PULL_REQUEST_BRANCH}
}

if [ -n "${TRAVIS_PULL_REQUEST}" ]; then
  fetchContributors
  setupGit
  commitFiles
  uploadFiles
fi
