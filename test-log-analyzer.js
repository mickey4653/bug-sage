/**
 * Standalone test for LogAnalyzer component
 * Tests the core functionality without full application dependencies
 * 
 * Run with: node test-log-analyzer.js
 */

// Simple mock of the component's core functionality
function simulateLogAnalysis(logs, context) {
  console.log('Simulating analysis of logs with context:', context);
  
  // Validate input
  if (!logs || logs.trim() === '') {
    return { 
      success: false, 
      error: 'No logs provided' 
    };
  }
  
  // Simulate the parsing and analysis steps
  console.log(`Processing ${logs.length} characters of log data`);
  
  // Create a simplified version of what the component would do
  try {
    // Extract the first line as a summary
    const firstLine = logs.split('\n')[0].trim();
    
    // Detect if this is an error log
    const isError = /error|exception|failed|TypeError|ReferenceError/i.test(logs);
    
    // Create a simulated response similar to what the API would return
    const mockAnalysis = {
      success: true,
      analysis: `
## 💥 Problem
${firstLine}

## 🔍 Root Cause Analysis
This is a simulated analysis of the logs. In a real scenario, this would contain the AI's analysis.
${context.frontend ? `\nFrontend context: ${context.frontend}` : ''}
${context.backend ? `\nBackend context: ${context.backend}` : ''}
${context.platform ? `\nPlatform context: ${context.platform}` : ''}

## 🛠️ Solution
This is a simulated solution. In a real scenario, this would contain the AI's suggested fix.

## 🧐 Prevention
This is simulated prevention advice. In a real scenario, this would contain the AI's prevention tips.
      `
    };
    
    return mockAnalysis;
  } catch (error) {
    return { 
      success: false, 
      error: 'Failed to analyze logs: ' + error.message 
    };
  }
}

// Test cases
const testCases = [
  {
    name: 'Valid React Error',
    logs: `TypeError: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.js:23:34)
    at processChild (node_modules/react-dom/cjs/react-dom.development.js:1354:12)`,
    context: { frontend: 'react', backend: 'nodejs', platform: 'vercel' }
  },
  {
    name: 'Empty Logs',
    logs: '',
    context: { frontend: 'react', backend: 'nodejs', platform: 'vercel' }
  },
  {
    name: 'Python Backend Error',
    logs: `Traceback (most recent call last):
  File "app.py", line 42, in <module>
    result = calculate_total(items)
  File "utils/math.py", line 15, in calculate_total
    return sum([item.price for item in items])
AttributeError: 'NoneType' object has no attribute 'price'`,
    context: { frontend: 'vue', backend: 'python', platform: 'aws' }
  }
];

// Run the tests
console.log('===== TESTING LOG ANALYZER COMPONENT =====\n');
testCases.forEach((testCase, index) => {
  console.log(`\n----- Test Case ${index + 1}: ${testCase.name} -----`);
  const result = simulateLogAnalysis(testCase.logs, testCase.context);
  console.log('Success:', result.success);
  if (result.error) {
    console.log('Error:', result.error);
  } else {
    // Print a shortened version of the analysis
    const shortAnalysis = result.analysis.split('\n').slice(0, 5).join('\n') + '\n...';
    console.log('Analysis preview:', shortAnalysis);
  }
  console.log('-'.repeat(50));
});

console.log('\n===== LOG ANALYZER TESTS COMPLETE ====='); 