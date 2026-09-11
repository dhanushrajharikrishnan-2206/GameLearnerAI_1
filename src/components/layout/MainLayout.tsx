import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { RewardPopup } from '../gamification/RewardPopup';
import { LevelUpModal } from '../gamification/LevelUpModal';
import { HeartsRecoveryModal } from '../gamification/HeartsRecoveryModal';
import { GlobalAiCompanion } from '../ai/GlobalAiCompanion';

export const MainLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f2f9f5] text-slate-900 transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Navbar */}
        <Navbar onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Page View with dynamic nested routes */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>
      </div>

      {/* Gamification Celebrations & Overlays */}
      <RewardPopup />
      <LevelUpModal />
      <HeartsRecoveryModal />

      {/* Global AI Companion Chatbot */}
      <GlobalAiCompanion />
    </div>
  );
};
