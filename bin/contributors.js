const contributorsFromGitHub = require('github-contributors');
const fs = require('fs');

// The repository to pull data from
const REPO = 'pburtchaell/redux-promise-middleware';

const OPTIONS = {
  id: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET,
};

// Get the contributors from GitHub API and generate a Markdown file
contributorsFromGitHub(REPO, OPTIONS, (githubError, data) => {
  if (githubError) {
    throw githubError;
  }

  // Format the Markdown file
  function formatFile(contributors) {
    let file = '# Contributors\n\n';

    contributors.forEach((contributor) => {
      file += `- [${contributor.login}](${contributor.html_url})\n`;
    });

    return file;
  }

  // Write the Markdown file
  fs.writeFile('./CONTRIBUTORS.md', formatFile(data), (fsError) => {
    if (fsError) {
      throw fsError;
    }
  });
});
