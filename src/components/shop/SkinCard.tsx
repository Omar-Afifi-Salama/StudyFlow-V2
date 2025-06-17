
"use client";

import type { Skin } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CheckCircle, Coins, Lock, ShieldCheck, ShoppingCart } from 'lucide-react';

interface SkinCardProps {
  skin: Skin;
  userCash: number;
  userLevel: number;
  isOwned: boolean;
  isEquipped: boolean;
  onBuy: () => void;
  onEquip: () => void;
}

export default function SkinCard({ skin, userCash, userLevel, isOwned, isEquipped, onBuy, onEquip }: SkinCardProps) {
  const canAfford = userCash >= skin.price;
  const meetsLevelRequirement = userLevel >= skin.levelRequirement;
  const canBuy = !isOwned && canAfford && meetsLevelRequirement;

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative w-full h-40">
          <Image 
            src={skin.imageUrl} 
            alt={skin.name} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint={skin.dataAiHint}
          />
          {isEquipped && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded-full flex items-center">
              <ShieldCheck className="h-3 w-3 mr-1" /> Equipped
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold mb-1">{skin.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2">{skin.description}</CardDescription>
        <div className="flex items-center text-sm mb-1">
          <Coins className="h-4 w-4 mr-1 text-yellow-500" /> Price: {skin.price}
        </div>
        <div className="flex items-center text-sm">
          <Lock className="h-4 w-4 mr-1 text-gray-500" /> Requires Level: {skin.levelRequirement}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {isOwned ? (
          isEquipped ? (
            <Button variant="ghost" disabled className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" /> Equipped
            </Button>
          ) : (
            <Button onClick={onEquip} className="w-full" variant="outline">
              Equip Skin
            </Button>
          )
        ) : (
          <Button onClick={onBuy} disabled={!canBuy} className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" /> Buy Skin
            {!meetsLevelRequirement && <span className="ml-1 text-xs">(Lvl {skin.levelRequirement})</span>}
            {!canAfford && meetsLevelRequirement && <span className="ml-1 text-xs">(Need {skin.price - userCash} more)</span>}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
