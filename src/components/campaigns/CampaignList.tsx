
import { useState } from 'react';
import { Edit, Eye, Trash2, BarChart, ThumbsUp, MessageSquare } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CampaignDetailDialog from './CampaignDetailDialog';
import EditCampaignDialog from './EditCampaignDialog';
import DeleteCampaignDialog from './DeleteCampaignDialog';
import { Campaign } from '@/types/data';

interface CampaignListProps {
  folderId: string;
}

const CampaignList = ({ folderId }: CampaignListProps) => {
  const { campaignFolders } = useData();
  const folder = campaignFolders.find(f => f.id === folderId);
  const campaigns = folder ? folder.campaigns : [];
  
  const [viewCampaign, setViewCampaign] = useState<Campaign | null>(null);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [deleteCampaign, setDeleteCampaign] = useState<Campaign | null>(null);
  
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No campaigns in this folder yet.
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <div 
            key={campaign.id} 
            className="p-3 rounded-md border bg-card text-card-foreground hover:shadow-sm transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-sm">{campaign.name}</h4>
                <p className="text-xs text-muted-foreground">Topic: {campaign.topic}</p>
              </div>
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => setViewCampaign(campaign)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View details</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => setEditCampaign(campaign)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit campaign</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive"
                        onClick={() => setDeleteCampaign(campaign)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete campaign</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="flex items-center text-xs gap-1 text-muted-foreground">
                <Badge variant="outline" className={`px-1.5 ${getSentimentColor(campaign.sentiment)}`}>
                  {campaign.sentiment}
                </Badge>
              </div>
              <div className="flex items-center text-xs gap-1 text-muted-foreground justify-center">
                <ThumbsUp className="h-3 w-3" />
                <span>{campaign.engagement.likes}</span>
                <MessageSquare className="h-3 w-3 ml-2" />
                <span>{campaign.engagement.comments}</span>
              </div>
              <div className="flex items-center text-xs gap-1 text-muted-foreground justify-end">
                <span>Bots: {campaign.bots.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {viewCampaign && (
        <CampaignDetailDialog
          campaign={viewCampaign}
          folderId={folderId}
          open={!!viewCampaign}
          onOpenChange={(open) => !open && setViewCampaign(null)}
        />
      )}
      
      {editCampaign && (
        <EditCampaignDialog
          campaign={editCampaign}
          folderId={folderId}
          open={!!editCampaign}
          onOpenChange={(open) => !open && setEditCampaign(null)}
        />
      )}
      
      {deleteCampaign && (
        <DeleteCampaignDialog
          campaign={deleteCampaign}
          folderId={folderId}
          open={!!deleteCampaign}
          onOpenChange={(open) => !open && setDeleteCampaign(null)}
        />
      )}
    </>
  );
};

// Helper function to get sentiment badge color
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

export default CampaignList;
