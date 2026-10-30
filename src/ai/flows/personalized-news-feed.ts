/**
 * @fileOverview AI-powered function to generate a personalized news feed for university students.
 *
 * - generatePersonalizedNewsFeed - A function that generates a personalized news feed based on user interests and academic program.
 * - PersonalizedNewsFeedInput - The input type for the generatePersonalizedNewsFeed function.
 * - PersonalizedNewsFeedOutput - The return type for the generatePersonalizedNewsFeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedNewsFeedInputSchema = z.object({
  interests: z.string().describe('The interests of the student, comma separated.'),
  academicProgram: z.string().describe('The academic program of the student.'),
});
export type PersonalizedNewsFeedInput = z.infer<typeof PersonalizedNewsFeedInputSchema>;

const PersonalizedNewsFeedOutputSchema = z.object({
  newsFeed: z.array(z.string()).describe('A list of personalized news items, each formatted as "Title: Content"'),
});
export type PersonalizedNewsFeedOutput = z.infer<typeof PersonalizedNewsFeedOutputSchema>;

export async function generatePersonalizedNewsFeed(input: PersonalizedNewsFeedInput): Promise<PersonalizedNewsFeedOutput> {
  return personalizedNewsFeedFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedNewsFeedPrompt',
  input: {schema: PersonalizedNewsFeedInputSchema},
  output: {schema: PersonalizedNewsFeedOutputSchema},
  prompt: `You are a university news curator. Generate a personalized news feed for a student based on their interests and academic program.
Create 3-5 news items relevant to the student. Each item should have a title and a short description.
Format each news item as a single string: "Title: Content".

Interests: {{{interests}}}
Academic Program: {{{academicProgram}}}

Example format:
- "Tech Fest 2025: Registrations are now open for the annual tech festival. This year's theme is 'AI for Good'."
- "Library Renovation: The main library will be closed for renovation from June 1st to August 15th."
`,
});

const personalizedNewsFeedFlow = ai.defineFlow(
  {
    name: 'personalizedNewsFeedFlow',
    inputSchema: PersonalizedNewsFeedInputSchema,
    outputSchema: PersonalizedNewsFeedOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
