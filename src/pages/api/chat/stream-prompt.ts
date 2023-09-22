import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next'

export const runtime = 'edge'

 
const functions: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function[] = [
  {
    name: 'logout',
    description: 'Logs the user out of the current application.',
    parameters: {
      type: 'object',
      properties: {
      },
      required: [],
    },
  },
];

export default async function handler(
    req: Request,
    res: NextApiResponse<any>
  ) {
    const { messages } = await req.json();

    const openai = new OpenAI({
        apiKey: process.env.OPEN_API_KEY,
      });
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages,
    functions: functions,
  })
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}