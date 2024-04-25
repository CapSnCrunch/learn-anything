import { GoogleGenerativeAI } from "@google/generative-ai";
import { firestoreAdmin } from "~/server/utils/firebase";
import { kebabCase, removeCodeBlock } from "~/server/utils/strings";

export default defineEventHandler(async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await readBody(event);
  const topicId = body?.topicId
  const quizId = body?.quizId
  const question = body?.question
  const message = body?.message

  try {
    // Generate Questions for Knowledge Assessment with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are a helpful teaching assistant trying to help your student learn about the topic ${topicId}. The course is currently focused on ${quizId}.
      The student is working on the problem '${question?.question}' which has the following answers: ${question?.answers}. They need help but you should not reveal
      the exact answer to the problem they are working on. If the student just needs help with definitions or understanding the problem better, try to help them directly
      without revealing the correct answer. Please respond as if speaking with to the student who just said '${message}'. IMPORTANT: Respond in JSON format with a 
      'response' attribute (string) and a 'links' array of free-to-use helpful links the user might want to look at for this particular problem. Keep answers to less 
      than 4 sentences and only use markup when necessary. Try to send helpful links often.`; // prettier-ignore
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    console.log(text)

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
