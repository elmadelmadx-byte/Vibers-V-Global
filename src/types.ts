export type RoleId = 'super_admin' | 'admin' | 'bd' | 'shipping_agent' | 'host_agent';

export type RegistrationTrack = 'official' | 'quick';

export interface RoleOption {
  id: RoleId;
  titleAr: string;
  titleEn: string;
  descAr: string;
  badgeCode: string;
  requiredBds?: number;
}

export interface BannerSlide {
  id: string;
  titleAr: string;
  subtitleAr: string;
  kickerEn: string;
  imageUrl: string;
  ctaTextAr: string;
  ctaTarget: string;
  statsHighlight: string;
}

export interface ActivityShowcase {
  id: string;
  numberIndex: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  descriptionAr: string;
  metricsAr: string;
  imageUrl: string;
}

export interface TeamApplication {
  id: string;
  registrationTrack: RegistrationTrack;
  realFullName: string;
  nickname: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  fullPhone: string;
  whatsappPhone?: string;
  businessActivity: string;
  selectedRoles: RoleId[];
  bio: string;
  
  // Demographics
  age?: number;
  gender?: 'male' | 'female';

  // Official Track Rigorous Identity Fields
  nationalIdNumber?: string;
  idFrontImage?: string;
  idBackImage?: string;
  residenceAddress?: string;
  streetName?: string;
  houseNumber?: string;

  // Hierarchical Governance team requirements
  managedBdCount?: number;
  managedBdNamesOrCodes?: string;

  // Moderation / Management Workflow
  status: 'pending' | 'approved' | 'rejected' | 'banned' | 'waitlist';
  moderationNotes?: string;
  candidateRating?: number; // 1 to 7 rating given by manager
  submittedAt: string;
}

export interface UserRatingComment {
  id: string;
  authorName: string;
  authorHandle: string;
  stars: number; // 1 to 7
  comment: string;
  createdAt: string;
  isBannedUser?: boolean;
  activityType?: string;
}

export interface LivePlatformStats {
  activeUsers: number;
  hostAgencies: number; // 19,700
  totalHosts: number; // 350,000
  superAdmins: number; // 2,573
  admins: number; // 3,940
  bds: number; // 8,806
  shippingAgents: number; // 7,860
  hostAgents: number; // 19,700
  officialRegistrations: number;
  quickRegistrations: number;
  dailyActiveLogins?: number;
}

export interface BroadcastNotification {
  id: string;
  senderName: string;
  title: string;
  message: string;
  type: 'welcome' | 'urgent' | 'announcement';
  createdAt: string;
  isActive: boolean;
}

export interface StatCardCustomization {
  id: string;
  topText: string;
  insideTitle: string;
  bottomText: string;
  starsCount?: number;
  iconEmoji?: string;
  iconType: string;
}

// Sub-admin permission matrix configurable by General Manager Ayoun Prince
export interface SubAdminPermissions {
  canApproveApplicants: boolean;
  canRejectApplicants: boolean;
  canBanUsers: boolean;
  canDeleteReviews: boolean;
  canEditBanners: boolean;
  canViewStatsOnly: boolean;
  canEvaluateCandidates: boolean;
}

export interface SubAdminAccount {
  id: string;
  name: string;
  email: string;
  password: string; // Private access credential created by manager
  roleTitle: string;
  permissions: SubAdminPermissions;
  createdAt: string;
}

export interface ActiveAdminSession {
  isGeneralManager: boolean;
  email: string;
  name: string;
  permissions: SubAdminPermissions;
}
