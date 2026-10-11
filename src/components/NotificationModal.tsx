import React, { useState } from 'react';
import {
  Bell,
  X,
  Send,
  Trash2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { BroadcastNotification, ActiveAdminSession } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: BroadcastNotification[];
  session: ActiveAdminSession | null;
  onSendBroadcast: (notif: Omit<BroadcastNotification, 'id' | 'createdAt' | 'isActive'>) => void;
  onDeleteNotification: (id: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  session,
  onSendBroadcast,
  onDeleteNotification
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'welcome' | 'urgent' | 'announcement'>('welcome');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    onSendBroadcast({
      title: broadcastTitle.trim() || 'إشعار ترحيبي رسمي',
      message: broadcastMessage.trim(),
      senderName: session ? session.name : 'المدير العام عيون Prince',
      type: broadcastType
    });

    setBroadcastTitle('');
    setBroadcastMessage('');
    setFeedbackMsg('تم نشر رسالة الترحيب لكافة الزوار والمستخدمين بنجاح!');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="مركز الإشعارات ورسائل الترحيب"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-[#090D1A] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F1424] border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>مركز الإشعارات والترحيب المباشر</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono-num font-bold border border-amber-400/40">
                  {notifications.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                رسائل الترحيب والتنبيهات المباشرة من قيادة شركة Vibers V العالمية
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة الإشعارات"
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* General Manager Broadcast Composer Form (Shown if Admin is logged in) */}
          {session && (
            <div className="p-5 rounded-2xl bg-[#0F1424] border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>بث رسالة ترحيب أو تنبيه للمستخدمين الجدد</span>
                </div>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  صلاحية القيادة
                </span>
              </div>
              <p className="text-xs text-slate-300">
                اكتب رسالة ترحيبية أو إشعاراً لطمأنة المستخدمين الجدد عند انضمامهم للموقع لتظهر لهم فوراً في أعلى الشاشة.
              </p>

              <form onSubmit={handleSend} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      عنوان الرسالة
                    </label>
                    <input
                      type="text"
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="مثال: رسالة ترحيب ملكية من الإدارة"
                      className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      نوع الإشعار
                    </label>
                    <select
                      value={broadcastType}
                      onChange={(e) => setBroadcastType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="welcome">🎉 رسالة ترحيب وطمأنة للمنضمين</option>
                      <option value="announcement">📢 إعلان رسمي وتوجيه عام</option>
                      <option value="urgent">⚠️ تنبيه عاجل من القيادة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    نص الرسالة الترحيبية <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="مثال: أهلاً وسهلاً بك في Vibers V العالمية! تم استلام طلبك بنجاح، ويجري تدقيقه واعتماده مباشرة من المدير العام عيون Prince..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {feedbackMsg && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{feedbackMsg}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>بث رسالة الترحيب لجميع المستخدمين الآن</span>
                </button>
              </form>
            </div>
          )}

          {/* Notifications List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              سجل التنبيهات ورسائل الترحيب المعتمدة:
            </h4>

            {notifications.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#0F1424] border border-slate-800 text-slate-400 text-xs space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-600" />
                <p>لا توجد إشعارات حالياً.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const isWelcome = n.type === 'welcome';
                const isUrgent = n.type === 'urgent';

                return (
                  <article
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      isWelcome
                        ? 'bg-amber-950/15 border-amber-500/30'
                        : isUrgent
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : 'bg-[#0F1424] border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isWelcome
                            ? 'bg-amber-500/20 text-amber-400'
                            : isUrgent
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {isWelcome ? (
                          <Sparkles className="w-4 h-4" />
                        ) : isUrgent ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{n.title}</h5>
                          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {n.senderName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono-num">{n.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">{n.message}</p>
                      </div>
                    </div>

                    {session?.isGeneralManager && (
                      <button
                        type="button"
                        onClick={() => onDeleteNotification(n.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                        title="حذف هذا الإشعار"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>

        <div className="px-6 py-3.5 bg-[#0B0F1C] border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            منظومة Vibers V العالمية · برعاية المدير العام عيون Prince · تحديث وتزامن فوري 24/7
          </p>
        </div>
      </div>
    </div>
  );
};
