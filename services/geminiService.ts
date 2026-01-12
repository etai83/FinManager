import { GoogleGenAI } from "@google/genai";
import { Transaction, Budget } from '../types';

export const generateFinancialInsights = async (transactions: Transaction[], budgets: Budget[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });
  const context = `
    Transactions: ${JSON.stringify(transactions.slice(0, 10))}
    Budgets: ${JSON.stringify(budgets)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a financial advisor. Analyze the following financial data and provide 3 short, actionable bullet points for the user to improve their financial health. 
      Keep it under 50 words per point.
      Data: ${context}`
    });
    
    return response.text || "Could not generate insights.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this moment.";
  }
};

export const chatWithFinancialAssistant = async (
  message: string, 
  history: {role: 'user' | 'model', text: string}[],
  transactions: Transaction[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });
  
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
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt
    });
    return response.text || "I didn't catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I'm having trouble connecting to the brain right now.";
  }
};
