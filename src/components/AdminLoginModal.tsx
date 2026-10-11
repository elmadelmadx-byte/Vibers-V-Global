import React, { useState } from 'react';
import { Lock, X, ShieldAlert, KeyRound, Mail, UserCheck } from 'lucide-react';
import { SubAdminAccount, ActiveAdminSession } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  subAdmins: SubAdminAccount[];
  onSuccessLogin: (session: ActiveAdminSession) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  subAdmins,
  onSuccessLogin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. General Manager Ayoun Prince Master Access
    if (cleanEmail === 'vibersvge@gmail.com' && cleanPass === 'eE2001257@') {
      setEmail('');
      setPassword('');
      onSuccessLogin({
        isGeneralManager: true,
        email: 'vibersvge@gmail.com',
        name: 'عيون Prince (المدير العام)',
        permissions: {
          canApproveApplicants: true,
          canRejectApplicants: true,
          canBanUsers: true,
          canDeleteReviews: true,
          canEditBanners: true,
          canViewStatsOnly: false,
          canEvaluateCandidates: true
        }
      });
      return;
    }

    // 2. Sub-Admin Delegated Accounts (created by General Manager)
    const matchedSub = subAdmins.find(
      (s) => s.email.toLowerCase() === cleanEmail && s.password === cleanPass
    );

    if (matchedSub) {
      setEmail('');
      setPassword('');
      onSuccessLogin({
        isGeneralManager: false,
        email: matchedSub.email,
        name: `${matchedSub.name} (${matchedSub.roleTitle})`,
        permissions: matchedSub.permissions
      });
      return;
    }

    setError('بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور المعتمدة من الإدارة.');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="تسجيل دخول الإدارة العليا والمسؤولين"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#0F1424] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">بوابة الإدارة ونظام المشرفين</h3>
              <p className="text-xs text-slate-400">دخول المدير العام عيون Prince والمشرفين المعتمدين</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="adminEmail" className="block text-xs font-semibold text-slate-300">
              البريد الإلكتروني المعتمد
            </label>
            <div className="relative">
              <input
                id="adminEmail"
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vibersvge@gmail.com أو بريد المشرف المعتمد"
                className="w-full px-4 py-3 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white font-mono-num focus:outline-none focus:border-amber-400"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adminPass" className="block text-xs font-semibold text-slate-300">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="adminPass"
                type="password"
                dir="ltr"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white font-mono-num focus:outline-none focus:border-amber-400"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>أنواع الصلاحيات:</span>
            </div>
            <p>1. حساب المدير العام عيون Prince (صلاحية كاملة لإنشاء مشرفين وتعديل المنظومة).</p>
            <p>2. حسابات المشرفين المساعدين (وفق الصلاحيات المحددة لهم من المدير العام).</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
          >
            الدخول إلى لوحة التحكم
          </button>
        </form>
      </div>
    </div>
  );
};
