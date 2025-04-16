
// Bot Management Types
export interface Bot {
  id: string;
  name: string;
  status: 'idle' | 'assigned';
  platforms: SocialMediaPlatform[];
  createdAt: string;
}

export type SocialMediaPlatform = 'X' | 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'Blog';

// Campaign Management Types
export interface CampaignFolder {
  id: string;
  name: string;
  description: string;
  campaigns: Campaign[];
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  topic: string;
  narrative: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  bots: string[]; // Bot IDs
  createdAt: string;
  engagement: Engagement;
  sentimentAnalysis: SentimentAnalysis;
}

export interface Engagement {
  likes: number;
  shares: number;
  comments: number;
}

export interface SentimentAnalysis {
  positive: number;
  negative: number;
  neutral: number;
}

// Prompt Management Types
export interface Prompt {
  id: string;
  name: string;
  content: string;
  category: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: string;
  campaignId?: string;
}

// Dashboard Metrics Types
export interface DashboardMetrics {
  botCount: number;
  terminatedBotCount: number;
  engagementTotal: {
    likes: number;
    shares: number;
    comments: number;
  };
  sentimentOverview: {
    positive: number;
    negative: number;
    neutral: number;
  };
  engagementHistory: {
    date: string;
    likes: number;
    shares: number;
    comments: number;
  }[];
}
