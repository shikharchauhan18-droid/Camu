import { Client, Databases, Query } from 'appwrite';

// Initialize Appwrite client for server-side use
const getServerClient = () => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

  return new Databases(client);
};

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const COLLECTIONS = {
  STUDENTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_STUDENTS || 'students',
  ATTENDANCE: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ATTENDANCE || 'attendances_',
  COURSES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_COURSES || 'Courses',
  ANNOUNCEMENTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ANNOUNCEMENTS || 'announcements',
  PASSES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PASSES || 'passes',
  ABSENT_LOGS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ABSENT_LOGS || 'absent_logs',
  RESULTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_RESULTS || 'results',
  CURR_ROOM_STAT: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CURR_ROOM_STAT || 'CurrRoomStat',
  ROOM_PARTNER_OPTION: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOM_PARTNER_OPTION || 'RoomPartnerOption',
} as const;

/**
 * Database service for student data
 */
export class DatabaseService {
  /**
   * Get student profile by user ID
   * Searches by userId attribute in the students collection
   */
  static async getStudentProfile(userId: string) {
    try {
      const databases = getServerClient();
      // Query by userId attribute
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENTS,
        [Query.equal('userId', userId)]
      );

      if (response.documents.length > 0) {
        return { success: true, data: response.documents[0] };
      }
      return { success: false, data: null, error: 'Student profile not found' };
    } catch (error: any) {
      console.error('Error fetching student profile:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * Get the first student document from the students collection.
   * Used when there is only one record (or one active record) in the collection,
   * not tied to a specific userId.
   */
  static async getFirstStudentProfile() {
    try {
      const databases = getServerClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENTS,
        [Query.limit(1)]
      );
      if (response.documents.length > 0) {
        return { success: true, data: response.documents[0] };
      }
      return { success: false, data: null, error: 'Student profile not found' };
    } catch (error: any) {
      console.error('Error fetching first student profile:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * Get attendance records for a student
   */
  static async getAttendanceRecords(userId: string, semester?: string) {
    try {
      const databases = getServerClient();
      const queries = [Query.equal('userId', userId)];
      if (semester) {
        queries.push(Query.equal('semester', semester));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ATTENDANCE,
        queries
      );

      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get courses for a student (by userId - legacy)
   */
  static async getStudentCourses(userId: string) {
    try {
      const databases = getServerClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COURSES,
        [Query.equal('userId', userId)]
      );

      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get all courses from the Courses collection for the course registration tab.
   * Fields: course_name, Course_code, credits
   */
  static async getAllCourses() {
    try {
      const databases = getServerClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COURSES,
        [Query.limit(100)]
      );
      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Error fetching all courses:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get current room status details from CurrRoomStat collection.
   * Fields: Hostel, Room_No, Name, Course, Enrollment_Number
   */
  static async getCurrRoomStat() {
    try {
      const databases = getServerClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CURR_ROOM_STAT,
        [Query.limit(1)]
      );
      if (response.documents.length > 0) {
        return { success: true, data: response.documents[0] };
      }
      return { success: false, data: null, error: 'No room status found' };
    } catch (error: any) {
      console.error('Error fetching current room status:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * Get room partner options from RoomPartnerOption collection.
   * Fields: tname, course, enrollment_number
   */
  static async getRoomPartnerOptions() {
    try {
      const databases = getServerClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ROOM_PARTNER_OPTION,
        [Query.limit(50)]
      );
      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Error fetching room partner options:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get announcements
   */
  static async getAnnouncements(limit: number = 10) {
    try {
      const databases = getServerClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ANNOUNCEMENTS,
        [Query.limit(limit), Query.orderDesc('$createdAt')]
      );

      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Create or update student profile
   * Searches by userId attribute and updates or creates accordingly
   */
  static async upsertStudentProfile(userId: string, profileData: any) {
    try {
      const databases = getServerClient();
      // Check if profile exists by querying userId attribute
      const existing = await this.getStudentProfile(userId);

      if (existing.success && existing.data) {
        // Update existing document
        const response = await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.STUDENTS,
          existing.data.$id,
          {
            userId,
            ...profileData
          }
        );
        return { success: true, data: response };
      } else {
        // Create new document with userId attribute
        const response = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.STUDENTS,
          'unique()', // Appwrite will generate document ID
          {
            userId,
            ...profileData
          }
        );
        return { success: true, data: response };
      }
    } catch (error: any) {
      console.error('Error upserting student profile:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * Create a new pass (gate pass or leave out pass)
   */
  static async createPass(userId: string, passData: {
    passType: 'gate' | 'leaveOut';
    date?: string;
    time?: string;
    exitTime?: string;
    entryTime?: string;
    reason?: string;
    status?: string;
  }) {
    try {
      const databases = getServerClient();
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PASSES,
        'unique()',
        {
          userId,
          ...passData
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Error creating pass:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * Get all passes for a user
   */
  static async getPasses(userId: string) {
    try {
      const databases = getServerClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PASSES,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt')
        ]
      );
      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Error fetching passes:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get all absent logs for a user
   */
  static async getAbsentLogs(userId: string) {
    try {
      const databases = getServerClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ABSENT_LOGS,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );
      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Error fetching absent logs:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Get all result records for a user (semester summaries, courses, exams)
   */
  static async getResults(userId: string) {
    try {
      const databases = getServerClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.RESULTS,
        [Query.equal('userId', userId), Query.orderAsc('sortOrder'), Query.limit(500)]
      );
      return { success: true, data: response.documents };
    } catch (error: any) {
      console.error('Error fetching results:', error);
      return { success: false, data: [], error: error.message };
    }
  }
}
