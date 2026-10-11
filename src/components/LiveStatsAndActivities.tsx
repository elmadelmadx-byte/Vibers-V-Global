import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  Award,
  FileText,
  Coins,
  Mic2,
  Crown,
  Star,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { LivePlatformStats, ActivityShowcase, StatCardCustomization } from '../types';
import { ROLES_LIST } from '../data/initialData';

interface LiveStatsAndActivitiesProps {
  stats: LivePlatformStats;
  activities: ActivityShowcase[];
  customCards: StatCardCustomization[];
  onSelectRoleAndScroll: (roleId: string) => void;
}

export const LiveStatsAndActivities: React.FC<LiveStatsAndActivitiesProps> = ({
  stats,
  activities,
  customCards,
  onSelectRoleAndScroll
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [liveActiveOffset, setLiveActiveOffset] = useState<number>(0);

  // Live fluctuating active user counter as requested by user ("الرقم بيروح ويجي كده يعني النشاطين")
  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = Math.floor(Math.sin(Date.now() / 2800) * 120 + (Math.random() * 50 - 20));
      setLiveActiveOffset(jitter);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Helper to render icon dynamically based on iconType or iconEmoji configured by General Manager
  const renderCardIcon = (card: StatCardCustomization) => {
    if (card.iconEmoji) {
      return <span className="text-2xl leading-none">{card.iconEmoji}</span>;
    }
    switch (card.iconType) {
      case 'users':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'shieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'shieldCheck':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'coins':
        return <Coins className="w-5 h-5 text-amber-400" />;
      case 'mic':
        return <Mic2 className="w-5 h-5 text-blue-400" />;
      case 'award':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'fileText':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      default:
        return <Users className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNumericValue = (id: string) => {
    switch (id) {
      case 'active-users': {
        const base = stats.activeUsers && stats.activeUsers >= 2750000 ? stats.activeUsers : 2750340;
        return (base + liveActiveOffset).toLocaleString('en-US');
      }
      case 'host-agencies':
        return (stats.hostAgencies || 19700).toLocaleString('en-US');
      case 'total-hosts':
        return (stats.totalHosts || 350000).toLocaleString('en-US');
      case 'super-admins':
        return (stats.superAdmins || 2573).toLocaleString('en-US');
      case 'admins':
        return (stats.admins || 3940).toLocaleString('en-US');
      case 'bds':
        return (stats.bds || 8806).toLocaleString('en-US');
      case 'shipping-agents':
        return (stats.shippingAgents || 7860).toLocaleString('en-US');
      case 'host-agents':
        return (stats.hostAgents || 19700).toLocaleString('en-US');
      case 'official-reg':
        return (stats.officialRegistrations || 14820).toLocaleString('en-US');
      case 'quick-reg':
        return (stats.quickRegistrations || 38450).toLocaleString('en-US');
      default:
        return '0';
    }
  };

  const filteredActivities =
    selectedCategoryFilter === 'all'
      ? activities
      : activities.filter((item) => item.id === selectedCategoryFilter);

  return (
    <div className="space-y-24 py-16 lg:py-24 max-w-7xl mx-auto px-6 sm:px-8">
      {/* 1. Live Dynamic Activity & Registration Counters */}
      <section id="stats" aria-label="إحصائيات النشاط والتسجيل" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <p className="text-xs font-display tracking-wider text-blue-400 uppercase mb-1.5">
              LIVE PLATFORM METRICS & REGISTRATION TRACKS · VIBERS V
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              مؤشرات النشاط الحي، الكادر القيادي، ومسارات التسجيل
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            إحصائيات فورية ومحدثة قابلة للتعديل والتحكم الكامل من لوحة المدير العام{' '}
            <span className="text-amber-400 font-semibold">عيون Prince</span>.
          </p>
        </div>

        {/* 6 High-Tech Cards (Active Users, Super Admins, Admins, BDs, Official 100%, Quick 50%) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {customCards.map((card) => {
            const numVal = getNumericValue(card.id);
            const isOfficial = card.id === 'official-reg';
            const isQuick = card.id === 'quick-reg';

            return (
              <div
                key={card.id}
                className={`p-6 rounded-2xl bg-[#0F1424] border transition-all duration-200 flex flex-col justify-between gap-5 relative overflow-hidden group ${
                  isOfficial
                    ? 'border-emerald-500/40 hover:border-emerald-400 shadow-lg shadow-emerald-950/30'
                    : isQuick
                    ? 'border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-950/30'
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Glow accent */}
                <div
                  className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity ${
                    isOfficial
                      ? 'bg-emerald-500/10'
                      : isQuick
                      ? 'bg-cyan-500/10'
                      : 'bg-blue-500/5'
                  }`}
                />

                <div className="flex items-center justify-between gap-3 relative z-10">
                  <span className="text-xs font-display tracking-wider text-slate-400">
                    {card.topText}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {renderCardIcon(card)}
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-3xl sm:text-4xl font-bold font-mono-num tracking-tight text-white">
                      {numVal}
                    </div>
                    {/* Star ratings if configured */}
                    {card.starsCount && card.starsCount > 0 && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: Math.min(card.starsCount, 7) }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {isOfficial && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {isQuick && <Clock className="w-4 h-4 text-cyan-400 shrink-0" />}
                    <span>{card.insideTitle}</span>
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">{card.bottomText}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Agency Network Metrics Bar */}
        <div className="p-6 rounded-2xl bg-[#0B0F1C] border border-slate-800/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-xs text-amber-400 font-medium mb-0.5">
                القيادة التنفيذية العليا · Executive Directorship
              </div>
              <h3 className="text-lg font-bold text-white">
                المدير العام والمدير التنفيذي: عيون Prince (Ayoun Prince)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                إشراف مباشر على منظومة تطوير التطبيقات، اعتماد الوكالات الدولية، وحماية حقوق المستخدمين والوكلاء.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xl font-bold font-mono-num text-white">
                  +{stats.shippingAgents.toLocaleString('en-US')}
                </div>
                <div className="text-xs text-slate-400">وكيل شحن معتمد (Shipping Agents)</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mic2 className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-xl font-bold font-mono-num text-white">
                  +{stats.hostAgents.toLocaleString('en-US')}
                </div>
                <div className="text-xs text-slate-400">وكيل مضيفين (Host Agents)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Business Activity & Voice Chat Promotions Gallery */}
      <section id="activities" aria-label="أنشطة الشركة وترويج تطبيقات الدردشة الصوتية" className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <p className="text-xs font-display tracking-wider text-purple-400 uppercase">
              CORE CAPABILITIES & VOICE CHAT ECOSYSTEM
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              أنشطة Vibers V العالمية وترويج التطبيقات الصوتية
            </h2>
          </div>

          {/* Functional Segmented Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#0F1424] border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategoryFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              جميع الأنشطة ({activities.length})
            </button>
            {activities.map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(act.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategoryFilter === act.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {act.numberIndex}. {act.titleAr.split(' ')[0]} {act.titleAr.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {filteredActivities.map((activity, idx) => {
            const isWide = idx === 0 || idx === 3;
            const colSpanClass =
              filteredActivities.length === 1
                ? 'lg:col-span-12'
                : isWide
                ? 'lg:col-span-7'
                : 'lg:col-span-5';
            const hasError = failedImages[activity.id];

            return (
              <article
                key={activity.id}
                className={`${colSpanClass} rounded-2xl bg-[#0F1424] border border-slate-800/90 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-colors group`}
              >
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
                  {!hasError ? (
                    <img
                      src={activity.imageUrl}
                      alt={activity.titleAr}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [activity.id]: true }))
                      }
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center">
                      <Mic2 className="w-16 h-16 text-blue-400/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1424] via-[#0F1424]/30 to-transparent" />
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono-num text-amber-400 font-semibold">
                        {activity.numberIndex}.
                      </span>
                      <span>{activity.categoryAr}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-display text-slate-500">{activity.titleEn}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                      {activity.titleAr}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      {activity.descriptionAr}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs sm:text-sm font-medium text-blue-400">
                      {activity.metricsAr}
                    </span>
                    <a
                      href="#join-team"
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
                    >
                      طلب انضمام لهذا القطاع ←
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. Leadership & Team Structure Section */}
      <section id="leadership" aria-label="هيكل القيادة والرتب المعتمدة" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <p className="text-xs font-display tracking-wider text-amber-400 uppercase mb-1.5">
              ORGANIZATIONAL HIERARCHY · DIRECTED BY AYOUN PRINCE
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              منظومة القيادة والرتب المعتمدة وشروط التعيين
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            شروط واضحة وصارمة: يشترط للسوبر أدمن إدارة 15 مطور أعمال BD على الأقل، وللأدمن 7 BD، مع حرية التقديم للـ BD والوكلاء.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {ROLES_LIST.map((role, idx) => (
            <div
              key={role.id}
              className={`p-5 rounded-2xl bg-[#0F1424] border transition-all flex flex-col justify-between gap-5 ${
                role.id === 'super_admin'
                  ? 'border-amber-500/40 hover:border-amber-400'
                  : role.id === 'admin'
                  ? 'border-purple-500/40 hover:border-purple-400'
                  : 'border-slate-800/90 hover:border-blue-500/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono-num text-amber-400 font-semibold">
                    0{idx + 1}. {role.badgeCode}
                  </span>
                  <span className="font-display">{role.titleEn}</span>
                </div>
                <h3 className="text-base font-bold text-white">{role.titleAr}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{role.descAr}</p>

                {role.requiredBds && role.requiredBds > 0 && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
                    شرط إلزامي: {role.requiredBds} مطور أعمال BD
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onSelectRoleAndScroll(role.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-800 hover:border-blue-500 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                التقديم على هذه الوظيفة
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
