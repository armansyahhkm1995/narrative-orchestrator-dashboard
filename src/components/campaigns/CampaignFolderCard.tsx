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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const campaignCount = folder.campaigns.length;
  const formattedDate = new Date(folder.createdAt).toLocaleDateString();
  
  const handleEditClick = () => {
    setIsDropdownOpen(false);
    setIsEditOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <Card className="futuristic-card">
        <CardHeader className="bg-gradient-to-r from-futuristic-muted to-futuristic-card pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-futuristic-primary" />
              <CardTitle className="text-lg font-orbitron">{folder.name}</CardTitle>
            </div>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditClick}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="text-gray-400">{folder.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-futuristic-muted border-futuristic-primary text-futuristic-primary">
                {campaignCount} campaign{campaignCount !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="bg-futuristic-muted border-futuristic-border text-gray-400">
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
            className="text-futuristic-primary hover:shadow-neon"
          >
            {isExpanded ? 'Hide Campaigns' : 'Show Campaigns'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 border-futuristic-primary text-futuristic-primary hover:shadow-neon"
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
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setIsDropdownOpen(false);
          }
        }}
      />
      
      <DeleteFolderDialog
        folder={folder}
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setIsDropdownOpen(false);
          }
        }}
      />
    </>
  );
};

export default CampaignFolderCard;
