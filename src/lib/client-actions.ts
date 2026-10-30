import { DatabaseService } from '@/lib/appwrite-db';
import { StudentProfile, AttendanceRecord, Course } from '@/types/student';
import { z } from 'zod';

const FormSchema = z.object({
  interests: z.string().min(3, { message: "Please enter at least one interest of 3 or more characters." }),
  academicProgram: z.string(),
});

export type NewsFeedState = {
  message?: string | null;
  news?: string[];
  errors?: {
    interests?: string[];
  };
  success: boolean;
};

// Client-side versions of the server actions
export async function getStudentProfileAction(userId: string) {
  return await DatabaseService.getStudentProfile(userId);
}

export async function getAttendanceRecordsAction(userId: string, semester?: string) {
  return await DatabaseService.getAttendanceRecords(userId, semester);
}

export async function getStudentCoursesAction(userId: string) {
  return await DatabaseService.getStudentCourses(userId);
}

export async function getFirstStudentProfileAction() {
  return await DatabaseService.getFirstStudentProfile();
}

export async function getAllCoursesAction() {
  return await DatabaseService.getAllCourses();
}

export async function getCurrRoomStatAction() {
  return await DatabaseService.getCurrRoomStat();
}

export async function getRoomPartnerOptionsAction() {
  return await DatabaseService.getRoomPartnerOptions();
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

// Simplified version for static export - returns mock data
export async function getPersonalizedNews(
  prevState: NewsFeedState,
  formData: FormData
): Promise<NewsFeedState> {
  const validatedFields = FormSchema.safeParse({
    interests: formData.get('interests'),
    academicProgram: formData.get('academicProgram'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid interests. Please correct the errors.',
      success: false,
    };
  }
  
  const { interests, academicProgram } = validatedFields.data;

  // Mock news feed for static export
  const mockNews = [
    `${academicProgram} Orientation: Welcome to the new semester!`,
    `Campus Event: ${interests} club meeting scheduled for next week`,
    `Academic Update: New course materials available for ${academicProgram}`,
    `Student Life: Join us for the annual ${interests} festival`,
    `Library News: New resources added for ${academicProgram} students`
  ];

  return {
    news: mockNews,
    message: 'Your personalized news feed is ready!',
    success: true,
  };
}
