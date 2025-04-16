
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarClock, Check, AlertTriangle, Info } from 'lucide-react';

// Sample notification data
const notifications = [
  {
    id: 1,
    title: 'High engagement on "Smartphone X Release"',
    description: 'Campaign hit 1,000+ likes',
    time: '2 hours ago',
    icon: Check,
    read: true,
    type: 'success'
  },
  {
    id: 2,
    title: 'Positive sentiment spike',
    description: 'Ocean Cleanup campaign is trending positively',
    time: '5 hours ago',
    icon: Info,
    read: true,
    type: 'info'
  },
  {
    id: 3,
    title: 'New bot assignment required',
    description: 'FitnessFanatic bot is now available',
    time: '1 day ago',
    icon: AlertTriangle,
    read: false,
    type: 'warning'
  },
  {
    id: 4,
    title: 'Weekly campaign report available',
    description: 'Your campaign performance summary is ready to view',
    time: '2 days ago',
    icon: CalendarClock,
    read: false,
    type: 'info'
  },
  {
    id: 5,
    title: 'Campaign goal reached',
    description: '"Eco-friendly products" campaign reached 50,000 impressions',
    time: '3 days ago',
    icon: Check,
    read: true,
    type: 'success'
  },
  {
    id: 6,
    title: 'Content approval needed',
    description: 'New content waiting for your review before scheduling',
    time: '4 days ago',
    icon: AlertTriangle,
    read: true,
    type: 'warning'
  }
];

const Notifications = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Notifications</h1>
          <p className="text-muted-foreground mt-2">View and manage your notifications</p>
        </div>
        <div>
          <button className="text-buzzer-primary font-medium">Mark all as read</button>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`overflow-hidden ${!notification.read ? 'border-l-4 border-l-buzzer-primary' : ''}`}>
            <CardContent className="p-4 flex gap-4 items-start">
              <div className={`p-2 rounded-full ${
                notification.type === 'success' ? 'bg-green-100 text-green-600' : 
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                <notification.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <p className="text-muted-foreground text-sm">{notification.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">{notification.time}</p>
                  {!notification.read && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">New</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
