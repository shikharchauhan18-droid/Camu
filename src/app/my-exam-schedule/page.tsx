
'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ChevronDown,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileCard from '@/components/profile-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const reports = [
  {
    title: 'End Semester Examination, May 2025',
    links: [
        { text: 'Result', href: '#' },
        { text: 'Report card', href: '#' },
        { text: 'CCE report', href: '#' }
    ],
  },
  {
    title: 'Mid Semester Examination, Oct 2025',
    links: [
        { text: 'Result', href: '/exam-results' },
        { text: 'Report card', href: '#' },
        { text: 'CCE report', href: '#' }
    ],
  },
];

export default function MyExamSchedulePage() {
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
    <div className="flex flex-col min-h-screen bg-slate-50 text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold">Happy New Year</h2>
              <p className="text-muted-foreground">Use camu with New Interface</p>
            </CardContent>
          </Card>
          <ProfileCard profile={profile} />

          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-lg font-semibold">Exam schedule</h2>
              <Select defaultValue="sem4">
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem4">
                    2026-2027, Semester - 4, B.Tech...
                  </SelectItem>
                  <SelectItem value="sem3">
                    2025-2026, Semester - 3, B.Tech...
                  </SelectItem>
                  <SelectItem value="sem2">
                    2024-2025, Semester - 2, B.Tech...
                  </SelectItem>
                  <SelectItem value="sem1">
                    2024-2025, Semester - 1, B.Tech...
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                View progress report
              </Button>

              <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                  <div className="relative ml-4 flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-9" />
                  </div>
                </div>
                <TabsContent value="all">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4 mt-4"
                  >
                    {reports.map((report, index) => (
                      <AccordionItem
                        value={`item-${index}`}
                        key={index}
                        className="border rounded-lg bg-background"
                      >
                        <AccordionTrigger className="px-4 text-sm font-medium">
                          {report.title}
                        </AccordionTrigger>
                        <AccordionContent className="border-t">
                          <div className="p-4 space-y-2">
                            {report.links.map((link) => (
                              <Link
                                key={link.text}
                                href={link.href}
                                className="block text-primary hover:underline"
                              >
                                {link.text}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                <TabsContent value="upcoming">
                  <p className="text-center text-muted-foreground py-8">
                    No upcoming exams.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
