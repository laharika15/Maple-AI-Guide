/**
 * Document & Forms Helper
 * Dynamic guide providing checklist requirements, step instructions, and direct official Canada.ca references.
 */

const FORM_GUIDES = {
  sin: {
    title: 'Social Insurance Number (SIN)',
    officialLink: 'https://www.canada.ca/en/employment-social-development/services/sin.html',
    description: 'A 9-digit number issued by the Government of Canada. You need a SIN to work in Canada or access government programs and benefits.',
    cost: 'Free ($0)',
    timeline: 'In person: Same day. Online/Mail: Within 10-15 business days.',
    methods: [
      {
        name: 'Option A: Apply In-Person (Recommended)',
        steps: [
          'Locate your nearest <strong>Service Canada Centre</strong>.',
          'Bring your original primary identity documents (such as Work Permit, Study Permit, PR Card, or COPR).',
          'Bring a secondary identification document (such as passport, foreign driver’s license, or national ID).',
          'Receive your SIN paper on-the-spot. Service Canada does not issue plastic cards anymore.'
        ]
      },
      {
        name: 'Option B: Apply Online',
        steps: [
          'Visit the official Service Canada online portal (link below).',
          'Upload high-quality, clear scans of your primary identity document (front and back).',
          'Upload scans of your secondary identity document.',
          'Upload a proof of address (such as a utility bill, bank statement, or lease agreement).',
          'Check your status online; the SIN letter will be mailed to your Canadian address.'
        ]
      }
    ],
    requirements: [
      { text: 'Primary ID (Work Permit, Study Permit, PR Card, or Confirmation of PR)', required: true },
      { text: 'Secondary ID (Passport, Driver’s License)', required: true },
      { text: 'Proof of Canadian Address (if applying online)', required: true },
      { text: 'Legal translation of documents (if they are not in English or French)', required: false }
    ]
  },
  bank: {
    title: 'Opening a Canadian Bank Account',
    officialLink: 'https://www.canada.ca/en/financial-consumer-agency/services/financial-toolkit/banking/banking-1/2.html',
    description: 'Having a local bank account is essential for receiving wages, renting housing, and paying utilities. Most major banks offer "Newcomer Packages" with no monthly fees for the first 12 months.',
    cost: 'Free ($0 monthly fee for 1 year with Newcomer Packages)',
    timeline: 'In person: 30 to 60 minutes. Online: 1-3 business days.',
    methods: [
      {
        name: 'Step-by-Step Onboarding',
        steps: [
          'Choose a major Canadian bank (e.g., RBC, TD, Scotiabank, BMO, CIBC, or National Bank). Compare their newcomer benefits.',
          'Book an appointment online or walk into a branch with a designated Newcomer Advisor.',
          'Present your status documents and passport to the advisor.',
          'Choose a chequing account (for daily transactions) and a savings account (for earning interest).',
          'Apply for a newcomer credit card (often offered with no Canadian credit history requirements) to begin building your credit score.',
          'Set up online banking and download the mobile app.'
        ]
      }
    ],
    requirements: [
      { text: 'Passport', required: true },
      { text: 'Immigration document (PR Card, COPR, Work Permit, or Study Permit)', required: true },
      { text: 'Proof of Canadian address (lease, utility bill, or cell phone bill)', required: true },
      { text: 'Canadian phone number', required: true },
      { text: 'Social Insurance Number (optional for daily accounts, but required for interest-earning savings accounts)', required: false }
    ]
  },
  health: {
    title: 'Provincial Health Card',
    description: 'Canada’s healthcare is funded publicly and administered by individual provinces/territories. You must apply to your province’s plan to receive free medical care.',
    cost: 'Free ($0)',
    timeline: 'Varies by province. Some provinces (like Ontario) have eliminated the 3-month waiting period.',
    methods: [],
    requirements: []
  },
  license: {
    title: "Provincial Photo ID / Driver's License",
    description: "Proof of address and legal identity in Canada. Non-drivers can obtain a Photo ID Card for daily verification, while drivers can exchange or apply for a Driver's License.",
    cost: "Varies by jurisdiction ($15 - $90)",
    timeline: "Temporary printout given same day; permanent card mailed within 15-30 days.",
    methods: [
      {
        name: "Option A: Foreign Driver's License Exchange",
        steps: [
          "Determine if your home country has a reciprocal licensing agreement with your province/territory.",
          "If reciprocal, visit a local licensing agent (e.g. ServiceOntario, ICBC) and swap directly.",
          "If non-reciprocal, gather your official driving record history from your home country to get credit for experience.",
          "Pass the vision test and the written knowledge test, then book your road exams."
        ]
      },
      {
        name: "Option B: Provincial Non-Driver Photo ID Card",
        steps: [
          "If you do not drive, request a regional Photo ID card instead.",
          "Visit a regional registry office with your identity and status documents.",
          "Provide proof of provincial address (utility bill, lease, bank letter).",
          "Have your photo taken and pay a small processing fee."
        ]
      }
    ],
    requirements: [
      { text: "Passport", required: true },
      { text: "Immigration status document (PR Card, COPR, Work/Study Permit)", required: true },
      { text: "Proof of address in jurisdiction (rental lease, utility bill)", required: true },
      { text: "Foreign driver's license (if exchanging)", required: false },
      { text: "Certified English/French translation of foreign license (if applicable)", required: false }
    ]
  }
};

