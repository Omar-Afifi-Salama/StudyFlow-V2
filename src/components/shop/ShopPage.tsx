
"use client";

import { useSessions, PREDEFINED_SKINS } from '@/contexts/SessionContext';
import SkinCard from './SkinCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem } from 'lucide-react';

export default function ShopPage() {
  const { userProfile, getSkinById, buySkin, equipSkin, isSkinOwned } = useSessions();

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Gem className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-3xl font-headline">Skin Shop</CardTitle>
              <CardDescription>Customize your StudyFlow experience! Skins are cosmetic.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Your Cash: <span className="font-semibold text-yellow-500">{userProfile.cash}</span></p>
          <p className="mb-6">Your Level: <span className="font-semibold text-primary">{userProfile.level} ({userProfile.title})</span></p>
          
          {PREDEFINED_SKINS.length === 0 ? (
            <p className="text-muted-foreground">No skins available at the moment. Check back later!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREDEFINED_SKINS.map(skin => (
                <SkinCard
                  key={skin.id}
                  skin={skin}
                  userCash={userProfile.cash}
                  userLevel={userProfile.level}
                  isOwned={isSkinOwned(skin.id)}
                  isEquipped={userProfile.equippedSkinId === skin.id}
                  onBuy={() => buySkin(skin.id)}
                  onEquip={() => equipSkin(skin.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
