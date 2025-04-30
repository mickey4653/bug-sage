import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

    const contextPrompt = context.frontend || context.backend || context.platform
      ? `\nContext:\n- Frontend: ${context.frontend || 'Not specified'}\n- Backend: ${context.backend || 'Not specified'}\n- Platform: ${context.platform || 'Not specified'}`
      : '';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert debugging assistant. Analyze the provided logs and error messages to identify the root cause and suggest solutions. Format your response in markdown with clear sections for the problem, analysis, and solution.'
        },
        {
          role: 'user',
          content: `Please analyze these logs and provide a detailed explanation of the issue, its root cause, and potential solutions:${contextPrompt}\n\nLogs:\n${logs}`
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