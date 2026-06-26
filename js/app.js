/**
 * MAple AI Guide - Main Application Controller
 * Coordinates page routing, global progress updates, settings modal, and theme configurations.
 */

import { RoadmapManager } from './roadmap.js';
import { FormsHelperManager } from './forms.js';
import { CultureCoachManager } from './culture.js';
import { BudgetEstimatorManager } from './budget.js';
import { getApiKey, setApiKey, hasApiKey } from './api.js';

class ApplicationController {
  constructor() {
    this.roadmap = new RoadmapManager();
    this.forms = new FormsHelperManager();
    this.culture = new CultureCoachManager();
    this.budget = new BudgetEstimatorManager();

    this.activeSection = 'roadmap'; // default section
    
    // Bind methods
    this.updateGlobalProgress = this.updateGlobalProgress.bind(this);
  }

  init() {
    this.setupRouting();
    this.setupSettingsModal();
    this.setupTheme();

    // Render default view
    this.renderActiveSection();
    this.updateGlobalProgress();
  }

  setupRouting() {
    const navButtons = document.querySelectorAll('.nav-link');
    
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.currentTarget.getAttribute('data-section');
        if (section && section !== this.activeSection) {
          // Remove active from all nav items
          navButtons.forEach(nb => nb.classList.remove('active'));
          // Add to clicked
          e.currentTarget.classList.add('active');

          this.activeSection = section;
          this.renderActiveSection();
          
          // If moving away from chat, make sure loading is stopped
          if (section !== 'culture') {
            this.culture.isChatLoading = false;
          }
        }
      });
    });
  }

  renderActiveSection() {
    // Hide all sections first
    const sections = document.querySelectorAll('.app-section');
    sections.forEach(sec => {
      sec.classList.remove('active');
      sec.style.display = 'none';
    });

    const activeSecElement = document.getElementById(`${this.activeSection}-section`);
    if (activeSecElement) {
      activeSecElement.style.display = 'block';
      // Trigger a small delay before adding active class for CSS transition fades
      setTimeout(() => {
        activeSecElement.classList.add('active');
      }, 20);
    }

    // Call render methods for each module
    switch (this.activeSection) {
      case 'roadmap':
        this.roadmap.renderRoadmap('roadmap-section', this.updateGlobalProgress);
        break;
      case 'forms':
        this.forms.renderHelper('forms-section');
        break;
      case 'culture':
        this.culture.renderCoach('culture-section');
        break;
      case 'budget':
        this.budget.renderBudgetPlanner('budget-section');
        break;
    }
  }

  updateGlobalProgress() {
    const stats = this.roadmap.getProgressStats();
    
    // Update navbar indicators
    const navProgressText = document.getElementById('nav-progress-percentage');
    const navProgressBar = document.getElementById('nav-progress-bar-fill');
    
    if (navProgressText) {
      navProgressText.textContent = `${stats.percentage}%`;
    }
    if (navProgressBar) {
      navProgressBar.style.width = `${stats.percentage}%`;
    }

    // Update floating summary in settings if exist
    const settingsStatus = document.getElementById('settings-progress-num');
    if (settingsStatus) {
      settingsStatus.textContent = `${stats.completed}/${stats.total} Tasks`;
    }
  }

  setupSettingsModal() {
    const settingsBtn = document.getElementById('settings-toggle-btn');
    const modalOverlay = document.getElementById('settings-modal-overlay');
    const closeModalBtn = document.getElementById('close-settings-btn');
    const saveKeyBtn = document.getElementById('save-key-btn');
    const clearKeyBtn = document.getElementById('clear-key-btn');
    const apiKeyInput = document.getElementById('settings-api-key-input');
    const keyStatusText = document.getElementById('api-key-status-text');

    const updateModalStatus = () => {
      if (hasApiKey()) {
        keyStatusText.textContent = 'API Key is configured and saved locally.';
        keyStatusText.className = 'status-configured';
        apiKeyInput.value = '••••••••••••••••••••••••••••••••';
      } else {
        keyStatusText.textContent = 'No API Key configured. Language coach will run in demo/offline mode.';
        keyStatusText.className = 'status-unconfigured';
        apiKeyInput.value = '';
      }
    };

    if (settingsBtn && modalOverlay) {
      settingsBtn.addEventListener('click', () => {
        updateModalStatus();
        modalOverlay.classList.add('visible');
      });
    }

    if (closeModalBtn && modalOverlay) {
      closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('visible');
      });
      // Close on clicking overlay background
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          modalOverlay.classList.remove('visible');
        }
      });
    }

    if (saveKeyBtn && apiKeyInput) {
      saveKeyBtn.addEventListener('click', () => {
        const val = apiKeyInput.value.trim();
        if (val.startsWith('••')) {
          // Key was unchanged, close modal
          modalOverlay.classList.remove('visible');
          return;
        }

        if (val.length < 15) {
          alert('Please enter a valid Gemini API Key.');
          return;
        }

        setApiKey(val);
        updateModalStatus();
        
        // Notify coach module to redraw and remove overlay if open
        if (this.activeSection === 'culture') {
          this.culture.renderCoach('culture-section');
        }

        modalOverlay.classList.remove('visible');
      });
    }

    if (clearKeyBtn) {
      clearKeyBtn.addEventListener('click', () => {
        setApiKey('');
        updateModalStatus();
        
        // Notify coach module
        if (this.activeSection === 'culture') {
          this.culture.chatHistory = [];
          this.culture.renderCoach('culture-section');
        }
      });
    }
  }

  setupTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('maple_guide_theme') || 'dark';

    // Apply initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtonIcon(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('maple_guide_theme', newTheme);
        
        this.updateThemeButtonIcon(newTheme);

        // Re-draw budget chart to match theme backgrounds
        if (this.activeSection === 'budget') {
          this.budget.drawChart();
        }
      });
    }
  }

  updateThemeButtonIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      `;
      btn.title = 'Switch to Light Mode';
    } else {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      `;
      btn.title = 'Switch to Dark Mode';
    }
  }
}

// Instantiate application on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  const app = new ApplicationController();
  app.init();
});
