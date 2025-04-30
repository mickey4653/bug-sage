import { createSupabaseClient, saveAnalysis, getAnalysisHistory, deleteAnalysis, updateAnalysis } from '../supabase';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

// Mock Clerk auth
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(),
}));

describe('Supabase Functions', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    returns: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    (auth as jest.Mock).mockReturnValue({
      getToken: jest.fn().mockResolvedValue('server-token'),
    });

    // Setup method chaining
    mockSupabase.from.mockReturnValue(mockSupabase);
    mockSupabase.insert.mockReturnValue(mockSupabase);
    mockSupabase.select.mockReturnValue(mockSupabase);
    mockSupabase.order.mockReturnValue(mockSupabase);
    mockSupabase.delete.mockReturnValue(mockSupabase);
    mockSupabase.eq.mockReturnValue(mockSupabase);
    mockSupabase.update.mockReturnValue(mockSupabase);
    mockSupabase.single.mockReturnValue(mockSupabase);
    mockSupabase.returns.mockReturnValue(mockSupabase);

    // Reset environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-url.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  describe('createSupabaseClient', () => {
    it('creates client with provided token', async () => {
      // Mock the createClient implementation to use our expected values
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase-url.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
      
      const token = 'test-token';
      await createSupabaseClient(token);
      expect(createClient).toHaveBeenCalledWith(
        'https://mock-supabase-url.supabase.co',
        'mock-anon-key',
        expect.objectContaining({
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
            storageKey: 'supabase.auth.token',
          },
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        })
      );
    });

    it('throws an error when no token is provided', async () => {
      await expect(createSupabaseClient()).rejects.toThrow('Authentication token is required');
    });
  });

  describe('saveAnalysis', () => {
    const mockData = {
      id: '1',
      user_id: 'user1',
      logs: 'test logs',
      analysis: 'test analysis',
      context: {
        frontend: 'true',
        backend: 'false',
        platform: 'web',
      },
      created_at: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
      mockSupabase.single.mockResolvedValue({ data: mockData, error: null });
    });

    it('saves analysis successfully', async () => {
      const result = await saveAnalysis(
        'user1',
        'test logs',
        {
          frontend: 'true',
          backend: 'false',
          platform: 'web',
        },
        'test analysis',
        'test-token'
      );

      expect(mockSupabase.from).toHaveBeenCalledWith('analysis_history');
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        {
          user_id: 'user1',
          logs: 'test logs',
          context: {
            frontend: 'true',
            backend: 'false',
            platform: 'web',
          },
          analysis: 'test analysis',
        },
      ]);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('handles error when saving analysis', async () => {
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Save failed') });

      await expect(
        saveAnalysis(
          'user1',
          'test logs',
          {
            frontend: 'true',
            backend: 'false',
            platform: 'web',
          },
          'test analysis',
          'test-token'
        )
      ).rejects.toThrow('Save failed');
    });
  });

  describe('getAnalysisHistory', () => {
    const mockData = [
      {
        id: '1',
        user_id: 'user1',
        logs: 'test logs 1',
        analysis: 'test analysis 1',
        context: {
          frontend: 'true',
          backend: 'false',
          platform: 'web',
        },
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        user_id: 'user1',
        logs: 'test logs 2',
        analysis: 'test analysis 2',
        context: {
          frontend: 'false',
          backend: 'true',
          platform: 'mobile',
        },
        created_at: '2024-01-02T00:00:00Z',
      },
    ];

    beforeEach(() => {
      mockSupabase.order.mockResolvedValue({ data: mockData, error: null });
    });

    it('retrieves analysis history successfully', async () => {
      const result = await getAnalysisHistory('test-token');

      expect(mockSupabase.from).toHaveBeenCalledWith('analysis_history');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockData);
    });

    it('handles error when retrieving history', async () => {
      mockSupabase.order.mockResolvedValue({ data: null, error: new Error('Retrieve failed') });

      await expect(getAnalysisHistory('test-token')).rejects.toThrow('Retrieve failed');
    });
  });

  describe('deleteAnalysis', () => {
    beforeEach(() => {
      mockSupabase.eq.mockResolvedValue({ error: null });
    });

    it('deletes analysis successfully', async () => {
      await deleteAnalysis('1', 'test-token');

      expect(mockSupabase.from).toHaveBeenCalledWith('analysis_history');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
    });

    it('handles error when deleting analysis', async () => {
      mockSupabase.eq.mockResolvedValue({ error: new Error('Delete failed') });

      await expect(deleteAnalysis('1', 'test-token')).rejects.toThrow('Delete failed');
    });
  });

  describe('updateAnalysis', () => {
    const mockData = {
      id: '1',
      user_id: 'user1',
      logs: 'updated logs',
      analysis: 'updated analysis',
      context: {
        frontend: 'true',
        backend: 'false',
        platform: 'web',
      },
      created_at: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
      mockSupabase.single.mockResolvedValue({ data: mockData, error: null });
    });

    it('updates analysis successfully', async () => {
      const result = await updateAnalysis('1', 'updated analysis', 'test-token');

      expect(mockSupabase.from).toHaveBeenCalledWith('analysis_history');
      expect(mockSupabase.update).toHaveBeenCalledWith({ analysis: 'updated analysis' });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('handles error when updating analysis', async () => {
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Update failed') });

      await expect(updateAnalysis('1', 'updated analysis', 'test-token')).rejects.toThrow('Update failed');
    });
  });
}); 