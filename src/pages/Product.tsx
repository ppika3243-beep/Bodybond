import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PRODUCT_CONFIG } from '../config';
import { ProductGallery } from '../components/Product/ProductGallery';
import { db, handleFirestoreError, OperationType } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function Shop() {
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', 'body-glue');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProductData(docSnap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const price = productData?.price ?? PRODUCT_CONFIG.price;
  const name = productData?.name ?? 'BODYBOND Body Glue';
  const primaryImageUrl = productData?.images?.find((img: any) => img.isPrimary)?.url 
    ?? (productData?.images?.[0]?.url ?? '/assets/product-front.jpg');

  return (
    <div className="w-full min-h-screen py-24 px-6 bg-brand-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl mb-6 text-center">Shop BODYBOND</h1>
        <p className="text-center text-brand-gray-dark font-medium mb-16 max-w-lg mx-auto">A gentle clothing and body adhesive for a secure, confident hold.</p>
        
        <div className="max-w-md mx-auto group">
          <Link to="/products/body-glue" className="block bg-brand-pink-light aspect-[4/5] rounded-sm mb-8 relative overflow-hidden flex items-center justify-center"> 
            <img src={primaryImageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" />
          </Link>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">{name}</h2>
            <p className="text-brand-gray-dark font-medium mb-8">{PRODUCT_CONFIG.currency}{price}</p>
            <Link to="/products/body-glue" className="inline-block bg-brand-black text-brand-white px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors"> 
              View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', 'body-glue');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProductData(docSnap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const price = productData?.price ?? PRODUCT_CONFIG.price;
  const name = productData?.name ?? 'BODYBOND';
  const description = productData?.description ?? 'Our premium fashion adhesive designed to keep your clothing securely in place against your skin. Sweat-resistant, gentle, and reliable for all-day confidence.';

  return (
    <div className="w-full py-16 md:py-24 px-6 bg-brand-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Product Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full h-full min-h-[500px]">
            <ProductGallery />
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col justify-center">
            <div className="text-brand-pink font-bold tracking-widest text-sm mb-4 uppercase">Body Glue</div>
            <h1 className="text-4xl lg:text-5xl mb-6">{name}</h1>
            <p className="text-2xl text-brand-black font-bold mb-8">{PRODUCT_CONFIG.currency}{price}</p>
            
            <p className="text-brand-gray-dark font-medium mb-10 leading-relaxed text-lg">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <div className="flex items-center border-2 border-brand-black rounded-none">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-brand-gray-dark hover:text-brand-black transition-colors bg-transparent">
                  <Minus size={18} strokeWidth={2} />
                </button>
                <span className="w-12 text-center text-base font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-brand-gray-dark hover:text-brand-black transition-colors bg-transparent">
                  <Plus size={18} strokeWidth={2} />
                </button>
              </div>
              
              <Link to="/checkout" className="flex-grow bg-brand-black text-brand-white text-center py-5 text-sm font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors">
                Order Now
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-bold text-brand-gray-dark uppercase tracking-wider mb-10"> 
              <span>Delivery:</span> 
              <span className="text-brand-black">Dhaka (Free) / Outside (৳130)</span>
            </div>

            {/* Accordions / Tabs */}
            <div className="border-t-2 border-brand-gray pt-8">
              <div className="flex gap-8 mb-8 border-b-2 border-brand-gray">
                {['description', 'benefits', 'details'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold tracking-wider uppercase transition-colors relative ${activeTab === tab ? 'text-brand-black' : 'text-brand-gray-dark hover:text-brand-black'}`}
                  >
                    {tab}
                    {activeTab === tab && <motion.div layoutId="activeTab" className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-brand-black" />}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[140px] text-brand-gray-dark font-medium leading-relaxed text-base">
                {activeTab === 'description' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p>{description}</p>
                  </motion.div>
                )}
                {activeTab === 'benefits' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ul className="list-disc pl-5 space-y-3">
                      <li>Leaves no permanent residue on clothing</li>
                      <li>Sweat-resistant hold for events and daily wear</li>
                      <li>Water-soluble formula that washes off effortlessly</li>
                      <li>Gentle formula; skin patch test recommended before full wear</li>
                    </ul>
                  </motion.div>
                )}
                {activeTab === 'details' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="space-y-4">
                      <Link to="/how-to-use" className="flex items-center justify-between group py-2 border-b border-brand-gray hover:text-brand-black">
                        <span>How to apply</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-brand-pink" />
                      </Link>
                      <Link to="/where-to-use" className="flex items-center justify-between group py-2 border-b border-brand-gray hover:text-brand-black">
                        <span>Suitable garments</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-brand-pink" />
                      </Link>
                      <Link to="/how-to-remove" className="flex items-center justify-between group py-2 border-b border-brand-gray hover:text-brand-black">
                        <span>Removal guide</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-brand-pink" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
