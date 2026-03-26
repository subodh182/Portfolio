document.addEventListener('DOMContentLoaded', () => {

    /* ===== PARTICLES.JS INIT ===== */
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#4f46e5", "#ec4899", "#6366f1"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#818cf8", "opacity": 0.3, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }

    /* ===== CUSTOM CURSOR (MAGNETIC & RIPPLE) ===== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
        });

        const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card, .blog-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
                el.classList.add('magnetic');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
                el.style.transform = 'translate(0px, 0px)';
            });
            el.addEventListener('mousemove', (e) => {
                if (el.classList.contains('magnetic') && el.tagName === 'BUTTON') {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                }
            });

            // Ripple
            el.addEventListener('click', function (e) {
                const ripple = document.createElement("span");
                ripple.classList.add("cursor-ripple");
                const rect = el.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    /* ===== LOADER & THEME TOGGLE ===== */
    const hideLoader = () => {
        const loader = document.getElementById('loader');
        if (loader && loader.style.display !== 'none') {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }, 800);
        }
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        // Fallback in case external resources fail to load completely
        setTimeout(hideLoader, 3000);
    }

    const themeToggle = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') { document.body.classList.remove('dark-theme'); lightIcon.style.display = 'none'; darkIcon.style.display = 'block'; } else { document.body.classList.add('dark-theme'); lightIcon.style.display = 'block'; darkIcon.style.display = 'none'; }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            lightIcon.style.display = isDark ? 'block' : 'none';
            darkIcon.style.display = isDark ? 'none' : 'block';
            updateChartTheme(isDark ? 'dark' : 'light');
        });
    }

    /* ===== TYPING ANIMATION ===== */
    const typingText = document.querySelector('.typing-text');
    const roles = ["Full Stack Developer", "AI Enthusiast", "Python Developer", "Tech Learner"];
    let roleIndex = 0, charIndex = 0, isDeleting = false;
    function type() {
        if (!typingText) return;
        const currentRole = roles[roleIndex];
        if (isDeleting) { typingText.textContent = currentRole.substring(0, charIndex - 1); charIndex--; }
        else { typingText.textContent = currentRole.substring(0, charIndex + 1); charIndex++; }
        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentRole.length) { typeSpeed = 2000; isDeleting = true; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; typeSpeed = 500; }
        setTimeout(type, typeSpeed);
    }
    if (typingText) { typingText.insertAdjacentHTML('afterend', '<span class="typing-cursor">|</span>'); setTimeout(type, 1000); }

    /* ===== NAVBAR SCROLL & ACTIVE STATE ===== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        let current = '';
        sections.forEach(sec => {
            if (scrollY >= (sec.offsetTop - sec.clientHeight / 3)) current = sec.getAttribute('id');
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) link.classList.add('active');
        });
    });

    const hamburger = document.querySelector('.hamburger');
    const navContainer = document.querySelector('.navbar');
    if (hamburger) hamburger.addEventListener('click', () => navContainer.classList.toggle('nav-active'));
    navLinks.forEach(link => link.addEventListener('click', () => navContainer.classList.remove('nav-active')));

    /* ===== SCROLL ANIMATIONS & CHART INIT ===== */
    let chartRendered = false;
    let skillsChartInstance = null;
    function updateChartTheme(theme) {
        if (!skillsChartInstance) return;
        const color = theme === 'dark' ? '#f8fafc' : '#0f172a';
        skillsChartInstance.options.scales.r.pointLabels.color = color;
        skillsChartInstance.options.scales.r.grid.color = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        skillsChartInstance.options.scales.r.angleLines.color = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        skillsChartInstance.update();
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                if (entry.target.classList.contains('skill-card')) {
                    const p = entry.target.querySelector('.progress');
                    if (p) p.style.width = p.getAttribute('data-width');
                }
                if (entry.target.classList.contains('section-text') && entry.target.querySelectorAll('.counter').length > 0) {
                    entry.target.querySelectorAll('.counter').forEach(count => {
                        count.innerText = '0';
                        const target = +count.getAttribute('data-target');
                        const inc = target / 50; let current = 0;
                        const update = () => { current += inc; if (current < target) { count.innerText = Math.ceil(current); setTimeout(update, 30); } else count.innerText = target; };
                        update();
                    });
                }
                if (entry.target.querySelector('#skillsChart') && !chartRendered) {
                    chartRendered = true;
                    const ctx = document.getElementById('skillsChart').getContext('2d');
                    const isDark = document.body.classList.contains('dark-theme');
                    skillsChartInstance = new Chart(ctx, {
                        type: 'radar',
                        data: {
                            labels: ['Python', 'JavaScript', 'Node.js', 'AI Tools', 'HTML/CSS', 'GitHub'],
                            datasets: [{
                                label: 'Proficiency',
                                data: [90, 85, 80, 75, 95, 90],
                                backgroundColor: 'rgba(99, 102, 241, 0.2)', borderColor: 'rgba(99, 102, 241, 1)', pointBackgroundColor: 'rgba(236, 72, 153, 1)'
                            }]
                        },
                        options: { responsive: true, scales: { r: { ticks: { display: false, min: 0, max: 100 } } }, plugins: { legend: { display: false } } }
                    });
                    updateChartTheme(isDark ? 'dark' : 'light');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    /* ===== GITHUB PROJECTS, MODALS & SEARCH ===== */
    let allProjects = [];
    async function fetchGitHubProjects() {
        const grid = document.getElementById('github-projects-grid');
        if (!grid) return;
        try {
            const response = await fetch('/api/github');
            const data = await response.json();
            if (data.success && data.projects.length > 0) {
                grid.innerHTML = '';
                allProjects = data.projects;
                renderProjects(allProjects);
            }
        } catch (err) { grid.innerHTML = '<p class="text-center" style="width:100%;">Failed to load projects.</p>'; }
    }

    function renderProjects(projectsToRender) {
        const grid = document.getElementById('github-projects-grid');
        grid.innerHTML = '';
        if (projectsToRender.length === 0) {
            grid.innerHTML = '<p class="text-center" style="width:100%;">No matches found.</p>';
            return;
        }
        projectsToRender.forEach((repo, index) => {
            const card = document.createElement('div');
            card.className = 'project-card animate-on-scroll show';
            card.style.transitionDelay = `${index * 0.1}s`;
            card.dataset.tech = repo.language || 'Code';
            card.dataset.name = repo.name;
            card.innerHTML = `
                <div class="project-img-placeholder" style="height:150px; cursor:pointer;" onclick="openCaseStudy('${repo.name}', '${repo.url}', '${repo.homepage || ''}', '${repo.default_branch}')">Read Case Study</div>
                <div class="project-info">
                    <h3 style="font-size:1.3rem;">${repo.name.replace(/-/g, ' ').toUpperCase()}</h3>
                    <p>${repo.description || 'A fascinating repository built with cutting-edge tech.'}</p>
                    <div class="project-tags"><span>${repo.language || 'Code'}</span><span>⭐ ${repo.stars}</span><span>🍴 ${repo.forks || 0}</span></div>
                    <div class="project-links mt-1">
                        <a href="${repo.url}" target="_blank" class="github-link">GitHub <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    }

    fetchGitHubProjects();

    const searchBar = document.getElementById('project-search-bar');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    function filterProjects() {
        const searchText = searchBar ? searchBar.value.toLowerCase() : '';
        const filtered = allProjects.filter(repo => {
            const matchSearch = repo.name.toLowerCase().includes(searchText) || (repo.description && repo.description.toLowerCase().includes(searchText)) || (repo.language && repo.language.toLowerCase().includes(searchText));
            const matchFilter = currentFilter === 'all' || (repo.language && repo.language.toLowerCase() === currentFilter);
            return matchSearch && matchFilter;
        });
        renderProjects(filtered);
    }

    if (searchBar) searchBar.addEventListener('input', filterProjects);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter').toLowerCase();
            filterProjects();
        });
    });

    // Case Study Modal
    const modal = document.getElementById('case-study-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalLive = document.getElementById('modal-live-btn');
    const modalRepo = document.getElementById('modal-repo-btn');
    const modalReadme = document.getElementById('modal-readme-box');

    window.openCaseStudy = async (name, url, liveUrl, branch) => {
        if (!modal) return;
        modal.classList.remove('hidden');
        modalTitle.textContent = name.replace(/-/g, ' ').toUpperCase();
        modalRepo.href = url;
        if (liveUrl && liveUrl !== 'null' && liveUrl !== 'undefined') { modalLive.href = liveUrl; modalLive.style.display = 'inline-flex'; }
        else { modalLive.style.display = 'none'; }

        modalReadme.innerHTML = '<div class="btn-loader"></div> Loading Case Study Insights...';

        try {
            const res = await fetch(`/api/github/readme?repo=${name}&branch=${branch}`);
            const data = await res.json();
            if (data.success) {
                // Extremely basic regex-based Markdown to HTML parser for display
                let html = data.readme
                    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
                    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' style='color:var(--primary); text-decoration:underline;'>$1</a>")
                    .replace(/\n$/gim, '<br />');
                modalReadme.innerHTML = html;
            } else {
                modalReadme.innerHTML = '<p>Case study notes (README) unavailable for this repository.</p>';
            }
        } catch (e) { modalReadme.innerHTML = '<p>Failed to parse case study data.</p>'; }
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => modal.classList.add('hidden'));

    /* ===== VOICE ASSISTANT (WEB SPEECH API) ===== */
    const voiceBtn = document.getElementById('voice-assistant-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotBody = document.getElementById('chatbot-body');

    if (voiceBtn && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.onstart = function () {
            voiceBtn.classList.add('voice-pulsing');
        };

        recognition.onresult = async function (event) {
            const transcript = event.results[0][0].transcript;
            voiceBtn.classList.remove('voice-pulsing');

            // Open chatbot to show what is happening
            chatbotWindow.classList.remove('hidden');
            const userBubble = document.createElement('div');
            userBubble.className = 'user-message bubble';
            userBubble.textContent = `🎤 ${transcript}`;
            chatbotBody.appendChild(userBubble);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;

            const botBubble = document.createElement('div');
            botBubble.className = 'bot-message bubble';
            botBubble.textContent = "Voice Processing...";
            chatbotBody.appendChild(botBubble);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: transcript })
                });
                const data = await response.json();
                const reply = data.response;
                botBubble.textContent = reply || "I didn't quite catch that.";

                // Speak back
                const utterance = new SpeechSynthesisUtterance(botBubble.textContent);
                utterance.rate = 1.1; // Make it sound snappier
                window.speechSynthesis.speak(utterance);
            } catch (err) { botBubble.textContent = "Error connecting to AI backend."; }
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        };

        recognition.onerror = function () { voiceBtn.classList.remove('voice-pulsing'); };

        voiceBtn.addEventListener('click', () => {
            window.speechSynthesis.cancel(); // Stop anything currently speaking
            recognition.start();
        });
    }

    /* ===== GROQ AI CHATBOT (TEXT) ===== */
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-text');
    const chatbotSend = document.getElementById('chatbot-send');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => chatbotWindow.classList.toggle('hidden'));
        chatbotClose.addEventListener('click', () => chatbotWindow.classList.add('hidden'));

        const handleSend = async () => {
            const msg = chatbotInput.value.trim();
            if (!msg) return;
            const userBubble = document.createElement('div'); userBubble.className = 'user-message bubble'; userBubble.textContent = msg;
            chatbotBody.appendChild(userBubble); chatbotInput.value = ''; chatbotInput.dispatchEvent(new Event('input')); chatbotBody.scrollTop = chatbotBody.scrollHeight;
            const botBubble = document.createElement('div'); botBubble.className = 'bot-message bubble'; botBubble.textContent = "Typing...";
            chatbotBody.appendChild(botBubble); chatbotBody.scrollTop = chatbotBody.scrollHeight;
            try {
                const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) });
                const data = await response.json(); botBubble.textContent = data.response || "No response received.";
            } catch (err) { botBubble.textContent = "Connection error to AI backend."; }
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        };
        chatbotSend.addEventListener('click', handleSend);
        chatbotInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
        
        // Dynamically toggle Mic and Send buttons
        chatbotInput.addEventListener('input', () => {
            const micBtn = document.getElementById('voice-assistant-btn');
            if (chatbotInput.value.trim().length > 0) {
                chatbotSend.style.display = 'flex';
                if (micBtn) micBtn.style.display = 'none';
            } else {
                chatbotSend.style.display = 'none';
                if (micBtn) micBtn.style.display = 'flex';
            }
        });
        
        // Ensure buttons reset when message is sent
        const originalHandleSend = handleSend;
        chatbotSend.addEventListener('click', () => {
            const micBtn = document.getElementById('voice-assistant-btn');
            chatbotSend.style.display = 'none';
            if (micBtn) micBtn.style.display = 'flex';
        });
    }

    /* ===== AI RESUME ANALYZER (STRUCTURED DASHBOARD) ===== */
    const resumeForm = document.getElementById('resume-form');
    const feedbackDash = document.getElementById('resume-feedback-dashboard');
    if (resumeForm) {
        resumeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('resume-file');
            const submitBtn = resumeForm.querySelector('.submit-btn span');
            if (!fileInput.files[0]) return;

            submitBtn.textContent = 'Extracting Details...';
            feedbackDash.innerHTML = ''; feedbackDash.classList.add('hidden');

            const formData = new FormData(); formData.append('resume', fileInput.files[0]);
            try {
                const response = await fetch('/api/analyze-resume', { method: 'POST', body: formData });
                const data = await response.json();

                feedbackDash.classList.remove('hidden');
                if (data.analysis && data.analysis.resumeScore) {
                    const ans = data.analysis;
                    feedbackDash.innerHTML = `
                        <div class="resume-score-grid">
                            <div class="resume-metric-card">
                                <h3>Total Score</h3>
                                <h1>${ans.resumeScore}/100</h1>
                            </div>
                            <div class="resume-metric-card">
                                <h3>ATS Readiness</h3>
                                <h1>${ans.atsScore}/100</h1>
                            </div>
                        </div>
                        <div class="resume-lists">
                            <div>
                                <h4>✅ Detected Skills</h4>
                                <ul>${ans.skillsDetected.map(s => `<li>${s}</li>`).join('')}</ul>
                            </div>
                            <div>
                                <h4>⚠️ Missing Opportunities</h4>
                                <ul>${ans.missingSkills.map(s => `<li>${s}</li>`).join('')}</ul>
                            </div>
                            <div style="background: var(--card-bg); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border);">
                                <h4>🤖 AI Suggestions</h4>
                                <ul style="margin: 0; padding-left: 1.2rem;">${ans.suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
                            </div>
                        </div>
                    `;
                } else { feedbackDash.innerHTML = `<p class="error-msg">${data.error || 'Failed to analyze format.'}</p>`; }
            } catch (e) { feedbackDash.classList.remove('hidden'); feedbackDash.innerHTML = `<p class="error-msg">Connection error.</p>`; }
            finally { submitBtn.textContent = 'Analyze Resume'; }
        });
    }

    /* ===== AI SKILL RECOMMENDER ===== */
    const recForm = document.getElementById('recommender-form');
    const recResults = document.getElementById('recommender-results');
    if (recForm) {
        recForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('skills-input').value;
            const submitBtn = recForm.querySelector('.submit-btn span');
            submitBtn.textContent = 'Consulting AI...';
            recResults.classList.add('hidden');

            try {
                const skillsArr = input.split(',').map(s => s.trim());
                const response = await fetch('/api/recommend-skills', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentSkills: skillsArr })
                });
                const data = await response.json();

                recResults.classList.remove('hidden');
                if (data.success && data.recommendations) {
                    recResults.innerHTML = '<div style="display:flex; flex-direction:column; gap:1rem;">' + data.recommendations.map(r => `
                        <div style="background: var(--bg-color); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border);">
                            <h4 style="color: var(--primary);">${r.skill}</h4>
                            <p style="font-size: 0.9rem;">${r.reason}</p>
                        </div>
                    `).join('') + '</div>';
                } else { recResults.innerHTML = `<p class="error-msg">Could not generate recommendations.</p>`; }
            } catch (e) { recResults.innerHTML = `<p class="error-msg">Connection Error.</p>`; recResults.classList.remove('hidden'); }
            finally { submitBtn.textContent = 'Get Recommendations'; }
        });
    }

    /* ===== CONTACT FORM SUBMISSION ===== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formMessage = document.getElementById('form-message');
        const submitBtn = contactForm.querySelector('.submit-btn span');
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); submitBtn.textContent = 'Sending...';
            const formData = { name: document.getElementById('name').value, email: document.getElementById('email').value, subject: document.getElementById('subject').value, message: document.getElementById('message').value };
            try {
                const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
                const result = await response.json();
                if (result.success) { formMessage.textContent = result.message; formMessage.className = 'form-message success-msg'; contactForm.reset(); }
                else { formMessage.textContent = 'Failed to send message.'; formMessage.className = 'form-message error-msg'; }
            } catch (error) { formMessage.textContent = 'An error occurred.'; formMessage.className = 'form-message error-msg'; }
            finally { submitBtn.textContent = 'Send Message'; setTimeout(() => formMessage.textContent = '', 5000); }
        });
    }

    /* ===== EASTER EGG (Konami Code) ===== */
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let inputSequence = [];
    window.addEventListener('keydown', (e) => {
        inputSequence.push(e.key);
        if (inputSequence.length > secretCode.length) inputSequence.shift();
        if (JSON.stringify(inputSequence) === JSON.stringify(secretCode)) {
            alert('🎉 Easter Egg Unlocked! Starting V3 Party Mode...');
            document.body.style.animation = 'hue-rotate 3s linear infinite';
            const style = document.createElement('style'); style.innerHTML = `@keyframes hue-rotate { from { filter: hue-rotate(0deg); } to { filter: hue-rotate(360deg); } }`; document.head.appendChild(style);
            inputSequence = [];
        }
    });
});
