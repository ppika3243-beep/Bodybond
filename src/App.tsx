import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/UI/ScrollToTop';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import { Shop, ProductDetails } from './pages/Product';
import { HowToUse, WhereToUse, HowToRemove } from './pages/Guides';
import { TrackOrder, Checkout } from './pages/Order';
import { Faq, Contact, Legal } from './pages/Static';
import { AdminDashboard } from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-brand-white">
        <Header />
        <main className="flex-grow pt-[72px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products/body-glue" element={<ProductDetails />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/where-to-use" element={<WhereToUse />} />
            <Route path="/how-to-remove" element={<HowToRemove />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/return-policy" element={<Legal title="Return Policy" />} />
            <Route path="/cancellation-policy" element={<Legal title="Cancellation Policy" />} />
            <Route path="/privacy-policy" element={<Legal title="Privacy Policy" />} />
            <Route path="/terms" element={<Legal title="Terms & Conditions" />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
