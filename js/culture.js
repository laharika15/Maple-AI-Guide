/**
 * Language & Local Culture Coach
 * Manages flashcards, preset conversation prompts, and chatbot UI communicating with the Gemini API.
 */

import { sendChatMessage, hasApiKey } from './api.js';
import { sanitizeWithLimit } from './security.js';

// Dictionary of local terms and social etiquette
const FLASHCARDS = [
  {
    word: 'Loonie',
    category: 'Slang',
    meaning: 'The Canadian 1-dollar coin.',
    example: '“Can you spare a loonie for the shopping cart?”',
    tip: 'The coin features a picture of a common loon (a Canadian water bird), which is how it got its name!'
  },
  {
    word: 'Toonie',
    category: 'Slang',
    meaning: 'The Canadian 2-dollar coin.',
    example: '“I bought this coffee using a single toonie.”',
    tip: 'Formed as a blend of the words "two" and "loonie". It features a polar bear on one side.'
  },
  {
    word: 'Double-Double',
    category: 'Slang',
    meaning: 'A coffee with two creams and two sugars.',
    example: '“I’ll grab a medium double-double and three Timbits, please.”',
    tip: 'This is a staple term popularized by the iconic Canadian coffee shop chain, Tim Hortons.'
  },
  {
    word: 'Eh',
    category: 'Slang',
    meaning: 'A spoken tag added to invite agreement or confirm understanding.',
    example: '“It’s really cold out today, eh?”',
    tip: 'Equivalent to saying "isn’t it?" or "right?". Avoid overusing it; it comes naturally to locals in informal chats.'
  },
  {
    word: 'Washroom',
    category: 'Vocabulary',
    meaning: 'The standard Canadian term for a public restroom or toilet.',
    example: '“Excuse me, could you point me to the washroom?”',
    tip: 'While Americans say "restroom" or "bathroom", Canadians almost exclusively use "washroom".'
  },
  {
    word: 'Tipping Etiquette',
    category: 'Social Rule',
    meaning: 'Adding 15% to 20% of the pre-tax bill for table services, taxis, and hair salons.',
    example: 'For a $50 restaurant meal, a standard tip is $7.50 (15%) to $10.00 (20%).',
    tip: 'Tipping is not legally required but is culturally mandatory. Servers are paid a minimum wage, and tips form a significant part of their income.'
  },
  {
    word: 'Apologizing (“Sorry”)',
    category: 'Social Rule',
    meaning: 'Using "sorry" frequently as a social buffer to maintain harmony, politeness, and respect.',
    example: 'If someone bumps into you in Canada, both parties will often say "sorry".',
    tip: 'In Canadian culture, "sorry" does not necessarily mean an admission of legal fault; it is just an expression of empathy and politeness.'
  },
  {
    word: 'Lining Up (Queuing)',
    category: 'Social Rule',
    meaning: 'Forming a neat, single-file line to wait for services or transit boardings.',
    example: 'Waiting for the bus or purchasing coffee at a stand requires queuing in order of arrival.',
    tip: 'Cutting in line is considered extremely rude and confrontational in Canadian society.'
  },
  {
    word: 'Two-Four',
    category: 'Slang',
    meaning: 'A case containing 24 bottles or cans of beer.',
    example: '“Let’s grab a two-four before we head to the cottage.”',
    tip: 'Also associated with the May 24th long weekend (Victoria Day), often nicknamed "May Two-Four".'
  },
  {
    word: 'Parkade',
    category: 'Vocabulary',
    meaning: 'A multi-level parking garage.',
    example: '“You can park your car in the parkade behind the mall.”',
    tip: 'This term is widely used across Western Canada and parts of Ontario.'
  }
];

const PRESETS = [
  {
    id: 'tims',
    title: '☕ Ordering at Tim Hortons',
    description: 'Practice ordering coffee and baked goods using local slang.',
    starter: 'Hi! Welcome to Tim Hortons. What can I get started for you today?'
  },
  {
    id: 'rent',
    title: '🔑 Inquiring about a Rental',
    description: 'Roleplay calling a landlord to ask about an apartment lease.',
    starter: 'Hello, thanks for calling. Yes, the one-bedroom apartment on Main Street is still available. Do you have any questions about it?'
  },
  {
    id: 'weather',
    title: '🌤️ Office Weather Small Talk',
    description: 'Practice the classic Canadian icebreaker with a colleague.',
    starter: 'Morning! Can you believe all this snow we got last night? The roads were a complete mess!'
  }
];

