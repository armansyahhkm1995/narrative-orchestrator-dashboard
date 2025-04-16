
import { useState } from 'react';
import { Folder, MoreVertical, Edit, Trash2, PlusCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/DataContext';
import { CampaignFolder } from '@/types/data';
import EditFolderDialog from './EditFolderDialog';
import DeleteFolderDialog from './DeleteFolderDialog';
import CampaignList from './CampaignList';

interface CampaignFolderCardProps {
  folder: CampaignFolder;
  onCreateCampaign: () => void;
}

const CampaignFolderCard = ({ folder, onCreateCampaign }: CampaignFolderCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const campaignCount = folder.campaigns.length;
  const formattedDate = new Date(folder.createdAt).toLocaleDateString();
  
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">{folder.name}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>{folder.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-purple-50">
                {campaignCount} campaign{campaignCount !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="bg-blue-50">
                Created: {formattedDate}
              </Badge>
            </div>
          </div>
          
          {isExpanded && <CampaignList folderId={folder.id} />}
        </CardContent>
        <CardFooter className="flex justify-between pt-2 pb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Campaigns' : 'Show Campaigns'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={onCreateCampaign}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            New Campaign
          </Button>
        </CardFooter>
      </Card>
      
      <EditFolderDialog
        folder={folder}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
      
      <DeleteFolderDialog
        folder={folder}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
};

export default CampaignFolderCard;
