import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Prompt } from '@/types/data';
import { 
  BookText, 
  Search, 
  Filter, 
  Calendar, 
  Trash, 
  Edit, 
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface PromptManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPrompt?: (promptContent: string) => void;
}

const PromptManagementDialog = ({ open, onOpenChange, onSelectPrompt }: PromptManagementDialogProps) => {
  const { prompts, campaignFolders, deletePrompt } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  
  // Filter prompts based on search and filters
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = searchTerm === '' || 
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFolder = selectedFolder === 'all' || 
      (prompt.campaignId && campaignFolders.some(folder => 
        folder.campaigns.some(campaign => 
          campaign.id === prompt.campaignId && folder.id === selectedFolder
        )
      ));
      
    const matchesSentiment = selectedSentiment === 'all' || 
      prompt.sentiment === selectedSentiment;
      
    return matchesSearch && matchesFolder && matchesSentiment;
  });
  
  // Handle prompt selection for campaign
  const handleSelectPrompt = (prompt: Prompt) => {
    if (onSelectPrompt) {
      onSelectPrompt(prompt.content);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookText className="h-5 w-5 text-purple-600" />
            Prompt Management
          </DialogTitle>
          <DialogDescription>
            Browse and manage prompt templates for your campaigns
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Campaign Folder</h4>
                    <Select 
                      value={selectedFolder} 
                      onValueChange={setSelectedFolder}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Folders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Folders</SelectItem>
                        {campaignFolders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Sentiment</h4>
                    <Select 
                      value={selectedSentiment} 
                      onValueChange={setSelectedSentiment}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Sentiments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sentiments</SelectItem>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            {filteredPrompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <BookText className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium text-muted-foreground">No prompts found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPrompts.map((prompt) => (
                  <div 
                    key={prompt.id} 
                    className="border rounded-lg p-3 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{prompt.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prompt.category.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onSelectPrompt && (
                            <DropdownMenuItem 
                              onClick={() => handleSelectPrompt(prompt)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Use in Campaign
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this prompt?')) {
                                deletePrompt(prompt.id);
                                toast.success('Prompt deleted successfully');
                              }
                            }}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {prompt.content}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(prompt.createdAt), 'MMM d, yyyy')}
                        </span>
                        <span className={`flex items-center ${
                          prompt.sentiment === 'positive' ? 'text-green-600' : 
                          prompt.sentiment === 'negative' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {prompt.sentiment === 'positive' ? '😊' : 
                           prompt.sentiment === 'negative' ? '😠' : '😐'}
                          {prompt.sentiment.charAt(0).toUpperCase() + prompt.sentiment.slice(1)}
                        </span>
                      </div>
                      
                      {prompt.campaignId && (
                        <span className="flex items-center">
                          Used in campaign
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptManagementDialog;
