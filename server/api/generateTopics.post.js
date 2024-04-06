import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await readBody(event);
  const message = body?.message;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a list of learning topics based on the following input: "${message}". 
      Consider topics like Web Development, Python, Linear Algebra, Creative Writing, Archaeology, etc. 
      Provide a diverse range of topics that the user might find interesting to learn about based around 
      their input. Your response should be a JSON object with an attribute 'topics' that is a list of JSON
      objects containing a 'name' (one or two words) and a 'description' (no more than 20 words describing the topic).
      Generate exactly 6 distinct topics. IMPORTANT: Do not put the response in a code block, just send the 
      stringified JSON as plain text. If the input itself is a topic, be sure to include it in the final list.`;

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
