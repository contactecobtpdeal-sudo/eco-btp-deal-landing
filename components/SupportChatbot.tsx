import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Bot, Recycle, Calculator, Truck, Leaf, TreePine, Car, Loader2 } from 'lucide-react';

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

// Coefficients CO2 (kg CO2 évité par kg de matériau réemployé)
const CO2_COEFFICIENTS: Record<string, number> = {
  acier: 1.8,
  béton: 0.2,
  beton: 0.2,
  bois: 0.5,
  aluminium: 8.0,
  cuivre: 3.0,
  isolant: 2.5,
  parpaing: 0.2,
  tuile: 0.4,
  carrelage: 0.5,
  plâtre: 0.15,
  verre: 0.9,
};

// Mentions légales
const LEGAL_INFO = {
  company: "AISSA Oullfa EI",
  codeAPE: "74.90B",
  city: "Cergy"
};

type QuickReplyType = 'surplus' | 'impact' | 'transport' | null;

interface SurplusData {
  step: 'type' | 'quantity' | 'state' | 'location' | 'complete';
  type?: string;
  quantity?: number;
  unit?: string;
  state?: string;
  location?: string;
}

const QuickReplies: React.FC<{ onSelect: (type: QuickReplyType) => void; visible: boolean }> = ({ onSelect, visible }) => {
  if (!visible) return null;

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border-t border-slate-100">
      <button
        onClick={() => onSelect('surplus')}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-orange-200 text-orange-700 rounded-xl text-xs font-bold hover:bg-orange-50 hover:border-orange-400 transition-all active:scale-95"
      >
        <Recycle size={16} />
        Déclarer un surplus
      </button>
      <button
        onClick={() => onSelect('impact')}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-green-200 text-green-700 rounded-xl text-xs font-bold hover:bg-green-50 hover:border-green-400 transition-all active:scale-95"
      >
        <Calculator size={16} />
        Calculer mon impact
      </button>
      <button
        onClick={() => onSelect('transport')}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-200 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-50 hover:border-blue-400 transition-all active:scale-95"
      >
        <Truck size={16} />
        Trouver un transport
      </button>
    </div>
  );
};

