'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { 
  getStudentProfileAction, 
  getAttendanceRecordsAction, 
  getStudentCoursesAction 
} from '@/lib/client-actions';
import { StudentProfile, AttendanceRecord, Course } from '@/types/student';

export function useStudentData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile
        const profileResult = await getStudentProfileAction(user.$id);
        if (profileResult.success && profileResult.data) {
          setProfile(profileResult.data as any);
        }

        // Fetch attendance
        const attendanceResult = await getAttendanceRecordsAction(user.$id);
        if (attendanceResult.success) {
          setAttendance(attendanceResult.data as any[]);
        }

        // Fetch courses
        const coursesResult = await getStudentCoursesAction(user.$id);
        if (coursesResult.success) {
          setCourses(coursesResult.data as any[]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch student data');
        console.error('Error fetching student data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return { profile, attendance, courses, loading, error };
}
