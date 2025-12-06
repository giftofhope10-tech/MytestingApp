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
}

export interface Rating {
  id: string;
  appId: string;
  testerEmail: string;
  rating: number;
  feedback: string;
  createdAt: number;
}