export class CultureCoachManager {
  constructor() {
    this.currentTab = 'flashcards'; // 'flashcards' or 'chat'
    this.currentCardIndex = 0;
    this.isCardFlipped = false;
    
    this.chatHistory = [];
    this.selectedPreset = PRESETS[0];
    this.isChatLoading = false;
  }

  renderCoach(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="coach-layout">
        <div class="coach-tabs">
          <button class="coach-tab-btn ${this.currentTab === 'flashcards' ? 'active' : ''}" data-tab="flashcards">
            📚 Culture Flashcards
          </button>
          <button class="coach-tab-btn ${this.currentTab === 'chat' ? 'active' : ''}" data-tab="chat">
            💬 Roleplay Practice Chat
          </button>
        </div>

        <div class="coach-panel-content" id="coach-active-panel">
          ${this.currentTab === 'flashcards' ? this.renderFlashcards() : this.renderChat()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachEventListeners(container);
  }

  renderFlashcards() {
    const card = FLASHCARDS[this.currentCardIndex];
    
    return `
      <div class="flashcards-container animate-fade-in">
        <div class="flashcards-intro">
          <h2>Canadian Slang & Etiquette Flashcards</h2>
          <p>Flip the cards to learn essential expressions, vocabulary, and social norms to blend in like a local.</p>
        </div>

        <div class="flashcard-deck">
          <div class="flashcard ${this.isCardFlipped ? 'flipped' : ''}" id="culture-flashcard">
            
            <!-- Card Front -->
            <div class="card-face card-front">
              <span class="card-category-badge">${card.category}</span>
              <h3 class="card-word">${card.word}</h3>
              <p class="card-prompt">Click Card to Reveal Definition</p>
            </div>

            <!-- Card Back -->
            <div class="card-face card-back">
              <span class="card-category-badge">${card.category}</span>
              <h3 class="card-back-word">${card.word}</h3>
              
              <div class="card-meaning-block">
                <strong>Meaning:</strong>
                <p>${card.meaning}</p>
              </div>

              <div class="card-example-block">
                <strong>Example:</strong>
                <p><em>${card.example}</em></p>
              </div>

              <div class="card-tip-block">
                <strong>💡 Quick Tip:</strong>
                <p>${card.tip}</p>
              </div>
            </div>

          </div>
        </div>

        <div class="flashcard-controls">
          <button class="icon-btn" id="prev-card-btn" ${this.currentCardIndex === 0 ? 'disabled' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Previous
          </button>
          
          <span class="card-index-indicator">${this.currentCardIndex + 1} of ${FLASHCARDS.length}</span>
          
          <button class="icon-btn" id="next-card-btn" ${this.currentCardIndex === FLASHCARDS.length - 1 ? 'disabled' : ''}>
            Next
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    `;
  }

  renderChat() {
    const keyConfigured = hasApiKey();
    
    let presetsHtml = '';
    PRESETS.forEach(p => {
      const active = this.selectedPreset.id === p.id ? 'active' : '';
      presetsHtml += `
        <button class="preset-card ${active}" data-preset-id="${p.id}">
          <h4>${p.title}</h4>
          <p>${p.description}</p>
        </button>
      `;
    });

    let chatFeedHtml = '';
    if (this.chatHistory.length === 0) {
      chatFeedHtml = `
        <div class="chat-placeholder">
          <div class="chat-placeholder-icon">🇨🇦</div>
          <h3>Welcome to MAple Coach Chat</h3>
          <p>Choose a scenario from the sidebar and send a message to begin your conversation practice.</p>
          <p class="secondary-info">Practice spelling, Québécois French terms, or office politeness rules interactively.</p>
        </div>
      `;
    } else {
      this.chatHistory.forEach(msg => {
        const bubbleClass = msg.role === 'user' ? 'chat-bubble user' : 'chat-bubble assistant';
        const avatar = msg.role === 'user' ? '👤' : '🍁';
        chatFeedHtml += `
          <div class="${bubbleClass}">
            <div class="chat-avatar">${avatar}</div>
            <div class="chat-message-wrapper">
              <div class="chat-message-text">${msg.content}</div>
            </div>
          </div>
        `;
      });
    }

    return `
      <div class="chat-container-layout animate-fade-in">
        <div class="chat-presets-sidebar">
          <h3>Practice Scenarios</h3>
          <p class="section-subtitle">Select a scenario to start practicing:</p>
          <div class="presets-list-vertical">
            ${presetsHtml}
          </div>
          
          <div class="disclaimer-small-box">
            <p><strong>Strict Policy:</strong> MAple Coach is for language/culture practice. Always double-check immigration facts on <a href="https://www.canada.ca" target="_blank" rel="noopener">Canada.ca</a>.</p>
          </div>
        </div>

        <div class="chat-main-window">
          ${!keyConfigured ? `
            <div class="api-key-warning-overlay">
              <div class="key-warning-card">
                <h3>Gemini API Key Required</h3>
                <p>To have real-time dialogues tailored to you using <strong>Gemini 1.5 Pro</strong>, you need to configure an API Key.</p>
                <div class="key-steps">
                  <ol>
                    <li>Get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener">Google AI Studio</a>.</li>
                    <li>Paste the key into the <strong>API Key Settings</strong> modal (click the gear icon in the top header).</li>
                    <li>The key is stored strictly locally in your browser.</li>
                  </ol>
                </div>
                <div class="overlay-button-row">
                  <button class="primary-action-btn" id="open-settings-from-chat">Set API Key Now</button>
                  <button class="secondary-action-btn" id="run-mock-chat-btn">Try Local Simulator (No Key)</button>
                </div>
              </div>
            </div>
          ` : ''}

          <div class="chat-header-bar">
            <div class="chat-header-title">
              <h4>${this.selectedPreset.title}</h4>
              <span class="active-badge">Online Practice</span>
            </div>
            <button class="reset-chat-btn" id="reset-chat-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              Reset Chat
            </button>
          </div>

          <div class="chat-feed-area" id="chat-feed-element">
            ${chatFeedHtml}
            ${this.isChatLoading ? `
              <div class="chat-bubble assistant loading-bubble">
                <div class="chat-avatar">🍁</div>
                <div class="chat-message-wrapper">
                  <div class="shimmer-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="chat-input-bar">
            <input type="text" 
                   id="chat-text-input" 
                   placeholder="Type your response here..." 
                   maxlength="250"
                   class="chat-textbox"
                   ${!keyConfigured && this.chatHistory.length === 0 ? 'disabled' : ''}>
            <button id="send-chat-btn" 
                    class="send-chat-btn"
                    ${(!keyConfigured && this.chatHistory.length === 0) || this.isChatLoading ? 'disabled' : ''}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners(container) {
    // Tab switching
    container.querySelectorAll('.coach-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.currentTab = tab;
        this.renderCoach(container.id);
      });
    });

