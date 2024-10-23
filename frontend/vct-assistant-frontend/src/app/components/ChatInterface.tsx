"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: `This is a simulated response to: "${input}"`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);

    // TODO: Replace with actual API call
    // try {
    //   const response = await fetch('/api/chat', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ message: input }),
    //   })
    //   const data = await response.json()
    //   setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    // } catch (error) {
    //   console.error('Error:', error)
    // } finally {
    //   setIsLoading(false)
    // }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
      <div className="flex-grow overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-3 rounded-3xl max-w-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center">
              <span className="inline-block p-2 rounded-lg bg-gray-700 text-gray-300">
                Thinking...
              </span>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow bg-gray-700 border border-gray-600 rounded-3xl text-white p-6 pr-16"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 bg-blue-600 text-white p-3 rounded-full flex items-center justify-center disabled:bg-blue-400"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
