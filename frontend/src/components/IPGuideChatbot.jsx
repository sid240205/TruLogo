"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithIPGuide } from '../services/geminiService';
import axios from 'axios';

// Default to localhost for dev, but ideally this should be an env var
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function IPGuideChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I am your IP Guide Assistant. Ask me anything about Trademarks, Copyrights, or IP in ASEAN.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // 1. Retrieve Context from Backend
            let context = "";
            try {
                const searchResponse = await axios.post(`${BACKEND_URL}/api/v1/search/`, {
                    query: userMessage,
                    k: 3
                });

                // Format context from search results
                if (searchResponse.data && searchResponse.data.length > 0) {
                    context = searchResponse.data.map(item => item.content).join("\n\n");
                }
            } catch (err) {
                console.warn("Backend search failed, proceeding with general knowledge:", err);
            }

            // 2. Generate Answer with Gemini
            const botResponse = await chatWithIPGuide(userMessage, context);

            setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'bot', content: "I apologize, but I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen
                    ? 'bg-neutral-800 text-neutral-400 rotate-90'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-110'
                    }`}
                aria-label="Toggle Chat"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-4 md:right-6 w-[90vw] md:w-[400px] h-[500px] max-h-[70vh] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Bot size={18} />
                        </div>
                        <div>
                            <h3 className="text-white font-serif font-medium">IP Assistant</h3>
                            <p className="text-xs text-neutral-400">Powered by TruLogo AI</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-neutral-700 text-neutral-300' : 'bg-emerald-500/10 text-emerald-400'
                                    }`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-emerald-600 text-white rounded-tr-sm'
                                    : 'bg-white/5 text-neutral-200 rounded-tl-sm border border-white/5'
                                    }`}>
                                    <div className="prose prose-invert prose-xs prose-p:my-1 prose-ul:my-1">
                                        <ReactMarkdown
                                            components={{
                                                a: ({ node, ...props }) => <a {...props} className="text-emerald-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer" />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-neutral-400" />
                                    <span className="text-xs text-neutral-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/5 bg-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask about IP rights..."
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-emerald-500 hover:bg-emerald-500/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
