/**
 * City Selector & Cost of Living Estimator
 * Interactive budget calculator with provincial cost references, charts, and optimization tips.
 */

import { isValidBudget } from './security.js';

// Provincial baseline costs for a single individual
const PROVINCIAL_DATA = {
  ON: {
    name: 'Ontario',
    city: 'Toronto (Greater Toronto Area)',
    avgRent: 2200,
    avgGroceries: 380,
    avgTransit: 156,
    avgUtilities: 230,
    taxRate: '13% HST',
    tips: [
      'Rent is significantly cheaper if you live in transit-connected suburbs like Mississauga, Brampton, or Scarborough.',
      'Use the GO Transit network if commuting from outside Toronto; fare integration with the TTC makes transfers cheaper.',
      'Shop at discount supermarkets like No Frills, FreshCo, and Food Basics rather than Loblaws or Sobeys.'
    ]
  },
  BC: {
    name: 'British Columbia',
    city: 'Vancouver (Metro Vancouver)',
    avgRent: 2350,
    avgGroceries: 390,
    avgTransit: 140,
    avgUtilities: 210,
    taxRate: '12% HST/PST',
    tips: [
      'Venture into Burnaby, Surrey, or Coquitlam for more affordable rental housing options.',
      'Get a Compass Card and load a 3-zone pass if you travel across municipalities.',
      'Buy groceries in local Asian grocery markets like T&T or local fruit stands in Vancouver for lower pricing.'
    ]
  },
  QC: {
    name: 'Quebec',
    city: 'Montreal (Greater Montreal)',
    avgRent: 1450,
    avgGroceries: 340,
    avgTransit: 97,
    avgUtilities: 160,
    taxRate: '14.975% QST/GST',
    tips: [
      'Montreal offers some of the lowest rental prices among major North American cities.',
      'Buy an OPUS card transit pass which grants unlimited access to subways and buses in Montreal.',
      'Utility bills (hydroelectricity) are exceptionally low in Quebec due to hydro-power subsidies.'
    ]
  },
  AB: {
    name: 'Alberta',
    city: 'Calgary / Edmonton',
    avgRent: 1650,
    avgGroceries: 360,
    avgTransit: 112,
    avgUtilities: 290,
    taxRate: '5% GST (No Provincial Sales Tax)',
    tips: [
      'Alberta has no Provincial Sales Tax (PST), so shopping, dining, and retail purchases are cheaper.',
      'Heating/utility costs in winters are higher due to cold weather; budget extra for gas/electricity.',
      'Calgary has the C-Train light rail, where downtown travel is free along the 7th Avenue corridor.'
    ]
  },
  MB: {
    name: 'Manitoba',
    city: 'Winnipeg',
    avgRent: 1350,
    avgGroceries: 330,
    avgTransit: 108,
    avgUtilities: 190,
    taxRate: '12% RST/GST',
    tips: [
      'Winnipeg is highly affordable; focus on renting close to public transit lanes.',
      'Winters are cold; ensure your apartment heating insulation is verified.',
      'Shop at local discount grocery stores like FreshCo and Giant Tiger.'
    ]
  },
  SK: {
    name: 'Saskatchewan',
    city: 'Saskatoon / Regina',
    avgRent: 1300,
    avgGroceries: 340,
    avgTransit: 85,
    avgUtilities: 210,
    taxRate: '11% PST/GST',
    tips: [
      'Rental prices are very attractive; consider townhouses or basement suites.',
      'Saskatoon has a good bus system; register for a monthly pass.',
      'Utilities can rise during freezing winter months; budget carefully.'
    ]
  },
  NS: {
    name: 'Nova Scotia',
    city: 'Halifax (HRM)',
    avgRent: 1750,
    avgGroceries: 370,
    avgTransit: 90,
    avgUtilities: 240,
    taxRate: '15% HST',
    tips: [
      'Look for apartments near local bus routes if you do not own a vehicle, as transit options can be limited in suburbs.',
      'Electricity (Nova Scotia Power) is relatively expensive; manage your heating thermostats carefully.',
      'Check out local farmer markets (such as Halifax Seaport Market) for fresh, local, affordable produce.'
    ]
  },
  NB: {
    name: 'New Brunswick',
    city: 'Moncton / Fredericton',
    avgRent: 1350,
    avgGroceries: 350,
    avgTransit: 80,
    avgUtilities: 230,
    taxRate: '15% HST',
    tips: [
      'Moncton and Saint John offer very competitive rental rates.',
      'Look for heat pumps in rental properties to lower your power bills.',
      'Buy fresh produce locally at farmers markets in summer.'
    ]
  },
  PE: {
    name: 'Prince Edward Island',
    city: 'Charlottetown',
    avgRent: 1400,
    avgGroceries: 360,
    avgTransit: 60,
    avgUtilities: 220,
    taxRate: '15% HST',
    tips: [
      'Charlottetown is compact and walkable; you might save on buying a vehicle.',
      'Utility costs are moderate but public transit routes are limited.',
      'Look for local farm stands for affordable, fresh potatoes and vegetables.'
    ]
  },
  NL: {
    name: 'Newfoundland & Labrador',
    city: "St. John's",
    avgRent: 1250,
    avgGroceries: 370,
    avgTransit: 80,
    avgUtilities: 250,
    taxRate: '15% HST',
    tips: [
      "St. John's offers some of the lowest rental prices in Atlantic Canada.",
      'Public transit is operated by Metrobus; verify routes before signing a lease.',
      'Winters can be very windy and snowy; ensure insulation is good in your rental.'
    ]
  },
  YT: {
    name: 'Yukon',
    city: 'Whitehorse',
    avgRent: 1850,
    avgGroceries: 480,
    avgTransit: 80,
    avgUtilities: 320,
    taxRate: '5% GST (No PST)',
    tips: [
      'Whitehorse is the hub of Yukon, offering good transit connections.',
      'Heating is a major expense in winter; look for rental agreements that include heating/utilities.',
      'Enjoy a lower tax rate (5% GST only).'
    ]
  },
  NT: {
    name: 'Northwest Territories',
    city: 'Yellowknife',
    avgRent: 1950,
    avgGroceries: 520,
    avgTransit: 85,
    avgUtilities: 360,
    taxRate: '5% GST (No PST)',
    tips: [
      'Costs for food and utilities are high due to remote northern logistics.',
      'Energy subsidies are available for permanent residents.',
      'Check out community free closets and winter clothing swaps.'
    ]
  },
  NU: {
    name: 'Nunavut',
    city: 'Iqaluit',
    avgRent: 2600,
    avgGroceries: 750,
    avgTransit: 50,
    avgUtilities: 490,
    taxRate: '5% GST (No PST)',
    tips: [
      'Groceries are extremely expensive due to fly-in shipping; use federal Nutrition North food subsidy programs.',
      'Housing is in very high demand and short supply.',
      'Be prepared for winter utility costs and remote living adjustments.'
    ]
  }
};

