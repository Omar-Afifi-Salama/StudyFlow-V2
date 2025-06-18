
"use client";
import { useSessions } from '@/contexts/SessionContext';
import ShopPage from '@/components/shop/ShopPage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ShopRoute() {
  const { isFeatureUnlocked } = useSessions();
  if (!isFeatureUnlocked('shop')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Shop Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree to customize your app.
        </p>
        <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full">
      <ShopPage />
    </div>
  );
}
