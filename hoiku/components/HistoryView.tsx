
import React, { useState } from 'react';
import { CallLog, CallStatus, ClassName } from '../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Search, Filter, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface HistoryViewProps {
  logs: CallLog[];
  onUpdateStatus: (id: string, status: CallStatus) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<ClassName | 'all'>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || log.className === filterClass;
    return matchesSearch && matchesClass;
  });

  const getStatusStyle = (status: CallStatus) => {
    switch(status) {
      case CallStatus.URGENT: return 'bg-red-50 text-red-600 border-red-100';
      case CallStatus.PENDING: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case CallStatus.COMPLETED: return 'bg-green-50 text-green-600 border-green-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 font-kiwi w-full">応対履歴</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="お名前や内容で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-orange-100 rounded-2xl focus:ring-2 focus:ring-orange-200 outline-none"
            />
          </div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value as any)}
            className="px-4 py-2 bg-white border border-orange-100 rounded-2xl outline-none"
          >
            <option value="all">全クラス</option>
            {Object.values(ClassName).map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white border border-orange-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-4">
            {/* Left Info */}
            <div className="flex md:flex-col justify-between md:justify-center items-center md:items-start min-w-[120px] pb-4 md:pb-0 md:border-r border-orange-50 pr-4">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{format(log.timestamp, 'yyyy/MM/dd')}</p>
                <p className="text-lg font-black text-orange-400 font-kiwi">{format(log.timestamp, 'HH:mm')}</p>
              </div>
              <div className="mt-2 text-right md:text-left">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold">
                  {log.className}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-800">{log.callerName}</h3>
                <span className="text-gray-400 text-sm">/ {log.childName}</span>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{log.content}</p>
              
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-gray-400 font-bold">
              </div>
            </div>

            {/* Action/Status */}
            <div className="flex md:flex-col justify-end gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-orange-50 pl-4">
              <div className={`px-4 py-2 rounded-2xl border text-xs font-bold text-center flex items-center justify-center gap-1 ${getStatusStyle(log.status)}`}>
                {log.status === CallStatus.URGENT ? <AlertCircle size={14} /> : 
                 log.status === CallStatus.PENDING ? <Clock size={14} /> : <CheckCircle size={14} />}
                {log.status}
              </div>
              <div className="flex gap-1">
                {log.status !== CallStatus.COMPLETED && (
                  <button 
                    onClick={() => onUpdateStatus(log.id, CallStatus.COMPLETED)}
                    className="flex-1 md:flex-none px-3 py-2 bg-green-500 text-white rounded-xl text-[10px] font-bold hover:bg-green-600 transition-colors"
                  >
                    完了にする
                  </button>
                )}
                {log.status === CallStatus.COMPLETED && (
                  <button 
                    onClick={() => onUpdateStatus(log.id, CallStatus.PENDING)}
                    className="flex-1 md:flex-none px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-bold hover:bg-gray-200 transition-colors"
                  >
                    未完了に戻す
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredLogs.length === 0 && (
          <div className="bg-white border border-orange-100 rounded-3xl p-12 text-center text-gray-400">
            一致する履歴が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
