import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, VehicleSelection } from '../types';
import { Sparkles, X, Send, Bot, User, MessageSquare, Phone, RefreshCw, Car } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

interface AiPartsAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle: VehicleSelection | null;
}

const QUICK_PROMPTS = [
  "Which oil is best for Toyota Hilux / Prado in Kenya?",
  "Tire size recommendation for off-road 4x4",
  "Is the Toyota Hilux Gearbox Gasket in stock at Kirinyaga Rd?",
  "How to tell if shock absorbers or ball joints are worn?",
  "Do you deliver upcountry to Kisumu / Mombasa / Nakuru?",
];

export const AiPartsAdvisor: React.FC<AiPartsAdvisorProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **Rissau Auto Agency** Parts Specialist 🛠️\n\nI can help you find exact genuine replacement parts, recommend the correct oil grade (e.g. 5W-30 vs 20W-50), check tire sizes, advise on gearbox gaskets, and give store details for our **Kirinyaga Road** & **Umoja** branches.\n\nHow can I help your vehicle today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userCar: selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : null,
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm happy to help. For immediate order confirmation or special quotes, you can also contact our parts counter at 0728090599.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newMessages, botMsg]);
    } catch (err) {
      console.error(err);
      const fallbackBotMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `Thank you for your question. We stock genuine tires, gearbox gaskets, oils, and suspension parts at our **Kirinyaga Road (CBD)** and **Umoja (Kangundo Road)** branches. Please call or WhatsApp us on **${BUSINESS_INFO.phones[0]}** for instant confirmation!`,
        timestamp: 'Just now',
      };
      setMessages([...newMessages, fallbackBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn text-white">
      <div className="relative w-full max-w-lg h-[92vh] sm:h-[88vh] bg-[#111] border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#050505] p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 text-black flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black uppercase font-display text-base text-white">
                  AI Auto Parts Advisor
                </h3>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                Rissau Auto Agency • Expert Spares Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Vehicle Context Bar */}
        {selectedVehicle && (
          <div className="bg-orange-500/10 px-4 py-2 border-b border-orange-500/20 flex items-center justify-between text-xs text-orange-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-orange-500" />
              Tailoring advice for: <strong className="text-white">{selectedVehicle.make} {selectedVehicle.model}</strong>
            </span>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0a0a0a]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-orange-500 text-black flex items-center justify-center shrink-0 mt-1 font-black">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-4 text-xs sm:text-sm leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-white text-black border-white font-medium'
                    : 'bg-[#161616] text-zinc-200 border-zinc-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <span
                  className={`text-[10px] uppercase tracking-wider block mt-2 font-bold ${
                    msg.role === 'user' ? 'text-zinc-500 text-right' : 'text-zinc-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 bg-zinc-800 text-white flex items-center justify-center shrink-0 mt-1 font-black">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-zinc-400 bg-[#161616] p-3 border border-zinc-800 w-fit">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>Checking Rissau parts catalog &amp; fitment data...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-[#050505] border-t border-zinc-800 flex gap-1.5 overflow-x-auto no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[10px] font-black uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 border border-zinc-800 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-3 bg-[#111] border-t border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about parts, oil grade, tire sizes, prices..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="p-3 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-black font-black uppercase transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Counter Contact Link */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-2 px-1">
            <span>Direct Counter Hotline:</span>
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=Hello%20Rissau%20Auto,%20I%20am%20chatting%20with%20your%20AI%20and%20need%20human%20assistance.`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              WhatsApp Specialist ({BUSINESS_INFO.phones[0]})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
