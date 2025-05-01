/**
 * Standalone test for AnalysisHistory component
 * Tests the core functionality without full application dependencies
 * 
 * Run with: node test-analysis-history.js
 */

// Mock history data for testing
const mockHistoryItems = [
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
    logs: 'Test log message 2\nWith multiple lines\nAnd stack trace',
    context: {
      frontend: 'vue',
      backend: 'python',
      platform: 'aws'
    },
    analysis: 'Test analysis 2',
    created_at: '2023-12-30T15:30:00.000Z'
  }
];

// Simulate the filtering & sorting functionality of the component
function filterAndSortHistory(historyItems, filters = {}, sortBy = 'date', order = 'desc') {
  try {
    console.log(`Filtering and sorting ${historyItems.length} history items`);
    console.log(`Sort by: ${sortBy}, Order: ${order}`);
    
    // Apply filters
    let filtered = [...historyItems];
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      console.log(`Filtering by search query: "${query}"`);
      
      filtered = filtered.filter(item => 
        item.logs.toLowerCase().includes(query) || 
        item.analysis.toLowerCase().includes(query) ||
        item.context.frontend?.toLowerCase().includes(query) ||
        item.context.backend?.toLowerCase().includes(query) ||
        item.context.platform?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    } else if (sortBy === 'context') {
      filtered.sort((a, b) => {
        const contextA = `${a.context.frontend || ''}${a.context.backend || ''}`;
        const contextB = `${b.context.frontend || ''}${b.context.backend || ''}`;
        return order === 'desc' 
          ? contextB.localeCompare(contextA) 
          : contextA.localeCompare(contextB);
      });
    }
    
    return {
      success: true,
      items: filtered,
      totalCount: filtered.length
    };
  } catch (error) {
    return {
      success: false,
      error: `Error processing history items: ${error.message}`
    };
  }
}

// Test cases
const testCases = [
  {
    name: 'Show All (Default Sort)',
    filters: {},
    sortBy: 'date',
    order: 'desc'
  },
  {
    name: 'Search Query Filter',
    filters: { searchQuery: 'react' },
    sortBy: 'date',
    order: 'desc'
  },
  {
    name: 'Sort by Context Ascending',
    filters: {},
    sortBy: 'context',
    order: 'asc'
  },
  {
    name: 'Search and Custom Sort',
    filters: { searchQuery: 'multiple' },
    sortBy: 'context',
    order: 'desc'
  }
];

// Run the tests
console.log('===== TESTING ANALYSIS HISTORY COMPONENT =====\n');

// Start with displaying the mock data
console.log('Mock History Data:');
mockHistoryItems.forEach((item, index) => {
  console.log(`[${index + 1}] ID: ${item.id}, Date: ${new Date(item.created_at).toLocaleString()}`);
  console.log(`    Context: ${item.context.frontend}/${item.context.backend}/${item.context.platform}`);
  console.log(`    Logs: ${item.logs.substring(0, 30)}${item.logs.length > 30 ? '...' : ''}`);
  console.log('-'.repeat(50));
});

// Test each case
testCases.forEach((testCase, index) => {
  console.log(`\n----- Test Case ${index + 1}: ${testCase.name} -----`);
  
  const result = filterAndSortHistory(
    mockHistoryItems, 
    testCase.filters, 
    testCase.sortBy, 
    testCase.order
  );
  
  if (!result.success) {
    console.log('Error:', result.error);
  } else {
    console.log(`Found ${result.items.length} items`);
    if (result.items.length > 0) {
      console.log('\nFiltered and Sorted Results:');
      result.items.forEach((item, idx) => {
        console.log(`[${idx + 1}] ID: ${item.id}, Date: ${new Date(item.created_at).toLocaleString()}`);
        console.log(`    Context: ${item.context.frontend}/${item.context.backend}/${item.context.platform}`);
      });
    }
  }
  
  console.log('-'.repeat(50));
});

// Add a test for export functionality
console.log('\n----- Testing Export Functionality -----');
function generateCSV(items) {
  if (!items || items.length === 0) {
    return 'No data to export';
  }
  
  const headers = ['ID', 'Date', 'Frontend', 'Backend', 'Platform', 'Logs', 'Analysis'];
  const rows = items.map(item => [
    item.id,
    new Date(item.created_at).toLocaleString(),
    item.context.frontend || '',
    item.context.backend || '',
    item.context.platform || '',
    item.logs.replace(/"/g, '""').replace(/\n/g, ' '),
    item.analysis.replace(/"/g, '""').replace(/\n/g, ' ')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

const csvContent = generateCSV(mockHistoryItems);
console.log('CSV Export Preview:');
console.log(csvContent.split('\n').slice(0, 3).join('\n'));
console.log('...');

console.log('\n===== ANALYSIS HISTORY TESTS COMPLETE ====='); 