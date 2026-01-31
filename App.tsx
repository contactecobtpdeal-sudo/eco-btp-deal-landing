
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, Search, User as UserIcon, ShieldCheck, 
  Plus, Map, Download, 
  Bot, Shield, CheckCircle, Lock, MessageCircle, Leaf, 
  ShieldAlert, Info, Star, Share2, Megaphone, Users, X,
  Smartphone
} from 'lucide-react';
import Navbar from './components/Navbar';
import BrowseListings from './components/BrowseListings';
import ProDashboard from './components/ProDashboard';
import PostListing from './components/PostListing';
import ProPaywall from './components/ProPaywall';
import ChatWindow from './components/ChatWindow';
import TerritorialStats from './components/TerritorialStats';
import SupportChatbot from './components/SupportChatbot';
import NotificationCenter from './components/NotificationCenter';
import FlashDealBanner from './components/FlashDealBanner';
import WelcomeModal from './components/WelcomeModal';
import GuideModal from './components/GuideModal';
import AdminDashboard from './components/AdminDashboard';
import FeedbackCard from './components/FeedbackCard';
import MobileStatusBar from './components/MobileStatusBar';
import { User, UserRole, Material, Category, ListingStatus } from './types';

const MOCK_USER_PRO: User = {
  id: "pro_1",
  role: UserRole.PRO,
  name: "BatiConstruct PME",
  isPremium: true,
  siret: "123 456 789 00012",
  stats: { totalWasteDivertedKg: 1250, listingsPosted: 24, itemsCollected: 18 }
};

const MOCK_USER_ADMIN: User = {
  id: "admin_1",
  role: UserRole.ADMIN,
  name: "Super Admin",
  isPremium: true
};

