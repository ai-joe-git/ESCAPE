// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and functionality
    initializeNavigationMenu();
    initializeScrollAnimations();
    createTokenomicsChart();
    initializeRoadmapTimeline();
    initializeParallaxEffect();
    initializeStakingTiers();
    initializeContactForm();
});

// Mobile Navigation Menu
function initializeNavigationMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            navLinks.classList.remove('active');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.classList.remove('active');
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const elements = document.querySelectorAll('.glass-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Tokenomics Chart
function createTokenomicsChart() {
    const distribution = [
        { label: 'Ecosystem Development', value: 30 },
        { label: 'Community Rewards', value: 25 },
        { label: 'Team & Advisors', value: 15 },
        { label: 'Treasury', value: 15 },
        { label: 'Public Sale', value: 10 },
        { label: 'Initial Liquidity', value: 5 }
    ];

    const chart = document.querySelector('.distribution-chart');
    if (!chart) return;

    // Create SVG donut chart
    const size = 300;
    const radius = size / 2;
    let startAngle = 0;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

    distribution.forEach((segment, index) => {
        const percentage = segment.value / 100;
        const endAngle = startAngle + (percentage * Math.PI * 2);
        
        // Calculate path
        const x1 = radius + radius * Math.cos(startAngle);
        const y1 = radius + radius * Math.sin(startAngle);
        const x2 = radius + radius * Math.cos(endAngle);
        const y2 = radius + radius * Math.sin(endAngle);
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const largeArcFlag = percentage > 0.5 ? 1 : 0;
        
        path.setAttribute('d', `
            M ${radius},${radius}
            L ${x1},${y1}
            A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}
            Z
        `);
        
        path.setAttribute('fill', `hsl(${index * 60}, 70%, 60%)`);
        svg.appendChild(path);
        
        startAngle = endAngle;
    });

    chart.appendChild(svg);
}

// Roadmap Timeline
function initializeRoadmapTimeline() {
    const roadmapData = [
        { phase: 'Phase 1', title: 'Foundation', date: 'Q1 2025' },
        { phase: 'Phase 2', title: 'Growth', date: 'Q2 2025' },
        { phase: 'Phase 3', title: 'Expansion', date: 'Q3 2025' },
        { phase: 'Phase 4', title: 'Maturity', date: 'Q4 2025' }
    ];

    const timeline = document.querySelector('.roadmap-timeline');
    if (!timeline) return;

    roadmapData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <h3>${item.phase}</h3>
                <h4>${item.title}</h4>
                <p>${item.date}</p>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });
}

// Parallax Effect
function initializeParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.glass-card');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Staking Tiers Animation
function initializeStakingTiers() {
    const tiers = [
        { name: 'Bronze', color: '#CD7F32' },
        { name: 'Silver', color: '#C0C0C0' },
        { name: 'Gold', color: '#FFD700' },
        { name: 'Platinum', color: '#E5E4E2' }
    ];

    const tiersContainer = document.querySelector('.tiers-container');
    if (!tiersContainer) return;

    tiers.forEach(tier => {
        const tierCard = document.createElement('div');
        tierCard.className = `tier-card ${tier.name.toLowerCase()}`;
        tierCard.style.borderColor = tier.color;
        tierCard.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = `0 0 20px ${tier.color}40`;
        });
        tierCard.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitButton.textContent = 'Message Sent!';
            form.reset();
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Update statistics counter animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize statistics animation
document.querySelectorAll('.stat-card h3').forEach(stat => {
    const value = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
    stat.textContent = '0';
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(stat, 0, value, 2000);
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(stat);
});

// Add smooth loading transition
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