const ImpactDisplay: React.FC<{ kgSaved: number; co2Avoided: number }> = ({ kgSaved, co2Avoided }) => {
  const treesEquivalent = Math.round(co2Avoided / 200); // 1 arbre absorbe ~200kg CO2/an
  const kmCarAvoided = Math.round(co2Avoided / 0.12); // ~120g CO2/km

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-100 my-2">
      <div className="flex items-center gap-2 mb-3">
        <Leaf className="text-green-600" size={20} />
        <span className="text-xs font-black uppercase tracking-wider text-green-800">Votre Impact Positif</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 border border-green-100">
          <p className="text-2xl font-black text-green-600">{kgSaved.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase">kg réemployés</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-green-100">
          <p className="text-2xl font-black text-emerald-600">{co2Avoided.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase">kg CO2 évités</p>
        </div>
      </div>
      <div className="flex gap-4 mt-3 pt-3 border-t border-green-100">
        <div className="flex items-center gap-2">
          <TreePine size={16} className="text-green-600" />
          <span className="text-xs font-bold text-green-700">{treesEquivalent} arbres/an</span>
        </div>
        <div className="flex items-center gap-2">
          <Car size={16} className="text-blue-600" />
          <span className="text-xs font-bold text-blue-700">{kmCarAvoided.toLocaleString()} km évités</span>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start">
    <div className="bg-white text-slate-700 border-2 border-slate-50 rounded-[1.5rem] rounded-tl-none p-4 flex items-center gap-1">
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

const SupportChatbot: React.FC<SupportChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis Eco-Assist Master, votre assistant expert en économie circulaire pour le BTP. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [currentFlow, setCurrentFlow] = useState<QuickReplyType>(null);
  const [surplusData, setSurplusData] = useState<SurplusData>({ step: 'type' });
  const [userImpact, setUserImpact] = useState({ kgSaved: 0, co2Avoided: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = useCallback((text: string, sender: 'bot' | 'user') => {
    const newMsg: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      sender,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, []);

  const callClaudeAPI = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const apiMessages = conversationHistory
        .filter(m => m.id !== '1') // Skip initial greeting
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      apiMessages.push({ role: 'user', content: userMessage });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, stream: false })
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Claude API error:', error);
      return "Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?";
    }
  };

  const calculateCO2 = (type: string, quantity: number): number => {
    const normalizedType = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const [material, coef] of Object.entries(CO2_COEFFICIENTS)) {
      if (normalizedType.includes(material)) {
        return Math.round(quantity * coef);
      }
    }
    return Math.round(quantity * 0.5); // Default coefficient
  };

  const handleSurplusFlow = async (userInput: string) => {
    const input = userInput.toLowerCase();

    switch (surplusData.step) {
      case 'type':
        setSurplusData(prev => ({ ...prev, type: userInput, step: 'quantity' }));
        addMessage(userInput, 'user');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(`Parfait, ${userInput} ! Quelle quantité avez-vous à déclarer ? (en kg ou tonnes, par exemple "500 kg" ou "2 tonnes")`, 'bot');
        }, 800);
        break;

      case 'quantity':
        const match = input.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilo|tonnes?|t)?/i);
        if (match) {
          let qty = parseFloat(match[1].replace(',', '.'));
          const unit = match[2]?.toLowerCase() || 'kg';
          if (unit.startsWith('t')) qty *= 1000; // Convert tonnes to kg

          setSurplusData(prev => ({ ...prev, quantity: qty, unit: 'kg', step: 'state' }));
          addMessage(userInput, 'user');
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage("Super ! Quel est l'état du matériau ? (neuf, bon état, à restaurer)", 'bot');
          }, 800);
        } else {
          addMessage(userInput, 'user');
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage("Je n'ai pas bien compris la quantité. Pouvez-vous préciser ? (ex: 500 kg, 2 tonnes)", 'bot');
          }, 500);
        }
        break;

      case 'state':
        setSurplusData(prev => ({ ...prev, state: userInput, step: 'location' }));
        addMessage(userInput, 'user');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage("Dernière étape ! Où se trouve le matériau ? (ville ou adresse du chantier)", 'bot');
        }, 800);
        break;

      case 'location':
        const finalData = { ...surplusData, location: userInput, step: 'complete' as const };
        setSurplusData(finalData);
        addMessage(userInput, 'user');
        setIsTyping(true);

        const co2Saved = calculateCO2(finalData.type || '', finalData.quantity || 0);
        const newImpact = {
          kgSaved: userImpact.kgSaved + (finalData.quantity || 0),
          co2Avoided: userImpact.co2Avoided + co2Saved
        };
        setUserImpact(newImpact);

        setTimeout(() => {
          setIsTyping(false);
          addMessage(
            `Excellent choix pour la planète ! Votre déclaration est enregistrée :\n\n` +
            `- Matériau : ${finalData.type}\n` +
            `- Quantité : ${finalData.quantity?.toLocaleString()} kg\n` +
            `- État : ${finalData.state}\n` +
            `- Localisation : ${finalData.location}\n\n` +
            `Impact estimé : ${co2Saved.toLocaleString()} kg de CO2 évités ! C'est l'équivalent de ${Math.round(co2Saved / 0.12).toLocaleString()} km en voiture.`,
            'bot'
          );
          setCurrentFlow(null);
          setSurplusData({ step: 'type' });
          setShowQuickReplies(true);
        }, 1200);
        break;
    }
  };

  const handleQuickReply = (type: QuickReplyType) => {
    setShowQuickReplies(false);
    setCurrentFlow(type);

    switch (type) {
      case 'surplus':
        addMessage("Je voudrais déclarer un surplus de matériaux", 'user');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(
            "Excellent choix pour la planète ! En déclarant vos surplus, vous contribuez activement à l'économie circulaire du BTP.\n\n" +
            "Quel type de matériau souhaitez-vous déclarer ? (ex: béton, acier, bois, isolant, parpaings...)",
            'bot'
          );
        }, 800);
        break;

      case 'impact':
        addMessage("Je voudrais connaître mon impact environnemental", 'user');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          if (userImpact.kgSaved > 0) {
            addMessage("Voici le récapitulatif de votre contribution à l'économie circulaire :", 'bot');
          } else {
            addMessage(
              "Vous n'avez pas encore déclaré de surplus de matériaux. Commencez dès maintenant pour suivre votre impact positif sur l'environnement !\n\n" +
              "Chaque kg de matériau réemployé, c'est du CO2 évité.",
              'bot'
            );
          }
          setCurrentFlow(null);
          setShowQuickReplies(true);
        }, 800);
        break;

      case 'transport':
        addMessage("J'ai besoin d'aide pour le transport", 'user');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(
            "Je peux vous aider à trouver la solution logistique adaptée !\n\n" +
            "Pour vous orienter, j'aurais besoin de quelques informations :\n" +
            "- Poids et volume approximatifs\n" +
            "- Adresse de départ et d'arrivée\n" +
            "- Contraintes d'accès (hauteur, largeur, grue nécessaire ?)\n\n" +
            "Décrivez-moi votre besoin et je vous proposerai des solutions adaptées.",
            'bot'
          );
          setCurrentFlow(null);
          setShowQuickReplies(false);
        }, 1000);
        break;
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userText = text.trim();
    setInput('');

    // Handle surplus flow
    if (currentFlow === 'surplus') {
      handleSurplusFlow(userText);
      return;
    }

    // Regular conversation
    addMessage(userText, 'user');
    setIsTyping(true);
    setShowQuickReplies(false);

    const response = await callClaudeAPI(userText, messages);

    setIsTyping(false);
    addMessage(response, 'bot');
    setShowQuickReplies(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-end p-4 sm:p-8 pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto" onClick={onClose} />
      <div className="relative w-full max-w-[420px] h-[600px] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl shadow-lg">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-tight">Eco-Assist Master</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expert BTP en ligne</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-orange-600 text-white rounded-[1.25rem] rounded-tr-none'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-[1.25rem] rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Impact display after impact query */}
          {currentFlow === null && userImpact.kgSaved > 0 && messages[messages.length - 1]?.text.includes('récapitulatif') && (
            <ImpactDisplay kgSaved={userImpact.kgSaved} co2Avoided={userImpact.co2Avoided} />
          )}

          {isTyping && <TypingIndicator />}
        </div>

        {/* Quick Replies */}
        <QuickReplies onSelect={handleQuickReply} visible={showQuickReplies && !currentFlow} />

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 bg-slate-50 rounded-xl p-1.5 border border-slate-200">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
              placeholder={currentFlow === 'surplus' ? "Votre réponse..." : "Posez votre question..."}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm font-medium outline-none border-none focus:ring-0"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-orange-600 text-white rounded-lg shadow-lg active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          {/* Mentions légales */}
          <p className="text-[8px] text-slate-400 text-center mt-2">
            {LEGAL_INFO.company} • APE {LEGAL_INFO.codeAPE} • {LEGAL_INFO.city}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportChatbot;
