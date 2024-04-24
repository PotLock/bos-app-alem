export default function validateGithubRepoUrl(url: string) {
  // Regular expression to match the GitHub repository URL pattern
  // This regex checks for optional "www.", a required "github.com/", and then captures the username and repo name segments
  const githubRepoUrlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+\/?$/;
  return githubRepoUrlPattern.test(url);
}
