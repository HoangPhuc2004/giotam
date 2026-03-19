import { useState } from 'react';
import { Home } from './components/Home';
import { News } from './components/News';
import { Appointment } from './components/Appointment';
import { Profile } from './components/Profile';
import { DonateBlood } from './components/DonateBlood';
import { Donation } from './components/Donation';
import { DonationHistory } from './components/DonationHistory';
import { Hotline } from './components/Hotline';
import { Auth } from './components/Auth';
import { BottomNav } from './components/BottomNav';
import { SettingsMenu } from './components/SettingsMenu';
import { AdminDashboard } from './components/AdminDashboard';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ConfigurationPage } from './components/ConfigurationPage';
import { SettingsPage } from './components/SettingsPage';
import { useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [currentPage, setCurrentPage] = useState('home');
  const [hasHealthDeclaration, setHasHealthDeclaration] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userRole, setUserRole] = useState('donor');

  useEffect(() => {
    // Initialize theme
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    // Check health declaration
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const stored = localStorage.getItem(`health_declaration_${user.id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          const daysDiff = (new Date().getTime() - new Date(parsed.date).getTime()) / (1000 * 3600 * 24);
          if (daysDiff <= 90 && user.donations_count === parsed.donationsCount) {
             setHasHealthDeclaration(true);
          } else {
             localStorage.removeItem(`health_declaration_${user.id}`);
             setHasHealthDeclaration(false);
          }
        }
      } catch (e) {}
    }
  }, [isLoggedIn]);

  // Show Auth screen if not logged in
  if (!isLoggedIn) {
    return <Auth onLogin={(user) => {
      setIsLoggedIn(true);
      if (user && user.role) {
        setUserRole(user.role);
      } else {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            if (parsed.role) setUserRole(parsed.role);
          } catch(e) {}
        }
      }
    }} />;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSettingsOpen(false);
    setUserRole('donor');
    setCurrentPage('home');
    setActiveTab('home');
  };

  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-[393px] h-[852px] bg-background flex flex-col overflow-hidden relative shadow-2xl">
          <div className="flex-1 overflow-y-auto">
            <AdminDashboard onLogout={handleLogout} />
          </div>
        </div>
      </div>
    );
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Update active tab based on navigation
    if (page === 'home' || page === 'health-declaration' || page === 'register-donation' || page === 'donation-history' || page === 'hotline') {
      setActiveTab('home');
    }
  };

  const handleHealthDeclarationComplete = () => {
    setHasHealthDeclaration(true);
    setCurrentPage('register-donation');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'health-declaration':
        return <DonateBlood onComplete={handleHealthDeclarationComplete} onBack={() => setCurrentPage('home')} />;
      case 'register-donation':
        return <Appointment hasHealthDeclaration={hasHealthDeclaration} onNavigateToDeclaration={() => setCurrentPage('health-declaration')} onBack={() => setCurrentPage('home')} />;
      case 'donation-history':
        return <DonationHistory onBack={() => setCurrentPage('home')} />;
      case 'hotline':
        return <Hotline onBack={() => setCurrentPage('home')} />;
      case 'news':
        return <News onBack={() => setCurrentPage('home')} />;
      case 'donate':
        return <DonateBlood onComplete={handleHealthDeclarationComplete} onBack={() => setCurrentPage('home')} />;
      case 'donate-support':
        return <Donation onBack={() => setCurrentPage('home')} />;
      case 'profile':
        return <Profile onLogout={handleLogout} onBack={() => setCurrentPage('home')} />;
      case 'leaderboard':
        return <LeaderboardPage onBack={() => setCurrentPage('home')} />;
      case 'config':
        return <ConfigurationPage onBack={() => setCurrentPage('home')} onLogout={handleLogout} />;
      case 'settings':
        return <SettingsPage onBack={() => setCurrentPage('home')} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(tab);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-[393px] h-[852px] bg-background flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto pb-28">
          {renderContent()}
        </div>
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        
        {/* Settings Menu */}
        <SettingsMenu
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onProfileClick={() => {
            setCurrentPage('profile');
            setActiveTab('profile');
            setIsSettingsOpen(false);
          }}
        />
      </div>
    </div>
  );
}