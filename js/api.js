/**
 * Gemini API Integration Layer
 * Manages the secure client-side key storage and calls Gemini 1.5 Pro for the coach module.
 */

const API_KEY_STORAGE_KEY = 'maple_guide_gemini_key';

/**
 * Gets the stored Gemini API key from LocalStorage.
 * @returns {string|null} - API Key or null
 */
export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

/**
 * Saves the Gemini API key to LocalStorage.
 * @param {string} key - API Key
 */
export function setApiKey(key) {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Checks if the API key is set.
 * @returns {boolean} - True if set
 */
export function hasApiKey() {
  const key = getApiKey();
  return !!(key && key.trim().length > 10);
}

/**
 * Sends a message history and user input to Gemini 1.5 Pro.
 * @param {Array<{role: string, content: string}>} history - Previous messages
 * @param {string} promptText - Next prompt
 * @param {string} mode - 'english' or 'french' or 'etiquette'
 * @returns {Promise<string>} - Model's response
 */
export async function sendChatMessage(history, promptText, mode = 'english') {
  const key = getApiKey();
  if (!key) {
    throw new Error('Gemini API key is not configured. Please set it in the top settings header.');
  }

  // Choose system instructions depending on selected coach mode
  let systemInstruction = `
    You are 'MAple Coach', a virtual guide built into the MAple AI Guide web application for newcomers to Canada.
    Your job is to act as a supportive language and cultural coach.
    
    CRITICAL INSTRUCTION:
    For all immigration, policy, or legal questions, you MUST start or end your message with this exact disclaimer:
    "Disclaimer: I am an AI assistant, not an official immigration representative. Always verify rules on Canada.ca."
    Keep your answers accurate and based on real-world Canadian facts. Do not make up rules.
  `;

  if (mode === 'english') {
    systemInstruction += `
      Focus: Canadian English, spelling (e.g. colour, flavour, dialogue, centre), and regional expressions/slang.
      Help the user practice dialogues (such as ordering coffee, asking for directions, or chatting with colleagues).
      Encourage them, correct minor language mistakes politely, and introduce a Canadian slang term if natural (e.g., Loonie, Toonie, Double-Double, Eh, Timbit, Parkade, Chesterfield).
    `;
  } else if (mode === 'french') {
    systemInstruction += `
      Focus: Canadian French (Québécois expressions, vocabulary differences like 'dépanneur' for corner store, 'char' for car, 'magasiner' for shopping).
      Reply primarily in French, but you can explain in English if the user struggles.
      Provide interactive roleplay situations suited for Quebec or bilingual communities.
    `;
  } else if (mode === 'etiquette') {
    systemInstruction += `
      Focus: Canadian social etiquette, tipping system (15-20% standard in restaurants), lining up (queuing), personal space, office culture, small talk topics (weather is safe, money/politics/religion should be avoided initially), and general politeness (overuse of "sorry" and "thank you").
      Teach them these aspects interactively through realistic workplace, retail, or social scenario drills.
    `;
  }

  // Format history to match Gemini's structure
  // Gemini expects: { contents: [ { role: 'user'|'model', parts: [ { text: '...' } ] } ] }
  // Note: Gemini API requires alternate user/model turns.
  const contents = [];
  
  // Format past history
  history.forEach(msg => {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  });

  // Append new user message
  contents.push({
    role: 'user',
    parts: [{ text: promptText }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${key}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      const errMsg = errData?.error?.message || `HTTP ${response.status} error`;
      throw new Error(`Gemini API Error: ${errMsg}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('Received an empty response from Gemini API.');
    }

    return generatedText;
  } catch (error) {
    console.error('Gemini API Fetch failed:', error);
    throw error;
  }
}
