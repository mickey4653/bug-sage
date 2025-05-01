/**
 * Script to convert remaining CommonJS test files to ES modules
 * Run with: node fix-remaining-tests.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Array of test files to check and potentially fix
const TEST_FILES = [
  "simple-parser-test.js",
  "test-log-analyzer.js",
  "test-analysis-history.js",
  "test-api-route.js",
  "test-supabase.js",
  "test-error-boundary.js",
  "test-page-component.js",
  "test-e2e-flow.js"
];

console.log('Checking test files for CommonJS patterns...');

// Process each test file
for (const testFile of TEST_FILES) {
  const filePath = path.join(__dirname, testFile);
  
  // Skip if file doesn't exist
  if (!fs.existsSync(filePath)) {
    console.log(`File not found, skipping: ${testFile}`);
    continue;
  }
  
  console.log(`Processing: ${testFile}`);
  
  // Read file content
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check for CommonJS require pattern
  if (content.includes('require(')) {
    console.log(`  Converting require() in ${testFile}`);
    
    // Create a backup
    fs.writeFileSync(`${filePath}.bak`, content);
    
    // Simple replacements for common require patterns
    content = content.replace(/const\s+(\w+)\s+=\s+require\(['"]([^'"]+)['"]\);/g, 'import $1 from \'$2\';');
    content = content.replace(/const\s+{\s*([^}]+)\s*}\s+=\s+require\(['"]([^'"]+)['"]\);/g, 'import { $1 } from \'$2\';');
    
    modified = true;
  }
  
  // Check for __dirname and __filename without proper ES module setup
  if ((content.includes('__dirname') || content.includes('__filename')) && 
      !content.includes('fileURLToPath')) {
    console.log(`  Adding ES module equivalents for __dirname/__filename in ${testFile}`);
    
    // Create a backup if not already created
    if (!modified) {
      fs.writeFileSync(`${filePath}.bak`, content);
      modified = true;
    }
    
    // Add imports and declarations at the top
    const fileURLImport = "import { fileURLToPath } from 'url';\n";
    const esmEquivalents = 
      "// Get directory name in ES modules\n" +
      "const __filename = fileURLToPath(import.meta.url);\n" +
      "const __dirname = path.dirname(__filename);\n\n";
    
    // Add necessary imports if not already present
    if (!content.includes("import path from 'fs'")) {
      content = "import path from 'path';\n" + content;
    }
    
    if (!content.includes("fileURLToPath")) {
      content = fileURLImport + content;
    }
    
    // Add __dirname and __filename declarations if needed
    if (!content.includes("const __filename = fileURLToPath")) {
      // Find a good spot to insert after imports
      const lastImportIndex = Math.max(
        content.lastIndexOf("import"),
        content.indexOf("\n\n")
      );
      
      if (lastImportIndex !== -1) {
        const endOfImports = content.indexOf("\n", lastImportIndex);
        if (endOfImports !== -1) {
          content = 
            content.substring(0, endOfImports + 1) + 
            "\n" + esmEquivalents +
            content.substring(endOfImports + 1);
        }
      }
    }
  }
  
  // Write modified content if changes were made
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  Updated: ${testFile}`);
  } else {
    console.log(`  No changes needed for: ${testFile}`);
  }
}

console.log('\nConversion complete!');
console.log('Backup files have been created with .bak extension for modified files'); 