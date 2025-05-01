## Error Details
- Type: Error
- Message: connect ECONNREFUSED 127.0.0.1:3306

## Stack Trace Analysis
- Relevant Files: net.js, /app/node_modules/mysql/lib/Connection.js, events.js, /app/node_modules/mysql/lib/Connection.js, events.js, /app/node_modules/mysql/lib/protocol/Protocol.js

## Context
- Environment: local

## Raw Logs
```
Error: connect ECONNREFUSED 127.0.0.1:3306
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1144:16)
    at Connection._handleConnectTimeout (/app/node_modules/mysql/lib/Connection.js:419:13)
    at Object.onceWrapper (events.js:421:28)
    at Connection._handleProtocolError (/app/node_modules/mysql/lib/Connection.js:423:10)
    at Protocol.emit (events.js:400:28)
    at Protocol._delegateError (/app/node_modules/mysql/lib/protocol/Protocol.js:398:10)
```
