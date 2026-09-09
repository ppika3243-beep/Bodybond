import { motion } from 'motion/react';

export function Faq() {
  const faqs = [
    {
      q: 'How long does the adhesive last?',
      a: 'BODYBOND provides a strong hold that typically lasts all day or night, depending on activity level and skin type.'
    },
    {
      q: 'Is it safe for sensitive skin?',
      a: 'The formula is designed for gentle wear on skin. However, we always recommend doing a small 15-minute patch test on the inside of your wrist or arm before full application.'
    },
    {
      q: 'Will it damage my clothes?',
      a: 'No, BODYBOND is designed to be gentle on fabrics and washes out easily with standard cold water washing.'
    },
    {
      q: 'Can I sweat while wearing it?',
      a: 'The adhesive is sweat-resistant, making it perfect for dancing and warm weather.'
    },
  ];

  return (
    <div className="w-full py-24 px-6 max-w-3xl mx-auto bg-brand-white min-h-[80vh]">
      <h1 className="text-4xl md:text-5xl mb-12 text-center">FAQ</h1>
      <div className="space-y-8">
        {faqs.map((faq, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="border-b border-brand-gray pb-6">
            <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
            <p className="text-brand-gray-dark font-medium leading-relaxed">{faq.a}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="w-full py-24 px-6 bg-brand-white min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl mb-6">Contact Us</h1>
        <p className="text-brand-gray-dark font-medium mb-12">Have a question? We're here to help.</p>
        
        <div className="bg-brand-gray/30 p-12 border border-brand-gray">
          <h3 className="text-sm tracking-widest uppercase font-bold mb-6">Email Support</h3>
          <a href="mailto:support@bodybond.com" className="text-2xl font-bold text-brand-black hover:text-brand-pink transition-colors">support@bodybond.com</a>
          
          <p className="mt-8 text-sm font-medium text-brand-gray-dark">
            We aim to respond to all inquiries within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Legal({ title }: { title: string }) {
  return (
    <div className="w-full py-24 px-6 max-w-3xl mx-auto bg-brand-white min-h-[80vh]">
      <h1 className="text-3xl md:text-4xl mb-12">{title}</h1>
      <div className="space-y-6 text-brand-gray-dark font-medium leading-relaxed">
        <p>
          This is a placeholder for the official {title}. The content for this section will be updated by the BODYBOND legal team.
        </p>
        <p>
          BODYBOND is committed to providing premium quality and service. Please review our policies carefully before making a purchase. If you have any questions regarding these terms, please contact our support team.
        </p>
        <p className="pt-8 border-t border-brand-gray text-sm">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
