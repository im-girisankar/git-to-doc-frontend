import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { validateGitHubUrl } from "@/utils/validation";

const LandingPage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [validation, setValidation] = useState<ReturnType<typeof validateGitHubUrl> | null>(null);
  const [touched, setTouched] = useState(false);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) {
      const result = validateGitHubUrl(value);
      setValidation(result);
    } else {
      setValidation(null);
    }
  };

  const handleGenerate = () => {
    if (validation?.isValid) {
      navigate(`/generate?url=${encodeURIComponent(url)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && validation?.isValid) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl text-center"
      >
        {/* Hero Section */}
        <motion.h1
          className="text-hero font-bold mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Transform Code into Documentation, Instantly
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Paste any GitHub repository URL and get comprehensive Markdown documentation in seconds. Powered by AI.
        </motion.p>

        {/* Input Section */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="w-full max-w-2xl mx-auto">
            <Input
              icon={<Github className="w-5 h-5" />}
              placeholder="https://github.com/username/repository"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyPress={handleKeyPress}
              error={touched && validation && !validation.isValid ? validation.error : undefined}
              success={validation?.isValid}
              className="text-base shadow-apple-md"
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerate}
              disabled={!validation?.isValid}
              className="w-full max-w-xs mx-auto"
            >
              Generate Documentation
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            {
              title: "AI-Powered Analysis",
              description: "Automatically extracts functions, classes, and API endpoints",
            },
            {
              title: "Markdown Output",
              description: "Clean, professional documentation ready to use",
            },
            {
              title: "Instant Results",
              description: "Get comprehensive docs in seconds, not hours",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-2xl bg-card shadow-apple-sm hover:shadow-apple-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
