/**
 * BugSage - Your AI Debugging Mentor
 * Copyright (c) 2025 Michael Ilerioluwa Adeniyi
 * MIT License - See LICENSE file for details
 */

'use client';

import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import LogAnalyzer from './components/LogAnalyzer';
import AnalysisHistory from './components/AnalysisHistory';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <SignedOut>
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="py-20 px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 space-y-6"
              >
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent leading-tight">
                  Your AI Debugging Mentor
                </h1>
                <p className="text-xl text-amber-800/80 max-w-lg">
                  BugSage helps developers analyze logs, understand errors, and find solutions — powered by AI.
                </p>
                <div className="flex gap-4 pt-4">
                  <SignIn />
                  <Link href="#features" className="px-6 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors">
                    Learn More
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:w-1/2"
              >
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-amber-200/50">
                  <Image 
                    src="/dashboard-preview.svg" 
                    alt="BugSage Dashboard" 
                    width={600} 
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 px-6 bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-amber-800">How BugSage Works</h2>
              <p className="text-amber-700/80 mt-2">Smart error analysis in three simple steps</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-amber-200/50"
              >
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">1. Paste Your Logs</h3>
                <p className="text-amber-700/80">Simply paste your error logs, stack traces, or console output into BugSage.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-amber-200/50"
              >
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">2. AI Analyzes Context</h3>
                <p className="text-amber-700/80">Our AI parses the logs, detects technologies, and understands the root cause of errors.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-amber-200/50"
              >
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">3. Get Solutions Fast</h3>
                <p className="text-amber-700/80">Receive detailed explanations, step-by-step fixes, and prevention tips.</p>
              </motion.div>
            </div>
          </section>

          {/* Technology Support Section */}
          <section className="py-20 px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-amber-800">Supported Technologies</h2>
              <p className="text-amber-700/80 mt-2">BugSage understands errors across various tech stacks</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {['React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Python', 'Java', '.NET'].map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-sm border border-amber-200/50 flex items-center justify-center"
                >
                  <span className="text-amber-700 font-medium">{tech}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Start Debugging Smarter Today</h2>
              <p className="mb-8">Join other developers who have transformed their debugging workflow with BugSage&apos;s AI-powered analysis.</p>
              <SignIn />
            </div>
          </section>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="space-y-8 p-6">
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
