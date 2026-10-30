
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ProfileCard from '@/components/profile-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/contexts/auth-context';
import { getResultsAction } from '@/app/actions-db';
import { getStorageFileUrl, STORAGE_BUCKETS } from '@/lib/appwrite';

type ResultRecord = {
  $id: string;
  recordType: 'semester' | 'course' | 'exam';
  termType?: string;
  semester?: string;
  sortOrder?: number;
  title?: string;
  sgpa?: string;
  cgpa?: string;
  credits?: string;
  semesterLabel?: string;
  courseCode?: string;
  courseName?: string;
  credit?: string;
  gradePoint?: string;
  grades?: string;
  resultStatus?: string;
};

type SemesterGroup = {
  semester: string;
  summary: ResultRecord | null;
  courses: ResultRecord[];
};

type DetailRow = {
  label: string;
  value: string;
  isBadge?: boolean;
  isFail?: boolean;
};

function groupByTerm(records: ResultRecord[], termType: 'odd' | 'even'): SemesterGroup[] {
  const semesters = records.filter((r) => r.recordType === 'semester' && r.termType === termType);
  const courses = records.filter((r) => r.recordType === 'course' && r.termType === termType);

  const semesterIds = new Set<string>();
  semesters.forEach((s) => s.semester && semesterIds.add(s.semester));
  courses.forEach((c) => c.semester && semesterIds.add(c.semester));

  return Array.from(semesterIds)
    .sort((a, b) => Number(a) - Number(b) || a.localeCompare(b))
    .map((sem) => ({
      semester: sem,
      summary: semesters.find((s) => s.semester === sem) ?? null,
      courses: courses
        .filter((c) => c.semester === sem)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    }));
}

function courseToDetailRows(course: ResultRecord): DetailRow[] {
  const isFail = course.resultStatus?.toLowerCase() === 'fail';
  return [
    { label: 'SEMESTER', value: course.semesterLabel || '-' },
    { label: 'COURSE CODE', value: course.courseCode || '-' },
    { label: 'COURSE NAME', value: course.courseName || '-' },
    { label: 'CREDIT', value: course.credit || '-' },
    { label: 'GRADE POINT', value: course.gradePoint || '-' },
    { label: 'GRADES', value: course.grades || '-' },
    {
      label: 'RESULT STATUS',
      value: course.resultStatus || '-',
      isBadge: true,
      isFail,
    },
  ];
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SemesterResultCard({
  title,
  sgpa,
  cgpa,
  credits,
}: {
  title: string;
  sgpa: string;
  cgpa: string;
  credits: string;
}) {
  return (
    <Card className="mt-2">
      <CardHeader className="p-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm space-y-2">
        <StatRow label="SGPA" value={sgpa} />
        <StatRow label="CGPA" value={cgpa} />
        <StatRow label="CREDITS" value={credits} />
      </CardContent>
    </Card>
  );
}

function CourseResultDetails({ details }: { details: DetailRow[] }) {
  return (
    <Card className="mt-4">
      <CardContent className="p-4 space-y-3">
        {details.map((detail) => (
          <div key={detail.label} className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{detail.label}</span>
            {detail.isBadge ? (
              <Badge
                variant={detail.isFail ? 'destructive' : 'secondary'}
                className={cn(!detail.isFail && 'bg-green-100 text-green-800')}
              >
                {detail.value}
              </Badge>
            ) : (
              <span className="font-medium text-right">{detail.value}</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SemesterAccordionContent({ groups }: { groups: SemesterGroup[] }) {
  if (groups.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">No results for this term yet.</p>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {groups.map((group) => {
        const summary = group.summary;
        const title =
          summary?.title || `Result of semester ${String(group.semester).padStart(2, '0')}`;
        const triggerLabel = summary?.title || `Result of semester ${group.semester}`;

        return (
          <AccordionItem key={group.semester} value={`sem-${group.semester}`} className="border-b-0">
            <AccordionTrigger className="p-3 rounded-md border bg-card text-card-foreground shadow-sm hover:no-underline text-sm">
              {triggerLabel}
            </AccordionTrigger>
            <AccordionContent className="pt-2 px-1">
              <div className="flex flex-col space-y-2">
                {summary && (
                  <SemesterResultCard
                    title={title}
                    sgpa={summary.sgpa || '-'}
                    cgpa={summary.cgpa || '-'}
                    credits={summary.credits || '-'}
                  />
                )}
                {group.courses.map((course) => (
                  <CourseResultDetails key={course.$id} details={courseToDetailRows(course)} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default function FinalResultPage() {
  const avatar = PlaceHolderImages.find((img) => img.id === 'avatar1');
  const { user } = useAuth();
  const profilePictureUrl = getStorageFileUrl(STORAGE_BUCKETS.PROFILE_PICTURES, '6975f52f001991d9d07c');
  const [records, setRecords] = useState<ResultRecord[]>([]);
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
          setRecords(result.data as ResultRecord[]);
        } else {
          setRecords([]);
          setError(result.error || 'Failed to load results');
        }
      } catch (err: unknown) {
        setRecords([]);
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.$id]);

  const { oddGroups, evenGroups } = useMemo(() => {
    const finalOnly = records.filter((r) => r.recordType === 'semester' || r.recordType === 'course');
    return {
      oddGroups: groupByTerm(finalOnly, 'odd'),
      evenGroups: groupByTerm(finalOnly, 'even'),
    };
  }, [records]);

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
              <CardTitle>Final Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="odd-semester" className="border-b-0">
                    <AccordionTrigger className="w-full justify-start p-3 rounded-md border bg-card text-card-foreground shadow-sm hover:no-underline">
                      View result of odd semester
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 px-1">
                      <SemesterAccordionContent groups={oddGroups} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="even-semester" className="border-b-0 mt-4">
                    <AccordionTrigger className="w-full justify-start p-3 rounded-md border bg-card text-card-foreground shadow-sm hover:no-underline">
                      View result of even semester
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 px-1">
                      <SemesterAccordionContent groups={evenGroups} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
