import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

export const PromptService = async (transcript) => {
  const SECRET_KEY = "AIzaSyCxBuFSEBJKhPZ6P4JzM46IhfVGzUfnbzU"; // Your actual API key

  const chat = new ChatGoogleGenerativeAI({ apiKey: SECRET_KEY });

  // System message defines the role of the AI assistant
  const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
    "You are an AI assistant for a car dealership. Use the information provided in the following knowledge base: {knowledgeBase}. Answer the user's query accurately and helpfully."
  );

  // Human message contains the user's input (the transcript)
  const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
    "User query: {transcript}"
  );

  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessagePrompt,
    humanMessagePrompt,
  ]);

  // Define your knowledge base
  const knowledgeBase = JSON.stringify({
    "Car Models": [
      "Toyota Corolla",
      "Honda Civic",
      "Ford Mustang",
      // Add more models and details here
    ],
    Services: [
      "Oil Change",
      "Brake Inspection",
      "Tire Rotation",
      // Add more services here
    ],
    // Add more categories and information relevant to your dealership
  });

  const formattedChatPrompt = await chatPrompt.formatMessages({
    knowledgeBase,
    transcript,
  });

  try {
    const response = await chat.invoke(formattedChatPrompt);

    if (response && response.content) {
      return {
        success: true,
        message: response.content,
      };
    } else {
      return {
        success: false,
        message: "Sorry, I couldn't process the request. Please try again.",
      };
    }
  } catch (error) {
    console.error("Error during AI response generation:", error);
    return {
      success: false,
      message: "An error occurred while processing your request.",
    };
  }
};
