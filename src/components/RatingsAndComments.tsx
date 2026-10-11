import React, { useState } from 'react';
import { Star, Send, MessageSquareQuote, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserRatingComment } from '../types';

interface RatingsAndCommentsProps {
  comments: UserRatingComment[];
  bannedHandles: string[];
  onAddComment: (entry: {
    authorName: string;
    authorHandle: string;
    stars: number;
    comment: string;
    activityType: string;
  }) => void;
}

export const RatingsAndComments: React.FC<RatingsAndCommentsProps> = ({
  comments,
  bannedHandles,
  onAddComment
}) => {
  const [authorName, setAuthorName] = useState('');
  const [authorHandle, setAuthorHandle] = useState('');
  const [activityType, setActivityType] = useState('وكيل شحن معتمد');
  const [selectedStars, setSelectedStars] = useState<number>(7);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const visibleComments = comments.filter(
    (c) => !c.isBannedUser && !bannedHandles.includes(c.authorHandle.toLowerCase())
  );

  const averageRating =
    visibleComments.length > 0
      ? (
          visibleComments.reduce((acc, item) => acc + item.stars, 0) / visibleComments.length
        ).toFixed(1)
      : '7.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!authorName.trim() || authorName.trim().length < 2) {
      setErrorMsg('يرجى إدخال اسمك أو لقبك لعرضه مع التقييم.');
      return;
    }

    const formattedHandle = authorHandle.trim()
      ? authorHandle.trim().startsWith('@')
        ? authorHandle.trim()
        : `@${authorHandle.trim()}`
      : `@${authorName.trim().replace(/\s+/g, '_').toLowerCase()}`;

    if (bannedHandles.includes(formattedHandle.toLowerCase())) {
      setErrorMsg('عذراً، هذا الحساب محظور من إضافة التعليقات بقرار من الإدارة.');
      return;
    }

    if (!commentText.trim() || commentText.trim().length < 5) {
      setErrorMsg('يرجى كتابة تعليق واضح (5 أحرف على الأقل).');
      return;
    }

    onAddComment({
      authorName: authorName.trim(),
      authorHandle: formattedHandle,
      stars: selectedStars,
      comment: commentText.trim(),
      activityType
    });

    setAuthorName('');
    setAuthorHandle('');
    setCommentText('');
    setSelectedStars(7);
    setSuccessMsg('شكراً لك! تم نشر تقييمك وتعليقك بنجاح.');
  };

  const activeStarDisplay = hoveredStars !== null ? hoveredStars : selectedStars;

  return (
    <section
      id="reviews"
      aria-label="تقييمات وتعليقات العملاء والوكلاء (من 1 إلى 7 نجوم)"
      className="py-16 lg:py-24 border-t border-slate-800/80 bg-[#070913]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        {/* Header & 7-Star Summary */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="space-y-2">
            <p className="text-xs font-display tracking-wider text-amber-400 uppercase">
              SEVEN-STAR COMMUNITY FEEDBACK · VIBERS V GLOBAL
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              سجل التقييمات والآراء (نظام الـ 7 نجوم الملكي)
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              شاركنا تجربتك مع شركة Vibers V العالمية لتنمية التطبيقات ودعم الدردشة الصوتية بقيادة المدير العام عيون Prince.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F1424] border border-slate-800 flex items-center gap-5 shrink-0">
            <div>
              <div className="text-3xl font-bold font-mono-num text-amber-400">
                {averageRating} <span className="text-base text-slate-400">/ 7.0</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                إجمالي التقييمات المعتمدة: <span className="font-mono-num text-white">{visibleComments.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submit 1-to-7 Star Rating Form */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#0F1424] border border-slate-800/90 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">أضف تقييمك وتعليقك (1 إلى 7 نجوم)</h3>
              <p className="text-xs text-slate-400">
                اختر عدد النجوم من 1 إلى 7 واكتب رأيك بكل شفافية.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1 to 7 Interactive Stars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">مستوى التقييم:</span>
                  <span className="text-xs font-mono-num font-bold text-amber-400">
                    {activeStarDisplay} من 7 نجوم
                  </span>
                </div>
                <div
                  className="flex items-center justify-between gap-1 p-3 rounded-xl bg-[#070913] border border-slate-800"
                  onMouseLeave={() => setHoveredStars(null)}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                    const isFilled = num <= activeStarDisplay;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSelectedStars(num)}
                        onMouseEnter={() => setHoveredStars(num)}
                        aria-label={`تقييم ${num} من 7 نجوم`}
                        className="p-1.5 rounded-lg hover:bg-slate-800/80 transition-transform active:scale-95 cursor-pointer flex flex-col items-center gap-1"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600 hover:text-slate-400'
                          }`}
                        />
                        <span
                          className={`text-[10px] font-mono-num ${
                            isFilled ? 'text-amber-300 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {num}★
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="reviewerName" className="block text-xs font-semibold text-slate-300">
                    الاسم أو اللقب <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="reviewerName"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="اسمك الكريم"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reviewerRole" className="block text-xs font-semibold text-slate-300">
                    صفتك في المنظومة
                  </label>
                  <select
                    id="reviewerRole"
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="مستخدم VIP">مستخدم VIP</option>
                    <option value="وكيل شحن معتمد">وكيل شحن معتمد</option>
                    <option value="وكيل مضيفين">وكيل مضيفين</option>
                    <option value="سوبر أدمن / أدمن">سوبر أدمن / أدمن</option>
                    <option value="مطور أعمال BD">مطور أعمال BD</option>
                    <option value="شريك تطوير تطبيقات">شريك تطوير تطبيقات</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reviewerComment" className="block text-xs font-semibold text-slate-300">
                  التعليق <span className="text-amber-400">*</span>
                </label>
                <textarea
                  id="reviewerComment"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="اكتب تجربتك أو رأيك في خدمات Vibers V العالمية..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}

              {successMsg && (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال التقييم ({selectedStars} نجوم)</span>
              </button>
            </form>
          </div>

          {/* Comments Feed */}
          <div className="lg:col-span-7 space-y-4">
            {visibleComments.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#0F1424] border border-slate-800/80 text-center space-y-2">
                <MessageSquareQuote className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-base font-semibold text-slate-300">لا توجد تقييمات مسجلة حالياً</p>
                <p className="text-xs text-slate-500">كن أول من يسجل تقييمه من 1 إلى 7 نجوم.</p>
              </div>
            ) : (
              visibleComments.map((item) => (
                <article
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#0F1424] border border-slate-800/90 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm font-display">
                      {item.authorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{item.authorName}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{item.activityType || 'عضو المنظومة'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[#070913] px-3.5 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-xs font-mono-num font-bold text-amber-400 ml-1">
                      {item.stars}/7
                    </span>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
