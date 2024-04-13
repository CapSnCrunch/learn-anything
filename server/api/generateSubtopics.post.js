import { GoogleGenerativeAI } from "@google/generative-ai";
import { firestoreAdmin } from "~/server/utils/firebase";
import { removeCodeBlock } from "~/server/utils/strings";

// // Parse Session Cookie for User
// const cookies = parseCookies(event);
// const sessionCookie = cookies?.__session;
// if (sessionCookie) {
//   const decodedClaims = await authAdmin.verifySessionCookie(
//     sessionCookie,
//     true
//   );
//   console.log(decodedClaims);
// }

export default defineEventHandler(async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await readBody(event);
  const topicId = body?.topic;

  try {
    // Find Topic from Firebase
    const topicsRef = firestoreAdmin.collection("topics");
    const topicDocRef = topicsRef.doc(topicId);
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
    if (topic?.subtopics) {
      return {
        statusCode: 200,
        data: {
          message: "Pre-generated subtopics located",
          subtopics: topic.subtopics,
        },
      };
    }

    // Generate Subtopics with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const subtopicPlanPrompt = `You are a helpful teacher trying to create a course plan for your students learning ${topic.name}. 
      Generate a list of units that will be covered in the course. For example, a course on machine learning might have
      the subtopics 'linear algebra review', 'linear regression', 'neural networks', and 'computer vision'.
      Your response should be a JSON object with an attribute 'subtopics' that is a list of JSON
      objects containing a 'name' (one or two words) and a 'description' (no more than 20 words describing the topic).
      Generate exactly 10 distinct subtopics for ${topic.name}. Order the subtopics in the order that would make the most sense for
      students to them in. IMPORTANT: Do not put the response in a code block, just send the stringified JSON as plain text.`;

    const subtopicResult = await model.generateContent(subtopicPlanPrompt);
    const subtopicResponse = subtopicResult.response;
    let subtopicText = subtopicResponse.text();

    // Strip code block if present
    const subtopicJsonResponse = JSON.parse(removeCodeBlock(subtopicText));

    // Generate quizzes within each subtopic
    const quizPromises = [];
    for (const subtopic of subtopicJsonResponse?.subtopics) {
      const quizPlanPrompt = `You are a helpful teacher trying to create a course plan for your students learning ${topic.name}. The course
        consists of several units. Write a lesson plan for 7 sub-units in the form of quizzes within the unit ${subtopic.name} which covers 
        '${subtopic.description}'. For example, the unit 'HTML' in the 'Web Development' course might include quizzes on 'basic elements', 
        'input elements', etc. Your response should be a JSON object with an attribute 'quizzes' that is a list of JSON objects containing 
        a 'description' (no more than 10 words describing what the sub-unit will cover) and a 'quizId' (a short, unique, lowercase kebab-case
        identifier for this quiz). Generate exactly 7 distinct quizzes for ${subtopic.name}.  Order the quizzes in the order that would make 
        the most sense for students to them in. IMPORTANT: Do not put the response in a code block, just send the stringified JSON as plain text.`;

      const quizPromise = model.generateContent(quizPlanPrompt);
      quizPromises.push(quizPromise);
    }

    const quizzes = await Promise.all(quizPromises);
    subtopicJsonResponse.subtopics.forEach((subtopic, index) => {
      const quizReponse = quizzes[index].response;
      let quizText = quizReponse.text();
      const quizJsonResponse = JSON.parse(removeCodeBlock(quizText));
      subtopic.quizzes = quizJsonResponse?.quizzes;
    });

    // Save Subtopics to Firebase on Topic
    await topicDocRef.update({
      subtopics: subtopicJsonResponse.subtopics,
    });

    return {
      statusCode: 200,
      data: subtopicJsonResponse,
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      statusCode: 500,
      data: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
});
