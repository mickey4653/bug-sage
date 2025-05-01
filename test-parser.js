/**
 * Simple test script for the log parser
 * Run with: npx ts-node test-parser.js
 */

// CommonJS require for TypeScript compatibility
const { parseLog, structureLogForPrompt } = require('./app/lib/logParser');

// Test with a JavaScript error
const jsErrorLog = `TypeError: Cannot read property 'map' of undefined
  at UserList.render (src/components/UserList.js:23:34)
  at processChild (node_modules/react-dom/cjs/react-dom.development.js:1354:12)
  at performWork (node_modules/react-dom/cjs/react-dom.development.js:1642:7)`;

console.log('---------- TESTING LOG PARSER ----------');
const result = parseLog(jsErrorLog);
console.log('\nParsed JavaScript Error:');
console.log(JSON.stringify(result, null, 2));

// Test with a Python error
const pythonErrorLog = `File "app.py", line 42, in <module>
  result = calculate_total(items)
File "utils/math.py", line 15, in calculate_total
  return sum([item.price for item in items])
AttributeError: 'NoneType' object has no attribute 'price'`;

console.log('\nParsed Python Error:');
console.log(JSON.stringify(parseLog(pythonErrorLog), null, 2));

// Test the structured prompt
console.log('\n---------- TESTING STRUCTURED PROMPT ----------');
const structured = structureLogForPrompt(result, jsErrorLog);
console.log(structured);

console.log('\nParser tests completed successfully!'); 