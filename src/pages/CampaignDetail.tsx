
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, MessageSquare, SendHorizonal } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateCampaignDialog from '@/components/campaigns/CreateCampaignDialog';
import { Campaign } from '@/types/data';

const CampaignDetail = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { campaignFolders } = useData();
  const { toast } = useToast();
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  
  const folder = campaignFolders.find(f => f.id === folderId);
  
  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Folder Not Found</h2>
        <p className="text-muted-foreground mb-4">The campaign folder you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/campaigns')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
      </div>
    );
  }
  
  const { campaigns } = folder;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/campaigns')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{folder.name}</h1>
          {folder.campaignType === 'post' ? (
            <Badge className="bg-purple-600 hover:bg-purple-700 ml-2">
              <SendHorizonal className="h-3 w-3 mr-1" />
              Post Campaign
            </Badge>
          ) : (
            <Badge className="bg-orange-500 hover:bg-orange-600 ml-2">
              <MessageSquare className="h-3 w-3 mr-1" />
              Reply Campaign
            </Badge>
          )}
        </div>
        <Button 
          className="gap-2 bg-purple-600 hover:bg-purple-700"
          onClick={() => setIsCreateCampaignOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      <p className="text-muted-foreground">{folder.description}</p>
      
      {folder.campaignType === 'reply' && folder.commentUrls && folder.commentUrls.length > 0 && (
        <div className="bg-muted/30 p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Comment URLs</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {folder.commentUrls.map((url, index) => (
              <div key={index} className="text-xs bg-background p-2 rounded">
                {url}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Separator />
      
      <div className="rounded-md border">
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first campaign in this folder
            </p>
            <Button 
              onClick={() => setIsCreateCampaignOpen(true)}
              className="gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircle className="h-4 w-4" />
              New Campaign
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Bots</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.topic}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSentimentClassName(campaign.sentiment)}>
                      {campaign.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.bots.length}</TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end gap-2">
                      <Badge variant="secondary">{campaign.engagement.likes} likes</Badge>
                      <Badge variant="secondary">{campaign.engagement.comments} comments</Badge>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      
      <CreateCampaignDialog
        open={isCreateCampaignOpen}
        onOpenChange={setIsCreateCampaignOpen}
        folderId={folderId}
      />
    </div>
  );
};

// Helper function to get sentiment badge color
const getSentimentClassName = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-50 text-green-700';
    case 'negative':
      return 'bg-red-50 text-red-700';
    case 'neutral':
    default:
      return 'bg-blue-50 text-blue-700';
  }
};

export default CampaignDetail;
