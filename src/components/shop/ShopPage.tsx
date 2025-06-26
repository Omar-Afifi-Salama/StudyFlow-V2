
"use client";

import { useSessions, PREDEFINED_SKINS, UTILITY_ITEMS } from '@/contexts/SessionContext';
import SkinCard from './SkinCard';
import UtilityCard from './UtilityCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, DollarSign, Palette, Sparkles, Wand2, Package, Coins, Star } from 'lucide-react';
import type { UtilityCategory } from '@/types';
import { useMemo } from 'react';

const categoryIcons: Record<UtilityCategory, React.ElementType> = {
  'Permanent Unlocks': Star,
  'XP Boost': Package,
  'Currency Exchange': Coins,
};

export default function ShopPage() {
  const { userProfile, buySkin, equipSkin, isSkinOwned, buyUtilityItem, isUtilityItemOwned, trySkin, skinPreview } = useSessions();
  
  const lightSkins = PREDEFINED_SKINS.filter(skin => skin.isLightTheme);
  const darkSkins = PREDEFINED_SKINS.filter(skin => !skin.isLightTheme);

  const utilityItemsByCategory = useMemo(() => {
    return UTILITY_ITEMS.reduce((acc, item) => {
      const category = item.category || 'Permanent Unlocks';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<UtilityCategory, typeof UTILITY_ITEMS>);
  }, []);

  const categoryOrder: UtilityCategory[] = ['Permanent Unlocks', 'XP Boost', 'Currency Exchange'];


  return (
    <div className="space-y-6">
      <Card className="shadow-lg card-animated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Gem className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-3xl font-headline">Shop</CardTitle>
                  <CardDescription>Use your earnings to customize your experience and get boosts.</CardDescription>
                </div>
            </div>
             <div className="text-right">
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <div className="font-bold text-lg flex items-center justify-end space-x-4">
                  <span className="flex items-center text-green-500"><DollarSign className="h-5 w-5 mr-1"/>{userProfile.cash.toLocaleString()}</span>
                  <span className="flex items-center text-yellow-400"><Gem className="h-5 w-5 mr-1"/>{userProfile.skillPoints.toLocaleString()}</span>
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center"><Wand2 className="mr-3 h-6 w-6 text-purple-400"/> Utility Items</h2>
              <div className="space-y-6">
                {categoryOrder.map(category => {
                  const items = utilityItemsByCategory[category];
                  if (!items || items.length === 0) return null;
                  const Icon = categoryIcons[category];

                  return (
                    <div key={category}>
                      <h3 className="text-xl font-semibold mb-3 flex items-center"><Icon className="mr-2 h-5 w-5 text-accent"/> {category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map(item => (
                          <UtilityCard
                            key={item.id}
                            item={item}
                            userProfile={userProfile}
                            isOwned={isUtilityItemOwned(item.id)}
                            onBuy={() => buyUtilityItem(item.id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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
                    onTry={() => trySkin(skin.id)}
                    isPreviewing={!!skinPreview.id}
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
                    onTry={() => trySkin(skin.id)}
                    isPreviewing={!!skinPreview.id}
                  />
                ))}
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
