import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Set your Gemini API key and ensure you have it securely set in your environment variables
const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    try {
      // Initialize the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Generate content using the user's input
      const result = await model.generateContent(args.messageBody);
      const response = await result.response;
      const messageContent: string =
        (await response.text()) ||
        "I'm sorry, I don't have a response for that";

      // Send the generated message content back to the conversation
      await ctx.runMutation(api.messages.sendChatGPTMessage, {
        content: messageContent,
        conversation: args.conversation,
        messageType: "text",
      });
    } catch (error) {
      console.error("Error with Gemini API:", error);
      await ctx.runMutation(api.messages.sendChatGPTMessage, {
        content: "An error occurred while processing your request.",
        conversation: args.conversation,
        messageType: "text",
      });
    }
  },
});
