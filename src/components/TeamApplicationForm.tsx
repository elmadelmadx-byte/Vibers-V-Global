import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Check,
  Phone,
  Mail,
  User,
  Sparkles,
  ShieldCheck,
  FileBadge,
  MapPin,
  Home,
  Navigation,
  Upload,
  Users2,
  Clock,
  HelpCircle,
  Info
} from 'lucide-react';
import { RoleId, TeamApplication, RegistrationTrack } from '../types';
import { ROLES_LIST, COUNTRY_CODES, BUSINESS_ACTIVITIES } from '../data/initialData';

interface TeamApplicationFormProps {
  preselectedRole?: RoleId | null;
  onSubmitApplication: (app: Omit<TeamApplication, 'id' | 'status' | 'submittedAt'>) => void;
}

export const TeamApplicationForm: React.FC<TeamApplicationFormProps> = ({
  preselectedRole,
  onSubmitApplication
}) => {
  // Dual registration track: 'official' (100% fast track) vs 'quick' (50% probability)
  const [track, setTrack] = useState<RegistrationTrack>('official');

  // Shared Core fields
  const [realFullName, setRealFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [businessActivity, setBusinessActivity] = useState(BUSINESS_ACTIVITIES[0]);
  const [selectedRoles, setSelectedRoles] = useState<RoleId[]>(['shipping_agent']);
  const [bio, setBio] = useState('');
  const [age, setAge] = useState<number | ''>(24);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Official Track Rigorous Identity & Location fields
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [idFrontImage, setIdFrontImage] = useState<string>('');
  const [idBackImage, setIdBackImage] = useState<string>('');
  const [residenceAddress, setResidenceAddress] = useState('');
  const [streetName, setStreetName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');

  // Supervisory requirements: Super Admin requires >= 15 BDs, Admin requires >= 7 BDs
  const [managedBdCount, setManagedBdCount] = useState<number | ''>(15);
  const [managedBdNamesOrCodes, setManagedBdNamesOrCodes] = useState('');

  // Policy Agreement
  const [agreePolicy, setAgreePolicy] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [roleLimitNotice, setRoleLimitNotice] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [lastSubmittedTrack, setLastSubmittedTrack] = useState<RegistrationTrack>('official');

  useEffect(() => {
    if (preselectedRole) {
      setSelectedRoles((prev) => {
        if (prev.includes(preselectedRole)) return prev;
        if (prev.length >= 2) {
          return [prev[0], preselectedRole];
        }
        return [...prev, preselectedRole];
      });
      // Adjust default team size if super_admin or admin
      if (preselectedRole === 'super_admin') {
        setManagedBdCount(15);
      } else if (preselectedRole === 'admin') {
        setManagedBdCount(7);
      }
    }
  }, [preselectedRole]);

  const activeCountry = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const hasSuperAdmin = selectedRoles.includes('super_admin');
  const hasAdmin = selectedRoles.includes('admin');
  const requiresTeamVerification = hasSuperAdmin || hasAdmin;
  const minimumRequiredBds = hasSuperAdmin ? 15 : hasAdmin ? 7 : 0;

  // Validate 3-part real name (minimum 3 words, each >= 2 letters)
  const validateTripletName = (value: string): string | null => {
    const cleaned = value.trim().replace(/\s+/g, ' ');
    if (!cleaned) {
      return 'يرجى إدخال الاسم الحقيقي الكامل (ثلاثي على الأقل).';
    }
    const parts = cleaned.split(' ').filter((part) => part.length >= 2);
    if (parts.length < 3) {
      return 'يجب أن يتكون الاسم الحقيقي من 3 مقاطع على الأقل (الاسم الأول، الأب، العائلة).';
    }
    if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(cleaned)) {
      return 'يرجى كتابة الاسم الحقيقي بالحروف العربية أو الإنجليزية فقط دون أرقام أو رموز.';
    }
    return null;
  };

  // Validate strict phone format with country code
  const validateStrictPhone = (code: string, rawPhone: string): string | null => {
    const cleanDigits = rawPhone.replace(/\s+/g, '').replace(/^0+/, '');
    if (!cleanDigits) {
      return 'يرجى إدخال رقم الهاتف الفعال.';
    }
    if (!/^\d+$/.test(cleanDigits)) {
      return 'رقم الهاتف يجب أن يحتوي على أرقام فقط.';
    }
    const countryObj = COUNTRY_CODES.find((c) => c.code === code);
    if (countryObj && !countryObj.pattern.test(cleanDigits)) {
      return `صيغة الرقم غير مطابقة لدولة ${countryObj.country}. مثال: ${countryObj.example} (${countryObj.minLen} أرقام بدون الصفر الابتدائي).`;
    }
    return null;
  };

  const handleToggleRole = (roleId: RoleId) => {
    setRoleLimitNotice(null);
    let updated: RoleId[] = [];
    if (selectedRoles.includes(roleId)) {
      updated = selectedRoles.filter((r) => r !== roleId);
    } else {
      if (selectedRoles.length >= 2) {
        setRoleLimitNotice('الحد الأقصى المسموح به هو اختيار وظيفتين (2) فقط لكل متقدم.');
        return;
      }
      updated = [...selectedRoles, roleId];
    }
    setSelectedRoles(updated);

    if (updated.includes('super_admin') && (typeof managedBdCount !== 'number' || managedBdCount < 15)) {
      setManagedBdCount(15);
    } else if (updated.includes('admin') && (typeof managedBdCount !== 'number' || managedBdCount < 7)) {
      setManagedBdCount(7);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (type === 'front') {
          setIdFrontImage(reader.result);
        } else {
          setIdBackImage(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const nameError = validateTripletName(realFullName);
    if (nameError) newErrors.realFullName = nameError;

    if (!nickname.trim() || nickname.trim().length < 2) {
      newErrors.nickname = 'يرجى إدخال اللقب أو الاسم المستعار في التطبيق.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني فعال وصحيح.';
    }

    const phoneError = validateStrictPhone(countryCode, phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;

    if (typeof age !== 'number' || age < 18 || age > 75) {
      newErrors.age = 'يجب أن يكون العمر بين 18 و 75 سنة.';
    }

    if (selectedRoles.length === 0) {
      newErrors.selectedRoles = 'يرجى اختيار وظيفة واحدة على الأقل (وبحد أقصى وظيفتين).';
    }

    // Role supervisory hierarchy check: super_admin requires >= 15 BDs, admin requires >= 7 BDs
    if (hasSuperAdmin) {
      if (typeof managedBdCount !== 'number' || managedBdCount < 15) {
        newErrors.managedBdCount = 'شرط إلزامي: السوبر أدمن يشترط إدارة 15 مطور أعمال BD على الأقل.';
      }
    } else if (hasAdmin) {
      if (typeof managedBdCount !== 'number' || managedBdCount < 7) {
        newErrors.managedBdCount = 'شرط إلزامي: الأدمن يشترط إدارة 7 مطوري أعمال BD على الأقل.';
      }
    }

    if (requiresTeamVerification && (!managedBdNamesOrCodes.trim() || managedBdNamesOrCodes.trim().length < 5)) {
      newErrors.managedBdNamesOrCodes = 'يرجى ذكر أسماء أو أرقام تعريف الـ BD التابعين لفريقك للتحقق الإداري.';
    }

    // Strict requirements for Official Track (100% Fast Track)
    if (track === 'official') {
      if (!nationalIdNumber.trim() || nationalIdNumber.trim().length < 6) {
        newErrors.nationalIdNumber = 'يرجى إدخال رقم الهوية الوطنية أو البطاقة أو جواز السفر بشكل صحيح.';
      }

      if (!residenceAddress.trim() || residenceAddress.trim().length < 6) {
        newErrors.residenceAddress = 'يرجى كتابة العنوان بالتفصيل (الدولة والمدينة والحي).';
      }

      if (!streetName.trim() || streetName.trim().length < 2) {
        newErrors.streetName = 'يرجى إدخال اسم الشارع.';
      }

      if (!houseNumber.trim()) {
        newErrors.houseNumber = 'يرجى إدخال رقم المنزل أو العمارة.';
      }
    }

    if (!agreePolicy) {
      newErrors.agreePolicy = 'يجب الموافقة على شروط وسياسات Vibers V للمتابعة.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const normalizedDigits = phoneNumber.replace(/\s+/g, '').replace(/^0+/, '');
    const cleanWhatsapp = whatsappPhone.trim() ? whatsappPhone.trim() : `${countryCode} ${normalizedDigits}`;

    onSubmitApplication({
      registrationTrack: track,
      realFullName: realFullName.trim().replace(/\s+/g, ' '),
      nickname: nickname.trim(),
      email: email.trim(),
      countryCode,
      phoneNumber: normalizedDigits,
      fullPhone: `${countryCode} ${normalizedDigits}`,
      whatsappPhone: cleanWhatsapp,
      businessActivity,
      selectedRoles,
      bio: bio.trim() || (track === 'quick' ? 'مقدم عبر النموذج المختصر السريع.' : 'مقدم عبر مسار التوثيق الرسمي.'),
      age: typeof age === 'number' ? age : 24,
      gender,
      nationalIdNumber: track === 'official' ? nationalIdNumber.trim() : undefined,
      idFrontImage: track === 'official' ? idFrontImage : undefined,
      idBackImage: track === 'official' ? idBackImage : undefined,
      residenceAddress: track === 'official' ? residenceAddress.trim() : undefined,
      streetName: track === 'official' ? streetName.trim() : undefined,
      houseNumber: track === 'official' ? houseNumber.trim() : undefined,
      managedBdCount: requiresTeamVerification && typeof managedBdCount === 'number' ? managedBdCount : undefined,
      managedBdNamesOrCodes: requiresTeamVerification ? managedBdNamesOrCodes.trim() : undefined
    });

    setLastSubmittedTrack(track);
    setSubmittedSuccess(true);
    // Reset Form
    setRealFullName('');
    setNickname('');
    setEmail('');
    setPhoneNumber('');
    setWhatsappPhone('');
    setNationalIdNumber('');
    setIdFrontImage('');
    setIdBackImage('');
    setResidenceAddress('');
    setStreetName('');
    setHouseNumber('');
    setBio('');
    setManagedBdNamesOrCodes('');
    setErrors({});
  };

  const namePartsCount = realFullName
    .trim()
    .split(/\s+/)
    .filter((p) => p.length >= 2).length;

  return (
    <section
      id="join-team"
      aria-label="بوابة التسجيل الرسمي والفرعي للانضمام إلى فريق Vibers V"
      className="py-16 lg:py-24 border-t border-slate-800/80 bg-[#080B17] relative"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-10">
        {/* Section Heading */}
        <div className="space-y-3 text-right">
          <div className="flex flex-wrap items-center gap-2 text-xs font-display tracking-wider text-amber-400 uppercase">
            <span>OFFICIAL & QUICK REGISTRATION PORTAL · VIBERS V GLOBAL</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-400">إشراف المدير العام عيون Prince</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            بوابة ملء البيانات والانضمام المعتمد لمنظومة القيادة والوكلاء
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            اختر مسار التقديم المناسب لك: مسار <span className="text-emerald-400 font-bold">التسجيل الرسمي (أولوية 100%)</span> للملفات المكتملة بالهوية والعنوان، أو مسار <span className="text-cyan-400 font-bold">التسجيل الفرعي / المختصر (احتمالية 50%)</span>.
          </p>
        </div>

        {/* Dual Track Selector Tabs (Side-by-Side Modern Tech Segmented Interface) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 rounded-2xl bg-[#0F1424] border border-slate-800">
          {/* Track 1: Official Registration (100% Fast Track) */}
          <button
            type="button"
            onClick={() => setTrack('official')}
            className={`p-5 rounded-xl border text-right transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden ${
              track === 'official'
                ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                : 'bg-[#070913] border-slate-800/80 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                track === 'official'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <FileBadge className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">
                  التسجيل الرسمي الموثق (Official Track)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono-num font-bold">
                  أولوية فورية 100%
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                مطلوب: الاسم الثلاثي، الهوية/الجواز + صورة الوجه والظهر، العنوان، الشارع، المنزل، والواتساب.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold pt-0.5">
                الموظفون المعتمدون للعمل في أسرع وقت ممكن بنسبة 100%
              </div>
            </div>
          </button>

          {/* Track 2: Quick / Secondary Registration (50% Probability) */}
          <button
            type="button"
            onClick={() => setTrack('quick')}
            className={`p-5 rounded-xl border text-right transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden ${
              track === 'quick'
                ? 'bg-cyan-950/30 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                : 'bg-[#070913] border-slate-800/80 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                track === 'quick'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">
                  التسجيل الفرعي / المختصر (Quick Track)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono-num font-bold">
                  احتمالية عمل 50%
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                بيانات سريعة ومختصرة: الاسم، الواتساب، البريد، العمر، الجنس، والرتبة المطلوبة فقط.
              </p>
              <div className="text-[11px] text-cyan-400 font-semibold pt-0.5">
                تدرج في قائمة التدقيق الأولي باحتمالية قبول 50% لحين استكمال الوثائق.
              </div>
            </div>
          </button>
        </div>

        {/* Post-Submission Official Reassurance & Warning Modal */}
        {submittedSuccess && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="تنبيه رسمي بشأن حالة الطلب ومهلة المراجعة"
          >
            <div className="w-full max-w-2xl bg-[#0F172A] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-amber-950/50 text-right">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase block">
                      OFFICIAL SUBMISSION VERIFICATION · إشعار إداري رسمي
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      تم استلام طلبك بنجاح في منظومة Vibers V العالمية
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono-num border border-emerald-500/40">
                  {lastSubmittedTrack === 'official' ? 'مسار رسمي 100%' : 'مسار سريع 50%'}
                </span>
              </div>

              {/* Exact Warning & Assurance Text Requested by User */}
              <div className="p-5 rounded-2xl bg-[#090D1A] border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>تنبيه وإشعار رسمي إلزامي للمتقدمين:</span>
                </div>
                <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                  «يرجى الانتظار: سوف يتم التأكيد على الطلب بعد 24 ساعة (كحد أدنى) إلى 48 ساعة (كحد أقصى). سوف يتم إرسال إشعار القبول والتأكيد عبر البريد الإلكتروني أو رقم الواتساب المسجل. وفي حال عدم إرسال طلب التأكيد لك بأنك بالفعل تعينت خلال هذه المدة، ففي هذه الحالة يرجى إعادة التواصل مع الإدارة العليا لمعرفة ما هو السبب أو إعادة المحاولة مرة أخرى.»
                </p>
              </div>

              {/* Status and Direct Management Touchpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">حالة التدقيق الحالية:</span>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>قيد المراجعة المباشرة من القيادة العامة</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">المشرف المسؤول:</span>
                  <span className="text-white font-bold">
                    المدير العام والمدير التنفيذي عيون Prince
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href="https://wa.me/201200125746"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>التواصل المباشر مع الإدارة العليا (واتساب)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(false)}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  حسناً، فهمت التعليمات (إغلاق)
                </button>
              </div>
            </div>
          </div>
        )}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="p-6 sm:p-10 rounded-2xl bg-[#0F1424] border border-slate-800/90 space-y-8"
          >
            {/* Track Notice Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                track === 'official'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  {track === 'official'
                    ? 'أنت تسجل الآن في [التسجيل الرسمي] — تمنحك تعبئة الوثائق والعنوان الأولوية الكاملة 100% للاعتماد السريع.'
                    : 'أنت تسجل الآن في [التسجيل المختصر] — فرصة القبول مبدئية بنسبة 50% حتى تقديم الأوراق الثبوتية.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTrack(track === 'official' ? 'quick' : 'official')}
                className="text-xs underline hover:text-white shrink-0 cursor-pointer"
              >
                التبديل إلى {track === 'official' ? 'المختصر (50%)' : 'الرسمي (100%)'}
              </button>
            </div>

            {/* SECTION 1: Personal & Identity Basics (Side by Side Grid) */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>1. المعلومات الشخصية وهوية المتقدم</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Real Full Name (Triplet+) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="realFullName" className="text-sm font-semibold text-slate-200">
                      الاسم الحقيقي الكامل (ثلاثي على الأقل) <span className="text-amber-400">*</span>
                    </label>
                    <span
                      className={`text-xs font-mono-num ${
                        namePartsCount >= 3 ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {namePartsCount}/3 مقاطع
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="realFullName"
                      type="text"
                      value={realFullName}
                      onChange={(e) => {
                        setRealFullName(e.target.value);
                        if (errors.realFullName) {
                          setErrors((prev) => ({ ...prev, realFullName: '' }));
                        }
                      }}
                      placeholder="مثال: فهد عبدالعزيز بن محمد العتيبي"
                      className={`w-full px-4 py-3 rounded-xl bg-[#070913] border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        errors.realFullName
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-slate-800 focus:border-blue-500'
                      }`}
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {errors.realFullName ? (
                    <p className="text-xs text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.realFullName}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      يشترط الاسم الثلاثي الحقيقي مطابقاً للوثائق الرسمية.
                    </p>
                  )}
                </div>

                {/* Nickname / Display Name Field */}
                <div className="space-y-2">
                  <label htmlFor="nickname" className="block text-sm font-semibold text-slate-200">
                    اللقب / الاسم المستعار في التطبيق (خانة منفصلة) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="nickname"
                      type="text"
                      value={nickname}
                      onChange={(e) => {
                        setNickname(e.target.value);
                        if (errors.nickname) {
                          setErrors((prev) => ({ ...prev, nickname: '' }));
                        }
                      }}
                      placeholder="مثال: القيصر VIP / الأمير الذهبي"
                      className={`w-full px-4 py-3 rounded-xl bg-[#070913] border text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        errors.nickname
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-slate-800 focus:border-blue-500'
                      }`}
                    />
                    <Sparkles className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {errors.nickname ? (
                    <p className="text-xs text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.nickname}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">اسم الشهرة الصوتي داخل المنصة.</p>
                  )}
                </div>

                {/* Age & Gender (Side by Side) */}
                <div className="space-y-2">
                  <label htmlFor="applicantAge" className="block text-sm font-semibold text-slate-200">
                    العمر / السن <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="applicantAge"
                    type="number"
                    min={18}
                    max={75}
                    value={age}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                      setAge(val);
                      if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
                    }}
                    placeholder="مثال: 25"
                    className={`w-full px-4 py-3 rounded-xl bg-[#070913] border text-sm text-white font-mono-num focus:outline-none transition-colors ${
                      errors.age ? 'border-rose-500' : 'border-slate-800 focus:border-blue-500'
                    }`}
                  />
                  {errors.age && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.age}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    الجنس <span className="text-amber-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-3 px-4 rounded-xl border text-center text-sm font-semibold cursor-pointer transition-colors ${
                        gender === 'male'
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-[#070913] border-slate-800 text-slate-400'
                      }`}
                    >
                      ذكر (Male)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-3 px-4 rounded-xl border text-center text-sm font-semibold cursor-pointer transition-colors ${
                        gender === 'female'
                          ? 'bg-pink-600/20 border-pink-500 text-white'
                          : 'bg-[#070913] border-slate-800 text-slate-400'
                      }`}
                    >
                      أنثى (Female)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Contact Information (Phone, WhatsApp, Email) */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>2. وسائل الاتصال والتواصل المعتمدة</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Active Phone */}
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-200">
                    رقم الهاتف مع مفتاح الدولة <span className="text-amber-400">*</span>
                  </label>
                  <div className="flex items-stretch gap-2" dir="ltr">
                    <select
                      aria-label="مفتاح الدولة"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-2.5 py-3 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white font-mono-num shrink-0 cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.country})
                        </option>
                      ))}
                    </select>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/[^\d]/g, '');
                        setPhoneNumber(digitsOnly);
                        if (errors.phoneNumber) {
                          setErrors((prev) => ({ ...prev, phoneNumber: '' }));
                        }
                      }}
                      placeholder={activeCountry.example}
                      className={`w-full px-3 py-3 rounded-xl bg-[#070913] border text-sm text-white font-mono-num focus:outline-none ${
                        errors.phoneNumber ? 'border-rose-500' : 'border-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-xs text-rose-400">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* WhatsApp Phone */}
                <div className="space-y-2">
                  <label htmlFor="whatsappPhone" className="block text-sm font-semibold text-slate-200">
                    رقم الواتساب الفعال <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="whatsappPhone"
                    type="tel"
                    dir="ltr"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="مثال: +966 512345678"
                    className="w-full px-4 py-3 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white font-mono-num text-left focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-400">للتواصل الفوري ومقابلة الاعتماد.</p>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label htmlFor="applicantEmail" className="block text-sm font-semibold text-slate-200">
                    البريد الإلكتروني <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="applicantEmail"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="name@agency.com"
                    className={`w-full px-4 py-3 rounded-xl bg-[#070913] border text-sm text-white font-mono-num text-left focus:outline-none ${
                      errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-blue-500'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* SECTION 3: OFFICIAL TRACK EXCLUSIVE (National ID + Address Details + ID Photos) */}
            {track === 'official' && (
              <div className="space-y-5 p-6 rounded-2xl bg-[#0B0F1C] border border-emerald-500/30">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                    <FileBadge className="w-5 h-5 text-emerald-400" />
                    <span>3. متطلبات التوثيق الرسمي (أولوية 100% للعمل المعتمد)</span>
                  </h3>
                  <span className="text-xs font-mono-num text-slate-400">
                    مطلوب حصراً للتسجيل الرسمي
                  </span>
                </div>

                {/* National ID / Passport Number */}
                <div className="space-y-2">
                  <label htmlFor="nationalId" className="block text-sm font-semibold text-slate-200">
                    رقم الهوية الوطنية / البطاقة أو جواز السفر <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="nationalId"
                    type="text"
                    value={nationalIdNumber}
                    onChange={(e) => {
                      setNationalIdNumber(e.target.value);
                      if (errors.nationalIdNumber) {
                        setErrors((prev) => ({ ...prev, nationalIdNumber: '' }));
                      }
                    }}
                    placeholder="أدخل رقم الهوية أو الإقامة أو جواز السفر الرسمي"
                    className={`w-full px-4 py-3 rounded-xl bg-[#070913] border text-sm text-white font-mono-num focus:outline-none ${
                      errors.nationalIdNumber
                        ? 'border-rose-500'
                        : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                  {errors.nationalIdNumber && (
                    <p className="text-xs text-rose-400">{errors.nationalIdNumber}</p>
                  )}
                </div>

                {/* ID Images: Front & Back */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      صورة الهوية / البطاقة (الوجه الأمامي)
                    </label>
                    <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-emerald-500/40 bg-[#070913] hover:bg-emerald-950/20 text-slate-300 text-xs cursor-pointer transition-colors">
                      {idFrontImage ? (
                        <div className="space-y-2 text-center">
                          <img
                            src={idFrontImage}
                            alt="الوجه الأمامي للهوية"
                            className="max-h-24 mx-auto rounded-lg object-contain"
                          />
                          <span className="text-emerald-400 font-semibold block">
                            تم إرفاق الوجه الأمامي بنجاح ✓
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-emerald-400" />
                          <span>رفع صورة الوجه الأمامي للبطاقة</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'front')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      صورة الهوية / البطاقة (الوجه الخلفي)
                    </label>
                    <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-emerald-500/40 bg-[#070913] hover:bg-emerald-950/20 text-slate-300 text-xs cursor-pointer transition-colors">
                      {idBackImage ? (
                        <div className="space-y-2 text-center">
                          <img
                            src={idBackImage}
                            alt="الوجه الخلفي للهوية"
                            className="max-h-24 mx-auto rounded-lg object-contain"
                          />
                          <span className="text-emerald-400 font-semibold block">
                            تم إرفاق الوجه الخلفي بنجاح ✓
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-emerald-400" />
                          <span>رفع صورة الوجه الخلفي للبطاقة</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'back')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Address, Street Name, House Number (Side by Side) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label htmlFor="residenceAddr" className="block text-xs font-semibold text-slate-300">
                      العنوان الكامل (الدولة / المدينة / الحي) <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="residenceAddr"
                        type="text"
                        value={residenceAddress}
                        onChange={(e) => {
                          setResidenceAddress(e.target.value);
                          if (errors.residenceAddress) {
                            setErrors((prev) => ({ ...prev, residenceAddress: '' }));
                          }
                        }}
                        placeholder="مثال: السعودية، الرياض، حي الياسمين"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border text-xs text-white ${
                          errors.residenceAddress ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    </div>
                    {errors.residenceAddress && (
                      <p className="text-xs text-rose-400">{errors.residenceAddress}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="street" className="block text-xs font-semibold text-slate-300">
                      اسم الشارع <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="street"
                        type="text"
                        value={streetName}
                        onChange={(e) => {
                          setStreetName(e.target.value);
                          if (errors.streetName) {
                            setErrors((prev) => ({ ...prev, streetName: '' }));
                          }
                        }}
                        placeholder="مثال: شارع أنس بن مالك"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border text-xs text-white ${
                          errors.streetName ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      <Navigation className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    </div>
                    {errors.streetName && (
                      <p className="text-xs text-rose-400">{errors.streetName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="houseNum" className="block text-xs font-semibold text-slate-300">
                      رقم المنزل / البناية <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="houseNum"
                        type="text"
                        value={houseNumber}
                        onChange={(e) => {
                          setHouseNumber(e.target.value);
                          if (errors.houseNumber) {
                            setErrors((prev) => ({ ...prev, houseNumber: '' }));
                          }
                        }}
                        placeholder="مثال: مبنى 42، شقة 5"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border text-xs text-white ${
                          errors.houseNumber ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      <Home className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    </div>
                    {errors.houseNumber && (
                      <p className="text-xs text-rose-400">{errors.houseNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: Role Selection & Strict Supervisory Team Rules */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>4. اختيار الرتبة الوظيفية (كحد أقصى وظيفتين)</span>
                </h3>
                <span className="text-xs font-mono-num text-blue-400">
                  تم تحديد {selectedRoles.length} من 2
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ROLES_LIST.map((role) => {
                  const isSelected = selectedRoles.includes(role.id);
                  const isDisabled = !isSelected && selectedRoles.length >= 2;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleToggleRole(role.id)}
                      className={`p-4 rounded-xl border text-right transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500 text-white'
                          : isDisabled
                          ? 'bg-[#070913]/60 border-slate-800/60 text-slate-500 opacity-60'
                          : 'bg-[#070913] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold leading-snug">{role.titleAr}</div>
                        <div className="text-[11px] text-slate-400 leading-normal">
                          {role.descAr}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {roleLimitNotice && (
                <p className="text-xs text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{roleLimitNotice}</span>
                </p>
              )}
              {errors.selectedRoles && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.selectedRoles}</span>
                </p>
              )}

              {/* Strict Hierarchical Verification for Super Admin (>=15 BD) and Admin (>=7 BD) */}
              {requiresTeamVerification && (
                <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-4 mt-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Users2 className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">
                      إلزام إداري خاص برتبة{' '}
                      {hasSuperAdmin ? 'السوبر أدمن (15 BD على الأقل)' : 'الأدمن (7 BD على الأقل)'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    وفقاً للوائح Vibers V العالمية، يُشترط على{' '}
                    <span className="text-amber-400 font-semibold">
                      {hasSuperAdmin ? 'السوبر أدمن إدارة 15 مطور أعمال BD' : 'الأدمن إدارة 7 مطوري أعمال BD'}
                    </span>{' '}
                    على الأقل يعملون تحت قيادته المباشرة، مع تسجيل بياناتهم وأرقامهم للتحقق.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="bdCount" className="block text-xs font-semibold text-slate-200">
                        عدد مطوري الأعمال (BD) التابعين لك <span className="text-amber-400">*</span>
                      </label>
                      <input
                        id="bdCount"
                        type="number"
                        min={minimumRequiredBds}
                        value={managedBdCount}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                          setManagedBdCount(val);
                          if (errors.managedBdCount) {
                            setErrors((prev) => ({ ...prev, managedBdCount: '' }));
                          }
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border text-xs text-white font-mono-num ${
                          errors.managedBdCount ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.managedBdCount && (
                        <p className="text-xs text-rose-400">{errors.managedBdCount}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="bdDetails" className="block text-xs font-semibold text-slate-200">
                        أسماء أو أرقام معرفات الـ BD في فريقك <span className="text-amber-400">*</span>
                      </label>
                      <input
                        id="bdDetails"
                        type="text"
                        value={managedBdNamesOrCodes}
                        onChange={(e) => {
                          setManagedBdNamesOrCodes(e.target.value);
                          if (errors.managedBdNamesOrCodes) {
                            setErrors((prev) => ({ ...prev, managedBdNamesOrCodes: '' }));
                          }
                        }}
                        placeholder="مثال: فريق الفرسان (15 مطور أعمال بأكواد BD-101 إلى BD-115)"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border text-xs text-white ${
                          errors.managedBdNamesOrCodes ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.managedBdNamesOrCodes && (
                        <p className="text-xs text-rose-400">{errors.managedBdNamesOrCodes}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 5: Business Activity & Bio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="activityType" className="block text-sm font-semibold text-slate-200">
                  نوع النشاط التجاري / التخصص
                </label>
                <select
                  id="activityType"
                  value={businessActivity}
                  onChange={(e) => setBusinessActivity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {BUSINESS_ACTIVITIES.map((act) => (
                    <option key={act} value={act} className="bg-[#0F1424] text-white">
                      {act}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="bioText" className="block text-sm font-semibold text-slate-200">
                  نبذة تعريفية مختصرة
                </label>
                <input
                  id="bioText"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="خبراتك السابقة في غرف الدردشة الصوتية أو إدارة الوكالات..."
                  className="w-full px-4 py-3 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* MANDATORY POLICY COMPARISON NOTICE (Strictly required in the prompt between both tracks) */}
            <div className="p-5 rounded-2xl bg-[#0B0F1C] border border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>شروط وأحكام السياسة التنفيذية لشركة Vibers V العالمية</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                تطبق الشروط والأحكام: المستخدم الذي يملأ المعلومات الشخصية والوثائق بعناية هو من
                الموظفين المعتمدين للعمل في أسرع ما يمكن{' '}
                <span className="text-emerald-400 font-bold underline">بنسبة 100%</span>. بينما الذي
                يريد الاختصار وكتابة المعلومات الأساسية فقط (الاسم، الواتساب، البريد، العمر، الجنس)
                تكون احتمالية العمل الخاصة به{' '}
                <span className="text-cyan-400 font-bold underline">بنسبة 50%</span> فقط وتوضع في قائمة الانتظار للتدقيق.
              </p>

              <label className="flex items-center gap-3 pt-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={(e) => {
                    setAgreePolicy(e.target.checked);
                    if (errors.agreePolicy) {
                      setErrors((prev) => ({ ...prev, agreePolicy: '' }));
                    }
                  }}
                  className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>
                  أقر بصحة كافة البيانات المدخلة وموافقتي على لائحة Vibers V الرقابية وسياسة إدارة
                  المدير العام عيون Prince.
                </span>
              </label>
              {errors.agreePolicy && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.agreePolicy}</span>
                </p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                يصل طلبك مباشرة إلى لوحة تحكم المدير العام{' '}
                <span className="text-amber-400 font-semibold">عيون Prince</span> للفرز والموافقة أو الرفض أو الحظر.
              </p>
              <button
                type="submit"
                className={`inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  track === 'official'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/25'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {track === 'official'
                    ? 'إرسال طلب التوثيق الرسمي (أولوية 100%)'
                    : 'إرسال طلب التسجيل السريع (50%)'}
                </span>
              </button>
            </div>
          </form>
        </div>
    </section>
  );
};
