import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { apiService, type StatusResponse } from "@/services/api";
import Button from "@/components/common/Button";

const GeneratePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<'starting' | 'processing' | 'completed' | 'failed'>('starting');
  const [progress, setProgress] = useState<StatusResponse['progress']>({ 
    name: 'Initializing...', 
    percentage: 0 
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repoUrl = searchParams.get('url');
    const context = searchParams.get('context');

    if (!repoUrl) {
      navigate('/');
      return;
    }

    startAnalysis(repoUrl, context || undefined);
  }, [searchParams, navigate]);

  const startAnalysis = async (repoUrl: string, context?: string) => {
    try {
      // Check backend health first
      await apiService.checkHealth();

      // Start analysis
      const response = await apiService.analyzeRepository({ repoUrl, context });
      setJobId(response.jobId);
      setStatus('processing');

      // Poll for status every 2 seconds
      const interval = setInterval(async () => {
        try {
          const statusData = await apiService.checkStatus(response.jobId);
          
          setProgress(statusData.progress);

          if (statusData.status === 'completed') {
            clearInterval(interval);
            setStatus('completed');
            // Wait 1 second then navigate to preview
            setTimeout(() => {
              navigate(`/preview/${response.jobId}`);
            }, 1000);
          } else if (statusData.status === 'failed') {
            clearInterval(interval);
            setStatus('failed');
            setError(statusData.error || 'Analysis failed');
          }
        } catch (err: any) {
          clearInterval(interval);
          setStatus('failed');
          setError(err.message);
        }
      }, 2000);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    } catch (err: any) {
      setStatus('failed');
      setError(err.message || 'Failed to start analysis. Make sure the backend server and Ollama are running.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-card rounded-2xl shadow-apple-lg p-8">
          {/* Failed State */}
          {status === 'failed' ? (
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-2xl font-semibold mb-4">Analysis Failed</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="space-y-2 text-sm text-left bg-muted p-4 rounded-lg mb-6">
                <p className="font-semibold">Troubleshooting:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Ensure Ollama is running: <code className="text-xs bg-background px-2 py-1 rounded">ollama serve</code></li>
                  <li>Ensure backend is running: <code className="text-xs bg-background px-2 py-1 rounded">npm start</code> in codedocs-backend</li>
                  <li>Check backend health: <code className="text-xs bg-background px-2 py-1 rounded">http://localhost:3001/api/health</code></li>
                </ul>
              </div>
              <Button onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          ) : status === 'completed' ? (
            /* Success State */
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
              </motion.div>
              <h2 className="text-2xl font-semibold mb-2">Documentation Ready!</h2>
              <p className="text-muted-foreground">Redirecting to preview...</p>
            </div>
          ) : (
            /* Processing State */
            <div>
              <h2 className="text-2xl font-semibold mb-8 text-center">
                Generating Documentation
              </h2>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{progress.name}</span>
                  <span className="text-sm text-muted-foreground">{progress.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
                {progress.currentFile && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground mt-2 font-mono"
                  >
                    Processing: {progress.currentFile}
                  </motion.p>
                )}
              </div>

              {/* Stage Checklist */}
              <div className="space-y-3">
                {[
                  { name: 'Cloning Repository', pct: 10 },
                  { name: 'Fetching Files', pct: 25 },
                  { name: 'Analyzing Code Structure', pct: 50 },
                  { name: 'Extracting Functions & Classes', pct: 65 },
                  { name: 'Generating Summaries', pct: 80 },
                  { name: 'Formatting Markdown', pct: 95 }
                ].map((stage) => {
                  const isCompleted = progress.percentage >= stage.pct;
                  const isCurrent = progress.percentage >= stage.pct - 15 && progress.percentage < stage.pct;
                  
                  return (
                    <motion.div
                      key={stage.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted flex-shrink-0" />
                      )}
                      <span 
                        className={`text-sm transition-colors ${
                          isCompleted 
                            ? 'text-foreground font-medium' 
                            : isCurrent 
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {stage.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Estimated Time */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  This usually takes 1-3 minutes depending on repository size
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GeneratePage;
