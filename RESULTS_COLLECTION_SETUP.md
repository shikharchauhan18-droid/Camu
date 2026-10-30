# Results Collection Setup Guide

## Collection: `results`

One collection stores **semester summaries**, **course results** (Final Result page), and **exam results** (Internal Consolidation page). Use `recordType` to distinguish rows.

### Create Collection

1. Appwrite Console → Databases → your database
2. **Create Collection**
3. Collection ID: `results`
4. Name: `Results`

### Attributes

| Attribute Key | Type | Size | Required | Notes |
|--------------|------|------|----------|-------|
| `userId` | String | 36 | ✅ Yes | Appwrite User ID |
| `recordType` | String | 20 | ✅ Yes | `semester`, `course`, or `exam` |
| `termType` | String | 10 | ❌ No | `odd` or `even` (Final Result grouping) |
| `semester` | String | 10 | ❌ No | e.g. `1`, `2`, `3`, `4` |
| `sortOrder` | Integer | — | ❌ No | Display order (lower = first). Default `0`. |
| `title` | String | 100 | ❌ No | Semester card title, e.g. `Result of semester 03` |
| `sgpa` | String | 20 | ❌ No | Semester summary only |
| `cgpa` | String | 20 | ❌ No | Semester summary only |
| `credits` | String | 30 | ❌ No | Semester summary only, e.g. `22 / 22` |
| `semesterLabel` | String | 50 | ❌ No | Course row: e.g. `SEM - 03` |
| `courseCode` | String | 50 | ❌ No | Course row |
| `courseName` | String | 255 | ❌ No | Course row |
| `credit` | String | 10 | ❌ No | Course row |
| `gradePoint` | String | 10 | ❌ No | Course row |
| `grades` | String | 10 | ❌ No | Course row, e.g. `A`, `B+`, `F` |
| `resultStatus` | String | 20 | ❌ No | Course row: `Pass` or `Fail` |
| `mainExamSubject` | String | 255 | ❌ No | Exam row (Internal Consolidation) |
| `examSubject` | String | 255 | ❌ No | Exam row |
| `examCode` | String | 100 | ❌ No | Exam row |
| `date` | String | 30 | ❌ No | Exam row |
| `mark` | String | 30 | ❌ No | Exam row, e.g. `20/25` |

### Indexes

- **userId** (Key) on `userId`
- **userId_recordType** (Key) on `userId`, `recordType` (optional, for filtering)

### Permissions

- **Users** role: Read Documents, Create Documents (if students should not create, use Admin/API only for create)

---

## How to add data

### 1) Semester summary (`recordType` = `semester`)

One document per semester per student.

```json
{
  "userId": "YOUR_USER_ID",
  "recordType": "semester",
  "termType": "odd",
  "semester": "3",
  "sortOrder": 3,
  "title": "Result of semester 03",
  "sgpa": "8.1",
  "cgpa": "8.1",
  "credits": "22 / 22"
}
```

### 2) Course result (`recordType` = `course`)

One document per subject. Use the same `semester` and `termType` as the semester summary.

```json
{
  "userId": "YOUR_USER_ID",
  "recordType": "course",
  "termType": "odd",
  "semester": "3",
  "sortOrder": 1,
  "semesterLabel": "SEM - 03",
  "courseCode": "EECE212L",
  "courseName": "SIGNALS AND SYSTEMS",
  "credit": "5",
  "gradePoint": "5",
  "grades": "A",
  "resultStatus": "Pass"
}
```

### 3) Internal exam result (`recordType` = `exam`)

Shown on **Exam Results** / Internal Consolidation page.

```json
{
  "userId": "YOUR_USER_ID",
  "recordType": "exam",
  "sortOrder": 1,
  "mainExamSubject": "Quality and Reliability Engineering",
  "examSubject": "Mid-Semester Exam-1",
  "examCode": "Mid-Semester Exam-1",
  "date": "06-Oct-2025",
  "mark": "20/25"
}
```

---

## UI mapping

| App page | `recordType` values used |
|----------|-------------------------|
| `/final-result` | `semester` + `course`, grouped by `termType` → `semester` |
| `/exam-results` | `exam` |

**termType:** `odd` → “View result of odd semester”, `even` → “View result of even semester”.
