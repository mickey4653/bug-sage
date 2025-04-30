'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { getAnalysisHistory, deleteAnalysis, updateAnalysis, AnalysisHistoryItem } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

export default function AnalysisHistory() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'context'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAnalysis, setEditAnalysis] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken({ template: 'supabase-bugsage' });
      if (!token) throw new Error('No token available');
      
      const data = await getAnalysisHistory(token);
      setHistory(data);
      setError(null);
    } catch {
      setError('Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken({ template: 'supabase-bugsage' });
      if (!token) throw new Error('No token available');
      
      await deleteAnalysis(id, token);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting analysis:', err);
      setError('Failed to delete analysis');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = await getToken({ template: 'supabase-bugsage' });
      if (!token) throw new Error('No token available');
      
      await updateAnalysis(id, editAnalysis, token);
      setHistory(history.map(item => 
        item.id === id ? { ...item, analysis: editAnalysis } : item
      ));
      setEditingId(null);
    } catch (err) {
      console.error('Error updating analysis:', err);
      setError('Failed to update analysis');
    }
  };

  const handleExport = () => {
    // Convert history to CSV format
    const headers = ['Date', 'Frontend', 'Backend', 'Platform', 'Logs', 'Analysis'];
    const csvContent = [
      headers.join(','),
      ...sortedHistory.map(item => [
        format(new Date(item.created_at), 'yyyy-MM-dd HH:mm:ss'),
        `"${item.context.frontend.replace(/"/g, '""')}"`,
        `"${item.context.backend.replace(/"/g, '""')}"`,
        `"${item.context.platform.replace(/"/g, '""')}"`,
        `"${item.logs.replace(/"/g, '""')}"`,
        `"${item.analysis.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bugsage-analysis-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.logs.toLowerCase().includes(searchLower) ||
      item.analysis.toLowerCase().includes(searchLower) ||
      item.context.frontend.toLowerCase().includes(searchLower) ||
      item.context.backend.toLowerCase().includes(searchLower) ||
      item.context.platform.toLowerCase().includes(searchLower)
    );
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return sortOrder === 'asc'
        ? a.context.frontend.localeCompare(b.context.frontend)
        : b.context.frontend.localeCompare(a.context.frontend);
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHistory = sortedHistory.slice(startIndex, endIndex);

  if (!user) {
    return <div className="p-4 text-center">Please sign in to view your analysis history.</div>;
  }

  if (loading) {
    return <div className="p-4 text-center">Loading history...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-amber-100/80 to-amber-200/80 p-4 text-amber-800/90">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-amber-500/90 via-amber-600/90 to-amber-700/90 bg-clip-text text-transparent">
            Analysis History
          </h1>
          <p className="text-amber-600/90">Review and manage your past analyses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-amber-200/50 bg-white/90 p-3 pl-10 text-amber-800/90 placeholder-amber-400/70 focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
                aria-label="Search analyses"
              />
              <motion.svg
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </motion.svg>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400/90 to-amber-500/90 px-4 py-2 text-white/90 shadow-sm transition-all hover:shadow-amber-200/50"
              aria-label="Export analyses"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </motion.button>
            <motion.select
              whileHover={{ scale: 1.02 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'context')}
              className="rounded-lg border border-amber-200/50 bg-white/90 p-2 text-amber-800/90 focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
              aria-label="Sort by"
            >
              <option value="date">Sort by Date</option>
              <option value="context">Sort by Context</option>
            </motion.select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="rounded-lg border border-amber-200/50 bg-white/90 p-2 text-amber-800/90 transition-colors hover:border-amber-300/50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </motion.button>
          </motion.div>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="h-32 animate-pulse rounded-lg bg-amber-100/50"
              />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-red-100/90 p-4 text-center text-red-700/90"
          >
            {error}
          </motion.div>
        ) : sortedHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-white/90 p-8 text-center shadow-sm"
          >
            <motion.svg
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto h-12 w-12 text-amber-400/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </motion.svg>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 text-amber-600/90"
            >
              No analysis history found.
            </motion.p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {paginatedHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group rounded-lg border border-amber-200/50 bg-white/90 p-6 shadow-sm transition-all hover:border-amber-300/50 hover:bg-white"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mb-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="h-2 w-2 rounded-full bg-amber-500/70"
                      />
                      <span className="text-sm text-amber-600/90">
                        {format(new Date(item.created_at), 'PPP p')}
                      </span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="flex gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingId(item.id);
                          setEditAnalysis(item.analysis);
                        }}
                        className="rounded-lg bg-amber-100/90 px-3 py-1 text-sm text-amber-700/90 transition-colors hover:bg-amber-200/90"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg bg-red-100/90 px-3 py-1 text-sm text-red-700/90 transition-colors hover:bg-red-200/90"
                      >
                        Delete
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="mb-4 grid gap-4 sm:grid-cols-3"
                  >
                    <div className="rounded-lg bg-amber-50/30 p-3">
                      <h3 className="mb-1 text-sm font-medium text-amber-600/90">Frontend</h3>
                      <p className="text-amber-800/90">{item.context.frontend}</p>
                    </div>
                    <div className="rounded-lg bg-amber-50/30 p-3">
                      <h3 className="mb-1 text-sm font-medium text-amber-600/90">Backend</h3>
                      <p className="text-amber-800/90">{item.context.backend}</p>
                    </div>
                    <div className="rounded-lg bg-amber-50/30 p-3">
                      <h3 className="mb-1 text-sm font-medium text-amber-600/90">Platform</h3>
                      <p className="text-amber-800/90">{item.context.platform}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <h3 className="mb-2 text-sm font-medium text-amber-600/90">Logs</h3>
                    <pre className="rounded-lg bg-amber-50/30 p-3 text-sm text-amber-800/90 overflow-x-auto whitespace-pre-wrap break-words max-h-96">
                      {item.logs}
                    </pre>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <h3 className="mb-2 text-sm font-medium text-amber-600/90">Analysis</h3>
                    {editingId === item.id ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <textarea
                          value={editAnalysis}
                          onChange={(e) => setEditAnalysis(e.target.value)}
                          className="w-full rounded-lg border border-amber-200/50 bg-white/90 p-3 text-amber-800/90 focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-200/50"
                          rows={6}
                          aria-label="Edit analysis"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="flex justify-end gap-2"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingId(null)}
                            className="rounded-lg bg-amber-100/90 px-4 py-2 text-amber-700/90 transition-colors hover:bg-amber-200/90"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdate(item.id)}
                            className="rounded-lg bg-amber-500/90 px-4 py-2 text-white/90 transition-colors hover:bg-amber-600/90"
                          >
                            Save
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <div className="prose prose-amber max-w-none rounded-lg bg-amber-50/30 p-4 overflow-x-auto whitespace-pre-wrap break-words max-h-96">
                        <ReactMarkdown>{item.analysis}</ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && sortedHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 flex items-center justify-between"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-sm text-amber-600/90"
            >
              Showing {startIndex + 1} to {Math.min(endIndex, sortedHistory.length)} of{' '}
              {sortedHistory.length} analyses
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                  }
                }}
                disabled={currentPage === 1}
                className="rounded-lg border border-amber-200/50 bg-white/90 px-4 py-2 text-amber-800/90 transition-colors hover:border-amber-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(prev => prev + 1);
                  }
                }}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-amber-200/50 bg-white/90 px-4 py-2 text-amber-800/90 transition-colors hover:border-amber-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 