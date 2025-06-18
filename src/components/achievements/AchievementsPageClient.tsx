
"use client";

import { useSessions, ALL_ACHIEVEMENTS } from '@/contexts/SessionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, Lock, DollarSign, Trophy } from 'lucide-react';
import * as LucideIcons from 'lucide-react'; // Import all icons
import type { Achievement } from '@/types'; // Explicitly import Achievement type

type IconName = keyof typeof LucideIcons;

const getIconComponent = (iconName?: string): React.ComponentType<{ className?: string }> | null => {
  if (!iconName || !(iconName in LucideIcons)) {
    return Award; // Default icon
  }
  return LucideIcons[iconName as IconName] as React.ComponentType<{ className?: string }>;
};

const achievementCategories: Achievement['category'][] = [
    'Study Time', 'Pomodoro', 'Progression', 'Collection', 
    'Streaks & Challenges', 'Capitalist', 'Notepad & Revision', 'Habits', 'General'
];


export default function AchievementsPageClient() {
  const { userProfile } = useSessions();
  const unlockedIds = userProfile.unlockedAchievementIds || [];

  return (
    <Card className="shadow-lg w-full card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Trophy className="h-8 w-8 text-primary" /> {/* Changed icon */}
          <div>
            <CardTitle className="text-3xl font-headline">Achievements & Badges</CardTitle>
            <CardDescription>Track your milestones and accomplishments in StudyFlow!</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {ALL_ACHIEVEMENTS.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No achievements defined yet. Stay tuned!</p>
        ) : (
          <div className="space-y-8">
            {achievementCategories.map(category => {
              const achievementsInCategory = ALL_ACHIEVEMENTS.filter(ach => ach.category === category);
              if (achievementsInCategory.length === 0) return null;

              return (
                <section key={category}>
                  <h2 className="text-2xl font-semibold mb-4 text-primary border-b pb-2">{category || 'General'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievementsInCategory.map(achievement => {
                      const isUnlocked = unlockedIds.includes(achievement.id);
                      const IconComponent = getIconComponent(achievement.iconName);

                      return (
                        <Card 
                          key={achievement.id} 
                          className={`flex flex-col items-center p-6 text-center transition-all duration-300 ease-in-out card-animated
                                      ${isUnlocked ? 'border-primary shadow-primary/30 shadow-lg scale-100' 
                                                   : 'border-muted bg-muted/30 opacity-70 scale-95 hover:opacity-90 hover:scale-100'}`}
                        >
                          <div className={`mb-4 p-3 rounded-full
                                          ${isUnlocked ? 'bg-primary/20 text-primary' : 'bg-foreground/10 text-muted-foreground'}`}>
                            {IconComponent ? <IconComponent className="h-10 w-10" /> : <Award className="h-10 w-10" />}
                          </div>
                          <h3 className={`text-xl font-semibold mb-1 ${isUnlocked ? 'text-primary' : 'text-foreground'}`}>{achievement.name}</h3>
                          <p className={`text-sm mb-2 ${isUnlocked ? 'text-muted-foreground' : 'text-foreground/70'}`}>{achievement.description}</p>
                          <p className={`text-xs font-medium flex items-center mb-3 ${isUnlocked ? 'text-green-500' : 'text-muted-foreground'}`}>
                            <DollarSign className="h-3 w-3 mr-1" /> Reward: {achievement.cashReward.toLocaleString()}
                          </p>
                          {isUnlocked ? (
                            <div className="flex items-center text-green-500">
                              <CheckCircle className="h-5 w-5 mr-1" /> Unlocked
                            </div>
                          ) : (
                            <div className="flex items-center text-destructive/70">
                              <Lock className="h-5 w-5 mr-1" /> Locked
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
