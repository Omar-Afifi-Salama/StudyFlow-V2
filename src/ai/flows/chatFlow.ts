
'use server';
/**
 * @fileOverview Basic AI chat flow.
 *
 * - chatWithAI - A function that interacts with an AI model for chat.
 * - ChatInput - The input type for the chatWithAI function.
 * - ChatOutput - The return type for the chatWithAI function (simple string reply).
 */

import { genkit, Ai } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit'; // Corrected import for Zod

// Use the globally configured `ai` instance from genkit.ts for defining schemas, etc.
// but the actual model call will use a dynamically configured instance if an API key is provided.
import { ai as globalAi } from '@/ai/genkit';


export const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the AI.'),
  apiKey: z.string().optional().describe('User-provided Gemini API Key. This is required to use the AI Chat.'),
  // history: z.array(z.object({role: z.enum(["user", "model"]), content: z.string()})).optional().describe("Chat history")
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Output is a simple string for this basic chat
// For more structured output, define a Zod schema here.
// export const ChatOutputSchema = z.string();
// export type ChatOutput = z.infer<typeof ChatOutputSchema>;


export async function chatWithAI(input: ChatInput): Promise<string> {
  return chatFlow(input);
}

// This flow uses the globalAi for defining the flow structure
// but dynamically configures the AI instance if an API key is passed.
const chatFlow = globalAi.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(), // Direct string output
  },
  async (input) => {
    const modelName = 'googleai/gemini-2.0-flash'; // Define model name once

    if (!input.apiKey) {
      return "A Gemini API Key is required to use the AI Chat. Please go to the AI Chat page and provide your key in the settings section at the bottom.";
    }

    // Dynamically configure a new Genkit instance with the provided API key for this call
    const userAi = genkit({
      plugins: [googleAI({ apiKey: input.apiKey })],
    });
    
    // Simple prompt, no explicit history management for this basic version.
    // For conversational history, you'd add a history field to inputSchema
    // and construct a more complex prompt or use model's history capabilities.
    const { output } = await userAi.generate({
        model: modelName, // Explicitly specify the model for the generate call
        prompt: `You are a helpful study assistant. Keep your responses concise and informative.
        User: ${input.message}
        Assistant:`,
        // history: input.history // if implementing history
        config: {
            // Example safety settings - adjust as needed
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
        }
    });

    return output?.text || "Sorry, I couldn't generate a response.";
  }
);

