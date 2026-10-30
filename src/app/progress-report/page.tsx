
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProfileCard from '@/components/profile-card';
import { useProfileData } from '@/hooks/use-profile-data';

export default function ProgressReportPage() {
  const { profile } = useProfileData();

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
          <h2 className="text-2xl font-bold">Progress Report</h2>
          <p>This is the Progress Report page.</p>
        </div>
      </main>
    </div>
  );
}
