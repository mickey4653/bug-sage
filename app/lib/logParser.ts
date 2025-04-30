// Log Parser for BugSage
// Helps identify and structure common error patterns before sending to GPT

interface ParsedLog {
  errorType?: string;
  errorMessage?: string;
  stackTrace?: string[];
  filePaths?: string[];
  lineNumbers?: number[];
  framework?: string;
  language?: string;
  errorCode?: string;
  timestamp?: string;
  environment?: string;
}

// Extract common error patterns from logs
export function parseLog(logContent: string): ParsedLog {
  const result: ParsedLog = {
    stackTrace: [],
    filePaths: [],
    lineNumbers: []
  };

  // Try to detect error type and message
  const errorTypeRegex = /(?:Error|Exception|TypeError|SyntaxError|ReferenceError|RangeError|URIError|EvalError|UnhandledPromiseRejection):\s*(.*?)(?:\n|$)/i;
  const errorTypeMatch = logContent.match(errorTypeRegex);
  if (errorTypeMatch) {
    result.errorType = errorTypeMatch[0].split(':')[0].trim();
    result.errorMessage = errorTypeMatch[1]?.trim();
  }

  // Try to detect stack traces
  const stackTraceLines = logContent.match(/\s+at\s+.+\(.+\)/g);
  if (stackTraceLines) {
    result.stackTrace = stackTraceLines.map(line => line.trim());
    
    // Extract file paths and line numbers from stack trace
    stackTraceLines.forEach(line => {
      const filePathMatch = line.match(/\((.+):(\d+):(\d+)\)/) || line.match(/at\s+(.+):(\d+):(\d+)/);
      if (filePathMatch) {
        result.filePaths?.push(filePathMatch[1]);
        result.lineNumbers?.push(parseInt(filePathMatch[2], 10));
      }
    });
  }

  // Try to detect framework/library based on patterns
  if (logContent.includes('React') || logContent.includes('ReactDOM') || logContent.includes('useState')) {
    result.framework = 'React';
  } else if (logContent.includes('Vue') || logContent.includes('VueRouter') || logContent.includes('Vuex')) {
    result.framework = 'Vue';
  } else if (logContent.includes('Angular') || logContent.includes('NgModule') || logContent.includes('Component({')) {
    result.framework = 'Angular';
  } else if (logContent.includes('Next') || logContent.includes('getServerSideProps') || logContent.includes('getStaticProps')) {
    result.framework = 'NextJS';
  }

  // Try to detect programming language based on patterns
  if (logContent.includes('TypeError') || logContent.includes('undefined is not a function') || logContent.includes('Cannot read property')) {
    result.language = 'JavaScript/TypeScript';
  } else if (logContent.includes('ImportError') || logContent.includes('IndentationError') || logContent.includes('SyntaxError: invalid syntax')) {
    result.language = 'Python';
  } else if (logContent.includes('NullPointerException') || logContent.includes('ClassNotFoundException')) {
    result.language = 'Java';
  } else if (logContent.includes('System.NullReferenceException') || logContent.includes('CS')) {
    result.language = 'C#/.NET';
  }

  // Try to detect environment
  if (logContent.includes('localhost') || logContent.includes('127.0.0.1')) {
    result.environment = 'local';
  } else if (logContent.includes('production') || logContent.includes('prod-')) {
    result.environment = 'production';
  } else if (logContent.includes('staging') || logContent.includes('stage-')) {
    result.environment = 'staging';
  } else if (logContent.includes('development') || logContent.includes('dev-')) {
    result.environment = 'development';
  }

  // Extract timestamps
  const timestampRegexes = [
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})/,  // ISO format
    /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?/,  // SQL-like timestamp
    /\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4}/  // Unix timestamp format
  ];

  for (const regex of timestampRegexes) {
    const match = logContent.match(regex);
    if (match) {
      result.timestamp = match[0];
      break;
    }
  }

  return result;
}

// Format the parsed log into a structured prompt for GPT
export function structureLogForPrompt(parsedLog: ParsedLog, logs: string): string {
  let structuredInsight = '';

  if (parsedLog.errorType || parsedLog.errorMessage) {
    structuredInsight += `## Error Details\n`;
    structuredInsight += parsedLog.errorType ? `- Type: ${parsedLog.errorType}\n` : '';
    structuredInsight += parsedLog.errorMessage ? `- Message: ${parsedLog.errorMessage}\n` : '';
    structuredInsight += '\n';
  }

  if (parsedLog.framework || parsedLog.language) {
    structuredInsight += `## Detected Technology\n`;
    structuredInsight += parsedLog.framework ? `- Framework: ${parsedLog.framework}\n` : '';
    structuredInsight += parsedLog.language ? `- Language: ${parsedLog.language}\n` : '';
    structuredInsight += '\n';
  }

  if (parsedLog.stackTrace && parsedLog.stackTrace.length > 0) {
    structuredInsight += `## Stack Trace Analysis\n`;
    structuredInsight += `- Relevant Files: ${parsedLog.filePaths?.join(', ') || 'None detected'}\n`;
    structuredInsight += '\n';
  }

  if (parsedLog.environment || parsedLog.timestamp) {
    structuredInsight += `## Context\n`;
    structuredInsight += parsedLog.environment ? `- Environment: ${parsedLog.environment}\n` : '';
    structuredInsight += parsedLog.timestamp ? `- Timestamp: ${parsedLog.timestamp}\n` : '';
    structuredInsight += '\n';
  }

  structuredInsight += `## Raw Logs\n\`\`\`\n${logs}\n\`\`\`\n`;

  return structuredInsight;
} 