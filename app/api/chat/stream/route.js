import { GoogleGenerativeAI } from '@google/generative-ai';

// This line is the fix: it forces the route to run in the Node.js environment
export const runtime = 'nodejs';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Function to create a streaming response
function streamToResponse(stream, res) {
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        try {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        } catch (e) {
          console.error('Error processing chunk:', e);
        }
      }
      controller.close();
    },
    cancel() {
      console.log('Stream cancelled by client.');
    },
  });
  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const result = await chat.sendMessageStream(message);

    // Return a streaming response
    return streamToResponse(result.stream);
  } catch (error) {
    console.error('Error in Gemini API stream route:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
