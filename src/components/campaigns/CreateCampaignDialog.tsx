
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useData } from '@/context/DataContext';
import { PlusCircle, Bot, Sparkles, BookMarked, Link } from 'lucide-react';
import { SocialMediaPlatform } from '@/types/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import PromptManagementDialog from './PromptManagementDialog';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Campaign name must be at least 3 characters' }),
  topic: z.string().min(3, { message: 'Topic/URL must be at least 3 characters' }),
  narrative: z.string().min(10, { message: 'Narrative diversion must be at least 10 characters' }),
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  bots: z.array(z.string()).min(1, { message: 'Select at least one bot' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCampaignDialogProps {
  folderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCampaignDialog = ({ folderId, open, onOpenChange }: CreateCampaignDialogProps) => {
  const { bots, campaignFolders, addCampaign } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBots, setSelectedBots] = useState<string[]>([]);
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [isPromptManagementOpen, setIsPromptManagementOpen] = useState(false);
  
  const folder = folderId ? campaignFolders.find(f => f.id === folderId) : null;
  const isReplyType = folder?.campaignType === 'reply';
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      topic: '',
      narrative: '',
      sentiment: 'neutral',
      bots: [],
    },
  });
  
  useEffect(() => {
    form.setValue('bots', selectedBots);
  }, [selectedBots, form]);
  
  const onSubmit = (data: FormValues) => {
    if (!folderId) {
      toast.error('No folder selected');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addCampaign(folderId, {
        name: data.name,
        topic: data.topic,
        narrative: data.narrative,
        sentiment: data.sentiment,
        bots: data.bots,
      });
      
      form.reset();
      setSelectedBots([]);
      onOpenChange(false);
      toast.success('Campaign created successfully');
    } catch (error) {
      toast.error('Failed to create campaign');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get folder name for display
  const folderName = folderId 
    ? campaignFolders.find(f => f.id === folderId)?.name 
    : 'Unknown Folder';
  
  const handleSelectBot = (botId: string) => {
    setSelectedBots((prev) => {
      if (prev.includes(botId)) {
        return prev.filter(id => id !== botId);
      } else {
        return [...prev, botId];
      }
    });
  };

  // Generate a counter narrative based on the topic
  const generateCounterNarrative = () => {
    const topic = form.getValues('topic');
    
    if (!topic || topic.length < 3) {
      toast.error('Please enter a valid topic first');
      return;
    }
    
    setIsGeneratingNarrative(true);
    
    // Simulate AI generation with a timeout
    setTimeout(() => {
      // Example generated counter narratives based on topic keywords
      let generatedNarrative = '';
      
      if (topic.toLowerCase().includes('climate')) {
        generatedNarrative = "While climate concerns are valid, we need to focus on balanced approaches that don't harm economic growth. Our narrative should emphasize innovation and market-based solutions rather than restrictive regulations, highlighting how technological advancement can address environmental challenges without sacrificing prosperity.";
      } else if (topic.toLowerCase().includes('tech') || topic.toLowerCase().includes('technology')) {
        generatedNarrative = "Instead of viewing technology as problematic, we should redirect the conversation toward responsible innovation. Our counter-narrative emphasizes the benefits of technological advancements in healthcare, education, and quality of life, while acknowledging concerns and proposing industry-led ethical frameworks rather than heavy-handed regulation.";
      } else if (topic.toLowerCase().includes('health') || topic.toLowerCase().includes('healthcare')) {
        generatedNarrative = "Rather than focusing on healthcare system failures, our narrative should highlight innovation and patient choice. We'll emphasize successful treatments, breakthrough research, and how a diverse healthcare ecosystem offers more options than one-size-fits-all approaches, while acknowledging improvement areas through market-based solutions.";
      } else {
        generatedNarrative = `While public discourse on ${topic} often focuses on problems, our narrative should redirect toward solutions and positive developments. We'll emphasize progress, balanced perspectives, and constructive approaches that acknowledge complexity while offering optimistic, action-oriented messaging that inspires rather than divides.`;
      }
      
      form.setValue('narrative', generatedNarrative);
      setIsGeneratingNarrative(false);
      toast.success('Counter narrative generated');
    }, 1500);
  };

  // Handle selecting a prompt from prompt management
  const handleSelectPrompt = (promptContent: string) => {
    form.setValue('narrative', promptContent);
    setIsPromptManagementOpen(false);
    toast.success('Prompt applied to narrative');
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-purple-600" />
              Create New Campaign
            </DialogTitle>
            <DialogDescription>
              Create a new campaign in the folder: {folderName}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer Product Launch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isReplyType ? (
                        <span className="flex items-center gap-1">
                          <Link className="h-4 w-4" />
                          Comment URL
                        </span>
                      ) : 'Topic'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={isReplyType ? "https://platform.com/post/comment" : "e.g., Sustainable Products"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="narrative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Narrative Diversion</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the narrative this campaign should counter the topic above..."
                          className="resize-none min-h-[100px] pr-20" 
                          {...field} 
                        />
                      </FormControl>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                          onClick={generateCounterNarrative}
                          disabled={isGeneratingNarrative}
                          title="Generate counter narrative with AI"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                          onClick={() => setIsPromptManagementOpen(true)}
                          title="Prompt management"
                        >
                          <BookMarked className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
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
              
              <FormField
                control={form.control}
                name="bots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Bots</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {selectedBots.length > 0 
                              ? `${selectedBots.length} bot${selectedBots.length > 1 ? 's' : ''} selected` 
                              : 'Select bots'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <div className="p-4 space-y-2">
                          {bots.length > 0 ? (
                            bots.map((bot) => (
                              <div key={bot.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`bot-${bot.id}`} 
                                  checked={selectedBots.includes(bot.id)}
                                  onCheckedChange={() => handleSelectBot(bot.id)}
                                />
                                <label
                                  htmlFor={`bot-${bot.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center"
                                >
                                  {bot.name}
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({bot.platforms.join(', ')})
                                  </span>
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground py-2">
                              No bots available. Create bots first.
                            </p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !folderId}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create Campaign
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <PromptManagementDialog
        open={isPromptManagementOpen}
        onOpenChange={setIsPromptManagementOpen}
        onSelectPrompt={handleSelectPrompt}
      />
    </>
  );
};

export default CreateCampaignDialog;
