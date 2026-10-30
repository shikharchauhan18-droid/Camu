
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Menu, Home, Settings, LogOut, QrCode, HomeIcon } from 'lucide-react';
import ProfileCard from '@/components/profile-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProfileData } from '@/hooks/use-profile-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const weeklyMenu = [
  { day: "Monday", breakfast: "Chocos and Cornflakes, Aloo Paratha, Curd, Milk, Tea, Coffee", lunch: "Rajma, Rice, Roti, Raita, Dal", snacks: "Samosa, Tea", dinner: "Paneer Masala, Roti, Raita, Dal" },
  { day: "Tuesday", breakfast: "Poha, Veg Daliya, Jam, Brown Bread, Aloo Jhol, Milk, Tea, Coffee", lunch: "Chole Bhature, Salad, Roti, Raita, Dal", snacks: "Kachori, Tea", dinner: "Mix Veg, Dal, Rice, Raita" },
  { day: "Wednesday", breakfast: "Chocos and Cornflakes, Idli, Sambhar, Milk, Tea, Coffee", lunch: "Kadhi Pakoda, Rice, Roti, Raita, Dal", snacks: "Pasta, Tea", dinner: "Aloo Gobhi, Roti, Raita, Dal" },
  { day: "Thursday", breakfast: "Chocos and Cornflakes, Aloo Paratha, Curd, Milk, Tea, Coffee", lunch: "Dal Makhani, Naan, Roti, Raita, Dal", snacks: "Dhokla, Tea", dinner: "Lauki, Roti, Dal, Raita" },
  { day: "Friday", breakfast: "Chocos and Cornflakes, Upma, Ketchup, Milk, Tea, Coffee", lunch: "Fried Rice, Kadhai Paneer, Roti, Raita, Dal", snacks: "Spring Roll, Tea", dinner: "Chana Masala, Rice, Roti, Raita, Dal" },
  { day: "Saturday", breakfast: "Chole Kulche, Milk, Tea, Coffee", lunch: "Rajma, Rice, Roti, Raita, Dal", snacks: "Burger, Fries, Tea", dinner: "Kadhai Paneer, Naan, Raita, Dal" },
  { day: "Sunday", breakfast: "Chocos and Cornflakes, Pao bhaji, Milk, Tea, Coffee", lunch: "Special Meal, Roti, Raita, Dal", snacks: "Hot/Cold coffee and Pani Puri, Tea", dinner: "Special Meal, Roti, Raita, Dal" },
];

type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

const MealTable = ({ mealType }: { mealType: MealType }) => {
  const mealTimings = {
    breakfast: '07:30-09:30',
    lunch: '12:00-15:00',
    snacks: '16:30-18:00',
    dinner: '19:30-21:30',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{mealType} Menu</CardTitle>
        <p className="text-sm text-muted-foreground">Timing: {mealTimings[mealType]}</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Menu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weeklyMenu.map((item) => (
              <TableRow key={item.day}>
                <TableCell className="font-medium">{item.day}</TableCell>
                <TableCell>{item[mealType]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};


export default function CafeteriaPage() {
  const { profile } = useProfileData();
  const qrCodeImage = PlaceHolderImages.find((img) => img.id === 'qr-code');

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
        <div className="mx-auto max-w-4xl space-y-6">
          <ProfileCard profile={profile} />
          
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Meal Timetable</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan for Meal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Scan QR Code</DialogTitle>
                  <DialogDescription>
                    Scan this QR code for your meal.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-4">
                  <Image
                    src={qrCodeImage?.imageUrl || "https://picsum.photos/seed/qrcode/400/400"}
                    alt={qrCodeImage?.description || "QR Code"}
                    data-ai-hint={qrCodeImage?.imageHint || 'qr code'}
                    width={250}
                    height={250}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch">Lunch</TabsTrigger>
              <TabsTrigger value="snacks">Snacks</TabsTrigger>
              <TabsTrigger value="dinner">Dinner</TabsTrigger>
            </TabsList>
            <TabsContent value="breakfast">
              <MealTable mealType="breakfast" />
            </TabsContent>
            <TabsContent value="lunch">
              <MealTable mealType="lunch" />
            </TabsContent>
            <TabsContent value="snacks">
               <MealTable mealType="snacks" />
            </TabsContent>
            <TabsContent value="dinner">
               <MealTable mealType="dinner" />
            </TabsContent>
          </Tabs>

        </div>
      </main>

       <footer className="sticky bottom-0 flex h-16 items-center justify-around border-t bg-slate-900 text-white">
        <Link href="/" passHref>
            <Button variant="ghost" className="flex flex-col h-auto text-white hover:bg-slate-700 hover:text-white">
                <HomeIcon className="h-6 w-6" />
            </Button>
        </Link>
        <Button variant="ghost" className="flex flex-col h-auto text-white hover:bg-slate-700 hover:text-white">
          <Settings className="h-6 w-6" />
        </Button>
        <Link href="/logout" passHref>
             <Button variant="ghost" className="flex flex-col h-auto text-white hover:bg-slate-700 hover:text-white">
                <LogOut className="h-6 w-6 rotate-180" />
            </Button>
        </Link>
      </footer>
    </div>
  );
}
