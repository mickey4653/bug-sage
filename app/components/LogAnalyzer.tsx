'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useUser, useAuth } from '@clerk/nextjs';
import { saveAnalysis } from '../lib/supabase';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface AnalysisError {
  message: string;
  code?: string;
}

export default function LogAnalyzer() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [logs, setLogs] = useState('');
  const [frontend, setFrontend] = useState('');
  const [backend, setBackend] = useState('');
  const [platform, setPlatform] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AnalysisError | null>(null);

  const resetForm = () => {
    setLogs('');
    setFrontend('');
    setBackend('');
    setPlatform('');
    setAnalysis(null);
    setError(null);
  };

  const analyzeLog = async () => {
    try {
      if (!user) {
        setError({ message: 'Please sign in to analyze logs' });
        return;
      }

      setLoading(true);
      setError(null);
      setAnalysis(null);

      const token = await getToken({ template: 'supabase-bugsage' });
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logs,
          context: {
            frontend: frontend,
            backend: backend,
            platform: platform,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze logs');
      }

      const data = await response.json();
      setAnalysis(data.analysis);

      // Save the analysis to history
      try {
        const saveToken = await getToken({ template: 'supabase-bugsage' });
        if (!saveToken) {
          throw new Error('Failed to get authentication token for saving');
        }

        await saveAnalysis(
          user.id,
          logs,
          {
            frontend,
            backend,
            platform,
          },
          data.analysis,
          saveToken
        );
        toast.success('Analysis saved successfully!');
      } catch {
        toast.error('Failed to save analysis to history');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze logs';
      setError({
        message: errorMessage,
        code: 'ANALYSIS_ERROR'
      });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-amber-100/80 to-amber-200/80 p-4 text-amber-800/90">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-white/90 text-amber-800/90',
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            color: 'rgba(146, 64, 14, 0.9)',
          },
          success: {
            className: 'bg-green-100/90 text-green-800/90',
            style: {
              background: 'rgba(220, 252, 231, 0.9)',
              color: 'rgba(22, 101, 52, 0.9)',
            },
          },
          error: {
            className: 'bg-red-100/90 text-red-800/90',
            style: {
              background: 'rgba(254, 226, 226, 0.9)',
              color: 'rgba(185, 28, 28, 0.9)',
            },
          },
        }}
      />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-amber-500/90 via-amber-600/90 to-amber-700/90 bg-clip-text text-transparent">
            Log Analyzer
          </h1>
          <p className="text-amber-600/90">Upload your logs for AI-powered analysis</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg border border-amber-200/50 bg-white/90 p-6 shadow-sm backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6"
          >
            <label className="mb-2 block text-sm font-medium text-amber-600/90">
              Context Information
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="mb-1 block text-sm text-amber-600/90">Frontend</label>
                <select
                  value={frontend}
                  onChange={(e) => setFrontend(e.target.value)}
                  className="w-full rounded-lg border border-amber-200/50 bg-white/90 p-3 text-amber-800/90 focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
                  aria-label="Select frontend framework"
                >
                  <option value="">Select Frontend Framework</option>
                  <option value="react">React</option>
                  <option value="vue">Vue</option>
                  <option value="angular">Angular</option>
                  <option value="nextjs">Next.js</option>
                </select>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label className="mb-1 block text-sm text-amber-600/90">Backend</label>
                <select
                  value={backend}
                  onChange={(e) => setBackend(e.target.value)}
                  className="w-full rounded-lg border border-amber-200/50 bg-white/90 p-3 text-amber-800/90 focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
                  aria-label="Select backend technology"
                >
                  <option value="">Select Backend Technology</option>
                  <option value="nodejs">Node.js</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="dotnet">.NET</option>
                </select>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label className="mb-1 block text-sm text-amber-600/90">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-lg border border-amber-200/50 bg-white/90 p-3 text-amber-800/90 focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
                  aria-label="Select platform"
                >
                  <option value="">Select Platform</option>
                  <option value="aws">AWS</option>
                  <option value="gcp">Google Cloud</option>
                  <option value="azure">Azure</option>
                  <option value="vercel">Vercel</option>
                </select>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-6"
          >
            <label className="mb-2 block text-sm font-medium text-amber-600/90">
              Logs
            </label>
            <textarea
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              placeholder="Paste your logs here..."
              rows={10}
              className="w-full rounded-lg border border-amber-200/50 bg-white/90 p-3 text-amber-800/90 placeholder-amber-400/70 focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={analyzeLog}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400/90 to-amber-500/90 px-6 py-3 text-white/90 shadow-sm transition-all hover:shadow-amber-200/50 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </motion.div>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
              {loading ? 'Analyzing...' : 'Analyze Logs'}
            </motion.button>
          </motion.div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-lg bg-red-100/90 p-4 text-center text-red-700/90"
          >
            {error.message}
          </motion.div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 rounded-lg border border-amber-200/50 bg-white/90 p-6 shadow-sm backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4 flex items-center justify-between"
            >
              <h2 className="text-xl font-semibold text-amber-700/90">Analysis Results</h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetForm}
                  className="flex items-center gap-2 rounded-lg bg-amber-100/90 px-4 py-2 text-sm text-amber-600/90 transition-colors hover:bg-amber-200/90"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  New Analysis
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={analyzeLog}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-amber-500/90 px-4 py-2 text-sm text-white/90 transition-colors hover:bg-amber-600/90"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </motion.div>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {loading ? 'Analyzing...' : 'Re-analyze'}
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="prose prose-amber max-w-none rounded-lg bg-amber-50/30 p-4 overflow-x-auto whitespace-pre-wrap break-words"
            >
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 