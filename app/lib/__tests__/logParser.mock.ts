// Mock log data for testing the parser in isolation

export const mockJavaScriptError = `TypeError: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.js:23:34)
    at processChild (node_modules/react-dom/cjs/react-dom.development.js:1354:12)
    at performWork (node_modules/react-dom/cjs/react-dom.development.js:1642:7)`;

export const mockReactError = `Error: React component encountered an error in useEffect hook
    at useState (node_modules/react/cjs/react.development.js:1498:13)
    at App (src/App.js:12:22)`;

export const mockNextJSError = `Error: getStaticProps error
    at getStaticProps (pages/products/[id].js:78:15)
    at renderToHTML (next/dist/next-server/lib/render.js:345:22)`;

export const mockPythonError = `File "app.py", line 42, in <module>
    result = calculate_total(items)
File "utils/math.py", line 15, in calculate_total
    return sum([item.price for item in items])
AttributeError: 'NoneType' object has no attribute 'price'`;

export const mockJavaError = `Exception in thread "main" java.lang.NullPointerException
    at com.example.Main.processData(Main.java:42)
    at com.example.Main.main(Main.java:15)`;

export const mockEnvironmentError = `[2023-05-15T12:34:56Z] Error connecting to database at localhost:5432
    Failed to establish connection after 3 attempts`;

export const mockParsedLog = {
  errorType: 'TypeError',
  errorMessage: "Cannot read property 'map' of undefined",
  stackTrace: [
    'at UserList.render (src/components/UserList.js:23:34)',
    'at processChild (node_modules/react-dom/cjs/react-dom.development.js:1354:12)'
  ],
  filePaths: ['src/components/UserList.js', 'node_modules/react-dom/cjs/react-dom.development.js'],
  lineNumbers: [23, 1354],
  framework: 'React',
  language: 'JavaScript/TypeScript',
  environment: 'development',
  timestamp: '2023-05-15T12:34:56Z'
}; 