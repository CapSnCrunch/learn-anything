const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

exports.login = functions.https.onRequest(async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await admin
      .auth()
      .signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Return user data or token to the client
    res.status(200).json({ user });
  } catch (error) {
    // Handle authentication errors
    res.status(401).json({ error: error.message });
  }
});
