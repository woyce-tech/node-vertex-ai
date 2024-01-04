const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
require('dotenv').config();


const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.VERTEXAI_API_KEY;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

async function main() {
  const result = await client.generateMessage({
    model: MODEL_NAME, // Required. The model to use to generate the result.
    temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
    candidateCount: 1, // Optional. The number of candidate results to generate.
    prompt: {
      // Required. Alternating prompt/response messages.
      messages: [{ content: "How can I manage healthy lifestyle?" }],
    },
  });

  console.log(result[0].candidates[0].content);
}

main();