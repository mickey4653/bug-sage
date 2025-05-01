/**
 * Generate sample log files for testing
 * This script creates a set of sample error logs from different technologies
 * Run with: node generate-sample-logs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the output directory
const OUTPUT_DIR = path.join(__dirname, 'sample-logs');

// Create the output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

// Sample logs for different technologies
const sampleLogs = {
  'react-state-error.log': `TypeError: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.js:23:34)
    at processChild (node_modules/react-dom/cjs/react-dom.development.js:1354:12)
    at processChildren (node_modules/react-dom/cjs/react-dom.development.js:1419:5)`,

  'react-hook-error.log': `Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
    at useState (node_modules/react/cjs/react.development.js:1476:21)
    at useEffect (node_modules/react/cjs/react.development.js:1619:15)
    at Header (src/components/Header.js:12:23)`,

  'nextjs-build-error.log': `Error: Export encountered errors on following paths:
    /products/[id]: /var/task/pages/products/[id].js 24:12
    SyntaxError: Unexpected token
    at internal/process/task_queues.js:89:15`,

  'python-import-error.log': `Traceback (most recent call last):
  File "app.py", line 5, in <module>
    from utils.helpers import format_data
  File "/app/utils/helpers.py", line 3, in <module>
    import numpy as np
ModuleNotFoundError: No module named 'numpy'`,

  'python-attribute-error.log': `Traceback (most recent call last):
  File "app.py", line 42, in <module>
    result = calculate_total(items)
  File "utils/math.py", line 15, in calculate_total
    return sum([item.price for item in items])
AttributeError: 'NoneType' object has no attribute 'price'`,

  'node-api-error.log': `Error: connect ECONNREFUSED 127.0.0.1:3306
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1146:16)
    at Protocol._enqueue (/app/node_modules/mysql/lib/Connection.js:145:48)
    at Protocol.handshake (/app/node_modules/mysql/lib/Connection.js:59:23)
    at Connection.connect (events.js:369:16)`,

  'java-null-pointer.log': `Exception in thread "main" java.lang.NullPointerException
    at com.example.Main.processData(Main.java:42)
    at com.example.Main.main(Main.java:15)`,

  'dotnet-exception.log': `System.NullReferenceException: Object reference not set to an instance of an object.
   at MyApp.Controllers.ProductController.GetById(Int32 id) in C:\\Projects\\MyApp\\Controllers\\ProductController.cs:line 56
   at lambda_method(Closure , Object , Object[] )
   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.SyncActionResultExecutor.Execute(IActionResultTypeMapper mapper)`,

  'firebase-auth-error.log': `FirebaseError: Firebase: Error (auth/invalid-email).
    at createErrorInternal (https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js:237:53)
    at _assert (https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js:2427:9)
    at https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js:14973:27
    at Component.login (src/services/auth.js:25:7)`,

  'docker-compose-error.log': `ERROR: for db  Cannot create container for service db: Conflict. The container name "/my-app-db" is already in use by container "3c5df1abcd". You have to remove (or rename) that container to be able to reuse that name.`
};

// Write each log file
Object.entries(sampleLogs).forEach(([filename, content]) => {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, content);
  console.log(`Created sample log: ${filename}`);
});

console.log('\nSample log files created successfully!');
console.log(`Total files: ${Object.keys(sampleLogs).length}`);
console.log(`Location: ${OUTPUT_DIR}`); 