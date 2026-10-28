// Design A: Premium AI Innovation — Interactive Motion & Telemetry Controller
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Mobile Navigation Toggle
  const mobileBtn = document.querySelector('.mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', !isExpanded);
      mobileDrawer.classList.toggle('active');
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('active');
      });
    });
  }

  // 1b. Navigation Intelligence Dropdowns Controller (Corporate, Engineering, Medical)
  const navDropdowns = document.querySelectorAll('.nav-dropdown');
  navDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    const menu = dropdown.querySelector('.nav-dropdown-menu');

    const toggleDropdown = (open) => {
      const willOpen = open !== undefined ? open : !dropdown.classList.contains('open');
      if (willOpen) {
        // Close other open dropdowns when opening one
        navDropdowns.forEach(other => {
          if (other !== dropdown) {
            other.classList.remove('open');
            const otherTrigger = other.querySelector('.nav-dropdown-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
      }
      dropdown.classList.toggle('open', willOpen);
      if (trigger) {
        trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      }
    };

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
      });
    }

    if (menu) {
      menu.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', () => {
          toggleDropdown(false);
        });
      });
    }

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        toggleDropdown(false);
        if (trigger) trigger.focus();
      }
    });
  });

  // 1c. "Let's Talk" / Start Engineering Conversation Modal Controller
  const talkModal = document.getElementById('lets-talk-modal');
  if (talkModal) {
    const talkForm = document.getElementById('engineering-talk-form');
    const feedbackBox = document.getElementById('talk-feedback-box');
    const submitBtn = document.getElementById('btn-talk-submit');
    const firstInput = document.getElementById('talk-name');
    let previousActiveElement = null;

    const openTalkModal = () => {
      previousActiveElement = document.activeElement;
      talkModal.classList.add('active');
      talkModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 150);
      }
    };

    const closeTalkModal = () => {
      talkModal.classList.remove('active');
      talkModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };

    // Open triggers: Hero button, Inquiries footer link, or [data-open-modal="lets-talk-modal"]
    document.querySelectorAll('[data-open-modal="lets-talk-modal"], a[href="#lets-talk"]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openTalkModal();
      });
    });

    // Close triggers: close button, backdrop click
    talkModal.querySelectorAll('[data-close-modal]').forEach(closer => {
      closer.addEventListener('click', (e) => {
        e.preventDefault();
        closeTalkModal();
      });
    });

    // Keyboard Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && talkModal.classList.contains('active')) {
        closeTalkModal();
      }
    });

    // Form interactive submission & validation
    if (talkForm) {
      talkForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        let hasErrors = false;
        const requiredFields = [
          { id: 'talk-name', errorId: 'name-error' },
          { id: 'talk-email', errorId: 'email-error', isEmail: true },
          { id: 'talk-company', errorId: 'company-error' },
          { id: 'talk-message', errorId: 'message-error' }
        ];

        requiredFields.forEach(({ id, errorId, isEmail }) => {
          const input = document.getElementById(id);
          const group = input ? input.closest('.talk-field-group') : null;
          if (!input || !group) return;

          let valid = input.value.trim().length > 0;
          if (isEmail && valid) {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
          }

          if (!valid) {
            group.classList.add('has-error');
            hasErrors = true;
          } else {
            group.classList.remove('has-error');
          }
        });

        if (hasErrors) {
          if (feedbackBox) {
            feedbackBox.className = 'talk-feedback-box error';
            feedbackBox.textContent = 'Please fill in all required fields.';
          }
          return;
        }

        // Submitting state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Sending inquiry...</span>';
        }
        if (feedbackBox) {
          feedbackBox.className = 'talk-feedback-box';
          feedbackBox.textContent = '';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send message &rarr;</span>';
          }
          if (feedbackBox) {
            feedbackBox.className = 'talk-feedback-box success';
            feedbackBox.textContent = '✓ Thank you! A senior member of our team will get back to you shortly.';
          }
          talkForm.reset();

          setTimeout(() => {
            if (feedbackBox) feedbackBox.textContent = '';
            closeTalkModal();
          }, 3500);
        }, 800);
      });

      // Clear errors on input
      talkForm.querySelectorAll('.talk-input, .talk-textarea').forEach(input => {
        input.addEventListener('input', () => {
          const group = input.closest('.talk-field-group');
          if (group && group.classList.contains('has-error')) {
            group.classList.remove('has-error');
          }
        });
      });
    }

    // Auto-open if page loaded with #lets-talk hash
    if (window.location.hash === '#lets-talk') {
      setTimeout(openTalkModal, 200);
    }
  }

  // 2. Digital Design Agent 3-Stage Segmented Interactive Experience
  const stageTabs = document.querySelectorAll('.stage-tab-btn');
  const activeEyebrow = document.getElementById('active-stage-eyebrow');
  const activeTitle = document.getElementById('active-stage-title');
  const activeChip = document.getElementById('active-stage-chip');
  const activeCopy = document.getElementById('active-stage-copy');
  const canvasTarget = document.getElementById('tier-canvas-target');
  const stageDetailCard = document.getElementById('stage-detail-container');

  const stageData = {
    '1': {
      eyebrow: 'CAPABILITY: EXECUTE',
      title: 'Digital Design Agent',
      chipText: 'Active POC',
      chipClass: 'tier-status-chip',
      copy: 'Executes design activities based on engineering instructions and requirements.',
      svg: `
        <div class="relative w-full h-[400px] md:h-[460px] flex flex-col items-center justify-center overflow-hidden rounded-xl bg-[#080d1a]/80 border border-slate-800/80 shadow-2xl">
          <div class="blueprint-grid-overlay"></div>
          <div class="viewport-ambient-glow cyan"></div>

          <!-- Zone A: Top Header Ribbon (Positioned strictly above the car) -->
          <div class="dda-canvas-header-ribbon absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
            <div class="dda-telemetry-badge inline-flex items-center gap-2 h-7 px-3 rounded-full bg-[#0c1322]/90 border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
              <span>SYS.ENG_CAD // AUTONOMOUS_ASSEMBLY</span>
            </div>
            <div class="dda-telemetry-badge inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#0c1322]/90 border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse"></span>
              <span class="font-bold text-cyan-600 dark:text-cyan-300 active-joints-counter" id="active-joints-counter">0 / 14,820</span>
              <span class="text-slate-400">NODES</span>
            </div>
          </div>

          <!-- Zone B: Middle Animation Stage (100% Unobstructed) -->
          <div class="dda-canvas-middle-stage w-full h-full flex items-center justify-center py-12 px-8 relative z-10">
            <svg viewBox="0 0 520 250" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" class="my-auto max-w-[560px] w-full aspect-[2/1] block relative z-10">
              <defs>
                <linearGradient id="initChassisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.4"/>
                  <stop offset="50%" stop-color="#06B6D4" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.4"/>
                </linearGradient>
                <linearGradient id="initCanopyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.3"/>
                  <stop offset="40%" stop-color="#22D3EE" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.6"/>
                </linearGradient>
                <linearGradient id="initLaserBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#22D3EE" stop-opacity="0"/>
                  <stop offset="15%" stop-color="#22D3EE" stop-opacity="0.95"/>
                  <stop offset="85%" stop-color="#38BDF8" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="#22D3EE" stop-opacity="0"/>
                </linearGradient>
              </defs>

              <!-- Coordinate Grid Crosshairs & Ground Baseline Plane -->
              <line x1="20" y1="180" x2="500" y2="180" stroke="rgba(56, 189, 248, 0.18)" stroke-width="1"/>
              <line x1="45" y1="190" x2="475" y2="190" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1" stroke-dasharray="4 4"/>
              <line x1="145" y1="20" x2="145" y2="235" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="260" y1="20" x2="260" y2="235" stroke="rgba(56, 189, 248, 0.1)" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="365" y1="20" x2="365" y2="235" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1" stroke-dasharray="3 3"/>

              <!-- LAYER 1: Rigid Skateboard Chassis Platform -->
              <g class="assembly-layer-chassis" id="layer-chassis">
                <path d="M 85 160 L 125 156 L 385 156 L 425 160 L 395 174 L 115 174 Z" fill="rgba(6, 182, 212, 0.08)" stroke="url(#initChassisGrad)" stroke-width="1.8"/>
                <line x1="125" y1="165" x2="385" y2="165" stroke="rgba(34, 211, 238, 0.7)" stroke-width="1.6" stroke-dasharray="5 3"/>
                <line x1="165" y1="157" x2="155" y2="173" stroke="rgba(100, 116, 139, 0.6)" stroke-width="1.2"/>
                <line x1="205" y1="157" x2="195" y2="173" stroke="rgba(100, 116, 139, 0.6)" stroke-width="1.2"/>
                <line x1="250" y1="157" x2="240" y2="173" stroke="rgba(100, 116, 139, 0.6)" stroke-width="1.2"/>
                <line x1="295" y1="157" x2="285" y2="173" stroke="rgba(100, 116, 139, 0.6)" stroke-width="1.2"/>
                <line x1="340" y1="157" x2="330" y2="173" stroke="rgba(100, 116, 139, 0.6)" stroke-width="1.2"/>
                <path d="M 85 160 L 118 148 L 138 156" stroke="#06B6D4" stroke-width="1.5" fill="none"/>
                <rect x="74" y="153" width="14" height="12" rx="2" fill="rgba(6, 182, 212, 0.2)" stroke="#38BDF8" stroke-width="1.2"/>
                <path d="M 372 156 L 398 148 L 425 160" stroke="#06B6D4" stroke-width="1.5" fill="none"/>
                <rect x="422" y="154" width="14" height="11" rx="2" fill="rgba(6, 182, 212, 0.2)" stroke="#38BDF8" stroke-width="1.2"/>
                <circle cx="125" cy="165" r="2.5" fill="#38BDF8"/>
                <circle cx="385" cy="165" r="2.5" fill="#38BDF8"/>
              </g>

              <!-- LAYER 2: Dual Powertrain & Drive Units -->
              <g class="assembly-layer-powertrain" id="layer-powertrain">
                <rect x="110" y="150" width="22" height="15" rx="3" fill="rgba(249, 115, 22, 0.25)" stroke="#F97316" stroke-width="1.4"/>
                <line x1="110" y1="157" x2="132" y2="157" stroke="#FB923C" stroke-width="1" stroke-dasharray="2 2"/>
                <line x1="121" y1="157" x2="145" y2="166" stroke="#FB923C" stroke-width="1.5"/>
                <line x1="121" y1="157" x2="180" y2="144" stroke="rgba(251, 146, 60, 0.6)" stroke-width="1.2" stroke-dasharray="3 2"/>
                <rect x="360" y="148" width="26" height="18" rx="3" fill="rgba(249, 115, 22, 0.25)" stroke="#F97316" stroke-width="1.4"/>
                <line x1="364" y1="153" x2="382" y2="153" stroke="#FB923C" stroke-width="1"/>
                <line x1="364" y1="157" x2="382" y2="157" stroke="#FB923C" stroke-width="1"/>
                <line x1="364" y1="161" x2="382" y2="161" stroke="#FB923C" stroke-width="1"/>
                <line x1="373" y1="157" x2="365" y2="166" stroke="#FB923C" stroke-width="1.5"/>
                <line x1="373" y1="157" x2="395" y2="144" stroke="rgba(251, 146, 60, 0.6)" stroke-width="1.2" stroke-dasharray="3 2"/>
                <path d="M 132 157 C 200 162, 300 162, 360 157" stroke="#EA580C" stroke-width="1.4" stroke-dasharray="4 2" fill="none"/>
              </g>

              <!-- LAYER 3: Independent Suspension & Wheel Hubs -->
              <g class="assembly-layer-wheels" id="layer-wheels">
                <ellipse cx="180" cy="144" rx="16" ry="14" stroke="rgba(56, 189, 248, 0.45)" stroke-width="1.3" stroke-dasharray="3 2" fill="rgba(2, 6, 23, 0.5)"/>
                <ellipse cx="395" cy="144" rx="16" ry="14" stroke="rgba(56, 189, 248, 0.45)" stroke-width="1.3" stroke-dasharray="3 2" fill="rgba(2, 6, 23, 0.5)"/>
                <g class="wheel-unit wheel-front-near" transform="translate(145, 166)">
                  <ellipse cx="0" cy="0" rx="21" ry="19" stroke="#38BDF8" stroke-width="1.8" fill="rgba(2, 6, 23, 0.95)"/>
                  <ellipse cx="0" cy="0" rx="14" ry="12" stroke="rgba(56, 189, 248, 0.85)" stroke-width="1.3" fill="none"/>
                  <ellipse cx="0" cy="0" rx="9" ry="8" stroke="rgba(249, 115, 22, 0.75)" stroke-width="1.1" fill="none"/>
                  <rect x="-13" y="-6" width="5" height="10" rx="1.5" fill="#F97316"/>
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(56, 189, 248, 0.6)"/>
                  <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(56, 189, 248, 0.6)"/>
                  <path d="M 0 -10 L -18 -18 M 0 10 L -16 6" stroke="#06B6D4" stroke-width="1.2" fill="none"/>
                </g>
                <g class="wheel-unit wheel-rear-near" transform="translate(365, 166)">
                  <ellipse cx="0" cy="0" rx="21" ry="19" stroke="#38BDF8" stroke-width="1.8" fill="rgba(2, 6, 23, 0.95)"/>
                  <ellipse cx="0" cy="0" rx="14" ry="12" stroke="rgba(56, 189, 248, 0.85)" stroke-width="1.3" fill="none"/>
                  <ellipse cx="0" cy="0" rx="9" ry="8" stroke="rgba(249, 115, 22, 0.75)" stroke-width="1.1" fill="none"/>
                  <rect x="-13" y="-6" width="5" height="10" rx="1.5" fill="#F97316"/>
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(56, 189, 248, 0.6)"/>
                  <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(56, 189, 248, 0.6)"/>
                  <path d="M 0 -10 L 16 -18 M 0 10 L 14 6" stroke="#06B6D4" stroke-width="1.2" fill="none"/>
                </g>
              </g>

              <!-- LAYER 4: Structural Spaceframe / Rollcage -->
              <g class="assembly-layer-spaceframe" id="layer-spaceframe">
                <path d="M 160 144 L 218 84 L 328 82 L 388 136 L 272 144 Z" stroke="rgba(34, 211, 238, 0.35)" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>
                <line x1="165" y1="140" x2="218" y2="84" stroke="#22D3EE" stroke-width="1.8"/>
                <line x1="218" y1="84" x2="328" y2="82" stroke="#22D3EE" stroke-width="1.8"/>
                <line x1="270" y1="144" x2="270" y2="83" stroke="#22D3EE" stroke-width="1.8"/>
                <line x1="328" y1="82" x2="388" y2="136" stroke="#22D3EE" stroke-width="1.8"/>
                <circle cx="218" cy="84" r="2.5" fill="#38BDF8"/>
                <circle cx="270" cy="83" r="2.5" fill="#F97316"/>
                <circle cx="328" cy="82" r="2.5" fill="#38BDF8"/>
              </g>

              <!-- LAYER 5: Aerodynamic Outer Body Panels -->
              <g class="assembly-layer-body" id="layer-body">
                <path d="M 75 142 C 92 126, 134 116, 172 110 L 216 76 C 255 70, 295 70, 332 76 L 396 114 C 418 118, 432 126, 438 134 L 390 142 C 382 130, 350 130, 342 142 L 148 142 C 140 130, 108 130, 100 142 Z" fill="rgba(6, 182, 212, 0.08)" stroke="url(#initCanopyGrad)" stroke-width="2.2"/>
                <polygon points="174,110 216,76 332,76 396,114 270,116" fill="rgba(34, 211, 238, 0.12)" stroke="rgba(56, 189, 248, 0.7)" stroke-width="1.3"/>
              </g>

              <!-- LAYER 6: Aero Diffuser & Front Splitter -->
              <g class="assembly-layer-aero" id="layer-aero">
                <path d="M 60 162 L 60 174 L 115 174" stroke="#38BDF8" stroke-width="1.6" fill="rgba(6, 182, 212, 0.2)"/>
                <path d="M 390 172 L 442 165 L 442 174 L 390 178 Z" stroke="#38BDF8" stroke-width="1.6" fill="rgba(6, 182, 212, 0.2)"/>
              </g>

              <!-- Laser Scanner Sweeping Beam -->
              <line x1="0" y1="15" x2="0" y2="230" stroke="url(#initLaserBeamGrad)" stroke-width="2.5" class="cad-scan-beam"/>
            </svg>
          </div>

          <!-- Zone C: Bottom Footer Ribbon (Positioned strictly below the car) -->
          <div class="dda-canvas-footer-ribbon absolute bottom-4 left-6 right-6 flex items-center justify-center pointer-events-none z-20">
            <div class="dda-telemetry-status-chip inline-flex items-center gap-2 h-7 px-4 rounded-full bg-[#0c1322]/90 border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
              <span>ASSEMBLY VALIDATED // TOLERANCE: ±0.02mm</span>
            </div>
          </div>
        </div>
      `
    },
    '2': {
      eyebrow: 'CAPABILITY: AUGMENT',
      title: 'Engineering Knowledge Layer',
      chipText: 'In Development',
      chipClass: 'tier-status-chip neutral',
      copy: 'Progressively incorporates engineering standards, methodologies, simulation knowledge, modelling principles, validation rules and governance.',
      svg: `
        <div class="relative w-full h-[400px] md:h-[460px] flex flex-col items-center justify-center overflow-hidden rounded-xl bg-[#080d1a]/80 border border-slate-800/80 shadow-2xl">
          <div class="blueprint-grid-overlay"></div>
          <div class="viewport-ambient-glow emerald"></div>

          <!-- Zone A: Top Header Ribbon (Positioned strictly above the car) -->
          <div class="dda-canvas-header-ribbon absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
            <div class="dda-telemetry-badge inline-flex items-center gap-2 h-7 px-3 rounded-full bg-[#0c1322]/90 border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
              <span>SYS.FEA_AUGMENT // KNOWLEDGE_AUDIT</span>
            </div>
            <div class="dda-telemetry-badge inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#0c1322]/90 border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse"></span>
              <span>OPTICAL SCAN // CONTINUOUS</span>
            </div>
          </div>

          <!-- Zone B: Middle Animation Stage (100% Unobstructed) -->
          <div class="dda-canvas-middle-stage w-full h-full flex items-center justify-center py-12 px-8 relative z-10">
            <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" class="my-auto max-w-[560px] w-full aspect-[2/1] block relative z-10">
              <defs>
                <linearGradient id="auditLaserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#22D3EE" stop-opacity="0"/>
                  <stop offset="25%" stop-color="#22D3EE" stop-opacity="0.95"/>
                  <stop offset="50%" stop-color="#34D399" stop-opacity="1"/>
                  <stop offset="75%" stop-color="#10B981" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="chassisWireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.6"/>
                  <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.6"/>
                </linearGradient>
              </defs>

              <!-- Blueprint Baseline Coordinate Grid -->
              <line x1="40" y1="220" x2="560" y2="220" stroke="rgba(56, 189, 248, 0.15)" stroke-width="1"/>
              <line x1="80" y1="235" x2="520" y2="235" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1" stroke-dasharray="4 4"/>
              <line x1="170" y1="40" x2="170" y2="260" stroke="rgba(56, 189, 248, 0.06)" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="300" y1="40" x2="300" y2="260" stroke="rgba(56, 189, 248, 0.08)" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="440" y1="40" x2="440" y2="260" stroke="rgba(56, 189, 248, 0.06)" stroke-width="1" stroke-dasharray="3 3"/>

              <!-- High-Precision Cyan Car Wireframe Model -->
              <g id="wireframe-car-model">
                <!-- Skateboard Chassis Platform & Floor Pan -->
                <path d="M 100 215 L 145 208 L 465 208 L 505 215 L 475 228 L 130 228 Z" fill="rgba(6, 182, 212, 0.05)" stroke="url(#chassisWireGrad)" stroke-width="1.4"/>
                <line x1="145" y1="218" x2="465" y2="218" stroke="rgba(34, 211, 238, 0.6)" stroke-width="1.3" stroke-dasharray="4 2"/>
                <!-- Battery Module Transverse Ribs -->
                <line x1="200" y1="210" x2="190" y2="226" stroke="rgba(100, 116, 139, 0.45)" stroke-width="1"/>
                <line x1="250" y1="210" x2="240" y2="226" stroke="rgba(100, 116, 139, 0.45)" stroke-width="1"/>
                <line x1="300" y1="210" x2="290" y2="226" stroke="rgba(100, 116, 139, 0.45)" stroke-width="1"/>
                <line x1="350" y1="210" x2="340" y2="226" stroke="rgba(100, 116, 139, 0.45)" stroke-width="1"/>
                <line x1="400" y1="210" x2="390" y2="226" stroke="rgba(100, 116, 139, 0.45)" stroke-width="1"/>

                <!-- Front & Rear Subframes -->
                <path d="M 100 215 L 130 195 L 155 208" stroke="#06B6D4" stroke-width="1.3" fill="none"/>
                <path d="M 450 208 L 475 195 L 505 215" stroke="#06B6D4" stroke-width="1.3" fill="none"/>

                <!-- Far Wheels (Isometric Depth) -->
                <ellipse cx="205" cy="195" rx="18" ry="16" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2" stroke-dasharray="3 2" fill="rgba(3, 7, 18, 0.5)"/>
                <ellipse cx="465" cy="195" rx="18" ry="16" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2" stroke-dasharray="3 2" fill="rgba(3, 7, 18, 0.5)"/>

                <!-- Near Wheels (Front & Rear) -->
                <g transform="translate(170, 220)">
                  <ellipse cx="0" cy="0" rx="24" ry="21" stroke="#38BDF8" stroke-width="1.6" fill="rgba(3, 7, 18, 0.95)"/>
                  <ellipse cx="0" cy="0" rx="16" ry="14" stroke="rgba(56, 189, 248, 0.75)" stroke-width="1.2" fill="none"/>
                  <ellipse cx="0" cy="0" rx="10" ry="9" stroke="rgba(6, 182, 212, 0.6)" stroke-width="1" fill="none"/>
                  <line x1="-14" y1="0" x2="14" y2="0" stroke="rgba(56, 189, 248, 0.5)"/>
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(56, 189, 248, 0.5)"/>
                  <path d="M 0 -10 L -20 -18 M 0 10 L -18 6" stroke="#06B6D4" stroke-width="1.2" fill="none"/>
                </g>
                <g transform="translate(440, 220)">
                  <ellipse cx="0" cy="0" rx="24" ry="21" stroke="#38BDF8" stroke-width="1.6" fill="rgba(3, 7, 18, 0.95)"/>
                  <ellipse cx="0" cy="0" rx="16" ry="14" stroke="rgba(56, 189, 248, 0.75)" stroke-width="1.2" fill="none"/>
                  <ellipse cx="0" cy="0" rx="10" ry="9" stroke="rgba(6, 182, 212, 0.6)" stroke-width="1" fill="none"/>
                  <line x1="-14" y1="0" x2="14" y2="0" stroke="rgba(56, 189, 248, 0.5)"/>
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(56, 189, 248, 0.5)"/>
                  <path d="M 0 -10 L 20 -18 M 0 10 L 18 6" stroke="#06B6D4" stroke-width="1.2" fill="none"/>
                </g>

                <!-- Spaceframe Monocoque & Pillars -->
                <path d="M 185 195 L 265 105 L 375 105 L 455 160 L 320 208 Z" stroke="rgba(34, 211, 238, 0.3)" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>
                <!-- A-Pillar -->
                <line x1="210" y1="155" x2="265" y2="105" stroke="#22D3EE" stroke-width="1.6"/>
                <!-- Roof Rail -->
                <line x1="265" y1="105" x2="375" y2="105" stroke="#22D3EE" stroke-width="1.6"/>
                <!-- B-Pillar Safety Hoop -->
                <line x1="320" y1="105" x2="320" y2="208" stroke="#22D3EE" stroke-width="1.6"/>
                <!-- C-Pillar -->
                <line x1="375" y1="105" x2="455" y2="160" stroke="#22D3EE" stroke-width="1.6"/>
                <!-- Transverse Rollcage Cross-Bracing -->
                <line x1="265" y1="105" x2="320" y2="155" stroke="rgba(34, 211, 238, 0.45)" stroke-width="1.2" stroke-dasharray="3 2"/>
                <line x1="320" y1="155" x2="375" y2="105" stroke="rgba(34, 211, 238, 0.45)" stroke-width="1.2" stroke-dasharray="3 2"/>

                <!-- Aerodynamic Body Shell Outline & Canopy -->
                <path d="M 85 200 C 105 178, 155 168, 205 160 L 260 102 C 300 96, 345 96, 385 102 L 460 150 C 485 156, 505 168, 515 180 L 465 200 C 455 182, 420 182, 410 200 L 195 200 C 185 182, 150 182, 140 200 Z" fill="rgba(6, 182, 212, 0.05)" stroke="rgba(56, 189, 248, 0.85)" stroke-width="1.5"/>
                <polygon points="208,160 260,102 385,102 460,150 320,155" fill="rgba(34, 211, 238, 0.08)" stroke="rgba(56, 189, 248, 0.5)" stroke-width="1"/>
              </g>

              <!-- Complete Contour Compliance Confirmation Pulse (Halo glow on scan completion) -->
              <path d="M 85 200 C 105 178, 155 168, 205 160 L 260 102 C 300 96, 345 96, 385 102 L 460 150 C 485 156, 505 168, 515 180 L 465 200 C 455 182, 420 182, 410 200 L 195 200 C 185 182, 150 182, 140 200 Z" fill="none" stroke="#34D399" stroke-width="2.5" class="audit-contour-pass"/>

              <!-- 6 Active Rule Nodes (Pulsing and expanding rings triggered as laser passes) -->
              <g id="audit-datum-nodes">
                <!-- Node 1: Front Chassis Rail (x: 125) -->
                <g transform="translate(125, 205)">
                  <circle cx="0" cy="0" r="3" fill="#34D399" class="audit-node-dot audit-delay-node1"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#10B981" class="audit-node-ring audit-delay-node1"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#22D3EE" class="audit-node-ring audit-delay-node1" style="animation-delay: 0.65s !important;"/>
                </g>
                <!-- Node 2: Front Suspension Mount (x: 170) -->
                <g transform="translate(170, 205)">
                  <circle cx="0" cy="0" r="3.5" fill="#34D399" class="audit-node-dot audit-delay-node2"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#10B981" class="audit-node-ring audit-delay-node2"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#22D3EE" class="audit-node-ring audit-delay-node2" style="animation-delay: 1.05s !important;"/>
                </g>
                <!-- Node 3: A-Pillar Structural Joint (x: 265) -->
                <g transform="translate(265, 105)">
                  <circle cx="0" cy="0" r="3" fill="#34D399" class="audit-node-dot audit-delay-node3"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#10B981" class="audit-node-ring audit-delay-node3"/>
                </g>
                <!-- Node 4: B-Pillar Safety Hoop (x: 320) -->
                <g transform="translate(320, 105)">
                  <circle cx="0" cy="0" r="3.5" fill="#34D399" class="audit-node-dot audit-delay-node4"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#10B981" class="audit-node-ring audit-delay-node4"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#22D3EE" class="audit-node-ring audit-delay-node4" style="animation-delay: 2.25s !important;"/>
                </g>
                <!-- Node 5: Rear Suspension Mount (x: 440) -->
                <g transform="translate(440, 205)">
                  <circle cx="0" cy="0" r="3.5" fill="#34D399" class="audit-node-dot audit-delay-node5"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#10B981" class="audit-node-ring audit-delay-node5"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#22D3EE" class="audit-node-ring audit-delay-node5" style="animation-delay: 2.95s !important;"/>
                </g>
                <!-- Node 6: C-Pillar Decklid Joint (x: 455) -->
                <g transform="translate(455, 160)">
                  <circle cx="0" cy="0" r="3" fill="#34D399" class="audit-node-dot audit-delay-node6"/>
                  <circle cx="0" cy="0" r="4" fill="none" stroke="#10B981" class="audit-node-ring audit-delay-node6"/>
                </g>
              </g>

              <!-- Holographic Scanner Wave (Sweeps front to rear in 4s cycle) -->
              <line x1="0" y1="40" x2="0" y2="250" stroke="url(#auditLaserGrad)" stroke-width="2.5" class="rule-scan-wave"/>
            </svg>
          </div>

          <!-- Zone C: Bottom Footer Ribbon (Positioned strictly below the car) -->
          <div class="dda-canvas-footer-ribbon absolute bottom-4 left-6 right-6 flex items-center justify-center pointer-events-none z-20">
            <div class="dda-telemetry-status-chip inline-flex items-center gap-2 h-7 px-4 rounded-full bg-[#0c1322]/90 border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
              <span>KNOWLEDGE_LAYER // REAL-TIME STANDARDS &amp; VALIDATION SYNC</span>
            </div>
          </div>
        </div>
      `
    },
    '3': {
      eyebrow: 'CAPABILITY: DESIGN',
      title: 'Autonomous Engineering',
      chipText: 'Strategic North Star',
      chipClass: 'tier-status-chip cyan-chip',
      copy: 'Understands an engineering problem, develops and proposes a solution, then creates the design after approval.',
      svg: `
        <div class="relative w-full h-[400px] md:h-[460px] flex flex-col items-center justify-center overflow-hidden rounded-xl bg-[#080d1a]/80 border border-slate-800/80 shadow-2xl">
          <div class="blueprint-grid-overlay"></div>
          <div class="viewport-ambient-glow indigo"></div>

          <!-- Zone A: Top Header Ribbon (Positioned strictly above the car) -->
          <div class="dda-canvas-header-ribbon absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
            <div class="dda-telemetry-badge inline-flex items-center gap-2 h-7 px-3 rounded-full bg-[#0c1322]/90 border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
              <span>SYS.GEN_SYNTHESIS // AUTONOMOUS_TOPOLOGY</span>
            </div>
            <div class="dda-telemetry-badge inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#0c1322]/90 border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse"></span>
              <span>STATUS // ACTIVE</span>
            </div>
          </div>

          <!-- Zone B: Middle Animation Stage (100% Unobstructed) -->
          <div class="dda-canvas-middle-stage w-full h-full flex items-center justify-center py-12 px-8 relative z-10">
            <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" class="my-auto max-w-[560px] w-full aspect-[2/1] block relative z-10">
              <defs>
                <linearGradient id="genLatticeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.95"/>
                  <stop offset="50%" stop-color="#10B981" stop-opacity="1"/>
                  <stop offset="100%" stop-color="#34D399" stop-opacity="0.95"/>
                </linearGradient>
              </defs>

              <!-- Coordinate Baseline Grid -->
              <line x1="40" y1="220" x2="560" y2="220" stroke="rgba(16, 185, 129, 0.15)" stroke-width="1"/>
              <line x1="80" y1="235" x2="520" y2="235" stroke="rgba(16, 185, 129, 0.08)" stroke-width="1" stroke-dasharray="4 4"/>
              <line x1="170" y1="40" x2="170" y2="260" stroke="rgba(16, 185, 129, 0.06)" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="300" y1="40" x2="300" y2="260" stroke="rgba(16, 185, 129, 0.08)" stroke-width="1" stroke-dasharray="3 3"/>
              <line x1="440" y1="40" x2="440" y2="260" stroke="rgba(16, 185, 129, 0.06)" stroke-width="1" stroke-dasharray="3 3"/>

              <!-- Phase 1: Faint Constraint Bounding Envelope & Hardpoint Beacons -->
              <rect x="80" y="92" width="440" height="142" rx="8" fill="rgba(6, 182, 212, 0.02)" stroke="rgba(6, 182, 212, 0.55)" stroke-width="1.2" stroke-dasharray="6 4" class="gen-envelope-box"/>
              <g class="gen-datum-beacon">
                <circle cx="170" cy="220" r="5" fill="#06B6D4"/>
                <circle cx="440" cy="220" r="5" fill="#06B6D4"/>
                <circle cx="265" cy="105" r="4" fill="#22D3EE"/>
                <circle cx="375" cy="105" r="4" fill="#22D3EE"/>
                <circle cx="320" cy="208" r="4" fill="#06B6D4"/>
              </g>

              <!-- Wheels Base Structure -->
              <g id="gen-wheels-baseline">
                <g transform="translate(170, 220)">
                  <ellipse cx="0" cy="0" rx="24" ry="21" stroke="#34D399" stroke-width="1.5" fill="rgba(3, 7, 18, 0.95)"/>
                  <ellipse cx="0" cy="0" rx="16" ry="14" stroke="rgba(52, 211, 153, 0.6)" stroke-width="1.2" fill="none"/>
                </g>
                <g transform="translate(440, 220)">
                  <ellipse cx="0" cy="0" rx="24" ry="21" stroke="#34D399" stroke-width="1.5" fill="rgba(3, 7, 18, 0.95)"/>
                  <ellipse cx="0" cy="0" rx="16" ry="14" stroke="rgba(52, 211, 153, 0.6)" stroke-width="1.2" fill="none"/>
                </g>
              </g>

              <!-- Phase 2: Generative Topology Lattice Growth (Multi-layer organic trusses) -->
              <g id="gen-lattice-growth-group">
                <path d="M 100 215 L 135 208 L 170 220 L 205 208 L 240 220 L 275 208 L 310 220 L 345 208 L 380 220 L 415 208 L 440 220 L 475 208 L 505 215" class="gen-topology-lattice" stroke="url(#genLatticeGrad)" stroke-width="1.6" fill="none"/>
                <path d="M 135 208 L 170 215 L 205 208 L 240 215 L 275 208 L 310 215 L 345 208 L 380 215 L 415 208 L 440 215 L 475 208" class="gen-topology-lattice" stroke="url(#genLatticeGrad)" stroke-width="1.3" fill="none" style="animation-delay: 0.25s;"/>
                
                <path d="M 210 155 L 265 105 L 320 155 L 265 105 L 320 105 L 375 105 L 320 155 L 375 105 L 455 160 L 375 155 L 440 220" class="gen-topology-lattice" stroke="url(#genLatticeGrad)" stroke-width="1.6" fill="none" style="animation-delay: 0.5s;"/>
                <path d="M 265 105 L 320 125 L 375 105 M 210 155 L 245 175 L 320 155 L 395 175 L 455 160" class="gen-topology-lattice" stroke="url(#genLatticeGrad)" stroke-width="1.3" fill="none" style="animation-delay: 0.75s;"/>
                <path d="M 170 220 L 210 185 L 245 175 M 440 220 L 415 185 L 395 175" class="gen-topology-lattice" stroke="url(#genLatticeGrad)" stroke-width="1.4" fill="none" style="animation-delay: 1.0s;"/>

                <path d="M 210 155 L 260 128 L 320 135 L 380 128 L 455 160" class="gen-topology-lattice" stroke="url(#genLatticeGrad)" stroke-width="1.2" fill="none" style="animation-delay: 1.2s;"/>
              </g>

              <!-- Phase 3: Surface Crystallization (Production Aerodynamic Skin Sweeping In) -->
              <g id="gen-surface-skin-group">
                <path d="M 85 200 C 105 178, 155 168, 205 160 L 260 102 C 300 96, 345 96, 385 102 L 460 150 C 485 156, 505 168, 515 180 L 465 200 C 455 182, 420 182, 410 200 L 195 200 C 185 182, 150 182, 140 200 Z" class="gen-surface-skin" fill="rgba(6, 182, 212, 0.12)" stroke="#38BDF8" stroke-width="1.8"/>
                <polygon points="208,160 260,102 385,102 460,150 320,155" class="gen-surface-skin" fill="rgba(34, 211, 238, 0.18)" stroke="#22D3EE" stroke-width="1.4"/>
                <path d="M 75 215 L 135 220 L 135 225 L 75 220 Z" class="gen-surface-skin" fill="#06B6D4"/>
                <path d="M 465 200 L 515 180 L 510 205 L 475 218 Z" class="gen-surface-skin" fill="rgba(6, 182, 212, 0.25)" stroke="#38BDF8" stroke-width="1.2"/>
              </g>
            </svg>
          </div>

          <!-- Zone C: Bottom Footer Ribbon (Positioned strictly below the car) -->
          <div class="dda-canvas-footer-ribbon absolute bottom-4 left-6 right-6 flex items-center justify-center pointer-events-none z-20">
            <div class="dda-telemetry-status-chip inline-flex items-center gap-2 h-7 px-4 rounded-full bg-[#0c1322]/90 border border-slate-700/60 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur-md whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
              <span>AUTONOMOUS_CORE // PRODUCTION GEOMETRY SYNTHESIZED</span>
            </div>
          </div>
        </div>
      `
    }
  };

  function activateStage(tier, isUserAction = false) {
    stageTabs.forEach(tab => {
      const isMatch = tab.getAttribute('data-tier') === tier;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    const data = stageData[tier];
    if (data && activeTitle) {
      // Tactile lift micro-animation on stage detail card
      if (stageDetailCard && isUserAction && !prefersReducedMotion) {
        stageDetailCard.classList.add('is-lifted');
        setTimeout(() => stageDetailCard.classList.remove('is-lifted'), 360);
      }

      if (canvasTarget && !prefersReducedMotion) {
        canvasTarget.classList.add('is-switching');
        setTimeout(() => {
          activeEyebrow.textContent = data.eyebrow;
          activeTitle.textContent = data.title;
          activeChip.textContent = data.chipText;
          activeChip.className = data.chipClass;
          activeCopy.textContent = data.copy;
          canvasTarget.innerHTML = data.svg;
          canvasTarget.classList.remove('is-switching');
        }, 140);
      } else {
        activeEyebrow.textContent = data.eyebrow;
        activeTitle.textContent = data.title;
        activeChip.textContent = data.chipText;
        activeChip.className = data.chipClass;
        activeCopy.textContent = data.copy;
        canvasTarget.innerHTML = data.svg;
      }

      // Smoothly lift/re-center active section content upward if pushed or scrolled out of optimal viewport
      if (isUserAction) {
        const ddaSection = document.getElementById('digital-design-agent');
        if (ddaSection) {
          const rect = ddaSection.getBoundingClientRect();
          const targetOffset = window.innerWidth >= 768 ? 88 : 80;
          // If section top is pushed too far down or scrolled partially out of view
          if (rect.top > targetOffset + 40 || rect.top < 40) {
            ddaSection.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start'
            });
          }
        }
      }
    }
  }

  stageTabs.forEach((tab, index) => {
    const tier = tab.getAttribute('data-tier');
    tab.addEventListener('click', () => activateStage(tier, true));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = stageTabs[(index + 1) % stageTabs.length];
        next.focus();
        activateStage(next.getAttribute('data-tier'), true);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = stageTabs[(index - 1 + stageTabs.length) % stageTabs.length];
        prev.focus();
        activateStage(prev.getAttribute('data-tier'), true);
      }
    });
  });

  // 2b. High-Precision Digital Design Agent Telemetry Ticker (Stage 1 Assembly Counter)
  function initDdaTelemetryTicker() {
    const CAD_CYCLE_MS = 8000;
    const TOTAL_JOINTS = 14820;
    const startTime = performance.now();

    function updateTicker() {
      const now = performance.now();
      const cadCounterEl = document.getElementById('active-joints-counter') || document.querySelector('.active-joints-counter');
      if (cadCounterEl) {
        const elapsed = (now - startTime) % CAD_CYCLE_MS;
        const progress = elapsed / CAD_CYCLE_MS;

        let currentCount = 0;
        if (progress < 0.1875) {
          const sub = progress / 0.1875;
          currentCount = Math.floor(sub * 2400);
        } else if (progress < 0.375) {
          const sub = (progress - 0.1875) / 0.1875;
          currentCount = 2400 + Math.floor(sub * 4800);
        } else if (progress < 0.5625) {
          const sub = (progress - 0.375) / 0.1875;
          currentCount = 7200 + Math.floor(sub * 4200);
        } else if (progress < 0.75) {
          const sub = (progress - 0.5625) / 0.1875;
          currentCount = 11400 + Math.floor(sub * (TOTAL_JOINTS - 11400));
        } else if (progress < 0.9375) {
          currentCount = TOTAL_JOINTS;
        } else {
          const sub = (progress - 0.9375) / 0.0625;
          currentCount = Math.floor(TOTAL_JOINTS * (1 - sub));
        }

        if (progress >= 0.75 && progress < 0.9375) {
          cadCounterEl.textContent = '14,820 / 14,820';
          cadCounterEl.className = 'font-bold text-emerald-600 dark:text-emerald-400 active-joints-counter';
        } else {
          cadCounterEl.textContent = `${currentCount.toLocaleString()} / 14,820`;
          cadCounterEl.className = 'font-bold text-cyan-600 dark:text-cyan-300 active-joints-counter';
        }
      }

      requestAnimationFrame(updateTicker);
    }

    requestAnimationFrame(updateTicker);
  }

  // Initialize Digital Design Agent Telemetry Ticker
  initDdaTelemetryTicker();

  // 2.5. HR Central Interactive Expandable Bento Accordions
  const accordionGroups = document.querySelectorAll('.hr-accordion-group');
  accordionGroups.forEach(group => {
    const items = Array.from(group.querySelectorAll('.hr-accordion-item'));
    const triggers = items.map(item => item.querySelector('.hr-accordion-trigger')).filter(Boolean);

    items.forEach((item, idx) => {
      const trigger = item.querySelector('.hr-accordion-trigger');
      if (!trigger) return;

      const toggleItem = () => {
        const isCurrentlyActive = item.classList.contains('active');

        // Close other items in the same column to maintain balanced vertical symmetry
        items.forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const siblingBtn = sibling.querySelector('.hr-accordion-trigger');
            if (siblingBtn) siblingBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isCurrentlyActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      };

      // Tap / touch / click anywhere on the item card (ignoring clicks inside the content body)
      item.addEventListener('click', (e) => {
        if (e.target.closest('.hr-accordion-body')) {
          return;
        }
        toggleItem();
      });

      // Keyboard accessibility navigation (ArrowUp, ArrowDown, Home, End)
      trigger.addEventListener('keydown', (e) => {
        let targetIndex = -1;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          targetIndex = (idx + 1) % triggers.length;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          targetIndex = (idx - 1 + triggers.length) % triggers.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIndex = triggers.length - 1;
        }

        if (targetIndex >= 0 && triggers[targetIndex]) {
          triggers[targetIndex].focus();
        }
      });
    });
  });

  // 3. Dynamic ScrollSpy with URL hash syncing & smooth scrolling
  const navLinks = document.querySelectorAll('.nav-desktop .nav-dropdown-item');
  const sectionsToObserve = [
    document.getElementById('hero'),
    document.getElementById('digital-design-agent'),
    document.getElementById('hr-central'),
    document.getElementById('operating-architecture')
  ].filter(Boolean);

  let currentActiveId = '';

  const updateActiveNavLink = (activeId) => {
    if (activeId === currentActiveId) return;
    currentActiveId = activeId;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update URL hash cleanly without history clutter or hash sticking
    if (activeId && activeId !== 'hero') {
      if (window.location.hash !== `#${activeId}`) {
        history.replaceState(null, '', `#${activeId}`);
      }
    } else if (activeId === 'hero') {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
  };

  if ('IntersectionObserver' in window && sectionsToObserve.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateActiveNavLink(entry.target.id);
        }
      });
    }, observerOptions);

    sectionsToObserve.forEach(section => sectionObserver.observe(section));
  }

  // Smooth scrolling with URL hash history support & sticky header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const sectionId = targetId.replace('#', '');
        updateActiveNavLink(sectionId);
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Handle initial page load with anchor hash
  if (window.location.hash) {
    const initialTarget = document.querySelector(window.location.hash);
    if (initialTarget) {
      setTimeout(() => {
        initialTarget.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }

  // =============================================================
  // Design B: Exclusively Light Theme (No dark/light switching)
  // =============================================================
  document.body.classList.remove('dark-mode');
  document.documentElement.classList.remove('dark');
  try { localStorage.removeItem('design-b-theme'); } catch(e) {}

  // =============================================================
  // Design B: 3D Connected Intelligence Canvas Background
  // =============================================================
  (() => {
    const canvas = document.getElementById('background');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, t = 0, mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const colors = ['#32c3df', '#f45b0b', '#35c99a', '#f5b83d'];
    const nodes = Array.from({length: 76}, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - .5) * .00016,
      vy: (Math.random() - .5) * .00016,
      r: .8 + Math.random() * 1.8,
      c: i % 13 === 0 ? 1 : i % 9 === 0 ? 2 : 0,
      phase: Math.random() * Math.PI * 2
    }));

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      t += .007;
      ctx.clearRect(0, 0, w, h);
      mouseX += (targetX - mouseX) * .025;
      mouseY += (targetY - mouseY) * .025;
      const isDark = document.body.classList.contains('dark-mode');

      // Nodes cluster mainly on the right, leaving a quiet area for website copy on the left.
      const pts = nodes.map((n, i) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < .02 || n.x > .98) n.vx *= -1;
        if (n.y < .03 || n.y > .97) n.vy *= -1;
        const clusterX = .60 + n.x * .34;
        const clusterY = .12 + n.y * .76;
        const x = (clusterX * w) + (mouseX * 18) + (Math.sin(t + n.phase) * 5);
        const y = (clusterY * h) + (mouseY * 12) + (Math.cos(t * .8 + n.phase) * 5);
        return {x, y, n, i};
      });

      // Draw only nearby connections; thin and low-contrast to preserve readability.
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 105) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(50,195,223,${(1 - d / 105) * (isDark ? 0.35 : 0.22)})`;
            ctx.lineWidth = .8;
            ctx.stroke();
          }
        }
      }

      // Faint flowing signal paths across the center-right region.
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        for (let s = 0; s <= 60; s++) {
          const x = w * (.43 + s / 60 * .57);
          const y = h * (.25 + k * .24) + Math.sin(s * .11 + t * 1.4 + k) * 13 + Math.sin(s * .045 - t + k) * 9;
          if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = k === 0 
          ? (isDark ? 'rgba(50,195,223,.22)' : 'rgba(50,195,223,.12)') 
          : k === 1 
            ? (isDark ? 'rgba(244,91,11,.16)' : 'rgba(244,91,11,.08)') 
            : (isDark ? 'rgba(53,201,154,.18)' : 'rgba(53,201,154,.10)');
        ctx.lineWidth = 1;
        ctx.stroke();

        const p = (t * .075 + k * .31) % 1;
        const x = w * (.43 + p * .57);
        const y = h * (.25 + k * .24) + Math.sin(p * 60 * .11 + t * 1.4 + k) * 13 + Math.sin(p * 60 * .045 - t + k) * 9;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = colors[k];
        ctx.globalAlpha = .65;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Soft, pulsing central glow on the right.
      const cx = w * .73 + mouseX * 10, cy = h * .51 + mouseY * 8;
      const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 145);
      glow.addColorStop(0, isDark ? 'rgba(50,195,223,.16)' : 'rgba(50,195,223,.10)');
      glow.addColorStop(.48, isDark ? 'rgba(50,195,223,.055)' : 'rgba(50,195,223,.035)');
      glow.addColorStop(1, 'rgba(50,195,223,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - 145, cy - 145, 290, 290);

      // Glowing Nodes
      pts.forEach(({x, y, n}) => {
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = colors[n.c];
        ctx.globalAlpha = .25 + .25 * (.5 + .5 * Math.sin(t * 2 + n.phase));
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(draw);
      }
    }

    window.addEventListener('pointermove', e => {
      targetX = (e.clientX / (w || 1) - .5);
      targetY = (e.clientY / (h || 1) - .5);
    }, {passive: true});

    window.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
  })();

  // Smooth Scroll Reveal Controller (Triggered whenever user scrolls into view)
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (!revealElements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          // Reset cleanly when scrolled out of view so whenever the user scrolls back, it animates again
          entry.target.classList.remove('revealed');
        }
      });
    }, {
      root: null,
      rootMargin: '-30px 0px -30px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  };

  initScrollReveal();
});
