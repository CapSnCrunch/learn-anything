import axios from "axios";
import { firestoreAdmin } from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const topicId = body?.topicId
  const quizId = body?.quizId
  const questionIds = body?.questionIds || [] // Question IDs that the client already has (so we don't send duplicates)
  const count = body?.count || 2
  const difficulty = body?.difficulty || 5

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

    // Questions that the client does not already have
    const filteredQuestions = questions.filter(question => {
      return !questionIds.includes(question.docID);
    });

    const questionCountToReturn = Math.min(filteredQuestions.length, count)
    const shuffledQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
    const randomQuestions = shuffledQuestions.slice(0, questionCountToReturn);
    
    // If the backlog of questions is not large enough, generate more and save them
    if (questions.length < 20) {
        try {
            const baseURL = process.env.VERCEL_ENV === "production" ? process.env.SERVER_URL : process.env.LOCAL_URL
            axios.post(`${baseURL}/api/generateQuestions`, {
                topicId: topicId,
                quizId: quizId,
                difficulty: difficulty,
                count: count,
            });
        } catch (error) {
            console.warn('Failed to call generateQuestions', error)
        }
    } 

    return {
      statusCode: 200,
      data: randomQuestions,
    };
  } catch (error) {
    console.error("Error getting questions:", error);
    return {
      statusCode: 500,
      data: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
});