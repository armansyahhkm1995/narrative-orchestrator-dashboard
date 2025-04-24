
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus, Plus, Trash2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
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
import { toast } from 'sonner';
import { CampaignType } from '@/types/data';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Folder name must be at least 3 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  campaignType: z.enum(['post', 'reply']),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFolderDialog = ({ open, onOpenChange }: CreateFolderDialogProps) => {
  const { addCampaignFolder } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaignType, setCampaignType] = useState<CampaignType>('post');
  const [commentUrls, setCommentUrls] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      campaignType: 'post',
    },
  });
  
  const handleCampaignTypeChange = (value: CampaignType) => {
    setCampaignType(value);
    form.setValue('campaignType', value);
  };
  
  const addCommentUrl = () => {
    setCommentUrls([...commentUrls, '']);
  };
  
  const updateCommentUrl = (index: number, value: string) => {
    const updatedUrls = [...commentUrls];
    updatedUrls[index] = value;
    setCommentUrls(updatedUrls);
  };
  
  const removeCommentUrl = (index: number) => {
    const updatedUrls = [...commentUrls];
    updatedUrls.splice(index, 1);
    setCommentUrls(updatedUrls);
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when dialog closes
      form.reset();
      setCommentUrls([]);
      setCampaignType('post');
    }
    onOpenChange(open);
  };
  
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Filter out empty comment URLs
      const filteredCommentUrls = commentUrls.filter(url => url.trim() !== '');
      
      addCampaignFolder({
        name: data.name,
        description: data.description,
        campaignType: data.campaignType,
        commentUrls: data.campaignType === 'reply' ? filteredCommentUrls : undefined,
      });
      
      form.reset();
      setCommentUrls([]);
      setCampaignType('post');
      onOpenChange(false);
      toast.success('Campaign folder created successfully');
    } catch (error) {
      toast.error('Failed to create campaign folder');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-purple-600" />
            Create Campaign Folder
          </DialogTitle>
          <DialogDescription>
            Create a new folder to organize your campaigns
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Information */}
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Folder Campaign</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Product Launch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the campaign folder"
                          className="resize-none min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="campaignType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Type</FormLabel>
                      <Select 
                        onValueChange={(value: CampaignType) => handleCampaignTypeChange(value)} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campaign type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="post">Post Campaign</SelectItem>
                          <SelectItem value="reply">Reply Campaign</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4 md:hidden">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Create Folder
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
          
          {/* Comment URLs for Reply Campaigns */}
          {campaignType === 'reply' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Comment URLs</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addCommentUrl}
                  className="gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add URL
                </Button>
              </div>
              
              {commentUrls.length === 0 ? (
                <div className="border rounded-md p-4 bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground">
                    No comment URLs added yet. Add URLs for your reply campaign.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {commentUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        placeholder="e.g., https://twitter.com/user/status/123" 
                        value={url}
                        onChange={(e) => updateCommentUrl(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCommentUrl(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-4 hidden md:flex">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
