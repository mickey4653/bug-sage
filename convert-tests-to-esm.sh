#!/bin/bash
# Script to convert all test files from CommonJS to ES modules
# Run with: bash convert-tests-to-esm.sh

# Set color variables
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}Converting Test Files to ES Modules${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo ""

# Array of test files to convert
TEST_FILES=(
  "simple-parser-test.js"
  "test-log-analyzer.js"
  "test-analysis-history.js"
  "test-api-route.js"
  "test-supabase.js"
  "test-error-boundary.js"
  "test-page-component.js"
  "test-e2e-flow.js"
)

# Process each test file
for test_file in "${TEST_FILES[@]}"; do
  if [ ! -f "$test_file" ]; then
    echo -e "${YELLOW}File not found, skipping: ${test_file}${NC}"
    continue
  fi

  echo -e "${BLUE}Converting: ${test_file}${NC}"
  
  # Create a backup
  cp "$test_file" "${test_file}.bak"
  
  # Replace require() with import
  sed -i 's/const \([a-zA-Z0-9_]*\) = require(['"'"'"]([^)]*)['"'"'"]);/import \1 from \2;/g' "$test_file"
  
  # Add __dirname and __filename for ES modules if file uses them
  if grep -q "__dirname" "$test_file" || grep -q "__filename" "$test_file"; then
    # Add import for fileURLToPath
    sed -i '1s/^/import { fileURLToPath } from '"'"'url'"'"';\n/' "$test_file"
    
    # Add the ES module equivalent of __dirname and __filename
    sed -i '1s/^/\/\/ ES module equivalents for __dirname and __filename\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);\n\n/' "$test_file"
  fi
  
  echo -e "${GREEN}Converted: ${test_file}${NC}"
done

echo -e "\n${GREEN}Conversion complete!${NC}"
echo -e "${YELLOW}Backup files have been created with .bak extension${NC}"
echo -e "${YELLOW}You may need to manually fix any complex require statements${NC}" 