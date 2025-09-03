import AchievementCard from '@/components/dashboard/achievement-card';
import { Medal, Star, Trophy, Zap } from 'lucide-react';

const achievements = [
  {
    title: 'First Steps',
    description: 'Complete your first module.',
    icon: Star,
    isUnlocked: true,
  },
  {
    title: 'Tone Deaf No More',
    description: 'Master the four main tones.',
    icon: Medal,
    isUnlocked: true,
  },
  {
    title: 'Pinyin Pioneer',
    description: 'Complete all introductory modules.',
    icon: Trophy,
    isUnlocked: false,
  },
  {
    title: 'Speed Demon',
    description: 'Complete a submodule in under 5 minutes.',
    icon: Zap,
    isUnlocked: false,
  },
  {
    title: 'Perfect Pitch',
    description: 'Get 100% on a tone quiz.',
    icon: Star,
    isUnlocked: true,
  },
  {
    title: 'The Specialist',
    description: 'Master a complex final sound.',
    icon: Medal,
    isUnlocked: false,
  },
];

export default function AchievementsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Your Achievements</h1>
      <p className="text-muted-foreground mb-8">Track your progress and celebrate your milestones.</p>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {achievements.map((achievement, index) => (
          <AchievementCard key={index} {...achievement} />
        ))}
      </div>
    </div>
  );
}
