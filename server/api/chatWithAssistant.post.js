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
      The student is working on the question '${question?.question}' which has the following answers: ${question?.answers}. They need help but you should not reveal
      the exact answer to the question they are working on (its okay to talk about things related to the question as long as it is not answering the question directly).
      Instead, answer their relevant questions and guide them in the right direction. Teach them things they may not know about the subject and provided helpful links 
      to outside learning material when possible. Please respond as if speaking with to the student who just said '${message}'. IMPORTANT: Respond in JSON format with 
      a 'response' attribute (string) and a 'links' array of free-to-use helpful links the user might want to look at for this particular problem. Keep answers to only 
      a few sentences and only use markup when necessary.`; // prettier-ignore
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
