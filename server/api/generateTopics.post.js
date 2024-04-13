import { GoogleGenerativeAI } from "@google/generative-ai";
import { firestoreAdmin } from "~/server/utils/firebase";
import { kebabCase, removeCodeBlock } from "~/server/utils/strings";

export default defineEventHandler(async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await readBody(event);
  const message = body?.message;

  try {
    // Generate Topics with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a list of learning topics based on the following input: "${message}". 
      Consider topics like Web Development, Python, Linear Algebra, Creative Writing, Archaeology, etc. 
      Provide a diverse range of topics that the user might find interesting to learn about based around 
      their input. Your response should be a JSON object with an attribute 'topics' that is a list of JSON
      objects containing a 'name' (one or two words) and a 'description' (no more than 20 words describing the topic).
      Generate exactly 6 distinct topics. IMPORTANT: Do not put the response in a code block, just send the 
      stringified JSON as plain text. If the input itself is a topic, be sure to include it in the final list.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // Strip code block if present
    const jsonResponse = JSON.parse(removeCodeBlock(text));

    // Save Topics to Firestore
    const batch = firestoreAdmin.batch();
    const topicsRef = firestoreAdmin.collection("topics");
    const timestamp = new Date();

    for (const topic of jsonResponse?.topics) {
      const topicId = kebabCase(topic.name);
      const topicDocRef = topicsRef.doc(topicId);

      try {
        // Check if the document already exists
        const docSnapshot = await topicDocRef.get();
        const docExists = docSnapshot.exists;

        if (!docExists) {
          batch.set(topicDocRef, {
            ...topic,
            createdOn: timestamp,
            updatedOn: timestamp,
          });
        } else {
          batch.update(topicDocRef, {
            updatedOn: timestamp,
          });
        }
      } catch (error) {
        console.error("Error updating document with ID:", topicId, error);
      }
    }

    await batch.commit();

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
