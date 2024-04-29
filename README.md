# Learn Anything

<a href="learnanything.io">learnanything.io</a> is a submission for the <a href="https://googleai.devpost.com/">Google AI Hackathon on Devpost</a>.

Learn Anything is a web application built to help users of all backgrounds approach any topic from a place of confidence and curiosity.

<br/>
<p align="center">
  <img src="https://github.com/CapSnCrunch/learn-anything/assets/19574838/b0ff99d9-b3f3-4dd3-9d63-bd652ad3cb81" width="600">
</p>
<br/>

Navigating search results can be like piecing together a puzzle with missing pieces. Learn Anything streamlines the learning process by **generating courses organized in the logical sequence you'd expect**, eliminating the frustration of sifting through disjointed web page and video tutorials. With our platform, you can seamlessly progress from foundational concepts to advanced topics, ensuring a comprehensive and cohesive learning experience tailored to your needs. Whether you're studying for a certification, need extra practice for a class you're in, or simply a curious person, Learn Anything allows you to approach your learning goals with **topics that may have never even had a formal course available before**.

## Setup

1. Fork and clone the repository
2. From the project root, `npm install`
3. Setup a [Firebase Project](https://console.firebase.google.com/)
   _ Setup Authentication with email / password and Google Sign-In
   _ Set environment variables in the project's `.env` for `FIREBASE_PROJECT_ID`, `FIREBASE_AUTH_DOMAIN`, and `FIREBASE_API_KEY`
   _ Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be your stringified `service-account.json` (see [here](https://firebase.google.com/support/guides/service-accounts))
   _ You may need to set localhost as an authorized domain in Authentication > Settings > Authorized Domains
4. Set `LOCAL_URL="http://localhost:3000"` environment variable
5. Generate a [Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key) and set it with `GEMINI_API_KEY`
6. Run `npm run dev` from the root of the project

## Demo

## Other
