
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Profile = {
  name: string;
  studentId: string;
  program: string;
  status: 'Active' | 'On Leave';
  avatarUrl: string;
  avatarHint: string;
};

export default function ProfileCard({ profile }: { profile: Profile }) {
  const isStatusActive = profile.status === 'Active';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4 bg-background">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint={profile.avatarHint} />
          <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <CardTitle className="text-xl font-headline">{profile.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{profile.studentId}</p>
           <p className="text-sm text-muted-foreground">{profile.program}</p>
        </div>
      </CardHeader>
    </Card>
  );
}
