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
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, Plus, Edit, Trash2, ExternalLink, Check, X, Bot } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Bot as BotType, SocialMediaPlatform } from '@/types/data';
import { useToast } from '@/components/ui/use-toast';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";

const BotManagement = () => {
  const { bots, addBot, updateBot, deleteBot } = useData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentBot, setCurrentBot] = useState<BotType | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');

  const [botName, setBotName] = useState('');
  const [botExpertise, setBotExpertise] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialMediaPlatform[]>([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState<Record<SocialMediaPlatform, string>>({
    X: '',
    Instagram: '',
    Facebook: '',
    TikTok: '',
    YouTube: '',
    Blog: '',
    Threads: ''
  });

  const [socialMediaDetails, setSocialMediaDetails] = useState({
    X: {
      username: '',
      displayName: '',
      bio: '',
      photoUrl: '',
      headerImage: '',
      location: '',
      link: '',
      birthDate: ''
    },
    Instagram: {
      username: '',
      displayName: '',
      bio: '',
      photoUrl: ''
    },
    TikTok: {
      username: '',
      displayName: '',
      bio: '',
      photoUrl: ''
    },
    Facebook: {
      name: '',
      bio: '',
      photoUrl: '',
      coverPhoto: '',
      job: '',
      education: '',
      address: '',
      relationshipStatus: '',
      birthDate: ''
    },
    YouTube: {
      channelName: '',
      bio: '',
      photoUrl: '',
      banner: ''
    },
    Threads: {
      username: '',
      displayName: '',
      bio: '',
      photoUrl: ''
    },
    Blog: {
      authorName: '',
      bio: '',
      photoUrl: ''
    }
  });

  const platforms: SocialMediaPlatform[] = ['X', 'Instagram', 'Facebook', 'TikTok', 'YouTube', 'Blog', 'Threads'];

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
      socialMediaLinks: links,
      expertise: botExpertise,
      socialMediaDetails: getSocialMediaDetailsForSelectedPlatforms()
    });

    resetFormState();
    setIsAddDialogOpen(false);
  };

  const resetFormState = () => {
    setBotName('');
    setBotExpertise('');
    setSelectedPlatforms([]);
    setSocialMediaLinks({
      X: '',
      Instagram: '',
      Facebook: '',
      TikTok: '',
      YouTube: '',
      Blog: '',
      Threads: ''
    });
    setSocialMediaDetails({
      X: {
        username: '',
        displayName: '',
        bio: '',
        photoUrl: '',
        headerImage: '',
        location: '',
        link: '',
        birthDate: ''
      },
      Instagram: {
        username: '',
        displayName: '',
        bio: '',
        photoUrl: ''
      },
      TikTok: {
        username: '',
        displayName: '',
        bio: '',
        photoUrl: ''
      },
      Facebook: {
        name: '',
        bio: '',
        photoUrl: '',
        coverPhoto: '',
        job: '',
        education: '',
        address: '',
        relationshipStatus: '',
        birthDate: ''
      },
      YouTube: {
        channelName: '',
        bio: '',
        photoUrl: '',
        banner: ''
      },
      Threads: {
        username: '',
        displayName: '',
        bio: '',
        photoUrl: ''
      },
      Blog: {
        authorName: '',
        bio: '',
        photoUrl: ''
      }
    });
  };

  const getSocialMediaDetailsForSelectedPlatforms = () => {
    const details: Record<string, any> = {};
    selectedPlatforms.forEach(platform => {
      details[platform] = socialMediaDetails[platform];
    });
    return details;
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
      socialMediaLinks: links,
      expertise: botExpertise,
      socialMediaDetails: getSocialMediaDetailsForSelectedPlatforms()
    });

    resetFormState();
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
    setBotExpertise(bot.expertise || '');
    setSelectedPlatforms([...bot.platforms]);
    
    const initialLinks: Record<SocialMediaPlatform, string> = {
      X: '',
      Instagram: '',
      Facebook: '',
      TikTok: '',
      YouTube: '',
      Blog: '',
      Threads: ''
    };
    
    if (bot.socialMediaLinks) {
      bot.platforms.forEach(platform => {
        initialLinks[platform] = bot.socialMediaLinks?.[platform] || '';
      });
    }
    
    setSocialMediaLinks(initialLinks);

    if (bot.socialMediaDetails) {
      const currentDetails = { ...socialMediaDetails };
      Object.keys(bot.socialMediaDetails).forEach((platform) => {
        currentDetails[platform as SocialMediaPlatform] = {
          ...currentDetails[platform as SocialMediaPlatform],
          ...bot.socialMediaDetails[platform]
        };
      });
      setSocialMediaDetails(currentDetails);
    }
    
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

  const handleSocialMediaDetailChange = (platform: SocialMediaPlatform, field: string, value: string) => {
    setSocialMediaDetails(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
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
      resetFormState();
      setOpenDropdownId(null);
    }
  };

  const handleEditDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      resetFormState();
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

  const renderSocialMediaDetailsForm = (platform: SocialMediaPlatform) => {
    switch(platform) {
      case 'X':
        return (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">X (Twitter) Details</h3>
            
            <div>
              <Label htmlFor="x-username">Username:</Label>
              <Input
                id="x-username"
                placeholder="@RinaSari89"
                value={socialMediaDetails.X.username}
                onChange={(e) => handleSocialMediaDetailChange('X', 'username', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama realistis, hindari angka acak seperti @User123456.</p>
            </div>
            
            <div>
              <Label htmlFor="x-displayName">Display Name:</Label>
              <Input
                id="x-displayName"
                placeholder="Rina Sari"
                value={socialMediaDetails.X.displayName}
                onChange={(e) => handleSocialMediaDetailChange('X', 'displayName', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama lengkap atau panggilan.</p>
            </div>
            
            <div>
              <Label htmlFor="x-bio">Bio:</Label>
              <Textarea
                id="x-bio"
                placeholder="Pecinta kopi | Jakarta | Berbagi opini"
                maxLength={160}
                value={socialMediaDetails.X.bio}
                onChange={(e) => handleSocialMediaDetailChange('X', 'bio', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 160 karakter, tambah 1-2 emoji (☕🌆).</p>
            </div>
            
            <div>
              <Label htmlFor="x-location">Location:</Label>
              <Input
                id="x-location"
                placeholder="Jakarta, Indonesia"
                value={socialMediaDetails.X.location}
                onChange={(e) => handleSocialMediaDetailChange('X', 'location', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="x-link">Link (opsional):</Label>
              <Input
                id="x-link"
                placeholder="https://medium.com/@username"
                value={socialMediaDetails.X.link}
                onChange={(e) => handleSocialMediaDetailChange('X', 'link', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="x-birthDate">Tanggal Lahir (opsional):</Label>
              <Input
                id="x-birthDate"
                type="date"
                value={socialMediaDetails.X.birthDate}
                onChange={(e) => handleSocialMediaDetailChange('X', 'birthDate', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Umur realistis (misalnya, 25-40 tahun).</p>
            </div>
          </div>
        );
        
      case 'Instagram':
        return (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Instagram Details</h3>
            
            <div>
              <Label htmlFor="instagram-username">Username:</Label>
              <Input
                id="instagram-username"
                placeholder="@rina.sari"
                value={socialMediaDetails.Instagram.username}
                onChange={(e) => handleSocialMediaDetailChange('Instagram', 'username', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama simpel, hindari angka acak.</p>
            </div>
            
            <div>
              <Label htmlFor="instagram-displayName">Display Name:</Label>
              <Input
                id="instagram-displayName"
                placeholder="Rina Sari"
                value={socialMediaDetails.Instagram.displayName}
                onChange={(e) => handleSocialMediaDetailChange('Instagram', 'displayName', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama asli atau panggilan.</p>
            </div>
            
            <div>
              <Label htmlFor="instagram-bio">Bio:</Label>
              <Textarea
                id="instagram-bio"
                placeholder="📸 Pecinta fotografi | Jakarta | #Lifestyle"
                maxLength={150}
                value={socialMediaDetails.Instagram.bio}
                onChange={(e) => handleSocialMediaDetailChange('Instagram', 'bio', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 150 karakter, tambah emoji dan hashtag.</p>
            </div>
          </div>
        );
        
      case 'TikTok':
        return (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">TikTok Details</h3>
            
            <div>
              <Label htmlFor="tiktok-username">Username:</Label>
              <Input
                id="tiktok-username"
                placeholder="@RinaVibes"
                value={socialMediaDetails.TikTok.username}
                onChange={(e) => handleSocialMediaDetailChange('TikTok', 'username', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama kreatif, hindari pola bot.</p>
            </div>
            
            <div>
              <Label htmlFor="tiktok-displayName">Display Name:</Label>
              <Input
                id="tiktok-displayName"
                placeholder="Rina"
                value={socialMediaDetails.TikTok.displayName}
                onChange={(e) => handleSocialMediaDetailChange('TikTok', 'displayName', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama panggilan.</p>
            </div>
            
            <div>
              <Label htmlFor="tiktok-bio">Bio:</Label>
              <Textarea
                id="tiktok-bio"
                placeholder="🎥 Konten seru | Jakarta #FYP"
                maxLength={80}
                value={socialMediaDetails.TikTok.bio}
                onChange={(e) => handleSocialMediaDetailChange('TikTok', 'bio', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 80 karakter, tambah emoji.</p>
            </div>
          </div>
        );
        
      case 'Facebook':
        return (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Facebook Details</h3>
            
            <div>
              <Label htmlFor="facebook-name">Nama:</Label>
              <Input
                id="facebook-name"
                placeholder="Rina Sari"
                value={socialMediaDetails.Facebook.name}
                onChange={(e) => handleSocialMediaDetailChange('Facebook', 'name', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama lengkap realistis, hindari nama fiktif aneh.</p>
            </div>
            
            <div>
              <Label htmlFor="facebook-bio">Bio:</Label>
              <Textarea
                id="facebook-bio"
                placeholder="Hobi jalan-jalan | Jakarta"
                maxLength={101}
                value={socialMediaDetails.Facebook.bio}
                onChange={(e) => handleSocialMediaDetailChange('Facebook', 'bio', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 101 karakter.</p>
            </div>
            
            <div>
              <Label htmlFor="facebook-job">Pekerjaan:</Label>
              <Input
                id="facebook-job"
                placeholder="Marketing di PT Sejahtera"
                value={socialMediaDetails.Facebook.job}
                onChange={(e) => handleSocialMediaDetailChange('Facebook', 'job', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Jabatan realistis.</p>
            </div>
            
            <div>
              <Label htmlFor="facebook-education">Pendidikan:</Label>
              <Input
                id="facebook-education"
                placeholder="Universitas Indonesia, 2019"
                value={socialMediaDetails.Facebook.education}
                onChange={(e) => handleSocialMediaDetailChange('Facebook', 'education', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Sekolah/kuliah realistis.</p>
            </div>
            
            <div>
              <Label htmlFor="facebook-address">Alamat:</Label>
              <Input
                id="facebook-address"
                placeholder="Jakarta, Indonesia"
                value={socialMediaDetails.Facebook.address}
                onChange={(e) => handleSocialMediaDetailChange('Facebook', 'address', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Kota atau daerah.</p>
            </div>
            
            <div>
              <Label htmlFor="facebook-relationshipStatus">Status Hubungan (opsional):</Label>
              <Input
                id="facebook-relationshipStatus"
                placeholder="Lajang"
                value={socialMediaDetails.Facebook.relationshipStatus}
                onChange={(e) => handleSocialMediaDetailChange('Facebook', 'relationshipStatus', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="facebook-birthDate">Tanggal Lahir:</Label>
              <Input
                id="facebook-birthDate"
                type="date"
                value={socialMediaDetails.Facebook.birthDate}
                onChange={(e) => handleSocialMediaDetailChange('Facebook', 'birthDate', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Umur realistis (misalnya, 25-40 tahun).</p>
            </div>
          </div>
        );
        
      case 'YouTube':
        return (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">YouTube Details</h3>
            
            <div>
              <Label htmlFor="youtube-channelName">Nama Channel:</Label>
              <Input
                id="youtube-channelName"
                placeholder="Rina Vlogs"
                value={socialMediaDetails.YouTube.channelName}
                onChange={(e) => handleSocialMediaDetailChange('YouTube', 'channelName', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama personal atau tematik.</p>
            </div>
            
            <div>
              <Label htmlFor="youtube-bio">Bio:</Label>
              <Textarea
                id="youtube-bio"
                placeholder="Konten lifestyle dan opini | Jakarta"
                maxLength={1000}
                value={socialMediaDetails.YouTube.bio}
                onChange={(e) => handleSocialMediaDetailChange('YouTube', 'bio', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 1000 karakter.</p>
            </div>
          </div>
        );
        
      case 'Threads':
        return (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Threads Details</h3>
            
            <div>
              <Label htmlFor="threads-username">Username:</Label>
              <Input
                id="threads-username"
                placeholder="@rina.sari"
                value={socialMediaDetails.Threads.username}
                onChange={(e) => handleSocialMediaDetailChange('Threads', 'username', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Sinkron dengan Instagram.</p>
            </div>
            
            <div>
              <Label htmlFor="threads-displayName">Display Name:</Label>
              <Input
                id="threads-displayName"
                placeholder="Rina"
                value={socialMediaDetails.Threads.displayName}
                onChange={(e) => handleSocialMediaDetailChange('Threads', 'displayName', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama panggilan.</p>
            </div>
            
            <div>
              <Label htmlFor="threads-bio">Bio:</Label>
              <Textarea
                id="threads-bio"
                placeholder="Berbagi opini | Jakarta #Opini"
                maxLength={160}
                value={socialMediaDetails.Threads.bio}
                onChange={(e) => handleSocialMediaDetailChange('Threads', 'bio', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 160 karakter.</p>
            </div>
          </div>
        );
        
      case 'Blog':
        return (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Blog Details</h3>
            
            <div>
              <Label htmlFor="blog-authorName">Nama Penulis:</Label>
              <Input
                id="blog-authorName"
                placeholder="Rina Sari"
                value={socialMediaDetails.Blog.authorName}
                onChange={(e) => handleSocialMediaDetailChange('Blog', 'authorName', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Nama realistis.</p>
            </div>
            
            <div>
              <Label htmlFor="blog-bio">Bio:</Label>
              <Textarea
                id="blog-bio"
                placeholder="Penulis lepas, fokus politik dan lifestyle. Jakarta."
                value={socialMediaDetails.Blog.bio}
                onChange={(e) => handleSocialMediaDetailChange('Blog', 'bio', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Max 200 kata.</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderSocialMediaDetailsTabs = () => {
    if (selectedPlatforms.length === 0) {
      return (
        <div className="text-muted-foreground text-sm py-4">
          Select social media platforms to configure their details.
        </div>
      );
    }

    return (
      <Tabs defaultValue={selectedPlatforms[0]} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full flex flex-wrap">
          {selectedPlatforms.map(platform => (
            <TabsTrigger 
              key={platform} 
              value={platform}
              className="flex-grow"
            >
              {platform}
            </TabsTrigger>
          ))}
        </TabsList>
        {selectedPlatforms.map(platform => (
          <TabsContent key={platform} value={platform} className="mt-4">
            {renderSocialMediaDetailsForm(platform)}
          </TabsContent>
        ))}
      </Tabs>
    );
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
          <DialogContent className="w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Bot</DialogTitle>
              <DialogDescription>
                Create a new bot to manage your social media presence.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label htmlFor="expertise">Bot Expertise</Label>
                  <Textarea
                    id="expertise"
                    placeholder="Describe this bot's areas of expertise, tone, and style..."
                    value={botExpertise}
                    onChange={(e) => setBotExpertise(e.target.value)}
                    rows={4}
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
                                if (!activeTab) {
                                  setActiveTab(platform);
                                }
                              } else {
                                setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                                if (activeTab === platform) {
                                  const remainingPlatforms = selectedPlatforms.filter(p => p !== platform);
                                  setActiveTab(remainingPlatforms.length > 0 ? remainingPlatforms[0] : '');
                                }
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
                            className="mt-1"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 py-4">
                <h2 className="text-lg font-semibold">Social Media Details</h2>
                {renderSocialMediaDetailsTabs()}
              </div>
            </div>
            <DialogFooter className="mt-4">
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

      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpenChange}>
        <DialogContent className="w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bot</DialogTitle>
            <DialogDescription>
              Update this bot's information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="edit-expertise">Bot Expertise</Label>
                <Textarea
                  id="edit-expertise"
                  placeholder="Describe this bot's areas of expertise, tone, and style..."
                  value={botExpertise}
                  onChange={(e) => setBotExpertise(e.target.value)}
                  rows={4}
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
                              if (!activeTab) {
                                setActiveTab(platform);
                              }
                            } else {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                              if (activeTab === platform) {
                                const remainingPlatforms = selectedPlatforms.filter(p => p !== platform);
                                setActiveTab(remainingPlatforms.length > 0 ? remainingPlatforms[0] : '');
                              }
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
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 py-4">
              <h2 className="text-lg font-semibold">Social Media Details</h2>
              {renderSocialMediaDetailsTabs()}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-buzzer-primary" onClick={handleEditBot}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <Dialog open={isDetailDialogOpen} onOpenChange={handleDetailDialogOpenChange}>
        <DialogContent className="w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
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
              
              {currentBot.expertise && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Expertise</h3>
                  <p className="mt-1">{currentBot.expertise}</p>
                </div>
              )}
              
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
