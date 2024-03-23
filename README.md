Before we raise a frothy seed round and build a billion dollar business, we need to set-up our project. We've written some code to get you started — follow the instructions below to download the code and run the app.

## Prerequisites

Before you start, make sure you have the following:

Node.js 18+ installed on your local development machine.
- An OpenAI API key.
- If you haven't obtained your OpenAI API key, you can do so by signing up on the OpenAI website.

## Create an Application

```
pnpm dlx create-next-app my-ai-app
```

Navigate to the newly created directory:

```
cd my-ai-app
```

## Install Dependencies

```
pnpm install ai openai
```

## Configure OpenAI API Key

```
touch .env.local
```

Edit the .env.local file:

```
OPENAI_API_KEY=xxxxxxxxx
```


## Create an API Route

Create a Next.js Route Handler, app/api/chat/route.ts. This handler will be using the Edge Runtime to generate a chat completion via OpenAI, which will then be streamed back to Next.js.

Here's what the route handler should look like:

```
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// Set the runtime to edge for best performance
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { messages } = await req.json();
 
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
  });
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
```

In the above code, the openai.chat.completions.create method gets a response stream from the OpenAI API. We then pass the response into the OpenAIStream provided by this library. Then we use StreamingTextResponse to set the proper headers and response details in order to stream the response back to the client.

## Wire up a UI

Finally, create a client chat component that shows a list of chat messages and provides a user message input.

Replace the boilerplate code in page.tsx with the following code:

```
'use client';
 
import { useChat } from 'ai/react';
 
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}
 
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

This component utilizes the useChat hook, which will, by default, use the POST route handler we created earlier. The hook provides functions and state for handling user input and form submission. The useChat hook provides multiple utility functions and state variables:

- messages - The current chat messages, an array of objects with id, role, and content properties (among others).
- input - This is the current value of the user's input field.
- handleInputChange and handleSubmit - These functions handle user interactions such as typing into the input field and submitting the form, respectively.
- isLoading This boolean indicates whether the API request is in progress or not.

## Running the Application

```
pnpm run dev
```

Now your application is up and running! Test it by entering a message and see the AI chatbot respond in real-time.

