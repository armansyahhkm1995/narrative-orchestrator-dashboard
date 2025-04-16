import { BarChart3, Users, ThumbsUp, MessageSquare, Share2, FileText, Files } from 'lucide-react';
import { useData } from '@/context/DataContext';
import MetricsCard from '@/components/dashboard/MetricsCard';
import EngagementChart from '@/components/dashboard/EngagementChart';
import SentimentChart from '@/components/dashboard/SentimentChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

  const handleGeneratePDF = () => {
    toast.success("Generating PDF report...");
    // Actual PDF generation logic would go here
  };

  const handleGenerateCSV = () => {
    toast.success("Generating CSV report...");
    // Actual CSV generation logic would go here
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-buzzer-primary">
                Generate Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem onClick={handleGeneratePDF} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Generate as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGenerateCSV} className="cursor-pointer">
                <Files className="mr-2 h-4 w-4" />
                <span>Generate as CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricsCard
          title="Likes"
          value={dashboardMetrics.engagementTotal.likes}
          description="Total likes across campaigns"
          icon={<ThumbsUp className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricsCard
          title="Shares"
          value={dashboardMetrics.engagementTotal.shares}
          description="Total shares across campaigns"
          icon={<Share2 className="h-4 w-4" />}
          trend={{ value: 15, isPositive: true }}
        />
        <MetricsCard
          title="Comments"
          value={dashboardMetrics.engagementTotal.comments}
          description="Total comments across campaigns"
          icon={<MessageSquare className="h-4 w-4" />}
          trend={{ value: 6, isPositive: true }}
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
