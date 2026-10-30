
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ProfileCard from '@/components/profile-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ReportsPage() {
  const avatar = PlaceHolderImages.find((img) => img.id === 'avatar1');

  const profile = {
    name: 'Shikhar Chauhan',
    studentId: 'Bennett University',
    program: 'Semester - 4 | 2026-2027',
    status: 'Active' as const,
    avatarUrl: avatar?.imageUrl || 'https://picsum.photos/seed/1/200/200',
    avatarHint: avatar?.imageHint || 'student portrait',
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <ProfileCard profile={profile} />
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold">Happy New Year</h2>
              <p className="text-muted-foreground">Use camu with New Interface</p>
            </CardContent>
          </Card>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p>This is the Reports page.</p>
        </div>
      </main>
    </div>
  );
}
