import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { parseLog, structureLogForPrompt } from '../../lib/logParser';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { logs, context } = await request.json();

    if (!logs) {
      return NextResponse.json(
        { error: 'No logs provided' },
        { status: 400 }
      );
    }

    // Parse the logs to extract structured information
    const parsedLog = parseLog(logs);
    
    // Structure the logs for a more detailed prompt
    const structuredLogs = structureLogForPrompt(parsedLog, logs);

    // Create a technology-specific system prompt based on context and parsed info
    let systemPrompt = 'You are an expert debugging assistant specialized in identifying root causes from error logs. ';
    
    // Add framework-specific expertise if detected or provided
    const framework = parsedLog.framework || context.frontend;
    const language = parsedLog.language || context.backend;
    
    if (framework) {
      systemPrompt += `You have deep expertise in ${framework} and common issues with this framework. `;
    }
    
    if (language) {
      systemPrompt += `You are proficient in ${language} and can identify typical bugs in this language. `;
    }
    
    // Add platform expertise if detected or provided
    const platform = context.platform;
    if (platform) {
      systemPrompt += `You understand deployment issues on ${platform} platforms. `;
    }
    
    // Add general guidance for response structure
    systemPrompt += `Analyze the provided logs to identify the root cause and suggest solutions.
      Format your response in markdown with these sections:
      1. 💥 Problem: A clear statement of what went wrong
      2. 🔍 Root Cause Analysis: Detail what caused the issue
      3. 🛠️ Solution: Step-by-step instructions to fix the issue
      4. 🧐 Prevention: How to prevent this issue in the future`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please analyze these logs with your expertise:

${structuredLogs}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = completion.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing logs:', error);
    return NextResponse.json(
      { error: 'Failed to analyze logs' },
      { status: 500 }
    );
  }
} 