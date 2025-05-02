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
          <section className="py-10 md:py-20 px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 space-y-4 md:space-y-6 text-center lg:text-left"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent leading-tight">
                  Your AI Debugging Mentor
                </h1>
                <p className="text-lg md:text-xl text-amber-800/80 max-w-lg mx-auto lg:mx-0">
                  BugSage helps developers analyze logs, understand errors, and find solutions — powered by AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                  <SignIn />
                  <Link href="#features" className="px-6 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors text-center">
                    Learn More
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 mt-8 lg:mt-[23rem] lg:mx-auto"
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
          <section id="features" className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-800">How BugSage Works</h2>
              <p className="text-amber-700/80 mt-2">Smart error analysis in three simple steps</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-amber-200/50"
              >
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-amber-800 mb-2">1. Paste Your Logs</h3>
                <p className="text-sm md:text-base text-amber-700/80">Simply paste your error logs, stack traces, or console output into BugSage.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-amber-200/50"
              >
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-amber-800 mb-2">2. AI Analyzes Context</h3>
                <p className="text-sm md:text-base text-amber-700/80">Our AI parses the logs, detects technologies, and understands the root cause of errors.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-amber-200/50 sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none"
              >
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-amber-800 mb-2">3. Get Solutions Fast</h3>
                <p className="text-sm md:text-base text-amber-700/80">Receive detailed explanations, step-by-step fixes, and prevention tips.</p>
              </motion.div>
            </div>
          </section>

          {/* Technology Support Section */}
          <section className="py-12 md:py-20 px-4 md:px-6">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-800">Supported Technologies</h2>
              <p className="text-amber-700/80 mt-2">BugSage understands errors across various tech stacks</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto">
              {['React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Python', 'Java', '.NET'].map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-amber-200/50 flex items-center justify-center"
                >
                  <span className="text-sm md:text-base text-amber-700 font-medium">{tech}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="text-center max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Start Debugging Smarter Today</h2>
              <p className="mb-6 md:mb-8 text-sm md:text-base">Join other developers who have transformed their debugging workflow with BugSage&apos;s AI-powered analysis.</p>
              <div className="flex justify-center">
                <SignIn />
              </div>
            </div>
          </section>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="space-y-6 md:space-y-8 p-4 md:p-6">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">BugSage Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600">Paste your logs below to get AI-powered analysis and solutions</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </header>
          
          <LogAnalyzer />

          <section className="mt-8 md:mt-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Analysis History</h2>
            <AnalysisHistory />
          </section>
        </div>
      </SignedIn>
    </div>
  );
}
