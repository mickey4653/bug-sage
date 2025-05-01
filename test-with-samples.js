/**
 * Script to test the log parser with sample log files
 * Run with: npx ts-node test-with-samples.js
 * 
 * First run: node generate-sample-logs.js to create the sample logs
 */

const fs = require('fs');
const path = require('path');
// Use require with transpilation for TypeScript files
const { parseLog, structureLogForPrompt } = require('./app/lib/logParser');

const SAMPLES_DIR = path.join(__dirname, 'sample-logs');

// Make sure samples directory exists
if (!fs.existsSync(SAMPLES_DIR)) {
  console.error('Sample logs directory not found. Please run "node generate-sample-logs.js" first.');
  process.exit(1);
}

// Get all log files
const logFiles = fs.readdirSync(SAMPLES_DIR).filter(file => file.endsWith('.log'));

if (logFiles.length === 0) {
  console.error('No log files found. Please run "node generate-sample-logs.js" first.');
  process.exit(1);
}

console.log(`\n===== TESTING LOG PARSER WITH ${logFiles.length} SAMPLE FILES =====\n`);

// Process each log file
logFiles.forEach(file => {
  const filePath = path.join(SAMPLES_DIR, file);
  const logContent = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n----- Testing ${file} -----`);
  
  try {
    // Parse the log
    const parsedResult = parseLog(logContent);
    
    // Print the results
    console.log('Detected error type:', parsedResult.errorType || 'None');
    console.log('Detected language/framework:', parsedResult.language || 'None', '/', parsedResult.framework || 'None');
    
    if (parsedResult.filePaths && parsedResult.filePaths.length > 0) {
      console.log('Found file paths:', parsedResult.filePaths.slice(0, 3).join(', ') + (parsedResult.filePaths.length > 3 ? '...' : ''));
    }
    
    // Generate a structured prompt
    const structuredPrompt = structureLogForPrompt(parsedResult, logContent);
    
    // Save the structured prompt to a file
    const promptFile = path.join(SAMPLES_DIR, file.replace('.log', '-prompt.md'));
    fs.writeFileSync(promptFile, structuredPrompt, 'utf8');
    
    console.log(`Structured prompt saved to: ${promptFile}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log('\n===== LOG PARSER TEST COMPLETE =====');
console.log('All sample logs have been processed. Check the sample-logs directory for the generated prompts.'); 