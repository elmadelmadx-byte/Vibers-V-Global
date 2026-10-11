import {
  BannerSlide,
  ActivityShowcase,
  RoleOption,
  TeamApplication,
  UserRatingComment,
  LivePlatformStats,
  StatCardCustomization,
  BroadcastNotification
} from '../types';

export const ROLES_LIST: RoleOption[] = [
  {
    id: 'super_admin',
    titleAr: 'سوبر أدمن (Super Admin)',
    titleEn: 'Super Admin',
    descAr: 'الإشراف الرقابي الأعلى وإدارة العمليات الإقليمية (يشترط وجود 15 مطور أعمال BD على الأقل تحت إدارتك)',
    badgeCode: 'SA-TIER',
    requiredBds: 15
  },
  {
    id: 'admin',
    titleAr: 'أدمن (Admin)',
    titleEn: 'System Admin',
    descAr: 'إدارة الغرف الصوتية وضمان الجودة (يشترط وجود 7 مطوري أعمال BD على الأقل تحت إدارتك)',
    badgeCode: 'ADM-OPS',
    requiredBds: 7
  },
  {
    id: 'bd',
    titleAr: 'مطور أعمال (BD - Business Developer)',
    titleEn: 'Business Developer',
    descAr: 'استقطاب الوكالات والتوسع التسويقي (لا يشترط وجود فريق مسبق، التقديم متاح للجميع)',
    badgeCode: 'BD-GROWTH',
    requiredBds: 0
  },
  {
    id: 'shipping_agent',
    titleAr: 'وكيل شحن معتمد (Shipping Agent)',
    titleEn: 'Authorized Shipping Agent',
    descAr: 'توفير خدمات شحن العملات والماسات الفورية بأعلى معايير الأمان والموثوقية',
    badgeCode: 'VIP-COIN',
    requiredBds: 0
  },
  {
    id: 'host_agent',
    titleAr: 'وكيل مضيفين (Host Agent)',
    titleEn: 'Voice Host Agent',
    descAr: 'إدارة وتدريب المذيعين وصناع المحتوى الصوتي وتنشيط الفعاليات اليومية',
    badgeCode: 'HOST-PRO',
    requiredBds: 0
  }
];

export const COUNTRY_CODES = [
  { code: '+966', country: 'السعودية (SA)', pattern: /^[5]\d{8}$/, example: '512345678', minLen: 9, maxLen: 9 },
  { code: '+971', country: 'الإمارات (AE)', pattern: /^[5]\d{8}$/, example: '501234567', minLen: 9, maxLen: 9 },
  { code: '+20', country: 'مصر (EG)', pattern: /^1[0125]\d{8}$/, example: '1012345678', minLen: 10, maxLen: 10 },
  { code: '+965', country: 'الكويت (KW)', pattern: /^[569]\d{7}$/, example: '51234567', minLen: 8, maxLen: 8 },
  { code: '+974', country: 'قطر (QA)', pattern: /^[3567]\d{7}$/, example: '33123456', minLen: 8, maxLen: 8 },
  { code: '+962', country: 'الأردن (JO)', pattern: /^7[789]\d{7}$/, example: '791234567', minLen: 9, maxLen: 9 },
  { code: '+964', country: 'العراق (IQ)', pattern: /^7[5789]\d{8}$/, example: '7712345678', minLen: 10, maxLen: 10 },
  { code: '+968', country: 'عمان (OM)', pattern: /^[79]\d{7}$/, example: '91234567', minLen: 8, maxLen: 8 },
  { code: '+973', country: 'البحرين (BH)', pattern: /^[36]\d{7}$/, example: '36123456', minLen: 8, maxLen: 8 },
  { code: '+212', country: 'المغرب (MA)', pattern: /^[67]\d{8}$/, example: '612345678', minLen: 9, maxLen: 9 },
  { code: '+213', country: 'الجزائر (DZ)', pattern: /^[567]\d{8}$/, example: '551234567', minLen: 9, maxLen: 9 },
  { code: '+90', country: 'تركيا (TR)', pattern: /^5\d{9}$/, example: '5321234567', minLen: 10, maxLen: 10 },
  { code: '+44', country: 'بريطانيا (UK)', pattern: /^7\d{9}$/, example: '7911123456', minLen: 10, maxLen: 10 },
  { code: '+1', country: 'أمريكا / كندا (US/CA)', pattern: /^\d{10}$/, example: '2025550199', minLen: 10, maxLen: 10 }
];

