
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Bot, 
  CampaignFolder, 
  Campaign, 
  Prompt, 
  DashboardMetrics,
  SocialMediaPlatform
} from '../types/data';
import { useToast } from '@/components/ui/use-toast';

// Sample data for demonstration
const generateSampleData = () => {
  // Generate some sample bots
  const bots: Bot[] = [
    {
      id: '1',
      name: 'EcoWarrior',
      status: 'assigned',
      platforms: ['X', 'Instagram', 'Facebook'],
      createdAt: '2025-04-01T10:30:00Z'
    },
    {
      id: '2',
      name: 'TechEnthusiast',
      status: 'idle',
      platforms: ['X', 'YouTube', 'Blog'],
      createdAt: '2025-04-05T14:15:00Z'
    },
    {
      id: '3',
      name: 'FitnessFanatic',
      status: 'assigned',
      platforms: ['Instagram', 'TikTok'],
      createdAt: '2025-04-08T09:45:00Z'
    }
  ];

  // Generate some sample campaign folders
  const campaignFolders: CampaignFolder[] = [
    {
      id: '1',
      name: 'Product Launch',
      description: 'Campaigns for new tech product launch',
      createdAt: '2025-03-15T08:00:00Z',
      campaigns: [
        {
          id: '1',
          name: 'Smartphone X Release',
          topic: 'Modern smartphone features',
          narrative: 'Highlighting the revolutionary camera and battery life of Smartphone X',
          sentiment: 'positive',
          bots: ['1', '2'],
          createdAt: '2025-03-20T09:30:00Z',
          engagement: { likes: 1250, shares: 430, comments: 175 },
          sentimentAnalysis: { positive: 70, negative: 10, neutral: 20 }
        }
      ]
    },
    {
      id: '2',
      name: 'Sustainability Initiative',
      description: 'Environmental awareness campaigns',
      createdAt: '2025-03-25T11:20:00Z',
      campaigns: [
        {
          id: '2',
          name: 'Ocean Cleanup',
          topic: 'Marine pollution',
          narrative: 'Emphasizing the importance of reducing plastic waste for ocean health',
          sentiment: 'neutral',
          bots: ['1', '3'],
          createdAt: '2025-03-28T13:45:00Z',
          engagement: { likes: 950, shares: 620, comments: 230 },
          sentimentAnalysis: { positive: 50, negative: 20, neutral: 30 }
        }
      ]
    }
  ];

  // Generate some sample prompts
  const prompts: Prompt[] = [
    {
      id: '1',
      name: 'Tech Innovation',
      content: 'Discuss how the latest technology is revolutionizing everyday life and creating new opportunities.',
      category: ['Technology', 'Innovation'],
      sentiment: 'positive',
      createdAt: '2025-03-10T10:00:00Z',
      campaignId: '1'
    },
    {
      id: '2',
      name: 'Environmental Concern',
      content: 'Highlight the critical state of our environment and propose sustainable solutions.',
      category: ['Environment', 'Sustainability'],
      sentiment: 'neutral',
      createdAt: '2025-03-18T16:20:00Z',
      campaignId: '2'
    },
    {
      id: '3',
      name: 'Fitness Challenge',
      content: 'Motivate followers to join a 30-day fitness challenge with daily tips and progress tracking.',
      category: ['Health', 'Fitness'],
      sentiment: 'positive',
      createdAt: '2025-04-02T11:30:00Z'
    }
  ];

  // Generate metrics
  const dashboardMetrics: DashboardMetrics = {
    botCount: bots.length,
    terminatedBotCount: 1,
    engagementTotal: {
      likes: 2200,
      shares: 1050,
      comments: 405
    },
    sentimentOverview: {
      positive: 60,
      negative: 15,
      neutral: 25
    },
    engagementHistory: [
      { date: '2025-04-01', likes: 120, shares: 45, comments: 20 },
      { date: '2025-04-02', likes: 150, shares: 55, comments: 25 },
      { date: '2025-04-03', likes: 200, shares: 70, comments: 30 },
      { date: '2025-04-04', likes: 180, shares: 65, comments: 28 },
      { date: '2025-04-05', likes: 220, shares: 80, comments: 35 },
      { date: '2025-04-06', likes: 250, shares: 90, comments: 40 },
      { date: '2025-04-07', likes: 300, shares: 110, comments: 50 },
      { date: '2025-04-08', likes: 280, shares: 100, comments: 45 },
      { date: '2025-04-09', likes: 350, shares: 125, comments: 55 },
      { date: '2025-04-10', likes: 400, shares: 150, comments: 65 }
    ]
  };

  return { bots, campaignFolders, prompts, dashboardMetrics };
};

