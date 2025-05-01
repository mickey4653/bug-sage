## Error Details
- Type: Error
- Message: connect ECONNREFUSED 127.0.0.1:3306

## Stack Trace Analysis
- Relevant Files: net.js, /app/node_modules/mysql/lib/Connection.js, /app/node_modules/mysql/lib/Connection.js, events.js

## Context
- Environment: local

## Raw Logs
```
Error: connect ECONNREFUSED 127.0.0.1:3306
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1146:16)
    at Protocol._enqueue (/app/node_modules/mysql/lib/Connection.js:145:48)
    at Protocol.handshake (/app/node_modules/mysql/lib/Connection.js:59:23)
    at Connection.connect (events.js:369:16)
```
