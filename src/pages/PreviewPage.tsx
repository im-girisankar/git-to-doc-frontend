import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Copy, CheckCircle, Loader2, Home } from "lucide-react";
import { apiService, type DocumentationResponse } from "@/services/api";
import Button from "@/components/common/Button";

const PreviewPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState("");
  const [metadata, setMetadata] = useState<DocumentationResponse['metadata'] | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      navigate('/');
      return;
    }

    loadDocumentation();
  }, [jobId]);

  const loadDocumentation = async () => {
    try {
      const data = await apiService.getDocumentation(jobId!);
      setMarkdown(data.markdown);
      setMetadata(data.metadata);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load documentation');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    apiService.downloadDocumentation(jobId!);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Failed to Load Documentation</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Documentation Generated</h1>
            {metadata && (
              <p className="text-muted-foreground">
                {metadata.filesAnalyzed} files • {metadata.functionsFound} functions • {metadata.endpointsDetected} endpoints
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              New Doc
            </Button>
            <Button variant="secondary" onClick={handleCopy}>
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download .md
            </Button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-apple-lg p-8 md:p-12"
        >
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {/* Render markdown as formatted text */}
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {markdown}
            </pre>
          </div>
        </motion.div>

        {/* Footer Stats */}
        {metadata && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{metadata.filesAnalyzed}</div>
              <div className="text-xs text-muted-foreground mt-1">Files Analyzed</div>
            </div>
            <div className="bg-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{metadata.functionsFound}</div>
              <div className="text-xs text-muted-foreground mt-1">Functions Found</div>
            </div>
            <div className="bg-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{metadata.classesFound}</div>
              <div className="text-xs text-muted-foreground mt-1">Classes Found</div>
            </div>
            <div className="bg-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{metadata.endpointsDetected}</div>
              <div className="text-xs text-muted-foreground mt-1">API Endpoints</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
