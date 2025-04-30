'use client';

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { getAnalysisHistory, deleteAnalysis, updateAnalysis, AnalysisHistoryItem } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

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

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const token = await getToken({ template: 'supabase' });
      if (!token) throw new Error('No token available');
      
      console.log('Loading history for user:', user?.id);
      console.log('Got token from Clerk:', token ? 'Yes' : 'No');
      
      const data = await getAnalysisHistory(token);
      setHistory(data);
      setError(null);
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) throw new Error('No token available');
      
      console.log('Deleting analysis with token:', token ? 'Yes' : 'No');
      await deleteAnalysis(id, token);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting analysis:', err);
      setError('Failed to delete analysis');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) throw new Error('No token available');
      
      console.log('Updating analysis with token:', token ? 'Yes' : 'No');
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
    <div className="p-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search analyses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border p-2"
            aria-label="Search analyses"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'context')}
            className="rounded-md border p-2"
            aria-label="Sort by"
          >
            <option value="date">Sort by Date</option>
            <option value="context">Sort by Context</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {sortedHistory.length === 0 ? (
        <div className="text-center">No analysis history found.</div>
      ) : (
        <div className="space-y-4">
          {sortedHistory.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="mb-2 flex justify-between">
                <div className="text-sm text-gray-500">
                  {format(new Date(item.created_at), 'PPP p')}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditAnalysis(item.analysis);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="mb-2">
                <h3 className="font-semibold">Context:</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div>
                    <span className="font-medium">Frontend:</span> {item.context.frontend}
                  </div>
                  <div>
                    <span className="font-medium">Backend:</span> {item.context.backend}
                  </div>
                  <div>
                    <span className="font-medium">Platform:</span> {item.context.platform}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <h3 className="font-semibold">Logs:</h3>
                <pre className="whitespace-pre-wrap rounded bg-gray-100 p-2 text-sm">
                  {item.logs}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold">Analysis:</h3>
                {editingId === item.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editAnalysis}
                      onChange={(e) => setEditAnalysis(e.target.value)}
                      className="w-full rounded-md border p-2"
                      rows={10}
                      aria-label="Edit analysis"
                      placeholder="Enter your analysis here..."
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-md bg-gray-500 px-4 py-2 text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(item.id)}
                        className="rounded-md bg-blue-500 px-4 py-2 text-white"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <ReactMarkdown>{item.analysis}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 