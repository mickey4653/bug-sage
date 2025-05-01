# BugSage - Your AI Debugging Mentor

BugSage is an AI-powered debugging assistant that helps developers analyze logs, understand stack traces, and find root causes across frontend, backend, and infrastructure layers.

## Features

- 📝 Paste or upload logs for instant analysis
- 🤖 AI-powered error interpretation and root cause analysis
- 💡 Smart fix suggestions with relevant documentation links
- 🔍 Context-aware analysis based on your tech stack
- 🔒 Secure authentication with Clerk

## Tech Stack

- Frontend: Next.js + Tailwind CSS
- Backend: Next.js API routes
- AI: OpenAI GPT-4
- Authentication: Clerk
- Database: Supabase
- Deployment: Vercel

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bugsage.git
   cd bugsage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Testing Strategy

BugSage uses a dual testing approach:

### Isolated Component Tests

Our primary testing strategy utilizes lightweight, isolated component tests that don't require external dependencies. This approach allows for:

- **Decoupled Testing**: Each component is tested in isolation without complex setup
- **Fast Execution**: Tests run quickly without browser or full React rendering
- **Reliable Testing**: Components are tested without external dependencies that could fail

Run isolated tests with:

```bash
npm run test:isolated
```

Key isolated tests include:
- Log parser (simple-parser-test.js)
- LogAnalyzer component (test-log-analyzer.js)
- AnalysisHistory component (test-analysis-history.js)
- API route (test-api-route.js)
- Supabase integration (test-supabase.js)
- ErrorBoundary component (test-error-boundary.js)
- Page component (test-page-component.js)
- End-to-end flow (test-e2e-flow.js)

### Traditional Unit & E2E Tests

We also maintain traditional Jest unit tests and Cypress E2E tests for specific scenarios:

```bash
# Run Jest unit tests
npm test

# Run Cypress E2E tests
npm run test:e2e
```

### CI/CD Pipeline

Our GitHub Actions workflow automatically runs all tests on push and pull requests. The workflow:
1. Runs linting checks
2. Generates sample log data
3. Runs isolated component tests
4. Runs Jest unit tests
5. Runs Cypress E2E tests
6. Deploys to Vercel on successful tests (main branch only)
