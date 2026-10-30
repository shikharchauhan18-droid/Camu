/**
 * Seed Semester 1 results into Appwrite `results` collection.
 *
 * Usage:
 *   node scripts/seed-sem1-results.mjs <APPWRITE_USER_ID>
 *
 * Requires in .env.local:
 *   APPWRITE_API_KEY=...   (API key with databases.write scope)
 *   NEXT_PUBLIC_APPWRITE_PROJECT_ID
 *   NEXT_PUBLIC_APPWRITE_DATABASE_ID
 *   NEXT_PUBLIC_APPWRITE_ENDPOINT (optional, defaults to fra.cloud)
 *
 * Optional: NEXT_PUBLIC_APPWRITE_COLLECTION_RESULTS=results
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { Client, Databases, ID, Query } from 'node-appwrite';

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const endpoint =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_RESULTS || 'results';
const apiKey = process.env.APPWRITE_API_KEY;

const userIdArg = process.argv[2] || process.env.SEED_USER_ID;

if (!projectId || !databaseId) {
  console.error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID or NEXT_PUBLIC_APPWRITE_DATABASE_ID in .env.local');
  process.exit(1);
}

if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY in .env.local (create an API key with databases.write in Appwrite Console)');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

const SEMESTER = '1';
const TERM_TYPE = 'odd';

const semesterDoc = {
  userId: '',
  recordType: 'semester',
  termType: TERM_TYPE,
  semester: SEMESTER,
  sortOrder: 0,
  title: 'Result of semester 01',
  sgpa: '5.36',
  cgpa: '4.36',
  credits: '22 / 22',
};

const courses = [
  {
    sortOrder: 1,
    semesterLabel: 'Semester - 1',
    courseCode: 'EMAT10L',
    courseName: 'Engineering Calculus',
    credit: '4',
    gradePoint: '4',
    grades: 'D',
    resultStatus: 'Pass',
  },
  {
    sortOrder: 2,
    semesterLabel: 'Semester - 1',
    courseCode: 'EECE105L',
    courseName: 'Fundamentals of Electronic and Electrical Engineering',
    credit: '5',
    gradePoint: '6',
    grades: 'C+',
    resultStatus: 'Pass',
  },
  {
    sortOrder: 3,
    semesterLabel: 'Sem-1-Supplementary',
    courseCode: 'PHY105L',
    courseName: 'Electromagnetics',
    credit: '3',
    gradePoint: '0',
    grades: 'F',
    resultStatus: 'Fail',
  },
  {
    sortOrder: 4,
    semesterLabel: 'Semester - 1',
    courseCode: 'SEA105P',
    courseName: 'Introduction to Engineering',
    credit: '2',
    gradePoint: '9',
    grades: 'A',
    resultStatus: 'Pass',
  },
  {
    sortOrder: 5,
    semesterLabel: 'Semester - 1',
    courseCode: 'HSS103L',
    courseName: 'New Age Life Skills',
    credit: '3',
    gradePoint: '8',
    grades: 'B+',
    resultStatus: 'Pass',
  },
  {
    sortOrder: 6,
    semesterLabel: 'Semester - 1',
    courseCode: 'CSET101L',
    courseName: 'Computational Thinking and Programming',
    credit: '4',
    gradePoint: '4',
    grades: 'C',
    resultStatus: 'Pass',
  },
];

async function resolveUserId() {
  if (userIdArg) return userIdArg;

  const studentsCol = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_STUDENTS || 'students';
  const list = await databases.listDocuments(databaseId, studentsCol, [Query.limit(1)]);
  if (list.documents.length === 0) {
    throw new Error('No userId provided and no documents in students collection. Pass userId as first argument.');
  }
  const doc = list.documents[0];
  const uid = doc.userId || doc.$id;
  console.log(`Using userId from students collection: ${uid}`);
  return uid;
}

async function main() {
  const userId = await resolveUserId();

  console.log(`Seeding Semester 1 results for userId: ${userId}`);
  console.log(`Database: ${databaseId}, Collection: ${collectionId}`);

  const sem = await databases.createDocument(databaseId, collectionId, ID.unique(), {
    ...semesterDoc,
    userId,
  });
  console.log(`Created semester summary: ${sem.$id}`);

  for (const course of courses) {
    const doc = await databases.createDocument(databaseId, collectionId, ID.unique(), {
      userId,
      recordType: 'course',
      termType: TERM_TYPE,
      semester: SEMESTER,
      ...course,
    });
    console.log(`Created course ${course.courseCode}: ${doc.$id}`);
  }

  console.log('\nDone. Open Final Result → View result of odd semester → Result of semester 01');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
