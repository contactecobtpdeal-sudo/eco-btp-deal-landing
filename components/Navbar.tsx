
import React from 'react';
import { RefreshCcw, HardHat, Leaf, ShieldAlert } from 'lucide-react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User;
  onToggleRole: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onToggleRole }) => {
  const isPro = user.role === UserRole.PRO;
  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200 py-3 px-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-orange-600 p-2 rounded-xl text-white font-black text-xs shadow-lg shadow-orange-200 uppercase tracking-tighter">
          ECO-BTP
        </div>
        <div className="flex flex-col -space-y-0.5">
          <span className="text-[8px] font-black text-slate-400 tracking-[0.2em] uppercase leading-none">Marketplace</span>
          <span className="text-[10px] font-bold text-slate-900 uppercase">Réemploi</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center">
        <div className="bg-green-50 px-4 py-1.5 rounded-full border border-green-200 flex items-center gap-2 animate-pulse shadow-sm">
          <Leaf size={12} className="text-green-600 fill-green-600" />
          <span className="text-green-700 text-[10px] font-black uppercase tracking-wider">14 520 kg sauvés 🌍</span>
        </div>
      </div>

      <button 
        onClick={onToggleRole}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 border-2 ${
          isAdmin 
            ? 'bg-slate-900 border-slate-900 text-white' 
            : isPro 
              ? 'bg-orange-600 border-orange-600 text-white' 
              : 'bg-white border-slate-100 text-slate-600 hover:border-orange-500'
        }`}
      >
        {isAdmin ? (
          <>
            <ShieldAlert size={12} />
            <span>CONSOLE ADMIN</span>
          </>
        ) : isPro ? (
          <>
            <span>👷‍♂️ MODE PRO</span>
            <RefreshCcw size={12} className="opacity-60" />
          </>
        ) : (
          <>
            <HardHat size={12} />
            <span>PASSER PRO</span>
          </>
        )}
      </button>
    </header>
  );
};

export default Navbar;
