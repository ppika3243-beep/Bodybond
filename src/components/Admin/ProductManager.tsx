import React, { useState, useEffect } from 'react';
import { Upload, Trash2, GripVertical, Star, Check, Link as LinkIcon, Plus } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../utils/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductData {
  id?: string;
  name: string;
  price: number;
  active: boolean;
  images: ProductImage[];
  primaryImage?: string;
  description?: string;
  currency?: string;
  createdAt?: any;
  updatedAt?: any;
}

export function ProductManager() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Form fields for editing
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(950);
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  
  // Drag and drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const docRef = doc(db, 'products', 'body-glue');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ProductData;
        setProductData(data);
        setName(data.name || 'BODYBOND Body Glue');
        setPrice(typeof data.price === 'number' ? data.price : 950);
        setDescription(data.description || 'Our premium fashion adhesive designed to keep your clothing securely in place against your skin. Sweat-resistant, gentle, and reliable for all-day confidence.');
        setActive(typeof data.active === 'boolean' ? data.active : true);
      } else {
        const defaultData: ProductData = {
          name: 'BODYBOND Body Glue',
          price: 950,
          active: true,
          description: 'Our premium fashion adhesive designed to keep your clothing securely in place against your skin. Sweat-resistant, gentle, and reliable for all-day confidence.',
          images: [{ id: 'default-1', url: '/assets/product-front.jpg', isPrimary: true }],
          primaryImage: '/assets/product-front.jpg'
        };
        await setDoc(docRef, defaultData);
        setProductData(defaultData);
        setName(defaultData.name);
        setPrice(defaultData.price);
        setDescription(defaultData.description || '');
        setActive(defaultData.active);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'products/body-glue');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (newData: ProductData) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const primaryUrl = newData.images.find(img => img.isPrimary)?.url || (newData.images[0]?.url ?? '/assets/product-front.jpg');
      const payload = {
        name: newData.name,
        price: Number(newData.price),
        active: Boolean(newData.active),
        images: newData.images,
        primaryImage: primaryUrl,
        ...(newData.description ? { description: newData.description } : {}),
        currency: '৳'
      };

      await updateDoc(doc(db, 'products', 'body-glue'), payload);
      setProductData({ ...newData, primaryImage: primaryUrl });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'products/body-glue');
    } finally {
      setSaving(false);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData) return;
    handleSave({
      ...productData,
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      active
    });
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim() || !productData) return;
    
    setSaving(true);
    const newImages: ProductImage[] = [...productData.images];
    
    try {
      const imageId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      newImages.push({
        id: imageId,
        url: newImageUrl.trim(),
        isPrimary: newImages.length === 0,
      });
      
      await handleSave({ ...productData, images: newImages });
      setNewImageUrl('');
    } catch (err) {
      console.error(err);
      alert('Failed to add image.');
    } finally {
      setSaving(false);
    }
  };

  const setPrimary = (imageId: string) => {
    if (!productData) return;
    const newImages = productData.images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    handleSave({ ...productData, images: newImages });
  };

  const deleteImage = async (imgToDelete: ProductImage) => {
    if (!productData) return;
    
    try {
      setSaving(true);
      
      let newImages = productData.images.filter(img => img.id !== imgToDelete.id);
      if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
        newImages[0].isPrimary = true;
      }
      
      await handleSave({ ...productData, images: newImages });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === dropIndex || !productData) return;
    
    const newImages = [...productData.images];
    const draggedItem = newImages[draggedItemIndex];
    
    newImages.splice(draggedItemIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    
    handleSave({ ...productData, images: newImages });
    setDraggedItemIndex(null);
  };

  if (loading) {
    return <div className="p-12 text-center text-brand-gray-dark">Loading...</div>;
  }

  if (!productData) return null;

  return (
    <div className="space-y-8">
      {/* Product Details Form */}
      <div className="bg-brand-white border border-brand-gray rounded-sm shadow-sm p-6 md:p-8 relative">
        {saving && (
          <div className="absolute inset-0 bg-brand-white/80 z-10 flex items-center justify-center">
            <p className="font-bold uppercase tracking-widest text-brand-pink">Saving...</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-gray">
          <div>
            <h2 className="text-xl font-bold text-brand-black">Product Information</h2>
            <p className="text-brand-gray-dark text-xs">Configure title, live price, availability, and description.</p>
          </div>
          {saveSuccess && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-sm border border-green-200 flex items-center gap-1.5">
              <Check size={14} /> Changes Saved
            </span>
          )}
        </div>

        <form onSubmit={handleDetailsSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-brand-gray-dark">Product Name *</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-brand-gray focus:border-brand-black outline-none text-sm rounded-sm transition-colors"
                placeholder="e.g. BODYBOND Body Glue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-brand-gray-dark">Price (৳ BDT) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-dark font-bold text-sm">৳</span>
                <input 
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  min={1}
                  className="w-full pl-8 pr-4 py-3 border border-brand-gray focus:border-brand-black outline-none text-sm rounded-sm transition-colors font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-brand-gray-dark">Description</label>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 border border-brand-gray focus:border-brand-black outline-none text-sm rounded-sm transition-colors"
              placeholder="Product description displayed to shoppers..."
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-5 h-5 accent-brand-black cursor-pointer"
              />
              <span className="text-sm font-bold text-brand-black">Product is Active (Available in Store)</span>
            </label>

            <button 
              type="submit"
              disabled={saving}
              className="bg-brand-black text-brand-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors rounded-sm disabled:opacity-70"
            >
              Save Product Details
            </button>
          </div>
        </form>
      </div>

      {/* Product Images Management */}
      <div className="bg-brand-white border border-brand-gray rounded-sm shadow-sm p-6 md:p-8 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 border-b border-brand-gray pb-6">
          <div>
            <h2 className="text-xl font-bold text-brand-black mb-1">Product Images</h2>
            <p className="text-brand-gray-dark text-xs">Manage product images using public URLs or paths. Drag to reorder, set primary, or remove.</p>
          </div>
          
          <form onSubmit={handleAddImage} className="w-full lg:w-auto flex gap-2">
            <div className="relative flex-1 lg:w-72">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-dark">
                <LinkIcon size={16} />
              </div>
              <input 
                type="text" 
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="/assets/image.jpg or https://..."
                className="w-full pl-10 pr-4 py-2.5 border border-brand-gray focus:border-brand-black outline-none text-sm transition-colors rounded-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={saving || !newImageUrl.trim()}
              className="flex items-center gap-2 bg-brand-black text-brand-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors disabled:opacity-70 rounded-sm shrink-0"
            >
              <Plus size={16} /> Add Image
            </button>
          </form>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productData.images.length === 0 ? (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-brand-gray">
            <p className="text-brand-gray-dark">No images added yet. Add an image URL to see them here.</p>
          </div>
        ) : (
          productData.images.map((img, index) => (
            <div 
              key={img.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`group relative bg-brand-pink-light rounded-sm border-2 overflow-hidden transition-all duration-200 cursor-move ${
                img.isPrimary ? 'border-brand-black shadow-md' : 'border-transparent hover:border-brand-gray'
              } ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}`}
            >
              {/* Image Preview */}
              <div className="aspect-[4/5] w-full relative">
                <img 
                  src={img.url} 
                  alt="Product view" 
                  className="w-full h-full object-cover mix-blend-multiply p-2 pointer-events-none" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1896894b834%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1896894b834%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23eee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2274.0625%22%20y%3D%22104.5%22%3EBroken%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                  }}
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-between items-start">
                    <div className="bg-brand-white/90 p-1.5 rounded-sm shadow-sm cursor-grab active:cursor-grabbing">
                      <GripVertical size={16} className="text-brand-black" />
                    </div>
                    
                    <button 
                      onClick={() => deleteImage(img)}
                      className="bg-brand-white/90 hover:bg-red-50 text-red-600 p-1.5 rounded-sm shadow-sm transition-colors"
                      title="Delete image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {!img.isPrimary && (
                    <button 
                      onClick={() => setPrimary(img.id)}
                      className="bg-brand-white hover:bg-brand-black hover:text-brand-white text-brand-black py-2 px-3 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-1 w-full"
                    >
                      <Star size={14} /> Make Primary
                    </button>
                  )}
                </div>
              </div>

              {/* Status Bar */}
              {img.isPrimary && (
                <div className="bg-brand-black text-brand-white py-1.5 px-3 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                  <Check size={14} /> Primary Image
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
}
