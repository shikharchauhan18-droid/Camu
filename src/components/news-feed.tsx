"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { getPersonalizedNews, type NewsFeedState } from "@/lib/client-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Newspaper, Loader2, Lightbulb } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

const initialState: NewsFeedState = {
  message: undefined,
  news: undefined,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        "Personalize Feed"
      )}
    </Button>
  );
}

export default function NewsFeed({ academicProgram }: { academicProgram: string }) {
  const [state, dispatch] = useActionState(getPersonalizedNews, initialState);
  const { toast } = useToast();
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);
  
  const hasNews = state.success && state.news && state.news.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Newspaper className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Personalized News Feed</CardTitle>
        </div>
        <CardDescription>
          Tell us your interests to get a curated news feed about university life, powered by AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interests">Your Interests</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="interests"
                name="interests"
                placeholder="e.g., AI, basketball, music festivals"
                required
                aria-describedby="interests-error"
                className="flex-grow"
              />
              <input type="hidden" name="academicProgram" value={academicProgram} />
              <SubmitButton />
            </div>
            {state?.errors?.interests && (
              <p id="interests-error" className="text-sm font-medium text-destructive">
                {state.errors.interests[0]}
              </p>
            )}
          </div>
        </form>

        <div className="mt-8 min-h-[10rem]_">
          {pending ? (
             <div className="space-y-4">
               <h3 className="text-lg font-semibold text-muted-foreground">Generating your feed...</h3>
               <Skeleton className="h-12 w-full rounded-lg" />
               <Skeleton className="h-12 w-full rounded-lg" />
               <Skeleton className="h-12 w-full rounded-lg" />
             </div>
          ) : hasNews ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Feed</h3>
              <Accordion type="single" collapsible className="w-full">
                {state.news!.map((item, index) => {
                  const parts = item.split(/:(.*)/s);
                  const title = parts[0];
                  const content = parts[1] ? parts[1].trim() : "More details inside.";

                  return(
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{title}</AccordionTrigger>
                      <AccordionContent>
                        {content}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
              <Lightbulb className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Your News Feed is Empty</h3>
              <p className="text-muted-foreground">Enter your interests above to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
