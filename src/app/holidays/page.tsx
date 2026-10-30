
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/profile-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const holidays = [
  {
    date: '26-Jan-2026',
    day: 'Monday',
    description: 'Republic Day',
  },
  {
    date: '15-Aug-2026',
    day: 'Saturday',
    description: 'Independence Day',
  },
  {
    date: '04-Mar-2026',
    day: 'Wednesday',
    description: 'Holi',
  },
  {
    date: '04-Sep-2026',
    day: 'Friday',
    description: 'Janmashtami',
  },
  {
    date: '25-Aug-2026',
    day: 'Tuesday',
    description: 'Milad-un-Nabi',
  },
  {
    date: '02-Oct-2026',
    day: 'Friday',
    description: 'Gandhi Jayanti',
  },
  {
    date: '19-Oct-2026',
    day: 'Monday',
    description: 'Maha Navami',
  },
  {
    date: '20-Oct-2026',
    day: 'Tuesday',
    description: 'Dussehra',
  },
  {
    date: '06-Nov-2026',
    day: 'Friday',
    description: 'Diwali',
  },
  {
    date: '25-Dec-2026',
    day: 'Friday',
    description: 'Christmas',
  },
];

export default function HolidaysPage() {
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
          <Card>
            <CardHeader>
              <CardTitle>Holiday List 2026-2027</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holidays.map((holiday, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-md border">
                    <div>
                      <p className="font-semibold">{holiday.description}</p>
                      <p className="text-sm text-muted-foreground">{holiday.date}</p>
                    </div>
                    <Badge variant="secondary">{holiday.day}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
