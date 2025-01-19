// roadmap.js - Roadmap page specific functionality

document.addEventListener('DOMContentLoaded', () => {
    // Timeline phase tracking and animations
    const setupTimeline = () => {
        const phases = document.querySelectorAll('.timeline-phase');
        const progressBars = document.querySelectorAll('.progress-bar .progress');
        
        // Current progress data (would normally come from backend)
        const phaseProgress = {
            1: { // Phase 1
                'Token Launch': 0,
                'Staking Implementation': 0,
                'Community Building': 0
            },
            2: { // Phase 2
                'DeFi Integration': 0,
                'Cross-chain Bridge': 0,
                'Governance Launch': 0
            },
            3: { // Phase 3
                'Institutional Services': 0,
                'Chain Integration': 0,
                'Financial Products': 0
            },
            4: { // Phase 4
                'Enterprise Suite': 0,
                'Regulatory Framework': 0,
                'Global Expansion': 0
            }
        };

        // Intersection Observer for phase animations
        const observePhases = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate milestones within the phase
                    const milestones = entry.target.querySelectorAll('.milestone-card');
                    milestones.forEach((milestone, index) => {
                        setTimeout(() => {
                            milestone.classList.add('visible');
                            animateMilestoneProgress(milestone);
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.1 });

        phases.forEach(phase => {
            observePhases.observe(phase);
        });

        // Animate milestone progress bars
        const animateMilestoneProgress = (milestone) => {
            const progressBar = milestone.querySelector('.progress');
            if (!progressBar) return;

            const phaseNumber = parseInt(milestone.closest('.timeline-phase').dataset.phase);
            const milestoneName = milestone.querySelector('h3').textContent;
            const progress = phaseProgress[phaseNumber][milestoneName] || 0;

            progressBar.style.width = `${progress}%`;
            
            // Add completion animation if 100%
            if (progress === 100) {
                milestone.classList.add('completed');
            }
        };
    };

    // Progress Overview Section
    const setupProgressOverview = () => {
        const progressCards = document.querySelectorAll('.progress-card');
        
        // Sample progress data (would normally come from backend)
        const progressData = {
            'Technical Development': 0,
            'Community Growth': 0,
            'Partnership Development': 0
        };

        const animateProgress = (card) => {
            const title = card.querySelector('h3').textContent;
            const progressBar = card.querySelector('.progress');
            const percentageSpan = card.querySelector('.progress-percentage');
            const targetProgress = progressData[title];

            let currentProgress = 0;
            const duration = 1500;
            const interval = 16;
            const steps = duration / interval;
            const incrementPerStep = targetProgress / steps;

            const animation = setInterval(() => {
                currentProgress = Math.min(currentProgress + incrementPerStep, targetProgress);
                progressBar.style.width = `${currentProgress}%`;
                percentageSpan.textContent = `${Math.round(currentProgress)}%`;

                if (currentProgress >= targetProgress) {
                    clearInterval(animation);
                }
            }, interval);
        };

        // Intersection Observer for progress cards
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animateProgress(entry.target);
                }
            });
        }, { threshold: 0.2 });

        progressCards.forEach(card => {
            observer.observe(card);
        });
    };

    // Interactive timeline navigation
    const setupTimelineNavigation = () => {
        const phases = document.querySelectorAll('.timeline-phase');
        let currentPhase = 1;

        // Create navigation dots
        const createNavigationDots = () => {
            const nav = document.createElement('div');
            nav.className = 'timeline-navigation';
            
            phases.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'timeline-dot';
                dot.dataset.phase = index + 1;
                if (index + 1 === currentPhase) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    navigateToPhase(index + 1);
                });
                
                nav.appendChild(dot);
            });

            document.querySelector('#timeline').appendChild(nav);
        };

        const navigateToPhase = (phaseNumber) => {
            const phase = document.querySelector(`.timeline-phase[data-phase="${phaseNumber}"]`);
            if (!phase) return;

            // Update active states
            phases.forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.timeline-dot').forEach(dot => dot.classList.remove('active'));
            
            phase.classList.add('active');
            document.querySelector(`.timeline-dot[data-phase="${phaseNumber}"]`).classList.add('active');
            
            // Smooth scroll to phase
            phase.scrollIntoView({ behavior: 'smooth', block: 'start' });
            currentPhase = phaseNumber;
        };

        createNavigationDots();
    };

    // Initialize all functionality
    setupTimeline();
    setupProgressOverview();
    setupTimelineNavigation();

    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
        .timeline-phase {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
        }

        .timeline-phase.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .milestone-card {
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.4s ease-out;
        }

        .milestone-card.visible {
            opacity: 1;
            transform: translateX(0);
        }

        .milestone-card.completed {
            position: relative;
        }

        .milestone-card.completed::after {
            content: '✓';
            position: absolute;
            top: 1rem;
            right: 1rem;
            color: #4CAF50;
            font-size: 1.2rem;
            animation: checkmark 0.5s ease-out forwards;
        }

        @keyframes checkmark {
            0% { 
                opacity: 0;
                transform: scale(0);
            }
            50% { 
                transform: scale(1.2);
            }
            100% { 
                opacity: 1;
                transform: scale(1);
            }
        }

        .timeline-navigation {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
        }

        .timeline-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--text-secondary);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .timeline-dot:hover {
            transform: scale(1.2);
        }

        .timeline-dot.active {
            background: var(--primary-color);
            transform: scale(1.2);
        }

        .progress-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
        }

        .progress-card.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .progress {
            transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);

    // Handle hash navigation
    const handleHashNavigation = () => {
        const hash = window.location.hash;
        if (hash) {
            const phaseNumber = hash.replace('#phase', '');
            if (phaseNumber && !isNaN(phaseNumber)) {
                setTimeout(() => {
                    navigateToPhase(parseInt(phaseNumber));
                }, 100);
            }
        }
    };

    window.addEventListener('hashchange', handleHashNavigation);
    handleHashNavigation();
});
