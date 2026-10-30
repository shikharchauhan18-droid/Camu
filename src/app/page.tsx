
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';

import {
  Menu,
  Settings,
  LogOut,
  User,
  MessageSquare,
  CalendarCheck,
  FileText,
  Calendar,
  Coffee,
  CalendarDays,
  Briefcase,
  UserPlus,
  FileBadge,
  LogOut as LogOutIcon,
  Home as HomeIcon,
  BookOpen,
  GraduationCap,
  LayoutGrid,
  Bell,
  Download,
  Users,
  CircleHelp,
  Globe,
  Wallet,
  X,
  PieChart as PieChartIcon,
} from 'lucide-react';
import Link from 'next/link';
import NewsFeed from '@/components/news-feed';
import ProfileCard from '@/components/profile-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/protected-route';
import { useProfileData } from '@/hooks/use-profile-data';


type InfoRowProps = {
  label: string;
  value: React.ReactNode;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[1fr,1.5fr] gap-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/' },
    { icon: User, label: 'My Profile', href: '/profile' },
    { icon: CalendarCheck, label: 'Attendance', href: '/attendance' },
    { icon: GraduationCap, label: 'Course Registration', href: '/course-registration' },
    { icon: CalendarDays, label: 'Timetable', href: '/my-timetable' },
    { icon: Coffee, label: 'Cafeteria', href: '/cafeteria' },
    { icon: Calendar, label: 'Holidays', href: '/holidays'},
    { icon: FileBadge, label: 'Final Result', href: '/final-result' },
    { icon: Briefcase, label: 'Leave and gate pass', href: '/leave-and-gate-pass' },
    { icon: UserPlus, label: 'Room Partner Selection', href: '/room-partner-selection' },
    { icon: LogOut, label: 'Logout', href: '/logout' },
];

const academicDetails = [
    { label: 'Semester', value: 'Semester - 4' },
    { label: 'Course Name', value: 'Bachelor of Technology (Electronics and Communication Engineering)' },
    { label: 'College', value: 'Bennett University' },
    { label: 'Curriculum Plan', value: 'B.tech ECE 2028' },
    { label: 'Academic standing', value: '' },
    { label: 'Academic Classification', value: '' },
    { label: 'Discount Category', value: '' },
    { label: 'Intake', value: '' },
    { label: 'Program Validity Date', value: 'B.tech ECE 2028' },
];

export default function HomePage() {
  const { profile, studentData, loading } = useProfileData();
  const academicProgram = studentData?.program || studentData?.semester || 'B.Tech ECE';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 sm:px-6 py-2">
        <div className="flex flex-col items-start gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground h-7 w-7">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-background">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex flex-col items-center gap-2">
                  BENNETT UNIVERSITY
                </SheetTitle>
              </SheetHeader>
              <div className="p-2">
                  <nav>
                      <ul>
                          {menuItems.map((item, index) =>(
                              <li key={index}>
                                  <Link
                                      href={item.href}
                                      className="flex items-center gap-3 rounded-md p-3 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                  >
                                      <item.icon className="h-5 w-5" />
                                      <span>{item.label}</span>
                                  </Link>
                              </li>
                          ))}
                      </ul>
                  </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <ProfileCard profile={profile} />
          
          <NewsFeed academicProgram={academicProgram} />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button variant="outline">Change password</Button>
              <Button variant="outline">More Info</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="sticky bottom-0 flex h-16 items-center justify-around border-t bg-slate-900 text-white">
        <Link href="/" passHref>
          <Button variant="ghost" className="flex flex-col h-auto text-white hover:bg-slate-700 hover:text-white">
            <HomeIcon className="h-6 w-6" />
          </Button>
        </Link>
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="flex flex-col h-auto text-white hover:bg-slate-700 hover:text-white">
                    <Settings className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-lg">
                <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <SheetTitle className="text-lg font-semibold">Settings</SheetTitle>
                    <SheetClose>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                </SheetHeader>
                <div className="p-4 space-y-6">
                    <div>
                        <Label className="font-semibold">Language</Label>
                        <Button variant="outline" className="w-full justify-start mt-2">
                            <Globe className="mr-2 h-4 w-4" />
                            TCE_IND_COL
                        </Button>
                    </div>
                    <div>
                        <Label className="font-semibold">Font family</Label>
                        <p className="text-sm text-muted-foreground">Customize the font family by your preference</p>
                        <RadioGroup defaultValue="29lt-bukra" className="mt-2 space-y-1">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="mulish" className="font-normal">Mulish (default)</Label>
                                <RadioGroupItem value="mulish" id="mulish" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="lato" className="font-normal">lato</Label>
                                <RadioGroupItem value="lato" id="lato" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="29lt-bukra" className="font-normal">29lt-bukra</Label>
                                <RadioGroupItem value="29lt-bukra" id="29lt-bukra" />
                            </div>
                        </RadioGroup>
                    </div>
                    <div>
                        <Label className="font-semibold">Font size</Label>
                        <p className="text-sm text-muted-foreground">Customize the font size by your preference</p>
                         <RadioGroup defaultValue="default" className="mt-2 space-y-1">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="font-default" className="font-normal">Default</Label>
                                <RadioGroupItem value="default" id="font-default" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="font-large" className="font-normal">Large</Label>
                                <RadioGroupItem value="large" id="font-large" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="font-extra-large" className="font-normal">Extra large</Label>
                                <RadioGroupItem value="extra-large" id="font-extra-large" />
                            </div>
                        </RadioGroup>
                    </div>
                     <div>
                        <Label className="font-semibold">Custom website themes</Label>
                        <p className="text-sm text-muted-foreground">Customize the themes by your preference</p>
                         <div className="mt-2 grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="theme1" />
                                <label htmlFor="theme1" className="text-sm font-medium leading-none">Theme1</label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="theme2" />
                                <label htmlFor="theme2" className="text-sm font-medium leading-none">Theme2</label>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
        <Link href="/logout" passHref>
          <Button variant="ghost" className="flex flex-col h-auto text-white hover:bg-slate-700 hover:text-white">
            <LogOut className="h-6 w-6" />
          </Button>
        </Link>
      </footer>
    </div>
    </ProtectedRoute>
  );
}

    
