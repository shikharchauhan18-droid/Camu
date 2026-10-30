import { Client, Account, Databases, Storage } from 'appwrite';

// Appwrite configuration
const appwriteEndpoint = 'https://fra.cloud.appwrite.io/v1';
const appwriteProjectId = '697257f10008a4cad661';

// Initialize Appwrite client
// Note: For browser environments, Appwrite automatically handles cookies
export const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and Collection IDs (you'll need to create these in Appwrite)
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const COLLECTIONS = {
  STUDENTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_STUDENTS || 'students',
  ATTENDANCE: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ATTENDANCE || 'attendance',
  COURSES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_COURSES || 'courses',
  ANNOUNCEMENTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ANNOUNCEMENTS || 'announcements',
  PASSES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PASSES || 'passes',
  RESULTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_RESULTS || 'results',
} as const;

// Storage bucket IDs
export const STORAGE_BUCKETS = {
  PROFILE_PICTURES: '6975f4d7002aeec39a56',
} as const;

/**
 * Get the public URL for a file in Appwrite storage
 * @param bucketId - The storage bucket ID
 * @param fileId - The file ID
 * @returns The public URL to view the file
 */
export function getStorageFileUrl(bucketId: string, fileId: string): string {
  return `${appwriteEndpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${appwriteProjectId}`;
}
