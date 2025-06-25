
"use client";

import { useSessions, PREDEFINED_SKINS } from '@/contexts/SessionContext';
import SkinCard from './SkinCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, DollarSign, Palette } from 'lucide-react';

export default function ShopPage() {
  const { userProfile, buySkin, equipSkin, isSkinOwned } = useSessions();
  
  const lightSkins = PREDEFINED_SKINS.filter(skin => skin.isLightTheme);
  const darkSkins = PREDEFINED_SKINS.filter(skin => !skin.isLightTheme);


  return (
    <div className="space-y-6">
      <Card className="shadow-lg card-animated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Gem className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-3xl font-headline">Cosmetics Shop</CardTitle>
                  <CardDescription>Customize your StudyFlow experience! Skins are purely cosmetic.</CardDescription>
                </div>
            </div>
             <div className="text-right">
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="font-bold text-lg text-green-500 flex items-center justify-end"><DollarSign className="h-5 w-5 mr-1"/>{userProfile.cash.toLocaleString()}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center"><Palette className="mr-3 h-6 w-6 text-primary"/> Light Themes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lightSkins.map(skin => (
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
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center"><Palette className="mr-3 h-6 w-6 text-accent"/> Dark Themes</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {darkSkins.map(skin => (
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
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
