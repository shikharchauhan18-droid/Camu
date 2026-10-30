
import { generatePersonalizedNewsFeed, PersonalizedNewsFeedInput } from '@/ai/flows/personalized-news-feed';
import { z } from 'zod';

const FormSchema = z.object({
  interests: z.string().min(3, { message: "Please enter at least one interest of 3 or more characters." }),
  academicProgram: z.string(),
});

export type NewsFeedState = {
  message?: string | null;
  news?: string[];
  errors?: {
    interests?: string[];
  };
  success: boolean;
};

export async function getPersonalizedNews(
  prevState: NewsFeedState,
  formData: FormData
): Promise<NewsFeedState> {
  const validatedFields = FormSchema.safeParse({
    interests: formData.get('interests'),
    academicProgram: formData.get('academicProgram'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid interests. Please correct the errors.',
      success: false,
    };
  }
  
  const { interests, academicProgram } = validatedFields.data;

  try {
    const aiInput: PersonalizedNewsFeedInput = {
      interests,
      academicProgram,
    };
    
    const result = await generatePersonalizedNewsFeed(aiInput);

    if (result.newsFeed && result.newsFeed.length > 0) {
      return {
        news: result.newsFeed,
        message: 'Your personalized news feed is ready!',
        success: true,
      };
    } else {
      return {
        message: 'No news found for your interests. Try something different!',
        success: true,
        news: [],
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to generate news feed. Please try again later.',
      success: false,
    };
  }
}
