
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Truck, Car, X, Loader2, CheckCircle2, Clock, Gift, Euro, ImagePlus, Plus, MapPin, Search, Upload } from 'lucide-react';
import { Category, ListingStatus } from '../types';

interface PostListingProps {
  onPost: (listing: any) => void;
  onCancel: () => void;
}

interface GeocodedAddress {
  label: string;
  city: string;
  postcode: string;
  lat: number;
  lng: number;
}

const PostListing: React.FC<PostListingProps> = ({ onPost, onCancel }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<GeocodedAddress[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeocodedAddress | null>(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    quantity: '',
    priceType: 'don' as 'don' | 'vente',
    price: '',
    category: Category.GROS_OEUVRE,
    photos: [] as string[],
    isUrgent: false,
    logistics: 'voiture' as 'voiture' | 'camionnette' | 'camion',
  });

  // Recherche d'adresse via l'API gouvernementale française
  useEffect(() => {
    const searchLocation = async () => {
      if (locationQuery.length < 3) {
        setLocationSuggestions([]);
        return;
      }

      setIsSearchingLocation(true);
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(locationQuery)}&limit=5`
        );
        const data = await response.json();

        const suggestions: GeocodedAddress[] = data.features.map((feature: any) => ({
          label: feature.properties.label,
          city: feature.properties.city,
          postcode: feature.properties.postcode,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
        }));

        setLocationSuggestions(suggestions);
      } catch (error) {
        console.error('Erreur de géocodage:', error);
      }
      setIsSearchingLocation(false);
    };

    const debounceTimer = setTimeout(searchLocation, 300);
    return () => clearTimeout(debounceTimer);
  }, [locationQuery]);

  const handleSelectLocation = (location: GeocodedAddress) => {
    setSelectedLocation(location);
    setLocationQuery(location.label);
    setLocationSuggestions([]);
  };

  // Ouvrir le sélecteur de fichiers
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Gérer l'upload de photos depuis l'appareil
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, base64]
          }));
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input pour permettre de sélectionner le même fichier
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) });
  };

  const handlePublish = () => {
    if (!formData.title || formData.photos.length === 0) {
      alert("Une photo et un titre sont obligatoires pour publier.");
      return;
    }

    if (!selectedLocation) {
      alert("Veuillez sélectionner une localisation pour votre lot.");
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccess(true);
      setTimeout(() => {
        onPost({
          title: formData.title,
          category: formData.category,
          description: "Mis à disposition pour éviter la benne. État correct.",
          photoUrl: formData.photos[0],
          galleryUrls: formData.photos,
          quantity: formData.quantity || "1 lot",
          price: formData.priceType === 'don' ? 0 : parseFloat(formData.price || '0'),
          proId: "pro_1",
          proName: "BatiConstruct PME",
          location: {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            address: selectedLocation.label,
            city: selectedLocation.city,
            postcode: selectedLocation.postcode,
            distanceLabel: "📍 Calcul en cours..."
          },
          availability: "Sur rendez-vous",
          pickupDeadline: formData.isUrgent ? "Avant Vendredi (Urgent)" : "Flexible",
          isPremiumOnly: false,
          weightEstimatedKg: 50
        });
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nouvelle Annonce</h2>
        <button onClick={onCancel} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-md mx-auto space-y-8 pb-32">
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              📸 Galerie Photos {formData.photos.length > 0 && `(${formData.photos.length})`}
            </label>

            {/* Input file caché */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="grid grid-cols-3 gap-3">
              {formData.photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-green-300 group bg-slate-100">
                  <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-green-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                    ✓ Photo {i + 1}
                  </div>
                </div>
              ))}

              {/* Bouton ajouter photo */}
              <button
                onClick={openFilePicker}
                className="aspect-square rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 flex flex-col items-center justify-center gap-2 text-orange-500 hover:border-orange-500 hover:bg-orange-100 transition-all active:scale-95"
              >
                <Camera size={28} />
                <span className="text-[9px] font-black uppercase">
                  {formData.photos.length === 0 ? 'Ajouter photo' : 'Ajouter +'}
                </span>
              </button>
            </div>

            {formData.photos.length === 0 && (
              <p className="text-xs text-orange-600 font-medium bg-orange-50 p-3 rounded-lg border border-orange-200">
                📷 Prenez au moins une photo de votre matériau pour publier
              </p>
            )}
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titre du matériau</label>
              <input 
                type="text" 
                placeholder="Ex: Palette de parpaings"
                className="w-full text-lg font-bold p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-orange-500 transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantité / Volume</label>
              <input
                type="text"
                placeholder="Ex: 50 unités, 10 sacs..."
                className="w-full text-lg font-bold p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-orange-500 transition-all"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
              />
            </div>

          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormData({...formData, priceType: 'don', price: '0'})}
                className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold transition-all ${
                  formData.priceType === 'don' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 bg-slate-50 text-slate-500'
                }`}
              >
                <Gift size={20} />
                <span>DON</span>
              </button>
              <button
                onClick={() => setFormData({...formData, priceType: 'vente'})}
                className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold transition-all ${
                  formData.priceType === 'vente' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 bg-slate-50 text-slate-500'
                }`}
              >
                <Euro size={20} />
                <span>VENTE</span>
              </button>
            </div>
            {formData.priceType === 'vente' && (
              <input 
                type="number" 
                placeholder="Prix en € (ex: 30)"
                className="w-full text-lg font-bold p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-orange-500 transition-all"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie BTP</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: Category.GROS_OEUVRE, label: '🧱 Gros œuvre' },
                { id: Category.ELECTRICITE, label: '🔧 Plomb/Élec' },
                { id: Category.AMENAGEMENT, label: '🌳 Extérieur' },
                { id: Category.BOIS, label: '🪵 Bois/Finition' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFormData({...formData, category: cat.id as any})}
                  className={`py-3 px-2 rounded-xl border-2 font-bold text-xs transition-all ${
                    formData.category === cat.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 bg-slate-50 text-slate-500'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10 space-y-4">
        {/* CHAMP LOCALISATION - Juste au-dessus du bouton */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
            <MapPin size={14} />
            📍 Ville ou Code Postal du chantier
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Tapez votre ville ou code postal..."
              className={`w-full text-base font-bold p-4 border-2 rounded-xl outline-none transition-all pr-12 ${
                selectedLocation
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-orange-300 bg-orange-50 focus:border-orange-500'
              }`}
              value={locationQuery}
              onChange={e => {
                setLocationQuery(e.target.value);
                setSelectedLocation(null);
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isSearchingLocation ? (
                <Loader2 size={20} className="text-orange-400 animate-spin" />
              ) : selectedLocation ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <Search size={20} className="text-orange-400" />
              )}
            </div>
          </div>

          {/* Suggestions d'adresses */}
          {locationSuggestions.length > 0 && !selectedLocation && (
            <div className="absolute z-50 w-full bg-white border-2 border-orange-200 rounded-xl shadow-2xl mt-1 overflow-hidden bottom-full mb-2">
              {locationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectLocation(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-slate-900">{suggestion.city}</p>
                      <p className="text-xs text-slate-500">{suggestion.label}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedLocation && (
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 px-3 py-2 rounded-lg border border-green-200">
              <CheckCircle2 size={14} />
              <span>✓ {selectedLocation.city} ({selectedLocation.postcode})</span>
            </div>
          )}
        </div>

        <button
          disabled={isPublishing || !formData.title || formData.photos.length === 0 || !selectedLocation}
          onClick={handlePublish}
          className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
        >
          {isPublishing ? (
            <><Loader2 className="animate-spin" /> PUBLICATION...</>
          ) : !selectedLocation ? (
            '📍 SÉLECTIONNEZ UNE VILLE'
          ) : (
            'PUBLIER MAINTENANT'
          )}
        </button>
      </div>
    </div>
  );
};

export default PostListing;