export class BudgetEstimatorManager {
  constructor() {
    this.selectedProvince = 'ON';
    this.familySize = 1;
    
    // User custom inputs, defaulted to province standards initially
    this.userRent = 2000;
    this.userGroceries = 350;
    this.userTransit = 120;
    this.userUtilities = 200;
    this.userMisc = 150;
  }

  initValuesForProvince() {
    const prov = PROVINCIAL_DATA[this.selectedProvince];
    const multiplier = this.getFamilyMultiplier();

    this.userRent = Math.round(prov.avgRent * (1 + (this.familySize - 1) * 0.25)); // rent scales slower
    this.userGroceries = Math.round(prov.avgGroceries * multiplier);
    this.userTransit = Math.round(prov.avgTransit * Math.min(this.familySize, 2)); // capped at two transits for simplicity
    this.userUtilities = Math.round(prov.avgUtilities * (1 + (this.familySize - 1) * 0.3));
    this.userMisc = 100 * this.familySize;
  }

  getFamilyMultiplier() {
    // Math to scale costs based on family members
    if (this.familySize === 1) return 1.0;
    if (this.familySize === 2) return 1.7;
    if (this.familySize === 3) return 2.2;
    if (this.familySize === 4) return 2.7;
    return 3.2; // 5+
  }

