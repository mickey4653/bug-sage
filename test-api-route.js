/**
 * Standalone test for API route functionality
 * Tests the core logic of the analyze API route without external dependencies
 * 
 * Run with: node test-api-route.js
 */

// Simplified version of the log parser
function mockParseLog(logContent) {
  const result = {
    stackTrace: [],
    filePaths: [],
    lineNumbers: []
  };

  // Try to detect error type and message
  const errorTypeRegex = /(?:Error|Exception|TypeError|SyntaxError|ReferenceError|RangeError|URIError|EvalError|UnhandledPromiseRejection):\s*(.*?)(?:\n|$)/i;
  const errorTypeMatch = logContent.match(errorTypeRegex);
  if (errorTypeMatch) {
    result.errorType = errorTypeMatch[0].split(':')[0].trim();
    result.errorMessage = errorTypeMatch[1]?.trim();
  }

  // Detect framework/language
  if (logContent.includes('React') || logContent.includes('useState')) {
    result.framework = 'React';
  }
  if (logContent.includes('TypeError') || logContent.includes('Cannot read property')) {
    result.language = 'JavaScript/TypeScript';
  }

  return result;
}

// Simplified prompting function
function mockStructureLogForPrompt(parsedLog, logs) {
  return `
## Error Details
${parsedLog.errorType ? `- Type: ${parsedLog.errorType}` : ''}
${parsedLog.errorMessage ? `- Message: ${parsedLog.errorMessage}` : ''}

## Raw Logs
\`\`\`
${logs}
\`\`\`
`;
}

// Mock OpenAI API call
function mockOpenAIChatCompletion(systemPrompt, userPrompt) {
  console.log('Making mock OpenAI API call');
  console.log('System prompt length:', systemPrompt.length);
  console.log('User prompt length:', userPrompt.length);
  
  // Simulate response generation based on prompt content
  let analysisContent = '';
  
  if (userPrompt.includes('TypeError')) {
    analysisContent = `
## 💥 Problem
TypeError: Cannot read property or method

## 🔍 Root Cause Analysis
The code is trying to access a property or call a method on an undefined or null value.

## 🛠️ Solution
Make sure the object exists before accessing its properties:
\`\`\`javascript
// Instead of this:
const result = data.items.map(item => item.name);

// Do this:
const result = data && data.items ? data.items.map(item => item.name) : [];
// Or use optional chaining:
const result = data?.items?.map(item => item.name) || [];
\`\`\`

## 🧐 Prevention
Add proper null checks and use optional chaining (?.) where appropriate.
`;
  } else if (userPrompt.includes('Exception')) {
    analysisContent = `
## 💥 Problem
Exception in application code

## 🔍 Root Cause Analysis
There appears to be an uncaught exception in the application.

## 🛠️ Solution
Implement proper try/catch blocks and error handling.

## 🧐 Prevention
Add comprehensive error handling and logging.
`;
  } else {
    analysisContent = `
## 💥 Problem
Unknown error in application

## 🔍 Root Cause Analysis
Without more specific information, it's difficult to determine the exact cause.

## 🛠️ Solution
Review the code and add more detailed logging.

## 🧐 Prevention
Implement better error handling and monitoring.
`;
  }
  
  return {
    choices: [
      {
        message: {
          content: analysisContent
        }
      }
    ]
  };
}

// Mock API route handler
async function mockAnalyzeRoute(requestBody) {
  try {
    const { logs, context } = requestBody;
    
    if (!logs) {
      return {
        status: 400,
        body: { error: 'No logs provided' }
      };
    }
    
    // Parse the logs
    const parsedLog = mockParseLog(logs);
    
    // Structure the logs
    const structuredLogs = mockStructureLogForPrompt(parsedLog, logs);
    
    // Create system prompt
    let systemPrompt = 'You are an expert debugging assistant specialized in identifying root causes from error logs. ';
    
    // Add framework-specific expertise
    const framework = parsedLog.framework || context.frontend;
    const language = parsedLog.language || context.backend;
    
    if (framework) {
      systemPrompt += `You have deep expertise in ${framework} and common issues with this framework. `;
    }
    
    if (language) {
      systemPrompt += `You are proficient in ${language} and can identify typical bugs in this language. `;
    }
    
    // Add response structure guidance
    systemPrompt += `Analyze the provided logs to identify the root cause and suggest solutions.
      Format your response in markdown with these sections:
      1. 💥 Problem: A clear statement of what went wrong
      2. 🔍 Root Cause Analysis: Detail what caused the issue
      3. 🛠️ Solution: Step-by-step instructions to fix the issue
      4. 🧐 Prevention: How to prevent this issue in the future`;
      
    const userPrompt = `Please analyze these logs with your expertise:

${structuredLogs}`;
    
    // Call mock OpenAI
    const completion = mockOpenAIChatCompletion(systemPrompt, userPrompt);
    const analysis = completion.choices[0].message.content;
    
    return {
      status: 200,
      body: { analysis }
    };
  } catch (error) {
    return {
      status: 500,
      body: { error: 'Failed to analyze logs: ' + error.message }
    };
  }
}

// Test cases
const testCases = [
  {
    name: 'Valid React Error',
    body: {
      logs: `TypeError: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.js:23:34)
    at processChild (node_modules/react-dom/cjs/react-dom.development.js:1354:12)`,
      context: { frontend: 'react', backend: 'nodejs', platform: 'vercel' }
    }
  },
  {
    name: 'Empty Logs',
    body: {
      logs: '',
      context: { frontend: 'react', backend: 'nodejs', platform: 'vercel' }
    }
  },
  {
    name: 'Java Exception',
    body: {
      logs: `Exception in thread "main" java.lang.NullPointerException
    at com.example.Main.processData(Main.java:42)
    at com.example.Main.main(Main.java:15)`,
      context: { frontend: '', backend: 'java', platform: 'aws' }
    }
  }
];

// Run the tests
console.log('===== TESTING API ROUTE =====\n');

(async () => {
  for (const [index, testCase] of testCases.entries()) {
    console.log(`\n----- Test Case ${index + 1}: ${testCase.name} -----`);
    
    const response = await mockAnalyzeRoute(testCase.body);
    
    console.log('Status:', response.status);
    if (response.status !== 200) {
      console.log('Error:', response.body.error);
    } else {
      // Print first few lines of analysis
      const analysisPreview = response.body.analysis.split('\n').slice(0, 6).join('\n') + '\n...';
      console.log('Analysis preview:', analysisPreview);
    }
    
    console.log('-'.repeat(50));
  }
  
  console.log('\n===== API ROUTE TESTS COMPLETE =====');
})(); 