import { useState, useEffect } from 'react';
import { Plus, Filter, Calendar, Check, CheckSquare, Zap, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data for expertise/professions
const expertiseOptions = [
  "Farmer", 
  "Doctor", 
  "Engineer", 
  "Teacher", 
  "Lawyer", 
  "Software Developer", 
  "Journalist"
];

// Sample topics per expertise
const topicsByExpertise = {
  "Farmer": ["IoT in Rice Monitoring", "Organic Farming Techniques", "Sustainable Agriculture"],
  "Doctor": ["Telemedicine Adoption", "Modern Surgical Techniques", "Preventive Healthcare"],
  "Engineer": ["Renewable Energy", "Smart Home Technologies", "Infrastructure Development"],
  "Teacher": ["Online Learning Methods", "Classroom Management", "Educational Technology"],
  "Lawyer": ["Digital Rights", "Environmental Law", "Criminal Justice Reform"],
  "Software Developer": ["AI Ethics", "Cloud Computing", "Open Source Software"],
  "Journalist": ["Media Bias", "Digital Journalism", "Investigative Techniques"]
};

// Sample data for counter prompts
const initialCounterPrompts = [
  {
    id: '1',
    expertise: 'Farmer',
    topic: 'IoT in Rice Monitoring',
    counterPrompt: 'While IoT promises efficiency, rural infrastructure limitations severely restrict its practical implementation.',
    createdAt: '2025-04-10T10:30:00Z',
    isNew: false
  },
  {
    id: '2',
    expertise: 'Farmer',
    topic: 'IoT in Rice Monitoring',
    counterPrompt: 'The cost of IoT sensors is prohibitive for most small-scale farmers, widening the economic gap between rich and poor agricultural communities.',
    createdAt: '2025-04-15T13:45:00Z',
    isNew: false
  },
  {
    id: '3',
    expertise: 'Doctor',
    topic: 'Telemedicine Adoption',
    counterPrompt: 'Telemedicine cannot replace the necessity of physical examination for accurate diagnosis of many conditions.',
    createdAt: '2025-04-18T09:20:00Z',
    isNew: false
  },
  {
    id: '4',
    expertise: 'Software Developer',
    topic: 'AI Ethics',
    counterPrompt: 'Current AI systems perpetuate societal biases because they are trained on historically biased datasets.',
    createdAt: '2025-04-22T11:15:00Z',
    isNew: true
  }
];

interface CounterPrompt {
  id: string;
  expertise: string;
  topic: string;
  counterPrompt: string;
  createdAt: string;
  isNew: boolean;
}

interface GeneratedCounter {
  id: string;
  counterPrompt: string;
  selected: boolean;
}

const PromptManagement = () => {
  const { toast } = useToast();
  const [counterPrompts, setCounterPrompts] = useState<CounterPrompt[]>(initialCounterPrompts);
  const [selectedExpertise, setSelectedExpertise] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [isAddCommentOpen, setIsAddCommentOpen] = useState(false);
  const [commentUrl, setCommentUrl] = useState("");
  const [commentText, setCommentText] = useState("");
  const [generatedCounters, setGeneratedCounters] = useState<GeneratedCounter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Update available topics when expertise changes
  useEffect(() => {
    if (selectedExpertise) {
      setAvailableTopics(topicsByExpertise[selectedExpertise as keyof typeof topicsByExpertise] || []);
      setSelectedTopic("");
    } else {
      setAvailableTopics([]);
    }
  }, [selectedExpertise]);
  
  // Filter counter prompts based on selected filters
  const filteredPrompts = counterPrompts.filter(prompt => {
    // Filter by expertise
    if (selectedExpertise && prompt.expertise !== selectedExpertise) {
      return false;
    }
    
    // Filter by topic
    if (selectedTopic && prompt.topic !== selectedTopic) {
      return false;
    }
    
    // Filter by date
    if (selectedDate) {
      const promptDate = new Date(prompt.createdAt);
      return (
        promptDate.getDate() === selectedDate.getDate() &&
        promptDate.getMonth() === selectedDate.getMonth() &&
        promptDate.getFullYear() === selectedDate.getFullYear()
      );
    }
    
    return true;
  });

  // Count new items for each expertise
  const newCountersByExpertise = expertiseOptions.map(expertise => ({
    expertise,
    count: counterPrompts.filter(p => p.expertise === expertise && p.isNew).length
  }));

  // Generate counter prompts based on comment
  const handleGenerateCounters = () => {
    if (!commentText.trim()) {
      toast({
        title: "Error",
        description: "Comment text cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation with a timeout
    setTimeout(() => {
      // Mock generated counters
      const mockCounters = [
        {
          id: `gen-${Date.now()}-1`,
          counterPrompt: "While technology adoption is important, the learning curve for many farmers is steep and requires significant training resources.",
          selected: false
        },
        {
          id: `gen-${Date.now()}-2`,
          counterPrompt: "The reliability of IoT sensors in harsh agricultural environments is questionable, leading to potential data inaccuracies.",
          selected: false
        },
        {
          id: `gen-${Date.now()}-3`,
          counterPrompt: "Implementation costs often outweigh short-term benefits for small-scale farmers, making adoption economically unfeasible.",
          selected: false
        }
      ];
      
      setGeneratedCounters(mockCounters);
      setIsGenerating(false);
      
      toast({
        title: "Counters Generated",
        description: "Successfully generated counter arguments."
      });
    }, 1500);
  };

  // Toggle selection for individual counter
  const toggleCounterSelection = (id: string) => {
    setGeneratedCounters(prevCounters =>
      prevCounters.map(counter =>
        counter.id === id ? { ...counter, selected: !counter.selected } : counter
      )
    );
  };

  // Toggle selection for all counters
  const toggleAllCounters = () => {
    const allSelected = generatedCounters.every(counter => counter.selected);
    setGeneratedCounters(prevCounters =>
      prevCounters.map(counter => ({ ...counter, selected: !allSelected }))
    );
  };

  // Add selected counters to prompt management
  const addSelectedCountersToPromptManagement = () => {
    const selectedCounters = generatedCounters.filter(counter => counter.selected);
    
    if (selectedCounters.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one counter to add.",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date().toISOString();
    
    // Let's assume the detected expertise is "Farmer" and topic is "IoT in Rice Monitoring"
    // In a real application, this would be determined by an AI
    const detectedExpertise = "Farmer";
    const detectedTopic = "IoT in Rice Monitoring";
    
    const newCounterPrompts = selectedCounters.map(counter => ({
      id: counter.id,
      expertise: detectedExpertise,
      topic: detectedTopic,
      counterPrompt: counter.counterPrompt,
      createdAt: now,
      isNew: true
    }));
    
    setCounterPrompts(prev => [...newCounterPrompts, ...prev]);
    setIsAddCommentOpen(false);
    setCommentUrl("");
    setCommentText("");
    setGeneratedCounters([]);
    
    toast({
      title: "Counters Added",
      description: `Added ${selectedCounters.length} counter prompts to the library.`
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedExpertise("");
    setSelectedTopic("");
    setSelectedDate(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Prompt Management</h1>
        <Button onClick={() => setIsAddCommentOpen(true)} className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4" />
          Add New Comment
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Expertise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expertise</SelectItem>
              {expertiseOptions.map((expertise) => (
                <SelectItem key={expertise} value={expertise}>
                  <div className="flex items-center justify-between w-full">
                    <span>{expertise}</span>
                    {newCountersByExpertise.find(e => e.expertise === expertise)?.count > 0 && (
                      <Badge className="ml-2 bg-green-500">New</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select 
            value={selectedTopic} 
            onValueChange={setSelectedTopic}
            disabled={!selectedExpertise || availableTopics.length === 0}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {availableTopics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(selectedExpertise || selectedTopic || selectedDate) && (
          <Button variant="ghost" onClick={clearFilters} className="h-10">
            Clear Filters
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expertise</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead className="w-[50%]">Counter Prompt</TableHead>
              <TableHead>Date Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No counter prompts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPrompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {prompt.expertise}
                      {prompt.isNew && <Badge className="bg-green-500">New</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{prompt.topic}</TableCell>
                  <TableCell>{prompt.counterPrompt}</TableCell>
                  <TableCell>{format(new Date(prompt.createdAt), 'PPP')}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Comment Modal */}
      <Dialog open={isAddCommentOpen} onOpenChange={setIsAddCommentOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Comment for Counter Generation</DialogTitle>
            <DialogDescription>
              Enter a comment URL and text to generate counter arguments.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="comment-url" className="text-sm font-medium">
                  Comment URL
                </label>
                <Input
                  id="comment-url"
                  value={commentUrl}
                  onChange={(e) => setCommentUrl(e.target.value)}
                  placeholder="https://x.com/comment/1234"
                />
              </div>
              
              <div>
                <label htmlFor="comment-text" className="text-sm font-medium">
                  Comment Text
                </label>
                <Textarea
                  id="comment-text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter the comment text here..."
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={handleGenerateCounters} 
                className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
                disabled={isGenerating || !commentText.trim()}
              >
                <Zap className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Counter Arguments"}
              </Button>
            </div>

            {generatedCounters.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Generated Counter Arguments
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="select-all" 
                        checked={generatedCounters.every(c => c.selected)}
                        onCheckedChange={toggleAllCounters}
                      />
                      <label htmlFor="select-all" className="text-sm">
                        Select All
                      </label>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedCounters.map((counter) => (
                      <div key={counter.id} className="flex items-start gap-3 pb-3 border-b">
                        <Checkbox
                          id={counter.id}
                          checked={counter.selected}
                          onCheckedChange={() => toggleCounterSelection(counter.id)}
                          className="mt-1"
                        />
                        <label htmlFor={counter.id} className="text-sm">
                          {counter.counterPrompt}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setIsAddCommentOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addSelectedCountersToPromptManagement}
              disabled={generatedCounters.filter(c => c.selected).length === 0}
              className="gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <CheckSquare className="h-4 w-4" />
              Add to Prompt Management
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromptManagement;
