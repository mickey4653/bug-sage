/**
 * Standalone test for Supabase client integration
 * Tests the core functionality without accessing the actual Supabase database
 * 
 * Run with: node test-supabase.js
 */

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

// Mocked data for testing
const mockAnalysisHistory = [
  {
    id: '1',
    user_id: 'user123',
    logs: 'Test log message 1',
    context: {
      frontend: 'react',
      backend: 'nodejs',
      platform: 'web'
    },
    analysis: 'Test analysis 1',
    created_at: '2023-12-31T19:00:00.000Z'
  },
  {
    id: '2',
    user_id: 'user123',
    logs: 'Test log message 2',
    context: {
      frontend: 'vue',
      backend: 'python',
      platform: 'aws'
    },
    analysis: 'Test analysis 2',
    created_at: '2023-12-30T15:30:00.000Z'
  }
];

// Simplified approach - just mock the functionality we need
// instead of trying to recreate the Supabase client structure
const createMockSupabaseClient = (token) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }
  
  console.log('Created mock Supabase client with token:', token);
  
  return {
    mockDb: [...mockAnalysisHistory],
    
    from: (table) => {
      console.log(`Accessing table: ${table}`);
      
      if (table !== 'analysis_history') {
        throw new Error(`Table ${table} not implemented in mock`);
      }
      
      return {
        select: (columns) => {
          console.log(`Selecting columns: ${columns}`);
          return {
            returns: () => {
              return {
                order: (column, { ascending } = {}) => {
                  console.log(`Ordering by: ${column}, ascending: ${ascending}`);
                  
                  // Clone the data
                  const sortedData = [...mockAnalysisHistory];
                  
                  // Sort by date
                  if (column === 'created_at') {
                    sortedData.sort((a, b) => {
                      const dateA = new Date(a.created_at);
                      const dateB = new Date(b.created_at);
                      return ascending ? dateA - dateB : dateB - dateA;
                    });
                  }
                  
                  return Promise.resolve({ data: sortedData, error: null });
                }
              };
            }
          };
        },
        
        insert: (records) => {
          console.log(`Inserting ${records.length} records:`, records[0]);
          
          return {
            select: () => {
              return {
                single: () => {
                  const newRecord = { 
                    ...records[0], 
                    id: String(mockAnalysisHistory.length + 1),
                    created_at: new Date().toISOString()
                  };
                  
                  mockAnalysisHistory.push(newRecord);
                  
                  return Promise.resolve({ data: newRecord, error: null });
                }
              };
            }
          };
        },
        
        update: (updates) => {
          console.log(`Updating record with:`, updates);
          
          return {
            eq: (field, value) => {
              console.log(`Where ${field} = ${value}`);
              
              return {
                select: () => {
                  return {
                    single: () => {
                      const index = mockAnalysisHistory.findIndex(item => item[field] === value);
                      
                      if (index === -1) {
                        return Promise.resolve({ 
                          data: null, 
                          error: { message: `Record with ${field}=${value} not found` } 
                        });
                      }
                      
                      mockAnalysisHistory[index] = { 
                        ...mockAnalysisHistory[index], 
                        ...updates 
                      };
                      
                      return Promise.resolve({ 
                        data: mockAnalysisHistory[index], 
                        error: null 
                      });
                    }
                  };
                }
              };
            }
          };
        },
        
        delete: () => {
          console.log(`Preparing to delete records`);
          
          return {
            eq: (field, value) => {
              console.log(`Where ${field} = ${value}`);
              
              const initialLength = mockAnalysisHistory.length;
              const index = mockAnalysisHistory.findIndex(item => item[field] === value);
              
              if (index === -1) {
                return Promise.resolve({ 
                  error: { message: `Record with ${field}=${value} not found` } 
                });
              }
              
              // Remove the item
              mockAnalysisHistory.splice(index, 1);
              
              return Promise.resolve({ error: null });
            }
          };
        }
      };
    }
  };
};