    if (this.currentTab === 'flashcards') {
      this.attachFlashcardEvents(container);
    } else {
      this.attachChatEvents(container);
    }
  }

  attachFlashcardEvents(container) {
    const cardElement = container.querySelector('#culture-flashcard');
    if (cardElement) {
      cardElement.addEventListener('click', () => {
        this.isCardFlipped = !this.isCardFlipped;
        if (this.isCardFlipped) {
          cardElement.classList.add('flipped');
        } else {
          cardElement.classList.remove('flipped');
        }
      });
    }

    const prevBtn = container.querySelector('#prev-card-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentCardIndex > 0) {
          this.currentCardIndex--;
          this.isCardFlipped = false;
          this.renderCoach(container.id);
        }
      });
    }

    const nextBtn = container.querySelector('#next-card-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentCardIndex < FLASHCARDS.length - 1) {
          this.currentCardIndex++;
          this.isCardFlipped = false;
          this.renderCoach(container.id);
        }
      });
    }
  }

  attachChatEvents(container) {
    // Open settings button
    const openSetBtn = container.querySelector('#open-settings-from-chat');
    if (openSetBtn) {
      openSetBtn.addEventListener('click', () => {
        const settingsModal = document.getElementById('settings-modal-overlay');
        if (settingsModal) {
          settingsModal.classList.add('visible');
        }
      });
    }

    // Run mock chat (fallback)
    const runMockBtn = container.querySelector('#run-mock-chat-btn');
    if (runMockBtn) {
      runMockBtn.addEventListener('click', () => {
        this.chatHistory = [
          { role: 'assistant', content: this.selectedPreset.starter }
        ];
        this.renderCoach(container.id);
        this.scrollToBottom();
      });
    }

    // Reset Chat
    const resetBtn = container.querySelector('#reset-chat-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.chatHistory = [];
        this.isChatLoading = false;
        this.renderCoach(container.id);
      });
    }

    // Preset scenarios switching
    container.querySelectorAll('.preset-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const pid = e.currentTarget.getAttribute('data-preset-id');
        const found = PRESETS.find(p => p.id === pid);
        if (found) {
          this.selectedPreset = found;
          this.chatHistory = [];
          if (hasApiKey() || this.chatHistory.length > 0) {
            this.chatHistory = [{ role: 'assistant', content: found.starter }];
          }
          this.renderCoach(container.id);
          this.scrollToBottom();
        }
      });
    });

    // Chat text submissions
    const textInput = container.querySelector('#chat-text-input');
    const sendBtn = container.querySelector('#send-chat-btn');

    const triggerSend = () => {
      const text = textInput.value;
      if (!text || text.trim() === '') return;
      this.handleSendMessage(text, container);
    };

    if (sendBtn) {
      sendBtn.addEventListener('click', triggerSend);
    }
    if (textInput) {
      textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          triggerSend();
        }
      });
    }
  }

  async handleSendMessage(text, container) {
    const cleanText = sanitizeWithLimit(text, 250);
    
    // Add user message to history
    this.chatHistory.push({ role: 'user', content: cleanText });
    this.isChatLoading = true;
    this.renderCoach(container.id);
    this.scrollToBottom();

    // Check if key is configured
    if (!hasApiKey()) {
      // Run local simulated fallback mock replies
      setTimeout(() => {
        let reply = '';
        const lowercaseText = cleanText.toLowerCase();
        
        // Custom simple logic checks
        if (this.selectedPreset.id === 'tims') {
          if (lowercaseText.includes('double') || lowercaseText.includes('coffee')) {
            reply = "Excellent choice! That will be $2.20. Would you like any Timbits with that? We have honey dip, chocolate glazed, and sour cream glazed today! (Simulated local response)";
          } else if (lowercaseText.includes('timbit') || lowercaseText.includes('donut')) {
            reply = "Awesome, a box of Timbits coming right up. Anything else for your order today? (Simulated local response)";
          } else {
            reply = "Sure thing. I can get that ready. Will that be cash or debit/credit card? (Simulated local response)";
          }
        } else if (this.selectedPreset.id === 'rent') {
          if (lowercaseText.includes('price') || lowercaseText.includes('rent') || lowercaseText.includes('cost')) {
            reply = "The monthly rent is $1,950 utilities extra. It includes heating and hot water, though. Are you looking to move in on the first of next month? (Simulated local response)";
          } else if (lowercaseText.includes('pet') || lowercaseText.includes('dog') || lowercaseText.includes('cat')) {
            reply = "We do allow small pets with a pet deposit, as long as they are quiet. What kind of pet do you have? (Simulated local response)";
          } else {
            reply = "Great. We require a tenant application form, a credit report check, and reference letters. Would you like to schedule a viewing for this Saturday? (Simulated local response)";
          }
        } else {
          // Weather smalltalk
          if (lowercaseText.includes('cold') || lowercaseText.includes('snow') || lowercaseText.includes('winter')) {
            reply = "I know, right! I had to shovel my driveway for half an hour this morning. Hopefully, the snow plows clear the side streets soon. (Simulated local response)";
          } else {
            reply = "Typical Canadian weather, eh? Always keeps us on our toes. Have a good productive day! (Simulated local response)";
          }
        }

        // Add disclaimer to simulated replies
        reply += "<br><br><small style='opacity: 0.7;'>Disclaimer: I am an AI assistant, not an official immigration representative. Always verify rules on Canada.ca.</small>";
        
        this.chatHistory.push({ role: 'assistant', content: reply });
        this.isChatLoading = false;
        this.renderCoach(container.id);
        this.scrollToBottom();
      }, 1000);
      return;
    }

    try {
      // Call official Gemini API
      let mode = 'english';
      if (this.selectedPreset.id === 'tims') {
        mode = 'english';
      } else if (this.selectedPreset.id === 'weather') {
        mode = 'etiquette';
      }
      
      const response = await sendChatMessage(this.chatHistory.slice(0, -1), cleanText, mode);
      
      this.chatHistory.push({ role: 'assistant', content: response });
    } catch (err) {
      console.error(err);
      this.chatHistory.push({ 
        role: 'assistant', 
        content: `<span class="chat-error">Error connecting to Gemini API: ${err.message}. Please verify your key in the settings.</span>`
      });
    } finally {
      this.isChatLoading = false;
      this.renderCoach(container.id);
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const feed = document.getElementById('chat-feed-element');
      if (feed) {
        feed.scrollTop = feed.scrollHeight;
      }
    }, 50);
  }
}
