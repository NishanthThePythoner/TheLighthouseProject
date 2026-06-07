// Supabase Database Connection Configuration (Replace with your own project keys)
const SUPABASE_URL = 'https://wsxycwkgoxziaxzsfiae.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeHljd2tnb3h6aWF4enNmaWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTQzNjEsImV4cCI6MjA5NjI5MDM2MX0.PjayQwVLVnsF6Ai_sdVJb9wy7U_xiAuV1OJBkXL0i8E';
let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false // Disable session persistence to avoid localStorage exceptions in strict privacy mode
            }
        });
    } catch (e) {
        console.warn('Supabase client initialization failed, running in local fallback mode:', e);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // HTML escaping helper function
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Load dynamic statistics if saved in localStorage
    function loadDynamicMetrics() {
        for (let i = 1; i <= 4; i++) {
            const numVal = localStorage.getItem(`metric-num-${i}`);
            const lblVal = localStorage.getItem(`metric-lbl-${i}`);
            
            const numElem = document.getElementById(`metric-num-${i}`);
            const lblElem = document.getElementById(`metric-lbl-${i}`);
            
            if (numVal !== null && numElem) numElem.textContent = numVal;
            if (lblVal !== null && lblElem) lblElem.textContent = lblVal;
        }
    }
    loadDynamicMetrics();

    // Helper functions for CMS injection
    function safeUpdateText(id, text) {
        const el = document.getElementById(id);
        if (el && text !== undefined && text !== null) {
            el.textContent = text;
        }
    }

    function safeUpdateBullets(id, bulletsArray) {
        const el = document.getElementById(id);
        if (el && Array.isArray(bulletsArray)) {
            el.innerHTML = '';
            bulletsArray.forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                el.appendChild(li);
            });
        }
    }

    // Dynamic Website CMS Configuration loader
    function applyDynamicCMSConfig() {
        try {
            const rawConfig = localStorage.getItem('lighthouse-cms-config');
            if (!rawConfig) return;
            const cmsConfig = JSON.parse(rawConfig);
            if (!cmsConfig) return;

            // Hero Customization
            if (cmsConfig.hero) {
                safeUpdateText('hero-title', cmsConfig.hero.title);
                safeUpdateText('hero-tagline', cmsConfig.hero.tagline);
                if (cmsConfig.hero.mottoPrefix !== undefined && cmsConfig.hero.mottoHighlight !== undefined) {
                    const mottoEl = document.getElementById('hero-motto');
                    if (mottoEl) {
                        mottoEl.innerHTML = `${escapeHTML(cmsConfig.hero.mottoPrefix)} <span class="highlight-serif" id="hero-motto-highlight">${escapeHTML(cmsConfig.hero.mottoHighlight)}</span>`;
                    }
                }
                safeUpdateText('hero-subtitle', cmsConfig.hero.subtitle);
                safeUpdateText('hero-primary-cta', cmsConfig.hero.primaryCta);
                safeUpdateText('hero-secondary-cta', cmsConfig.hero.secondaryCta);
            }

            // Core Pillars Customization
            if (cmsConfig.pillars) {
                safeUpdateText('pillars-section-title', cmsConfig.pillars.sectionTitle);
                safeUpdateText('pillars-section-desc', cmsConfig.pillars.sectionDesc);
                if (cmsConfig.pillars.pillar1) {
                    safeUpdateText('pillar-1-title', cmsConfig.pillars.pillar1.title);
                    safeUpdateText('pillar-1-desc', cmsConfig.pillars.pillar1.desc);
                    safeUpdateBullets('pillar-1-bullets', cmsConfig.pillars.pillar1.bullets);
                }
                if (cmsConfig.pillars.pillar2) {
                    safeUpdateText('pillar-2-title', cmsConfig.pillars.pillar2.title);
                    safeUpdateText('pillar-2-desc', cmsConfig.pillars.pillar2.desc);
                    safeUpdateBullets('pillar-2-bullets', cmsConfig.pillars.pillar2.bullets);
                }
                if (cmsConfig.pillars.pillar3) {
                    safeUpdateText('pillar-3-title', cmsConfig.pillars.pillar3.title);
                    safeUpdateText('pillar-3-desc', cmsConfig.pillars.pillar3.desc);
                    safeUpdateBullets('pillar-3-bullets', cmsConfig.pillars.pillar3.bullets);
                }
            }

            // Philosophy (Perspective Shift) Customization
            if (cmsConfig.philosophy) {
                safeUpdateText('philosophy-section-title', cmsConfig.philosophy.sectionTitle);
                safeUpdateText('philosophy-section-desc', cmsConfig.philosophy.sectionDesc);
                if (cmsConfig.philosophy.lighthouse) {
                    contents.lighthouse = {
                        ...contents.lighthouse,
                        ...cmsConfig.philosophy.lighthouse
                    };
                }
                if (cmsConfig.philosophy.traditional) {
                    contents.traditional = {
                        ...contents.traditional,
                        ...cmsConfig.philosophy.traditional
                    };
                }
                // Refresh perspective display mode in case it is loaded
                const perspectiveBtn = document.getElementById('perspective-toggle-btn');
                if (perspectiveBtn) {
                    const isCurrentlyLighthouse = perspectiveBtn.classList.contains('switched');
                    updatePerspective(isCurrentlyLighthouse ? 'lighthouse' : 'traditional');
                }
            }

            // Simulator (WTRH) Section Title/Desc
            if (cmsConfig.wtrh) {
                safeUpdateText('wtrh-section-title', cmsConfig.wtrh.sectionTitle);
                safeUpdateText('wtrh-section-desc', cmsConfig.wtrh.sectionDesc);
            }

            // Support Meter Section Title/Desc
            if (cmsConfig.sm) {
                safeUpdateText('sm-section-title', cmsConfig.sm.sectionTitle);
                safeUpdateText('sm-section-desc', cmsConfig.sm.sectionDesc);
            }


            // Share Thoughts (Survey) Section Title/Desc
            if (cmsConfig.survey) {
                safeUpdateText('survey-section-title', cmsConfig.survey.sectionTitle);
                safeUpdateText('survey-section-desc', cmsConfig.survey.sectionDesc);
                if (cmsConfig.survey.q1Label) {
                    const q1Lbl = document.querySelector('label[for="survey-q1"]');
                    if (q1Lbl) q1Lbl.innerHTML = `${escapeHTML(cmsConfig.survey.q1Label)} <span class="required" aria-hidden="true">*</span>`;
                }
                if (cmsConfig.survey.q2Label) {
                    const q2Lbl = document.querySelector('label[for="survey-q2"]');
                    if (q2Lbl) q2Lbl.innerHTML = `${escapeHTML(cmsConfig.survey.q2Label)} <span class="required" aria-hidden="true">*</span>`;
                }
            }

            // Contact Information Customization
            if (cmsConfig.contact) {
                safeUpdateText('contact-section-title', cmsConfig.contact.sectionTitle);
                safeUpdateText('contact-section-text', cmsConfig.contact.sectionDesc);
                const emailLink = document.getElementById('contact-email-link');
                if (emailLink && cmsConfig.contact.email) {
                    emailLink.href = `mailto:${cmsConfig.contact.email}`;
                    emailLink.textContent = cmsConfig.contact.email;
                }
                const instaLink = document.getElementById('contact-instagram-link');
                if (instaLink && cmsConfig.contact.instagram && cmsConfig.contact.instagramUrl) {
                    instaLink.href = cmsConfig.contact.instagramUrl;
                    instaLink.textContent = cmsConfig.contact.instagram;
                }
            }

            // Game Level Variables Override
            if (cmsConfig.scenarios) {
                scenarios = cmsConfig.scenarios;
                for (let lvl = 1; lvl <= 4; lvl++) {
                    const sc = scenarios[lvl];
                    if (sc) {
                        const card = document.querySelector(`.level-card[data-level="${lvl}"]`);
                        if (card) {
                            const metaEl = card.querySelector('.level-card-meta');
                            if (metaEl && sc.friendName && sc.relation) {
                                metaEl.textContent = `${sc.friendName} • ${sc.relation}`;
                            }
                            const descEl = card.querySelector('.level-card-desc');
                            if (descEl && sc.background) {
                                const shortBg = sc.background.length > 120 ? sc.background.substring(0, 117) + '...' : sc.background;
                                descEl.textContent = shortBg;
                            }
                        }
                    }
                }
            }
            if (cmsConfig.smScenarios) {
                smScenarios = cmsConfig.smScenarios;
            }

        } catch (e) {
            console.error('Failed to parse or apply CMS dynamic config:', e);
        }
    }

    // Listen for storage changes in other tabs to sync metrics and content instantly
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('metric-')) {
            loadDynamicMetrics();
        } else if (e.key === 'lighthouse-cms-config') {
            applyDynamicCMSConfig();
        }
    });

    // Page View Tracker
    function trackPageView() {
        let views = localStorage.getItem('page-views');
        if (views === null) {
            views = 342;
        } else {
            views = parseInt(views) + 1;
        }
        localStorage.setItem('page-views', views);
        
        let viewHistory = localStorage.getItem('page-view-history');
        viewHistory = viewHistory ? JSON.parse(viewHistory) : [];
        if (viewHistory.length === 0) {
            const now = Date.now();
            for (let i = 0; i < 50; i++) {
                const offset = Math.random() * 3600000 * 24 * 5;
                viewHistory.push(new Date(now - offset).toISOString());
            }
        }
        viewHistory.push(new Date().toISOString());
        if (viewHistory.length > 100) viewHistory.shift();
        localStorage.setItem('page-view-history', JSON.stringify(viewHistory));
    }
    trackPageView();

    /* ==========================================================================
       0. DARK/LIGHT MODE THEME SWITCHER
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');

    // Initial check: load from storage or fallback to device media queries
    const savedTheme = localStorage.getItem('theme');
    const devicePrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && devicePrefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeIcons(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcons(false);
    }

    function handleThemeToggle() {
        const isCurrentlyDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isCurrentlyDark ? 'dark' : 'light');
        updateThemeIcons(isCurrentlyDark);
    }

    function updateThemeIcons(isDark) {
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-checked', isDark);
        }
        if (themeToggleMobileBtn) {
            themeToggleMobileBtn.setAttribute('aria-checked', isDark);
            const mobileLabel = themeToggleMobileBtn.querySelector('.theme-label-mobile');
            if (mobileLabel) {
                mobileLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            }
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', handleThemeToggle);
    }
    if (themeToggleMobileBtn) {
        themeToggleMobileBtn.addEventListener('click', handleThemeToggle);
    }

    /* ==========================================================================
       1. GLOBAL UTILITIES & ACCESSIBILITY HELPER
       ========================================================================== */

    // Smooth Scroll Active Links Highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const header = document.getElementById('main-header');
    const scrollProgressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPosition = window.scrollY + 120;

        // Header scrolled class addition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Section scrolling indicators
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });

        // Top horizontal progress bar reading percentage
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgressBar) {
            scrollProgressBar.style.width = scrolled + '%';
        }
    });

    /* ==========================================================================
       2. RESPONSIVE MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        const isOpen = mobileNavMenu.classList.toggle('open');
        mobileNavToggle.classList.toggle('open');

        // Update accessibility roles
        mobileNavToggle.setAttribute('aria-expanded', isOpen);
        mobileNavMenu.setAttribute('aria-hidden', !isOpen);

        // Prevent body scroll when menu is active
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', toggleMobileMenu);

        // Close menu on selecting any link anchor
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNavMenu.classList.contains('open')) {
                    toggleMobileMenu();
                }
            });
        });

        // Click outside of container closes drawer
        document.addEventListener('click', (e) => {
            if (mobileNavMenu.classList.contains('open') &&
                !mobileNavMenu.contains(e.target) &&
                !mobileNavToggle.contains(e.target)) {
                toggleMobileMenu();
            }
        });
    }

    /* ==========================================================================
       3. PERSPECTIVE SHIFT INTERACTIVE TOGGLE
       ========================================================================== */
    const perspectiveBtn = document.getElementById('perspective-toggle-btn');
    const labelTraditional = document.getElementById('label-traditional');
    const labelLighthouse = document.getElementById('label-lighthouse');
    const perspectiveCard = document.getElementById('perspective-card');

    const perspectiveTitle = document.getElementById('perspective-title');
    const perspectiveSubtitle = document.getElementById('perspective-subtitle');
    const perspectiveBody = document.getElementById('perspective-body');
    const perspectiveList = document.getElementById('perspective-list');
    const perspectiveVisual = document.getElementById('perspective-visual-container');

    let contents = {
        lighthouse: {
            subtitle: "The Lighthouse Model",
            title: "Empowering the surrounding peer community",
            body: "Instead of expecting a struggling teenager to seek out institutional support on their own, we equip friends with the confidence, active listening skills, and boundary-awareness to step in and offer immediate emotional first-aid.",
            list: [
                "Focuses on training the peers who are already around them.",
                "Replaces immediate categorization with patient, active presence.",
                "Prepares teens to connect friends to professional help safely."
            ],
            visual: `
                <div class="visual-circle-network">
                    <div class="node center-node distress" id="vis-center">Peer in Distress</div>
                    <div class="node friend-node connected" id="vis-f1">Friend A</div>
                    <div class="node friend-node connected" id="vis-f2">Friend B</div>
                    <div class="node friend-node connected" id="vis-f3">Friend C</div>
                    <div class="beacon-pulse" id="vis-pulse"></div>
                </div>
            `
        },
        traditional: {
            subtitle: "Traditional Approach",
            title: "Placing the burden solely on the individual",
            body: "General mental health approaches focus heavily on expecting the teenager already experiencing deep distress to diagnose their own issues, overcome massive social anxiety, and actively seek out professional services alone.",
            list: [
                "Assumes a teen in distress will reach out to a trusted adult first.",
                "Categorizes and labels complex emotional issues too early.",
                "Relies on institutional systems teenagers realistically hesitate to use."
            ],
            visual: `
                <div class="visual-circle-network">
                    <div class="node center-node isolated" id="vis-center">Peer in Distress</div>
                    <div class="node friend-node disconnected" id="vis-f1">Friend A</div>
                    <div class="node friend-node disconnected" id="vis-f2">Friend B</div>
                    <div class="node friend-node disconnected" id="vis-f3">Friend C</div>
                </div>
            `
        }
    };

    function updatePerspective(mode) {
        const data = contents[mode];

        // Set correct active classes on labels and toggle button
        if (mode === 'lighthouse') {
            labelLighthouse.classList.add('active');
            labelTraditional.classList.remove('active');
            perspectiveCard.classList.remove('traditional-mode');
            perspectiveBtn.setAttribute('aria-checked', 'true');
            perspectiveBtn.classList.add('switched'); // Dot goes to the right (Lighthouse)
        } else {
            labelTraditional.classList.add('active');
            labelLighthouse.classList.remove('active');
            perspectiveCard.classList.add('traditional-mode');
            perspectiveBtn.setAttribute('aria-checked', 'false');
            perspectiveBtn.classList.remove('switched'); // Dot goes to the left (Traditional)
        }

        // Apply textual changes with clean animations
        perspectiveCard.style.opacity = '0';
        perspectiveCard.style.transform = 'translateY(8px)';

        setTimeout(() => {
            perspectiveSubtitle.textContent = data.subtitle;
            perspectiveTitle.textContent = data.title;
            perspectiveBody.textContent = data.body;

            perspectiveList.innerHTML = '';
            data.list.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                perspectiveList.appendChild(li);
            });

            perspectiveVisual.innerHTML = data.visual;

            perspectiveCard.style.opacity = '1';
            perspectiveCard.style.transform = 'translateY(0)';
        }, 200);
    }

    if (perspectiveBtn) {
        perspectiveBtn.addEventListener('click', () => {
            const isCurrentlyLighthouse = perspectiveBtn.classList.contains('switched');
            updatePerspective(isCurrentlyLighthouse ? 'traditional' : 'lighthouse');
        });

        // Add keyboard activation listener
        perspectiveBtn.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                perspectiveBtn.click();
            }
        });
    }


    /* ==========================================================================
       4. PEER SUPPORT SIMULATOR: WHAT THEY REALLY HEARD (LEVELS 1-4)
       ========================================================================== */
    const levelSelectionScreen = document.getElementById('level-selection-screen');
    const wtrhWorkspace = document.getElementById('wtrh-workspace');
    const completionScreen = document.getElementById('level-completion-screen');
    const levelCards = document.querySelectorAll('.level-card');
    const backToLevelsBtn = document.getElementById('back-to-levels-btn');

    // Workspace sidebar info
    const activeFriendAvatar = document.getElementById('active-friend-avatar');
    const activeFriendName = document.getElementById('active-friend-name');
    const activeFriendRelationship = document.getElementById('active-friend-relationship');
    const activeScenarioDesc = document.getElementById('active-scenario-desc');
    const chatHeaderTitle = document.getElementById('chat-header-title');
    const activeStatusDot = document.getElementById('active-status-dot');

    // Chat containers
    const chatMessagesContainer = document.getElementById('wtrh-chat-messages');
    const chatOptionsContainer = document.getElementById('wtrh-chat-options');
    const chatControls = document.getElementById('wtrh-chat-controls');

    // Perspective reveal overlays
    const perspectiveRevealOverlay = document.getElementById('perspective-reveal-overlay');
    const revealTextSaid = document.getElementById('reveal-text-said');
    const revealTextMeant = document.getElementById('reveal-text-meant');
    const revealTextHeard = document.getElementById('reveal-text-heard');
    const revealTextExplanation = document.getElementById('reveal-text-explanation');
    const contextWarningBox = document.getElementById('context-warning-box');
    const contextWarningText = document.getElementById('context-warning-text');
    const revealRewindBtn = document.getElementById('reveal-rewind-btn');
    const revealContinueBtn = document.getElementById('reveal-continue-btn');

    // Level Completion Screen
    const completionIcon = document.getElementById('completion-icon');
    const completionTitle = document.getElementById('completion-title');
    const completionScore = document.getElementById('completion-score');
    const completionDesc = document.getElementById('completion-desc');
    const completionMetersSummary = document.querySelector('.completion-meters-summary');
    const completionNextLevelBtn = document.getElementById('completion-next-level-btn');
    const completionReplayBtn = document.getElementById('completion-replay-btn');
    const completionExitBtn = document.getElementById('completion-exit-btn');

    // Scenario Script Data
    let scenarios = {
        1: {
            friendName: "Aarav",
            relation: "Classmate & Cricket Friend",
            avatar: "🏏",
            background: "Aarav has been exceptionally quiet lately. Today, he missed cricket practice and posted a cryptic story: 'Just tired of pretending it's fine.' You decide to DM him.",
            startStep: "start",
            steps: {
                "start": {
                    speaker: "peer",
                    text: "Hey... thanks for textin. Honestly, just feeling super overwhelmed lately. Cricket was too much today, so I skipped. Just didn't want to deal with anyone.",
                    options: [
                        {
                            text: "Have you tried taking a break? Maybe just relax this weekend.",
                            intent: "I wanted to suggest a solution to help him recover and feel better.",
                            heard: "You think I should handle this myself and that resting is an easy fix.",
                            explanation: "When someone is overwhelmed, suggesting a quick fix like 'taking a break' can make them feel like you are dismissing the depth of their struggle, or putting the burden back on them to solve it rather than just listening.",
                            nextStep: "branch_solution",
                            warning: "Note this response: 'Have you tried taking a break?'. In Level 1, Aarav receives it with mixed feelings, but let's see how it behaves in subsequent levels.",
                            impact: { listening: 0, curiosity: -10, validation: -20, empathy: -10, problem_solving: 30, assumptions: 10 }
                        },
                        {
                            text: "That sounds super rough. Is it school stuff or just everything building up?",
                            intent: "I wanted to validate his stress and open up space for him to share details.",
                            heard: "They genuinely want to understand what's going on and are ready to listen.",
                            explanation: "By validating their pain ('That sounds super rough') and asking an open question ('Is it school stuff or...'), you show that you aren't rushing to fix the issue. This creates a safe space for them to open up further.",
                            nextStep: "branch_empathetic",
                            impact: { listening: 30, curiosity: 30, validation: 20, empathy: 20, problem_solving: 0, assumptions: -10 }
                        },
                        {
                            text: "You'll be okay, everyone feels like that sometimes! Don't let it get to you.",
                            intent: "I wanted to encourage him and normalize his feelings so he feels less alone.",
                            heard: "My feelings aren't that serious or unusual. I should stop complaining.",
                            explanation: "Well-meaning attempts to normalize feelings or encourage someone to 'stay positive' often feel like minimization. Normalizing a struggle shouldn't come at the cost of acknowledging the person's unique distress.",
                            nextStep: "branch_minimize",
                            impact: { listening: -10, curiosity: -20, validation: -30, empathy: -10, problem_solving: 0, assumptions: 20 }
                        }
                    ]
                },
                "branch_solution": {
                    speaker: "peer",
                    text: "Idk, everyone keeps telling me to take a break, but my parents are breathing down my neck about exams. I can't just stop.",
                    options: [
                        {
                            text: "I get it, but your health comes first. They'll understand if you explain it.",
                            intent: "I wanted to reassure him that his parents would prioritize his well-being.",
                            heard: "You don't understand how strict my parents actually are.",
                            explanation: "Telling a friend what their parents will or won't understand is an assumption. By asserting this, you inadvertently minimize the real fear and pressure they feel, making them feel misunderstood.",
                            nextStep: "failure_end",
                            impact: { listening: 0, curiosity: -10, validation: -10, empathy: 10, problem_solving: 20, assumptions: 10 }
                        },
                        {
                            text: "That pressure must feel incredibly heavy. No wonder you skipped practice.",
                            intent: "I wanted to acknowledge and validate the weight of his parental pressure.",
                            heard: "They see how hard this is for me and don't expect me to just fix it.",
                            explanation: "This response validates the friend's emotional state directly and connects it to their actions ('No wonder you skipped practice'). It shows you understand their reality rather than arguing with it.",
                            nextStep: "success_end",
                            impact: { listening: 30, curiosity: 10, validation: 30, empathy: 30, problem_solving: -10, assumptions: -15 }
                        }
                    ]
                },
                "branch_empathetic": {
                    speaker: "peer",
                    text: "Everything tbh. My parents expect straight A's, and I feel like I'm letting everyone down. Literally feel like I can't breathe sometimes.",
                    options: [
                        {
                            text: "That sounds incredibly heavy, Aarav. Carrying all that expectation alone is a lot.",
                            intent: "I wanted to express deep empathy and validate how hard his situation is.",
                            heard: "I don't have to pretend to be strong around them. They get it.",
                            explanation: "Acknowledge the weight of the emotion and the feeling of isolation ('Carrying all that expectation alone'). It signals that you are willing to sit with them in their pain without trying to force a resolution.",
                            nextStep: "success_end",
                            impact: { listening: 30, curiosity: 10, validation: 30, empathy: 30, problem_solving: 0, assumptions: -10 }
                        },
                        {
                            text: "Why don't we make a study schedule together? That might make it feel less scary.",
                            intent: "I wanted to help him structure his workload to resolve the issue.",
                            heard: "Instead of listening, they want to give me chores to do.",
                            explanation: "Offering a practical tool like a 'study schedule' when someone is sharing how overwhelmed they are feels like homework. In distress, people need connection and understanding first, not action items.",
                            nextStep: "failure_end",
                            impact: { listening: 0, curiosity: -10, validation: -20, empathy: 0, problem_solving: 30, assumptions: 15 }
                        }
                    ]
                },
                "branch_minimize": {
                    speaker: "peer",
                    text: "Yeah, true. Probably just being dramatic. Nvm. I'm gonna go sleep.",
                    options: [
                        {
                            text: "Wait, sorry, I didn't mean to make it sound like you're dramatic. I'm listening.",
                            intent: "I wanted to apologize, adjust my tone, and validate his feelings.",
                            heard: "They realize they misstepped and are willing to correct themselves to listen.",
                            explanation: "Taking immediate accountability for a conversational misstep builds trust. By apologizing and shifting back to active listening, you show that their comfort is more important than your ego.",
                            nextStep: "branch_empathetic",
                            impact: { listening: 20, curiosity: 10, validation: 25, empathy: 20, problem_solving: 0, assumptions: -20 }
                        },
                        {
                            text: "Alright, sleep well! Talk tomorrow.",
                            intent: "I wanted to give him space and avoid bothering him further.",
                            heard: "They are relieved the conversation is over and don't really want to deal with it.",
                            explanation: "Allowing a friend to shut down and withdraw after they felt dismissed confirms their suspicion that they were a burden. It closes the door on the support they actually needed.",
                            nextStep: "failure_end",
                            impact: { listening: -20, curiosity: -20, validation: -10, empathy: -10, problem_solving: 0, assumptions: 10 }
                        }
                    ]
                },
                "success_end": {
                    speaker: "peer",
                    text: "Thanks for listening, seriously. It actually makes it feel a bit lighter just saying it. We should play some games tomorrow.",
                    reactions: ["❤️"],
                    options: [],
                    isOutcome: true,
                    outcomeType: "success",
                    outcomeText: "Successful Connection: You prioritized listening and validation. Aarav felt safe enough to share his feelings, reinforcing that he is valued for who he is rather than his performance."
                },
                "failure_end": {
                    speaker: "peer",
                    text: "Yeah, whatever. Look, I don't really want a lecture right now. I'm just gonna head out. Talk later.",
                    reactions: ["😢"],
                    options: [],
                    isOutcome: true,
                    outcomeType: "failure",
                    outcomeText: "Disconnection: Aarav withdrew. Rushing to solve his problems or minimizing his pain made him feel misunderstood. Remember: Support, don't solve."
                }
            }
        },
        2: {
            friendName: "Riya",
            relation: "Close Group Friend",
            avatar: "🍿",
            background: "Riya has flaked on hanging out three times this month. Today, she cancels again last-minute with a text message. You decide to reply.",
            startStep: "start",
            steps: {
                "start": {
                    speaker: "peer",
                    text: "hey sorry but i can't make it to cinema tonight. something came up... super sorry to flake again 😭",
                    options: [
                        {
                            text: "All good! Let us know when you're free next.",
                            intent: "I wanted to be chill and avoid making her feel guilty.",
                            heard: "They don't really care if I'm there or not. I'm easily forgotten.",
                            explanation: "While trying to sound 'chill' prevents guilt, it can also sound indifferent. For someone struggling with isolation or anxiety, this response can be interpreted as a lack of care about their presence.",
                            nextStep: "branch_chill",
                            impact: { listening: 10, curiosity: -10, validation: 0, empathy: 0, problem_solving: 0, assumptions: 10 }
                        },
                        {
                            text: "Have you tried taking a break? Maybe you just need to rest.",
                            intent: "I wanted to offer a helpful tip to solve her flaking issue by suggesting rest.",
                            heard: "They are writing me off. It feels like they are saying 'fine, just stay home.'",
                            explanation: "Since she has canceled multiple times, recommending a 'break' functions differently than in Level 1. It acts as an easy dismissal—telling her to remain isolated, confirming her fears of being written off.",
                            nextStep: "branch_rest_dismissive",
                            warning: "⚠️ Context Check: In Level 1, 'taking a break' felt like standard advice. But in this scenario, where she has canceled repeatedly, offering this advice makes her feel excluded and pushed away, showing how context shifts impact.",
                            impact: { listening: -10, curiosity: -20, validation: -20, empathy: -10, problem_solving: 30, assumptions: 20 }
                        },
                        {
                            text: "Is everything okay? You've cancel'd a few times recently, I'm getting a bit worried.",
                            intent: "I wanted to notice her behavior pattern gently and show concern for her well-being.",
                            heard: "They are paying attention to me. They notice I'm not okay and care.",
                            explanation: "Gently naming a pattern of behavior ('You've canceled a few times recently') and expressing concern shows that you notice their absence and care about their well-being, paving the way for honest conversation.",
                            nextStep: "branch_worried",
                            impact: { listening: 30, curiosity: 30, validation: 25, empathy: 30, problem_solving: 0, assumptions: -10 }
                        }
                    ]
                },
                "branch_chill": {
                    speaker: "peer",
                    text: "Yeah, totally. Have fun guys. I'll just see you at school.",
                    options: [
                        {
                            text: "Are you sure everything is alright? You don't seem like yourself.",
                            intent: "I wanted to double check and express care despite my initially casual response.",
                            heard: "They care enough to check twice even when I gave a dismissive reply.",
                            explanation: "Checking in twice shows persistence and genuine care. It lets the friend know that their initial deflective answer didn't fool you, and that you are truly there to listen.",
                            nextStep: "branch_worried",
                            impact: { listening: 20, curiosity: 30, validation: 20, empathy: 20, problem_solving: 0, assumptions: -10 }
                        },
                        {
                            text: "Alright, cool. See you Monday!",
                            intent: "I wanted to respect her boundaries and keep things low-key.",
                            heard: "We are drifting apart and they are completely fine with it.",
                            explanation: "Closing the loop with a simple 'See you Monday' confirms their feeling of disconnection. Responding too casually to repeated withdrawal can accelerate a friend's isolation.",
                            nextStep: "failure_end",
                            impact: { listening: -20, curiosity: -20, validation: -10, empathy: -15, problem_solving: 0, assumptions: 10 }
                        }
                    ]
                },
                "branch_rest_dismissive": {
                    speaker: "peer",
                    text: "Yeah, I guess so. I'll just stay in. You guys have fun.",
                    options: [
                        {
                            text: "Wait, I didn't mean to sound dismissive! I really want to see you. Is something going on?",
                            intent: "I wanted to correct my mistake, showing I want her included.",
                            heard: "They care about my presence and want to check on my well-being.",
                            explanation: "Recognizing that your advice felt dismissive and correcting course immediately shifts the dynamic. It shows you want them there and care about the underlying reason for their cancellation.",
                            nextStep: "branch_worried",
                            impact: { listening: 30, curiosity: 25, validation: 20, empathy: 25, problem_solving: -15, assumptions: -20 }
                        },
                        {
                            text: "Yeah, get some rest! Talk later.",
                            intent: "I wanted to encourage her to follow through on resting.",
                            heard: "They are happy to leave me behind. The distance is growing.",
                            explanation: "Doubling down on 'get some rest' when the friend expressed that they felt written off solidifies their isolation, showing that you aren't paying attention to the relational distance.",
                            nextStep: "failure_end",
                            impact: { listening: -20, curiosity: -20, validation: -10, empathy: -10, problem_solving: 20, assumptions: 10 }
                        }
                    ]
                },
                "branch_worried": {
                    speaker: "peer",
                    text: "Honestly... everything has been a mess. I've been feeling super anxious and depressed, and leaving the house literally gives me panic attacks. I've just been hiding.",
                    voiceNote: true,
                    duration: "0:34",
                    options: [
                        {
                            text: "That sounds incredibly terrifying, Riya. I had no idea you were dealing with that.",
                            intent: "I wanted to validate her panic and acknowledge her painful experience.",
                            heard: "My anxiety is real and they aren't judging me for hiding.",
                            explanation: "Validating a severe emotion ('That sounds incredibly terrifying') rather than downplaying it or rushing to fix it provides immense relief. It signals that you are a safe person to be vulnerable around.",
                            nextStep: "success_end",
                            impact: { listening: 30, curiosity: 15, validation: 30, empathy: 30, problem_solving: 0, assumptions: -10 }
                        },
                        {
                            text: "You should really talk to a doctor. I can send you a link to an online therapist.",
                            intent: "I wanted to immediately solve her panic attacks with professional help.",
                            heard: "I am a problem that needs to be handed off to someone else. They can't handle me.",
                            explanation: "Jumping straight to a professional handoff without first validating their disclosure feels like rejection. Even if professional help is needed eventually, a friend's first job is to show emotional presence.",
                            nextStep: "failure_end",
                            impact: { listening: 0, curiosity: -10, validation: -20, empathy: 10, problem_solving: 30, assumptions: 10 }
                        }
                    ]
                },
                "success_end": {
                    speaker: "peer",
                    text: "Thanks for not being mad. It means so much that you checked on me. Let's Facetime tomorrow?",
                    reactions: ["❤️"],
                    options: [],
                    isOutcome: true,
                    outcomeType: "success",
                    outcomeText: "Successful Connection: You noticed the pattern, avoided simple solutions, and validated Riya's anxiety. She felt safe to explain her withdrawal, preserving the friendship."
                },
                "failure_end": {
                    speaker: "peer",
                    text: "Yeah, okay. Thanks. I'm gonna go now.",
                    reactions: ["😢"],
                    options: [],
                    isOutcome: true,
                    outcomeType: "failure",
                    outcomeText: "Disconnection: Riya withdrew further. Suggesting 'taking a break' when she was already isolated, or jumping straight to professional handoff without listening, validated her fears of being a burden."
                }
            }
        },
        3: {
            friendName: "Kavya",
            relation: "Study Partner",
            avatar: "📚",
            background: "Kavya spent three weeks preparing for the debate team tryouts but didn't make the cut. She is posting memes and making self-deprecating jokes in the chat.",
            startStep: "start",
            steps: {
                "start": {
                    speaker: "peer",
                    text: "lmao shocker, I didn't make the team. naturally, because my brain has the capacity of a potato 🥔😂 guess who's destined for failure!",
                    edited: true,
                    options: [
                        {
                            text: "Lmao stop, you're not a potato! You'll get it next year.",
                            intent: "I wanted to match her joke and offer light reassurance.",
                            heard: "They don't want to deal with my actual sadness, so I have to keep joking.",
                            explanation: "Playing along with self-deprecating humor and offering empty reassurance ('You'll get it next year') sends a message that you are uncomfortable with their actual disappointment, forcing them to keep laughing off their pain.",
                            nextStep: "branch_laugh",
                            impact: { listening: 10, curiosity: -15, validation: -10, empathy: 10, problem_solving: 0, assumptions: 10 }
                        },
                        {
                            text: "Have you tried taking a break? You worked really hard, maybe you need space from debate.",
                            intent: "I wanted to suggest a solution (taking a break) to solve her disappointment.",
                            heard: "They think I failed because I didn't manage myself well, or they want me to give up.",
                            explanation: "Telling someone who just failed to 'take a break' can be interpreted as telling them to quit or suggesting they couldn't handle the pressure. It focus-shifts to their competence rather than validating their hurt.",
                            nextStep: "branch_break_potato",
                            warning: "⚠️ Context Check: Offering 'taking a break' here feels like telling her to quit or that she is weak, which lands as dismissive rather than supportive.",
                            impact: { listening: -10, curiosity: -20, validation: -20, empathy: -10, problem_solving: 35, assumptions: 15 }
                        },
                        {
                            text: "That really sucks, Kavya. I know how much you wanted this and how hard you studied.",
                            intent: "I wanted to validate her disappointment directly, ignoring the joke to acknowledge her hard work.",
                            heard: "I don't have to pretend to laugh. It's okay that I'm upset about this.",
                            explanation: "Bypassing the defense mechanism of humor to address the disappointment directly ('That really sucks') shows you see through the mask. It permits them to drop the jokes and express genuine feelings.",
                            nextStep: "branch_validate",
                            impact: { listening: 30, curiosity: 20, validation: 30, empathy: 30, problem_solving: 0, assumptions: -10 }
                        }
                    ]
                },
                "branch_laugh": {
                    speaker: "peer",
                    text: "Haha yeah, next year... assuming I haven't failed out of school by then. I literally flunked the practice quiz today too. Just dumb I guess.",
                    options: [
                        {
                            text: "You're not dumb at all! You're literally one of the smartest people I know.",
                            intent: "I wanted to boost her self-esteem and contradict her self-doubt.",
                            heard: "They are trying to argue with my feelings rather than hearing how stressed I am.",
                            explanation: "Arguing against a friend's negative self-talk, even with compliments, can feel invalidating. They don't need you to dispute their logic; they need you to understand how deeply they are hurting right now.",
                            nextStep: "failure_end",
                            impact: { listening: 10, curiosity: -10, validation: -20, empathy: 10, problem_solving: 0, assumptions: 10 }
                        },
                        {
                            text: "It sounds like you're putting a lot of pressure on yourself. Failing the quiz must have felt awful after the debate news.",
                            intent: "I wanted to validate the emotional combination of failures she is experiencing.",
                            heard: "They see my stress. I don't have to defend my intelligence; they understand the weight.",
                            explanation: "This response connects the dots between multiple stressors ('debate news' and 'quiz') and validates the emotional toll. It shows active listening and deep perspective-taking.",
                            nextStep: "branch_validate",
                            impact: { listening: 30, curiosity: 15, validation: 30, empathy: 30, problem_solving: 0, assumptions: -5 }
                        }
                    ]
                },
                "branch_break_potato": {
                    speaker: "peer",
                    text: "Yeah, whatever. Maybe debate isn't my thing anyway. I'll just study alone.",
                    options: [
                        {
                            text: "Wait, I didn't mean to say you should quit. You're great at debate! I know you're hurting.",
                            intent: "I wanted to correct my mistake and validate her pain.",
                            heard: "They realize they made me feel bad and are trying to listen now.",
                            explanation: "Catching a misunderstanding and clarifying that you recognize their hurt over their competence shifts the interaction back to a supportive, empathetic connection.",
                            nextStep: "branch_validate",
                            impact: { listening: 25, curiosity: 20, validation: 20, empathy: 25, problem_solving: -15, assumptions: -15 }
                        },
                        {
                            text: "Yeah, maybe a break will help you find other interests.",
                            intent: "I wanted to encourage a positive spin on her taking a break.",
                            heard: "They agree that I'm not cut out for this. I should just fade out.",
                            explanation: "Agreeing that they should look for 'other interests' after a failure reinforces their insecurity that they aren't good enough, making them feel like you agree with their self-doubt.",
                            nextStep: "failure_end",
                            impact: { listening: -20, curiosity: -20, validation: -25, empathy: -15, problem_solving: 20, assumptions: 10 }
                        }
                    ]
                },
                "branch_validate": {
                    speaker: "peer",
                    text: "It just feels so embarrassing. I told everyone I was trying out, and now I feel like a total failure. I'm just so tired of trying so hard and getting nothing.",
                    options: [
                        {
                            text: "I completely get it. It's exhausting to put your heart into something and have it not work out.",
                            intent: "I wanted to offer validation and match her feeling of exhaustion.",
                            heard: "They understand the fatigue. I'm allowed to feel defeated for a bit.",
                            explanation: "Matching the feeling of exhaustion ('It's exhausting to put your heart into...') normalizes the natural fatigue of tryouts and disappointment, showing solidarity and comforting them in defeat.",
                            nextStep: "success_end",
                            impact: { listening: 30, curiosity: 10, validation: 30, empathy: 30, problem_solving: 0, assumptions: -10 }
                        },
                        {
                            text: "Don't say that! You'll get the next thing. What is the next club you want to try?",
                            intent: "I wanted to motivate her and solve her defeat by redirecting to a new goal.",
                            heard: "My embarrassment is uncomfortable for them. They want me to just move on.",
                            explanation: "Quickly pushing someone to move on to the 'next club' makes them feel like their current sadness and embarrassment are too inconvenient to sit with. It prioritizes action over emotional processing.",
                            nextStep: "failure_end",
                            impact: { listening: 0, curiosity: -10, validation: -20, empathy: 10, problem_solving: 20, assumptions: 15 }
                        }
                    ]
                },
                "success_end": {
                    speaker: "peer",
                    text: "Yeah... it really is. Thanks for saying that. I think I'm just gonna mope for tonight, but let's study together on Sunday?",
                    reactions: ["❤️"],
                    options: [],
                    isOutcome: true,
                    outcomeType: "success",
                    outcomeText: "Successful Connection: You ignored the humorous mask and validated Kavya's embarrassment. By letting her express disappointment, she felt supported and ready to reconnect."
                },
                "failure_end": {
                    speaker: "peer",
                    text: "Yeah. Anyway, I have to study. See ya.",
                    reactions: ["😢"],
                    options: [],
                    isOutcome: true,
                    outcomeType: "failure",
                    outcomeText: "Disconnection: Kavya shut down. Offering quick study solutions, lecturing her not to be sad, or trying to redirect her goals minimized her embarrassment, making her retreat."
                }
            }
        },
        4: {
            friendName: "Group Chat",
            relation: "Dev & Rohan",
            avatar: "📱",
            background: "You, Dev, and Rohan are in a group chat. You and Dev went to the arcade yesterday but Rohan wasn't invited. Dev posts a picture from the arcade, and Rohan responds passive-aggressively.",
            startStep: "start",
            steps: {
                "start": {
                    speaker: "peer",
                    text: "Rohan: looks great. glad you guys had fun.",
                    options: [
                        {
                            text: "Sorry Rohan! We thought you were busy studying for the physics exam anyway.",
                            intent: "I wanted to explain why he wasn't invited to resolve the awkwardness and avoid guilt.",
                            heard: "They decided for me that I shouldn't be invited, rather than asking me. I was excluded by choice.",
                            explanation: "Using an excuse like 'we thought you were busy' shifts the blame to the friend's schedule. It takes away their agency to choose whether they wanted to join or take a break, heightening their sense of exclusion.",
                            nextStep: "branch_excuse",
                            impact: { listening: 10, curiosity: -20, validation: -20, empathy: -10, problem_solving: 10, assumptions: 35 }
                        },
                        {
                            text: "We missed you Rohan! We only went for like an hour because we were nearby.",
                            intent: "I wanted to minimize the trip to make him feel less left out.",
                            heard: "They think my feelings of being excluded aren't a big deal because the trip was short.",
                            explanation: "Minimizing the event ('only went for an hour') attempts to make the exclusion seem minor, but it actually trivializes their feelings. The hurt comes from being forgotten, regardless of how long the outing was.",
                            nextStep: "branch_minimize_outing",
                            impact: { listening: 15, curiosity: -10, validation: -15, empathy: 0, problem_solving: 0, assumptions: 15 }
                        },
                        {
                            text: "Hey Rohan, sorry we didn't invite you. It was a last minute trip, but it was wrong of us to not drop a text. We really missed having you.",
                            intent: "I wanted to take direct accountability, apologize, and validate his exclusion.",
                            heard: "They admit they made a mistake and care about my feelings and presence.",
                            explanation: "A clean, excuse-free apology that takes responsibility and validates the exclusion is highly effective. It addresses the emotional impact directly and restores mutual respect.",
                            nextStep: "branch_apology",
                            impact: { listening: 30, curiosity: 15, validation: 30, empathy: 30, problem_solving: -10, assumptions: -20 }
                        }
                    ]
                },
                "branch_excuse": {
                    speaker: "peer",
                    text: "Rohan: right, because I'm not allowed to take a break from studying? whatever.",
                    options: [
                        {
                            text: "I'm sorry Rohan, you're right. We shouldn't have assumed. We messed up.",
                            intent: "I wanted to drop the excuses and apologize sincerely.",
                            heard: "They see my point and are owning up to it.",
                            explanation: "Dropping defensive excuses when called out ('We shouldn't have assumed') builds safety. It validates the friend's critique and shows a willingness to prioritize the relationship over saving face.",
                            nextStep: "branch_apology",
                            impact: { listening: 30, curiosity: 15, validation: 35, empathy: 30, problem_solving: -15, assumptions: -30 }
                        },
                        {
                            text: "We were just trying to help you study! No need to get so defensive.",
                            intent: "I wanted to defend our original intention of helping him study.",
                            heard: "They are blaming me for being upset about being left out. They don't care.",
                            explanation: "Accusing an excluded friend of being 'defensive' shifts the blame onto their reaction. It gaslights their natural hurt and makes them feel like the problem is their sensitivity rather than the exclusion.",
                            nextStep: "failure_end",
                            impact: { listening: -20, curiosity: -25, validation: -30, empathy: -20, problem_solving: 0, assumptions: 20 }
                        }
                    ]
                },
                "branch_minimize_outing": {
                    speaker: "peer",
                    text: "Rohan: if it wasn't a big deal then why post pictures? just say you didn't want me there.",
                    options: [
                        {
                            text: "That's not true at all! We always want you there. It was just a mistake, and I'm sorry.",
                            intent: "I wanted to reassure him of his place in the group and apologize.",
                            heard: "They are trying to fix it, but it feels like damage control.",
                            explanation: "Reassuring a friend of their value while apologizing helps calm insecurity, though because it follows a minimisation attempt, it can still feel a bit like damage control unless followed by genuine connection.",
                            nextStep: "branch_apology",
                            impact: { listening: 20, curiosity: 10, validation: 20, empathy: 20, problem_solving: 0, assumptions: -10 }
                        },
                        {
                            text: "Dude, it's just an arcade. Why are you making such a huge deal out of this?",
                            intent: "I wanted to challenge what felt like an overreaction to a small hangout.",
                            heard: "They think I'm dramatic and don't value my friendship.",
                            explanation: "Trivializing their reaction ('Why are you making such a huge deal') invalidates their underlying fear of being replaced in the group. It replaces empathy with irritation, leading to disconnection.",
                            nextStep: "failure_end",
                            impact: { listening: -30, curiosity: -30, validation: -35, empathy: -30, problem_solving: 0, assumptions: 30 }
                        }
                    ]
                },
                "branch_apology": {
                    speaker: "peer",
                    text: "Rohan: yeah it just sucks seeing you guys hang out without even asking. feels like I'm being replaced.",
                    options: [
                        {
                            text: "You could never be replaced Rohan. You're our best friend. Let's all go to the arcade together this Saturday, our treat.",
                            intent: "I wanted to validate his insecurity and plan an inclusive outing to repair the dynamic.",
                            heard: "I am still a central part of this friendship and they want to make things right.",
                            explanation: "This response provides reassurance against their specific fear ('never be replaced') and translates that reassurance into concrete action ('arcade together this Saturday'), actively repairing the rift.",
                            nextStep: "success_end",
                            impact: { listening: 30, curiosity: 20, validation: 30, empathy: 30, problem_solving: 20, assumptions: -15 }
                        },
                        {
                            text: "Well we are talking to you now, aren't we? You don't need to feel like that.",
                            intent: "I wanted to prove that we still care by highlighting our current text conversation.",
                            heard: "They want me to stop sharing my insecurities because it makes them uncomfortable.",
                            explanation: "Saying 'we are talking to you now' is a superficial defense. It treats communication as a checklist rather than addressing the actual emotional distance the friend is feeling.",
                            nextStep: "failure_end",
                            impact: { listening: 0, curiosity: -20, validation: -25, empathy: -10, problem_solving: 0, assumptions: 10 }
                        }
                    ]
                },
                "success_end": {
                    speaker: "peer",
                    text: "Rohan: okay. thanks guys. sorry for being passive aggressive, just got in my feelings. Saturday sounds good.",
                    reactions: ["❤️", "👍"],
                    options: [],
                    isOutcome: true,
                    outcomeType: "success",
                    outcomeText: "Successful Connection: You navigated complex group dynamics by dropping excuses, acknowledging Rohan's exclusion, validating his insecurity, and planning inclusive repair."
                },
                "failure_end": {
                    speaker: "peer",
                    text: "Rohan: whatever. I'm going offline.",
                    reactions: ["😢"],
                    options: [],
                    isOutcome: true,
                    outcomeType: "failure",
                    outcomeText: "Disconnection: Rohan checked out. Making assumptions about his schedule, minimizing his exclusion, or calling him defensive invalidated his insecurity and damaged group trust."
                }
            }
        }
    };

    // State Variables
    let currentLevel = null;
    let currentStep = null;
    let chatHistory = [];
    let activeOption = null;
    let meters = {
        listening: 50,
        curiosity: 50,
        validation: 50,
        empathy: 50,
        problem_solving: 50,
        assumptions: 50
    };

    // Initialize Levels selection triggers
    if (levelCards) {
        levelCards.forEach(card => {
            card.addEventListener('click', () => {
                const lvl = parseInt(card.getAttribute('data-level'), 10);
                startLevel(lvl);
            });
        });
    }

    if (backToLevelsBtn) {
        backToLevelsBtn.addEventListener('click', () => {
            exitToLevelSelection();
        });
    }

    function startLevel(lvlNum) {
        currentLevel = lvlNum;
        const levelData = scenarios[lvlNum];
        if (!levelData) return;

        // Reset state variables
        currentStep = levelData.startStep;
        chatHistory = [];
        meters = {
            listening: 50,
            curiosity: 50,
            validation: 50,
            empathy: 50,
            problem_solving: 50,
            assumptions: 50
        };

        // Populate Left Panel context
        activeFriendAvatar.textContent = levelData.avatar;
        activeFriendName.textContent = levelData.friendName;
        activeFriendRelationship.textContent = levelData.relation;
        activeScenarioDesc.textContent = levelData.background;

        chatHeaderTitle.textContent = `Chatting with ${levelData.friendName}`;
        activeStatusDot.className = 'status-dot';

        // DOM adjustments
        levelSelectionScreen.style.display = 'none';
        completionScreen.style.display = 'none';
        wtrhWorkspace.style.display = 'grid';

        chatMessagesContainer.innerHTML = '';

        // Render initial UI elements
        updateVisualMeters();
        renderStep(currentStep);
    }

    function exitToLevelSelection() {
        wtrhWorkspace.style.display = 'none';
        completionScreen.style.display = 'none';
        levelSelectionScreen.style.display = 'block';

        // Reset state
        currentLevel = null;
        currentStep = null;
        chatHistory = [];
    }

    function updateVisualMeters() {
        Object.keys(meters).forEach(key => {
            const mDom = document.getElementById(`meter-${key.replace('_', '-')}`);
            if (mDom) {
                mDom.style.width = `${meters[key]}%`;
            }
        });
    }

    function renderStep(stepKey) {
        const scenarioData = scenarios[currentLevel];
        const stepData = scenarioData.steps[stepKey];
        if (!stepData) return;

        // Hide overlay panel
        perspectiveRevealOverlay.style.display = 'none';
        chatControls.style.display = 'block';
        chatOptionsContainer.innerHTML = '';

        if (stepData.speaker === 'peer') {
            activeStatusDot.classList.add('typing');
            showTypingIndicator(() => {
                activeStatusDot.classList.remove('typing');

                // Add bubble
                const bubble = addMessage(stepData.text, 'peer', {
                    voiceNote: stepData.voiceNote,
                    duration: stepData.duration,
                    reactions: stepData.reactions,
                    edited: stepData.edited
                });

                if (stepData.isOutcome) {
                    renderOutcomeControls(stepData);
                } else {
                    renderOptions(stepData.options);
                }
            });
        }
    }

    function renderOptions(options) {
        chatOptionsContainer.innerHTML = '';
        if (!options || options.length === 0) {
            // Outcome resolution
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = 'Finish Level & View Reflection';
            btn.addEventListener('click', () => {
                finishLevel();
            });
            chatOptionsContainer.appendChild(btn);
            return;
        }

        options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => {
                selectOption(opt, idx);
            });
            chatOptionsContainer.appendChild(btn);
        });
    }

    function selectOption(opt, optIdx) {
        // Freeze options
        chatOptionsContainer.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

        // Append user bubble to chat list immediately
        const userBubble = addMessage(opt.text, 'user');

        // Save history state (for rewinding)
        chatHistory.push({
            stepKey: currentStep,
            meters: { ...meters },
            userBubble: userBubble,
            optionSelected: opt
        });

        activeOption = opt;

        // Apply impact changes to state meters
        Object.keys(opt.impact).forEach(key => {
            meters[key] = Math.max(0, Math.min(100, meters[key] + opt.impact[key]));
        });

        // Update visual meters in sidebar
        updateVisualMeters();

        // Populate perspective reveal overlay details
        revealTextSaid.textContent = opt.text;
        revealTextMeant.textContent = opt.intent;
        revealTextHeard.textContent = opt.heard;
        revealTextExplanation.textContent = opt.explanation || "Why the intention and impact differ...";

        if (opt.warning) {
            contextWarningBox.style.display = 'block';
            contextWarningText.textContent = opt.warning;
        } else {
            contextWarningBox.style.display = 'none';
        }

        // Show Perspective Panel, Hide normal chat options controls
        chatControls.style.display = 'none';
        perspectiveRevealOverlay.style.display = 'flex';
    }

    // Set up Perspective Reveal Buttons
    if (revealRewindBtn) {
        revealRewindBtn.addEventListener('click', () => {
            handleRewind();
        });
    }

    if (revealContinueBtn) {
        revealContinueBtn.addEventListener('click', () => {
            handleContinue();
        });
    }

    function handleRewind() {
        if (chatHistory.length === 0) return;
        const lastState = chatHistory.pop();

        // Restore step key
        currentStep = lastState.stepKey;

        // Restore meters values
        meters = { ...lastState.meters };
        updateVisualMeters();

        // Delete user bubble element from DOM
        if (lastState.userBubble) {
            lastState.userBubble.remove();
        }

        // Hide panel, restore controls
        perspectiveRevealOverlay.style.display = 'none';
        chatControls.style.display = 'block';

        // Re-render choices for active step
        const stepData = scenarios[currentLevel].steps[currentStep];
        renderOptions(stepData.options);
    }

    function handleContinue() {
        if (!activeOption) return;
        const next = activeOption.nextStep;
        currentStep = next;
        activeOption = null;
        renderStep(currentStep);
    }

    function addMessage(text, speaker, options = {}) {
        const bubble = document.createElement('div');

        if (speaker === 'peer') {
            bubble.className = 'chat-bubble peer';

            if (options.voiceNote) {
                bubble.innerHTML = `
                    <div class="voice-note-container">
                        <button class="voice-note-play-btn" aria-label="Play voice note">▶</button>
                        <div class="voice-note-waveform">
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                            <div class="waveform-bar"></div>
                        </div>
                        <span class="voice-note-duration">${options.duration}</span>
                    </div>
                `;

                // Add animated waveform simulation
                bubble.querySelector('.voice-note-play-btn').addEventListener('click', (e) => {
                    const playBtn = e.currentTarget;
                    const isPlaying = playBtn.textContent === '⏸';
                    const bars = bubble.querySelectorAll('.waveform-bar');

                    if (isPlaying) {
                        playBtn.textContent = '▶';
                        clearInterval(playBtn.intervalId);
                    } else {
                        playBtn.textContent = '⏸';
                        let index = 0;
                        playBtn.intervalId = setInterval(() => {
                            bars.forEach(b => b.classList.remove('active'));
                            for (let i = 0; i <= index; i++) {
                                if (bars[i]) bars[i].classList.add('active');
                            }
                            index = (index + 1) % (bars.length + 1);
                        }, 150);

                        setTimeout(() => {
                            playBtn.textContent = '▶';
                            clearInterval(playBtn.intervalId);
                            bars.forEach(b => b.classList.remove('active'));
                        }, 3000);
                    }
                });
            } else {
                bubble.textContent = text;
            }

            if (options.reactions && options.reactions.length > 0) {
                const reactBadge = document.createElement('div');
                reactBadge.className = 'message-reaction';
                reactBadge.textContent = options.reactions.join(' ');
                bubble.appendChild(reactBadge);
            }

            if (options.edited) {
                const editLabel = document.createElement('span');
                editLabel.className = 'edited-tag';
                editLabel.textContent = 'edited';
                bubble.appendChild(editLabel);
            }

        } else if (speaker === 'user') {
            bubble.className = 'chat-bubble user';
            bubble.textContent = text;
        } else {
            // Narrative Outcome outcome banner
            bubble.className = 'chat-bubble info-bubble';
            bubble.textContent = text;
        }

        chatMessagesContainer.appendChild(bubble);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        return bubble;
    }

    function showTypingIndicator(callback) {
        const typing = document.createElement('div');
        typing.className = 'chat-bubble peer typing-bubble';
        typing.id = 'wtrh-typing-indicator';
        typing.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessagesContainer.appendChild(typing);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        setTimeout(() => {
            const indicator = document.getElementById('wtrh-typing-indicator');
            if (indicator) indicator.remove();
            callback();
        }, 1200);
    }

    function renderOutcomeControls(stepData) {
        chatOptionsContainer.innerHTML = '';

        // Output narrative box outcome text
        addMessage(stepData.outcomeText, 'info');

        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = 'Finish Level & View Reflection';
        btn.addEventListener('click', () => {
            finishLevel(stepData.outcomeType, stepData.outcomeText);
        });
        chatOptionsContainer.appendChild(btn);
    }

    function finishLevel(outcomeType, outcomeText) {
        wtrhWorkspace.style.display = 'none';
        completionScreen.style.display = 'block';

        // Analyze meters values to output reflection
        const isSuccess = outcomeType === 'success';
        completionIcon.textContent = isSuccess ? '🕯️' : '🌱';
        completionTitle.textContent = isSuccess ? `Level ${currentLevel} Completed Successfully!` : `Level ${currentLevel} Completed - Reflection Time`;

        // Define active profile based on maximum scores
        let dominantTrait = "Empathetic Listener";
        let maxVal = -1;

        const traitLabels = {
            listening: "Active Listener",
            curiosity: "Inquisitive Companion",
            validation: "Validating Ally",
            empathy: "Compassionate Partner",
            problem_solving: "Action-Oriented Solver",
            assumptions: "Mind Reader"
        };

        Object.keys(meters).forEach(key => {
            if (meters[key] > maxVal) {
                maxVal = meters[key];
                dominantTrait = traitLabels[key];
            }
        });

        completionScore.textContent = `Your Dominant Style: ${dominantTrait}`;

        // Local attempts tracking
        let localAttempts = localStorage.getItem('local-attempts-count');
        localAttempts = localAttempts ? parseInt(localAttempts) + 1 : 1;
        localStorage.setItem('local-attempts-count', localAttempts);

        let localSuccess = localStorage.getItem('local-attempts-success');
        localSuccess = localSuccess ? parseInt(localSuccess) : 0;
        if (outcomeType === 'success') {
            localSuccess += 1;
            localStorage.setItem('local-attempts-success', localSuccess);
        }

        // Insert attempt log into Supabase if configured
        if (supabaseClient) {
            supabaseClient
                .from('simulator_attempts')
                .insert([
                    {
                        level: currentLevel,
                        outcome: outcomeType || 'completed',
                        dominant_style: dominantTrait
                    }
                ])
                .then(({ error }) => {
                    if (error) console.error('Error logging simulator attempt to Supabase:', error.message);
                });
        }

        // Render simple scores lists summary
        completionMetersSummary.innerHTML = '';
        Object.keys(meters).forEach(key => {
            const stat = document.createElement('div');
            stat.className = 'completion-stat';
            stat.innerHTML = `
                <span class="completion-stat-val">${meters[key]}%</span>
                <span class="completion-stat-lbl">${key.replace('_', ' ')}</span>
            `;
            completionMetersSummary.appendChild(stat);
        });

        // Set detailed completion response paragraphs
        if (isSuccess) {
            completionDesc.textContent = `Excellent job! By focusing on validation and active listening rather than pushing solutions, you successfully supported your friend. Your emotional meters reflect high empathy. Keep using these skills in real life!`;
        } else {
            completionDesc.textContent = `This scenario ended in disconnection. Rushing to solve the problem or minimizing their pain made them pull away. But communication is a skill: use the 'Rewind' option or retry the level to explore alternative outcomes and learn how context changes their interpretations.`;
        }

        // Toggle Next Level buttons state
        if (currentLevel < 4) {
            completionNextLevelBtn.style.display = 'inline-block';
            completionNextLevelBtn.onclick = () => {
                startLevel(currentLevel + 1);
            };
        } else {
            completionNextLevelBtn.style.display = 'none';
        }
    }

    // Set completion screens actions
    if (completionReplayBtn) {
        completionReplayBtn.addEventListener('click', () => {
            startLevel(currentLevel);
        });
    }

    if (completionExitBtn) {
        completionExitBtn.addEventListener('click', () => {
            exitToLevelSelection();
        });
    }

    // Quiz section removed


    /* ==========================================================================
       6. ANONYMOUS SURVEY FORM VALIDATION
       ========================================================================== */
    const surveyForm = document.getElementById('anonymous-survey-form');
    const surveyQ1 = document.getElementById('survey-q1');
    const surveyQ2 = document.getElementById('survey-q2');
    const surveySuccessToast = document.getElementById('survey-success-toast');

    function validateField(inputElement, errorElement, checkCondition) {
        if (checkCondition) {
            inputElement.classList.add('invalid');
            if (errorElement) errorElement.style.display = 'block';
            return false;
        } else {
            inputElement.classList.remove('invalid');
            if (errorElement) errorElement.style.display = 'none';
            return true;
        }
    }

    if (surveyForm) {
        surveyForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isQ1Valid = validateField(surveyQ1, document.getElementById('error-q1'), surveyQ1.value.trim() === '');
            const isQ2Valid = validateField(surveyQ2, document.getElementById('error-q2'), surveyQ2.value.trim() === '');

            if (isQ1Valid && isQ2Valid) {
                const q1Value = surveyQ1.value.trim();
                const q2Value = surveyQ2.value.trim();

                // Async submission to Supabase
                if (supabaseClient) {
                    try {
                        const { error } = await supabaseClient
                            .from('survey_responses')
                            .insert([
                                { q1_answer: q1Value, q2_answer: q2Value }
                            ]);
                        if (error) throw error;
                        console.log('Anonymous survey response stored in database.');
                    } catch (dbErr) {
                        console.error('Database insertion failed:', dbErr.message);
                    }
                } else {
                    console.log('Supabase client not configured. Saving locally (mock):', { q1_answer: q1Value, q2_answer: q2Value });
                    let localResponses = localStorage.getItem('mock-survey-responses');
                    localResponses = localResponses ? JSON.parse(localResponses) : [];
                    const nextId = localResponses.reduce((max, item) => Math.max(max, item.id), 100) + 1;
                    localResponses.unshift({
                        id: nextId,
                        created_at: new Date().toISOString(),
                        q1_answer: q1Value,
                        q2_answer: q2Value
                    });
                    localStorage.setItem('mock-survey-responses', JSON.stringify(localResponses));
                }

                // Show success message
                if (surveySuccessToast) {
                    surveySuccessToast.style.display = 'block';
                    setTimeout(() => {
                        surveySuccessToast.style.display = 'none';
                    }, 5000);
                }
                surveyForm.reset();
            }
        });

        // Add blur listeners for real-time validation feedback
        if (surveyQ1) {
            surveyQ1.addEventListener('blur', (e) => {
                validateField(e.target, document.getElementById('error-q1'), e.target.value.trim() === '');
            });
        }
        if (surveyQ2) {
            surveyQ2.addEventListener('blur', (e) => {
                validateField(e.target, document.getElementById('error-q2'), e.target.value.trim() === '');
            });
        }
    }



    /* ==========================================================================
       8. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once reveal trigger executes
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers: show elements immediately
        revealElements.forEach(el => {
            el.classList.add('visible');
        });
    }

    /* ==========================================================================
       9. THE SUPPORT METER - INTERACTIVE GAME ENGINE
       ========================================================================== */
    let smScenarios = {
        1: {
            friendName: "Sameer",
            avatar: "👤",
            background: "Sameer failed his math quiz despite studying and is feeling discouraged.",
            peerMessage: "I'm failing everything. I studied for 4 hours last night and still flunked the math quiz. I just feel stupid.",
            options: [
                {
                    text: "Here's a study plan that might help. We can use my notes.",
                    category: "fixing",
                    angle: 35,
                    why: "You immediately jumped to solving the problem with a study plan, which bypasses Sameer's feelings of being 'stupid'.",
                    well: "Proactive and shows you are willing to spend your own time to help him study.",
                    miss: "It doesn't address his hit to his confidence. He might feel like a failure who needs a chore plan rather than a friend who understands his frustration.",
                    alt: "That sounds really overwhelming. You worked so hard last night, it must be so frustrating to see that result."
                },
                {
                    text: "You should really talk to the math teacher and see if you can get extra credit.",
                    category: "advising",
                    angle: 90,
                    why: "You gave advice on next steps ('talk to teacher') without validating how discouraging it is to fail.",
                    well: "Offers logical, actionable next steps to help him improve his grade.",
                    miss: "It jumps past his immediate pain. When someone is in self-doubt, advice can feel like a lecture on what they did wrong.",
                    alt: "Ugh, that really sucks. You worked so hard too. Let's take a look at it together later, but for now, take it easy."
                },
                {
                    text: "That sounds really overwhelming. You worked so hard last night, it must be so frustrating to see that result.",
                    category: "supporting",
                    angle: 145,
                    why: "You validated his hard work, mirrored his emotional state, and opened space for him to share without offering a quick fix.",
                    well: "Validates his effort, makes him feel heard, and removes the shame of failing.",
                    miss: "It doesn't directly fix the grade itself, but it builds the emotional trust needed before problem-solving.",
                    alt: null
                }
            ]
        },
        2: {
            friendName: "Meera",
            avatar: "👧",
            background: "Meera sends a voice note sharing her high levels of constant stress and anxiety.",
            peerMessage: "🔊 Voice Note (0:22): 'I don't know why I'm so stressed all the time. My skin is breaking out, I'm not sleeping, and my heart feels like it's racing. I feel like I'm constantly on edge.'",
            options: [
                {
                    text: "Have you tried downloading that meditation app, Calm? It really helped me with my anxiety.",
                    category: "advising",
                    angle: 90,
                    why: "Recommending an app is helpful, but doing it immediately is advice that might feel like homework rather than support.",
                    well: "Shares a practical personal tool that has worked in the past.",
                    miss: "Focuses on quick anxiety relief tips rather than sitting with her and asking what's creating the stress.",
                    alt: "That sounds exhausting. What do you think is causing all this stress lately?"
                },
                {
                    text: "Let's go for a walk right now. Exercise decreases cortisol. I'm coming to pick you up.",
                    category: "fixing",
                    angle: 35,
                    why: "You took control of her schedule and actioned a solution immediately, bypassing her agency.",
                    well: "Strong, proactive action that shows deep care and effort to help her feel better.",
                    miss: "Can feel bossy or overwhelming when someone is already stressed out and has low energy.",
                    alt: "Would it help to get out of the house for a bit? We could go for a walk, or just sit somewhere quiet."
                },
                {
                    text: "I can hear how exhausting that is in your voice. Constantly feeling on edge is so draining. I'm here for you.",
                    category: "supporting",
                    angle: 145,
                    why: "You noticed the distress in her voice, validated the physical toll of stress, and offered presence.",
                    well: "Connects emotionally, validates the exhaustion, and avoids pressure to change her mood.",
                    miss: "It does not provide immediate physical solutions, but it helps lower her defenses.",
                    alt: null
                }
            ]
        },
        3: {
            friendName: "Kabir",
            avatar: "👦",
            background: "Kabir posts a self-deprecating Close Friends story feeling ignored in the group chat.",
            peerMessage: "📲 Close Friends Story: 'I feel like nobody would notice if I disappeared from the group chat. I talk and everyone just scrolls past my texts.'",
            options: [
                {
                    text: "I'm sorry you feel that way! We definitely notice you. I'll make sure to reply to your text next time.",
                    category: "advising",
                    angle: 90,
                    why: "Offering a promise of future action to 'fix' it is a mix of reassurance and advising, which can feel like pity.",
                    well: "Reassures him that he is seen, and promises better inclusion in the future.",
                    miss: "Reassuring him too quickly might make him feel like he was being dramatic or that you are replying out of obligation.",
                    alt: "Hey, I saw your story. That sucks to feel invisible. I'm really sorry if we've been making you feel that way."
                },
                {
                    text: "I'll text in the group chat right now and tell them we need to be more responsive to each other.",
                    category: "fixing",
                    angle: 35,
                    why: "Taking control and organizing a group talk is a massive fix that might embarrass Kabir and violate his confidence.",
                    well: "Proactive advocacy and standing up for your friend's inclusion.",
                    miss: "Risks blowing the issue up and creating group drama, making him regret sharing in the first place.",
                    alt: "That's a really lonely feeling, Kabir. Did something specific happen in the chat today that felt off?"
                },
                {
                    text: "That sounds like a really lonely feeling, Kabir. I know the group chat can get chaotic, but feeling ignored by your friends is awful. I'm sorry.",
                    category: "supporting",
                    angle: 145,
                    why: "You named the emotion ('lonely'), validated the hurt of being ignored by friends, and apologized without making excuses.",
                    well: "Takes relational responsibility, validates the hurt directly, and avoids making excuses about chat busy-ness.",
                    miss: "It doesn't change the group chat behavior immediately, but it repairs the direct relationship.",
                    alt: null
                }
            ]
        },
        4: {
            friendName: "Zara",
            avatar: "👧",
            background: "Zara is stressed by her parents comparing her to her cousin who got into IIT.",
            peerMessage: "Zara: My parents keep comparing me to my cousin who got into IIT. They literally won't talk about anything else at dinner. I feel like I'm invisible in my own house.",
            options: [
                {
                    text: "You should tell them how much that hurts you. Communication is key.",
                    category: "advising",
                    angle: 90,
                    why: "Telling someone to confront their parents is highly direct advice, which ignores the power dynamic in an Indian household.",
                    well: "Encourages Zara to practice healthy communication and speak her truth.",
                    miss: "Overlooks how scary and difficult confronting parents can be. It shifts the burden of solving the family dynamic to Zara.",
                    alt: "That must feel incredibly isolating. To feel compared and overlooked in your own home is a really heavy burden. I'm here."
                },
                {
                    text: "Just ignore them. They are just old school. Focus on your own goals.",
                    category: "fixing",
                    angle: 35,
                    why: "Trying to 'solve' her pain by telling her to 'ignore' it is a minimization attempt that shuts down her venting.",
                    well: "Attempts to build resilience and keep Zara focused on her long-term goals.",
                    miss: "Dismisses the everyday pain of eating dinner in silence. She can't easily 'ignore' her own parents.",
                    alt: "That must feel incredibly isolating. To feel compared and overlooked in your own home is a really heavy burden. I'm here."
                },
                {
                    text: "That must feel incredibly isolating. To feel compared and overlooked in your own home is a really heavy burden. I'm here.",
                    category: "supporting",
                    angle: 145,
                    why: "You validated her sense of isolation and acknowledged the weight of parental comparison without giving simple instructions.",
                    well: "Validates isolation, acknowledges the cultural/familial weight, and offers presence without unsolicited advice.",
                    miss: "It doesn't solve the parental pressure, but it reminds Zara that she is valued on her own terms.",
                    alt: null
                }
            ]
        }
    };

    // State Variables
    let smCurrentLevel = 1;
    let smSelectedOptions = [];
    let smCategoryCounts = {
        supporting: 0,
        advising: 0,
        fixing: 0
    };
    let smActiveOption = null;
    let smUserBubble = null;

    // DOM Elements
    const smLevelVal = document.getElementById('sm-level-val');
    const smProgressDots = document.getElementById('sm-progress-dots');
    const smComboVal = document.getElementById('sm-combo-val');
    const smAvatar = document.getElementById('sm-avatar');
    const smName = document.getElementById('sm-name');
    const smStatus = document.getElementById('sm-status');
    const smChatLog = document.getElementById('sm-chat-log');
    const smChoicesCard = document.getElementById('sm-choices-card');
    const smChoicesContainer = document.getElementById('sm-choices-container');
    const smRevealCard = document.getElementById('sm-reveal-card');
    const smNeedle = document.getElementById('sm-needle');
    const smMeterIndicator = document.getElementById('sm-meter-indicator');
    const smReflectionDetails = document.getElementById('sm-reflection-details');
    const smRefWhy = document.getElementById('sm-ref-why');
    const smRefWell = document.getElementById('sm-ref-well');
    const smRefMiss = document.getElementById('sm-ref-miss');
    const smRefAltBlock = document.getElementById('sm-ref-alt-block');
    const smRefAlt = document.getElementById('sm-ref-alt');
    const smRetryBtn = document.getElementById('sm-retry-btn');
    const smNextBtn = document.getElementById('sm-next-btn');
    const smReplayAllBtn = document.getElementById('sm-replay-all-btn');
    const smReportCard = document.getElementById('sm-report-card');

    // Report Card Elements
    const smReportProfileTag = document.getElementById('sm-report-profile-tag');
    const smReportProfileDesc = document.getElementById('sm-report-profile-desc');
    const smPctSupporting = document.getElementById('sm-pct-supporting');
    const smPctAdvising = document.getElementById('sm-pct-advising');
    const smPctFixing = document.getElementById('sm-pct-fixing');
    const smBarSupporting = document.getElementById('sm-bar-supporting');
    const smBarAdvising = document.getElementById('sm-bar-advising');
    const smBarFixing = document.getElementById('sm-bar-fixing');
    const smReportStrengths = document.getElementById('sm-report-strengths');
    const smReportBlindspots = document.getElementById('sm-report-blindspots');
    const smReportSuggestions = document.getElementById('sm-report-suggestions');

    function smStartGame() {
        smCurrentLevel = 1;
        smSelectedOptions = [];
        smCategoryCounts = {
            supporting: 0,
            advising: 0,
            fixing: 0
        };
        smActiveOption = null;
        smUserBubble = null;

        // Reset Display Toggles
        smChoicesCard.style.display = 'flex';
        smRevealCard.style.display = 'none';
        smReportCard.style.display = 'none';

        // Show mock phone layouts
        document.querySelector('.game-scenario-pane').style.display = 'block';
        document.querySelector('.game-interaction-pane').style.display = 'block';

        // Reset Needle rotation
        smNeedle.style.transform = 'rotate(0deg)';
        smMeterIndicator.className = 'meter-text-indicator';
        smMeterIndicator.textContent = 'Evaluating response...';
        smReflectionDetails.style.opacity = '0';

        // Load Level 1
        smLoadLevel(1);
    }

    function smLoadLevel(lvlNum) {
        smCurrentLevel = lvlNum;
        const data = smScenarios[lvlNum];
        if (!data) return;

        // Update indicators
        smLevelVal.textContent = `Level ${lvlNum}`;
        smAvatar.textContent = data.avatar;
        smName.textContent = data.friendName;
        smStatus.textContent = 'Online';
        smChatLog.innerHTML = '';

        // Update Dots Progress Bar
        const dots = smProgressDots.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.className = 'dot';
            if (idx + 1 === lvlNum) {
                dot.classList.add('active');
            } else if (idx + 1 < lvlNum) {
                dot.classList.add('completed');
            }
        });

        smUpdateStyleProfile();

        // Simulate receiving friend message
        smStatus.textContent = 'typing...';
        setTimeout(() => {
            smStatus.textContent = 'Online';

            // Check for social post level vs chat bubble
            if (lvlNum === 3) {
                const post = document.createElement('div');
                post.className = 'sm-social-post';
                post.innerHTML = `
                    <div class="sm-post-header">
                        <div class="sm-post-avatar">👦</div>
                        <div>
                            <span class="sm-post-author">${data.friendName}</span>
                            <span class="sm-post-handle">@kabir_k</span>
                        </div>
                    </div>
                    <div class="sm-post-content">${data.peerMessage.replace("📲 Close Friends Story: ", "")}</div>
                    <div class="sm-post-footer">
                        <span>❤️ 12 likes</span>
                        <span>💬 Close Friends Only</span>
                    </div>
                `;
                smChatLog.appendChild(post);
            } else {
                const bubble = document.createElement('div');
                bubble.className = 'sm-bubble peer';
                bubble.textContent = data.peerMessage;
                smChatLog.appendChild(bubble);
            }
            smChatLog.scrollTop = smChatLog.scrollHeight;

            smRenderChoices(data.options);
        }, 800);
    }

    function smRenderChoices(options) {
        smChoicesContainer.innerHTML = '';
        options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => smSelectOption(opt, idx));
            smChoicesContainer.appendChild(btn);
        });
    }

    function smSelectOption(opt, optIdx) {
        smActiveOption = opt;

        // Disable choices list
        smChoicesContainer.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);

        // Append user bubble to chat log
        const userBubble = document.createElement('div');
        userBubble.className = 'sm-bubble user';
        userBubble.textContent = opt.text;
        smChatLog.appendChild(userBubble);
        smChatLog.scrollTop = smChatLog.scrollHeight;

        smUserBubble = userBubble;

        // Hide choices, show gauge reveal card
        smChoicesCard.style.display = 'none';
        smRevealCard.style.display = 'flex';

        // Reset landing indicators
        smNeedle.style.transform = 'rotate(0deg)';
        smMeterIndicator.className = 'meter-text-indicator';
        smMeterIndicator.textContent = 'Analyzing choice...';
        smReflectionDetails.style.opacity = '0';

        // Remove active class from SVG sectors
        const gaugeSvg = document.querySelector('.gauge-svg');
        gaugeSvg.querySelectorAll('.arc-sector').forEach(arc => arc.classList.remove('active'));

        // Swing Needle to landing angle
        setTimeout(() => {
            smNeedle.style.transform = `rotate(${opt.angle}deg)`;

            // Haptic-style scale trigger on game box
            const gameBox = document.querySelector('.support-meter-game-box');
            gameBox.classList.remove('haptic-shake');
            void gameBox.offsetWidth; // trigger reflow
            gameBox.classList.add('haptic-shake');

            // Highlight sector and reflect
            setTimeout(() => {
                smMeterIndicator.textContent = opt.category;
                smMeterIndicator.classList.add(opt.category);

                const activeArc = gaugeSvg.querySelector(`.sm-arc-${opt.category}`);
                if (activeArc) activeArc.classList.add('active');

                // Pop details
                smRefWhy.textContent = opt.why;
                smRefWell.textContent = opt.well;
                smRefMiss.textContent = opt.miss;

                if (opt.alt) {
                    smRefAltBlock.style.display = 'block';
                    smRefAlt.textContent = opt.alt;
                } else {
                    smRefAltBlock.style.display = 'none';
                }

                smReflectionDetails.style.opacity = '1';
            }, 1000); // Trigger mid-swing
        }, 200);
    }

    function smRewindChoice() {
        if (!smActiveOption) return;

        smChoicesContainer.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);

        if (smUserBubble) {
            smUserBubble.remove();
            smUserBubble = null;
        }

        smChoicesCard.style.display = 'flex';
        smRevealCard.style.display = 'none';
        smNeedle.style.transform = 'rotate(0deg)';

        smActiveOption = null;
    }

    function smNextScenario() {
        if (!smActiveOption) return;

        smSelectedOptions.push(smActiveOption);
        smCategoryCounts[smActiveOption.category]++;

        smActiveOption = null;

        if (smCurrentLevel < 4) {
            smChoicesCard.style.display = 'flex';
            smRevealCard.style.display = 'none';
            smLoadLevel(smCurrentLevel + 1);
        } else {
            smShowReport();
        }
    }

    function smUpdateStyleProfile() {
        if (smSelectedOptions.length === 0) {
            smComboVal.textContent = 'Evaluating...';
            return;
        }
        const profile = smCalculateProfile();
        smComboVal.textContent = profile.tag;
    }

    function smCalculateProfile() {
        const counts = smCategoryCounts;
        const total = smSelectedOptions.length;

        let tag = "The Helper";
        let desc = "You adjust your communication style dynamically, mixing listening, advising, and action depending on the friend's context.";
        let strengths = "Highly adaptable, versatile, and context-aware.";
        let blindspots = "You might occasionally send mixed signals if you shift styles too rapidly.";
        let suggestions = "Keep noticing context! Be explicit about your support role (e.g., 'I'm here to listen, or help you figure it out—whatever you need').";

        if (counts.supporting >= 3) {
            tag = "The Listener";
            desc = "You prioritize listening and validation. You excel at making friends feel safe, heard, and less alone during tough times, without imposing your own solutions.";
            strengths = "Exceptional empathy, patience, and non-judgmental presence.";
            blindspots = "You might sometimes hold back practical help or feedback even when a friend is ready and looking for direction.";
            suggestions = "Continue offering validation. If a friend asks 'What should I do?', feel confident to gently transition into sharing ideas or next steps together.";
        } else if (counts.fixing >= 2) {
            tag = "The Problem Solver";
            desc = "You are action-oriented and hate seeing your friends in pain. You immediately jump into fixing mode to resolve whatever is causing them distress.";
            strengths = "Proactive, reliable, and highly solution-focused.";
            blindspots = "You risk running past a friend's feelings. If they don't feel validated first, solutions can feel like homework or pressure.";
            suggestions = "Before proposing a fix (like study schedules or exercise), spend the first few messages validating how they feel (e.g. 'That sounds really hard'). Connect first, solve later.";
        } else if (counts.advising >= 2) {
            tag = "The Coach";
            desc = "You love giving guidance, suggestions, and recommendations to help your friends navigate their paths.";
            strengths = "Encourages agency, shares resources, and offers clear next steps.";
            blindspots = "Advice can feel like a lecture when someone is in deep pain or overwhelm. They might feel like they are being instructed rather than heard.";
            suggestions = "Always ask for permission before offering advice (e.g., 'Do you want to talk options, or do you just need to vent?').";
        } else if (counts.supporting >= 2 && counts.advising >= 1) {
            tag = "The Encourager";
            desc = "You strike a beautiful balance between active listening and motivating your friends to move forward.";
            strengths = "Compassionate validation blended with supportive encouragement.";
            blindspots = "You may occasionally normalize a friend's struggle too quickly in an attempt to motivate them.";
            suggestions = "Ensure they feel heard in their disappointment before nudging them toward the positive next steps.";
        }

        return { tag, desc, strengths, blindspots, suggestions };
    }

    function smShowReport() {
        const profile = smCalculateProfile();

        // Hide game rows
        document.querySelector('.game-scenario-pane').style.display = 'none';
        document.querySelector('.game-interaction-pane').style.display = 'none';

        // Populate profiles details
        smReportProfileTag.textContent = profile.tag;
        smReportProfileDesc.textContent = profile.desc;
        smReportStrengths.textContent = profile.strengths;
        smReportBlindspots.textContent = profile.blindspots;
        smReportSuggestions.textContent = profile.suggestions;

        // Percentage counts
        const total = 4;
        const pctSupporting = Math.round((smCategoryCounts.supporting / total) * 100);
        const pctAdvising = Math.round((smCategoryCounts.advising / total) * 100);
        const pctFixing = Math.round((smCategoryCounts.fixing / total) * 100);

        smPctSupporting.textContent = `${pctSupporting}%`;
        smPctAdvising.textContent = `${pctAdvising}%`;
        smPctFixing.textContent = `${pctFixing}%`;

        // Expand breakdown width fills
        setTimeout(() => {
            smBarSupporting.style.width = `${pctSupporting}%`;
            smBarAdvising.style.width = `${pctAdvising}%`;
            smBarFixing.style.width = `${pctFixing}%`;
        }, 200);

        smReportCard.style.display = 'block';
    }

    // Set up button triggers
    if (smRetryBtn) {
        smRetryBtn.addEventListener('click', smRewindChoice);
    }
    if (smNextBtn) {
        smNextBtn.addEventListener('click', smNextScenario);
    }
    if (smReplayAllBtn) {
        smReplayAllBtn.addEventListener('click', smStartGame);
    }

    async function loadCmsConfigAndApply() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('cms_config')
                    .select('config')
                    .eq('id', 1)
                    .single();
                if (error) {
                    console.error('Supabase CMS load query failed:', error.message, error.details, error.hint);
                } else if (data && data.config) {
                    localStorage.setItem('lighthouse-cms-config', JSON.stringify(data.config));
                    applyDynamicCMSConfig();
                    if (typeof smStartGame === 'function') {
                        smStartGame();
                    }
                }
            } catch (err) {
                console.warn('Supabase CMS load failed:', err);
            }
        }
    }

    // Apply customized content overrides before starting game engines
    applyDynamicCMSConfig();

    // Auto-init Support Meter Game on load
    smStartGame();

    // Load latest CMS config from Supabase in background
    loadCmsConfigAndApply();

});
