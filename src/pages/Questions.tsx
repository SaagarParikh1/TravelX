import React, { useState } from 'react';
import { MessageCircle, Send, Loader, AlertCircle } from 'lucide-react';
import OpenAI from 'openai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const isValidApiKey = apiKey && apiKey !== 'your_openai_api_key';

let openai: OpenAI | null = null;
if (isValidApiKey) {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
}

const Questions = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    if (!isValidApiKey) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Please configure your OpenAI API key in the .env file. Set VITE_OPENAI_API_KEY to your actual API key.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    setLoading(true);

    try {
      if (!openai) throw new Error('OpenAI client not initialized');

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable travel assistant. Provide helpful, concise travel recommendations and tips. Focus on practical advice about destinations, activities, and travel planning."
          },
          {
            role: "user",
            content: newMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      let errorMessage = "An error occurred while processing your request.";
      
      if (error.error?.type === 'insufficient_quota') {
        setQuotaExceeded(true);
        errorMessage = "The API key has exceeded its quota. Please use a different API key with available credits.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-50 to-sky-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Travel Assistant</h1>
          <p className="text-gray-600">Your personal AI guide for travel planning</p>
        </div>
        
        {(!isValidApiKey || quotaExceeded) && (
          <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-amber-500 mr-3" />
              <div>
                <p className="text-amber-700 font-medium">
                  {quotaExceeded 
                    ? "API Quota Exceeded" 
                    : "OpenAI API Key Not Configured"}
                </p>
                <p className="text-amber-600 text-sm mt-1">
                  {quotaExceeded
                    ? "The current API key has exceeded its usage limit. Please use a different API key with available credits."
                    : "Please set your OpenAI API key in the .env file to use the AI assistant."}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-12">
                <MessageCircle className="h-16 w-16 mx-auto mb-6 opacity-50" />
                <p className="text-xl font-medium mb-2">Ask me anything about your travel plans!</p>
                <p className="text-gray-400">I can help with destination recommendations, itinerary planning, and travel tips.</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-6 shadow-md ${
                    message.sender === 'user'
                      ? 'bg-violet-500 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <p className="text-lg leading-relaxed">{message.text}</p>
                  <span className="text-sm opacity-75 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <Loader className="h-6 w-6 animate-spin text-violet-500" />
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 border-t border-gray-100">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me anything about your travel plans..."
                className="flex-1 px-6 py-4 text-lg border-2 border-violet-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loading || quotaExceeded || !isValidApiKey}
                className="px-8 py-4 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 flex items-center justify-center min-w-[4rem]"
              >
                {loading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  <Send className="h-6 w-6" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Questions;