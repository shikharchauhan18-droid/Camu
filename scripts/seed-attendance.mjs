/**
 * Seed / update attendance records in Appwrite `attendances_` collection.
 *
 * Usage:
 *   node scripts/seed-attendance.mjs [APPWRITE_USER_ID]
 *
 * Requires in .env.local:
 *   APPWRITE_API_KEY
 *   NEXT_PUBLIC_APPWRITE_PROJECT_ID
 *   NEXT_PUBLIC_APPWRITE_DATABASE_ID
 *   NEXT_PUBLIC_APPWRITE_COLLECTION_ATTENDANCE (optional, default attendances_)
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
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ATTENDANCE || 'attendances_';
const apiKey = process.env.APPWRITE_API_KEY;
const userIdArg = process.argv[2] || process.env.SEED_USER_ID;

const attendanceDataSem1 = [
  { subject: 'ICIE111J', attendance: 71, label: 'The Startup Sprint' },
  { subject: '104P', attendance: 71, label: 'OBJECT ORIENTED PROGRAMMING USING C++' },
  { subject: '203L', attendance: 71, label: 'Network Analysis and Synthesis' },
  { subject: '207L', attendance: 71, label: 'Fundamentals of Logic Design and Testing' },
  { subject: 'MAT102L', attendance: 71, label: 'Linear Algebra and Ordinary Differential Equations' },
  { subject: '315L', attendance: 71, label: 'Linear Integrated Circuits' },
];

const attendanceDataSem2 = [
  { subject: 'ICIE111J', attendance: 79, label: 'The Startup Sprint' },
  { subject: '104P', attendance: 79, label: 'OBJECT ORIENTED PROGRAMMING USING C++' },
  { subject: '203L', attendance: 79, label: 'Network Analysis and Synthesis' },
  { subject: '207L', attendance: 79, label: 'Fundamentals of Logic Design and Testing' },
  { subject: 'MAT102L', attendance: 79, label: 'Linear Algebra and Ordinary Differential Equations' },
  { subject: '315L', attendance: 79, label: 'Linear Integrated Circuits' },
];

const attendanceDataSem3 = [
  { subject: '212L', attendance: 82, label: 'SIGNALS AND SYSTEMS' },
  { subject: '209L-P', attendance: 82, label: 'Analog Circuits - 1' },
  { subject: 'MAT205L', attendance: 82, label: 'COMPLEX ANALYSIS AND PARTIAL DIFFERENTIAL EQUATIONS' },
  { subject: 'HSS203L', attendance: 82, label: 'INTRODUCTION TO ECONOMICS AND FINANCE' },
  { subject: '301L', attendance: 82, label: 'Computer  network' },
];

const attendanceDataSem4 = [
  { subject: '212L', attendance: 100, label: 'EMBEDDED SYSTEMS DESIGN AND PROGRAMING' },
  { subject: '212L-T', attendance: 85, label: 'EMBEDDED SYSTEMS DESIGN AND PROGRAMING (T)' },
  { subject: '208P-P', attendance: 89, label: 'SENSORS AND ACTUATORS (P)' },
  { subject: '209L-P', attendance: 79, label: 'ANALOG CIRCUITS - 1 (P)' },
  { subject: 'MAT205L', attendance: 100, label: 'QUALITY AND RELIABILITY ENGINEERING' },
  { subject: '314L', attendance: 81, label: 'Computer  network' },
  { subject: '216P', attendance: 93, label: 'DATA STRUCTURES' },
];

const SEMESTERS = [
  { semester: '1', rows: attendanceDataSem1 },
  { semester: '2', rows: attendanceDataSem2 },
  { semester: '3', rows: attendanceDataSem3 },
  { semester: '4', rows: attendanceDataSem4 },
];

if (!projectId || !databaseId) {
  console.error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID or NEXT_PUBLIC_APPWRITE_DATABASE_ID in .env.local');
  process.exit(1);
}

if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY in .env.local');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

function toDocument(userId, semester, row) {
  const total = 100;
  const present = row.attendance;
  const absent = total - present;
  return {
    userId,
    semester,
    subject: row.subject,
    SubjectCode: row.subject,
    SubjectLabel: row.label,
    attendance: row.attendance,
    present,
    absent,
    total,
  };
}

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

async function deleteSemesterRecords(userId, semester) {
  let offset = 0;
  const limit = 100;
  let deleted = 0;

  while (true) {
    const page = await databases.listDocuments(databaseId, collectionId, [
      Query.equal('userId', userId),
      Query.equal('semester', semester),
      Query.limit(limit),
      Query.offset(offset),
    ]);

    if (page.documents.length === 0) break;

    for (const doc of page.documents) {
      await databases.deleteDocument(databaseId, collectionId, doc.$id);
      deleted++;
    }

    if (page.documents.length < limit) break;
    offset += limit;
  }

  return deleted;
}

async function main() {
  const userId = await resolveUserId();

  console.log(`Seeding attendance for userId: ${userId}`);
  console.log(`Database: ${databaseId}, Collection: ${collectionId}`);
  console.log(`Endpoint: ${endpoint}\n`);

  let totalCreated = 0;

  for (const { semester, rows } of SEMESTERS) {
    const removed = await deleteSemesterRecords(userId, semester);
    if (removed > 0) {
      console.log(`Semester ${semester}: removed ${removed} existing record(s)`);
    }

    for (const row of rows) {
      const payload = toDocument(userId, semester, row);
      const doc = await databases.createDocument(databaseId, collectionId, ID.unique(), payload);
      console.log(`Semester ${semester}: ${row.subject} (${row.attendance}%) → ${doc.$id}`);
      totalCreated++;
    }
  }

  console.log(`\nDone. Created ${totalCreated} attendance records across semesters 1–4.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
