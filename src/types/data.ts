
// Bot Management Types
export interface Bot {
  id: string;
  name: string;
  status: 'idle' | 'assigned';
  platforms: SocialMediaPlatform[];
  createdAt: string;
  socialMediaLinks?: Record<string, string>;
  expertise?: string;
  socialMediaDetails?: Record<string, any>;
}

export type SocialMediaPlatform = 'X' | 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'Blog' | 'Threads';

// Campaign Management Types
export interface CampaignFolder {
  id: string;
  name: string;
  description: string;
  campaigns: Campaign[];
  createdAt: string;
  campaignType: CampaignType;
  commentUrls?: string[]; // For reply campaigns
}

export type CampaignType = 'post' | 'reply';

export interface Campaign {
  id: string;
  name: string;
  topic: string;         // Used for Post campaigns or as Comment URL for Reply campaigns
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
