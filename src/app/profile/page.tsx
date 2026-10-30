
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Settings, LogOut, HomeIcon } from 'lucide-react';
import ProfileCard from '@/components/profile-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStorageFileUrl, STORAGE_BUCKETS } from '@/lib/appwrite';
import { useProfileData } from '@/hooks/use-profile-data';

export default function ProfilePage() {
  const { profile, studentData, loading } = useProfileData();
  const profilePictureUrl = getStorageFileUrl(STORAGE_BUCKETS.PROFILE_PICTURES, '6975f52f001991d9d07c');

  const studentDetails = [
    { label: 'DOB', value: studentData?.dob || '—' },
    { label: 'Student status', value: studentData?.status || 'Active', isBadge: true },
    { label: 'Admission No.', value: studentData?.admissionNo || '—' },
    { label: 'Admission Year', value: studentData?.admissionYear || '—' },
    { label: 'Roll No.', value: studentData?.rollNo || studentData?.studentId || '—' },
    { label: 'College', value: studentData?.college || 'Bennett University' },
    { label: 'Curriculum Plan', value: studentData?.curriculumPlan || '—' },
    { label: 'Course Plan', value: studentData?.coursePlan || '—' },
    { label: 'Degree', value: studentData?.degree || '—' },
    { label: 'Department', value: studentData?.department || '—' },
    { label: "Father's Name", value: studentData?.fathersName || '—' },
    { label: "Mother's Name", value: studentData?.mothersName || '—' },
    { label: 'Address', value: studentData?.address || '—' },
    { label: 'City', value: studentData?.city || '—' },
    { label: 'State', value: studentData?.state || '—' },
  ];

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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          ) : (
            <>
              <ProfileCard profile={profile} />

              <Card className="bg-blue-50">
                <CardContent className="p-4 space-y-4">
                  <div className="mx-auto w-32 h-40 relative border-4 border-white rounded-md overflow-hidden shadow-lg">
                    <Image
                      src={studentData?.avatarUrl || profilePictureUrl}
                      alt="Profile picture"
                      data-ai-hint="student photo"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <h2 className="text-center text-2xl font-bold">{profile.name}</h2>

                  <dl className="space-y-3">
                    {studentDetails.map((detail) => (
                      <div key={detail.label} className="grid grid-cols-[1fr,1.5fr] gap-2 text-sm">
                        <dt className="text-muted-foreground">{detail.label}</dt>
                        <dd className="text-right">
                          {detail.isBadge ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 font-medium">
                              {detail.value}
                            </Badge>
                          ) : (
                            <span className="font-medium">{detail.value}</span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 flex h-16 items-center justify-around border-t bg-slate-900 text-white">
        <Link href="/" passHref>
          <Button variant="ghost" className="flex flex-col h-auto text-white hover:bg-slate-700 hover:text-white">
            <HomeIcon className="h-6 w-6" />
          </Button>
        </Link>
        <Button variant="ghost" className="flex flex-col h-auto text-white hover:bg-slate-700 hover:text-white">
          <Settings className="h-6 w-6" />
        </Button>
        <Link href="/logout" passHref>
          <Button variant="ghost" className="flex flex-col h-auto text-white hover:bg-slate-700 hover:text-white">
            <LogOut className="h-6 w-6 rotate-180" />
          </Button>
        </Link>
      </footer>
    </div>
  );
}
