#!/bin/bash
# Script to run all isolated component tests
# Run with: bash run-isolated-tests.sh

# Set the color variables
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}Running BugSage Isolated Component Tests${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo ""

# Check if we're running in CI environment
IS_CI=false
if [ -n "$CI" ]; then
  IS_CI=true
  echo -e "${YELLOW}Running in CI environment${NC}"
fi

# Check if sample log files exist, if not generate them
if [ ! -d "sample-logs" ] || [ -z "$(ls -A sample-logs 2>/dev/null)" ]; then
  echo -e "${YELLOW}Generating sample log files...${NC}"
  node generate-sample-logs.js
  echo ""
fi

# Arrays of test files to run
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

# Track overall success
SUCCESSFUL_TESTS=0
FAILED_TESTS=0

# Run each test file
for test_file in "${TEST_FILES[@]}"; do
  echo -e "${BLUE}--------------------------------------------------------${NC}"
  echo -e "${BLUE}Running test: ${test_file}${NC}"
  echo -e "${BLUE}--------------------------------------------------------${NC}"
  
  # Check if the file exists
  if [ ! -f "$test_file" ]; then
    echo -e "${RED}Test file not found: ${test_file}${NC}"
    FAILED_TESTS=$((FAILED_TESTS+1))
    continue
  fi
  
  # Run the test
  node $test_file
  
  # Check if the test was successful
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Test completed successfully: ${test_file}${NC}"
    SUCCESSFUL_TESTS=$((SUCCESSFUL_TESTS+1))
  else
    echo -e "${RED}Test failed: ${test_file}${NC}"
    FAILED_TESTS=$((FAILED_TESTS+1))
  fi
  
  echo ""
done

# Display summary
echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo -e "${GREEN}Successful tests: ${SUCCESSFUL_TESTS}${NC}"
echo -e "${RED}Failed tests: ${FAILED_TESTS}${NC}"
echo -e "Total tests: $((SUCCESSFUL_TESTS+FAILED_TESTS))"
echo ""

# Final message
if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}All tests passed successfully!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed. See above for details.${NC}"
  exit 1
fi 