export const BUSINESS_ACTIVITIES = [
  'تطوير وبرمجة تطبيقات الدردشة الصوتية (Voice Chat App Development)',
  'إدارة وتشغيل وكالات المضيفين والمذيعين (Host Agency Management)',
  'خدمات الشحن الفوري وتوزيع العملات الرقمية (Global Coin & VIP Shipping)',
  'تطوير الأعمال والتوسع الإقليمي للتطبيقات (Regional BD & Growth)',
  'الإشراف الإداري وحماية المجتمعات الصوتية (Super Admin & Trust Operations)',
  'تنظيم المسابقات والفعاليات الصوتية الكبرى (Live Audio Events & PK Tournaments)'
];

export const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: 'banner-1',
    titleAr: 'Vibers V العالمية لتنمية التطبيقات ودعم الدردشة الصوتية',
    subtitleAr: 'بقيادة المدير العام عيون Prince — نبني الجيل القادم من منصات التواصل الصوتي التفاعلي، وندعم الوكالات والمضيفين ووكلاء الشحن في أكثر من 35 دولة حول العالم.',
    kickerEn: 'VIBERS V GLOBAL · EXECUTIVE ECOSYSTEM',
    imageUrl: '/src/assets/images/banner_voice_chat_ecosystem_1791675975272.jpg',
    ctaTextAr: 'انضم إلى فريق القيادة الآن',
    ctaTarget: '#join-team',
    statsHighlight: '+1.4M مستخدم نشط شهرياً عبر شبكتنا'
  },
  {
    id: 'banner-2',
    titleAr: 'تطوير تقني متكامل وهندسة غرف الدردشة الفورية',
    subtitleAr: 'نقدم حلولاً برمجية فائقة السرعة لنقاء الصوت، أنظمة الهدايا ثلاثية الأبعاد، ومستويات الـ VIP مع حماية متكاملة ضد الاختراق واستقرار بنسبة 99.98%.',
    kickerEn: 'ULTRA-LOW LATENCY AUDIO ARCHITECTURE',
    imageUrl: '/src/assets/images/banner_app_development_hub_1791675985654.jpg',
    ctaTextAr: 'استكشف أنشطتنا وخدماتنا',
    ctaTarget: '#activities',
    statsHighlight: 'أقل من 18ms زمن استجابة صوتية عالمياً'
  },
  {
    id: 'banner-3',
    titleAr: 'شبكة وكلاء الشحن ووكلاء المضيفين الأقوى عالمياً',
    subtitleAr: 'منظومة مالية وإدارية موثوقة تضمن أعلى العوائد لوكلاء الشحن، المضيفين، مطوري الأعمال (BD)، وفريق الإدارة تحت إشراف مباشر من عيون Prince.',
    kickerEn: 'GLOBAL AGENCY & VIP SHIPPING NETWORK',
    imageUrl: '/src/assets/images/banner_vip_agency_network_1791675995675.jpg',
    ctaTextAr: 'قدم طلب اعتماد وكالتك',
    ctaTarget: '#join-team',
    statsHighlight: '+480 وكالة شحن ومضيفين معتمدة'
  }
];

