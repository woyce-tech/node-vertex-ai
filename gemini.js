const { VertexAI, HarmCategory, HarmBlockThreshold } = require('@google-cloud/vertexai');
require('dotenv').config();

// Constants for project and location should be defined at the top level.
const PROJECT_ID = process.env.PROJECT_ID;
const LOCATION = 'us-central1';

// Initialize Vertex AI with the necessary project and location information once.
const vertexAiOptions = { project: PROJECT_ID, location: LOCATION };
const vertex_ai = new VertexAI(vertexAiOptions);

// Define model names as constants to avoid magic strings and improve readability.
const GEMINI_PRO_MODEL_NAME = 'gemini-pro';

// Safety settings can be moved outside of the model instantiation, 
// if they are static and reused across multiple instances.
const safetySettings = [{
  category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}];

// Instantiate models once outside of functions to avoid repeated initializations.
const generativeModelOptions = {
  model: GEMINI_PRO_MODEL_NAME,
  safety_settings: safetySettings,
  generation_config: { max_output_tokens: 256 },
};

const generativeModel = vertex_ai.preview.getGenerativeModel(generativeModelOptions);

// The streamGenerateContent function does not need to be an async declaration since it returns a Promise implicitly.
function streamGenerateContent() {
  const request = {
    contents: [{ role: 'user', parts: [{ text: 'How are you doing today?' }] }],
  };
  
  // Using implicit return for the async arrow function.
  return (async () => {
    try {
      const streamingResp = await generativeModel.generateContentStream(request);
      for await (const item of streamingResp.stream) {
        console.log('stream chunk: ', item.candidates[0].content.parts[0]);
      }
    } catch (error) {
      console.error('An error occurred during content generation:', error);
    }
  })();
}

// Invoking the function to start the content generation process.
streamGenerateContent();