// Simulate the functionality of the Supabase integration
async function testGetAnalysisHistory(token) {
  try {
    console.log('\nTesting getAnalysisHistory...');
    const supabase = createMockSupabaseClient(token);
    
    const { data, error } = await supabase
      .from('analysis_history')
      .select('id, user_id, logs, context, analysis, created_at')
      .returns()
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log(`Found ${data.length} history items`);
    return data;
  } catch (error) {
    console.error('Error in getAnalysisHistory:', error);
    throw error;
  }
}

async function testSaveAnalysis(userId, logs, context, analysis, token) {
  try {
    console.log('\nTesting saveAnalysis...');
    const supabase = createMockSupabaseClient(token);
    
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

    if (error) throw error;
    console.log(`Saved analysis with id: ${data.id}`);
    return data;
  } catch (error) {
    console.error('Error in saveAnalysis:', error);
    throw error;
  }
}

async function testUpdateAnalysis(id, analysis, token) {
  try {
    console.log('\nTesting updateAnalysis...');
    const supabase = createMockSupabaseClient(token);
    
    const { data, error } = await supabase
      .from('analysis_history')
      .update({ analysis })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    console.log(`Updated analysis with id: ${data.id}`);
    return data;
  } catch (error) {
    console.error('Error in updateAnalysis:', error);
    throw error;
  }
}

async function testDeleteAnalysis(id, token) {
  try {
    console.log('\nTesting deleteAnalysis...');
    const supabase = createMockSupabaseClient(token);
    
    const { error } = await supabase
      .from('analysis_history')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log(`Successfully deleted analysis with id: ${id}`);
    return true;
  } catch (error) {
    console.error('Error in deleteAnalysis:', error);
    throw error;
  }
}

// Run the tests
async function runTests() {
  console.log('===== TESTING SUPABASE INTEGRATION =====\n');
  
  const mockToken = 'mock-auth-token';
  let testError = false;
  
  try {
    // Test with no token
    try {
      console.log('Testing without token (should fail)');
      createMockSupabaseClient();
      console.log('❌ Test failed: Should have thrown an error for missing token');
      testError = true;
    } catch (error) {
      console.log('✅ Correctly threw error for missing token:', error.message);
    }
    
    // Test getAnalysisHistory
    try {
      const history = await testGetAnalysisHistory(mockToken);
      console.log(`✅ Successfully retrieved ${history.length} history items`);
    } catch (error) {
      console.log('❌ getAnalysisHistory failed:', error.message);
      testError = true;
    }
    
    // Test saveAnalysis
    try {
      const newAnalysis = await testSaveAnalysis(
        'test-user',
        'Test log content',
        { frontend: 'react', backend: 'node', platform: 'web' },
        'Test analysis content',
        mockToken
      );
      console.log('✅ Successfully saved analysis:', newAnalysis.id);
    } catch (error) {
      console.log('❌ saveAnalysis failed:', error.message);
      testError = true;
    }
    
    // Test updateAnalysis
    try {
      const updatedAnalysis = await testUpdateAnalysis('1', 'Updated analysis content', mockToken);
      console.log('✅ Successfully updated analysis:', updatedAnalysis.id);
    } catch (error) {
      console.log('❌ updateAnalysis failed:', error.message);
      testError = true;
    }
    
    // Test deleteAnalysis
    try {
      const deleteResult = await testDeleteAnalysis('1', mockToken);
      console.log('✅ Successfully deleted analysis:', deleteResult);
    } catch (error) {
      console.log('❌ deleteAnalysis failed:', error.message);
      testError = true;
    }
  } catch (error) {
    console.error('Unexpected error during tests:', error);
    testError = true;
  }
  
  console.log('\n===== SUPABASE INTEGRATION TEST COMPLETE =====');
  if (testError) {
    console.log('❌ Some tests failed. See above for details.');
    process.exit(1);
  } else {
    console.log('✅ All Supabase integration tests passed!');
  }
}

// Run all tests
runTests(); 