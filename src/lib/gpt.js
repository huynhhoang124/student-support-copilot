'use strict';

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const temperature = Number(process.env.OPENAI_TEMPERATURE || 0.6);

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const promptCache = new Map();

/**
 * Đọc prompt từ thư mục src/prompts chỉ một lần.
 * @param {string} fileName
 */
function loadPrompt(fileName) {
  if (promptCache.has(fileName)) {
    return promptCache.get(fileName);
  }

  const filePath = path.join(__dirname, '..', 'prompts', fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  promptCache.set(fileName, content);
  return content;
}

async function callOpenAI(messages) {
  if (!client) {
    console.warn('OPENAI_API_KEY chưa được cấu hình, trả về phản hồi mô phỏng.');
    return {
      role: 'assistant',
      content: 'GPT mock: ' + messages.map((m) => m.content).join(' ')
    };
  }

  const response = await client.chat.completions.create({
    model,
    temperature,
    messages
  });

  return response.choices[0].message;
}

async function classifyIntent(text) {
  const systemPrompt = loadPrompt('classify_intent.md');
  const message = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: text }
  ]);

  return message.content.trim();
}

async function summarizeTicket({ title, description, updates }) {
  const systemPrompt = loadPrompt('summarize.md');
  const userContent = JSON.stringify({ title, description, updates }, null, 2);
  const message = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ]);
  return message.content.trim();
}

async function composeEmail({ recipient, subject, context }) {
  const systemPrompt = loadPrompt('reply_email.md');
  const userContent = `Người nhận: ${recipient}\nChủ đề: ${subject}\nNgữ cảnh: ${context}`;
  const message = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ]);

  return {
    subject,
    body: message.content.trim()
  };
}

async function generateStudyPlan({ goals, strengths, weaknesses, timeframe }) {
  const systemPrompt = loadPrompt('study_plan.md');
  const userContent = JSON.stringify({ goals, strengths, weaknesses, timeframe }, null, 2);
  const message = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ]);
  return message.content.trim();
}

module.exports = {
  classifyIntent,
  summarizeTicket,
  composeEmail,
  generateStudyPlan
};
