
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Enhanced activity data with folder, topic, and narrative information
const recentActivities = [
  {
    id: 1,
    bot: 'EcoWarrior',
    action: 'Posted on X',
    campaign: 'Ocean Cleanup',
    folder: 'Environmental Initiatives',
    topic: 'Ocean Pollution',
    narrative: 'Raise awareness about plastic pollution',
    time: '10 minutes ago'
  },
  {
    id: 2,
    bot: 'TechEnthusiast',
    action: 'Posted on YouTube',
    campaign: 'Smartphone X Release',
    folder: 'Tech Products',
    topic: 'New Technology',
    narrative: 'Highlight innovative features',
    time: '45 minutes ago'
  },
  {
    id: 3,
    bot: 'FitnessFanatic',
    action: 'Posted on Instagram',
    campaign: 'Summer Fitness Challenge',
    folder: 'Health & Wellness',
    topic: 'Fitness Trends',
    narrative: 'Motivate healthy lifestyle choices',
    time: '1 hour ago'
  },
  {
    id: 4,
    bot: 'EcoWarrior',
    action: 'Received 50+ likes on Facebook',
    campaign: 'Ocean Cleanup',
    folder: 'Environmental Initiatives',
    topic: 'Ocean Pollution',
    narrative: 'Raise awareness about plastic pollution',
    time: '3 hours ago'
  },
  {
    id: 5,
    bot: 'TechEnthusiast',
    action: 'Received 10+ comments on Blog',
    campaign: 'Smartphone X Release',
    folder: 'Tech Products',
    topic: 'New Technology',
    narrative: 'Highlight innovative features',
    time: '5 hours ago'
  }
];

const RecentActivity = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest bot actions and engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="h-8 w-8 rounded-full bg-buzzer-primary flex items-center justify-center text-white text-xs font-medium">
                {activity.bot.substring(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex items-center">
                    <span className="text-xs text-buzzer-secondary mr-2">Bot:</span>
                    <span className="text-xs font-medium">{activity.bot}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-buzzer-secondary mr-2">Campaign:</span>
                    <span className="text-xs font-medium">{activity.campaign}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-buzzer-secondary mr-2">Folder:</span>
                    <span className="text-xs font-medium">{activity.folder}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-buzzer-secondary mr-2">Topic:</span>
                    <span className="text-xs font-medium">{activity.topic}</span>
                  </div>
                </div>
                <div className="mt-1">
                  <span className="text-xs text-buzzer-secondary mr-2">Narrative:</span>
                  <span className="text-xs">{activity.narrative}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