const PROVINCIAL_HEALTH_DATA = {
  ON: {
    name: 'Ontario (OHIP)',
    link: 'https://www.ontario.ca/page/apply-ohip-and-get-health-card',
    waitingPeriod: 'No waiting period (waived/eliminated). Coverage begins immediately.',
    steps: [
      'Locate a <strong>ServiceOntario</strong> centre that offers health card services.',
      'Fill out the "Registration for Ontario Health Insurance Coverage" form (available at the centre or online).',
      'Go in person with your original qualifying documents.'
    ],
    requirements: [
      'Proof of Canadian citizenship or eligible immigration status (PR Card, COPR, or Work Permit valid for at least 6 months).',
      'Proof of residency in Ontario (e.g., signed rental agreement, utility bill, Ontario driver’s license).',
      'Proof of identity showing your name and signature (e.g., passport, credit card).'
    ]
  },
  QC: {
    name: 'Quebec (RAMQ)',
    link: 'https://www.ramq.gouv.qc.ca/en/citizens/health-insurance',
    waitingPeriod: 'Up to a 3-month waiting period. Acquire private health insurance for this initial phase.',
    steps: [
      'Submit an online request for registration or call RAMQ to obtain the application form.',
      'Provide your status documents and proof of residency.',
      'Present original documents at a RAMQ office or via secure post.'
    ],
    requirements: [
      'Proof of legal authorization to stay in Canada (PR card, COPR, or Work Permit).',
      'Proof of residency in Quebec (e.g., lease, lease attestation, employer letter).',
      'Passport photo ID verification.'
    ]
  },
  BC: {
    name: 'British Columbia (MSP)',
    link: 'https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp',
    waitingPeriod: 'Coverage begins the first day of the third month following your arrival date.',
    steps: [
      'Apply online using the BC Health Benefits Service portal.',
      'Upload high-quality images of identity and immigration documents.',
      'BC will mail you a Combined BC Services Card/Health Card.'
    ],
    requirements: [
      'Proof of status in Canada (Study Permit, Work Permit valid for 6+ months, PR Card, or COPR).',
      'Proof of residency in British Columbia.',
      'Primary ID check.'
    ]
  },
  AB: {
    name: 'Alberta (AHCIP)',
    link: 'https://www.alberta.ca/ahcip-how-to-register.aspx',
    waitingPeriod: 'Usually starts the date you establish residency in Alberta, if registered within 3 months.',
    steps: [
      'Download and fill out the AHCIP application form.',
      'Gather original proof documents.',
      'Submit the application in person at a registry agent location or mail it to the AHCIP office.'
    ],
    requirements: [
      'Proof of Alberta residency (utility bills, lease, pay stubs).',
      'Proof of legal status in Canada (PR Card, COPR, Work Permit).',
      'Identity verification (Passport, driver’s license).'
    ]
  },
  MB: {
    name: 'Manitoba Health',
    link: 'https://www.gov.mb.ca/health/mhsip/index.html',
    waitingPeriod: 'Begins on the first day of the third month after landing.',
    steps: [
      'Complete the Manitoba Health Registration form.',
      'Submit scans of status and address proof documents online or by mail.'
    ],
    requirements: [
      'PR Card/COPR or Work Permit (valid for 12+ months).',
      'Proof of address in Manitoba.'
    ]
  },
  SK: {
    name: 'Saskatchewan (eHealth)',
    link: 'https://www.ehealthsask.ca/residents/health-cards',
    waitingPeriod: 'Usually first day of third month following residency establishment.',
    steps: [
      'Apply online through the eHealth Saskatchewan resident services account portal.',
      'Scan and attach copies of required proof files.'
    ],
    requirements: [
      'Legal status documents in Canada (PR/Work/Study permit).',
      'Residency proof (Saskatchewan utility bill, rental contract).',
      'Supporting identification.'
    ]
  },
  NS: {
    name: 'Nova Scotia (MSI)',
    link: 'https://novascotia.ca/dhw/msi/',
    waitingPeriod: 'Coverage begins the date you establish permanent residence, if registered promptly.',
    steps: [
      'Call the MSI registration branch (1-800-563-8880) to request a form, or email them.',
      'Mail completed form with status photocopies.'
    ],
    requirements: [
      'Copy of Canadian immigration documents.',
      'Residency confirmation in Nova Scotia.'
    ]
  },
  NB: {
    name: 'New Brunswick Medicare',
    link: 'https://www2.gnb.ca/content/gnb/en/departments/health/MedicarePrescriptionDrug/content/medicare.html',
    waitingPeriod: 'Begins the first day of the third month of arrival.',
    steps: [
      'Download the Medicare registration form.',
      'Mail or drop off the completed form to a Service New Brunswick office.'
    ],
    requirements: [
      'Immigration documentation (PR, Work Permit).',
      'Two proofs of New Brunswick residency.'
    ]
  },
  PE: {
    name: 'Prince Edward Island Health',
    link: 'https://www.princeedwardisland.ca/en/information/health-and-wellness/health-pei-card',
    waitingPeriod: 'Begins first day of third month after arrival.',
    steps: [
      'Complete PEI Health Card Application online or via paper mail.',
      'Submit proof of legal presence and residency.'
    ],
    requirements: [
      'Immigration permits (PR, Work Permit).',
      'PEI address proof (utility bills).'
    ]
  },
  NL: {
    name: 'Newfoundland & Labrador (MCP)',
    link: 'https://www.gov.nl.ca/hcs/mcp/',
    waitingPeriod: 'Coverage starts upon registration if all conditions are met.',
    steps: [
      'Complete MCP Registration Form.',
      'Submit in person or mail/email to MCP Offices in St. John’s or Grand Falls-Windsor.'
    ],
    requirements: [
      'PR Card/COPR, or Work Permit (valid for 12+ months).',
      'Proof of NL residency.'
    ]
  },
  YT: {
    name: 'Yukon (YHCIP)',
    link: 'https://yukon.ca/en/apply-health-care-card',
    waitingPeriod: 'No waiting period if you apply immediately upon arrival.',
    steps: [
      'Download and complete the Yukon Health Care Insurance Plan Application.',
      'Submit the form in person at the Whitehorse health services office or mail it with original documents.'
    ],
    requirements: [
      'Proof of legal status in Canada (PR Card, COPR, or eligible Work Permit).',
      'Two original documents proving Yukon residency (e.g. lease, utility bill).'
    ]
  },
  NT: {
    name: 'Northwest Territories Health Care',
    link: 'https://www.hss.gov.nt.ca/en/services/nwt-health-care-plan',
    waitingPeriod: 'Coverage begins the first day of the third month of residency.',
    steps: [
      'Obtain and fill out the NWT Health Care Plan application form.',
      'Mail the form with photocopies of status and residency proofs to Health Services Administration.'
    ],
    requirements: [
      'NWT Residency proof (utility bill, lease).',
      'Proof of Canadian citizenship or eligible immigration status (PR, Work Permit valid for 12+ months).'
    ]
  },
  NU: {
    name: 'Nunavut Health Care Plan',
    link: 'https://www.gov.nu.ca/health/information/nunavut-health-care-plan',
    waitingPeriod: 'Usually no waiting period if registering as a permanent resident upon landing.',
    steps: [
      'Complete the Nunavut Health Care Plan application form.',
      'Submit in person at a local community health center or mail to the Health Insurance office in Rankin Inlet.'
    ],
    requirements: [
      'Nunavut residency confirmation.',
      'Proof of Canadian status (PR, eligible work permit).'
    ]
  }
};

