'use client';

import { useState, useEffect } from 'react';
import { getFirstStudentProfileAction } from '@/lib/client-actions';
import { getStorageFileUrl, STORAGE_BUCKETS } from '@/lib/appwrite';

/**
 * Fetches the single student profile record from the students collection.
 * Returns a profile object shaped for use with ProfileCard and detail displays.
 */
export function useProfileData() {
  const [studentData, setStudentData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const result = await getFirstStudentProfileAction();
        if (result.success && result.data) {
          setStudentData(result.data as Record<string, any>);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch student profile');
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Build the profile card object from DB data
  const profilePictureUrl = getStorageFileUrl(STORAGE_BUCKETS.PROFILE_PICTURES, '6975f52f001991d9d07c');

  const profile = {
    name: studentData?.name || 'Student',
    studentId: studentData?.college || studentData?.studentId || 'Bennett University',
    program: studentData?.semester
      ? `${studentData.semester} | ${studentData.admissionYear || ''}`
      : (studentData?.program || 'Bennett University'),
    status: (studentData?.status || 'Active') as 'Active' | 'On Leave',
    avatarUrl: studentData?.avatarUrl || profilePictureUrl,
    avatarHint: 'student portrait',
  };

  return { profile, studentData, loading, error };
}
