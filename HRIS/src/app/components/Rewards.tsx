import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Trophy, Star, Award, Medal, Crown, Zap } from "lucide-react";

interface RewardsProps {
  userPoints: number;
}

interface Tier {
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: typeof Trophy;
  color: string;
  benefits: string[];
}

interface Leaderboard {
  rank: number;
  name: string;
  points: number;
  badge: string;
}

const tiers: Tier[] = [
  {
    name: "Bronze",
    minPoints: 0,
    maxPoints: 199,
    icon: Medal,
    color: "from-amber-700 to-amber-500",
    benefits: ["Basic rewards access", "10% discount in marketplace"],
  },
  {
    name: "Silver",
    minPoints: 200,
    maxPoints: 499,
    icon: Star,
    color: "from-gray-400 to-gray-300",
    benefits: ["All Bronze benefits", "15% discount in marketplace", "Priority support"],
  },
  {
    name: "Gold",
    minPoints: 500,
    maxPoints: 999,
    icon: Award,
    color: "from-yellow-500 to-yellow-400",
    benefits: ["All Silver benefits", "20% discount in marketplace", "Exclusive items", "Bonus point multiplier"],
  },
  {
    name: "Platinum",
    minPoints: 1000,
    maxPoints: Infinity,
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    benefits: ["All Gold benefits", "25% discount in marketplace", "VIP access", "Double points on uploads"],
  },
];

const leaderboard: Leaderboard[] = [
  { rank: 1, name: "Sarah Johnson", points: 1245, badge: "Platinum" },
  { rank: 2, name: "Michael Chen", points: 987, badge: "Gold" },
  { rank: 3, name: "Emily Rodriguez", points: 856, badge: "Gold" },
  { rank: 4, name: "You (John Doe)", points: 450, badge: "Silver" },
  { rank: 5, name: "David Kim", points: 423, badge: "Silver" },
  { rank: 6, name: "Lisa Anderson", points: 398, badge: "Silver" },
  { rank: 7, name: "James Wilson", points: 267, badge: "Silver" },
  { rank: 8, name: "Maria Garcia", points: 189, badge: "Bronze" },
];

const recentRewards = [
  { title: "Document Master Achievement", points: 50, date: "2024-02-03" },
  { title: "10 Documents Uploaded", points: 100, date: "2024-02-02" },
  { title: "Silver Tier Reached", points: 200, date: "2024-02-01" },
  { title: "Weekly Upload Streak", points: 75, date: "2024-01-30" },
];

export function Rewards({ userPoints }: RewardsProps) {
  const currentTier = tiers.find(
    (tier) => userPoints >= tier.minPoints && userPoints <= tier.maxPoints
  ) || tiers[0];

  const nextTier = tiers.find((tier) => tier.minPoints > userPoints);
  const pointsToNextTier = nextTier ? nextTier.minPoints - userPoints : 0;
  const progressPercentage = nextTier
    ? ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const CurrentIcon = currentTier.icon;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Rewards & Recognition</h2>
        <p className="text-gray-500 mt-1">Track your progress and celebrate achievements</p>
      </div>

      {/* Current Tier Card */}
      <Card className={`p-8 mb-8 bg-gradient-to-br ${currentTier.color} text-white`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CurrentIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm opacity-90">Current Tier</p>
              <h3 className="text-3xl font-bold">{currentTier.name}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Your Points</p>
            <p className="text-4xl font-bold">{userPoints}</p>
          </div>
        </div>

        {nextTier && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to {nextTier.name}</span>
              <span>{pointsToNextTier} points to go</span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-white/20" />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* All Tiers */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Membership Tiers</h3>
          <div className="space-y-4">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isCurrentTier = tier.name === currentTier.name;
              const isLocked = userPoints < tier.minPoints;

              return (
                <Card
                  key={tier.name}
                  className={`p-6 ${isCurrentTier ? 'border-2 border-purple-500' : ''} ${
                    isLocked ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg text-gray-900">{tier.name}</h4>
                        {isCurrentTier && (
                          <Badge className="bg-purple-600">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {tier.maxPoints === Infinity
                          ? `${tier.minPoints}+ points`
                          : `${tier.minPoints}-${tier.maxPoints} points`}
                      </p>
                      <div className="space-y-1">
                        {tier.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Zap className="w-3 h-3 text-purple-600" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h3>
          <Card className="p-6">
            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    entry.name.includes("You") ? "bg-purple-50 border border-purple-200" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1
                      ? "bg-yellow-500 text-white"
                      : entry.rank === 2
                      ? "bg-gray-400 text-white"
                      : entry.rank === 3
                      ? "bg-amber-700 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{entry.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{entry.badge}</Badge>
                      <span className="text-sm text-gray-500">{entry.points} points</span>
                    </div>
                  </div>
                  {entry.rank <= 3 && (
                    <Trophy className={`w-5 h-5 ${
                      entry.rank === 1
                        ? "text-yellow-500"
                        : entry.rank === 2
                        ? "text-gray-400"
                        : "text-amber-700"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Rewards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentRewards.map((reward, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600 fill-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{reward.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{reward.date}</p>
                  <p className="text-purple-600 font-semibold text-sm mt-2">+{reward.points} pts</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
