
import { useState } from 'react';
import { Folder, FolderPlus, PlusCircle, Search } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import CampaignFolderCard from '@/components/campaigns/CampaignFolderCard';
import CreateFolderDialog from '@/components/campaigns/CreateFolderDialog';
import CreateCampaignDialog from '@/components/campaigns/CreateCampaignDialog';

const Campaigns = () => {
  const { campaignFolders } = useData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Filter folders based on search query
  const filteredFolders = campaignFolders.filter(
    folder => folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCampaign = (folderId: string) => {
    setSelectedFolderId(folderId);
    setIsCreateCampaignOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Campaign Management</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsCreateFolderOpen(true)}
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Folder</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaign folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      <Separator />

      {filteredFolders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-lg">
          <Folder className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No campaign folders found</h3>
          <p className="text-muted-foreground mt-2 mb-4 text-center">
            Create your first campaign folder to organize your campaigns
          </p>
          <Button 
            onClick={() => setIsCreateFolderOpen(true)}
            className="gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Create Folder</span>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFolders.map((folder) => (
            <CampaignFolderCard
              key={folder.id}
              folder={folder}
              onCreateCampaign={() => handleCreateCampaign(folder.id)}
            />
          ))}
        </div>
      )}

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
      />

      <CreateCampaignDialog
        open={isCreateCampaignOpen}
        onOpenChange={setIsCreateCampaignOpen}
        folderId={selectedFolderId}
      />
    </div>
  );
};

export default Campaigns;