  renderBudgetPlanner(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let provOptions = '';
    for (const key in PROVINCIAL_DATA) {
      provOptions += `<option value="${key}" ${this.selectedProvince === key ? 'selected' : ''}>${PROVINCIAL_DATA[key].name} (${PROVINCIAL_DATA[key].city})</option>`;
    }

    let familyOptions = '';
    [1, 2, 3, 4, 5].forEach(size => {
      const label = size === 5 ? '5+ People' : `${size} ${size === 1 ? 'Person' : 'People'}`;
      familyOptions += `<option value="${size}" ${this.familySize === size ? 'selected' : ''}>${label}</option>`;
    });

    const prov = PROVINCIAL_DATA[this.selectedProvince];
    const totalUser = this.userRent + this.userGroceries + this.userTransit + this.userUtilities + this.userMisc;
    
    // Scale average provincial budgets based on family count
    const fMult = this.getFamilyMultiplier();
    const rMult = 1 + (this.familySize - 1) * 0.25;
    const uMult = 1 + (this.familySize - 1) * 0.3;
    const tMult = Math.min(this.familySize, 2);

    const provRent = Math.round(prov.avgRent * rMult);
    const provGroceries = Math.round(prov.avgGroceries * fMult);
    const provTransit = Math.round(prov.avgTransit * tMult);
    const provUtilities = Math.round(prov.avgUtilities * uMult);
    const provMisc = Math.round(100 * this.familySize);
    const totalProv = provRent + provGroceries + provTransit + provUtilities + provMisc;

    let html = `
      <div class="budget-layout-grid animate-fade-in">
        
        <!-- Controls Column -->
        <div class="budget-controls-card">
          <h2>Canada Cost of Living Estimator</h2>
          <p class="section-subtitle">Set your targets to build a realistic monthly living budget.</p>

          <div class="form-row-group">
            <div class="input-element-pair">
              <label for="budget-province-dropdown">Target Province</label>
              <select id="budget-province-dropdown" class="budget-select-control">
                ${provOptions}
              </select>
            </div>

            <div class="input-element-pair">
              <label for="budget-family-dropdown">Family Size</label>
              <select id="budget-family-dropdown" class="budget-select-control">
                ${familyOptions}
              </select>
            </div>
          </div>

          <div class="slider-inputs-list">
            
            <div class="slider-input-group">
              <div class="slider-labels">
                <span class="slider-title">🏠 Rent / Housing</span>
                <span class="slider-value">$${this.userRent}</span>
              </div>
              <input type="range" id="slider-rent" min="500" max="6000" step="50" value="${this.userRent}" class="budget-slider">
              <span class="avg-marker">Province Avg: $${provRent}</span>
            </div>

            <div class="slider-input-group">
              <div class="slider-labels">
                <span class="slider-title">🛒 Groceries / Food</span>
                <span class="slider-value">$${this.userGroceries}</span>
              </div>
              <input type="range" id="slider-groceries" min="100" max="2500" step="20" value="${this.userGroceries}" class="budget-slider">
              <span class="avg-marker">Province Avg: $${provGroceries}</span>
            </div>

            <div class="slider-input-group">
              <div class="slider-labels">
                <span class="slider-title">🚇 Transportation / Commuting</span>
                <span class="slider-value">$${this.userTransit}</span>
              </div>
              <input type="range" id="slider-transit" min="0" max="800" step="10" value="${this.userTransit}" class="budget-slider">
              <span class="avg-marker">Province Avg: $${provTransit}</span>
            </div>

            <div class="slider-input-group">
              <div class="slider-labels">
                <span class="slider-title">⚡ Utilities (Internet, Phone, Hydro)</span>
                <span class="slider-value">$${this.userUtilities}</span>
              </div>
              <input type="range" id="slider-utilities" min="50" max="1000" step="10" value="${this.userUtilities}" class="budget-slider">
              <span class="avg-marker">Province Avg: $${provUtilities}</span>
            </div>

            <div class="slider-input-group">
              <div class="slider-labels">
                <span class="slider-title">🛍️ Misc / Entertainment</span>
                <span class="slider-value">$${this.userMisc}</span>
              </div>
              <input type="range" id="slider-misc" min="0" max="1500" step="10" value="${this.userMisc}" class="budget-slider">
              <span class="avg-marker">Province Avg: $${provMisc}</span>
            </div>

          </div>
        </div>

        <!-- Output Visualization Column -->
        <div class="budget-visuals-panel">
          
          <div class="budget-summary-header-card">
            <div class="summary-cost-display">
              <span class="cost-number">$${totalUser}</span>
              <span class="cost-frequency">/ month estimated</span>
            </div>
            <div class="summary-cost-comparison">
              <span>Provincial standard for this setup is <strong>$${totalProv}</strong>.</span>
              <span class="comp-badge ${totalUser <= totalProv ? 'savings' : 'overspent'}">
                ${totalUser <= totalProv ? 'Under Province Average' : 'Above Province Average'}
              </span>
            </div>
          </div>

          <div class="chart-section-card">
            <h3>Budget Comparison Chart</h3>
            <div class="chart-canvas-wrapper">
              <canvas id="budget-canvas-chart" width="400" height="240"></canvas>
            </div>
          </div>

          <div class="province-savings-tips-card">
            <div class="tips-card-header">
              <h3>Saving in ${prov.name}</h3>
              <span class="tax-info-pill">Sales Tax: ${prov.taxRate}</span>
            </div>
            <ul class="tips-bullet-list">
              ${prov.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>

        </div>

      </div>
    `;

    container.innerHTML = html;
    this.attachEventListeners(container);
    this.drawChart();
  }

