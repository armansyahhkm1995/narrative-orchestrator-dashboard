import { useRef } from 'react';
import { useData } from '@/context/DataContext';
import { Campaign, CampaignType } from '@/types/data';
import { BarChart3, ThumbsUp, MessageSquare, Share2, Bot, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Dialog as ShadDialog } from '@radix-ui/react-dialog';

interface CampaignDetailDialogProps {
  campaign: Campaign;
  folderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CampaignDetailDialog = ({ campaign, folderId, open, onOpenChange }: CampaignDetailDialogProps) => {
  const { bots, campaignFolders, dashboardMetrics } = useData();
  const dialogRef = useRef<HTMLDivElement>(null);
  
  const folder = campaignFolders.find(f => f.id === folderId);
  const isReplyType = folder?.campaignType === 'reply';
  
  const assignedBots = bots.filter(bot => campaign.bots.includes(bot.id));
  
  const engagementData = dashboardMetrics.engagementHistory.slice(0, 7);
  
  const sentimentData = [
    { name: 'Positive', value: campaign.sentimentAnalysis.positive },
    { name: 'Negative', value: campaign.sentimentAnalysis.negative },
    { name: 'Neutral', value: campaign.sentimentAnalysis.neutral },
  ];
  
  const engagementPieData = [
    { name: 'Likes', value: campaign.engagement.likes },
    { name: 'Comments', value: campaign.engagement.comments },
    { name: 'Shares', value: campaign.engagement.shares },
  ];
  
  const sentimentColors = ['#10b981', '#ef4444', '#3b82f6'];
  const engagementColors = ['#8b5cf6', '#3b82f6', '#f97316'];
  
  const commentsFeed = [
    { id: 1, text: 'Great initiative! This is exactly what we need.', sentiment: 'positive', platform: 'X', date: '2h ago' },
    { id: 2, text: 'Not sure if this will work as intended. Needs more detail.', sentiment: 'neutral', platform: 'Instagram', date: '3h ago' },
    { id: 3, text: 'This seems problematic on many levels.', sentiment: 'negative', platform: 'Facebook', date: '5h ago' },
    { id: 4, text: 'Love the approach! Innovative and thoughtful.', sentiment: 'positive', platform: 'Blog', date: '6h ago' },
    { id: 5, text: 'Looking forward to more updates on this.', sentiment: 'positive', platform: 'X', date: '12h ago' },
  ];
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-50 text-green-700';
      case 'negative':
        return 'bg-red-50 text-red-700';
      case 'neutral':
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  const updatedCampaign = {
    ...campaign,
    topic: campaign.topic === 'Marine pollution' ? 'https://x.com/comment/1234' :
      campaign.topic === 'Clean energy transition' ? 'https://instagram.com/comment/1234' :
      campaign.topic === 'Preserving forest ecosystems' ? 'https://facebook.com/comment/1234' :
      campaign.topic === 'Everyday eco-friendly practices' ? 'https://thread.com/comment/1234' :
      campaign.topic
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] p-0" ref={dialogRef}>
        <DialogHeader className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-bold">{campaign.name}</DialogTitle>
              <DialogDescription className="mt-1">
                <div className="flex flex-col gap-2">
                  <span>Created on {new Date(campaign.createdAt).toLocaleDateString()}</span>
                  <span className="font-medium">Comment URL: {updatedCampaign.topic}</span>
                </div>
              </DialogDescription>
            </div>
            <Badge variant="outline" className={`px-2 py-1 ${getSentimentColor(campaign.sentiment)}`}>
              {campaign.sentiment}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {isReplyType ? (
                <div>
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Comment URL
                  </h3>
                  <p className="text-muted-foreground break-all">{campaign.topic}</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-base font-medium">Topic</h3>
                  <p className="text-muted-foreground">{campaign.topic}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-base font-medium">Narrative Diversion</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {campaign.narrative}
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Assigned Bots ({assignedBots.length})
                </h3>
                <div className="mt-2 space-y-2">
                  {assignedBots.map(bot => (
                    <div key={bot.id} className="flex justify-between items-center p-2 rounded-md border">
                      <div>
                        <p className="font-medium">{bot.name}</p>
                        <p className="text-sm text-muted-foreground">Status: {bot.status}</p>
                      </div>
                      <div className="flex gap-1">
                        {bot.platforms.map(platform => (
                          <Badge key={platform} variant="outline" className="bg-gray-50">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-md border text-center">
                  <ThumbsUp className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                  <p className="text-xl font-bold">{campaign.engagement.likes}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <div className="p-3 rounded-md border text-center">
                  <Share2 className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                  <p className="text-xl font-bold">{campaign.engagement.shares}</p>
                  <p className="text-xs text-muted-foreground">Shares</p>
                </div>
                <div className="p-3 rounded-md border text-center">
                  <MessageSquare className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                  <p className="text-xl font-bold">{campaign.engagement.comments}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
              </div>
              
              <div className="p-4 rounded-md border">
                <h3 className="text-sm font-medium mb-2">Sentiment Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={sentimentColors[index % sentimentColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Engagement History
              </h3>
              <div className="rounded-md border p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="likes" stroke="#8b5cf6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="shares" stroke="#f97316" />
                    <Line type="monotone" dataKey="comments" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-base font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Engagement Distribution
              </h3>
              <div className="rounded-md border p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={engagementPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {engagementPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={engagementColors[index % engagementColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4 lg:col-span-3">
            <h3 className="text-base font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Live Comment Feed
            </h3>
            <div className="space-y-3">
              {commentsFeed.map(comment => (
                <div key={comment.id} className="p-3 rounded-md border">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className={getSentimentColor(comment.sentiment)}>
                      {comment.sentiment}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{comment.date}</span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDetailDialog;
