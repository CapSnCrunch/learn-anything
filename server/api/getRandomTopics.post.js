import { GoogleGenerativeAI } from "@google/generative-ai";
import { firestoreAdmin } from "~/server/utils/firebase";
import { kebabCase } from "~/server/utils/strings";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const count = body?.count;

  try {
    const topicsRef = firestoreAdmin.collection("topics");
    const querySnapshot = await topicsRef
      .where('subtopics', '!=', null)
      .get();

    const topics = [];
    querySnapshot.forEach(doc => {
      topics.push(doc.data());
    });

    if (count > topics.length) {
      throw new Error('Requested number of topics exceeds available topics.');
    }

    const shuffledTopics = topics.sort(() => Math.random() - 0.5);
    const randomTopics = shuffledTopics.slice(0, count);

    const jsonResponse = randomTopics.map(topic => ({
      name: topic.name,
      id: kebabCase(topic.name)
    }))

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
