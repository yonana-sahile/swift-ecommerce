import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X, User, Bot, Loader } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  logAPI: (method: "GET" | "POST" | "PUT" | "DELETE", url: string, status: number, payload?: any, response?: any) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export default function AIChatbot({ isOpen, onClose, onOpen, logAPI }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "assistant",
      text: "Greetings. I am Swift Concierge, your curated atelier advisor. May I assist you with styled desk setup curations, premium audiophile selections, or finding customized items?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const historyPayload = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    const apiPayload = {
      message: textToSend,
      chatHistory: historyPayload,
    };

    const url = "/api/chatbot";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      const data = await response.json();
      logAPI("POST", url, response.status, apiPayload, data);

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-bot`,
            role: "assistant",
            text: data.response,
          },
        ]);
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: "assistant",
          text: "I experienced a brief sync pause on our REST ports. However, let me guide you: Try typing 'headphones', 'keyboard', or 'desk shelf' for details, or use promo code SWIFTMIND for 15% off!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Workspace suggestions?",
    "Tell me about Aether Headphones",
    "Is there any active promo code?",
    "Show mechanical keyboards",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-chat-concierge">
      {/* Floating Sparkly Chat Bubble */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="p-4 bg-neutral-900 text-white rounded-full shadow-2xl hover:bg-neutral-800 hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer border border-neutral-800"
        >
          <Sparkles className="text-amber-300 animate-pulse" size={20} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
            Consult Concierge
          </span>
        </button>
      )}

      {/* Expanded Messaging Interface */}
      {isOpen && (
        <div className="bg-white border border-neutral-100 rounded-2xl shadow-2xl w-[90vw] sm:w-[380px] h-[500px] flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-neutral-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-neutral-800 rounded-lg">
                <Sparkles size={16} className="text-amber-300 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-wider uppercase">Swift AI Concierge</h3>
                <p className="text-[10px] text-amber-300/80 font-mono">Powered by Gemini 3.5 Flash</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    m.role === "user" ? "bg-neutral-200 text-neutral-700" : "bg-neutral-950 text-white"
                  }`}
                >
                  {m.role === "user" ? <User size={13} /> : <Bot size={13} />}
                </div>

                {/* Text Bubble */}
                <div
                  className={`rounded-2xl p-3 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-neutral-900 text-white rounded-tr-none"
                      : "bg-white text-neutral-800 border border-neutral-100 shadow-sm rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 mr-auto max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs flex-shrink-0">
                  <Bot size={13} />
                </div>
                <div className="bg-white border border-neutral-100 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-1.5 shadow-sm text-neutral-400">
                  <Loader size={12} className="animate-spin text-neutral-400" />
                  <span>Concierge is writing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Shelf */}
          {messages.length === 1 && !isTyping && (
            <div className="p-3 border-t border-neutral-50 bg-neutral-50 flex gap-1.5 overflow-x-auto select-none no-scrollbar">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="bg-white hover:bg-neutral-100 border border-neutral-200 rounded-full px-3 py-1.5 text-[10px] text-neutral-600 font-medium whitespace-nowrap transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-neutral-100 bg-white flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about our workspace..."
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 active:scale-95 disabled:bg-neutral-100 disabled:text-neutral-400 transition-all cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
