
import { BarChart3, Users, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import MetricsCard from '@/components/dashboard/MetricsCard';
import EngagementChart from '@/components/dashboard/EngagementChart';
import SentimentChart from '@/components/dashboard/SentimentChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { bots, campaignFolders, dashboardMetrics } = useData();

  // Count active campaigns
  const activeCampaigns = campaignFolders.reduce(
    (acc, folder) => acc + folder.campaigns.length, 
    0
  );

  // Calculate total engagement
  const totalEngagement = 
    dashboardMetrics.engagementTotal.likes + 
    dashboardMetrics.engagementTotal.shares + 
    dashboardMetrics.engagementTotal.comments;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button className="bg-buzzer-primary">
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Bots"
          value={bots.length}
          description="Active bot count"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 10, isPositive: true }}
        />
        <MetricsCard
          title="Active Campaigns"
          value={activeCampaigns}
          description="Across all folders"
          icon={<BarChart3 className="h-4 w-4" />}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricsCard
          title="Total Engagement"
          value={totalEngagement}
          description="Likes, shares & comments"
          icon={<ThumbsUp className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricsCard
          title="Sentiment Score"
          value={`${dashboardMetrics.sentimentOverview.positive}%`}
          description="Positive sentiment"
          icon={<MessageSquare className="h-4 w-4" />}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <EngagementChart data={dashboardMetrics.engagementHistory} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SentimentChart data={dashboardMetrics.sentimentOverview} />
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
