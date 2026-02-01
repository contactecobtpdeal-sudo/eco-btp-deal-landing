
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MapPin, ExternalLink, Leaf, Phone, AlertTriangle, Camera, Shield, MoreVertical, CheckCircle2 } from 'lucide-react';
import { Message, User, UserRole } from '../types';

interface ChatWindowProps {
  currentUser: User;
  onClose: () => void;
}

const SafetyBanner = () => (
  <div className="bg-amber-50 border-2 border-amber-200 text-amber-900 p-3 rounded-2xl flex items-center gap-3 shadow-sm mx-4 mb-4 animate-in slide-in-from-top duration-500">
    <div className="bg-amber-500 p-2 rounded-full text-white shadow-md">
      <Shield size={16} strokeWidth={3} />
    </div>
    <div className="flex-1">
      <p className="text-[9px] font-black uppercase tracking-widest leading-none">Sécurité Chantier</p>
      <p className="text-[10px] font-bold opacity-90 mt-0.5">⚠️ EPI et chaussures de sécurité obligatoires pour le retrait.</p>
    </div>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'other', text: "Bonjour, je suis intéressé par votre lot de parpaings. Est-ce toujours dispo ?", timestamp: Date.now() - 3600000, type: 'text' },
    { id: '2', senderId: 'pro_1', text: "Bonjour ! Oui, c'est disponible immédiatement. Voici l'accès précis du chantier :", timestamp: Date.now() - 3000000, type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (text?: string, type: 'text' | 'location' | 'system' = 'text', locationData?: any) => {
    if (type === 'text' && !text?.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: currentUser.id,
      text: text,
      timestamp: Date.now(),
      type: type as any,
      locationData: locationData
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setShowLocationMenu(false);
    
    if (type === 'text') {
      setTimeout(() => {
        const reply: Message = {
          id: Math.random().toString(),
          senderId: 'other',
          text: "Parfait, je viendrai avec une camionnette demain matin. Merci !",
          timestamp: Date.now(),
          type: 'text'
        };
        setMessages(prev => [...prev, reply]);
      }, 1500);
    }
  };

  const shareLocation = () => {
    sendMessage(undefined, 'location', {
      address: "Chantier BatiConstruct - Zone Nord, Paris",
      lat: 48.8742,
      lng: 2.3592
    });
  };

  // Ouvrir l'itinéraire dans Google Maps ou Apple Maps
  const openDirections = (lat: number, lng: number, address: string) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMac = /Macintosh/.test(navigator.userAgent);

    // Encoder l'adresse pour l'URL
    const encodedAddress = encodeURIComponent(address);

    let url: string;

    if (isIOS || isMac) {
      // Apple Maps (fonctionne sur iOS et macOS)
      url = `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
    } else {
      // Google Maps (Android et autres)
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodedAddress}`;
    }

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* HEADER PROFESSIONNEL */}
      <div className="bg-white p-4 flex justify-between items-center border-b-2 border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-black border-2 border-white shadow-md">
              JB
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-tighter text-slate-900 leading-tight">Jean Bricole</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={10} className="text-green-500 fill-green-500" />
                <span className="text-[9px] text-green-600 font-black uppercase tracking-widest">Profil Vérifié</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => alert("Appel sécurisé via l'app...")} className="p-2.5 bg-slate-50 rounded-xl text-slate-600 active:scale-90 transition-all border border-slate-100 shadow-sm"><Phone size={18} /></button>
          <button onClick={() => alert("Menu signalement...")} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 active:scale-90 transition-all border border-slate-100"><MoreVertical size={18} /></button>
        </div>
      </div>

      {/* ZONE DE MESSAGES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-6 space-y-4 bg-slate-50">
        <SafetyBanner />
        
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isSystem = msg.type === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center px-8">
                <div className="bg-white text-slate-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex px-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-[2rem] shadow-sm overflow-hidden border-2 ${
                isMe ? 'bg-orange-500 border-orange-500 text-white rounded-tr-none' : 'bg-white border-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                {msg.type === 'text' ? (
                  <div className="p-4 text-sm font-bold leading-relaxed">{msg.text}</div>
                ) : (
                  <div className="w-64 bg-white">
                    <div
                      className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 relative group cursor-pointer flex items-center justify-center"
                      onClick={() => openDirections(msg.locationData?.lat, msg.locationData?.lng, msg.locationData?.address)}
                    >
                      {/* Fond stylisé de carte */}
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <MapPin size={24} className="text-orange-600 fill-white" strokeWidth={3} />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Accès Chantier</p>
                      <p className="text-xs font-black text-slate-900 leading-tight">{msg.locationData?.address}</p>
                      <button
                        onClick={() => openDirections(msg.locationData?.lat, msg.locationData?.lng, msg.locationData?.address)}
                        className="w-full mt-3 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-slate-100 active:scale-95 transition-all hover:bg-orange-600"
                      >
                        <ExternalLink size={12} /> Itinéraire
                      </button>
                    </div>
                  </div>
                )}
                <div className={`px-4 pb-2 text-[8px] font-black flex justify-end opacity-60 ${isMe ? 'text-white' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ZONE DE SAISIE AVEC LOGISTIQUE */}
      <div className="p-6 border-t-2 border-slate-100 bg-white sticky bottom-0 z-10">
        <div className="flex gap-3">
          <div className="flex gap-1.5">
            <button 
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className={`p-3.5 rounded-2xl transition-all border-2 ${showLocationMenu ? 'bg-orange-100 border-orange-500 text-orange-600 shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-orange-500 hover:border-orange-200'}`}
              title="Partager un emplacement"
            >
              <MapPin size={22} />
            </button>
            <button className="p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors" title="Prendre une photo">
              <Camera size={22} />
            </button>
          </div>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Écrivez un message..."
            className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:ring-0 focus:border-orange-500 outline-none transition-all"
          />
          
          <button 
            onClick={() => sendMessage(input)} 
            disabled={!input.trim()}
            className="p-3.5 bg-orange-600 text-white rounded-2xl shadow-xl shadow-orange-100 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:shadow-none"
          >
            <Send size={22} />
          </button>
        </div>
        
        {showLocationMenu && (
          <div className="absolute bottom-full left-6 mb-4 animate-in slide-in-from-bottom-2 fade-in">
            <button 
              onClick={shareLocation} 
              className="bg-slate-900 text-white px-6 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border-2 border-slate-700 active:scale-95 transition-all group"
            >
              <div className="bg-orange-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <MapPin size={18} className="text-white" />
              </div>
              <div>
                <p>Partager l'accès chantier</p>
                <p className="text-[8px] opacity-50">Envoie le point de RDV précis</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
