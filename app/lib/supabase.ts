import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a single Supabase client instance
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Create or get the Supabase client with the Clerk JWT
export const createSupabaseClient = async (token?: string) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  // Always create a new client with the latest token
  supabaseClient = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'supabase.auth.token',
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    }
  );

  return supabaseClient;
};

export interface AnalysisHistory {
  id: string;
  user_id: string;
  logs: string;
  context: {
    frontend: string;
    backend: string;
    platform: string;
  };
  analysis: string;
  created_at: string;
}

export interface AnalysisHistoryItem {
  id: string;
  user_id: string;
  logs: string;
  context: {
    frontend: string;
    backend: string;
    platform: string;
  };
  analysis: string;
  created_at: string;
}

// Client-side function
export const getAnalysisHistory = async (token: string): Promise<AnalysisHistoryItem[]> => {
  const supabase = await createSupabaseClient(token);
  const { data, error } = await supabase
    .from('analysis_history')
    .select('id, user_id, logs, context, analysis, created_at')
    .returns<AnalysisHistoryItem[]>()
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Client-side function
export async function saveAnalysis(
  userId: string,
  logs: string,
  context: {
    frontend: string;
    backend: string;
    platform: string;
  },
  analysis: string,
  token: string
) {
  try {
    console.log('Creating Supabase client for saving analysis...');
    const supabase = await createSupabaseClient(token);
    
    console.log('Saving analysis for user:', userId);
    const { data, error } = await supabase
      .from('analysis_history')
      .insert([
        {
          user_id: userId,
          logs,
          context,
          analysis,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Successfully saved analysis:', data);
    return data;
  } catch (error) {
    console.error('Error in saveAnalysis:', error);
    throw error;
  }
}

// Client-side function
export async function updateAnalysis(
  id: string,
  analysis: string,
  token: string
) {
  try {
    console.log('Creating Supabase client for updating analysis...');
    const supabase = await createSupabaseClient(token);
    
    console.log('Updating analysis for id:', id);
    const { data, error } = await supabase
      .from('analysis_history')
      .update({ analysis })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Successfully updated analysis:', data);
    return data;
  } catch (error) {
    console.error('Error in updateAnalysis:', error);
    throw error;
  }
}

// Client-side function
export async function deleteAnalysis(
  id: string,
  token: string
) {
  try {
    console.log('Creating Supabase client for deleting analysis...');
    const supabase = await createSupabaseClient(token);
    
    console.log('Deleting analysis for id:', id);
    const { error } = await supabase
      .from('analysis_history')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Successfully deleted analysis');
    return true;
  } catch (error) {
    console.error('Error in deleteAnalysis:', error);
    throw error;
  }
} 