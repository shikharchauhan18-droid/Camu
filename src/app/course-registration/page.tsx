
'use client';

import Link from 'next/link';
import { ArrowLeft, Book, CheckCircle, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getAllCoursesAction } from '@/lib/client-actions';
import { useProfileData } from '@/hooks/use-profile-data';
import ProfileCard from '@/components/profile-card';

type CourseRecord = {
  $id: string;
  course_name: string;
  Course_code: string;
  credits: number;
};

export default function CourseRegistrationPage() {
  const { profile, loading: profileLoading } = useProfileData();
  const { toast } = useToast();

  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [registeredCourses, setRegisteredCourses] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setCoursesLoading(true);
        const result = await getAllCoursesAction();
        if (result.success) {
          const docs = result.data as CourseRecord[];
          setCourses(docs);
          // Pre-register all courses on load
          setRegisteredCourses(docs.map((c) => c.Course_code));
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setCoursesLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleRegister = (courseCode: string) => {
    if (!registeredCourses.includes(courseCode)) {
      setRegisteredCourses([...registeredCourses, courseCode]);
      toast({
        title: 'Course Registered Successfully',
        description: `You have successfully registered for ${courseCode}.`,
        className: 'bg-green-100 text-green-800 border-green-200',
      });
    }
  };

  const isRegistered = (courseCode: string) => registeredCourses.includes(courseCode);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">Course Registration</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {!profileLoading && <ProfileCard profile={profile} />}

          <Card>
            <CardHeader>
              <CardTitle>Register for Courses</CardTitle>
              <CardDescription>Select courses for the upcoming semester.</CardDescription>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading courses...</p>
                  </div>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No courses found.
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <Card key={course.$id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Book className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-semibold">{course.course_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {course.Course_code} | {course.credits} Credits
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleRegister(course.Course_code)}
                          disabled={isRegistered(course.Course_code)}
                        >
                          {isRegistered(course.Course_code) ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Registered Successfully
                            </>
                          ) : (
                            <>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Select
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
