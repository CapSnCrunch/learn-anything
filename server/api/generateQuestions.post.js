import axios from "axios"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { firestoreAdmin } from "~/server/utils/firebase";
import { removeCodeBlock } from "~/server/utils/strings";
import { v4 } from "uuid"

export default defineEventHandler(async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await readBody(event);
  const topicId = body?.topicId
  const quizIds = body?.quizIds || []
  const difficulty = body?.difficulty || 5
  const count = body?.count || 2

  if (!quizIds.length) {
    return {
      statusCode: 400,
      data: JSON.stringify({ error: "No quizIds provided for generateQuestions." }),
    };
  }

  const quizId = quizIds?.[0]
  console.log(`Generating questions for topicId: ${topicId}, quizId: ${quizId} (${quizIds.length} calls remaining)`)

  try {
    // See if any questions already exist
    const questionsRef = firestoreAdmin.collection("questions");
    const querySnapshot = await questionsRef
      .where('topicId', '==', topicId)
      .where('quizId', '==', quizId)
      .get();

    const questions = [];
    querySnapshot.forEach(doc => {
      const id = doc.id
      const data = doc.data()
      questions.push({
        ...data,
        questionId: id,
      });
    });
    
    // If the backlog of questions is not large enough, generate more and save them
    if (questions.length < 20) {
      // Find Topic from Firebase
      const topicsRef = firestoreAdmin.collection("topics");
      const topicDocRef = topicsRef.doc(topicId);
      const topicSnapshot = await topicDocRef.get();
      const topicExists = topicSnapshot.exists;
      if (!topicExists) {
        return {
          statusCode: 400,
          data: JSON.stringify({
            error: "Could not find topic",
          }),
        };
      }

      // Find Subtopic within Topic that this quiz is for
      let topic = topicSnapshot.data();
      const subtopicWithQuiz = topic.subtopics.find((subtopic) =>
        subtopic.quizzes.some((quiz) => quiz.quizId === quizId)
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
        (quiz) => quiz.quizId === quizId
      );

      filteredSubtopic = {
        name: subtopicWithQuiz.name,
        description: subtopicWithQuiz.description,
        quiz: subtopicWithQuiz.quizzes[quizIndex],
      };

      // Generate Questions with Gemini (2 each time for speed)
      const existingQuestions = questions.map(question => question.question);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are a helpful teacher trying to create a quiz for your students learning ${topic?.name}. You are creating a quiz for the
        ${filteredSubtopic?.name} unit described by ${filteredSubtopic?.description}. This quiz should focus on ${filteredSubtopic?.quiz?.description}.
        The questions should have a difficulty between ${difficulty - 1} and ${difficulty + 1} out of 10 (where 1 is a complete beginner,
        5 is a student of the topic, and 10 is a subject matter expert). Your response should be a JSON object with an attribute 'questions' that is a
        list of JSON objects containing a 'question' (fully articulated question as a string), 'answers' (a list of objects with an 'answer' string and
        a 'correct' boolean - only one of the answers should be marked as the correct one), 'difficulty' (a value 1-10), and 'explanation' (max 2 sentences
        explaining the correct answer). Generate exactly 2 questions for this topic within the given range of difficulties. Give each question 4 possible
        answers with one correct answer. IMPORTANT: Do not put the response in a code block, just send the stringified JSON as plain text. If appropriate
        for the topic, be sure include some questions that rely on doing practical calculations or the student 'working out the problem' logically in some
        way. BE THOUGHTFUL WHEN CREATING THE QUESTIONS; TAKE YOUR TIME AND MAKE SURE THAT THEY ARE CORRECT AND OF APPROPRIATE DIFFICULTY. Questions that
        have already been generated include ${existingQuestions}. DO NOT DUPLICATE ANY OF THE EXISTING QUESTIONS.`; // prettier-ignore  
        
      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();

      // Strip code block if present
      const jsonResponse = JSON.parse(removeCodeBlock(text));

      // Save Questions to Firestore
      const batch = firestoreAdmin.batch();
      const timestamp = new Date();

      for (const question of jsonResponse?.questions) {
        const questionId = v4();
        const questionDocRef = questionsRef.doc(questionId);

        try {
          batch.set(questionDocRef, {
            quizId: quizId,
            topicId: topicId,
            type: 'multiple-choice',
            reported: false,
            ...question,
            createdOn: timestamp,
            updatedOn: timestamp,
          });
        } catch (error) {
          console.error("Error creating document with ID:", questionId, error);
        }
      }

      const shiftedQuizIds = quizIds.slice(1);
      if (shiftedQuizIds.length) {
        try {
          const baseURL = process.env.VERCEL_ENV === "production" ? process.env.SERVER_URL : process.env.LOCAL_URL
          axios.post(`${baseURL}/api/generateQuestions`, {
            topicId: topicId,
            quizIds: shiftedQuizIds,
            difficulty: difficulty,
            count: count,
          });
        } catch (error) {
          console.warn(`Failed to call generateQuestions for ${shiftedQuizIds}`, error)
        }
      } 

      await batch.commit();

      return {
        statusCode: 200,
        data: jsonResponse,
      };

    } else {
      return {
        statusCode: 200,
        message: `${questions.length} questions already exist. Not generating any more.`
      };
    }

  } catch (error) {
    console.error("Error generating content:", error);
    return {
      statusCode: 500,
      data: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
});