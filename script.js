document.addEventListener('DOMContentLoaded', () => {
    // --- Feather Icons Initialization ---
    feather.replace();

    // --- Page Navigation ---
    const navLinks = document.querySelectorAll('.nav-link, .cta-nav, .cta-button');
    const pages = document.querySelectorAll('.page');
    const assessmentForm = document.querySelector('.assessment-form');

    const showPage = (pageId) => {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId)?.classList.add('active');

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
        window.scrollTo(0, 0);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href')?.substring(1) || 'assessment';
            showPage(targetId);
            // Close mobile menu on link click
            document.querySelector('.nav-links').classList.remove('open');
        });
    });

    assessmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real app, you would process form data here
        showPage('dashboard');
    });

    // Handle "View Roadmap" button clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('roadmap-button')) {
            // Get career title from the card
            const careerTitle = e.target.closest('.career-card').querySelector('h4').textContent;
            // Update the roadmap page title
            document.querySelector('.career-title-placeholder').textContent = careerTitle;
            showPage('roadmap');
        }
    });


    // --- Dark Mode Toggle ---
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = feather.icons.sun.toSvg();
        } else {
            body.classList.remove('dark-mode');
            themeToggle.innerHTML = feather.icons.moon.toSvg();
        }
    };
    
    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        applyTheme(isDarkMode ? 'dark' : 'light');
    });

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);


    // --- Mobile Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });


    // --- Chatbot ---
    const chatBubble = document.querySelector('.chat-bubble');
    const chatWindow = document.querySelector('.chat-window');
    const closeChat = document.querySelector('.close-chat');

    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // --- Form Progress Bar ---
    const formInputs = document.querySelectorAll('.assessment-form input, .assessment-form select, .assessment-form textarea');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const totalFields = formInputs.length;
    let filledFields = 0;

    const updateProgressBar = () => {
        filledFields = 0;
        formInputs.forEach(input => {
            if ((input.type === 'checkbox' && input.checked) || (input.value.trim() !== '' && input.type !== 'checkbox')) {
                // For checkboxes, just one needs to be checked in a group to count
                // A more robust solution would group checkboxes, this is simplified.
                filledFields++;
            }
        });
        
        // Simple distinct count for checkboxes
        const checkedSkills = document.querySelectorAll('input[name="skill"]:checked').length > 0;
        const checkedTypes = document.querySelectorAll('input[name="type"]:checked').length > 0;
        
        let validFields = 0;
        formInputs.forEach(input => {
            if(input.type !== 'checkbox' && input.value.trim() !== '') validFields++;
        });

        const totalProgressPoints = 6; // name, age, edu, loc, skills group, interests, industry, career type group
        let progressPoints = 0;
        if (document.querySelector('input[placeholder="Full Name"]').value) progressPoints++;
        if (document.querySelector('input[placeholder="Age"]').value) progressPoints++;
        if (document.querySelector('input[placeholder="Highest Education (e.g., High School)"]').value) progressPoints++;
        if (document.querySelector('textarea').value) progressPoints++;
        if (checkedSkills) progressPoints++;
        if (checkedTypes) progressPoints++;

        const progress = (progressPoints / totalProgressPoints) * 100;
        progressBarFill.style.width = `${Math.min(progress, 100)}%`;
    };

    formInputs.forEach(input => {
        input.addEventListener('input', updateProgressBar);
        input.addEventListener('change', updateProgressBar); // For select and checkboxes
    });
});