export const INITIAL_ACTIVITIES: ActivityShowcase[] = [
  {
    id: 'act-01',
    numberIndex: '01',
    titleAr: 'هندسة وتطوير تطبيقات الدردشة الصوتية',
    titleEn: 'Voice Chat App Architecture & Full-Stack Engineering',
    categoryAr: 'تطوير البرمجيات · البنية التحتية',
    descriptionAr: 'تصميم وبرمجة تطبيقات غرف الدردشة الصوتية الجماعية بأحدث تقنيات المعالجة الصوتية، مع لوحات تحكم ذكية، مؤثرات دخول ملكية، وأنظمة ألعاب تفاعلية داخل الغرف.',
    metricsAr: '+42 تطبيقاً ومشروعاً تقنياً ناجحاً في الشرق الأوسط وشمال أفريقيا وأوروبا',
    imageUrl: '/src/assets/images/activity_voice_rooms_1791676005998.jpg'
  },
  {
    id: 'act-02',
    numberIndex: '02',
    titleAr: 'إدارة وتأهيل وكالات المضيفين (Host Agencies)',
    titleEn: 'Host Agency Incubation & Audio Creator Growth',
    categoryAr: 'إدارة المواهب · تنشيط الغرف',
    descriptionAr: 'استقطاب وتدريب المضيفين وصناع المحتوى الصوتي، وتزويد الوكالات ببرامج تحفيزية، جداول بث احترافية، ومسابقات شهرية ترفع من تفاعل المستخدمين وعوائد الوكالة.',
    metricsAr: '+12,500 مضيف ومضيفة نشطين على مدار الساعة بإشراف وكلائنا',
    imageUrl: '/src/assets/images/activity_host_training_1791676015723.jpg'
  },
  {
    id: 'act-03',
    numberIndex: '03',
    titleAr: 'منظومة وكلاء الشحن المعتمدين والدعم المالي',
    titleEn: 'Authorized Global Coin Shipping & Financial Settlement',
    categoryAr: 'حلول الدفع · شحن فوري',
    descriptionAr: 'توفير بوابات شحن محلية ودولية سريعة وآمنة لجميع المستخدمين وكبار الشخصيات (VIP)، مع تسويات مالية فورية وعمولات تنافسية لوكلاء الشحن المعتمدين لدى Vibers V.',
    metricsAr: 'معاملات شحن فورية آمنة على مدار 24/7 في أكثر من 35 دولة',
    imageUrl: '/src/assets/images/banner_vip_agency_network_1791675995675.jpg'
  },
  {
    id: 'act-04',
    numberIndex: '04',
    titleAr: 'تطوير الأعمال (BD) والإدارة الرقابية العليا',
    titleEn: 'Executive BD Strategy, Super Admin & Governance',
    categoryAr: 'تطوير الأعمال · قيادة عيون Prince',
    descriptionAr: 'فريق متكامل من السوبر أدمن، الأدمن، ومطوري الأعمال (BD) بقيادة المدير العام عيون Prince لضمان بيئة آمنة، حل النزاعات فوراً، وتوسيع الحصة السوقية للتطبيقات الشريكة.',
    metricsAr: '+185% نمو سنوي في حجم التداول الصوتي واستقطاب الوكالات',
    imageUrl: '/src/assets/images/banner_voice_chat_ecosystem_1791675975272.jpg'
  }
];

export const INITIAL_STATS: LivePlatformStats = {
  activeUsers: 2750340,
  hostAgencies: 19700,
  totalHosts: 350000,
  superAdmins: 2573,
  admins: 3940,
  bds: 8806,
  shippingAgents: 7860,
  hostAgents: 19700,
  officialRegistrations: 14820,
  quickRegistrations: 38450,
  dailyActiveLogins: 42890
};

export const INITIAL_NOTIFICATIONS: BroadcastNotification[] = [
  {
    id: 'notif-1',
    senderName: 'المدير العام عيون Prince',
    title: 'رسالة ترحيبية ملكية من القيادة العامة',
    message: 'أهلاً وسهلاً بجميع الزوار والمنضمين إلى منظومة Vibers V العالمية لتنمية التطبيقات ودعم تطبيقات الدردشة الصوتية. طلباتكم واستفساراتكم تحظى برعايتنا المباشرة.',
    type: 'welcome',
    createdAt: 'الآن',
    isActive: true
  },
  {
    id: 'notif-2',
    senderName: 'لجنة المراجعة والاعتماد التنفيذي',
    title: 'تنبيه مهم لجميع المتقدمين عبر الرابط',
    message: 'يرجى الانتظار 24 إلى 48 ساعة كحد أقصى لتأكيد الطلب واستلام رسالة التعيين عبر الواتساب أو البريد. وفي حال التأخر يرجى التواصل مع الإدارة العليا فوراً.',
    type: 'announcement',
    createdAt: 'اليوم',
    isActive: true
  }
];

