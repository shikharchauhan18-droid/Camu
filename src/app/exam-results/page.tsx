
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ProfileCard from '@/components/profile-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/contexts/auth-context';
import { getResultsAction } from '@/app/actions-db';
import { getStorageFileUrl, STORAGE_BUCKETS } from '@/lib/appwrite';

type ExamResult = {
  $id: string;
  recordType: string;
  mainExamSubject?: string;
  examSubject?: string;
  examCode?: string;
  date?: string;
  mark?: string;
  sortOrder?: number;
};

export default function ExamResultsPage() {
  const avatar = PlaceHolderImages.find((img) => img.id === 'avatar1');
  const { user } = useAuth();
  const profilePictureUrl = getStorageFileUrl(STORAGE_BUCKETS.PROFILE_PICTURES, '6975f52f001991d9d07c');
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profile = {
    name: 'Shikhar Chauhan',
    studentId: 'Bennett University',
    program: 'Semester - 4 | 2026-2027',
    status: 'Active' as const,
    avatarUrl: profilePictureUrl,
    avatarHint: avatar?.imageHint || 'student portrait',
  };

  useEffect(() => {
    const userId = user?.$id;
    if (!userId) {
      setLoading(false);
      return;
    }
    const uid = userId;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await getResultsAction(uid);
        if (result.success) {
          const rows = (result.data as ExamResult[])
            .filter((r) => r.recordType === 'exam')
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          setExams(rows);
        } else {
          setExams([]);
          setError(result.error || 'Failed to load exam results');
        }
      } catch (err: unknown) {
        setExams([]);
        setError(err instanceof Error ? err.message : 'Failed to load exam results');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.$id]);

  function examToRows(exam: ExamResult) {
    return [
      { label: 'MAIN EXAM SUBJECT', value: exam.mainExamSubject || '-' },
      { label: 'EXAM SUBJECT', value: exam.examSubject || '-' },
      { label: 'EXAM CODE', value: exam.examCode || '-' },
      { label: 'DATE', value: exam.date || '-' },
      { label: 'MARK', value: exam.mark || '-' },
    ];
  }

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
          <div className="flex items-center gap-4">
            <Link href="/my-exam-schedule" className="p-2 rounded-full hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-xl font-semibold">Internal Consolidation result</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : exams.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No exam results found.</p>
          ) : (
            exams.map((exam) => (
              <Card key={exam.$id}>
                <CardContent className="p-4">
                  <dl className="divide-y divide-border">
                    {examToRows(exam).map((detail) => (
                      <div className="grid grid-cols-2 gap-2 py-3 text-sm" key={detail.label}>
                        <dt className="text-muted-foreground">{detail.label}</dt>
                        <dd className="font-medium text-right">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
