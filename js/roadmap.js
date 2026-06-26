/**
 * Interactive Newcomer Roadmap Tracker
 * Manages milestones, custom task additions, progress math, and state saving.
 */

import { sanitizeWithLimit } from './security.js';

// Predefined milestones and default tasks
const DEFAULT_ROADMAP = {
  'pre-arrival': {
    title: 'Pre-arrival Checklist',
    description: 'Crucial steps before boarding your flight to Canada.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    tasks: [
      { id: 'pa_1', text: 'Obtain passport, visa, or eTA approval letter', completed: false, isCustom: false },
      { id: 'pa_2', text: 'Gather original documents (birth certificates, marriage license, credentials, drivers history record)', completed: false, isCustom: false },
      { id: 'pa_3', text: 'Prepare proof of funds (bank statements, drafts)', completed: false, isCustom: false },
      { id: 'pa_4', text: 'Secure temporary accommodation for the first 2-4 weeks', completed: false, isCustom: false },
      { id: 'pa_5', text: 'Get dental/medical checkups completed before leaving', completed: false, isCustom: false },
      { id: 'pa_6', text: 'Confirm CBSA declaration limits and restricted goods rules', completed: false, isCustom: false }
    ]
  },
  'first-30': {
    title: 'First 30 Days',
    description: 'Immediate essentials upon landing in Canada.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    tasks: [
      { id: 'f30_1', text: 'Apply for a Social Insurance Number (SIN) at Service Canada', completed: false, isCustom: false },
      { id: 'f30_2', text: 'Open a Canadian Bank Account (take Advantage of Newcomer packages)', completed: false, isCustom: false },
      { id: 'f30_3', text: 'Get a Canadian mobile SIM card and plan', completed: false, isCustom: false },
      { id: 'f30_4', text: 'Apply for your Provincial Health Insurance Card (e.g. OHIP, MSP, RAMQ)', completed: false, isCustom: false },
      { id: 'f30_5', text: 'Purchase a monthly transit pass or local transportation card', completed: false, isCustom: false },
      { id: 'f30_6', text: 'Register children in a local public school district', completed: false, isCustom: false }
    ]
  },
  'housing-health': {
    title: 'Housing & Healthcare',
    description: 'Establishing your home and family care network.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    tasks: [
      { id: 'hh_1', text: 'Search for long-term rental housing and sign a lease agreement', completed: false, isCustom: false },
      { id: 'hh_2', text: 'Set up home utilities (electricity, heating, internet/WiFi)', completed: false, isCustom: false },
      { id: 'hh_3', text: 'Purchase tenant insurance to protect your belongings', completed: false, isCustom: false },
      { id: 'hh_4', text: 'Register for your province’s family doctor waitlist (e.g., Health Care Connect in ON)', completed: false, isCustom: false },
      { id: 'hh_5', text: 'Locate local walk-in clinics and the nearest emergency hospital', completed: false, isCustom: false }
    ]
  },
  'settling-in': {
    title: 'Settling In (Months 2+)',
    description: 'Long-term integration and career growth.',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    tasks: [
      { id: 'si_1', text: 'Apply to exchange your foreign driver’s license for a provincial license', completed: false, isCustom: false },
      { id: 'si_2', text: 'Sign up for a local public library card (free resources, community events)', completed: false, isCustom: false },
      { id: 'si_3', text: 'Update your resume/CV to Canadian format standards', completed: false, isCustom: false },
      { id: 'si_4', text: 'Connect with settlement agencies (e.g., ACCES Employment, YMCA) for career support', completed: false, isCustom: false },
      { id: 'si_5', text: 'Explore Canadian credit score builders to build credit history', completed: false, isCustom: false }
    ]
  }
};

const STORAGE_KEY = 'maple_guide_roadmap_data';