// Default Customizable Stat Cards that Manager Ayoun Prince can rename or customize
export const INITIAL_CUSTOMIZABLE_CARDS: StatCardCustomization[] = [
  {
    id: 'active-users',
    topText: 'REAL-TIME PARTICIPANTS (+2.75M)',
    insideTitle: 'المستخدمون النشطون (Active Users)',
    bottomText: 'أكثر من 2,750,000 مستخدم نشط في غرف الصوت عالمياً',
    starsCount: 7,
    iconEmoji: '🟢',
    iconType: 'users'
  },
  {
    id: 'host-agencies',
    topText: 'AUTHORIZED HOST AGENCIES',
    insideTitle: 'وكالات المضيفين (19,700 وكالة)',
    bottomText: 'وكالات صوتية رسمية معتمدة تحت إشراف الإدارة العامة',
    starsCount: 7,
    iconEmoji: '🎙️',
    iconType: 'mic'
  },
  {
    id: 'total-hosts',
    topText: 'VOICE TALENTS & BROADCASTERS',
    insideTitle: 'المضيفون وصناع المحتوى (350 ألف)',
    bottomText: '350,000 مضيف ومضيفة نشطين على مدار الساعة',
    starsCount: 7,
    iconEmoji: '🌟',
    iconType: 'award'
  },
  {
    id: 'shipping-agents',
    topText: 'AUTHORIZED SHIPPING AGENTS',
    insideTitle: 'وكلاء الشحن المعتمدون (7,860 وكيل)',
    bottomText: 'شحن فوري ومعاملات مالية معتمدة في أكثر من 35 دولة',
    starsCount: 7,
    iconEmoji: '📦',
    iconType: 'coins'
  },
  {
    id: 'super-admins',
    topText: 'EXECUTIVE GOVERNANCE (15 BDs)',
    insideTitle: 'سوبر أدمن (2,573 قيادة)',
    bottomText: 'قيادات تنفيذية ورقابية مسؤولة عن حماية وتوجيه المنظومة',
    starsCount: 7,
    iconEmoji: '👑',
    iconType: 'shieldAlert'
  },
  {
    id: 'admins',
    topText: 'OPERATIONS & TRUST (7 BDs)',
    insideTitle: 'الأدمن (3,940 مشرف)',
    bottomText: 'إشراف فني مباشر ومتابعة مستمرة على مدار الساعة 24/7',
    starsCount: 7,
    iconEmoji: '🛡️',
    iconType: 'shieldCheck'
  },
  {
    id: 'bds',
    topText: 'BUSINESS DEVELOPERS',
    insideTitle: 'مطورو الأعمال (8,806 BD)',
    bottomText: 'تطوير وتوسيع الوكالات واستقطاب الشراكات الدولية',
    starsCount: 7,
    iconEmoji: '💼',
    iconType: 'briefcase'
  },
  {
    id: 'official-reg',
    topText: 'OFFICIAL 100% FAST-TRACK',
    insideTitle: 'المسجلون رسمياً (التسجيل الرسمي 100%)',
    bottomText: 'ملف موثق بالهوية والعنوان - أولوية توظيف فورية',
    starsCount: 7,
    iconEmoji: '✅',
    iconType: 'award'
  },
  {
    id: 'quick-reg',
    topText: 'QUICK ENTRY 50% PROBABILITY',
    insideTitle: 'المسجلون بالنموذج المختصر (50%)',
    bottomText: 'بيانات سريعة - قيد التقييم الأولي والمطابقة',
    starsCount: 5,
    iconEmoji: '⚡',
    iconType: 'fileText'
  }
];

