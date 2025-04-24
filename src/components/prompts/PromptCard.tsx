
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";

interface PromptCardProps {
  expertise: string;
  topic: string;
  counterPrompt: string;
  createdAt: string;
  isNew: boolean;
}

export function PromptCard({ expertise, topic, counterPrompt, createdAt, isNew }: PromptCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold">{expertise}</h3>
            {isNew && <Badge className="bg-green-500">New</Badge>}
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(createdAt), "MMM d, yyyy")}
          </span>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{topic}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{counterPrompt}</p>
      </CardContent>
    </Card>
  );
}
