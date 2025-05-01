/**
 * Script to generate a variety of sample error logs for testing
 * Run with: node generate-sample-logs.js
 */

const fs = require('fs');
const path = require('path');

const SAMPLES_DIR = path.join(__dirname, 'sample-logs');

// Create the directory if it doesn't exist
if (!fs.existsSync(SAMPLES_DIR)) {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
}

// Sample error logs from different technologies
const sampleLogs = {
  'react-state-error.log': `TypeError: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.js:23:34)
    at processChild (node_modules/react-dom/cjs/react-dom.development.js:1354:12)
    at performWork (node_modules/react-dom/cjs/react-dom.development.js:1642:7)
    at ReactDOM.render (node_modules/react-dom/cjs/react-dom.development.js:1231:5)
    at index.js:15:33`,

  'react-hook-error.log': `Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
    at resolveDispatcher (node_modules/react/cjs/react.development.js:1476:13)
    at useState (node_modules/react/cjs/react.development.js:1507:20)
    at Header (src/components/Header.js:9:26)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)`,

  'nextjs-build-error.log': `Error: Failed to compile.
./pages/products/[id].js
Error: getStaticPaths is required for dynamic SSG pages and is missing for '/products/[id]'.
    at Object.getStaticProps (/var/task/pages/products/[id].js:78:15)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)`,

  'node-api-error.log': `Error: connect ECONNREFUSED 127.0.0.1:3306
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1144:16)
    at Connection._handleConnectTimeout (/app/node_modules/mysql/lib/Connection.js:419:13)
    at Object.onceWrapper (events.js:421:28)
    at Connection._handleProtocolError (/app/node_modules/mysql/lib/Connection.js:423:10)
    at Protocol.emit (events.js:400:28)
    at Protocol._delegateError (/app/node_modules/mysql/lib/protocol/Protocol.js:398:10)`,

  'python-attribute-error.log': `Traceback (most recent call last):
  File "app.py", line 42, in <module>
    result = calculate_total(items)
  File "utils/math.py", line 15, in calculate_total
    return sum([item.price for item in items])
AttributeError: 'NoneType' object has no attribute 'price'`,

  'python-import-error.log': `Traceback (most recent call last):
  File "/app/main.py", line 5, in <module>
    import tensorflow as tf
  File "/usr/local/lib/python3.9/site-packages/tensorflow/__init__.py", line 41, in <module>
    from tensorflow.python.tools import module_util as _module_util
ModuleNotFoundError: No module named 'tensorflow.python.tools'`,

  'java-null-pointer.log': `Exception in thread "main" java.lang.NullPointerException
    at com.example.Main.processData(Main.java:42)
    at com.example.Main.main(Main.java:15)`,

  'dotnet-exception.log': `System.NullReferenceException: Object reference not set to an instance of an object.
   at MyApp.Controllers.UserController.GetUserProfile(Int32 userId) in C:\\Projects\\MyApp\\Controllers\\UserController.cs:line 54
   at lambda_method(Closure , Object , Object[] )
   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.SyncActionResultExecutor.Execute(IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)`,

  'firebase-auth-error.log': `FirebaseError: Firebase: Error (auth/invalid-email).
    at createErrorInternal (https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js:1395:41)
    at _assert (https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js:1364:15)
    at https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js:7485:23
    at Component.signInWithEmailAndPassword (https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js:7646:32)
    at login (http://localhost:3000/static/js/main.chunk.js:1234:31)`,

  'docker-compose-error.log': `ERROR: for db  Cannot start service db: driver failed programming external connectivity on endpoint myapp_db_1 (3d4f7712d29dd0c23d63b0683e2fe8a091fc8ddad57bd9eca6783eb5fb9dbc7c): Error starting userland proxy: listen tcp4 0.0.0.0:3306: bind: address already in use
ERROR: Encountered errors while bringing up the project.`
};

// Write each sample log to a file
Object.entries(sampleLogs).forEach(([filename, content]) => {
  const filePath = path.join(SAMPLES_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created ${filePath}`);
});

console.log(`\nGenerated ${Object.keys(sampleLogs).length} sample log files in ${SAMPLES_DIR}`);
console.log('You can use these files to test your log parser!'); 