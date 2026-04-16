
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CallEntryForm from './components/CallEntryForm';
import HistoryView from './components/HistoryView';
import Dashboard from './components/Dashboard';
import ShiftManager from './components/ShiftManager';
import { CallLog, CallStatus, ClassName } from './types';
import { Plus, X, LogIn, LogOut } from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth state listener (keeping for profile name/UI consistency if desired, but storage is local)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hoikuen_call_logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load logs", e);
      }
    } else {
      // Mock data for initial view if empty
      const mockLogs: CallLog[] = [
        {
          id: '1',
          timestamp: Date.now() - 1000 * 60 * 60 * 2,
          callerName: '鈴木様 (母)',
          childName: 'はなちゃん',
          className: ClassName.Hiyoko,
          content: '少し熱があるようで、今日はお休みします。お昼頃また様子を見て連絡します。',
          status: CallStatus.PENDING,
          recordedBy: '佐藤 先生'
        }
      ];
      setLogs(mockLogs);
    }
  }, []);

  // Save to localStorage when logs change
  useEffect(() => {
    if (logs.length > 0) {
      localStorage.setItem('hoikuen_call_logs', JSON.stringify(logs));
    }
  }, [logs]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleAddLog = (newLog: CallLog) => {
    const logWithId = { ...newLog, id: Math.random().toString(36).substr(2, 9) };
    setLogs([logWithId, ...logs]);
    setShowAddModal(false);
    setActiveTab('history');
  };

  const handleUpdateStatus = (id: string, status: CallStatus) => {
    setLogs(logs.map(log => log.id === id ? { ...log, status } : log));
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfbf7] p-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-md w-full text-center border border-orange-100">
          <div className="bg-orange-400 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
            <Plus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 font-kiwi">保育園でんわ帳</h1>
          <p className="text-gray-500 mb-8">ログインして応対履歴やシフト管理を開始しましょう。</p>
          <button
            onClick={handleLogin}
            className="w-full bg-orange-400 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-orange-100"
          >
            <LogIn size={20} />
            Googleでログイン
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard logs={logs} />;
      case 'history':
        return <HistoryView logs={logs} onUpdateStatus={handleUpdateStatus} />;
      case 'shifts':
        return <ShiftManager />;
      case 'settings':
        return (
          <div className="bg-white p-8 rounded-3xl border border-orange-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-kiwi">設定</h2>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
              >
                <LogOut size={20} />
                ログアウト
              </button>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-8">
              <p className="text-sm text-orange-600 font-bold mb-1">ログイン中のユーザー</p>
              <p className="text-gray-800 font-medium">{user.displayName} ({user.email})</p>
            </div>
            <p className="text-gray-500">現在はデモ版です。ユーザー情報やクラス構成の設定がここで行えます。</p>
            <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">将来のアップデートで追加予定：</p>
              <ul className="text-sm text-gray-500 list-disc list-inside mt-2">
                <li>先生のアカウント管理</li>
                <li>クラス編成の変更</li>
                <li>外部カレンダー連携</li>
                <li>通知設定 (プッシュ通知)</li>
              </ul>
            </div>
          </div>
        );
      default:
        return <Dashboard logs={logs} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="relative">
        {renderContent()}
        
        {/* Floating Action Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-20 right-6 md:bottom-8 md:right-8 bg-orange-400 text-white p-4 rounded-full shadow-xl hover:bg-orange-500 active:scale-90 transition-all z-30 flex items-center justify-center group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 group-hover:ml-2 font-bold whitespace-nowrap">
            新しい記録
          </span>
        </button>

        {/* New Log Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setShowAddModal(false)}
            ></div>
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="absolute right-4 top-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="max-h-[90vh] overflow-y-auto p-2">
                <CallEntryForm onAddLog={handleAddLog} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
