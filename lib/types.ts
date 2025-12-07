export interface Developer {
  developerEmail: string;
  verified: boolean;
  activeAppId: string | null;
  createdAt: number;
}

export interface App {
  appId: string;
  developerEmail: string;
  name: string;
  packageName: string;
  playLink: string;
  iconUrl: string;
  createdAt: number;
  status: 'active' | 'completed';
  rating: number;
  totalRatings: number;
  description?: string;
}

export interface TesterRequest {
  id: string;
  testerEmail: string;
  appId: string;
  status: 'pending' | 'approved' | 'rejected';
  daysTested: number;
  lastTestDate: string | null;
  requestedAt: number;
  approvedAt?: number;
  feedback?: string;
  rating?: number;
  completedBadge?: boolean;
  bugReport?: string;
}

export interface Rating {
  id: string;
  appId: string;
  testerEmail: string;
  rating: number;
  feedback: string;
  createdAt: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  status: 'draft' | 'published';
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
}

export interface AdminUser {
  email: string;
  role: 'admin' | 'editor';
  createdAt: number;
}

export interface SiteSettings {
  adsEnabled: boolean;
  adsenseClientId: string;
  adSlots: {
    header: string;
    sidebar: string;
    inArticle: string;
    footer: string;
  };
  updatedAt: number;
  updatedBy: string;
}
