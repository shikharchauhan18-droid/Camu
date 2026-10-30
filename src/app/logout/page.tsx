
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ProfileCard from '@/components/profile-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function LogoutPage() {
  const avatar = PlaceHolderImages.find((img) => img.id === 'avatar1');
  const router = useRouter();
  const { logout, user } = useAuth();

  const profile = {
    name: user?.name || 'Shikhar Chauhan',
    studentId: 'Bennett University',
    program: 'Semester - 4 | 2026-2027',
    status: 'Active' as const,
    avatarUrl: avatar?.imageUrl || 'https://picsum.photos/seed/1/200/200',
    avatarHint: avatar?.imageHint || 'student portrait',
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
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
          <div className="text-center">
            <h2 className="text-2xl font-bold">Logout</h2>
            <p className="mb-4">Are you sure you want to log out?</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will end your current session.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Yes</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
    </div>
  );
}
