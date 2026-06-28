import { useState } from 'react';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AnimatedBackground } from './components/AnimatedBackground';
import { CTA } from './components/CTA';
import { Features } from './components/Features';
import { DocumentAnalyzer } from './components/DocumentAnalyzer';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { InteractiveDemo } from './components/InteractiveDemo';
import { Navbar } from './components/Navbar';
import { OrderModal } from './components/OrderModal';
import { Pricing } from './components/Pricing';
import { Story } from './components/Story';

function App() {
  const [selectedPackage, setSelectedPackage] = useState('Professional');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plannerText, setPlannerText] = useState('');

  const openOrder = (packageName = 'Professional') => {
    setSelectedPackage(packageName);
    setIsModalOpen(true);
  };

  const sendToPlanner = (text: string) => {
    setPlannerText(text);
    window.setTimeout(() => {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-night text-white">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar onOpen={() => openOrder('Professional')} />
        <Hero onOpen={() => openOrder('Launch Access')} />
        <DocumentAnalyzer onSendToPlanner={sendToPlanner} />
        <Story />
        <Features />
        <InteractiveDemo incomingText={plannerText} />
        <AnalyticsDashboard />
        <Pricing onSelect={openOrder} />
        <CTA onOpen={() => openOrder('Enterprise')} />
        <Footer />
      </div>
      <OrderModal
        isOpen={isModalOpen}
        selectedPackage={selectedPackage}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

export default App;
