const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface AnalyzeRequest {
  repoUrl: string;
  context?: string;
}

export interface AnalyzeResponse {
  jobId: string;
  status: string;
  message: string;
}

export interface StatusResponse {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: {
    name: string;
    percentage: number;
    currentFile?: string;
  };
  error?: string;
}

export interface DocumentationResponse {
  jobId: string;
  markdown: string;
  metadata: {
    filesAnalyzed: number;
    functionsFound: number;
    classesFound: number;
    endpointsDetected: number;
  };
}

export const apiService = {
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Backend not available');
    return response.json();
  },

  async analyzeRepository(data: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    return response.json();
  },

  async checkStatus(jobId: string): Promise<StatusResponse> {
    const response = await fetch(`${API_BASE_URL}/status/${jobId}`);
    if (!response.ok) throw new Error('Failed to fetch status');
    return response.json();
  },

  async getDocumentation(jobId: string): Promise<DocumentationResponse> {
    const response = await fetch(`${API_BASE_URL}/documentation/${jobId}`);
    if (!response.ok) throw new Error('Failed to fetch documentation');
    return response.json();
  },

  async downloadDocumentation(jobId: string) {
    const response = await fetch(`${API_BASE_URL}/download/${jobId}`);
    if (!response.ok) throw new Error('Download failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documentation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};
