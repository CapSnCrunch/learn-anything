# Learn Anything

<a href="https://learnanything.io">learnanything.io</a> is a submission for the <a href="https://googleai.devpost.com/">Google AI Hackathon on Devpost</a>.

Learn Anything is a platform for learners of all backgrounds which generates structured courses for topics where formal courses are difficult to access or may not even exist.

<br/>
<p align="center">
  <img src="https://github.com/CapSnCrunch/learn-anything/assets/19574838/b0ff99d9-b3f3-4dd3-9d63-bd652ad3cb81" width="600">
</p>
<br/>

Navigating search results can be like piecing together a puzzle with missing pieces. Learn Anything streamlines the learning process by <ins>generating courses organized in the logical sequence you'd expect</ins>, eliminating the frustration of sifting through disjointed web page and video tutorials. With our platform, you can seamlessly progress from foundational concepts to advanced topics, ensuring a comprehensive and cohesive learning experience tailored to your needs. Whether you're <ins>studying for a certification, need extra practice for a class you're in, or simply a curious person</ins>, Learn Anything allows you to approach your learning goals with <ins>topics that may have never even had a formal course available before</ins>.

## Project Setup

**Note for Judges**: If viewing the live version of the project is sufficient, please checkout the hosted version at [https://learnanything.io/](https://learnanything.io/)

1. Fork and clone the repository
2. From the root of the project, run `npm install`
3. Setup a [Firebase Project](https://console.firebase.google.com/)
   - Setup Authentication with email / password and Google Sign-In
   - Set environment variables in the project's `.env` for `FIREBASE_PROJECT_ID`, `FIREBASE_AUTH_DOMAIN`, and `FIREBASE_API_KEY`
   - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to be your stringified `service-account.json` (see [here](https://firebase.google.com/support/guides/service-accounts))
   - You may need to set localhost as an authorized domain in Authentication > Settings > Authorized Domains
4. Set the `LOCAL_URL="http://localhost:3000"` environment variable
5. Generate a [Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key) and set it with `GEMINI_API_KEY`
6. Run `npm run dev` from the root of the project

If you have any issues setting up the project, [please reach out](https://www.linkedin.com/in/samuel-perales/)!

## Demo
Demo coming soon...

## Other
### Meet the Cast!
Every topic on Learn Anything is taught with the help of these ten assistants. If you're ever struggling with a problem, you can rely on them for direction!

<p align="center">
  <img src="https://github.com/CapSnCrunch/learn-anything/assets/19574838/48b52072-0b14-4b08-9505-287e8f0b7dc4" width="850">
</p>
<br/>
