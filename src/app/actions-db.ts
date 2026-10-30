import { DatabaseService } from '@/lib/appwrite-db';
import { StudentProfile, AttendanceRecord, Course } from '@/types/student';

export async function getStudentProfileAction(userId: string) {
  return await DatabaseService.getStudentProfile(userId);
}

export async function getAttendanceRecordsAction(userId: string, semester?: string) {
  return await DatabaseService.getAttendanceRecords(userId, semester);
}

export async function getStudentCoursesAction(userId: string) {
  return await DatabaseService.getStudentCourses(userId);
}

export async function getAnnouncementsAction(limit: number = 10) {
  return await DatabaseService.getAnnouncements(limit);
}

export async function createPassAction(userId: string, passData: {
  passType: 'gate' | 'leaveOut';
  date?: string;
  time?: string;
  exitTime?: string;
  entryTime?: string;
  reason?: string;
  status?: string;
}) {
  return await DatabaseService.createPass(userId, passData);
}

export async function getPassesAction(userId: string) {
  return await DatabaseService.getPasses(userId);
}

export async function getAbsentLogsAction(userId: string) {
  return await DatabaseService.getAbsentLogs(userId);
}

export async function getResultsAction(userId: string) {
  return await DatabaseService.getResults(userId);
}
