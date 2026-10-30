'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ProfileCard from '@/components/profile-card';
import { useAuth } from '@/contexts/auth-context';
import { getAbsentLogsAction, getAttendanceRecordsAction } from '@/lib/client-actions';
import { useProfileData } from '@/hooks/use-profile-data';
import type { AttendanceDocument, AttendanceRecord } from '@/types/student';

type AbsentLog = {
  $id: string;
  subject?: string;
  classTime?: string;
  date?: string;
  $createdAt?: string;
};

type ChartSubjectRow = {
  subject: string;
  attendance: number;
  label: string;
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

const SEMESTER_LABELS: Record<string, string> = {
  '1': '2024-2025,Semester - 1,B.Tech.(ECE)',
  sem1: '2024-2025,Semester - 1,B.Tech.(ECE)',
  '2': '2024-2025,Semester - 2,B.Tech.(ECE)',
  sem2: '2024-2025,Semester - 2,B.Tech.(ECE)',
  '3': '2025-2026,Semester - 3,B.Tech.(ECE)',
  sem3: '2025-2026,Semester - 3,B.Tech.(ECE)',
  '4': '2026-2027,Semester - 4,B.Tech.(ECE)',
  sem4: '2026-2027,Semester - 4,B.Tech.(ECE)',
  '5': '2027-2028,Semester - 5,B.Tech.(ECE)',
  sem5: '2027-2028,Semester - 5,B.Tech.(ECE)',
  '6': '2027-2028,Semester - 6,B.Tech.(ECE)',
  sem6: '2027-2028,Semester - 6,B.Tech.(ECE)',
  '7': '2028-2029,Semester - 7,B.Tech.(ECE)',
  sem7: '2028-2029,Semester - 7,B.Tech.(ECE)',
  '8': '2028-2029,Semester - 8,B.Tech.(ECE)',
  sem8: '2028-2029,Semester - 8,B.Tech.(ECE)',
};

function normalizeAttendanceRecord(doc: AttendanceDocument): AttendanceRecord {
  return {
    $id: doc.$id,
    userId: doc.userId,
    semester: doc.semester,
    subject: doc.subject,
    subjectCode: doc.SubjectCode ?? doc.subjectCode ?? doc.subject,
    subjectLabel: doc.SubjectLabel ?? doc.subjectLabel ?? doc.subject,
    attendance: Number(doc.attendance) || 0,
    present: doc.present != null ? Number(doc.present) : undefined,
    absent: doc.absent != null ? Number(doc.absent) : undefined,
    total: doc.total != null ? Number(doc.total) : undefined,
  };
}

function semesterSortKey(semester: string): number {
  const match = semester.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function semesterDisplayLabel(semester: string): string {
  return SEMESTER_LABELS[semester] ?? `Semester ${semester}`;
}

function recordsToChartData(records: AttendanceRecord[]): ChartSubjectRow[] {
  return records.map((r) => ({
    subject: r.subjectCode,
    attendance: r.attendance,
    label: r.subjectLabel,
  }));
}

function computeOverallPie(records: AttendanceRecord[]) {
  let present = 0;
  let absent = 0;

  for (const r of records) {
    if (r.present != null && r.absent != null) {
      present += r.present;
      absent += r.absent;
    }
  }

  if (present + absent === 0 && records.length > 0) {
    const avg =
      records.reduce((sum, r) => sum + r.attendance, 0) / records.length;
    const presentPct = Math.round(avg);
    return [
      { name: 'Present', value: presentPct },
      { name: 'Absent', value: 100 - presentPct },
    ];
  }

  const total = present + absent;
  if (total === 0) {
    return [
      { name: 'Present', value: 0 },
      { name: 'Absent', value: 0 },
    ];
  }

  const presentPct = Math.round((present / total) * 100);
  return [
    { name: 'Present', value: presentPct },
    { name: 'Absent', value: 100 - presentPct },
  ];
}

export default function AttendancePage() {
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const { profile } = useProfileData();
  const { user } = useAuth();

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [absentLogs, setAbsentLogs] = useState<AbsentLog[]>([]);
  const [absentLogsLoading, setAbsentLogsLoading] = useState(true);
  const [absentLogsError, setAbsentLogsError] = useState<string | null>(null);

  const availableSemesters = useMemo(() => {
    const unique = [...new Set(attendanceRecords.map((r) => r.semester))];
    return unique.sort((a, b) => semesterSortKey(a) - semesterSortKey(b));
  }, [attendanceRecords]);

  useEffect(() => {
    if (availableSemesters.length === 0) return;
    if (!selectedSemester || !availableSemesters.includes(selectedSemester)) {
      setSelectedSemester(availableSemesters[availableSemesters.length - 1]);
    }
  }, [availableSemesters, selectedSemester]);

  const semesterRecords = useMemo(
    () => attendanceRecords.filter((r) => r.semester === selectedSemester),
    [attendanceRecords, selectedSemester]
  );

  const attendanceData = useMemo(
    () => recordsToChartData(semesterRecords),
    [semesterRecords]
  );

  const overallAttendanceData = useMemo(
    () => computeOverallPie(semesterRecords),
    [semesterRecords]
  );

  const overallPercentage = useMemo(() => {
    const present = overallAttendanceData.find((d) => d.name === 'Present')?.value ?? 0;
    return present;
  }, [overallAttendanceData]);

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value);
  };

  useEffect(() => {
    const userId = user?.$id;
    if (!userId) {
      setAttendanceLoading(false);
      return;
    }
    const uid: string = userId;

    async function fetchAttendance() {
      try {
        setAttendanceLoading(true);
        setAttendanceError(null);
        const result = await getAttendanceRecordsAction(uid);
        if (result.success) {
          const normalized = (result.data as AttendanceDocument[]).map(normalizeAttendanceRecord);
          setAttendanceRecords(normalized);
        } else {
          setAttendanceRecords([]);
          setAttendanceError(result.error || 'Failed to fetch attendance');
        }
      } catch (err: unknown) {
        setAttendanceRecords([]);
        setAttendanceError(err instanceof Error ? err.message : 'Failed to fetch attendance');
      } finally {
        setAttendanceLoading(false);
      }
    }

    fetchAttendance();
  }, [user?.$id]);

  useEffect(() => {
    const userId = user?.$id;
    if (!userId) {
      setAbsentLogsLoading(false);
      return;
    }
    const uid: string = userId;

    async function fetchAbsentLogs() {
      try {
        setAbsentLogsLoading(true);
        setAbsentLogsError(null);
        const result = await getAbsentLogsAction(uid);
        if (result.success) {
          setAbsentLogs(result.data as AbsentLog[]);
        } else {
          setAbsentLogs([]);
          setAbsentLogsError(result.error || 'Failed to fetch absent logs');
        }
      } catch (err: unknown) {
        setAbsentLogs([]);
        setAbsentLogsError(err instanceof Error ? err.message : 'Failed to fetch absent logs');
      } finally {
        setAbsentLogsLoading(false);
      }
    }

    fetchAbsentLogs();
  }, [user?.$id]);

  const attendanceContent = () => {
    if (attendanceLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="mt-2 text-sm text-muted-foreground">Loading attendance...</p>
          </div>
        </div>
      );
    }

    if (attendanceError) {
      return (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {attendanceError}
        </div>
      );
    }

    if (attendanceRecords.length === 0) {
      return (
        <div className="text-center py-16 text-sm text-muted-foreground">
          No attendance records found.
        </div>
      );
    }

    return null;
  };

  const emptyOrLoading = attendanceContent();

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
        <div className="mx-auto max-w-4xl space-y-6">
          <ProfileCard profile={profile} />
          <Tabs defaultValue="subject-wise">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="subject-wise">Subject-wise</TabsTrigger>
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="absent-log">Absent log</TabsTrigger>
            </TabsList>
            <TabsContent value="subject-wise">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Subject-wise Attendance % / 2026-2027</CardTitle>
                  {availableSemesters.length > 0 && (
                    <div className="pt-2">
                      <Select value={selectedSemester} onValueChange={handleSemesterChange}>
                        <SelectTrigger className="w-full sm:w-[280px]">
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSemesters.map((sem) => (
                            <SelectItem key={sem} value={sem}>
                              {semesterDisplayLabel(sem)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {emptyOrLoading ?? (
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={attendanceData}
                          margin={{
                            top: 5,
                            right: 0,
                            left: -20,
                            bottom: 120,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="label"
                            interval={0}
                            angle={-60}
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 'var(--radius)',
                              border: '1px solid hsl(var(--border))',
                              background: 'hsl(var(--background))',
                            }}
                            labelFormatter={() => ''}
                            formatter={(value, _name, props) => [
                              `${value}%`,
                              props.payload.label.split(' - ')[0],
                            ]}
                          />
                          <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="overall">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Overall Attendance Percentage</CardTitle>
                  <CardDescription>
                    {selectedSemester
                      ? semesterDisplayLabel(selectedSemester)
                      : 'Select a semester'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {emptyOrLoading ?? (
                    <div className="w-full h-64 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={overallAttendanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius="70%"
                            outerRadius="90%"
                            startAngle={90}
                            endAngle={450}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                          >
                            {overallAttendanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">{overallPercentage}%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="absent-log">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Absent log</CardTitle>
                  <CardDescription>All absent class records</CardDescription>
                </CardHeader>
                <CardContent>
                  {absentLogsLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading absent log...</p>
                      </div>
                    </div>
                  ) : absentLogsError ? (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                      {absentLogsError}
                    </div>
                  ) : absentLogs.length === 0 ? (
                    <div className="text-center py-10 text-sm text-muted-foreground">
                      No absent records found.
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <div className="grid grid-cols-3 gap-2 bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground">
                        <div>SUBJECT</div>
                        <div>CLASS TIME</div>
                        <div>DATE</div>
                      </div>
                      <div>
                        {absentLogs.map((row) => (
                          <div
                            key={row.$id}
                            className="grid grid-cols-3 gap-2 px-3 py-2 text-sm border-t last:border-b-0"
                          >
                            <div className="truncate font-medium">{row.subject || '-'}</div>
                            <div className="truncate">{row.classTime || '-'}</div>
                            <div className="truncate">{row.date || '-'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <p className="text-center text-sm text-muted-foreground mt-4">
            As your ward keeps being absent the attendance percentage will keep decreasing from 100%
            in every subject class in which he/ she is absent
          </p>
        </div>
      </main>
    </div>
  );
}
