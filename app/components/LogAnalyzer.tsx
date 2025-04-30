'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ErrorBoundary from './ErrorBoundary';
import { useUser, useAuth } from '@clerk/nextjs';
import { saveAnalysis } from '../lib/supabase';

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

  const analyzeLog = async () => {
    try {
      if (!user) {
        setError({ message: 'Please sign in to analyze logs' });
        return;
      }

      setLoading(true);
      setError(null);
      setAnalysis(null);

      const token = await getToken({ template: 'supabase' });
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
        await saveAnalysis(
          user.id,
          logs,
          {
            frontend,
            backend,
            platform,
          },
          data.analysis,
          token
        );
        console.log('Analysis saved successfully');
      } catch (saveError) {
        console.error('Error saving analysis:', saveError);
        // Don't throw the error, just log it
        // The analysis was still successful, we just couldn't save it
      }
    } catch (err) {
      console.error('Error analyzing logs:', err);
      setError({
        message: err instanceof Error ? err.message : 'Failed to analyze logs',
        code: 'ANALYSIS_ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Context Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="frontend-framework" className="block text-sm font-medium text-gray-700 mb-1">
              Frontend Framework
            </label>
            <select
              id="frontend-framework"
              className="border rounded p-2 w-full"
              value={frontend}
              onChange={(e) => setFrontend(e.target.value)}
            >
              <option value="">Select Frontend Framework</option>
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="angular">Angular</option>
              <option value="nextjs">Next.js</option>
            </select>
          </div>

          <div>
            <label htmlFor="backend-technology" className="block text-sm font-medium text-gray-700 mb-1">
              Backend Technology
            </label>
            <select
              id="backend-technology"
              className="border rounded p-2 w-full"
              value={backend}
              onChange={(e) => setBackend(e.target.value)}
            >
              <option value="">Select Backend Technology</option>
              <option value="nodejs">Node.js</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="dotnet">.NET</option>
            </select>
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              id="platform"
              className="border rounded p-2 w-full"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">Select Platform</option>
              <option value="aws">AWS</option>
              <option value="gcp">Google Cloud</option>
              <option value="azure">Azure</option>
              <option value="vercel">Vercel</option>
            </select>
          </div>
        </div>

        {/* Log Input */}
        <div>
          <label htmlFor="log-input" className="block text-sm font-medium text-gray-700 mb-1">
            Log Input
          </label>
          <textarea
            id="log-input"
            className="w-full h-64 p-4 border rounded font-mono text-sm"
            placeholder="Paste your logs here..."
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error.message}</p>
          </div>
        )}

        {/* Analyze Button */}
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={analyzeLog}
          disabled={loading || !logs.trim()}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Logs'
          )}
        </button>

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="prose max-w-none">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
} 