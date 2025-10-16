export interface Repository {
  id: string;
  name: string;
  url: string;
  description: string;
  language: string;
  generatedAt: string;
}

export interface Documentation {
  id: string;
  repositoryId: string;
  markdown: string;
  metadata: {
    filesAnalyzed: number;
    functionsFound: number;
    classesFound: number;
    endpointsDetected: number;
  };
}

export interface GitHubUrlValidation {
  isValid: boolean;
  owner?: string;
  repo?: string;
  error?: string;
}
