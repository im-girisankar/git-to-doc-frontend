import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GeneratePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get("url");

  useEffect(() => {
    if (!url) {
      navigate("/");
    }
  }, [url, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-display mb-4">Generating Documentation...</h1>
        <p className="text-muted-foreground">
          Analyzing repository: <span className="font-mono text-sm">{url}</span>
        </p>
        <div className="mt-8">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </motion.div>
    </div>
  );
};

export default GeneratePage;
