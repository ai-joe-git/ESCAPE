// script.js - Main JavaScript file with shared functionality

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Background animation
    const createBackgroundAnimation = () => {
        const background = document.querySelector('.background-animation');
        if (!background) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positions and sizes
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.width = particle.style.height = 
                Math.random() * 3 + 1 + 'px';
            particle.style.animationDuration = 
                Math.random() * 20 + 10 + 's';
            particle.style.animationDelay = 
                Math.random() * 5 + 's';
            
            background.appendChild(particle);
        }
    };

    createBackgroundAnimation();

    // Intersection Observer for scroll animations
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
            element.classList.add('animate-on-scroll-hidden');
        });
    };

    observeElements();

    // Glass effect parallax
    const handleGlassParallax = () => {
        const glassElements = document.querySelectorAll('.glass-container, .glass-section');
        
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            glassElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const moveX = (mouseX - 0.5) * 10;
                const moveY = (mouseY - 0.5) * 10;

                element.style.transform = 
                    `perspective(1000px) 
                     rotateX(${moveY}deg) 
                     rotateY(${moveX}deg) 
                     translateZ(0)`;
            });
        });
    };

    handleGlassParallax();

    // Form handling
    const setupForms = () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Add loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'Processing...';
                }

                // Simulate form submission
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = 'Success!';
                        setTimeout(() => {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = 'Submit';
                            form.reset();
                        }, 2000);
                    }
                }, 1500);
            });
        });
    };

    setupForms();

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Utility functions
const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
};

const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(num);
};

const formatPercentage = (num) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num / 100);
};

// Export utilities for use in other files
window.utils = {
    formatNumber,
    formatCurrency,
    formatPercentage
};
