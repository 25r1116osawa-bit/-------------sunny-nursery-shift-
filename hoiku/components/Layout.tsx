
import React from 'react';
import { Phone, History, LayoutDashboard, Settings, Calendar } from 'lucide-react';
import { auth } from '../firebase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const user = auth.currentUser;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fdfbf7]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-orange-100 p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-orange-400 p-2 rounded-xl text-white">
            <Phone size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 font-kiwi">保育園でんわ帳</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="ダッシュボード" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<History size={20} />} 
            label="応対履歴" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <NavItem 
            icon={<Calendar size={20} />} 
            label="シフト管理" 
            active={activeTab === 'shifts'} 
            onClick={() => setActiveTab('shifts')} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="設定" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>
        
        <div className="mt-auto p-4 bg-orange-50 rounded-2xl">
          <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">ログイン中</p>
          <p className="text-sm font-medium text-gray-700">{user?.displayName || '先生'}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-24 md:pb-0">
        <header className="bg-white border-b border-orange-100 p-4 sticky top-0 z-10 flex justify-between items-center md:hidden">
          <div className="flex items-center gap-2">
            <div className="bg-orange-400 p-1.5 rounded-lg text-white">
              <Phone size={18} />
            </div>
            <h1 className="text-lg font-bold text-gray-800 font-kiwi">でんわ帳</h1>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-orange-200 border-2 border-white"></div>
          </div>
        </header>
        
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 flex md:hidden h-16 px-4 z-20">
        <MobileNavItem 
          icon={<LayoutDashboard size={24} />} 
          label="ホーム" 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <MobileNavItem 
          icon={<History size={24} />} 
          label="履歴" 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
        />
        <MobileNavItem 
          icon={<Calendar size={24} />} 
          label="シフト" 
          active={activeTab === 'shifts'} 
          onClick={() => setActiveTab('shifts')} 
        />
        <MobileNavItem 
          icon={<Settings size={24} />} 
          label="設定" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
        />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-orange-400 text-white shadow-md' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-1 ${
      active ? 'text-orange-500' : 'text-gray-400'
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default Layout;
