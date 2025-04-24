
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Folder, FolderPlus, MessageSquare, Search, SendHorizonal } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CreateFolderDialog from '@/components/campaigns/CreateFolderDialog';

const Campaigns = () => {
  const { campaignFolders } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  // Filter folders based on search query
  const filteredFolders = campaignFolders.filter(
    folder => folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Card key={folder.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">{folder.name}</CardTitle>
                  </div>
                  {folder.campaignType === 'post' ? (
                    <Badge className="bg-purple-600 hover:bg-purple-700">
                      <SendHorizonal className="h-3 w-3 mr-1" />
                      Post Campaign
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reply Campaign
                    </Badge>
                  )}
                </div>
                <CardDescription>{folder.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-purple-50">
                    {folder.campaigns.length} campaign{folder.campaigns.length !== 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50">
                    Created: {new Date(folder.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                {folder.campaignType === 'reply' && folder.commentUrls && folder.commentUrls.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Comment URLs:</span> {folder.commentUrls.length}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-1 pb-4">
                <Link to={`/campaigns/${folder.id}`} className="w-full">
                  <Button variant="default" className="w-full bg-purple-600 hover:bg-purple-700">
                    View Campaigns
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
      />
    </div>
  );
};

export default Campaigns;
