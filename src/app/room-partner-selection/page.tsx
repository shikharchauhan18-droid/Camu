
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getCurrRoomStatAction, getRoomPartnerOptionsAction } from '@/lib/client-actions';
import { useProfileData } from '@/hooks/use-profile-data';
import ProfileCard from '@/components/profile-card';

export default function RoomPartnerSelectionPage() {
  const { profile, loading: profileLoading } = useProfileData();

  const [currRoomStat, setCurrRoomStat] = useState<Record<string, any> | null>(null);
  const [roomPartnerOptions, setRoomPartnerOptions] = useState<Record<string, any>[]>([]);
  const [roomLoading, setRoomLoading] = useState(true);

  useEffect(() => {
    async function fetchRoomData() {
      try {
        setRoomLoading(true);
        const [statResult, optionsResult] = await Promise.all([
          getCurrRoomStatAction(),
          getRoomPartnerOptionsAction(),
        ]);

        if (statResult.success && statResult.data) {
          setCurrRoomStat(statResult.data as Record<string, any>);
        }
        if (optionsResult.success) {
          setRoomPartnerOptions(optionsResult.data as Record<string, any>[]);
        }
      } catch (err) {
        console.error('Error fetching room data:', err);
      } finally {
        setRoomLoading(false);
      }
    }
    fetchRoomData();
  }, []);

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
          {!profileLoading && <ProfileCard profile={profile} />}

          <h2 className="text-2xl font-bold">Room Partner Selection</h2>

          {/* Current Room Details */}
          <Card>
            <CardHeader>
              <CardTitle>Current Room details</CardTitle>
            </CardHeader>
            <CardContent>
              {roomLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hostel</span>
                    <span className="font-medium">{currRoomStat?.Hostel ?? currRoomStat?.hostel ?? '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Room No.</span>
                    <span className="font-medium">{currRoomStat?.Room_No ?? currRoomStat?.room_no ?? currRoomStat?.RoomNo ?? '—'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Room Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Room Status</CardTitle>
            </CardHeader>
            <CardContent>
              {roomLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{currRoomStat?.Name ?? currRoomStat?.name ?? '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Course</span>
                    <span className="font-medium">{currRoomStat?.Course ?? currRoomStat?.course ?? '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Enrollment number</span>
                    <span className="font-medium">{currRoomStat?.Enrollment_Number ?? currRoomStat?.enrollment_number ?? currRoomStat?.EnrollmentNumber ?? '—'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Room Partner Options */}
          {roomLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : roomPartnerOptions.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground text-sm">
                No room partner options available.
              </CardContent>
            </Card>
          ) : (
            roomPartnerOptions.map((option) => (
              <Card key={option.$id}>
                <CardHeader>
                  <CardTitle>Room partner option</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium">{option.tname ?? option.name ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Course</span>
                      <span className="font-medium">{option.course ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Enrollment number</span>
                      <span className="font-medium">{option.enrollment_number ?? option.enrolnment_number ?? option.EnrollmentNumber ?? '—'}</span>
                    </div>
                  </div>
                  <Button className="w-full">Select</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
