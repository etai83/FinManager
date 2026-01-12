import { GoogleGenAI } from "@google/genai";
import { Transaction, Budget } from '../types';
import { AIConfig } from '../contexts/AIContext';

const callOllama = async (config: AIConfig, prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${config.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.ollamaModel,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Ollama Error:", error);
    throw error;
  }
};

export const generateFinancialInsights = async (transactions: Transaction[], budgets: Budget[], config: AIConfig): Promise<string> => {
  const context = `
    Transactions: ${JSON.stringify(transactions.slice(0, 10))}
    Budgets: ${JSON.stringify(budgets)}
  `;

  const prompt = `You are a financial advisor. Analyze the following financial data and provide 3 short, actionable bullet points for the user to improve their financial health.
      Keep it under 50 words per point.
      Data: ${context}`;

  try {
    if (config.provider === 'ollama') {
        return await callOllama(config, prompt);
    } else {
        const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt
        });
        return response.text || "Could not generate insights.";
    }
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Unable to generate insights at this moment.";
  }
};

export const chatWithFinancialAssistant = async (
  message: string,
  history: {role: 'user' | 'model', text: string}[],
  transactions: Transaction[],
  config: AIConfig
): Promise<string> => {

  // Construct a simplified context of the latest transactions to save tokens
  const transactionContext = JSON.stringify(transactions.map(t => ({
    date: t.date, merchant: t.merchant, amount: t.amount, category: t.category
  })));

  const systemPrompt = `You are a helpful AI financial assistant named 'FinManager Assistant'.
  You have access to the user's recent transactions: ${transactionContext}.
  Answer questions about their spending, trends, and specific transactions.
  If the user asks about something not in the data, politely say you don't have that info.
  Keep answers concise and friendly. Format monetary values nicely.`;

  // Build conversation history for the API
  let fullPrompt = `${systemPrompt}\n\n`;
  history.forEach(msg => {
    fullPrompt += `${msg.role === 'user' ? 'User' : 'Model'}: ${msg.text}\n`;
  });
  fullPrompt += `User: ${message}\nModel:`;

  try {
    if (config.provider === 'ollama') {
        return await callOllama(config, fullPrompt);
    } else {
        const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: fullPrompt
        });
        return response.text || "I didn't catch that.";
    }
  } catch (error) {
    console.error("AI Service Chat Error:", error);
    return "Sorry, I'm having trouble connecting to the brain right now.";
  }
};
