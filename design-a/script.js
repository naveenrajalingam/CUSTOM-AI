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
  const cadModeEl = document.getElementById('active-cad-mode');
  const cadStatusEl = document.getElementById('active-cad-status');

  const stageData = {
    '1': {
      eyebrow: 'CAPABILITY: EXECUTE',
      title: 'Digital Design Agent',
      chipText: 'Active POC',
      chipClass: 'tier-status-chip',
      copy: 'Executes design activities based on engineering instructions and requirements.',
      cadMode: 'SYS.ENG_CAD // AUTONOMOUS_ASSEMBLY',
      cadStatus: 'ASSEMBLY VALIDATED // TOLERANCE: ±0.02mm'
    },
    '2': {
      eyebrow: 'CAPABILITY: AUGMENT',
      title: 'Engineering Knowledge Layer',
      chipText: 'In Development',
      chipClass: 'tier-status-chip neutral',
      copy: 'Progressively incorporates engineering standards, methodologies, simulation knowledge, modelling principles, validation rules and governance.',
      cadMode: 'SYS.ENG_CAD // KNOWLEDGE_LAYER',
      cadStatus: 'STANDARDS VERIFIED // METHODOLOGY SYNC'
    },
    '3': {
      eyebrow: 'CAPABILITY: DESIGN',
      title: 'Autonomous Engineering',
      chipText: 'Strategic North Star',
      chipClass: 'tier-status-chip cyan-chip',
      copy: 'Understands an engineering problem, develops and proposes a solution, then creates the design after approval.',
      cadMode: 'SYS.ENG_CAD // AUTONOMOUS_ENGINEERING',
      cadStatus: 'AUTONOMOUS DESIGN // SOLUTION PROPOSED'
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

      // Smooth text update - graphic stays permanently active across all three stages
      if (activeEyebrow) activeEyebrow.textContent = data.eyebrow;
      if (activeTitle) activeTitle.textContent = data.title;
      if (activeChip) {
        activeChip.textContent = data.chipText;
        activeChip.className = data.chipClass;
      }
      if (activeCopy) activeCopy.textContent = data.copy;
      if (cadModeEl && data.cadMode) cadModeEl.textContent = data.cadMode;
      if (cadStatusEl && data.cadStatus) cadStatusEl.textContent = data.cadStatus;

      // Smoothly lift/re-center active section content upward if pushed or scrolled out of optimal viewport
      if (isUserAction) {
        const ddaSection = document.getElementById('digital-design-agent');
        if (ddaSection) {
          const rect = ddaSection.getBoundingClientRect();
          const targetOffset = window.innerWidth >= 768 ? 88 : 80;
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

  // 2b. Exploded-View Assembly Animation Engine (50-Part Autonomous Cycle)
  function initExplodedAssemblyEngine() {
    const CYCLE_MS = 12000; // Full cycle: explode + hold + reassemble + hold
    const TOTAL_NODES = 14820;
    const parts = document.querySelectorAll('.explode-part');
    const guideLines = document.getElementById('assembly-guide-lines');
    const counterEl = document.getElementById('active-joints-counter') || document.querySelector('.active-joints-counter');
    const statusEl = document.getElementById('active-cad-status');
    const statusDot = document.getElementById('active-cad-status-dot');
    
    if (!parts.length) return;

    // Precompute part explosion data
    const partData = Array.from(parts).map(p => ({
      el: p,
      ex: parseFloat(p.dataset.ex) || 0,
      ey: parseFloat(p.dataset.ey) || 0,
      delay: parseFloat(p.dataset.delay) || 0,
      glowApplied: false
    }));

    const totalParts = partData.length;
    const startTime = performance.now();

    // Easing: smooth cubic
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Staggered easing with per-part delay
    function staggeredEase(globalT, partDelay) {
      const adjustedT = Math.max(0, Math.min(1, (globalT - partDelay * 0.3) / (1 - partDelay * 0.3)));
      return easeInOutCubic(adjustedT);
    }

    function updateAssembly() {
      const now = performance.now();
      const elapsed = (now - startTime) % CYCLE_MS;
      const phase = elapsed / CYCLE_MS;

      /*
       * Timeline (12s cycle):
       *  0.00 - 0.08: Assembled hold (complete car visible)
       *  0.08 - 0.42: Explosion (parts drift outward with staggered delays)
       *  0.42 - 0.52: Exploded hold (fully expanded)
       *  0.52 - 0.88: Reassembly (parts snap back with staggered delays)
       *  0.88 - 1.00: Assembled hold + validation flash
       */

      let explodeAmount = 0;  // 0 = assembled, 1 = fully exploded
      let isExploding = false;
      let isReassembling = false;
      let nodeCount = TOTAL_NODES;

      if (phase < 0.08) {
        // Assembled hold
        explodeAmount = 0;
        nodeCount = TOTAL_NODES;
      } else if (phase < 0.42) {
        // Explosion phase
        isExploding = true;
        const t = (phase - 0.08) / 0.34;
        explodeAmount = easeInOutCubic(t);
        nodeCount = Math.floor(TOTAL_NODES * (1 - explodeAmount));
      } else if (phase < 0.52) {
        // Exploded hold
        explodeAmount = 1;
        nodeCount = 0;
      } else if (phase < 0.88) {
        // Reassembly phase
        isReassembling = true;
        const t = (phase - 0.52) / 0.36;
        explodeAmount = 1 - easeInOutCubic(t);
        nodeCount = Math.floor(TOTAL_NODES * (1 - explodeAmount));
      } else {
        // Final assembled hold
        explodeAmount = 0;
        nodeCount = TOTAL_NODES;
      }

      // Update each part transform
      for (let i = 0; i < totalParts; i++) {
        const pd = partData[i];
        let partExplode;

        if (isExploding) {
          const rawT = (phase - 0.08) / 0.34;
          partExplode = staggeredEase(rawT, pd.delay);
        } else if (isReassembling) {
          const rawT = (phase - 0.52) / 0.36;
          // Reverse stagger: outer parts come back first
          const reverseDelay = 1 - pd.delay;
          partExplode = 1 - staggeredEase(rawT, reverseDelay * 0.3);
        } else {
          partExplode = explodeAmount;
        }

        const tx = pd.ex * partExplode;
        const ty = pd.ey * partExplode;
        pd.el.setAttribute('transform', `translate(${tx.toFixed(2)}, ${ty.toFixed(2)})`);

        // Glow effect: apply during mid-explosion/reassembly
        const shouldGlow = partExplode > 0.1 && partExplode < 0.9;
        if (shouldGlow && !pd.glowApplied) {
          pd.el.setAttribute('filter', 'url(#cyanGlow)');
          pd.el.style.opacity = '1';
          pd.glowApplied = true;
        } else if (!shouldGlow && pd.glowApplied) {
          pd.el.removeAttribute('filter');
          pd.el.style.opacity = '';
          pd.glowApplied = false;
        }
      }

      // Assembly guide lines visibility
      if (guideLines) {
        const guideOpacity = explodeAmount > 0.15 ? Math.min(1, (explodeAmount - 0.15) * 2) : 0;
        guideLines.setAttribute('opacity', guideOpacity.toFixed(3));
      }

      // Update node counter
      if (counterEl) {
        const displayCount = Math.min(TOTAL_NODES, Math.max(0, nodeCount));
        if (displayCount >= TOTAL_NODES) {
          counterEl.textContent = '14,820 / 14,820';
          counterEl.className = 'font-bold text-emerald-400 active-joints-counter';
        } else {
          counterEl.textContent = `${displayCount.toLocaleString()} / 14,820`;
          counterEl.className = 'font-bold text-cyan-300 active-joints-counter';
        }
      }

      // Update bottom status bar
      if (statusEl) {
        if (explodeAmount < 0.05) {
          statusEl.textContent = 'ASSEMBLY VALIDATED // TOLERANCE: ±0.02mm';
          if (statusDot) {
            statusDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]';
          }
        } else if (explodeAmount > 0.95) {
          statusEl.textContent = 'DECONSTRUCTED // 50 MODULES SEPARATED';
          if (statusDot) {
            statusDot.className = 'w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_#f97316]';
          }
        } else if (isReassembling) {
          statusEl.textContent = 'AUTONOMOUS REASSEMBLY // PRECISION LOCK';
          if (statusDot) {
            statusDot.className = 'w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse';
          }
        } else {
          statusEl.textContent = 'EXPLODED VIEW // STRUCTURAL ANALYSIS';
          if (statusDot) {
            statusDot.className = 'w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse';
          }
        }
      }

      requestAnimationFrame(updateAssembly);
    }

    requestAnimationFrame(updateAssembly);
  }

  // Initialize Exploded Assembly Engine
  initExplodedAssemblyEngine();

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

  // 12. Smooth Scroll Reveal Controller (Triggered whenever user scrolls into view)
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (!revealElements.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
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

  // 13. Interactive Ambient Mouse Glow & Dynamic Grid Illuminator Controller
  const initMouseGlow = () => {
    const cursorGlow = document.getElementById('cursor-glow');
    const gridSpotlight = document.getElementById('grid-spotlight-overlay');
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

    if (cursorGlow || gridSpotlight) {
      let targetX = -9999;
      let targetY = -9999;
      let currentX = -9999;
      let currentY = -9999;
      let isVisible = false;
      let rafId = null;

      const render = () => {
        // Fluid linear interpolation lerp (0.12)
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;

        if (cursorGlow) {
          cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
        if (gridSpotlight) {
          gridSpotlight.style.setProperty('--cursor-x', `${currentX}px`);
          gridSpotlight.style.setProperty('--cursor-y', `${currentY}px`);
        }

        if (isVisible || Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
          rafId = requestAnimationFrame(render);
        } else {
          rafId = null;
        }
      };

      window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;

        if (!isVisible) {
          isVisible = true;
          if (cursorGlow) cursorGlow.classList.add('active');
          if (gridSpotlight) gridSpotlight.classList.add('active');
          currentX = targetX;
          currentY = targetY;
        }

        if (!rafId) {
          rafId = requestAnimationFrame(render);
        }
      }, { passive: true });

      document.addEventListener('mouseleave', () => {
        isVisible = false;
        if (cursorGlow) cursorGlow.classList.remove('active');
        if (gridSpotlight) gridSpotlight.classList.remove('active');
      });

      document.addEventListener('mouseenter', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        currentX = targetX;
        currentY = targetY;
        isVisible = true;
        if (cursorGlow) cursorGlow.classList.add('active');
        if (gridSpotlight) gridSpotlight.classList.add('active');
        if (!rafId) {
          rafId = requestAnimationFrame(render);
        }
      });
    }

    // Card spotlight tracking for interactive cards
    const spotlightCards = document.querySelectorAll('.beachhead-card, .hr-bento-col, .dda-console-card, .stepper-horizontal-wrap, .orchestration-console-card');
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });
  };

  initMouseGlow();
});
