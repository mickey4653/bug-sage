## Error Details
- Type: Error
- Message: Invalid hook call. Hooks can only be called inside of the body of a function component.

## Detected Technology
- Framework: React

## Stack Trace Analysis
- Relevant Files: node_modules/react/cjs/react.development.js, node_modules/react/cjs/react.development.js, src/components/Header.js

## Context
- Environment: development

## Raw Logs
```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
    at useState (node_modules/react/cjs/react.development.js:1476:21)
    at useEffect (node_modules/react/cjs/react.development.js:1619:15)
    at Header (src/components/Header.js:12:23)
```
