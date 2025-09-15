
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize Feather Icons
            feather.replace();
            
            // Sample data for the knowledge graph
            const graphData = {
                nodes: [
                    { id: 1, name: "HTML/CSS", group: 1, description: "Learn the basics of web structure and styling" },
                    { id: 2, name: "JavaScript", group: 1, description: "Master the language of the web" },
                    { id: 3, name: "React", group: 1, description: "Build modern user interfaces" },
                    { id: 4, name: "Node.js", group: 2, description: "Server-side JavaScript runtime" },
                    { id: 5, name: "Express", group: 2, description: "Web framework for Node.js" },
                    { id: 6, name: "MongoDB", group: 2, description: "NoSQL database for modern applications" },
                    { id: 7, name: "Git", group: 3, description: "Version control system" },
                    { id: 8, name: "Deployment", group: 3, description: "Learn to deploy your applications" },
                    { id: 9, name: "Portfolio", group: 3, description: "Build projects to showcase your skills" }
                ],
                links: [
                    { source: 1, target: 2, value: 10 },
                    { source: 2, target: 3, value: 15 },
                    { source: 2, target: 4, value: 12 },
                    { source: 4, target: 5, value: 8 },
                    { source: 5, target: 6, value: 8 },
                    { source: 1, target: 7, value: 5 },
                    { source: 2, target: 7, value: 7 },
                    { source: 3, target: 8, value: 10 },
                    { source: 5, target: 8, value: 10 },
                    { source: 3, target: 9, value: 15 },
                    { source: 6, target: 9, value: 12 }
                ]
            };

            // Create knowledge graph visualization
            function createKnowledgeGraph() {
                const container = document.getElementById('graph-container');
                const width = container.clientWidth;
                const height = container.clientHeight;
                
                const svg = d3.select('#graph-container')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);
                
                const simulation = d3.forceSimulation(graphData.nodes)
                    .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
                    .force('charge', d3.forceManyBody().strength(-300))
                    .force('center', d3.forceCenter(width / 2, height / 2));
                
                const link = svg.append('g')
                    .selectAll('line')
                    .data(graphData.links)
                    .enter()
                    .append('line')
                    .attr('class', 'link')
                    .attr('stroke-width', d => Math.sqrt(d.value));
                
                const node = svg.append('g')
                    .selectAll('circle')
                    .data(graphData.nodes)
                    .enter()
                    .append('circle')
                    .attr('class', 'node')
                    .attr('r', 8)
                    .call(d3.drag()
                        .on('start', dragstarted)
                        .on('drag', dragged)
                        .on('end', dragended));
                
                node.append('title')
                    .text(d => d.name);
                
                const label = svg.append('g')
                    .selectAll('text')
                    .data(graphData.nodes)
                    .enter()
                    .append('text')
                    .text(d => d.name)
                    .attr('font-size', '12px')
                    .attr('dx', 12)
                    .attr('dy', 4);
                
                simulation.on('tick', () => {
                    link
                        .attr('x1', d => d.source.x)
                        .attr('y1', d => d.source.y)
                        .attr('x2', d => d.target.x)
                        .attr('y2', d => d.target.y);
                    
                    node
                        .attr('cx', d => d.x)
                        .attr('cy', d => d.y);
                    
                    label
                        .attr('x', d => d.x)
                        .attr('y', d => d.y);
                });
                
                function dragstarted(event, d) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }
                
                function dragged(event, d) {
                    d.fx = event.x;
                    d.fy = event.y;
                }
                
                function dragended(event, d) {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }
                
                // Add tooltip functionality
                const tooltip = d3.select('.graph-tooltip');
                
                node.on('mouseover', function(event, d) {
                    tooltip
                        .style('opacity', 1)
                        .html(`<strong>${d.name}</strong><br>${d.description}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                });
                
                node.on('mouseout', function() {
                    tooltip.style('opacity', 0);
                });
            }

            // Page Navigation
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
                
                // Initialize graph when roadmap page is shown
                if (pageId === 'roadmap') {
                    // Small delay to ensure the container is visible
                    setTimeout(createKnowledgeGraph, 100);
                }
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

            // Dark Mode Toggle
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

            // Mobile Hamburger Menu
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.querySelector('.nav-links');
            hamburger.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
            });

            // Chatbot
            const chatBubble = document.querySelector('.chat-bubble');
            const chatWindow = document.querySelector('.chat-window');
            const closeChat = document.querySelector('.close-chat');

            chatBubble.addEventListener('click', () => {
                chatWindow.classList.toggle('open');
            });

            closeChat.addEventListener('click', () => {
                chatWindow.classList.remove('open');
            });

            // Form Progress Bar
            const formInputs = document.querySelectorAll('.assessment-form input, .assessment-form select, .assessment-form textarea');
            const progressBarFill = document.querySelector('.progress-bar-fill');

            const updateProgressBar = () => {
                let totalProgressPoints = 8; // name, age, edu, loc, email, skills group, interests, industry, career type group
                let progressPoints = 0;
                
                if (document.querySelector('input[placeholder="Full Name"]').value) progressPoints++;
                if (document.querySelector('input[placeholder="Age"]').value) progressPoints++;
                if (document.querySelector('input[placeholder="Highest Education (e.g., High School)"]').value) progressPoints++;
                if (document.querySelector('input[placeholder="Location (e.g., New Delhi, India)"]').value) progressPoints++;
                if (document.querySelector('input[placeholder="Email Address"]').value) progressPoints++;
                if (document.querySelector('textarea').value) progressPoints++;
                
                const checkedSkills = document.querySelectorAll('input[name="skill"]:checked').length > 0;
                if (checkedSkills) progressPoints++;
                
                const checkedTypes = document.querySelectorAll('input[name="type"]:checked').length > 0;
                if (checkedTypes) progressPoints++;

                const progress = (progressPoints / totalProgressPoints) * 100;
                progressBarFill.style.width = `${Math.min(progress, 100)}%`;
            };

            formInputs.forEach(input => {
                input.addEventListener('input', updateProgressBar);
                input.addEventListener('change', updateProgressBar); // For select and checkboxes
            });

            // Language Selector
            const languageOptions = document.querySelectorAll('.language-option');
            languageOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const lang = option.getAttribute('data-lang');
                    // In a real app, you would implement language change logic here
                    alert(`Language changed to ${option.textContent}. This would reload the page with translated content.`);
                });
            });

            // Initialize progress bar
            updateProgressBar();
        });
