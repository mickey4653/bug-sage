'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function LogAnalyzer() {
  const [logs, setLogs] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({
    frontend: '',
    backend: '',
    platform: '',
  });

  const analyzeLog = async () => {
    if (!logs.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing logs:', error);
      setAnalysis('Error analyzing logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
            value={context.frontend}
            onChange={(e) => setContext({ ...context, frontend: e.target.value })}
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
            value={context.backend}
            onChange={(e) => setContext({ ...context, backend: e.target.value })}
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
            value={context.platform}
            onChange={(e) => setContext({ ...context, platform: e.target.value })}
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

      {/* Analyze Button */}
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={analyzeLog}
        disabled={loading || !logs.trim()}
      >
        {loading ? 'Analyzing...' : 'Analyze Logs'}
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
  );
} 