
import React, { useState } from 'react';
import { Camera, Truck, Car, X, Loader2, CheckCircle2, Clock, Gift, Euro, ImagePlus, Plus } from 'lucide-react';
import { Category, ListingStatus } from '../types';

interface PostListingProps {
  onPost: (listing: any) => void;
  onCancel: () => void;
}

const PostListing: React.FC<PostListingProps> = ({ onPost, onCancel }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
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

  const addPhoto = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=800&auto=format&fit=crop'
    ];
    const nextPhoto = mockImages[formData.photos.length % mockImages.length];
    setFormData({ ...formData, photos: [...formData.photos, nextPhoto] });
  };

  const removePhoto = (index: number) => {
    setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) });
  };

  const handlePublish = () => {
    if (!formData.title || formData.photos.length === 0) {
      alert("Une photo et un titre sont obligatoires pour publier.");
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
            lat: 48.8566, 
            lng: 2.3522, 
            address: "14 Rue du Chantier, Paris",
            distanceLabel: "📍 0.5 km"
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Galerie Photos</label>
            
            <div className="grid grid-cols-3 gap-3">
              {formData.photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-100 group">
                  <img src={photo} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={addPhoto}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all"
              >
                <Plus size={20} />
                <span className="text-[8px] font-black uppercase">Ajouter</span>
              </button>
            </div>
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

      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10">
        <button 
          disabled={isPublishing || !formData.title || formData.photos.length === 0}
          onClick={handlePublish}
          className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
        >
          {isPublishing ? (
            <><Loader2 className="animate-spin" /> PUBLICATION...</>
          ) : (
            'PUBLIER MAINTENANT'
          )}
        </button>
      </div>
    </div>
  );
};

export default PostListing;
