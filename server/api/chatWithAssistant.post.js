import { GoogleGenerativeAI } from "@google/generative-ai";
import { removeCodeBlock } from "~/server/utils/strings";

export default defineEventHandler(async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await readBody(event);
  const topicId = body?.topicId
  const quizId = body?.quizId
  const question = body?.question
  const conversation = body?.conversation

  let conversationHistory = "";
  for (const chat of conversation) {
    conversationHistory += `${chat.role}: ${chat.message}\n`
  }

  try {
    // Generate Questions for Knowledge Assessment with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `You are a fun helpful teaching assistant trying to help your student learn about the topic ${topicId}. The course is currently focused on ${quizId}.
      The student is working on the problem '${question?.question}' which has the following answers: ${question?.answers}. Please help the student determine the right 
      answer without revealing the correct answer verbatim. Instead, you should answer their questions, provide explanations, and link them to helpful resources to better
      understand the specific topic. Its okay to go a little off-topic as long as it is related material in the question. IMPORTANT: Respond in JSON format with a 
      'response' attribute (string). DO NOT INCLUDE THE ROLE ex: 'Assistant:' in your response. Keep answers to less than 3-4 sentences and only use markup when necessary. 
      Avoid being overly repetitive unless the user asks. Provide helpful links 10% of the time to resources like wikipedia that you think might be helpful if the 
      question is complex (only provide links you are confident still exist). Please respond as if speaking with to the student who you just had the following conversation 
      with: '${conversationHistory}'`; // prettier-ignore
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // Strip code block if present
    const jsonResponse = JSON.parse(removeCodeBlock(text));

    return {
      statusCode: 200,
      data: jsonResponse,
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      statusCode: 500,
      data: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
});
