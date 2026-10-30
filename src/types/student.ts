/**
 * Type definitions for student data
 */

export interface StudentProfile {
  $id?: string;
  userId: string;
  name: string;
  studentId: string;
  email: string;
  program: string;
  semester: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  avatarUrl?: string;
  
  // Personal details
  dob?: string;
  admissionNo?: string;
  admissionYear?: string;
  rollNo?: string;
  college?: string;
  curriculumPlan?: string;
  coursePlan?: string;
  degree?: string;
  department?: string;
  fathersName?: string;
  mothersName?: string;
  address?: string;
  city?: string;
  state?: string;
  
  // Academic details
  academicStanding?: string;
  academicClassification?: string;
  discountCategory?: string;
  intake?: string;
  programValidityDate?: string;
}

export interface AttendanceRecord {
  $id?: string;
  userId: string;
  semester: string;
  subject: string;
  subjectCode: string;
  subjectLabel: string;
  attendance: number; // percentage
  present?: number;
  absent?: number;
  total?: number;
}

/** Raw document shape from Appwrite attendance collection */
export type AttendanceDocument = AttendanceRecord & {
  SubjectCode?: string;
  SubjectLabel?: string;
};

export interface Course {
  $id?: string;
  userId: string;
  code: string;
  name: string;
  credits?: number;
  instructor?: string;
  schedule?: string;
  registered: boolean;
  semester?: string;
}

export interface Announcement {
  $id?: string;
  title: string;
  content: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  $createdAt?: string;
}
