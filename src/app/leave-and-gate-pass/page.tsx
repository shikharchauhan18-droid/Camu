
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProfileCard from '@/components/profile-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useProfileData } from '@/hooks/use-profile-data';
import { createPassAction, getPassesAction } from '@/lib/client-actions';

type Pass = {
  $id: string;
  passType: 'gate' | 'leaveOut';
  date?: string;
  time?: string;
  exitTime?: string;
  entryTime?: string;
  reason?: string;
  status?: string;
  $createdAt?: string;
};


export default function LeaveAndGatePassPage() {
  const { profile } = useProfileData();
  const { toast } = useToast();
  const { user } = useAuth();

  // State for dialogs
  const [gatePassOpen, setGatePassOpen] = useState(false);
  const [leaveOutPassOpen, setLeaveOutPassOpen] = useState(false);

  // State for gate pass form
  const [gatePassForm, setGatePassForm] = useState({
    exitTime: '',
    date: '',
    time: '',
    reason: '',
    entryTime: '',
  });

  // State for leave out pass form
  const [leaveOutPassForm, setLeaveOutPassForm] = useState({
    date: '',
    time: '',
    reason: '',
    status: 'Approved' as const,
  });

  // State for passes lists
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch passes from database
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchPasses() {
      try {
        setLoading(true);
        const result = await getPassesAction(user.$id);
        if (result.success) {
          setPasses(result.data as Pass[]);
        }
      } catch (error) {
        console.error('Error fetching passes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPasses();
  }, [user]);
  
  const handleAllow = () => {
    toast({
      title: 'Request Approved',
      description: 'thank you parents for allowing me',
      className: 'bg-green-100 text-green-800 border-green-200',
    });
  };

  const handleReject = () => {
    toast({
      variant: 'destructive',
      title: 'Request Rejected',
      description: 'Sorry, but you are not allowed to go out of campus',
    });
  };

  const handleGatePassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to apply for a pass.',
      });
      return;
    }

    try {
      const result = await createPassAction(user.$id, {
        passType: 'gate',
        exitTime: gatePassForm.exitTime,
        date: gatePassForm.date,
        time: gatePassForm.time,
        reason: gatePassForm.reason,
        entryTime: gatePassForm.entryTime,
      });

      if (result.success) {
        setGatePassForm({
          exitTime: '',
          date: '',
          time: '',
          reason: '',
          entryTime: '',
        });
        setGatePassOpen(false);
        toast({
          title: 'Gate Pass Applied',
          description: 'Your gate pass request has been submitted successfully.',
        });
        // Refresh passes list
        const passesResult = await getPassesAction(user.$id);
        if (passesResult.success) {
          setPasses(passesResult.data as Pass[]);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to submit gate pass request.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to submit gate pass request.',
      });
    }
  };

  const handleLeaveOutPassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to apply for a pass.',
      });
      return;
    }

    try {
      const result = await createPassAction(user.$id, {
        passType: 'leaveOut',
        date: leaveOutPassForm.date,
        time: leaveOutPassForm.time,
        reason: leaveOutPassForm.reason,
        status: 'Approved',
      });

      if (result.success) {
        setLeaveOutPassForm({
          date: '',
          time: '',
          reason: '',
          status: 'Approved',
        });
        setLeaveOutPassOpen(false);
        toast({
          title: 'Leave Out Pass Applied',
          description: 'Your leave out pass request has been submitted successfully.',
        });
        // Refresh passes list
        const passesResult = await getPassesAction(user.$id);
        if (passesResult.success) {
          setPasses(passesResult.data as Pass[]);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to submit leave out pass request.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to submit leave out pass request.',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <ProfileCard profile={profile} />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Dialog open={gatePassOpen} onOpenChange={setGatePassOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1">Gate Pass</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for Gate Pass</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleGatePassSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exitTime">Exit Time</Label>
                    <Input
                      id="exitTime"
                      type="time"
                      value={gatePassForm.exitTime}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, exitTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={gatePassForm.date}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={gatePassForm.time}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Input
                      id="reason"
                      type="text"
                      placeholder="Enter reason for gate pass"
                      value={gatePassForm.reason}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, reason: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryTime">Entry Time</Label>
                    <Input
                      id="entryTime"
                      type="time"
                      value={gatePassForm.entryTime}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, entryTime: e.target.value })}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setGatePassOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={leaveOutPassOpen} onOpenChange={setLeaveOutPassOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1">Leave Out Pass</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for Leave Out Pass</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLeaveOutPassSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaveDate">Date</Label>
                    <Input
                      id="leaveDate"
                      type="date"
                      value={leaveOutPassForm.date}
                      onChange={(e) => setLeaveOutPassForm({ ...leaveOutPassForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaveTime">Time</Label>
                    <Input
                      id="leaveTime"
                      type="time"
                      value={leaveOutPassForm.time}
                      onChange={(e) => setLeaveOutPassForm({ ...leaveOutPassForm, time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaveReason">Reason</Label>
                    <Input
                      id="leaveReason"
                      type="text"
                      placeholder="Enter reason for leave out pass"
                      value={leaveOutPassForm.reason}
                      onChange={(e) => setLeaveOutPassForm({ ...leaveOutPassForm, reason: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaveStatus">Status</Label>
                    <Input
                      id="leaveStatus"
                      type="text"
                      value={leaveOutPassForm.status}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setLeaveOutPassOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="past-requests">
              <AccordionTrigger className="text-xl font-semibold">Past Requests</AccordionTrigger>
              <AccordionContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading passes...</p>
                    </div>
                  </div>
                ) : passes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No passes found. Apply for a new pass using the buttons above.</p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4">
                    {passes.map((pass) => (
                      <Card key={pass.$id}>
                        <CardContent className="p-4 space-y-3">
                          {pass.passType === 'gate' ? (
                            <>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">TYPE</p>
                                <Badge variant="outline">Gate Pass</Badge>
                              </div>
                              {pass.date && (
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-muted-foreground">DATE</p>
                                  <p className="font-medium">{pass.date}</p>
                                </div>
                              )}
                              {pass.exitTime && (
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-muted-foreground">EXIT TIME</p>
                                  <p className="font-medium">{pass.exitTime}</p>
                                </div>
                              )}
                              {pass.time && (
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-muted-foreground">TIME</p>
                                  <p className="font-medium">{pass.time}</p>
                                </div>
                              )}
                              {pass.reason && (
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-muted-foreground">REASON</p>
                                  <p className="font-medium">{pass.reason}</p>
                                </div>
                              )}
                              {pass.entryTime && (
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-muted-foreground">ENTRY TIME</p>
                                  <p className="font-medium">{pass.entryTime}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">TYPE</p>
                                <Badge variant="outline">Leave Out Pass</Badge>
                              </div>
                              {pass.date && (
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-muted-foreground">DATE</p>
                                  <p className="font-medium">{pass.date}</p>
                                </div>
                              )}
                              {pass.time && (
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-muted-foreground">TIME</p>
                                  <p className="font-medium">{pass.time}</p>
                                </div>
                              )}
                              {pass.reason && (
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-muted-foreground">REASON</p>
                                  <p className="font-medium">{pass.reason}</p>
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">STATUS</p>
                                <Badge variant="default">Approved</Badge>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </div>
      </main>
    </div>
  );
}
