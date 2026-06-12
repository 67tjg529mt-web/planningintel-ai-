// ============================================================
// PlanningIntel AI — OpenAI Client Setup
// ============================================================

import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not set. Please add it to your environment variables.'
      );
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

export function getModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-4o';
}

export async function callOpenAI<T>(
  systemPrompt: string,
  userPrompt: string,
  responseSchema?: Record<string, unknown>,
  temperature = 0.3
): Promise<T> {
  const openai = getOpenAIClient();
  const model = getModel();

  const completion = await openai.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: responseSchema
      ? { type: 'json_object' as const }
      : undefined,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned empty response');
  }

  if (responseSchema) {
    try {
      return JSON.parse(content) as T;
    } catch {
      throw new Error('Failed to parse OpenAI JSON response');
    }
  }

  return content as unknown as T;
}