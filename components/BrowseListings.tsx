
import React, { useState, useEffect } from 'react';
import { Search, Info, ShieldAlert, CreditCard, CheckCircle, QrCode, MapPin, Clock, ShieldCheck, ChevronRight, X, MessageSquare, Leaf, Weight, TrendingDown, Zap, Loader2, Navigation } from 'lucide-react';
import { Material, Category, User, UserRole, ListingStatus } from '../types';
import CarbonImpactWidget from './CarbonImpactWidget';
import RouteOptimizer from './RouteOptimizer';

interface BrowseListingsProps {
  materials: Material[];
  user: User;
  onReserve: (id: string) => void;
  onOpenChat: () => void;
}

interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
}

// Fonction Haversine pour calculer la distance entre 2 points GPS
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Formater la distance pour l'affichage
const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};

const BrowseListings: React.FC<BrowseListingsProps> = ({ materials, user, onReserve, onOpenChat }) => {
  const [filter, setFilter] = useState<Category | 'Tous'>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [reservationStep, setReservationStep] = useState<number | null>(null);
  const [isWaiverAccepted, setIsWaiverAccepted] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Obtenir la position de l'utilisateur au chargement
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocoding pour obtenir le nom de la ville
          try {
            const response = await fetch(
              `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`
            );
            const data = await response.json();
            const city = data.features?.[0]?.properties?.city || 'Votre position';

            setUserLocation({ lat: latitude, lng: longitude, city });
          } catch {
            setUserLocation({ lat: latitude, lng: longitude });
          }
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setLocationError('Activez la localisation pour voir les distances');
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setLocationError('Géolocalisation non supportée');
      setIsLoadingLocation(false);
    }
  }, []);

  // Calculer la distance pour chaque matériau
  const getDistanceLabel = (material: Material): string => {
    if (!userLocation) return '📍 --';
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      material.location.lat,
      material.location.lng
    );
    return `📍 ${formatDistance(distance)}`;
  };

  // Trier les matériaux par distance
  const sortedMaterials = [...materials].sort((a, b) => {
    if (!userLocation) return 0;
    const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng);
    const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng);
    return distA - distB;
  });

  const filtered = sortedMaterials.filter(m => {
    const matchCat = filter === 'Tous' || m.category === filter;
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenReservation = (material: Material) => {
    if (material.isPremiumOnly && !user.isPremium) {
      alert("Ce lot est réservé aux membres PREMIUM pour les premières 24h.");
      return;
    }
    setSelectedMaterial(material);
    setReservationStep(1);
    setIsWaiverAccepted(false);
  };

  const handleCloseModal = () => {
    setReservationStep(null);
    setSelectedMaterial(null);
  };

  const nextStep = () => {
    if (reservationStep === 2 && selectedMaterial) {
      onReserve(selectedMaterial.id);
    }
    setReservationStep(prev => (prev !== null ? prev + 1 : null));
  };

  return (
    <div className="space-y-6">
      <div className="pt-2 pb-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Bienvenue sur <span className="text-orange-500">Eco-BTP Deal</span></h2>
        <div className="flex items-center gap-1.5 mt-2 text-blue-600">
          <CheckCircle size={12} fill="currentColor" className="text-white" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Marketplace 100% Vérifiée (KBIS)</span>
        </div>
      </div>

      {/* INDICATEUR DE LOCALISATION UTILISATEUR */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold ${
        userLocation ? 'bg-green-50 text-green-700 border border-green-200' :
        locationError ? 'bg-orange-50 text-orange-700 border border-orange-200' :
        'bg-slate-50 text-slate-500 border border-slate-200'
      }`}>
        {isLoadingLocation ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Localisation en cours...</span>
          </>
        ) : userLocation ? (
          <>
            <Navigation size={16} className="text-green-600" />
            <span>Vous êtes à <strong>{userLocation.city || 'Position GPS'}</strong></span>
            <span className="text-xs text-green-500 ml-auto">Distances réelles</span>
          </>
        ) : (
          <>
            <MapPin size={16} />
            <span>{locationError}</span>
          </>
        )}
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" size={20} />
        <input
          type="text"
          placeholder="Rechercher des matériaux..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-gradient-to-r from-green-50 to-orange-50 border border-green-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-green-500 rounded-lg text-white">
            <Leaf size={14} />
          </div>
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Impact Communautaire</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-green-700">
              <Weight size={14} />
              <span className="text-sm font-black tracking-tight">14,5 T</span>
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-1 tracking-tighter">SAUVÉS 🌍</span>
          </div>
          <div className="flex flex-col border-x border-slate-200 px-2">
            <div className="flex items-center gap-1 text-green-600">
              <Zap size={14} className="fill-green-600" />
              <span className="text-sm font-black tracking-tight">8,4 t</span>
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-1 tracking-tighter">CO2 Évité</span>
          </div>
          <div className="flex flex-col pl-1">
            <div className="flex items-center gap-1 text-orange-600">
              <TrendingDown size={14} />
              <span className="text-sm font-black tracking-tight">28,4 k€</span>
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-1 tracking-tighter">Économie</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Tous', ...Object.values(Category)].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
              filter === cat ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(material => {
          const isUrgent = material.pickupDeadline.includes("Urgent") || material.pickupDeadline.includes("Demain");
          return (
            <div key={material.id} className={`bg-white rounded-3xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow group ${isUrgent ? 'border-red-200' : 'border-slate-200'}`}>
              <div className="relative h-48 overflow-hidden">
                <img src={material.photoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {material.isPremiumOnly && <div className="px-3 py-1 bg-amber-400 text-amber-950 text-[10px] font-black uppercase rounded-full">PREMIUM</div>}
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${isUrgent ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-white/90 text-orange-600 border-orange-200'}`}>
                    <Clock size={12} />
                    {material.pickupDeadline}
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1">
                  <CarbonImpactWidget weight={material.weightEstimatedKg} materialType={material.materialType} compact />
                  <div className={`px-3 py-1 text-white text-xs font-black rounded-lg ${material.price === 0 ? 'bg-green-600' : 'bg-slate-900'}`}>{material.price === 0 ? 'GRATUIT' : `${material.price} €`}</div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-lg leading-tight flex-1">{material.title}</h3>
                  <div className="flex items-center gap-1 text-blue-600 shrink-0 mt-1">
                    <CheckCircle size={14} fill="currentColor" className="text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 w-fit px-2 py-0.5 rounded-md">
                  <MapPin size={12} className="text-orange-500" />
                  {userLocation ? getDistanceLabel(material) : material.location.distanceLabel}
                  {material.location.city && (
                    <span className="text-slate-400 ml-1">• {material.location.city}</span>
                  )}
                </div>
                <p className="text-slate-500 text-sm line-clamp-2">{material.description}</p>
                <button disabled={material.status !== ListingStatus.AVAILABLE} onClick={() => handleOpenReservation(material)} className={`w-full py-3 rounded-xl font-bold transition-all ${material.status === ListingStatus.AVAILABLE ? 'bg-orange-500 text-white shadow-lg shadow-orange-100 hover:bg-orange-600 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                  {material.status === ListingStatus.AVAILABLE ? 'Réserver le lot' : 'Déjà réservé'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {reservationStep !== null && selectedMaterial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="p-6 pb-2 flex justify-between items-center sticky top-0 bg-white z-10 border-b border-slate-50">
              <div className="flex gap-1">{[1, 2, 3].map(s => <div key={s} className={`h-1.5 w-8 rounded-full ${s <= (reservationStep || 0) ? 'bg-orange-500' : 'bg-slate-100'}`} />)}</div>
              <button onClick={handleCloseModal} className="text-slate-400 p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>

            {reservationStep === 1 && (
              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">Optimisation Logistique</h4>
                </div>
                
                <RouteOptimizer
                  distance={userLocation ? formatDistance(calculateDistance(
                    userLocation.lat, userLocation.lng,
                    selectedMaterial.location.lat, selectedMaterial.location.lng
                  )) : selectedMaterial.location.distanceLabel.replace('📍 ', '')}
                  co2Savings="2.4"
                  address={selectedMaterial.location.address}
                />

                <div className="bg-slate-50 p-5 rounded-2xl text-[11px] font-bold text-slate-600 italic border-2 border-slate-100 leading-relaxed">
                  <ShieldAlert className="inline mr-2 text-orange-500 shrink-0" size={16} />
                  "Je certifie posséder mes EPI (casque, chaussures) et accepte les conditions de sécurité sur site."
                </div>
                <label className="flex items-start gap-3 cursor-pointer text-left group">
                  <div className={`mt-1 shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isWaiverAccepted ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-200 bg-white group-hover:border-orange-200'}`}>
                    <input type="checkbox" checked={isWaiverAccepted} onChange={(e) => setIsWaiverAccepted(e.target.checked)} className="hidden" /> 
                    {isWaiverAccepted && <CheckCircle size={14} />}
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">J'accepte les conditions de sécurité sur site</span>
                </label>
                <button disabled={!isWaiverAccepted} onClick={nextStep} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg disabled:opacity-50 active:scale-95 transition-all">Continuer</button>
              </div>
            )}

            {reservationStep === 2 && (
              <div className="p-8 space-y-6 text-center">
                <div className="space-y-2">
                  <h4 className="text-2xl font-black uppercase tracking-tighter">Votre Impact</h4>
                  <p className="text-sm font-bold text-slate-500">En sauvant ce lot, vous agissez pour la planète.</p>
                </div>
                <CarbonImpactWidget weight={selectedMaterial.weightEstimatedKg} materialType={selectedMaterial.materialType} />
                <div className="bg-slate-900 p-6 rounded-2xl text-white border-b-4 border-slate-950">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Frais de plateforme Eco-BTP</p>
                  <p className="text-3xl font-black">1,50 € <span className="text-xs opacity-50 font-normal">TTC</span></p>
                </div>
                <button onClick={nextStep} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <CreditCard size={18} /> Confirmer & Payer
                </button>
              </div>
            )}

            {reservationStep === 3 && (
              <div className="p-8 text-center space-y-6 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle size={32} /></div>
                <h4 className="text-2xl font-black uppercase tracking-tighter">Lot Réservé !</h4>
                <div className="p-6 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 flex flex-col items-center gap-4">
                  <QrCode size={160} className="text-slate-900" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Présentez ce code sur le chantier de {selectedMaterial.proName}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { onOpenChat(); handleCloseModal(); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <MessageSquare size={18} /> Ouvrir le Chat
                  </button>
                  <button onClick={handleCloseModal} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Fermer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseListings;
