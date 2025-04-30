import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import LogAnalyzer from './components/LogAnalyzer';
import AnalysisHistory from './components/AnalysisHistory';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <SignedOut>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome to BugSage</h1>
          <p className="text-xl mb-8">Your AI-powered debugging mentor</p>
          <SignIn />
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">BugSage Dashboard</h1>
              <p className="text-gray-600">Paste your logs below to get AI-powered analysis and solutions</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </header>
          
          <LogAnalyzer />

          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Analysis History</h2>
            <AnalysisHistory />
          </section>
        </div>
      </SignedIn>
    </div>
  );
}
