import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">{title}</motion.h1>
    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-brand-gray-dark font-medium text-lg leading-relaxed">
      {subtitle}
    </motion.p>
  </div>
);

const CtaSection = () => (
  <div className="text-center mt-20">
    <Link to="/products/body-glue" className="inline-block bg-brand-black text-brand-white px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors">
      অর্ডার করুন এখনই
    </Link>
  </div>
);

export function HowToUse() {
  const steps = [
    { num: '01', title: 'ত্বক পরিষ্কার ও শুষ্ক রাখুন', desc: 'নিশ্চিত করুন ত্বক পরিষ্কার ও শুষ্ক। কোনো লোশন, তেল বা ট্যালকম পাউডার থাকলে মুছে নিন।' },
    { num: '02', title: 'রোল-অন করুন', desc: 'যেখানে পোশাক আটকে রাখতে চান (যেমন কাঁধ, ব্লাউজের বর্ডার বা গলার অংশ), সেখানে পাতলা একটি প্রলেপ দিন।' },
    { num: '03', title: 'পোশাক পজিশন করুন', desc: 'আপনার শাড়ির ব্লাউজ, ওড়না বা ড্রেসটি কাঙ্ক্ষিত স্থানে সঠিক মাপে বসান।' },
    { num: '04', title: '১০-১৫ সেকেন্ড প্রেস করুন', desc: 'হালকা চাপ দিয়ে কাপড়টি ত্বকের সাথে ১০ থেকে ১৫ সেকেন্ড ধরে রাখুন যাতে বন্ড সেট হয়।' },
    { num: '05', title: 'কনফিডেন্সের সাথে বের হন', desc: 'হোল্ড চেক করুন। কোনো টানাটানি বা খুলে পড়ার ভয় ছাড়াই নিজের লুক উপভোগ করুন।' },
  ];

  return (
    <div className="w-full py-20 md:py-24 px-6 bg-brand-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="কীভাবে ব্যবহার করবেন (How to Use)" 
          subtitle="সহজ ৫টি ধাপে আপনার পোশাককে রাখুন সারাদিন পারফেক্ট পজিশনে।" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={step.num} 
              className="bg-brand-white border border-brand-gray p-8 flex flex-col justify-between hover:border-brand-pink hover:shadow-md transition-all"
            >
              <div>
                <span className="text-brand-pink text-xs tracking-widest font-bold mb-4 block">STEP {step.num}</span>
                <h3 className="text-lg font-bold mb-3 text-brand-black">{step.title}</h3>
                <p className="text-brand-gray-dark font-medium text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 max-w-2xl mx-auto p-6 border border-brand-gray/80 bg-brand-pink-light/30 rounded-sm text-sm text-brand-gray-dark leading-relaxed">
          <strong className="text-brand-black block mb-1">গুরুত্বপূর্ণ পরামর্শ (Pro-Tip):</strong>
          নতুন ব্যবহারে ত্বকে সংবেদনশীলতা বুঝতে কনুইয়ের ভেতরের অংশে সামান্য লাগিয়ে ১৫ মিনিট প্যাচ টেস্ট (patch test) করে নেওয়া ভালো।
        </div>

        <CtaSection />
      </div>
    </div>
  );
}

