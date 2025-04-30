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
