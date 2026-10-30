
'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProfileCard from '@/components/profile-card';
import { Button } from '@/components/ui/button';
import { useProfileData } from '@/hooks/use-profile-data';

const weeklyTimetable = [
  {
    day: 'MON',
    slots: {
      '8:30-9:30': 'Analog circuit 2',
      '9:30-10:30': 'computer Networks',
      '10:45-11:45': 'data structures',
      '12:00-1:00': '',
      '1:30-2:30': 'Sensors and Actuators',
      '2:30-3:30': 'Quantum mechanics (L)',
      '3:45-4:45': 'Quantum mechanics (L)',
      '4:45-5:45': '',
    },
  },
  {
    day: 'TUE',
    slots: {
      '8:30-9:30': 'Data structures',
      '9:30-10:30': 'Analog circuits',
      '10:45-11:45': 'Computer Network',
      '12:00-1:00': '',
      '1:30-2:30': '',
      '2:30-3:30': 'Q & R engineering',
      '3:45-4:45': 'Embedded system Design and programming',
      '4:45-5:45': '',
    },
  },
  {
    day: 'WED',
    slots: {
      '8:30-9:30': '',
      '9:30-10:30': 'Computer Networks',
      '10:45-11:45': '',
      '12:00-1:00': 'Sensors and Actuators (T)',
      '1:30-2:30': '',
      '2:30-3:30': '',
      '3:45-4:45': '',
      '4:45-5:45': '',
    },
  },
  {
    day: 'THU',
    slots: {
      '8:30-9:30': 'Data Structures',
      '9:30-10:30': 'Biological Machines',
      '10:45-11:45': 'Computer Networks',
      '12:00-1:00': '',
      '1:30-2:30': 'Sensor and Actuators(L)',
      '2:30-3:30': 'Sensor and Actuators(L)',
      '3:45-4:45': '',
      '4:45-5:45': '',
    },
  },
  {
    day: 'FRI',
    slots: {
      '8:30-9:30': 'Analog circuits 2',
      '9:30-10:30': 'Q and R Engineering (T)',
      '10:45-11:45': 'Embedded Systems Design and Programing(L)',
      '12:00-1:00': 'Electromagnetic Field Theory',
      '1:30-2:30': '',
      '2:30-3:30': 'Data Structures',
      '3:45-4:45': 'Computer Network(T)',
      '4.45-5.45': 'Biological Machines(T)',
    },
  },
];

const timeSlots = [
  '8:30-9:30',
  '9:30-10:30',
  '10:45-11:45',
  '12:00-1:00',
  '1:30-2:30',
  '2:30-3:30',
  '3:45-4:45',
  '4:45-5:45',
];


export default function MyTimetablePage() {
  const { profile } = useProfileData();

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
        <div className="mx-auto max-w-4xl space-y-6">
          <ProfileCard profile={profile} />
          
          <h2 className="text-xl font-semibold">Timetable</h2>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <p className="font-medium">{profile.program}</p>
              <div className="flex gap-2">
                <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                <Button variant="outline">Weekly schedule</Button>
              </div>
               <div className="flex items-center justify-between rounded-md border p-2">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="font-medium text-primary">01-Jan-2026</span>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Timetable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Time</TableHead>
                      {timeSlots.map((timeSlot) => (
                        <TableHead key={timeSlot} className="text-center">{timeSlot}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyTimetable.map((day) => (
                      <TableRow key={day.day}>
                        <TableCell className="font-medium">{day.day}</TableCell>
                        {timeSlots.map((timeSlot) => (
                          <TableCell key={`${day.day}-${timeSlot}`} className="text-center">
                              {day.slots[timeSlot as keyof typeof day.slots] || ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
