
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/profile-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const dues = [
  { receiptNo: '24-25/11', dueDate: '15-Jul-2024', amount: '2,02,500', paidAmount: '0', balance: '2,02,500', status: 'Not Paid' },
  { receiptNo: '24-25/10', dueDate: '15-Jul-2024', amount: '5,000', paidAmount: '5,000', balance: '0', status: 'Paid' },
  { receiptNo: '23-24/11', dueDate: '02-Feb-2024', amount: '1,52,500', paidAmount: '1,52,500', balance: '0', status: 'Paid' },
  { receiptNo: '23-24/10', dueDate: '02-Feb-2024', amount: '5,000', paidAmount: '5,000', balance: '0', status: 'Paid' },
  { receiptNo: '23-24/09', dueDate: '06-Jul-2023', amount: '2,50,000', paidAmount: '2,50,000', balance: '0', status: 'Paid' },
];

export default function MyDuesPage() {
  const avatar = PlaceHolderImages.find((img) => img.id === 'avatar1');

  const profile = {
    name: 'Shikhar Chauhan',
    studentId: 'Bennett University',
    program: 'Semester - 4 | 2026-2027',
    status: 'Active' as const,
    avatarUrl: avatar?.imageUrl || 'https://picsum.photos/seed/1/200/200',
    avatarHint: avatar?.imageHint || 'student portrait',
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <ProfileCard profile={profile} />
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold">Happy New Year</h2>
              <p className="text-muted-foreground">Use camu with New Interface</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fee Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt no.</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dues.map((due) => (
                    <TableRow key={due.receiptNo}>
                      <TableCell>{due.receiptNo}</TableCell>
                      <TableCell>{due.dueDate}</TableCell>
                      <TableCell>{due.amount}</TableCell>
                      <TableCell>{due.paidAmount}</TableCell>
                      <TableCell>{due.balance}</TableCell>
                      <TableCell>
                        <Badge variant={due.status === 'Paid' ? 'secondary' : 'destructive'}>{due.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
