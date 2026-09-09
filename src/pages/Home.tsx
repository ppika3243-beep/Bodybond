import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Check, Sparkles, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PRODUCT_CONFIG } from '../config';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function Home() {
  const [productData, setProductData] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', 'body-glue');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProductData(docSnap.data());
        }
      } catch (err) {
        console.error('Error fetching product for home:', err);
      }
    };
    fetchProduct();
  }, []);

  const price = productData?.price ?? PRODUCT_CONFIG.price;
  const name = productData?.name ?? 'BODYBOND Body Glue';
  const images = (productData?.images && productData.images.length > 0)
    ? productData.images
    : [{ id: 'default', url: '/assets/product-front.jpg', isPrimary: true }];
  
  const currentImageUrl = images[activeImageIndex]?.url ?? images[0]?.url ?? '/assets/product-front.jpg';

  // 8 Culturally relevant fictional DEMO reviews for layout testing
  const demoReviews = [
    {
      name: 'Samira Ahmed',
      location: 'Dhaka',
      useCase: 'Saree Blouse (শাড়ির ব্লাউজ)',
      rating: 5,
      text: 'বিয়েবাড়িতে শাড়ির ডিপ-কাট ব্লাউজ বারবার শোল্ডার থেকে পড়ে যাচ্ছিল। BODYBOND দিয়ে একটু রোল করে প্রেস করতেই পুরো অনুষ্ঠান আর চিন্তা করতে হয়নি। Very helpful!'
    },
    {
      name: 'Nabila Rahman',
      location: 'Chittagong',
      useCase: 'Orna / Dupatta (ওড়না)',
      rating: 5,
      text: 'Slippery chiffon orna সামলানো খুব ঝামেলার ছিল, বারবার সেফটিপিন লাগানো লাগত। এটা দিয়ে কাঁধে সিকিউর করার পর আর একবারও পড়ে যায়নি।'
    },
    {
      name: 'Tasnim Kabir',
      location: 'Dhaka',
      useCase: 'Off-Shoulder Top',
      rating: 5,
      text: 'Off-shoulder tops are always tricky because they keep riding up when moving. BODYBOND kept the sleeves exactly where I placed them. No sticky residue on clothes.'
    },
    {
      name: 'Farhana Islam',
      location: 'Sylhet',
      useCase: 'Three-Piece (থ্রি-পিস)',
      rating: 5,
      text: 'আমার থ্রি-পিসের চওড়া গলার ডিজাইন বারবার সরে যেত। একটু অ্যাপ্লাই করতেই কাপড় ত্বকের সাথে সুন্দরভাবে সেট হয়ে থাকে।'
    },
    {
      name: 'Maliha Chowdhury',
      location: 'Dhaka',
      useCase: 'Plunge Dress (ডিপ নেকলাইন)',
      rating: 5,
      text: 'Plunge neckline dresses always made me conscious at dinners. Tried it for an evening event, held nicely and washed off easily with normal water.'
    },
    {
      name: 'Anika Tabassum',
      location: 'Dhaka',
      useCase: 'Kurti (কুর্তি)',
      rating: 5,
      text: 'Office kurti neckline gaping used to bother me while working. BODYBOND keeps the neckline flat and decent all day.'
    },
    {
      name: 'Raisa Karim',
      location: 'Rajshahi',
      useCase: 'Strapless Dress (স্ট্র্যাপলেস)',
      rating: 5,
      text: 'Strapless party dress normally keeps sliding down. Used BODYBOND on the upper border, stayed in place through the entire event.'
    },
    {
      name: 'Zara Hossain',
      location: 'Dhaka',
      useCase: 'Saree Pallu (শাড়ির আঁচল)',
      rating: 5,
      text: 'শাড়ির ভারী আঁচল বারবার হাত থেকে পিছলে যাচ্ছিল। পিনের পাশাপাশি এটা ব্যবহারে আঁচলটা কাঁধের সাথে একদম নিখুঁত ছিল।'
    }
  ];

  return (
    <div className="w-full bg-brand-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col lg:flex-row items-center overflow-hidden border-b border-brand-gray/60">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-20 z-10 bg-brand-white">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-xl">
            
            {/* Tag / Category */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 bg-brand-pink-light border border-brand-pink/30 rounded-full text-brand-black font-bold tracking-wider text-xs mb-6 uppercase">
              <Sparkles size={13} className="text-brand-pink" />
              Clothing & Body Roll-On Adhesive
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] mb-6 text-brand-black">
              Your Outfit.<br />
              Your Confidence.<br />
              <span className="text-brand-pink">Your Hold.</span>
            </motion.h1>

            {/* Sub-headline & Description */}
            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-brand-black font-semibold mb-3">
              From saree blouses to modern dresses, keep your outfit where you want it.
            </motion.p>
            
            <motion.p variants={fadeUp} className="text-base text-brand-gray-dark mb-8 leading-relaxed font-normal">
              BODYBOND is a gentle roll-on adhesive that secures clothing fabric directly against your skin. Stop worrying about slipping sleeves, gaping necklines, or sliding dupattas.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                to="/products/body-glue" 
                className="bg-brand-black text-brand-white text-center px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors shadow-sm"
              >
                অর্ডার করুন এখনই
              </Link>
              <Link 
                to="/how-to-use" 
                className="border-2 border-brand-black text-brand-black text-center px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-brand-black hover:text-brand-white transition-colors"
              >
                কীভাবে কাজ করে
              </Link>
            </motion.div>

            {/* Quick Badges */}
            <motion.div variants={fadeUp} className="pt-6 border-t border-brand-gray flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-brand-gray-dark uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-brand-black">
                <Check size={14} className="text-brand-pink" /> Water-washable
              </span>
              <span className="flex items-center gap-1.5 text-brand-black">
                <Check size={14} className="text-brand-pink" /> Leaves no fabric residue
              </span>
              <span className="flex items-center gap-1.5 text-brand-black">
                <Check size={14} className="text-brand-pink" /> Cash on Delivery (BD)
              </span>
            </motion.div>

          </motion.div>
        </div>

        {/* Right Image Container */}
        <div className="w-full lg:w-1/2 min-h-[380px] sm:min-h-[460px] lg:h-[85vh] bg-brand-pink-light/40 relative flex items-center justify-center p-8 lg:p-16 border-t lg:border-t-0 lg:border-l border-brand-gray">
          <div className="relative w-full max-w-md aspect-[4/5] bg-brand-white border border-brand-gray shadow-md overflow-hidden rounded-sm flex items-center justify-center">
            <img 
              src={currentImageUrl} 
              alt="BODYBOND Body Glue packaging" 
              className="w-full h-full object-cover mix-blend-multiply p-4" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/product-front.jpg';
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 bg-brand-white/95 backdrop-blur-sm border border-brand-gray/80 px-4 py-2.5 rounded-sm flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-black">{name}</span>
                <span className="block text-xs text-brand-gray-dark">Roll-On Applicator • 50ml</span>
              </div>
              <span className="text-sm font-bold text-brand-pink">{PRODUCT_CONFIG.currency}{price}</span>
            </div>
          </div>
        </div>

      </section>

      {/* 2. PRODUCT SPOTLIGHT (Visible right away) */}
      <section className="py-16 sm:py-20 px-6 bg-brand-white border-b border-brand-gray/60">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Gallery / Image view */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-md aspect-[4/5] bg-brand-pink-light/30 border border-brand-gray rounded-sm overflow-hidden flex items-center justify-center mb-4">
                <img 
                  src={currentImageUrl} 
                  alt={name} 
                  className="w-full h-full object-cover mix-blend-multiply p-6" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/product-front.jpg';
                  }}
                />
              </div>

              {/* Thumbnails if multiple images exist */}
              {images.length > 1 && (
                <div className="flex gap-3 justify-center">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 border-2 rounded-sm overflow-hidden p-1 transition-all ${
                        activeImageIndex === idx ? 'border-brand-black scale-105' : 'border-brand-gray opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Fast Order */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest text-brand-pink font-bold mb-2">Original Formulation</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mb-3">{name}</h2>
              
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-extrabold text-brand-black">{PRODUCT_CONFIG.currency}{price}</span>
                <span className="text-xs text-brand-gray-dark uppercase tracking-wider font-semibold">Cash on Delivery Available</span>
              </div>

              <p className="text-base text-brand-gray-dark leading-relaxed mb-6 font-medium">
                The clear, flexible body adhesive formulated to keep fabric exactly where you place it. Designed for both traditional sarees and contemporary dresses. Gentle on skin, leaves no permanent residue on clothing, and rinses completely clean with plain water.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 p-3 bg-brand-pink-light/30 border border-brand-pink/20 rounded-sm">
                  <Truck size={18} className="text-brand-black shrink-0" />
                  <span className="text-xs font-semibold text-brand-black">Dhaka: Free Delivery / Outside: ৳130</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-brand-pink-light/30 border border-brand-pink/20 rounded-sm">
                  <ShieldCheck size={18} className="text-brand-black shrink-0" />
                  <span className="text-xs font-semibold text-brand-black">No online payment required (COD)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products/body-glue" 
                  className="bg-brand-black text-brand-white text-center py-4 px-8 text-sm font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors"
                >
                  অর্ডার করুন এখনই (Order Now)
                </Link>
                <Link 
                  to="/where-to-use" 
                  className="border border-brand-black text-brand-black text-center py-4 px-8 text-sm font-bold tracking-widest uppercase hover:bg-brand-black hover:text-brand-white transition-colors"
                >
                  View Outfit Guide
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. BANGLADESHI OUTFIT PROBLEM/SOLUTION SECTION */}
      <section className="py-20 lg:py-24 px-6 bg-brand-white border-b border-brand-gray/60">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-2 block">
              Everyday Outfit Realities in Bangladesh
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-brand-black">
              বারবার outfit ঠিক করতে হচ্ছে?
            </h2>
            <p className="text-brand-gray-dark text-base sm:text-lg font-medium leading-relaxed">
              BODYBOND helps keep your clothing positioned where you want it—giving you complete freedom to move throughout weddings, festive events, and daily routines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Saree & Blouse */}
            <div className="bg-brand-white border border-brand-gray p-6 sm:p-8 rounded-sm hover:border-brand-black transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-brand-pink uppercase block mb-3">01 • Saree & Blouse</span>
                <h3 className="text-xl font-bold text-brand-black mb-3">শাড়ির ব্লাউজ ও কাঁধের কাট</h3>
                <p className="text-sm text-brand-gray-dark leading-relaxed font-medium">
                  ডিপ-ব্যাক বা ব্রড-শোল্ডার ব্লাউজ কাঁধ থেকে বারবার খসে পড়া বন্ধ করতে বর্ডারে হালকা রোল-অন করুন। ব্লাউজ থাকবে একদম ঠিকঠাক।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-gray/60 text-xs font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                <Check size={14} className="text-brand-pink" /> No more falling shoulders
              </div>
            </div>

            {/* Orna / Dupatta */}
            <div className="bg-brand-white border border-brand-gray p-6 sm:p-8 rounded-sm hover:border-brand-black transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-brand-pink uppercase block mb-3">02 • Orna / Dupatta</span>
                <h3 className="text-xl font-bold text-brand-black mb-3">ওড়না ও দোপাট্টা পিছলে যাওয়া</h3>
                <p className="text-sm text-brand-gray-dark leading-relaxed font-medium">
                  জর্জেট বা সিল্কের ওড়না কাঁধে ধরে রাখতে সেফটিপিনের কারণে কাপড়ে ফুটো তৈরি হয়। BODYBOND দিয়ে ওড়না কাঁধের সাথে ফিক্সড রাখুন।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-gray/60 text-xs font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                <Check size={14} className="text-brand-pink" /> Pin-free fabric hold
              </div>
            </div>

            {/* Three-piece & Salwar */}
            <div className="bg-brand-white border border-brand-gray p-6 sm:p-8 rounded-sm hover:border-brand-black transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-brand-pink uppercase block mb-3">03 • Three-Piece</span>
                <h3 className="text-xl font-bold text-brand-black mb-3">থ্রি-পিস ও সালোয়ার কামিজ</h3>
                <p className="text-sm text-brand-gray-dark leading-relaxed font-medium">
                  চওড়া গলার কামিজ বা ডিজাইনার কাটের পোশাক হাঁটার সময় সরে যায় না। ব্রা স্ট্র্যাপ গোপন রাখতেও কাপড়ের ভেতরের পাশে ব্যবহারযোগ্য।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-gray/60 text-xs font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                <Check size={14} className="text-brand-pink" /> Neat neckline placement
              </div>
            </div>

            {/* Kurti & Tops */}
            <div className="bg-brand-white border border-brand-gray p-6 sm:p-8 rounded-sm hover:border-brand-black transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-brand-pink uppercase block mb-3">04 • Kurti & Tops</span>
                <h3 className="text-xl font-bold text-brand-black mb-3">কুর্তি ও বোতামের ফাঁক</h3>
                <p className="text-sm text-brand-gray-dark leading-relaxed font-medium">
                  কুর্তির বুকের অংশে বোতামের মাঝখান দিয়ে যে ফাঁক (button gap) তৈরি হয়, তা সহজেই সমান ও পরিপাটি রাখতে দারুণ কার্যকর।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-gray/60 text-xs font-bold text-brand-black uppercase tracking-wider flex items-center gap-1.5">
                <Check size={14} className="text-brand-pink" /> Closes button gapes
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. MODERN OUTFIT SECTION */}
      <section className="py-20 lg:py-24 px-6 bg-brand-pink-light/20 border-b border-brand-gray/60">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-2 block">
              Modern & Western Silhouettes
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-brand-black">
              Freedom to Wear Any Cut With Confidence
            </h2>
            <p className="text-brand-gray-dark text-base sm:text-lg font-medium leading-relaxed">
              Designed for off-shoulder, strapless, plunge, and tube styles where traditional tape fails or peeks out.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-brand-white border border-brand-gray p-8 rounded-sm hover:border-brand-black transition-colors">
              <h3 className="text-xl font-bold text-brand-black mb-2">Off-Shoulder Styles</h3>
              <p className="text-sm text-brand-gray-dark font-medium leading-relaxed mb-4">
                Sleeves constantly snapping up when you raise your hands? Roll on your shoulder curve to keep sleeves flat and stationary.
              </p>
              <span className="text-xs font-bold text-brand-black uppercase tracking-wider">No sleeve ride-up</span>
            </div>

            <div className="bg-brand-white border border-brand-gray p-8 rounded-sm hover:border-brand-black transition-colors">
              <h3 className="text-xl font-bold text-brand-black mb-2">Strapless & Bandeau</h3>
              <p className="text-sm text-brand-gray-dark font-medium leading-relaxed mb-4">
                Adds a gentle, secure boundary along the top edge of strapless gowns and tops, eliminating the habit of constantly hiking them up.
              </p>
              <span className="text-xs font-bold text-brand-black uppercase tracking-wider">Eliminates slip-down</span>
            </div>

            <div className="bg-brand-white border border-brand-gray p-8 rounded-sm hover:border-brand-black transition-colors">
              <h3 className="text-xl font-bold text-brand-black mb-2">Plunge & Deep V-Necklines</h3>
              <p className="text-sm text-brand-gray-dark font-medium leading-relaxed mb-4">
                Keeps loose neckline fabric pinned directly against the skin so it never falls open when leaning forward, bending, or dancing.
              </p>
              <span className="text-xs font-bold text-brand-black uppercase tracking-wider">Safe forward movement</span>
            </div>

            <div className="bg-brand-white border border-brand-gray p-8 rounded-sm hover:border-brand-black transition-colors">
              <h3 className="text-xl font-bold text-brand-black mb-2">Tube Tops</h3>
              <p className="text-sm text-brand-gray-dark font-medium leading-relaxed mb-4">
                Keeps lightweight tube tops and crops adhering comfortably without bunching or rolling down throughout the day.
              </p>
              <span className="text-xs font-bold text-brand-black uppercase tracking-wider">Smooth stay-put fit</span>
            </div>

            <div className="bg-brand-white border border-brand-gray p-8 rounded-sm hover:border-brand-black transition-colors">
              <h3 className="text-xl font-bold text-brand-black mb-2">Wrap Dresses & Slits</h3>
              <p className="text-sm text-brand-gray-dark font-medium leading-relaxed mb-4">
                Anchor overlapping wrap dress panels and thigh slits exactly at your preferred comfort height.
              </p>
              <span className="text-xs font-bold text-brand-black uppercase tracking-wider">Custom coverage control</span>
            </div>

            <div className="bg-brand-white border border-brand-gray p-8 rounded-sm hover:border-brand-black transition-colors">
              <h3 className="text-xl font-bold text-brand-black mb-2">Evening & Party Outfits</h3>
              <p className="text-sm text-brand-gray-dark font-medium leading-relaxed mb-4">
                From delicate silks to cocktail dresses, enjoy events and photos without having to constantly check or adjust your clothes.
              </p>
              <span className="text-xs font-bold text-brand-black uppercase tracking-wider">Photo-ready confidence</span>
            </div>

          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS / GUIDES PREVIEW */}
      <section className="py-20 lg:py-24 bg-brand-white px-6 border-b border-brand-gray/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-2 block">Application & Removal</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Simple. Fast. Clean.</h2>
            <p className="text-brand-gray-dark max-w-xl mx-auto font-medium text-base">
              Everything you need for an effortless experience with zero damage to clothes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/how-to-use" className="group block bg-brand-white p-8 sm:p-10 border border-brand-gray hover:border-brand-black transition-all">
              <div className="text-brand-pink font-bold text-xs uppercase tracking-widest mb-4">Step 01</div>
              <h3 className="text-2xl font-bold mb-3 text-brand-black group-hover:text-brand-pink transition-colors">How to Use</h3>
              <p className="text-brand-gray-dark mb-6 font-medium text-sm leading-relaxed">
                Roll a light layer on dry skin, place garment, and press firmly for 15 seconds.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-black">
                Read Guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/where-to-use" className="group block bg-brand-white p-8 sm:p-10 border border-brand-gray hover:border-brand-black transition-all">
              <div className="text-brand-pink font-bold text-xs uppercase tracking-widest mb-4">Step 02</div>
              <h3 className="text-2xl font-bold mb-3 text-brand-black group-hover:text-brand-pink transition-colors">Where to Use</h3>
              <p className="text-brand-gray-dark mb-6 font-medium text-sm leading-relaxed">
                Guidance for saree blouses, dupattas, off-shoulder sleeves, and deep necklines.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-black">
                Explore Uses <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/how-to-remove" className="group block bg-brand-white p-8 sm:p-10 border border-brand-gray hover:border-brand-black transition-all">
              <div className="text-brand-pink font-bold text-xs uppercase tracking-widest mb-4">Step 03</div>
              <h3 className="text-2xl font-bold mb-3 text-brand-black group-hover:text-brand-pink transition-colors">How to Remove</h3>
              <p className="text-brand-gray-dark mb-6 font-medium text-sm leading-relaxed">
                Peel garment slowly and wipe skin with warm water. Washes off fabric in regular water.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-black">
                Removal Steps <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. REVIEWS — DEMO DATA (Properly badged and culturally relevant) */}
      <section className="py-20 lg:py-24 px-6 bg-brand-pink-light/20 border-b border-brand-gray/60">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-brand-white border border-brand-gray text-[11px] font-bold uppercase tracking-wider text-brand-gray-dark rounded-full mb-3">
              Fictional Demo Entries For Layout Testing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-brand-black">User Experience Feedback</h2>
            <p className="text-brand-gray-dark text-sm font-medium">
              Illustrative community feedback demonstrating use cases across different Bangladeshi and modern styles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoReviews.map((review, i) => (
              <div 
                key={i} 
                className="bg-brand-white border border-brand-gray p-6 rounded-sm flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div>
                  {/* Demo Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-brand-pink">
                      {[...Array(review.rating)].map((_, idx) => (
                        <svg key={idx} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-gray/40 text-brand-gray-dark px-2 py-0.5 rounded-sm">
                      Demo Review
                    </span>
                  </div>

                  {/* Use case tag */}
                  <div className="text-xs font-bold text-brand-black mb-3">
                    {review.useCase}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-brand-gray-dark leading-relaxed font-normal mb-6">
                    "{review.text}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-brand-gray/50 flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-black">{review.name}</span>
                  <span className="text-brand-gray-dark">{review.location}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FAQ PREVIEW (Zero exaggerated medical claims) */}
      <section className="py-20 lg:py-24 px-6 bg-brand-white border-b border-brand-gray/60">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-brand-black">সাধারণ জিজ্ঞাসা (FAQ)</h2>
            <p className="text-brand-gray-dark font-medium text-sm">BODYBOND সম্পর্কে সাধারণ কিছু প্রশ্নের উত্তর।</p>
          </div>
          
          <div className="space-y-5 mb-10">
            <div className="p-6 bg-brand-white border border-brand-gray rounded-sm">
              <h3 className="text-lg font-bold mb-2 text-brand-black">কাপড়ে কি কোনো দাগ বা আঠালো ভাব থাকবে?</h3>
              <p className="text-brand-gray-dark font-medium text-sm leading-relaxed">
                না। ফর্মুলাটি ওয়াটার-সল্যুবল (water-soluble), যা কাপড়ে কোনো স্থায়ী দাগ ফেলে না এবং পানিতে ধুয়ে নিলে সহজেই দূর হয়।
              </p>
            </div>

            <div className="p-6 bg-brand-white border border-brand-gray rounded-sm">
              <h3 className="text-lg font-bold mb-2 text-brand-black">ব্যবহারের পূর্বে কি ত্বকে পরীক্ষা করা উচিত?</h3>
              <p className="text-brand-gray-dark font-medium text-sm leading-relaxed">
                হ্যাঁ, যেকোনো ত্বকের প্রোডাক্টের মতোই আমরা পরামর্শ দিই কনুইয়ের ভেতরের অংশে সামান্য লাগিয়ে ১৫-২০ মিনিট প্যাচ টেস্ট করে নেওয়ার জন্য।
              </p>
            </div>

            <div className="p-6 bg-brand-white border border-brand-gray rounded-sm">
              <h3 className="text-lg font-bold mb-2 text-brand-black">ডেলিভারি এবং পেমেন্ট কীভাবে করা যায়?</h3>
              <p className="text-brand-gray-dark font-medium text-sm leading-relaxed">
                আমরা সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা দিচ্ছি। ঢাকায় ফ্রি ডেলিভারি এবং ঢাকার বাইরে মাত্র ১৩০ টাকা।
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link to="/faq" className="text-brand-black hover:text-brand-pink transition-colors tracking-widest uppercase text-xs font-bold border-b-2 border-brand-black hover:border-brand-pink pb-1">
              সকল প্রশ্নাবলী দেখুন (View All FAQs)
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="py-24 sm:py-28 px-6 text-center bg-brand-black text-brand-white">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-2xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-brand-white">
            Your Outfit. Your Confidence.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-brand-white/80 mb-8 text-base sm:text-lg font-normal leading-relaxed">
            শাড়ির ব্লাউজ থেকে প্রিয় ড্রেস—পোশাকের সঠিক অবস্থানের জন্য অর্ডার করুন অরিজিনাল BODYBOND Body Glue.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/products/body-glue" 
              className="inline-block bg-brand-pink text-brand-black px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-brand-white transition-colors"
            >
              অর্ডার করুন এখনই (৳{price})
            </Link>
            <Link 
              to="/how-to-use" 
              className="inline-block border border-brand-white/40 text-brand-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-brand-white hover:text-brand-black transition-colors"
            >
              ব্যবহার পদ্ধতি
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
