import { GitHubUrlValidation } from "@/types";

export function validateGitHubUrl(url: string): GitHubUrlValidation {
  if (!url || url.trim() === "") {
    return { isValid: false, error: "URL cannot be empty" };
  }

  // GitHub URL pattern: https://github.com/owner/repo
  const githubPattern = /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/?$/;
  const match = url.match(githubPattern);

  if (!match) {
    return { 
      isValid: false, 
      error: "Please enter a valid GitHub repository URL" 
    };
  }

  const owner = match[2];
  const repo = match[3].replace(/\.git$/, ""); // Remove .git suffix if present

  return {
    isValid: true,
    owner,
    repo,
  };
}
