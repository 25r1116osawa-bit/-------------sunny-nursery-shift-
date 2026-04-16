
import React, { useState } from 'react';
import { CallStatus, ClassName, CallLog } from '../types';
import { Send, User, Baby, MessageSquare, Tag, AlertCircle } from 'lucide-react';

interface CallEntryFormProps {
  onAddLog: (log: CallLog) => void;
}

const CallEntryForm: React.FC<CallEntryFormProps> = ({ onAddLog }) => {
  const [callerName, setCallerName] = useState('');
  const [childName, setChildName] = useState('');
  const [className, setClassName] = useState<ClassName>(ClassName.Hiyoko);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<CallStatus>(CallStatus.PENDING);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerName || !content) return;

    setIsSubmitting(true);
    
    const newLog: CallLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      callerName,
      childName,
      className,
      content,
      status: status,
      recordedBy: '佐藤 先生'
    };

    onAddLog(newLog);
    
    // Reset form
    setCallerName('');
    setChildName('');
    setClassName(ClassName.Hiyoko);
    setContent('');
    setStatus(CallStatus.PENDING);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm transition-all hover:shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 font-kiwi">
        <div className="w-2 h-6 bg-orange-400 rounded-full"></div>
        新しい電話を記録する
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 flex items-center gap-1 ml-1">
              <User size={14} /> 相手のお名前
            </label>
            <input
              type="text"
              required
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="例: 田中様 (母)"
              className="w-full px-4 py-3 rounded-2xl bg-orange-50 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-200 transition-all outline-none"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 flex items-center gap-1 ml-1">
              <Baby size={14} /> 園児のお名前
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="例: 太郎くん"
              className="w-full px-4 py-3 rounded-2xl bg-orange-50 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-200 transition-all outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 flex items-center gap-1 ml-1">
              <Tag size={14} /> クラス名
            </label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value as ClassName)}
              className="w-full px-4 py-3 rounded-2xl bg-orange-50 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-200 transition-all outline-none appearance-none"
            >
              {Object.values(ClassName).map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 flex items-center gap-1 ml-1">
              <AlertCircle size={14} /> 対応ステータス
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CallStatus)}
              className="w-full px-4 py-3 rounded-2xl bg-orange-50 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-200 transition-all outline-none appearance-none"
            >
              {Object.values(CallStatus).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-500 flex items-center gap-1 ml-1">
            <MessageSquare size={14} /> お話の内容
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="電話の内容を入力してください..."
            rows={4}
            className="w-full px-4 py-3 rounded-2xl bg-orange-50 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-500 active:scale-95 transition-all shadow-lg shadow-orange-100 disabled:opacity-70"
        >
          <Send size={20} />
          記録を保存する
        </button>
      </form>
    </div>
  );
};

export default CallEntryForm;
