
"use client";

import { useSessions, ALL_INFAMY_SKILLS } from '@/contexts/SessionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InfamySkillNode from './InfamySkillNode';
import { Button } from '@/components/ui/button';
import { Repeat, Star, Gem, Shield, Skull, Zap } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function InfamyPageClient() {
  const { userProfile, goInfamous, unlockInfamySkill, isInfamySkillUnlocked, canUnlockInfamySkill } = useSessions();
  
  const canGoInfamous = userProfile.level >= 100;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg card-animated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skull className="h-8 w-8 text-destructive" />
              <div>
                <CardTitle className="text-3xl font-headline">The Path of Infamy</CardTitle>
                <CardDescription>
                  Reset your progress for powerful, permanent upgrades.
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 text-lg font-semibold cursor-help">
                                <Zap className="h-6 w-6 text-purple-400" /> 
                                <span>{userProfile.infamyPoints || 0} Infamy Point(s)</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Earn 1 Infamy Point each time you go infamous.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <p className="text-sm text-muted-foreground">Current Infamy Level: {userProfile.infamyLevel || 0}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
                When you reach Level 100, you can choose to "Go Infamous." This will reset your Level, XP, Cash, and Businesses, but you will keep your unlocked skills, achievements, and notepad data. In return, you will gain Infamy Points to spend on permanent, powerful upgrades that persist through all future resets.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg" disabled={!canGoInfamous}>
                    <Repeat className="mr-2 h-5 w-5" /> Go Infamous (Requires Level 100)
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you ready to embrace Infamy?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset your Level, XP, Cash, and all Business progress. Your main skill tree unlocks and notepad data will be saved. You will gain <span className="font-bold text-primary">1 Infamy Point</span>. This action is irreversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Not yet...</AlertDialogCancel>
                  <AlertDialogAction onClick={goInfamous}>Let's Do It</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg card-animated">
        <CardHeader>
          <CardTitle>Infamy Skill Tree</CardTitle>
          <CardDescription>Spend Infamy Points on permanent upgrades.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex justify-center">
          {ALL_INFAMY_SKILLS.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {ALL_INFAMY_SKILLS.map(skill => (
                <InfamySkillNode 
                    key={skill.id}
                    skill={skill}
                    isUnlocked={isInfamySkillUnlocked(skill.id)}
                    canUnlock={canUnlockInfamySkill(skill.id)}
                    onUnlock={() => unlockInfamySkill(skill.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No infamy skills are available yet. The path is being forged.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
