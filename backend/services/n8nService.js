const axios = require('axios');

const n8nClient = axios.create({
  baseURL: process.env.N8N_BASE_URL,
  timeout: 60000 // 60 seconds timeout per requirements
});

/**
 * Sends a transcript to n8n to generate a quiz
 */
exports.generateQuiz = async (webhookPayload) => {
  try {
    const response = await n8nClient.post(process.env.N8N_QUIZ_WEBHOOK, webhookPayload);
    // Returning dummy content for now assuming n8n may not be strictly running during initial dev
    if(!response.data || !response.data.success) {
      console.warn('n8n response missing or empty, returning default');
    }
    return response.data;
  } catch (error) {
    console.error('Error in n8nService generateQuiz:', error.message);
    throw new Error('AI_PROCESSING_TIMEOUT');
  }
};

/**
 * Sends a transcript to n8n to generate a summary
 */
exports.generateSummary = async (webhookPayload) => {
  try {
    const response = await n8nClient.post(process.env.N8N_SUMMARY_WEBHOOK, webhookPayload);
    return response.data;
  } catch (error) {
    console.error('Error in n8nService generateSummary:', error.message);
    throw new Error('AI_PROCESSING_TIMEOUT');
  }
};

/**
 * Sends chat query to n8n doubt resolver
 */
exports.resolveDoubt = async (webhookPayload) => {
  try {
    const response = await n8nClient.post(process.env.N8N_CHAT_WEBHOOK, webhookPayload);
    return response.data;
  } catch (error) {
    console.error('Error in n8nService resolveDoubt:', error.message);
    throw new Error('AI_PROCESSING_TIMEOUT');
  }
};
