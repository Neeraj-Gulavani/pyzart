import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPage } from './components/landing-page';
import { Workspace } from './components/workspace';
import { Dashboard } from './components/dashboard';
import { AuthModal } from './components/auth-modal';
import { DarkModeToggle } from './components/dark-mode-toggle';

type Page = 'landing' | 'workspace' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleAuth = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setCurrentPage('dashboard');
  };

  const navigateTo = (page: Page) => {
    if (page !== 'landing' && !isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentPage(page);
  };

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage 
              onNavigate={navigateTo} 
              onAuth={() => setIsAuthModalOpen(true)}
              isAuthenticated={isAuthenticated}
            />
          </motion.div>
        )}
        
        {currentPage === 'workspace' && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Workspace onNavigate={navigateTo} />
          </motion.div>
        )}
        
        {currentPage === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard onNavigate={navigateTo} />
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
      />
    </div>
  );
}