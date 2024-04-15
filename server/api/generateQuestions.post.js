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
    const subtopicWithQuiz = topic.subtopics.find((subtopic) =>
      subtopic.quizzes.some((quiz) => quiz.quizId === body?.quizId)
    );

    if (!subtopicWithQuiz) {
      return {
        statusCode: 400,
        data: JSON.stringify({
          error: "Could not find subtopic with the given quizId",
        }),
      };
    }

    let filteredSubtopic = {};
    const quizIndex = subtopicWithQuiz.quizzes.findIndex(
      (quiz) => quiz.quizId === body?.quizId
    );

    filteredSubtopic = {
      name: subtopicWithQuiz.name,
      description: subtopicWithQuiz.description,
      quiz: subtopicWithQuiz.quizzes[quizIndex],
    };

    // Generate Topics with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are a helpful teacher trying to create a quiz for your students learning ${topic?.name}. You are creating a quiz for the 
        ${filteredSubtopic?.name} unit described by ${filteredSubtopic?.description}. This quiz should focus on ${filteredSubtopic?.quiz?.description}. 
        The questions should have a difficulty between ${body?.difficulty - 1} and ${body?.difficulty + 1} out of 10 (where 1 is a complete beginner, 
        5 is a student of the topic, and 10 is a subject matter expert). Your response should be a JSON object with an attribute 'questions' that is a 
        list of JSON objects containing a 'question' (fully articulated question as a string), 'answers' (a list of objects with an 'answer' string and 
        a 'correct' boolean), and 'difficulty' (a value 1-10). Generate exactly ${body?.count || 5} questions for this topic within the given range of difficulties. 
        Give each question 4 possible answers with one correct answer. IMPORTANT: Do not put the response in a code block, just send the stringified JSON as plain text. 
        If appropriate for the topic, be sure include some questions that rely on doing practical calculations or the student 'working out the problem' 
        logically in some way. BE THOUGHTFUL WHEN CREATING THE QUESTIONS; TAKE YOUR TIME AND MAKE SURE THAT THEY ARE CORRECT AND OF APPROPRIATE DIFFICULTY.`; // prettier-ignore
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // Strip code block if present
    const jsonResponse = JSON.parse(removeCodeBlock(text));

    // // Save Topics to Firestore
    // const batch = firestoreAdmin.batch();
    // const topicsRef = firestoreAdmin.collection("topics");
    // const timestamp = new Date();

    // for (const topic of jsonResponse?.topics) {
    //   const topicId = kebabCase(topic.name);
    //   const topicDocRef = topicsRef.doc(topicId);

    //   try {
    //     // Check if the document already exists
    //     const docSnapshot = await topicDocRef.get();
    //     const docExists = docSnapshot.exists;

    //     if (!docExists) {
    //       batch.set(topicDocRef, {
    //         ...topic,
    //         createdOn: timestamp,
    //         updatedOn: timestamp,
    //       });
    //     } else {
    //       batch.update(topicDocRef, {
    //         updatedOn: timestamp,
    //       });
    //     }
    //   } catch (error) {
    //     console.error("Error updating document with ID:", topicId, error);
    //   }
    // }

    // await batch.commit();

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