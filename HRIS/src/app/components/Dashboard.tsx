import { Card } from "./ui/card";
import { Users, FileText, TrendingUp, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface DashboardProps {
  userPoints: number;
}

const activityData = [
  { month: "Jan", documents: 45, points: 120 },
  { month: "Feb", documents: 52, points: 145 },
  { month: "Mar", documents: 48, points: 135 },
  { month: "Apr", documents: 61, points: 178 },
  { month: "May", documents: 55, points: 160 },
  { month: "Jun", documents: 67, points: 195 },
];

const recentActivities = [
  { action: "Uploaded employee contract", points: 10, time: "2 hours ago" },
  { action: "Completed onboarding documents", points: 25, time: "5 hours ago" },
  { action: "Reviewed HR policy", points: 5, time: "1 day ago" },
  { action: "Updated employee handbook", points: 15, time: "2 days ago" },
  { action: "Submitted training certificate", points: 20, time: "3 days ago" },
];

export function Dashboard({ userPoints }: DashboardProps) {
  const stats = [
    {
      label: "Total Employees",
      value: "248",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Documents",
      value: "1,432",
      change: "+8%",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      label: "Points Earned",
      value: userPoints.toString(),
      change: "+23%",
      icon: Award,
      color: "bg-purple-500",
    },
    {
      label: "Engagement Rate",
      value: "94%",
      change: "+5%",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="documents" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Points Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Points Earned Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="points" stroke="#ec4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 font-semibold">+{activity.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