interface DataContextType {
  bots: Bot[];
  campaignFolders: CampaignFolder[];
  prompts: Prompt[];
  dashboardMetrics: DashboardMetrics;
  addBot: (bot: Omit<Bot, 'id' | 'createdAt'>) => void;
  updateBot: (bot: Bot) => void;
  deleteBot: (id: string) => void;
  addCampaignFolder: (folder: Omit<CampaignFolder, 'id' | 'createdAt' | 'campaigns'>) => void;
  updateCampaignFolder: (folder: CampaignFolder) => void;
  deleteCampaignFolder: (id: string) => void;
  addCampaign: (folderId: string, campaign: Omit<Campaign, 'id' | 'createdAt' | 'engagement' | 'sentimentAnalysis'>) => void;
  updateCampaign: (folderId: string, campaign: Campaign) => void;
  deleteCampaign: (folderId: string, campaignId: string) => void;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt'>) => void;
  updatePrompt: (prompt: Prompt) => void;
  deletePrompt: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sampleData = generateSampleData();
  const [bots, setBots] = useState<Bot[]>(sampleData.bots);
  const [campaignFolders, setCampaignFolders] = useState<CampaignFolder[]>(sampleData.campaignFolders);
  const [prompts, setPrompts] = useState<Prompt[]>(sampleData.prompts);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>(sampleData.dashboardMetrics);
  const { toast } = useToast();