const PROVINCIAL_LICENSE_DATA = {
  ON: {
    name: 'Ontario',
    authority: 'DriveTest / ServiceOntario',
    link: 'https://www.drivetest.ca',
    guidelines: 'Exchange your foreign driver’s license within 60 days of landing. Reciprocal exchanges exist for US, UK, Germany, France, Japan, Australia, South Korea, etc. Otherwise, take the G1 knowledge test to start the licensing path.'
  },
  QC: {
    name: 'Quebec',
    authority: 'SAAQ (Société de l’assurance automobile)',
    link: 'https://saaq.gouv.qc.ca/en/',
    guidelines: 'You can drive using your foreign license for up to 6 months. To exchange, you must book an appointment with SAAQ. Reciprocal exchanges apply to select countries; others require tests.'
  },
  BC: {
    name: 'British Columbia',
    authority: 'ICBC (Insurance Corporation of BC)',
    link: 'https://www.icbc.com',
    guidelines: 'Must exchange foreign license within 90 days. Reciprocal exchange allows swap for Class 5. Non-reciprocal licenses require knowledge test and Class 7 road test.'
  },
  AB: {
    name: 'Alberta',
    authority: 'Service Alberta Registry Agent',
    link: 'https://www.alberta.ca/get-drivers-licence.aspx',
    guidelines: 'Visit any registry agent. Foreign licenses from reciprocal countries can be swapped directly. Non-reciprocal requires GDL knowledge/road tests.'
  },
  MB: {
    name: 'Manitoba',
    authority: 'MPI (Manitoba Public Insurance)',
    link: 'https://www.mpi.mb.ca',
    guidelines: 'Apply at any MPI agent. Swap is direct for reciprocal agreements. Non-reciprocal requires written knowledge and road tests.'
  },
  SK: {
    name: 'Saskatchewan',
    authority: 'SGI (Saskatchewan Government Insurance)',
    link: 'https://www.sgi.sk.ca',
    guidelines: 'Visit any SGI motor partner office. Reciprocal swap for Class 5. Others require the driver education course and road tests.'
  },
  NS: {
    name: 'Nova Scotia',
    authority: 'Access Nova Scotia',
    link: 'https://novascotia.ca/sns/access/',
    guidelines: 'Exchange within 90 days of establishing residency. Reciprocal exchanges swap directly. Others start Nova Scotia Graduated Driver Licensing.'
  },
  NB: {
    name: 'New Brunswick',
    authority: 'Service New Brunswick',
    link: 'https://www2.gnb.ca/content/gnb/en/departments/safety-public-security/driver_licensing.html',
    guidelines: 'Go to a Service NB center. Reciprocal swap available. Vision and written tests needed for non-reciprocal applicants.'
  },
  PE: {
    name: 'Prince Edward Island',
    authority: 'Access PEI',
    link: 'https://www.princeedwardisland.ca/en/information/transportation-infrastructure-and-energy/drivers-licenses',
    guidelines: 'Visit Access PEI. Swap directly if from reciprocal region; otherwise complete Prince Edward Island driving exams.'
  },
  NL: {
    name: 'Newfoundland & Labrador',
    authority: 'Motor Registration Division',
    link: 'https://www.gov.nl.ca/motorregistration/',
    guidelines: 'Apply to swap within 3 months of landing. Reciprocal swaps are direct. Road testing is required for non-reciprocal licenses.'
  },
  YT: {
    name: 'Yukon',
    authority: 'Yukon Motor Vehicles',
    link: 'https://yukon.ca/en/driver-licensing',
    guidelines: 'Apply in person at the Whitehorse Motor Vehicles office. Exchange agreements apply to select countries; others require tests.'
  },
  NT: {
    name: 'Northwest Territories',
    authority: 'NWT Driver and Vehicle Services',
    link: 'https://www.inf.gov.nt.ca/en/services/drivers-licencing',
    guidelines: 'Visit a licensing office in Yellowknife or regional hubs. Out-of-territory licenses can be transferred with proof of status.'
  },
  NU: {
    name: 'Nunavut',
    authority: 'Nunavut Motor Vehicles',
    link: 'https://www.gov.nu.ca/economic-development-and-transportation/information/motor-vehicle-services',
    guidelines: 'Submit application to the Community Government and Services desk. Nunavut does not have drive test centers in all hamlets.'
  }
};

