import { parseLog, structureLogForPrompt } from '../logParser';

describe('Log Parser', () => {
  describe('parseLog', () => {
    test('detects JavaScript error type and message', () => {
      const log = `TypeError: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.js:23:34)
    at processChild (node_modules/react-dom/cjs/react-dom.development.js:1354:12)
    at performWork (node_modules/react-dom/cjs/react-dom.development.js:1642:7)`;

      const result = parseLog(log);
      expect(result.errorType).toBe('TypeError');
      expect(result.errorMessage).toBe("Cannot read property 'map' of undefined");
      expect(result.language).toBe('JavaScript/TypeScript');
      expect(result.filePaths).toContain('src/components/UserList.js');
      expect(result.lineNumbers).toContain(23);
    });

    test('detects React framework', () => {
      const log = `Error: React component encountered an error in useEffect hook
    at useState (node_modules/react/cjs/react.development.js:1498:13)
    at App (src/App.js:12:22)`;

      const result = parseLog(log);
      expect(result.framework).toBe('React');
    });

    test('detects NextJS framework', () => {
      const log = `Error: getStaticProps error
    at getStaticProps (pages/products/[id].js:78:15)
    at renderToHTML (next/dist/next-server/lib/render.js:345:22)`;

      const result = parseLog(log);
      expect(result.framework).toBe('NextJS');
    });

    test('detects Python error', () => {
      const log = `File "app.py", line 42, in <module>
    result = calculate_total(items)
File "utils/math.py", line 15, in calculate_total
    return sum([item.price for item in items])
AttributeError: 'NoneType' object has no attribute 'price'`;

      const result = parseLog(log);
      expect(result.language).toBe('Python');
    });

    test('detects Java error', () => {
      const log = `Exception in thread "main" java.lang.NullPointerException
    at com.example.Main.processData(Main.java:42)
    at com.example.Main.main(Main.java:15)`;

      const result = parseLog(log);
      expect(result.language).toBe('Java');
    });

    test('detects environment information', () => {
      const log = `[2023-05-15T12:34:56Z] Error connecting to database at localhost:5432
    Failed to establish connection after 3 attempts`;

      const result = parseLog(log);
      expect(result.environment).toBe('local');
      expect(result.timestamp).toBe('2023-05-15T12:34:56Z');
    });
  });

  describe('structureLogForPrompt', () => {
    test('formats structured insight correctly', () => {
      const parsedLog = {
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

      const rawLogs = "Error log content";
      const structured = structureLogForPrompt(parsedLog, rawLogs);

      expect(structured).toContain('## Error Details');
      expect(structured).toContain('Type: TypeError');
      expect(structured).toContain('## Detected Technology');
      expect(structured).toContain('Framework: React');
      expect(structured).toContain('## Stack Trace Analysis');
      expect(structured).toContain('src/components/UserList.js');
      expect(structured).toContain('## Context');
      expect(structured).toContain('Environment: development');
      expect(structured).toContain('## Raw Logs');
      expect(structured).toContain('Error log content');
    });
  });
}); 