  attachEventListeners(container) {
    // Dropdowns
    const provSel = container.querySelector('#budget-province-dropdown');
    if (provSel) {
      provSel.addEventListener('change', (e) => {
        this.selectedProvince = e.target.value;
        this.initValuesForProvince();
        this.renderBudgetPlanner(container.id);
      });
    }

    const famSel = container.querySelector('#budget-family-dropdown');
    if (famSel) {
      famSel.addEventListener('change', (e) => {
        this.familySize = parseInt(e.target.value, 10);
        this.initValuesForProvince();
        this.renderBudgetPlanner(container.id);
      });
    }

    // Sliders
    const sliders = [
      { id: 'slider-rent', prop: 'userRent' },
      { id: 'slider-groceries', prop: 'userGroceries' },
      { id: 'slider-transit', prop: 'userTransit' },
      { id: 'slider-utilities', prop: 'userUtilities' },
      { id: 'slider-misc', prop: 'userMisc' }
    ];

    sliders.forEach(slider => {
      const rangeEl = container.querySelector(`#${slider.id}`);
      if (rangeEl) {
        rangeEl.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          if (isValidBudget(val)) {
            this[slider.prop] = val;
            
            // Fast UI update without redrawing whole DOM (prevents slider stutter)
            const labelVal = rangeEl.previousElementSibling.querySelector('.slider-value');
            if (labelVal) labelVal.textContent = `$${val}`;

            // Update totals
            const totalUser = this.userRent + this.userGroceries + this.userTransit + this.userUtilities + this.userMisc;
            const totalDisplay = container.querySelector('.summary-cost-display .cost-number');
            if (totalDisplay) totalDisplay.textContent = `$${totalUser}`;

            // Calculate total Provincial
            const prov = PROVINCIAL_DATA[this.selectedProvince];
            const fMult = this.getFamilyMultiplier();
            const rMult = 1 + (this.familySize - 1) * 0.25;
            const uMult = 1 + (this.familySize - 1) * 0.3;
            const tMult = Math.min(this.familySize, 2);

            const provTotal = Math.round(
              (prov.avgRent * rMult) + 
              (prov.avgGroceries * fMult) + 
              (prov.avgTransit * tMult) + 
              (prov.avgUtilities * uMult) + 
              (100 * this.familySize)
            );

            const badge = container.querySelector('.comp-badge');
            if (badge) {
              if (totalUser <= provTotal) {
                badge.className = 'comp-badge savings';
                badge.textContent = 'Under Province Average';
              } else {
                badge.className = 'comp-badge overspent';
                badge.textContent = 'Above Province Average';
              }
            }

            // Redraw chart
            this.drawChart();
          }
        });
      }
    });
  }

  drawChart() {
    const canvas = document.getElementById('budget-canvas-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate categories and average provincial comparisons
    const categories = [
      { name: 'Rent', user: this.userRent, prov: PROVINCIAL_DATA[this.selectedProvince].avgRent },
      { name: 'Food', user: this.userGroceries, prov: PROVINCIAL_DATA[this.selectedProvince].avgGroceries },
      { name: 'Transit', user: this.userTransit, prov: PROVINCIAL_DATA[this.selectedProvince].avgTransit },
      { name: 'Utilities', user: this.userUtilities, prov: PROVINCIAL_DATA[this.selectedProvince].avgUtilities },
      { name: 'Misc', user: this.userMisc, prov: 100 }
    ];

    // Scale comparisons based on multipliers
    const fMult = this.getFamilyMultiplier();
    const rMult = 1 + (this.familySize - 1) * 0.25;
    const uMult = 1 + (this.familySize - 1) * 0.3;
    const tMult = Math.min(this.familySize, 2);

    categories[0].prov = Math.round(categories[0].prov * rMult);
    categories[1].prov = Math.round(categories[1].prov * fMult);
    categories[2].prov = Math.round(categories[2].prov * tMult);
    categories[3].prov = Math.round(categories[3].prov * uMult);
    categories[4].prov = Math.round(categories[4].prov * this.familySize);

    // Setup chart boundaries
    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 40;
    const chartWidth = canvas.width - paddingLeft - paddingRight;
    const chartHeight = canvas.height - paddingTop - paddingBottom;

    // Find max value to scale chart
    let maxValue = 1000;
    categories.forEach(c => {
      if (c.user > maxValue) maxValue = c.user;
      if (c.prov > maxValue) maxValue = c.prov;
    });
    maxValue = Math.ceil((maxValue + 100) / 500) * 500; // Round to nearest 500

    // Draw horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#8e9aa8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';

    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const val = (maxValue / gridLines) * i;
      const y = paddingTop + chartHeight - (chartHeight * (i / gridLines));
      
      // Draw grid line
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(paddingLeft + chartWidth, y);
      ctx.stroke();

      // Draw Y label
      ctx.fillText(`$${val}`, paddingLeft - 8, y + 3);
    }

    // Draw X labels & Bars
    const colCount = categories.length;
    const colGap = chartWidth / colCount;
    const barWidth = colGap * 0.32;

    // Color definitions
    // User bar color (Maple cozy crimson gradient)
    const userBarColor = '#D80621'; 
    // Average province comparison color (Soft slate/grey-blue)
    const provBarColor = '#4a5b6d';

    categories.forEach((cat, index) => {
      const colX = paddingLeft + (colGap * index) + (colGap / 2);
      
      // Compute heights
      const userHeight = (cat.user / maxValue) * chartHeight;
      const provHeight = (cat.prov / maxValue) * chartHeight;

      // Positions
      const userX = colX - barWidth - 2;
      const provX = colX + 2;
      
      const userY = paddingTop + chartHeight - userHeight;
      const provY = paddingTop + chartHeight - provHeight;

      // Draw Provincial Average Bar (Background comparison)
      ctx.fillStyle = provBarColor;
      this.drawRoundedRect(ctx, provX, provY, barWidth, provHeight, 4);
      ctx.fill();

      // Draw User Budget Bar (Foreground active)
      ctx.fillStyle = userBarColor;
      this.drawRoundedRect(ctx, userX, userY, barWidth, userHeight, 4);
      ctx.fill();

      // Draw labels under axis
      ctx.fillStyle = '#d1d8e0';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cat.name, colX, paddingTop + chartHeight + 18);
    });

    // Draw bottom axis line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(paddingLeft - 4, paddingTop + chartHeight);
    ctx.lineTo(paddingLeft + chartWidth, paddingTop + chartHeight);
    ctx.stroke();

    // Draw legend
    ctx.textAlign = 'left';
    ctx.font = '10px sans-serif';
    
    // User legend
    ctx.fillStyle = userBarColor;
    ctx.fillRect(paddingLeft + 10, paddingTop - 16, 12, 8);
    ctx.fillStyle = '#d1d8e0';
    ctx.fillText('Your Budget', paddingLeft + 27, paddingTop - 9);

    // Provincial average legend
    ctx.fillStyle = provBarColor;
    ctx.fillRect(paddingLeft + 110, paddingTop - 16, 12, 8);
    ctx.fillStyle = '#d1d8e0';
    ctx.fillText('Provincial Average', paddingLeft + 127, paddingTop - 9);
  }

  // Helper method to draw rounded columns
  drawRoundedRect(ctx, x, y, width, height, radius) {
    if (height <= 0) return;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
