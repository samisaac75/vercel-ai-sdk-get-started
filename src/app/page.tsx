'use client';

import { useChat } from 'ai/react';
import { Input } from '@nextui-org/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap text-white">
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}

        <form onSubmit={handleSubmit}>
          <Input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            variant='bordered'
          />
        </form>
      </div>
    </main>
  );
}