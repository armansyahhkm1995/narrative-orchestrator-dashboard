
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EngagementData {
  date: string;
  likes: number;
  shares: number;
  comments: number;
}

interface EngagementChartProps {
  data: EngagementData[];
}

const EngagementChart: React.FC<EngagementChartProps> = ({ data }) => {
  // Date formatting function
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Prepare data for different time periods (for demonstration purposes)
  const dailyData = data;
  
  // Create weekly data by aggregating daily data
  const weeklyData = [];
  for (let i = 0; i < dailyData.length; i += 7) {
    const weekData = dailyData.slice(i, i + 7).reduce(
      (acc, curr) => {
        acc.likes += curr.likes;
        acc.shares += curr.shares;
        acc.comments += curr.comments;
        return acc;
      },
      { date: dailyData[i].date, likes: 0, shares: 0, comments: 0 }
    );
    weeklyData.push(weekData);
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Engagement Overview</CardTitle>
        <CardDescription>Track likes, shares, and comments across your campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  style={{ fontSize: '12px' }}
                />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip 
                  formatter={(value) => [`${value}`, '']}
                  labelFormatter={(label) => formatDate(label as string)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Likes"
                />
                <Line
                  type="monotone"
                  dataKey="shares"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Shares"
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Comments"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="weekly" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => `Week of ${formatDate(date)}`}
                  style={{ fontSize: '12px' }}
                />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip 
                  formatter={(value) => [`${value}`, '']}
                  labelFormatter={(label) => `Week of ${formatDate(label as string)}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Likes"
                />
                <Line
                  type="monotone"
                  dataKey="shares"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Shares"
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Comments"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="monthly" className="h-80">
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Not enough data to show monthly view</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