export class RoadmapManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure default structure is preserved in case of local storage changes
        for (const cat in DEFAULT_ROADMAP) {
          if (!parsed[cat]) {
            parsed[cat] = DEFAULT_ROADMAP[cat];
          } else {
            // Merge tasks to keep default ones but keep completion statuses
            const defaultTasks = DEFAULT_ROADMAP[cat].tasks;
            const userTasks = parsed[cat].tasks || [];
            
            // Reconstruct tasks list: take user state for existing tasks, and keep custom tasks
            const mergedTasks = [];
            
            // Add default tasks with user completion state if matched
            defaultTasks.forEach(defT => {
              const matchingUserT = userTasks.find(ut => ut.id === defT.id);
              mergedTasks.push({
                ...defT,
                completed: matchingUserT ? matchingUserT.completed : defT.completed
              });
            });

            // Append user custom tasks
            userTasks.forEach(ut => {
              if (ut.isCustom) {
                mergedTasks.push(ut);
              }
            });

            parsed[cat].tasks = mergedTasks;
            parsed[cat].title = DEFAULT_ROADMAP[cat].title;
            parsed[cat].description = DEFAULT_ROADMAP[cat].description;
            parsed[cat].icon = DEFAULT_ROADMAP[cat].icon;
          }
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing roadmap data, resetting to default', e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_ROADMAP)); // Deep clone
  }

  saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  toggleTask(categoryId, taskId) {
    if (this.data[categoryId]) {
      const task = this.data[categoryId].tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        this.saveData();
      }
    }
  }

  addTask(categoryId, text) {
    if (!text || text.trim() === '') return null;
    const sanitizedText = sanitizeWithLimit(text, 150);
    
    if (this.data[categoryId]) {
      const newTask = {
        id: `custom_${Date.now()}`,
        text: sanitizedText,
        completed: false,
        isCustom: true
      };
      this.data[categoryId].tasks.push(newTask);
      this.saveData();
      return newTask;
    }
    return null;
  }

  deleteTask(categoryId, taskId) {
    if (this.data[categoryId]) {
      this.data[categoryId].tasks = this.data[categoryId].tasks.filter(t => t.id !== taskId);
      this.saveData();
    }
  }

  getProgressStats() {
    let total = 0;
    let completed = 0;
    
    for (const cat in this.data) {
      this.data[cat].tasks.forEach(t => {
        total++;
        if (t.completed) completed++;
      });
    }

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }

  getCategoryStats(categoryId) {
    if (!this.data[categoryId]) return { total: 0, completed: 0, percentage: 0 };
    const tasks = this.data[categoryId].tasks;
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }

  renderRoadmap(containerId, onProgressUpdate) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stats = this.getProgressStats();
    
    let html = `
      <div class="roadmap-header">
        <div class="roadmap-intro">
          <h2>Your Canadian Integration Roadmap</h2>
          <p>Track your arrival milestones and custom tasks as you transition into your new life in Canada.</p>
        </div>
        <div class="roadmap-summary-card">
          <div class="circular-progress-container">
            <svg class="progress-ring" width="80" height="80">
              <circle class="progress-ring-bg" stroke="var(--border-color)" stroke-width="6" fill="transparent" r="34" cx="40" cy="40"/>
              <circle class="progress-ring-bar" stroke="var(--primary-color)" stroke-dasharray="213.6" stroke-dashoffset="${213.6 - (213.6 * stats.percentage) / 100}" stroke-width="6" fill="transparent" r="34" cx="40" cy="40"/>
            </svg>
            <div class="progress-text">${stats.percentage}%</div>
          </div>
          <div class="roadmap-summary-details">
            <div class="roadmap-summary-number">${stats.completed} of ${stats.total}</div>
            <div class="roadmap-summary-label">Milestones Checked</div>
          </div>
        </div>
      </div>

      <div class="roadmap-categories-grid">
    `;

    for (const catId in this.data) {
      const category = this.data[catId];
      const catStats = this.getCategoryStats(catId);
      
      html += `
        <div class="roadmap-category-card" data-category="${catId}">
          <div class="category-card-header">
            <div class="category-icon-wrapper">${category.icon}</div>
            <div class="category-title-area">
              <h3>${category.title}</h3>
              <p>${category.description}</p>
            </div>
            <div class="category-badge">${catStats.percentage}%</div>
          </div>
          
          <div class="category-progress-bar-wrapper">
            <div class="category-progress-bar" style="width: ${catStats.percentage}%"></div>
          </div>
          
          <ul class="task-list" id="task-list-${catId}">
      `;

      category.tasks.forEach(task => {
        html += this.renderTaskItemHtml(catId, task);
      });

      html += `
          </ul>

          <div class="add-task-container">
            <input type="text" 
                   id="add-input-${catId}" 
                   placeholder="Add a custom task..." 
                   maxlength="150"
                   class="custom-task-input"
                   id="input-${catId}">
            <button class="add-task-btn" data-category="${catId}" id="btn-add-${catId}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;

    // Attach event listeners
    this.attachEventListeners(container, onProgressUpdate);
  }

  renderTaskItemHtml(catId, task) {
    const checkedAttr = task.completed ? 'checked' : '';
    const classAttr = task.completed ? 'task-item completed' : 'task-item';
    
    return `
      <li class="${classAttr}" id="task-container-${task.id}">
        <label class="checkbox-container">
          <input type="checkbox" 
                 class="task-checkbox" 
                 data-category="${catId}" 
                 data-task-id="${task.id}" 
                 ${checkedAttr}>
          <span class="checkmark"></span>
          <span class="task-text">${task.text}</span>
        </label>
        ${task.isCustom ? `
          <button class="delete-task-btn" 
                  data-category="${catId}" 
                  data-task-id="${task.id}" 
                  title="Remove custom task">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        ` : ''}
      </li>
    `;
  }

  attachEventListeners(container, onProgressUpdate) {
    // Checkbox toggles
    container.querySelectorAll('.task-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const catId = e.target.getAttribute('data-category');
        const taskId = e.target.getAttribute('data-task-id');
        this.toggleTask(catId, taskId);

        // Update task element styling
        const taskItem = document.getElementById(`task-container-${taskId}`);
        if (taskItem) {
          if (e.target.checked) {
            taskItem.classList.add('completed');
          } else {
            taskItem.classList.remove('completed');
          }
        }

        // Update indicators
        this.updateUIPercentages(container, onProgressUpdate);
      });
    });

    // Custom task additions via Button
    container.querySelectorAll('.add-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnElem = e.currentTarget;
        const catId = btnElem.getAttribute('data-category');
        const inputElem = document.getElementById(`add-input-${catId}`);
        this.handleAddCustomTask(catId, inputElem, container, onProgressUpdate);
      });
    });

    // Custom task additions via Enter Key
    container.querySelectorAll('.custom-task-input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const catId = e.target.id.replace('add-input-', '');
          this.handleAddCustomTask(catId, e.target, container, onProgressUpdate);
        }
      });
    });

    // Custom task deletions
    container.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnElem = e.currentTarget;
        const catId = btnElem.getAttribute('data-category');
        const taskId = btnElem.getAttribute('data-task-id');
        
        this.deleteTask(catId, taskId);
        
        // Remove from DOM
        const taskItem = document.getElementById(`task-container-${taskId}`);
        if (taskItem) {
          taskItem.style.opacity = '0';
          taskItem.style.transform = 'scale(0.9)';
          setTimeout(() => {
            taskItem.remove();
            this.updateUIPercentages(container, onProgressUpdate);
          }, 200);
        }
      });
    });
  }

  handleAddCustomTask(catId, inputElem, container, onProgressUpdate) {
    const text = inputElem.value;
    if (!text || text.trim() === '') return;

    const newTask = this.addTask(catId, text);
    if (newTask) {
      inputElem.value = '';
      
      // Append to the list in DOM
      const listElem = document.getElementById(`task-list-${catId}`);
      if (listElem) {
        const div = document.createElement('div');
        div.innerHTML = this.renderTaskItemHtml(catId, newTask);
        const taskItemNode = div.firstElementChild;
        taskItemNode.style.opacity = '0';
        taskItemNode.style.transform = 'translateY(10px)';
        listElem.appendChild(taskItemNode);
        
        // Trigger reflow & animation
        setTimeout(() => {
          taskItemNode.style.opacity = '1';
          taskItemNode.style.transform = 'translateY(0)';
          taskItemNode.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);

        // Bind events to the new element
        const checkbox = taskItemNode.querySelector('.task-checkbox');
        checkbox.addEventListener('change', (e) => {
          this.toggleTask(catId, newTask.id);
          if (e.target.checked) {
            taskItemNode.classList.add('completed');
          } else {
            taskItemNode.classList.remove('completed');
          }
          this.updateUIPercentages(container, onProgressUpdate);
        });

        const delBtn = taskItemNode.querySelector('.delete-task-btn');
        if (delBtn) {
          delBtn.addEventListener('click', () => {
            this.deleteTask(catId, newTask.id);
            taskItemNode.style.opacity = '0';
            taskItemNode.style.transform = 'scale(0.9)';
            setTimeout(() => {
              taskItemNode.remove();
              this.updateUIPercentages(container, onProgressUpdate);
            }, 200);
          });
        }

        this.updateUIPercentages(container, onProgressUpdate);
      }
    }
  }

  updateUIPercentages(container, onProgressUpdate) {
    // Recalculate stats
    const stats = this.getProgressStats();

    // Update global progress ring
    const ringBar = container.querySelector('.progress-ring-bar');
    const ringText = container.querySelector('.progress-text');
    const ringNum = container.querySelector('.roadmap-summary-number');

    if (ringBar) {
      const radius = 34;
      const circumference = 2 * Math.PI * radius; // 213.6
      const offset = circumference - (circumference * stats.percentage) / 100;
      ringBar.style.strokeDashoffset = offset;
    }
    if (ringText) {
      ringText.textContent = `${stats.percentage}%`;
    }
    if (ringNum) {
      ringNum.textContent = `${stats.completed} of ${stats.total}`;
    }

    // Update individual category badges and bars
    for (const catId in this.data) {
      const catStats = this.getCategoryStats(catId);
      const catCard = container.querySelector(`.roadmap-category-card[data-category="${catId}"]`);
      if (catCard) {
        const badge = catCard.querySelector('.category-badge');
        const pbar = catCard.querySelector('.category-progress-bar');
        
        if (badge) badge.textContent = `${catStats.percentage}%`;
        if (pbar) pbar.style.width = `${catStats.percentage}%`;
      }
    }

    // Fire callback for top-level navbar update if needed
    if (onProgressUpdate) {
      onProgressUpdate(stats);
    }
  }
}
