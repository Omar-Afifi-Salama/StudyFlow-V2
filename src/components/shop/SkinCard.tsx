
"use client";

import type { Skin } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, DollarSign, Lock, ShieldCheck, ShoppingCart, Eye, XCircle } from 'lucide-react';
import { useSessions } from '@/contexts/SessionContext';
import Image from 'next/image';

interface SkinCardProps {
  skin: Skin;
  userCash: number;
  userLevel: number;
  isOwned: boolean;
  isEquipped: boolean;
  onBuy: () => void;
  onEquip: () => void;
  onTry: () => void;
  onCancelPreview: () => void;
  isPreviewing: boolean;
  previewingSkinId: string | null;
}

export default function SkinCard({ skin, userCash, userLevel, isOwned, isEquipped, isPreviewing, onBuy, onEquip, onTry, onCancelPreview, previewingSkinId }: SkinCardProps) {
  const { getAppliedBoost } = useSessions();
  const shopDiscount = getAppliedBoost('shopDiscount');
  const effectivePrice = Math.round(skin.price * (1 - shopDiscount));

  const canAfford = userCash >= effectivePrice;
  const meetsLevelRequirement = userLevel >= skin.levelRequirement;
  const canBuy = !isOwned && canAfford && meetsLevelRequirement;
  
  const isThisSkinPreviewing = previewingSkinId === skin.id;

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow card-animated">
      <CardHeader className="p-0">
         <div
            className="relative w-full h-40 bg-cover bg-center"
          >
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
          <DollarSign className="h-4 w-4 mr-1 text-green-500" /> Price: 
          {shopDiscount > 0 && skin.price > 0 ? (
            <>
              <span className="line-through text-muted-foreground ml-1">${skin.price.toLocaleString()}</span>
              <span className="font-semibold ml-1">${effectivePrice.toLocaleString()}</span>
            </>
          ) : (
            <span className="ml-1">{skin.price > 0 ? `$${skin.price.toLocaleString()}` : 'Free'}</span>
          )}
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
            <Button onClick={onEquip} className="w-full btn-animated" variant="outline">
              Equip Skin
            </Button>
          )
        ) : (
          <div className="w-full flex items-center gap-2">
            <Button onClick={onBuy} disabled={!canBuy} className="w-full btn-animated">
              <ShoppingCart className="mr-2 h-4 w-4" /> Buy
              {!meetsLevelRequirement && <span className="ml-1 text-xs">(Lvl {skin.levelRequirement})</span>}
              {!canAfford && meetsLevelRequirement && <span className="ml-1 text-xs">(${effectivePrice.toLocaleString()})</span>}
            </Button>
            {isThisSkinPreviewing ? (
                 <Button onClick={onCancelPreview} variant="destructive" className="btn-animated">
                    <XCircle className="mr-2 h-4 w-4"/> Cancel
                </Button>
            ) : (
                <Button onClick={() => onTry(skin.id)} variant="secondary" className="btn-animated">
                    <Eye className="mr-2 h-4 w-4"/> Try
                </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

    