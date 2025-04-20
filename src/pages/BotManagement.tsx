import { useState, useRef } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Edit, Trash2, ExternalLink, Check, X, Bot } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Bot as BotType, SocialMediaPlatform } from '@/types/data';
import { useToast } from '@/components/ui/use-toast';

const BotManagement = () => {
  const { bots, addBot, updateBot, deleteBot } = useData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentBot, setCurrentBot] = useState<BotType | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Form state
  const [botName, setBotName] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialMediaPlatform[]>([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState<Record<SocialMediaPlatform, string>>({
    X: '',
    Instagram: '',
    Facebook: '',
    TikTok: '',
    YouTube: '',
    Blog: ''
  });

  // Platform options
  const platforms: SocialMediaPlatform[] = ['X', 'Instagram', 'Facebook', 'TikTok', 'YouTube', 'Blog'];

  const handleAddBot = () => {
    if (!botName || selectedPlatforms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Bot name and at least one platform are required",
        variant: "destructive"
      });
      return;
    }

    const links: Record<string, string> = {};
    selectedPlatforms.forEach(platform => {
      links[platform] = socialMediaLinks[platform];
    });

    addBot({
      name: botName,
      status: 'idle',
      platforms: selectedPlatforms,
      socialMediaLinks: links
    });

    setBotName('');
    setSelectedPlatforms([]);
    setSocialMediaLinks({
      X: '',
      Instagram: '',
      Facebook: '',
      TikTok: '',
      YouTube: '',
      Blog: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditBot = () => {
    if (!currentBot || !botName || selectedPlatforms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Bot name and at least one platform are required",
        variant: "destructive"
      });
      return;
    }

    const links: Record<string, string> = {};
    selectedPlatforms.forEach(platform => {
      links[platform] = socialMediaLinks[platform];
    });

    updateBot({
      ...currentBot,
      name: botName,
      platforms: selectedPlatforms,
      socialMediaLinks: links
    });

    setBotName('');
    setSelectedPlatforms([]);
    setSocialMediaLinks({
      X: '',
      Instagram: '',
      Facebook: '',
      TikTok: '',
      YouTube: '',
      Blog: ''
    });
    setCurrentBot(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteBot = () => {
    if (!currentBot) return;
    
    deleteBot(currentBot.id);
    setCurrentBot(null);
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (bot: BotType) => {
    setCurrentBot(bot);
    setBotName(bot.name);
    setSelectedPlatforms([...bot.platforms]);
    
    const initialLinks: Record<SocialMediaPlatform, string> = {
      X: '',
      Instagram: '',
      Facebook: '',
      TikTok: '',
      YouTube: '',
      Blog: ''
    };
    
    if (bot.socialMediaLinks) {
      bot.platforms.forEach(platform => {
        initialLinks[platform] = bot.socialMediaLinks?.[platform] || '';
      });
    }
    
    setSocialMediaLinks(initialLinks);
    setIsEditDialogOpen(true);
    setOpenDropdownId(null);
  };

  const openDeleteDialog = (bot: BotType) => {
    setCurrentBot(bot);
    setIsDeleteDialogOpen(true);
    setOpenDropdownId(null);
  };

  const openDetailDialog = (bot: BotType) => {
    setCurrentBot(bot);
    setIsDetailDialogOpen(true);
    setOpenDropdownId(null);
  };

  const handleVerifyNow = (platform: string) => {
    toast({
      title: "Verification Started",
      description: `Starting verification for ${platform}...`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSocialMediaLinkChange = (platform: SocialMediaPlatform, value: string) => {
    setSocialMediaLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleDropdownOpenChange = (open: boolean, botId: string) => {
    if (open) {
      setOpenDropdownId(botId);
    } else {
      setOpenDropdownId(null);
    }
  };

  const handleAddDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setOpenDropdownId(null);
    }
  };

  const handleEditDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setOpenDropdownId(null);
    }
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setOpenDropdownId(null);
    }
  };

  const handleDetailDialogOpenChange = (open: boolean) => {
    setIsDetailDialogOpen(open);
    if (!open) {
      setOpenDropdownId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Bot Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-buzzer-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Bot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bot</DialogTitle>
              <DialogDescription>
                Create a new bot to manage your social media presence.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bot Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., TechInfluencer"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Bot Social Media Links</Label>
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <div key={platform} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`platform-${platform}`}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPlatforms([...selectedPlatforms, platform]);
                            } else {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                            }
                          }}
                        />
                        <Label htmlFor={`platform-${platform}`}>{platform}</Label>
                      </div>
                      {selectedPlatforms.includes(platform) && (
                        <Input
                          placeholder={`${platform} profile link`}
                          value={socialMediaLinks[platform]}
                          onChange={(e) => handleSocialMediaLinkChange(platform, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button className="bg-buzzer-primary" onClick={handleAddBot}>Add Bot</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No bots found. Click "Add Bot" to create your first bot.
                </TableCell>
              </TableRow>
            ) : (
              bots.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="font-medium">{bot.name}</TableCell>
                  <TableCell>
                    {bot.status === 'assigned' ? (
                      <Badge className="bg-green-500">Assigned</Badge>
                    ) : (
                      <Badge variant="outline">Idle</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {bot.platforms.map((platform) => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(bot.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu open={openDropdownId === bot.id} onOpenChange={(open) => handleDropdownOpenChange(open, bot.id)}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDetailDialog(bot)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(bot)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Bot
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(bot)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Bot
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Bot Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bot</DialogTitle>
            <DialogDescription>
              Update this bot's information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Bot Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., TechInfluencer"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Bot Social Media Links</Label>
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <div key={platform} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-platform-${platform}`}
                        checked={selectedPlatforms.includes(platform)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPlatforms([...selectedPlatforms, platform]);
                          } else {
                            setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                          }
                        }}
                      />
                      <Label htmlFor={`edit-platform-${platform}`}>{platform}</Label>
                    </div>
                    {selectedPlatforms.includes(platform) && (
                      <Input
                        placeholder={`${platform} profile link`}
                        value={socialMediaLinks[platform]}
                        onChange={(e) => handleSocialMediaLinkChange(platform, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-buzzer-primary" onClick={handleEditBot}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Bot Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentBot?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteBot}>Delete Bot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bot Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={handleDetailDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bot Details</DialogTitle>
            <DialogDescription>
              Detailed information about this bot.
            </DialogDescription>
          </DialogHeader>
          {currentBot && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{currentBot.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    {currentBot.status === 'assigned' ? (
                      <Badge className="bg-green-500">Assigned</Badge>
                    ) : (
                      <Badge variant="outline">Idle</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                  <p className="mt-1">{formatDate(currentBot.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Platform Count</h3>
                  <p className="mt-1">{currentBot.platforms.length}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {currentBot.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Validation Status</h3>
                <div className="space-y-2">
                  {currentBot.platforms.map((platform) => {
                    const isValid = Math.random() > 0.3;
                    return (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {isValid ? (
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <X className="h-4 w-4 text-[#ea384c] mr-2" />
                          )}
                          <span>{platform} account {isValid ? 'validated' : 'invalid'}</span>
                        </div>
                        {!isValid && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-[#9b87f5] text-white hover:bg-[#8a71f1]"
                            onClick={() => handleVerifyNow(platform)}
                          >
                            Verify now
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BotManagement;
