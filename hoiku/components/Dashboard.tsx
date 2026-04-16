
import React from 'react';
import { CallLog, CallStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Phone, Users, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { auth } from '../firebase';

interface DashboardProps {
  logs: CallLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  const user = auth.currentUser;
  const pendingCount = logs.filter(l => l.status === CallStatus.PENDING).length;
  const urgentCount = logs.filter(l => l.status === CallStatus.URGENT).length;
  const totalToday = logs.filter(l => {
    const today = new Date().setHours(0,0,0,0);
    return new Date(l.timestamp).setHours(0,0,0,0) === today;
  }).length;

  // Prepare chart data (last 7 days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = format(d, 'M/d');
    const count = logs.filter(l => 
      format(new Date(l.timestamp), 'M/d') === dayStr
    ).length;
    return { name: dayStr, count };
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800 font-kiwi">
          お疲れ様です、{user?.displayName?.split(' ')[0] || '先生'}
        </h1>
        <p className="text-gray-500">今日の園の様子を確認しましょう</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Phone className="text-blue-500" />} 
          label="本日の着信" 
          value={totalToday} 
          color="bg-blue-50" 
        />
        <StatCard 
          icon={<Users className="text-green-500" />} 
          label="全履歴件数" 
          value={logs.length} 
          color="bg-green-50" 
        />
        <StatCard 
          icon={<Clock className="text-yellow-600" />} 
          label="要対応" 
          value={pendingCount} 
          color="bg-yellow-50" 
        />
        <StatCard 
          icon={<AlertTriangle className="text-red-500" />} 
          label="至急" 
          value={urgentCount} 
          color="bg-red-50" 
        />
      </div>

      {/* Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
            週間の着信件数
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#fb923c' : '#fdba74'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-4">最近の通知</h3>
          <div className="space-y-4">
            {logs.slice(0, 3).map((log) => (
              <div key={log.id} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  log.status === CallStatus.URGENT ? 'bg-red-500' : 
                  log.status === CallStatus.PENDING ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="text-sm font-bold text-gray-800 line-clamp-1">{log.callerName}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{log.content}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{format(log.timestamp, 'HH:mm', {locale: ja})}</p>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-10 italic">履歴がまだありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) => (
  <div className={`p-4 rounded-3xl ${color} flex flex-col gap-2 transition-transform hover:scale-[1.02]`}>
    <div className="bg-white/60 p-2 rounded-xl w-fit">{icon}</div>
    <div>
      <p className="text-xs font-bold text-gray-500">{label}</p>
      <p className="text-2xl font-black text-gray-800">{value}<span className="text-xs ml-1 font-normal">件</span></p>
    </div>
  </div>
);

export default Dashboard;
