
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useData } from '@/context/DataContext';
import { Prompt } from '@/types/data';
import { BookMarked, Plus, Search, Calendar, Tag, Trash, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

const createPromptSchema = z.object({
  name: z.string().min(3, { message: 'Prompt name must be at least 3 characters' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters' }),
  category: z.array(z.string()).min(1, { message: 'Select at least one category' }),
  sentiment: z.enum(['positive', 'negative', 'neutral']),
});

type CreatePromptValues = z.infer<typeof createPromptSchema>;

const searchPromptSchema = z.object({
  query: z.string().optional(),
  folder: z.string().optional(),
  dateRange: z.enum(['day', 'week', 'month', 'year', 'all']).default('all'),
});

type SearchPromptValues = z.infer<typeof searchPromptSchema>;

interface PromptManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPrompt: (promptContent: string) => void;
}

const PromptManagementDialog = ({ open, onOpenChange, onSelectPrompt }: PromptManagementDialogProps) => {
  const { prompts, campaignFolders, addPrompt, deletePrompt } = useData();
  const [activeTab, setActiveTab] = useState('search');
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const createForm = useForm<CreatePromptValues>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      name: '',
      content: '',
      category: [],
      sentiment: 'neutral',
    },
  });
  
  const searchForm = useForm<SearchPromptValues>({
    resolver: zodResolver(searchPromptSchema),
    defaultValues: {
      query: '',
      folder: '',
      dateRange: 'all',
    },
  });
  
  // Update selected categories when they change
  useEffect(() => {
    createForm.setValue('category', selectedCategories);
  }, [selectedCategories, createForm]);
  
  // Filter prompts when search criteria change
  useEffect(() => {
    const searchValues = searchForm.getValues();
    let filtered = [...prompts];
    
    // Filter by search query
    if (searchValues.query) {
      const lowerQuery = searchValues.query.toLowerCase();
      filtered = filtered.filter(prompt => 
        prompt.name.toLowerCase().includes(lowerQuery) || 
        prompt.content.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by campaign folder
    if (searchValues.folder) {
      filtered = filtered.filter(prompt => 
        prompt.campaignId ? 
        campaignFolders.some(folder => 
          folder.campaigns.some(campaign => 
            campaign.id === prompt.campaignId && folder.id === searchValues.folder
          )
        ) : false
      );
    }
    
    // Filter by date range
    if (searchValues.dateRange !== 'all') {
      const now = new Date();
      let compareDate = new Date();
      
      switch (searchValues.dateRange) {
        case 'day':
          compareDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          compareDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          compareDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          compareDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(prompt => 
        new Date(prompt.createdAt) >= compareDate
      );
    }
    
    setFilteredPrompts(filtered);
  }, [prompts, searchForm, campaignFolders]);
  
  const onCreateSubmit = (data: CreatePromptValues) => {
    setIsCreating(true);
    
    try {
      addPrompt({
        name: data.name,
        content: data.content,
        category: data.category,
        sentiment: data.sentiment,
      });
      
      createForm.reset();
      setSelectedCategories([]);
      setActiveTab('search');
      toast.success('Prompt created successfully');
    } catch (error) {
      toast.error('Failed to create prompt');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };
  
  const onSearchSubmit = (data: SearchPromptValues) => {
    // Search is handled by the useEffect above
    // This just prevents the form from refreshing the page
  };
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const handleDeletePrompt = (id: string) => {
    try {
      deletePrompt(id);
      toast.success('Prompt deleted successfully');
    } catch (error) {
      toast.error('Failed to delete prompt');
      console.error(error);
    }
  };
  
  // Common categories for narrative prompts
  const commonCategories = [
    'Politics', 'Technology', 'Environment', 'Health', 'Economy', 
    'Education', 'Entertainment', 'Sports', 'Social Media'
  ];
  
  // Find the campaign name for a prompt
  const getCampaignInfo = (promptId: string) => {
    for (const folder of campaignFolders) {
      for (const campaign of folder.campaigns) {
        if (campaign.id === promptId) {
          return {
            campaignName: campaign.name,
            folderName: folder.name
          };
        }
      }
    }
    return null;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-purple-600" />
            Prompt Management
          </DialogTitle>
          <DialogDescription>
            Create, search, and manage narrative prompts for your campaigns
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Prompts</TabsTrigger>
            <TabsTrigger value="create">Create New Prompt</TabsTrigger>
          </TabsList>
          
          {/* Search Prompts Tab */}
          <TabsContent value="search" className="space-y-4">
            <Form {...searchForm}>
              <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="space-y-4">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <FormField
                    control={searchForm.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="Search prompts..."
                              className="pl-8"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                searchForm.handleSubmit(onSearchSubmit)();
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={searchForm.control}
                    name="folder"
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-48">
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            searchForm.handleSubmit(onSearchSubmit)();
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All folders" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All folders</SelectItem>
                            {campaignFolders.map(folder => (
                              <SelectItem key={folder.id} value={folder.id}>
                                {folder.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={searchForm.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-40">
                        <Select
                          onValueChange={(value: any) => {
                            field.onChange(value);
                            searchForm.handleSubmit(onSearchSubmit)();
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <Calendar className="mr-2 h-4 w-4" />
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All time</SelectItem>
                            <SelectItem value="day">Past day</SelectItem>
                            <SelectItem value="week">Past week</SelectItem>
                            <SelectItem value="month">Past month</SelectItem>
                            <SelectItem value="year">Past year</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
            
            <Separator />
            
            <div className="space-y-4">
              {filteredPrompts.length > 0 ? (
                filteredPrompts.map(prompt => (
                  <div key={prompt.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{prompt.name}</h4>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSelectPrompt(prompt.content)}
                          className="h-8 w-8"
                          title="Use this prompt"
                        >
                          <Heart className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="h-8 w-8"
                          title="Delete prompt"
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{prompt.content}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className={`
                        ${prompt.sentiment === 'positive' ? 'bg-green-50 text-green-700' : ''}
                        ${prompt.sentiment === 'negative' ? 'bg-red-50 text-red-700' : ''}
                        ${prompt.sentiment === 'neutral' ? 'bg-blue-50 text-blue-700' : ''}
                      `}>
                        {prompt.sentiment}
                      </Badge>
                      
                      {prompt.category.map(cat => (
                        <Badge key={cat} variant="secondary" className="bg-gray-100">
                          {cat}
                        </Badge>
                      ))}
                      
                      <span className="text-xs text-muted-foreground ml-auto flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(prompt.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    {prompt.campaignId && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {getCampaignInfo(prompt.campaignId) ? (
                          <p>
                            Used in campaign: <span className="font-medium">{getCampaignInfo(prompt.campaignId)?.campaignName}</span> 
                            <span> ({getCampaignInfo(prompt.campaignId)?.folderName})</span>
                          </p>
                        ) : (
                          <p>Used in campaign: Unknown</p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">No prompts found</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    {searchForm.getValues().query || searchForm.getValues().folder || searchForm.getValues().dateRange !== 'all' 
                      ? 'Try adjusting your search criteria'
                      : 'Create your first prompt to get started'}
                  </p>
                  {(searchForm.getValues().query || searchForm.getValues().folder || searchForm.getValues().dateRange !== 'all') ? (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        searchForm.reset({
                          query: '',
                          folder: '',
                          dateRange: 'all',
                        });
                        searchForm.handleSubmit(onSearchSubmit)();
                      }}
                    >
                      Clear filters
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setActiveTab('create')}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Create Prompt
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Create New Prompt Tab */}
          <TabsContent value="create">
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Environmental Policy Counter-Narrative"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your narrative diversion content..."
                          className="resize-none min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {commonCategories.map(category => (
                          <Badge
                            key={category}
                            variant={selectedCategories.includes(category) ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedCategories.includes(category) 
                                ? 'bg-purple-600 hover:bg-purple-700' 
                                : 'hover:bg-purple-100'
                            }`}
                            onClick={() => handleCategoryToggle(category)}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {category}
                          </Badge>
                        ))}
                      </div>
                      {createForm.formState.errors.category && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {createForm.formState.errors.category.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="sentiment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sentiment</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sentiment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4 space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      createForm.reset();
                      setSelectedCategories([]);
                      setActiveTab('search');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isCreating ? 'Creating...' : 'Create Prompt'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PromptManagementDialog;