export const INITIAL_APPLICATIONS: TeamApplication[] = [
  {
    id: 'app-101',
    registrationTrack: 'official',
    realFullName: 'عبدالله محمد الفيصل العتيبي',
    nickname: 'الصقر الملكي VIP',
    email: 'abdullah.alotaibi@vibers-agency.sa',
    countryCode: '+966',
    phoneNumber: '554892103',
    fullPhone: '+966 554892103',
    whatsappPhone: '+966 554892103',
    businessActivity: 'خدمات الشحن الفوري وتوزيع العملات الرقمية (Global Coin & VIP Shipping)',
    selectedRoles: ['super_admin', 'shipping_agent'],
    bio: 'خبرة 5 سنوات في إدارة شحن تطبيقات الدردشة الصوتية في الخليج مع قاعدة عملاء تتجاوز 1500 داعم VIP.',
    age: 29,
    gender: 'male',
    nationalIdNumber: '1098472619',
    residenceAddress: 'المملكة العربية السعودية، الرياض، حي النخيل',
    streetName: 'طريق الملك فهد الفرعي',
    houseNumber: '14B',
    managedBdCount: 18,
    managedBdNamesOrCodes: 'فريق صقور نجد (18 مطور أعمال معتمدين بأرقام اشتراك رسمية)',
    status: 'approved',
    candidateRating: 7,
    moderationNotes: 'ملف مكتمل ومستوفي كافة شروط السوبر أدمن مع 18 BD نشطين.',
    submittedAt: '2026-10-10 14:20'
  },
  {
    id: 'app-102',
    registrationTrack: 'official',
    realFullName: 'سارة أحمد محمود المنصور',
    nickname: 'Queen Sarah Audio',
    email: 'sarah.mansour@voicehub.ae',
    countryCode: '+971',
    phoneNumber: '508374911',
    fullPhone: '+971 508374911',
    whatsappPhone: '+971 508374911',
    businessActivity: 'إدارة وتشغيل وكالات المضيفين والمذيعين (Host Agency Management)',
    selectedRoles: ['admin', 'host_agent'],
    bio: 'مؤسسة وكالة صوتية تضم 85 مضيفة محترفة في الإمارات والأردن، نرغب بالانضمام تحت مظلة Vibers V العالمية.',
    age: 26,
    gender: 'female',
    nationalIdNumber: '784-1998-1234567-1',
    residenceAddress: 'الإمارات العربية المتحدة، دبي، الخليج التجاري',
    streetName: 'شارع مراسي درايف',
    houseNumber: 'برج الأوبال 402',
    managedBdCount: 9,
    managedBdNamesOrCodes: 'وكالة ستارز فويس (9 مطوري أعمال متعاقدين رسمياً)',
    status: 'approved',
    candidateRating: 7,
    moderationNotes: 'تمت المقابلة واعتمادها كأدمن رسمي مع فريق 9 BD.',
    submittedAt: '2026-10-09 19:45'
  },
  {
    id: 'app-103',
    registrationTrack: 'quick',
    realFullName: 'كريم طارق حسن الشناوي',
    nickname: 'Karim Tech BD',
    email: 'karim.shenawy@devstream.eg',
    countryCode: '+20',
    phoneNumber: '1092837465',
    fullPhone: '+20 1092837465',
    whatsappPhone: '+20 1092837465',
    businessActivity: 'تطوير الأعمال والتوسع الإقليمي للتطبيقات (Regional BD & Growth)',
    selectedRoles: ['bd'],
    bio: 'مطور أعمال سابق في منصات صوتية، متخصص في التعاقد مع الوكالات الكبرى.',
    age: 24,
    gender: 'male',
    status: 'waitlist',
    candidateRating: 5,
    moderationNotes: 'تسجيل مختصر بنسبة 50% - في قائمة الانتظار لحين استكمال الوثائق الرسمية.',
    submittedAt: '2026-10-10 16:05'
  }
];

export const INITIAL_COMMENTS: UserRatingComment[] = [
  {
    id: 'rev-1',
    authorName: 'فهد الدوسري',
    authorHandle: '@fahad_vip_ksa',
    stars: 7,
    comment: 'شركة Vibers V العالمية بقيادة المدير العام عيون Prince نقلت وكالتنا لمستوى عالمي. سرعة في الشحن، دعم فني على مدار الساعة، واحترافية غير مسبوقة في إدارة التطبيقات الصوتية.',
    createdAt: 'منذ ساعتين',
    activityType: 'وكيل شحن معتمد'
  },
  {
    id: 'rev-2',
    authorName: 'نور الهدى العلي',
    authorHandle: '@nour_host_agency',
    stars: 7,
    comment: 'أفضل منظومة لدعم وكلاء المضيفين والـ BD. الرواتب والمكافآت تنزل في موعدها بالدقيقة، وفريق السوبر أدمن متعاون جداً في حل أي مشكلة تقنية فوراً.',
    createdAt: 'منذ 5 ساعات',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-3',
    authorName: 'عمر الزهراني',
    authorHandle: '@omar_audio_dev',
    stars: 6,
    comment: 'جودة السيرفرات الصوتية وتصميم غرف الـ VIP في تطبيقات Vibers V تتفوق على جميع المنافسين. تجربة ممتازة وتستحق 7 نجوم بجدارة.',
    createdAt: 'يوم أمس',
    activityType: 'تطوير تطبيقات'
  }
];
