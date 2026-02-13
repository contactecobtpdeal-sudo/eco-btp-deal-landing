
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, AlertTriangle, Bot, MessageCircle, ShieldAlert, FileText, HelpCircle, Shield, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: number;
}

interface SupportChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportChatbot: React.FC<SupportChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis Eco-Assist 🤖. Master Assistant RSE. La phase de test est terminée, merci pour votre participation !",
      sender: 'bot',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Signalement Master enregistré. Nos équipes finalisent la version commerciale basée sur vos retours.",
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-end p-4 sm:p-8 pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto" onClick={onClose} />
      <div className="relative w-full max-w-[400px] h-[500px] bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-slate-100">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b-4 border-orange-600">
          <div className="flex items-center gap-4">
            <Bot size={24} className="text-orange-500" />
            <div>
              <h4 className="font-black text-sm uppercase tracking-tight">Eco-Assist Master</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Support Finalisé</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-4 text-xs font-bold leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-orange-600 text-white rounded-[1.5rem] rounded-tr-none' 
                  : 'bg-white text-slate-700 border-2 border-slate-50 rounded-[1.5rem] rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <div className="flex gap-2.5 bg-slate-50 rounded-2xl p-1.5 border border-slate-200">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Message..." 
              className="flex-1 bg-transparent px-4 py-2 text-xs font-bold outline-none border-none focus:ring-0"
            />
            <button 
              onClick={() => handleSend(input)}
              className="p-3 bg-orange-600 text-white rounded-xl shadow-lg active:scale-90 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatbot;
