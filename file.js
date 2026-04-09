/* 
====================================
PREMIUM MINIMAL PORTFOLIO
JavaScript Interactions
====================================
*/

(function() {
    'use strict';

    /* ================================
       CUSTOM CURSOR
       ================================ */
    
    const cursor = document.getElementById('cursor');
    
    if (cursor && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor follow
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.15;
            cursorY += dy * 0.15;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .project');
        
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            target.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }


    /* ================================
       THEME TOGGLE
       ================================ */
    
    const themeBtn = document.getElementById('themeBtn');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or use system preference
    function getTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return prefersDark.matches ? 'dark' : 'light';
    }
    
    // Apply theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    // Initialize
    setTheme(getTheme());
    
    // Toggle on click
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }
    
    // Listen for system changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });


    /* ================================
       NAVIGATION
       ================================ */
    
    const nav = document.getElementById('nav');
    const navMobileBtn = document.getElementById('navMobileBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    // Sticky nav on scroll
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (navMobileBtn && mobileMenu) {
        navMobileBtn.addEventListener('click', () => {
            navMobileBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close on link click
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                navMobileBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNav() {
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);
    highlightNav();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    /* ================================
       SCROLL ANIMATIONS
       ================================ */
    
    const animateElements = document.querySelectorAll(
        '.section-header, .project, .about-content, .contact-content'
    );
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => observer.observe(el));


    /* ================================
       METRICS COUNTER
       ================================ */
    
    const metrics = document.querySelectorAll('.metric-value[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const suffix = el.dataset.suffix || '';
                const duration = 2000;
                const start = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    
                    el.textContent = current.toLocaleString() + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }
                
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    metrics.forEach(el => counterObserver.observe(el));


    /* ================================
       ROTATING WORDS
       ================================ */
    
    const rotatingWord = document.getElementById('rotatingWord');
    
    if (rotatingWord) {
        const words = ['grow', 'connect', 'innovate', 'thrive'];
        let currentIndex = 0;
        
        function rotateWord() {
            rotatingWord.style.opacity = '0';
            rotatingWord.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % words.length;
                rotatingWord.textContent = words[currentIndex];
                rotatingWord.style.opacity = '1';
                rotatingWord.style.transform = 'translateY(0)';
            }, 300);
        }
        
        // Add transition styles
        rotatingWord.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        rotatingWord.style.display = 'inline-block';
        
        setInterval(rotateWord, 3000);
    }


    /* ================================
       PROJECT MODALS
       ================================ */
    
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    const projectBtns = document.querySelectorAll('.project-btn[data-modal]');
    
    // Project data (replace with your actual content)
    const projectData = {
        project1: {
            category: 'Brand Strategy',
            title: 'Rebranding Campaign for Local Startup',
            metrics: [
                { value: '+40%', label: 'Brand Awareness' },
                { value: '+25%', label: 'Customer Growth' },
                { value: '3 mo', label: 'Timeline' }
            ],
            problem: `The client, a local tech startup, struggled with brand recognition 
                      in a crowded market. Their existing visual identity was inconsistent 
                      and failed to communicate their innovative approach to solving 
                      customer problems.`,
            process: [
                'Conducted comprehensive brand audit and competitive analysis',
                'Performed customer interviews and surveys to understand perception',
                'Developed new brand positioning and messaging framework',
                'Created refreshed visual identity including logo, colors, and typography',
                'Designed brand guidelines and trained internal team on implementation'
            ],
            results: `The rebrand launched to positive reception, with brand awareness 
                      increasing 40% within the first quarter. Customer acquisition improved 
                      by 25%, and the client reported higher quality leads citing the 
                      professional brand presence as a factor in their interest.`
        },
        project2: {
            category: 'Digital Marketing',
            title: 'Social Media Growth Strategy',
            metrics: [
                { value: '+180%', label: 'Engagement' },
                { value: '3x', label: 'Followers' },
                { value: '6 mo', label: 'Timeline' }
            ],
            problem: `A mid-size retail brand had stagnant social media presence with 
                      declining engagement. Their content strategy lacked consistency 
                      and failed to resonate with their target demographic.`,
            process: [
                'Analyzed existing content performance and audience demographics',
                'Researched competitor strategies and industry best practices',
                'Developed content pillars and monthly content calendar',
                'Created mix of educational, entertaining, and promotional content',
                'Implemented community management and engagement protocols'
            ],
            results: `Over six months, engagement rate increased by 180% and follower 
                      count tripled. The improved social presence contributed to a 15% 
                      increase in website traffic from social channels and measurable 
                      improvement in brand sentiment.`
        },
        project3: {
            category: 'Innovation',
            title: 'Product Launch Strategy',
            metrics: [
                { value: '150%', label: 'Sales Target' },
                { value: '$50K', label: 'Q1 Revenue' },
                { value: '8 wk', label: 'Launch Time' }
            ],
            problem: `A consumer goods company was launching a new product line but 
                      lacked a cohesive go-to-market strategy. Previous launches had 
                      underperformed due to poor positioning and timing.`,
            process: [
                'Conducted market research to identify target segments',
                'Developed positioning strategy and key messaging',
                'Created integrated marketing plan across digital and traditional channels',
                'Coordinated with sales team on launch timing and promotions',
                'Designed launch event and influencer partnership program'
            ],
            results: `The product launch exceeded first-quarter sales targets by 50%, 
                      generating $50K in revenue. The launch campaign earned media 
                      coverage and established the product as a category leader 
                      within its niche.`
        },
        project4: {
            category: 'Market Research',
            title: 'Consumer Insights Study',
            metrics: [
                { value: '500+', label: 'Responses' },
                { value: '$2M', label: 'Decision Impact' },
                { value: '12 wk', label: 'Timeline' }
            ],
            problem: `A company considering a major product development investment 
                      needed data-driven insights to validate the opportunity and 
                      inform feature prioritization.`,
            process: [
                'Designed mixed-method research approach (surveys + interviews)',
                'Developed survey instrument and recruited diverse participant pool',
                'Conducted 20 in-depth interviews with target customers',
                'Analyzed quantitative data using statistical methods',
                'Synthesized findings into actionable recommendations'
            ],
            results: `Research findings identified a previously unrecognized market 
                      segment with high purchase intent. Recommendations directly 
                      informed a $2M product development decision and helped 
                      prioritize features for maximum market impact.`
        }
    };
    
    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <p class="modal-category">${data.category}</p>
                <h2 class="modal-title">${data.title}</h2>
            </div>
            
            <div class="modal-metrics">
                ${data.metrics.map(m => `
                    <div class="modal-stat">
                        <span class="modal-stat-value">${m.value}</span>
                        <span class="modal-stat-label">${m.label}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="modal-section">
                <h3>The Problem</h3>
                <p>${data.problem}</p>
            </div>
            
            <div class="modal-section">
                <h3>The Process</h3>
                <ul>
                    ${data.process.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>The Results</h3>
                <p>${data.results}</p>
            </div>
        `;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    projectBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.modal));
    });
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

})();
