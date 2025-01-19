// staking.js - Staking page specific functionality

document.addEventListener('DOMContentLoaded', () => {
    // Constants for staking calculations
    const STAKING_TIERS = {
        bronze: {
            minStake: 10000,
            lockPeriod: 3,
            apy: 5,
            governanceWeight: 1
        },
        silver: {
            minStake: 50000,
            lockPeriod: 6,
            apy: 10,
            governanceWeight: 2
        },
        gold: {
            minStake: 100000,
            lockPeriod: 12,
            apy: 15,
            governanceWeight: 3
        },
        platinum: {
            minStake: 250000,
            lockPeriod: 24,
            apy: 20,
            governanceWeight: 4
        }
    };

    const BASE_APY = 5; // Base APY rate

    // Staking Calculator
    const setupStakingCalculator = () => {
        const stakeAmount = document.getElementById('stake-amount');
        const stakePeriod = document.getElementById('stake-period');
        const calculateBtn = document.querySelector('.calculate-btn');
        const estimatedApy = document.getElementById('estimated-apy');
        const totalRewards = document.getElementById('total-rewards');
        const governancePower = document.getElementById('governance-power');

        const calculateRewards = () => {
            const amount = parseFloat(stakeAmount.value) || 0;
            const period = parseInt(stakePeriod.value) || 3;
            
            // Determine tier based on amount and period
            let tier = null;
            let tierApy = BASE_APY;
            let govWeight = 1;

            if (amount >= STAKING_TIERS.platinum.minStake && period >= STAKING_TIERS.platinum.lockPeriod) {
                tier = 'platinum';
                tierApy = BASE_APY + STAKING_TIERS.platinum.apy;
                govWeight = STAKING_TIERS.platinum.governanceWeight;
            } else if (amount >= STAKING_TIERS.gold.minStake && period >= STAKING_TIERS.gold.lockPeriod) {
                tier = 'gold';
                tierApy = BASE_APY + STAKING_TIERS.gold.apy;
                govWeight = STAKING_TIERS.gold.governanceWeight;
            } else if (amount >= STAKING_TIERS.silver.minStake && period >= STAKING_TIERS.silver.lockPeriod) {
                tier = 'silver';
                tierApy = BASE_APY + STAKING_TIERS.silver.apy;
                govWeight = STAKING_TIERS.silver.governanceWeight;
            } else if (amount >= STAKING_TIERS.bronze.minStake && period >= STAKING_TIERS.bronze.lockPeriod) {
                tier = 'bronze';
                tierApy = BASE_APY + STAKING_TIERS.bronze.apy;
                govWeight = STAKING_TIERS.bronze.governanceWeight;
            }

            // Calculate rewards
            const yearlyReward = amount * (tierApy / 100);
            const periodReward = yearlyReward * (period / 12);

            // Update UI with animations
            animateValue(estimatedApy, parseFloat(estimatedApy.textContent), tierApy, 1000, '%');
            animateValue(totalRewards, parseFloat(totalRewards.textContent.replace(/[^0-9.-]+/g, '')), 
                        periodReward, 1000, ' $BOND');
            animateValue(governancePower, parseFloat(governancePower.textContent), govWeight, 500, 'x');

            // Highlight tier
            highlightActiveTier(tier);
        };

        // Add event listeners
        stakeAmount?.addEventListener('input', calculateRewards);
        stakePeriod?.addEventListener('change', calculateRewards);
        calculateBtn?.addEventListener('click', calculateRewards);
    };

    // Animate value changes
    const animateValue = (element, start, end, duration, suffix) => {
        if (!element) return;

        const range = end - start;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (range * easeOutQuart);

            element.textContent = current.toFixed(2) + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    // Highlight active tier
    const highlightActiveTier = (tier) => {
        const tiers = document.querySelectorAll('.tier-card');
        tiers.forEach(card => {
            card.classList.remove('active');
            if (tier && card.classList.contains(tier)) {
                card.classList.add('active');
            }
        });
    };

    // Staking Statistics Charts
    const setupStakingStats = () => {
        // Total Staked Chart
        const setupTotalStakedChart = () => {
            const ctx = document.getElementById('stakedChart')?.getContext('2d');
            if (!ctx) return;

            const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
            gradientFill.addColorStop(0, 'rgba(78, 205, 196, 0.6)');
            gradientFill.addColorStop(1, 'rgba(78, 205, 196, 0.1)');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Total Staked',
                        data: [1000000, 2500000, 4000000, 5500000, 7000000, 8500000],
                        borderColor: '#4ECDC4',
                        backgroundColor: gradientFill,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        };

        // Active Stakers Chart
        const setupStakersChart = () => {
            const ctx = document.getElementById('stakersChart')?.getContext('2d');
            if (!ctx) return;

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Bronze', 'Silver', 'Gold', 'Platinum'],
                    datasets: [{
                        label: 'Active Stakers',
                        data: [1200, 800, 400, 100],
                        backgroundColor: [
                            '#cd7f32',
                            '#c0c0c0',
                            '#ffd700',
                            '#e5e4e2'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        };

        // APY Chart
        const setupApyChart = () => {
            const ctx = document.getElementById('apyChart')?.getContext('2d');
            if (!ctx) return;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Average APY',
                        data: [10, 12, 11, 13, 12.5, 14],
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        };

        setupTotalStakedChart();
        setupStakersChart();
        setupApyChart();
    };

    // Benefits Section Animation
    const setupBenefitsAnimation = () => {
        const benefits = document.querySelectorAll('.benefit-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.querySelector('i').classList.add('animate-icon');
                }
            });
        }, { threshold: 0.2 });

        benefits.forEach(benefit => {
            observer.observe(benefit);
        });
    };

    // Initialize all functionality
    setupStakingCalculator();
    setupStakingStats();
    setupBenefitsAnimation();

    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
        .tier-card.active {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            border: 2px solid var(--primary-color);
        }

        .animate-icon {
            animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes bounceIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }

        .benefit-card.visible {
            animation: slideUp 0.6s ease-out forwards;
        }

        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});
