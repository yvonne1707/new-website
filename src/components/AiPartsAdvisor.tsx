import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, VehicleSelection, BusinessProfile, BranchLocation } from '../types';
import { Sparkles, X, Send, Bot, User, MessageSquare, Phone, RefreshCw, Car } from 'lucide-react';

interface AiPartsAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle: VehicleSelection | null;
  businessProfile: BusinessProfile;
  branches: BranchLocation[];
}

const QUICK_PROMPTS = [
  "Which oil is best for Toyota Hilux / Prado in Kenya?",
  "Tire size recommendation for off-road 4x4",
  "Is the Toyota Hilux Gearbox Gasket in stock?",
  "How to tell if shock absorbers or ball joints are worn?",
  "Do you deliver upcountry via 2NK / Guardian / EasyCoach?",
];

export const AiPartsAdvisor: React.FC<AiPartsAdvisorProps> = ({
  isOpen,
  onClose,
  selectedVehicle,
  businessProfile,
  branches,
}) => {
  const branchSummary = branches.map((b) => b.shortName).join(' & ') || 'Nairobi Hubs';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **${businessProfile.name}** Parts Specialist 🛠️\n\nI can help you find exact genuine replacement parts, recommend the correct oil grade (e.g. 5W-30 vs 20W-50), check tire sizes, advise on gearbox gaskets, and give store details for our **${branchSummary}** branches.\n\nHow can I help your vehicle today?`,
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          vehicleContext: selectedVehicle
            ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.engine || 'Standard'})`
            : undefined,
          businessProfile: {
            name: businessProfile.name,
            branches: branches.map((b) => `${b.name} (${b.address})`),
            phones: businessProfile.phones,
            whatsapp: businessProfile.whatsapp,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm ready to assist with your auto parts query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newMessages, botMsg]);
    } catch (err) {
      // Fallback local expert guidance
      const fallbackReplies: Record<string, string> = {
        oil: `For Kenyan driving conditions (dust, heavy traffic, variable temperatures), we recommend **Castrol GTX Diesel 15W-40** or **Castrol Magnatec 5W-30 Synthetic** for modern common-rail engines. Available at ${branchSummary}.`,
        tire: `For rough road and off-road reliability, the **Michelin LTX Force 265/65R17** or **Dunlop Grandtrek AT3G** offer superior puncture resistance. In stock with free fitting at our Umoja branch!`,
        gasket: `We stock OEM **Toyota, Isuzu & Nissan Gearbox & Cylinder Head Gaskets**. All made from high-temperature graphite/multi-layer steel to withstand high pressure.`,
        sacco: `Yes! We dispatch countrywide daily via trusted matatu Saccos (2NK, Transline, EasyCoach, Guardian, Mololine) and Nairobi courier boda-boda.`,
      };

      const lower = query.toLowerCase();
      let matchedKey = 'oil';
      if (lower.includes('tire') || lower.includes('tyre')) matchedKey = 'tire';
      else if (lower.includes('gasket') || lower.includes('gearbox')) matchedKey = 'gasket';
      else if (lower.includes('deliver') || lower.includes('sacco') || lower.includes('transport') || lower.includes('town')) matchedKey = 'sacco';

      const fallbackMsg: ChatMessage = {
        id: `bot-fb-${Date.now()}`,
        role: 'assistant',
        content: `${fallbackReplies[matchedKey]}\n\nFor instant stock reservation, contact our counter desk at **${businessProfile.phones[0]}** or chat on WhatsApp (+${businessProfile.whatsapp}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newMessages, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        id="ai-advisor-modal"
        className="relative bg-[#111111] text-white w-full max-w-2xl h-[85vh] flex flex-col border border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#050505] p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 text-black flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black uppercase font-display text-white">
                  AI Parts Specialist
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase px-2 py-0.5">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                {businessProfile.name} • {branchSummary}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 flex items-center justify-center border border-zinc-800 cursor-pointer"
            aria-label="Close Advisor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Car Notice */}
        {selectedVehicle && (
          <div className="bg-orange-500/15 border-b border-orange-500/30 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider">
              <Car className="w-3.5 h-3.5 text-orange-500" />
              <span>Active Context: <strong className="text-white">{selectedVehicle.make} {selectedVehicle.model}</strong></span>
            </div>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-orange-500 text-black flex items-center justify-center shrink-0 font-bold mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 border leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-[#161616] border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <span className="text-[10px] text-zinc-500 font-mono block mt-2 text-right">
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-zinc-700 text-white flex items-center justify-center shrink-0 font-bold mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-zinc-400 text-xs">
              <div className="w-8 h-8 bg-orange-500 text-black flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <span>Searching spare parts catalog &amp; fitment database...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#0c0c0c] px-4 py-2 border-t border-zinc-800 flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap bg-zinc-900 hover:bg-orange-500 hover:text-black text-zinc-400 px-3 py-1.5 border border-zinc-800 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#050505] border-t border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about part numbers, tire sizes, oil grades, prices..."
              className="flex-1 px-4 py-3 bg-[#111] border border-zinc-800 text-white text-xs sm:text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-black uppercase text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