export class FormsHelperManager {
  constructor() {
    this.selectedDoc = 'sin';
    this.selectedProvince = 'ON';
  }

  renderHelper(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="forms-helper-layout">
        <div class="forms-sidebar">
          <h3>Essential Documents</h3>
          <p class="section-subtitle">Select a critical step to view guide:</p>
          
          <div class="doc-nav-buttons">
            <button class="doc-nav-btn ${this.selectedDoc === 'sin' ? 'active' : ''}" data-doc="sin">
              <span class="btn-num">1</span>
              <span class="btn-title">Social Insurance Number (SIN)</span>
            </button>
            <button class="doc-nav-btn ${this.selectedDoc === 'bank' ? 'active' : ''}" data-doc="bank">
              <span class="btn-num">2</span>
              <span class="btn-title">Open a Bank Account</span>
            </button>
            <button class="doc-nav-btn ${this.selectedDoc === 'health' ? 'active' : ''}" data-doc="health">
              <span class="btn-num">3</span>
              <span class="btn-title">Provincial Health Card</span>
            </button>
            <button class="doc-nav-btn ${this.selectedDoc === 'license' ? 'active' : ''}" data-doc="license">
              <span class="btn-num">4</span>
              <span class="btn-title">Photo ID & Driver's License</span>
            </button>
          </div>

          <div class="official-canada-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <p><strong>Disclaimer:</strong> I am an AI assistant, not an official immigration representative. Always verify current rules on <a href="https://www.canada.ca" target="_blank" rel="noopener">Canada.ca</a>.</p>
          </div>
        </div>

        <div class="forms-content-panel" id="forms-detail-panel">
          ${this.renderDetailContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachEventListeners(container);
  }

  renderDetailContent() {
    if (this.selectedDoc === 'health') {
      return this.renderHealthCardContent();
    }
    if (this.selectedDoc === 'license') {
      return this.renderLicenseContent();
    }

    const guide = FORM_GUIDES[this.selectedDoc];
    if (!guide) return 'Select a document guide to continue.';

    let methodsHtml = '';
    guide.methods.forEach(method => {
      methodsHtml += `
        <div class="method-card">
          <h4>${method.name}</h4>
          <ol class="step-ol">
            ${method.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      `;
    });

    let reqsHtml = '';
    guide.requirements.forEach(req => {
      reqsHtml += `
        <li class="req-item-bullet">
          <svg class="bullet-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${req.required ? 'var(--primary-color)' : 'var(--text-muted)'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div>
            <span class="req-name">${req.text}</span>
            <span class="req-badge ${req.required ? 'req-required' : 'req-optional'}">${req.required ? 'Required' : 'Optional'}</span>
          </div>
        </li>
      `;
    });

    return `
      <div class="doc-detail-header animate-fade-in">
        <div class="header-main-info">
          <h2>${guide.title}</h2>
          <span class="cost-pill">Cost: ${guide.cost}</span>
        </div>
        <p class="doc-description">${guide.description}</p>
        
        <div class="info-quick-stats">
          <div class="stat-box">
            <span class="stat-label">Estimated Timeline</span>
            <span class="stat-value">${guide.timeline}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Official Portal</span>
            <a href="${guide.officialLink}" class="stat-value link-anchor" target="_blank" rel="noopener">
              Visit Canada.ca
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="doc-detail-body animate-fade-in">
        <div class="requirements-section">
          <h3>Documents Checklist</h3>
          <p class="section-subtitle">Make sure you have original copies of the following:</p>
          <ul class="requirements-list">
            ${reqsHtml}
          </ul>
        </div>

        <div class="instructions-section">
          <h3>Application Steps</h3>
          ${methodsHtml}
        </div>
      </div>
    `;
  }

  renderHealthCardContent() {
    const guide = FORM_GUIDES.health;
    const prov = PROVINCIAL_HEALTH_DATA[this.selectedProvince];

    let provOptions = '';
    for (const key in PROVINCIAL_HEALTH_DATA) {
      provOptions += `
        <option value="${key}" ${this.selectedProvince === key ? 'selected' : ''}>
          ${PROVINCIAL_HEALTH_DATA[key].name}
        </option>
      `;
    }

    let stepsHtml = '';
    prov.steps.forEach(step => {
      stepsHtml += `<li>${step}</li>`;
    });

    let reqsHtml = '';
    prov.requirements.forEach(req => {
      reqsHtml += `
        <li class="req-item-bullet">
          <svg class="bullet-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span class="req-name">${req}</span>
        </li>
      `;
    });

    return `
      <div class="doc-detail-header animate-fade-in">
        <div class="header-main-info">
          <h2>${guide.title}</h2>
          <span class="cost-pill">Cost: ${guide.cost}</span>
        </div>
        <p class="doc-description">${guide.description}</p>
        
        <div class="province-selector-row">
          <label for="health-prov-selector">Choose your Province / Territory:</label>
          <select id="health-prov-selector" class="province-dropdown-select">
            ${provOptions}
          </select>
        </div>
      </div>

      <div class="doc-detail-body animate-fade-in">
        <div class="province-details-card">
          <div class="prov-card-header">
            <h3>Health Care in ${prov.name}</h3>
            <a href="${prov.link}" class="link-anchor prov-link-btn" target="_blank" rel="noopener">
              Official Site
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>

          <div class="prov-waiting-badge-box">
            <span class="waiting-title">Waiting Period:</span>
            <span class="waiting-value">${prov.waitingPeriod}</span>
          </div>

          <div class="prov-columns-grid">
            <div class="prov-column">
              <h4>Required Documents</h4>
              <ul class="requirements-list">
                ${reqsHtml}
              </ul>
            </div>
            
            <div class="prov-column">
              <h4>Application Process</h4>
              <ol class="step-ol">
                ${stepsHtml}
              </ol>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderLicenseContent() {
    const guide = FORM_GUIDES.license;
    const prov = PROVINCIAL_LICENSE_DATA[this.selectedProvince];

    let provOptions = '';
    for (const key in PROVINCIAL_LICENSE_DATA) {
      provOptions += `
        <option value="${key}" ${this.selectedProvince === key ? 'selected' : ''}>
          ${PROVINCIAL_LICENSE_DATA[key].name}
        </option>
      `;
    }

    let methodsHtml = '';
    guide.methods.forEach(method => {
      methodsHtml += `
        <div class="method-card">
          <h4>${method.name}</h4>
          <ol class="step-ol">
            ${method.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      `;
    });

    let reqsHtml = '';
    guide.requirements.forEach(req => {
      reqsHtml += `
        <li class="req-item-bullet">
          <svg class="bullet-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${req.required ? 'var(--primary-color)' : 'var(--text-muted)'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div>
            <span class="req-name">${req.text}</span>
            <span class="req-badge ${req.required ? 'req-required' : 'req-optional'}">${req.required ? 'Required' : 'Optional'}</span>
          </div>
        </li>
      `;
    });

    return `
      <div class="doc-detail-header animate-fade-in">
        <div class="header-main-info">
          <h2>${guide.title}</h2>
          <span class="cost-pill">Cost: ${guide.cost}</span>
        </div>
        <p class="doc-description">${guide.description}</p>
        
        <div class="province-selector-row">
          <label for="license-prov-selector">Choose your Province / Territory:</label>
          <select id="license-prov-selector" class="province-dropdown-select">
            ${provOptions}
          </select>
        </div>
      </div>

      <div class="doc-detail-body animate-fade-in">
        <div class="requirements-section">
          <h3>Documents Checklist</h3>
          <p class="section-subtitle">Make sure you have original copies of the following:</p>
          <ul class="requirements-list">
            ${reqsHtml}
          </ul>

          <div class="province-details-card" style="margin-top: 24px;">
            <div class="prov-card-header">
              <h3>Rules for ${prov.name}</h3>
              <a href="${prov.link}" class="link-anchor prov-link-btn" target="_blank" rel="noopener">
                Official Site
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>
            <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
              <strong>Licensing Authority:</strong> ${prov.authority}<br><br>
              <strong>Guideline Summary:</strong> ${prov.guidelines}
            </div>
          </div>
        </div>

        <div class="instructions-section">
          <h3>Application Steps</h3>
          ${methodsHtml}
        </div>
      </div>
    `;
  }

  attachEventListeners(container) {
    // Navigation items
    container.querySelectorAll('.doc-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const docName = e.currentTarget.getAttribute('data-doc');
        this.selectedDoc = docName;
        
        // Update active class
        container.querySelectorAll('.doc-nav-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Re-render contents panel
        const detailPanel = container.querySelector('#forms-detail-panel');
        if (detailPanel) {
          detailPanel.innerHTML = this.renderDetailContent();
          this.attachDetailEvents(detailPanel);
        }
      });
    });

    // Handle dropdown selection if health tab is immediately active
    const detailPanel = container.querySelector('#forms-detail-panel');
    if (detailPanel) {
      this.attachDetailEvents(detailPanel);
    }
  }

  attachDetailEvents(detailPanel) {
    const provSel = detailPanel.querySelector('#health-prov-selector');
    if (provSel) {
      provSel.addEventListener('change', (e) => {
        this.selectedProvince = e.target.value;
        detailPanel.innerHTML = this.renderDetailContent();
        // Re-bind dropdown listener because it was just replaced in the innerHTML
        this.attachDetailEvents(detailPanel);
      });
    }

    const licenseSel = detailPanel.querySelector('#license-prov-selector');
    if (licenseSel) {
      licenseSel.addEventListener('change', (e) => {
        this.selectedProvince = e.target.value;
        detailPanel.innerHTML = this.renderDetailContent();
        // Re-bind dropdown listener because it was just replaced in the innerHTML
        this.attachDetailEvents(detailPanel);
      });
    }
  }
}