export function WhereToUse() {
  const bangladeshiLooks = [
    { title: 'Saree Blouse (শাড়ির ব্লাউজ)', desc: 'ডিপ ব্যাক ব্লাউজ বা ব্রড শোল্ডার কাট যাতে কাঁধ থেকে বারবার খসে না পড়ে, সহজে আটকে রাখুন।' },
    { title: 'Orna & Dupatta (ওড়না / দোপাট্টা)', desc: 'জর্জেট বা সিল্কের ওড়না কাঁধে পিছলে যাওয়া ঠেকাতে সেফটিপিনের বিকল্প হিসেবে ব্যবহারযোগ্য।' },
    { title: 'Salwar Kameez & Three-piece', desc: 'গলার ডিপ নেকলাইন বা শোল্ডার স্ট্র্যাপ যাতে কাপড় নড়ে না যায় সেজন্য আদর্শ।' },
    { title: 'Kurti (কুর্তি ও টপস)', desc: 'সামনের বোতামের ফাঁক (button gaping) বা কাঁধের স্লিভ ঠিক জায়গায় রাখতে সহায়ক।' },
  ];

  const modernLooks = [
    { title: 'Deep Necklines (ডিপ নেকলাইন)', desc: 'প্লাঞ্জ নেকলাইন বা ভি-কাট ড্রেস শরীরের সাথে আটকে রাখে, কাপড় ফাঁক হওয়া রোধ করে।' },
    { title: 'Strapless & Bandeau (স্ট্র্যাপলেস)', desc: 'স্ট্র্যাপ ছাড়া ড্রেস বা টপস যাতে নিচের দিকে নেমে না যায়, ত্বকে দৃঢ় সাপোর্ট দেয়।' },
    { title: 'Off-Shoulder (অফ-শোল্ডার)', desc: 'হাঁটাহাঁটি বা হাত নাড়ালেও শোল্ডার স্লিভ উপরে উঠে যাওয়া বা নিচে পড়া বন্ধ করে।' },
    { title: 'Tube Tops (টিউব টপস)', desc: 'সারাদিন বা পার্টির পুরো সময় পোশাকের স্থানচ্যুতি ছাড়াই আরামদায়ক মুভমেন্ট নিশ্চিত করে।' },
    { title: 'High Slit Dresses (স্লিট ড্রেস)', desc: 'হাঁটার সময় ড্রেসের স্লিট অতিরিক্ত এলোমেলো হওয়া থেকে সুরক্ষিত রাখে।' },
    { title: 'Special Occasion & Partywear', desc: 'ওয়েডিং, পার্টি বা ফটোশুটে ভারী কাজের পোশাকেও বাড়তি আত্মবিশ্বাস দেয়।' },
  ];

  return (
    <div className="w-full py-20 md:py-24 px-6 bg-brand-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="কোথায় ব্যবহার করবেন (Where to Use)" 
          subtitle="শাড়ির ব্লাউজ, ওড়না থেকে শুরু করে ওয়েস্টার্ন ড্রেস ও অফ-শোল্ডার—সব ধরনের পোশাকে নিখুঁত ফিট।" 
        />

        {/* Bangladeshi / Traditional Wear */}
        <div className="mb-16">
          <div className="border-b border-brand-black pb-3 mb-8 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-brand-black">
              Bangladeshi & Traditional Outfits
            </h2>
            <span className="text-xs uppercase tracking-widest text-brand-pink font-bold">শাড়ি, ওড়না ও কুর্তি</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bangladeshiLooks.map((look, i) => (
              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} key={i} className="border border-brand-gray p-6 bg-brand-white hover:border-brand-black transition-colors">
                <h3 className="text-lg font-bold mb-2 text-brand-black">{look.title}</h3>
                <p className="text-brand-gray-dark font-medium text-sm leading-relaxed">{look.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modern & Western Outfits */}
        <div className="mb-16">
          <div className="border-b border-brand-black pb-3 mb-8 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-brand-black">
              Modern & Western Outfits
            </h2>
            <span className="text-xs uppercase tracking-widest text-brand-pink font-bold">ড্রেস, প্লাঞ্জ ও অফ-শোল্ডার</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modernLooks.map((look, i) => (
              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} key={i} className="border border-brand-gray p-6 bg-brand-white hover:border-brand-black transition-colors">
                <h3 className="text-lg font-bold mb-2 text-brand-black">{look.title}</h3>
                <p className="text-brand-gray-dark font-medium text-sm leading-relaxed">{look.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="text-center max-w-2xl mx-auto p-6 border border-brand-gray bg-brand-gray/20 text-brand-gray-dark text-sm font-medium">
          <p>সতর্কতা: BODYBOND ত্বক ও কাপড়ের মধ্যে হালকা কিন্তু মজবুত হোল্ড দেয়। অতিরিক্ত ভারী বা অত্যন্ত সূক্ষ্ম আনলাইন্ড সিল্ক ফ্যাব্রিকে ব্যবহারের পূর্বে ফ্যাব্রিকে ট্রায়াল দিয়ে নিন।</p>
        </div>
        
        <CtaSection />
      </div>
    </div>
  );
}

export function HowToRemove() {
  const removalSteps = [
    {
      num: '01',
      title: 'ধীরে ধীরে আলতো করে তুলুন (Peel Gently)',
      desc: 'পোশাকটি ত্বক থেকে আস্তে আস্তে আলাদা করুন। জোর করে টানবেন না, যাতে ত্বক বা কাপড়ের ওপর কোনো চাপ না পড়ে।'
    },
    {
      num: '02',
      title: 'হালকা পানিতে মুছে নিন (Wipe with Water)',
      desc: 'একটি ভেজা নরম কাপড় বা টিস্যু দিয়ে ত্বকের যে স্থানে আঠা ছিল তা হালকাভাবে মুছে নিন। ফর্মুলাটি পানিতে সহজেই পরিষ্কার হয়ে যায়।'
    },
    {
      num: '03',
      title: 'পোশাকের যত্ন (Care for Fabric)',
      desc: 'পোশাকে সামান্য আঠার দাগ থাকলে সাধারণ পানি বা স্বাভাবিক ওয়াশের মাধ্যমে কোনো অতিরিক্ত দাগ ছাড়া সম্পূর্ণ দূর হয়ে যায়।'
    }
  ];

  return (
    <div className="w-full py-20 md:py-24 px-6 bg-brand-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <PageHeader 
          title="কীভাবে তুলবেন (How to Remove)" 
          subtitle="ত্বকের জন্য মৃদু, কাপড়ের জন্য সম্পূর্ণ নিরাপদ।" 
        />
        
        <div className="space-y-6">
          {removalSteps.map((step) => (
            <div key={step.num} className="flex flex-col sm:flex-row gap-6 items-start bg-brand-white p-8 border border-brand-gray hover:border-brand-pink transition-colors">
              <span className="text-4xl font-bold text-brand-pink shrink-0 leading-none">{step.num}</span>
              <div>
                <h3 className="text-xl font-bold mb-2 text-brand-black">{step.title}</h3>
                <p className="leading-relaxed font-medium text-brand-gray-dark text-base">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 border border-brand-gray bg-brand-pink-light/30 text-brand-gray-dark text-sm text-center">
          কোনো ক্ষতিকারক কেমিক্যাল বা আলাদা রিমুভারের প্রয়োজন নেই। কেবল সাধারণ পানি দিয়েই পরিষ্কার করা যায়।
        </div>
        
        <CtaSection />
      </div>
    </div>
  );
}
