import { GoogleGenerativeAI } from "@google/generative-ai";
import { firestoreAdmin } from "~/server/utils/firebase";
import { kebabCase, removeCodeBlock } from "~/server/utils/strings";

export default defineEventHandler(async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await readBody(event);

  try {
    // Find Topic from Firebase
    const topicsRef = firestoreAdmin.collection("topics");
    const topicDocRef = topicsRef.doc(body?.topicId);
    const docSnapshot = await topicDocRef.get();
    const docExists = docSnapshot.exists;
    if (!docExists) {
      return {
        statusCode: 400,
        data: JSON.stringify({
          error: "Could not find topic",
        }),
      };
    }

    let topic = docSnapshot.data();

    // Generate Questions for Knowledge Assessment with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are a helpful teacher trying to create an initial knowledge assessment to see how much your students know about the topic ${topic?.name}. 
        The quiz should have a full range of difficulties between 3 and 7 out of 10 in order to gauge what level you should teach the rest of the course at 
        (where 1 is a complete beginner, 5 is a student of the topic, and 10 is a subject matter expert). Your response should be a JSON object with an attribute 
        'questions' that is a list of JSON objects containing a 'question' (fully articulated question as a string), 'answers' (a list of objects with an 'answer' string and 
        a 'correct' boolean), and 'difficulty' (a value 1-10). Generate exactly ${body?.count || 5} questions for this topic within the given range of difficulties. 
        Give each question 4 possible answers with one correct answer. IMPORTANT: Do not put the response in a code block, just send the stringified JSON as plain text. 
        If appropriate for the topic, be sure include some questions that rely on doing practical calculations or the student 'working out the problem' 
        logically in some way. BE THOUGHTFUL WHEN CREATING THE QUESTIONS; TAKE YOUR TIME AND MAKE SURE THAT THEY ARE CORRECT AND OF APPROPRIATE DIFFICULTY.`; // prettier-ignore
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
