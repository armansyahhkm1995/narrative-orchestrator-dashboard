
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useData } from '@/context/DataContext';
import { PlusCircle } from 'lucide-react';
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

const formSchema = z.object({
  name: z.string().min(3, { message: 'Campaign name must be at least 3 characters' }),
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters' }),
  narrative: z.string().min(10, { message: 'Narrative must be at least 10 characters' }),
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
  
  return (
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
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sustainable Products" {...field} />
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
                  <FormLabel>Narrative</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the narrative this campaign should follow..."
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
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
  );
};

export default CreateCampaignDialog;