  // Bot CRUD operations
  const addBot = (bot: Omit<Bot, 'id' | 'createdAt'>) => {
    const newBot: Bot = {
      ...bot,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setBots(prevBots => [...prevBots, newBot]);
    // Update metrics
    setDashboardMetrics(prevMetrics => ({
      ...prevMetrics,
      botCount: prevMetrics.botCount + 1
    }));
    toast({
      title: "Bot Added",
      description: `Bot ${newBot.name} has been created successfully.`
    });
  };

  const updateBot = (bot: Bot) => {
    setBots(prevBots => prevBots.map(b => b.id === bot.id ? bot : b));
    toast({
      title: "Bot Updated",
      description: `Bot ${bot.name} has been updated successfully.`
    });
  };

  const deleteBot = (id: string) => {
    const botToDelete = bots.find(b => b.id === id);
    if (!botToDelete) return;
    
    setBots(prevBots => prevBots.filter(b => b.id !== id));
    // Update metrics
    setDashboardMetrics(prevMetrics => ({
      ...prevMetrics,
      botCount: prevMetrics.botCount - 1,
      terminatedBotCount: prevMetrics.terminatedBotCount + 1
    }));
    toast({
      title: "Bot Deleted",
      description: `Bot ${botToDelete.name} has been deleted successfully.`
    });
  };

  // Campaign Folder CRUD operations
  const addCampaignFolder = (folder: Omit<CampaignFolder, 'id' | 'createdAt' | 'campaigns'>) => {
    const newFolder: CampaignFolder = {
      ...folder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      campaigns: []
    };
    setCampaignFolders(prevFolders => [...prevFolders, newFolder]);
    toast({
      title: "Folder Created",
      description: `Campaign folder ${newFolder.name} has been created successfully.`
    });
  };

  const updateCampaignFolder = (folder: CampaignFolder) => {
    setCampaignFolders(prevFolders => 
      prevFolders.map(f => f.id === folder.id ? folder : f)
    );
    toast({
      title: "Folder Updated",
      description: `Campaign folder ${folder.name} has been updated successfully.`
    });
  };

  const deleteCampaignFolder = (id: string) => {
    const folderToDelete = campaignFolders.find(f => f.id === id);
    if (!folderToDelete) return;
    
    setCampaignFolders(prevFolders => prevFolders.filter(f => f.id !== id));
    toast({
      title: "Folder Deleted",
      description: `Campaign folder ${folderToDelete.name} has been deleted successfully.`
    });
  };

  // Campaign CRUD operations
  const addCampaign = (folderId: string, campaign: Omit<Campaign, 'id' | 'createdAt' | 'engagement' | 'sentimentAnalysis'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      engagement: { likes: 0, shares: 0, comments: 0 },
      sentimentAnalysis: { positive: 0, negative: 0, neutral: 0 }
    };
    
    setCampaignFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            campaigns: [...folder.campaigns, newCampaign]
          };
        }
        return folder;
      })
    );
    
    // Update bot status for assigned bots
    setBots(prevBots => 
      prevBots.map(bot => {
        if (campaign.bots.includes(bot.id)) {
          return { ...bot, status: 'assigned' };
        }
        return bot;
      })
    );
    
    toast({
      title: "Campaign Created",
      description: `Campaign ${newCampaign.name} has been created successfully.`
    });
  };

  const updateCampaign = (folderId: string, campaign: Campaign) => {
    setCampaignFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            campaigns: folder.campaigns.map(c => 
              c.id === campaign.id ? campaign : c
            )
          };
        }
        return folder;
      })
    );
    
    // Update bot status for assigned bots
    setBots(prevBots => 
      prevBots.map(bot => {
        if (campaign.bots.includes(bot.id)) {
          return { ...bot, status: 'assigned' };
        }
        return bot;
      })
    );
    
    toast({
      title: "Campaign Updated",
      description: `Campaign ${campaign.name} has been updated successfully.`
    });
  };

  const deleteCampaign = (folderId: string, campaignId: string) => {
    // Find the campaign to delete
    const folder = campaignFolders.find(f => f.id === folderId);
    const campaignToDelete = folder?.campaigns.find(c => c.id === campaignId);
    
    if (!folder || !campaignToDelete) return;
    
    // Update campaign folders
    setCampaignFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            campaigns: folder.campaigns.filter(c => c.id !== campaignId)
          };
        }
        return folder;
      })
    );
    
    // Update bot status for assigned bots (set to idle if not assigned to other campaigns)
    setBots(prevBots => {
      const campaignBotIds = campaignToDelete.bots;
      const otherCampaigns = campaignFolders
        .flatMap(f => f.campaigns)
        .filter(c => c.id !== campaignId);
      
      return prevBots.map(bot => {
        if (campaignBotIds.includes(bot.id)) {
          // Check if bot is assigned to any other campaign
          const isAssignedElsewhere = otherCampaigns.some(c => c.bots.includes(bot.id));
          return { ...bot, status: isAssignedElsewhere ? 'assigned' : 'idle' };
        }
        return bot;
      });
    });
    
    toast({
      title: "Campaign Deleted",
      description: `Campaign ${campaignToDelete.name} has been deleted successfully.`
    });
  };

  // Prompt CRUD operations
  const addPrompt = (prompt: Omit<Prompt, 'id' | 'createdAt'>) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setPrompts(prevPrompts => [...prevPrompts, newPrompt]);
    toast({
      title: "Prompt Created",
      description: `Prompt ${newPrompt.name} has been created successfully.`
    });
  };

  const updatePrompt = (prompt: Prompt) => {
    setPrompts(prevPrompts => prevPrompts.map(p => p.id === prompt.id ? prompt : p));
    toast({
      title: "Prompt Updated",
      description: `Prompt ${prompt.name} has been updated successfully.`
    });
  };

  const deletePrompt = (id: string) => {
    const promptToDelete = prompts.find(p => p.id === id);
    if (!promptToDelete) return;
    
    setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== id));
    toast({
      title: "Prompt Deleted",
      description: `Prompt ${promptToDelete.name} has been deleted successfully.`
    });
  };

  return (
    <DataContext.Provider value={{
      bots,
      campaignFolders,
      prompts,
      dashboardMetrics,
      addBot,
      updateBot,
      deleteBot,
      addCampaignFolder,
      updateCampaignFolder,
      deleteCampaignFolder,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      addPrompt,
      updatePrompt,
      deletePrompt
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