const INITIAL_MATERIALS: Material[] = [
  {
    id: "m1",
    title: "Palette de Parpaings Creux",
    category: Category.GROS_OEUVRE,
    materialType: 'concrete',
    description: "Surplus de gros œuvre. Neuf.",
    photoUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
    quantity: "50 unités",
    price: 0,
    proId: "pro_1",
    proName: "BatiConstruct PME",
    location: { lat: 48.8566, lng: 2.3522, address: "Zone Industrielle Nord, Paris", distanceLabel: "📍 3.5 km" },
    availability: "Mardi 10h-12h",
    pickupDeadline: "Demain (Urgent)",
    status: ListingStatus.AVAILABLE,
    isPremiumOnly: true,
    createdAt: Date.now() - 3600000,
    weightEstimatedKg: 450
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER_PRO);
  const [activeTab, setActiveTab] = useState<'browse' | 'post' | 'dashboard' | 'profile' | 'stats' | 'admin'>('dashboard');
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showSupportBubble, setShowSupportBubble] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    const seenWelcome = localStorage.getItem('eco_btp_final_mobile_v1');
    if (!seenWelcome) {
      setShowWelcome(true);
    }

    const notifTimer = setTimeout(() => {
      setNotification("Prêt pour le terrain ? Preuve photo activée ! 📸");
    }, 5000);
    
    const bubbleTimer = setTimeout(() => {
      setShowSupportBubble(true);
    }, 8000);

    return () => {
      clearTimeout(notifTimer);
      clearTimeout(bubbleTimer);
    };
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    setShowGuide(true);
    localStorage.setItem('eco_btp_final_mobile_v1', 'true');
  };

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  const isProMode = currentUser.role === UserRole.PRO;
  const isAdminMode = currentUser.role === UserRole.ADMIN;

  const RoleSwitcherOverlay = () => (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[500] bg-slate-900/90 backdrop-blur-xl p-1 rounded-full border border-white/20 flex gap-1 shadow-2xl scale-75">
      <button 
        onClick={() => { setCurrentUser(MOCK_USER_PRO); setActiveTab('dashboard'); }} 
        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all flex items-center gap-2 ${currentUser.role === UserRole.PRO ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
      >
        <Shield size={12} /> App
      </button>
      <button 
        onClick={() => { setCurrentUser(MOCK_USER_ADMIN); setActiveTab('admin'); }} 
        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all flex items-center gap-2 ${currentUser.role === UserRole.ADMIN ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
      >
        <ShieldAlert size={12} /> Admin
      </button>
    </div>
  );

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto shadow-2xl border-x border-slate-200">
        <MobileStatusBar />
        <RoleSwitcherOverlay />
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 font-sans max-w-md mx-auto shadow-2xl border-x border-slate-200 ${isProMode ? 'bg-gray-50' : 'bg-slate-50'}`}>
      <MobileStatusBar />
      <RoleSwitcherOverlay />
      
      {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
      {showGuide && <GuideModal onClose={handleCloseGuide} />}
      <FlashDealBanner count={materials.length} />
      
      <header className="p-6 bg-white border-b flex justify-between items-center sticky top-10 z-50 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-orange-600 italic leading-none uppercase tracking-tighter">Eco-BTP Deal</h1>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Application Native</p>
        </div>
        <div className="bg-green-100 px-3 py-1 rounded-full text-green-700 text-[10px] font-black italic border border-green-200">14.5 T SAUVÉS 🌍</div>
      </header>

      <Navbar user={currentUser} onToggleRole={() => {}} />
      {notification && (
        <NotificationCenter message={notification} onClose={() => setNotification(null)} />
      )}

      <main className="px-6 pt-6 space-y-8">
        {activeTab === 'browse' && (
          <BrowseListings materials={materials} user={currentUser} onReserve={(id) => setMaterials(prev => prev.map(m => m.id === id ? {...m, status: ListingStatus.RESERVED} : m))} onOpenChat={() => setIsChatOpen(true)} />
        )}
        {activeTab === 'post' && (
          <PostListing onPost={(l) => { setMaterials([{...l, id: Math.random().toString(), createdAt: Date.now(), status: ListingStatus.AVAILABLE}, ...materials]); setActiveTab('dashboard'); }} onCancel={() => setActiveTab('dashboard')} />
        )}
        {activeTab === 'dashboard' && isProMode && (
          <ProDashboard 
            user={currentUser} 
            materials={materials} 
            onUpdateStatus={(id, s) => setMaterials(prev => prev.map(m => m.id === id ? {...m, status: s} : m))} 
            onDelete={(id) => setMaterials(prev => prev.filter(m => m.id !== id))} 
            onOpenChat={() => setIsChatOpen(true)} 
            unreadMessages={0} 
          />
        )}
        {activeTab === 'stats' && <TerritorialStats />}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-[2.5rem] flex items-center justify-center text-orange-600 mb-6 shadow-inner border-4 border-white relative transform rotate-6">
              <UserIcon size={48} />
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                <Shield size={18} className="text-blue-500" strokeWidth={3} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none italic">{currentUser.name}</h2>
            <div className="flex items-center gap-2 mt-4 text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <Star size={14} className="text-orange-500" fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Mobile Final Member</span>
            </div>
          </div>
        )}
        
        <FeedbackCard onOpenForm={() => alert("Merci de tester l'édition Mobile Finale !")} />

        <div className="mt-16 mb-8 flex flex-col items-center justify-center gap-4 text-slate-400">
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full">
            <Lock size={12} strokeWidth={3} className="text-slate-500" />
            <p className="text-[9px] font-black uppercase tracking-widest leading-none">Hébergement HDS/RGPD France</p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none max-w-md mx-auto">
        {showSupportBubble && !isSupportOpen && (
          <div className="bg-white p-5 rounded-[2rem] shadow-2xl border-2 border-slate-100 max-w-[240px] animate-in slide-in-from-right-8 duration-500 pointer-events-auto relative">
            <button onClick={() => setShowSupportBubble(false)} className="absolute top-3 right-3 text-slate-300 hover:text-slate-900"><X size={14} /></button>
            <div className="flex items-center gap-2 mb-2 font-black text-orange-600 uppercase text-[9px] tracking-widest leading-none">
              <Smartphone size={12} strokeWidth={3} /> MOBILE FINAL
            </div>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight italic">
              Videz vos chantiers en un clic.
            </p>
          </div>
        )}
        <button 
          onClick={() => { setIsSupportOpen(true); setShowSupportBubble(false); }}
          className="p-5 bg-orange-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group pointer-events-auto border-4 border-white shadow-orange-100"
        >
          <MessageCircle size={32} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {isChatOpen && <ChatWindow currentUser={currentUser} onClose={() => setIsChatOpen(false)} />}
      <SupportChatbot isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex justify-between items-center z-50 shadow-2xl max-w-md mx-auto border-x border-slate-200">
        <button onClick={() => setActiveTab('browse')} className={`flex flex-col items-center gap-1 transition-colors flex-1 ${activeTab === 'browse' ? 'text-orange-600' : 'text-slate-400'}`}>
          <Search size={22} /><span className="text-[10px] font-black uppercase tracking-tighter">Marché</span>
        </button>
        <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 transition-colors flex-1 ${activeTab === 'stats' ? 'text-orange-600' : 'text-slate-400'}`}>
          <Map size={22} /><span className="text-[10px] font-black uppercase tracking-tighter">Impact</span>
        </button>
        <button onClick={() => setActiveTab('post')} className="flex flex-col items-center gap-1 -mt-10 flex-1">
          <div className={`p-4 rounded-full shadow-xl transition-all active:scale-90 border-4 border-white bg-orange-500 hover:bg-orange-600`}>
            <Plus size={36} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase mt-1 text-slate-400">Publier</span>
        </button>
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-colors flex-1 ${activeTab === 'dashboard' ? 'text-orange-600' : 'text-slate-400'}`}>
          <LayoutGrid size={22} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Tableau</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-colors flex-1 ${activeTab === 'profile' ? 'text-orange-600' : 'text-slate-400'}`}>
          <UserIcon size={22} /><span className="text-[10px] font-black uppercase tracking-tighter">Profil</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
