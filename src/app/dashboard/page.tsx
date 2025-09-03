import ModuleCard from '@/components/dashboard/module-card';
import { BookCheck, Gem, Rocket } from 'lucide-react';

const modules = [
  {
    title: 'Introduction to Pinyin',
    description: 'Learn the basics of Pinyin, including initials, finals, and tones.',
    icon: Rocket,
    isUnlocked: true,
  },
  {
    title: 'Tone Sandhi',
    description: 'Master the rules of tone changes in different contexts.',
    icon: BookCheck,
    isUnlocked: true,
  },
  {
    title: 'Advanced Finals',
    description: 'Explore complex final sounds and combinations.',
    icon: Gem,
    isUnlocked: false,
  },
  {
    title: 'Common Phrases',
    description: 'Practice Pinyin with everyday Chinese phrases.',
    icon: Rocket,
    isUnlocked: false,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Your Courses</h1>
      <p className="text-muted-foreground mb-8">Continue your journey to master Pinyin.</p>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((module, index) => (
          <ModuleCard key={index} {...module} />
        ))}
      </div>
    </div>
  );
}
