import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await readBody(event);

  const topic = body?.topic;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are a helpful teacher trying to create a course plan for your students learning ${topic}. 
      Generate a list of units that will be covered in the course. For example, a course on machine learning might have
      the subtopics 'linear algebra review', 'linear regression', 'neural networks', and 'computer vision'.
      Your response should be a JSON object with an attribute 'topics' that is a list of JSON
      objects containing a 'name' (one or two words) and a 'description' (no more than 20 words describing the topic).
      Generate exactly 10 distinct subtopics for ${topic}. Order the subtopics in the order that would make the most sense for
      students to them in. IMPORTANT: Do not put the response in a code block, just send the stringified JSON as plain text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return {
      statusCode: 200,
      data: JSON.parse(text),
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      statusCode: 500,
      data: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
});
