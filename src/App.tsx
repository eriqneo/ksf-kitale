import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sermons from './pages/Sermons';
import AboutStory from './pages/AboutStory';
import ImNew from './pages/ImNew';
import MinistriesKids from './pages/MinistriesKids';
import MinistriesYouth from './pages/MinistriesYouth';
import MinistriesWomen from './pages/MinistriesWomen';
import MinistriesMen from './pages/MinistriesMen';
import MinistriesHomeFellowship from './pages/MinistriesHomeFellowship';
import Gallery from './pages/Gallery';
import BibleTrivia from './pages/BibleTrivia';
import Give from './pages/Give';
import Live from './pages/Live';
import PrayerPoints from './pages/PrayerPoints';
import ScrollToTop from './components/ScrollToTop';
import Preloader from './components/Preloader';
import BackToTop from './components/BackToTop';
import { AnimatePresence } from 'motion/react';
import { PocketBaseProvider, usePocketBase } from './context/PocketBaseContext';

function MainAppContent() {
  const { isLoadingSettings } = usePocketBase();
  const [isLoadingTimer, setIsLoadingTimer] = React.useState(true);

  React.useEffect(() => {
    // Keep preloader for at least 1.5s for smooth transition
    const timer = setTimeout(() => setIsLoadingTimer(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const showPreloader = isLoadingTimer || isLoadingSettings;

  return (
    <>
      <AnimatePresence mode="wait">
        {showPreloader && <Preloader key="preloader" />}
      </AnimatePresence>
      <ScrollToTop />
      <BackToTop />
      <div className="min-h-screen bg-ksf-gray-bg font-body selection:bg-primary-blue/10 selection:text-primary-blue flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/about/story" element={<AboutStory />} />
            <Route path="/im-new" element={<ImNew />} />
            <Route path="/ministries/kids" element={<MinistriesKids />} />
            <Route path="/ministries/youth" element={<MinistriesYouth />} />
            <Route path="/ministries/women" element={<MinistriesWomen />} />
            <Route path="/ministries/men" element={<MinistriesMen />} />
            <Route path="/ministries/home-fellowship" element={<MinistriesHomeFellowship />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/bible-trivia" element={<BibleTrivia />} />
            <Route path="/give" element={<Give />} />
            <Route path="/live" element={<Live />} />
            <Route path="/prayer-points" element={<PrayerPoints />} />
            {/* Fallback to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <PocketBaseProvider>
      <Router>
        <MainAppContent />
      </Router>
    </PocketBaseProvider>
  );
}
