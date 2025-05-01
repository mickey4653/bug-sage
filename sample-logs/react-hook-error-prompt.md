## Error Details
- Type: Error
- Message: Invalid hook call. Hooks can only be called inside of the body of a function component.

## Detected Technology
- Framework: React

## Stack Trace Analysis
- Relevant Files: node_modules/react/cjs/react.development.js, node_modules/react/cjs/react.development.js, src/components/Header.js, node_modules/react-dom/cjs/react-dom.development.js

## Context
- Environment: development

## Raw Logs
```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
    at resolveDispatcher (node_modules/react/cjs/react.development.js:1476:13)
    at useState (node_modules/react/cjs/react.development.js:1507:20)
    at Header (src/components/Header.js:9:26)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
```
