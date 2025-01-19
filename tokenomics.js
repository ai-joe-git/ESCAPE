// tokenomics.js - Tokenomics page specific functionality

document.addEventListener('DOMContentLoaded', () => {
    // Distribution chart
    const setupDistributionChart = () => {
        const ctx = document.getElementById('distributionChart');
        if (!ctx) return;

        const data = {
            labels: [
                'Ecosystem Development',
                'Community Rewards',
                'Team & Advisors',
                'Treasury',
                'Public Sale',
                'Initial Liquidity'
            ],
            datasets: [{
                data: [30, 25, 15, 15, 10, 5],
                backgroundColor: [
                    '#FF6B6B',
                    '#4ECDC4',
                    '#45B7D1',
                    '#96CEB4',
                    '#FFEEAD',
                    '#D4A5A5'
                ],
                borderWidth: 0
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });
    };

    // Vesting timeline animation
    const animateVestingTimeline = () => {
        const progressBars = document.querySelectorAll('.progress-bar .progress');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const finalWidth = index === 0 ? '25%' : 
                                 index === 1 ? '40%' : '15%';
                bar.style.width = finalWidth;
            }, index * 500);
        });
    };

    // Token metrics counter animation
    const animateMetrics = () => {
        const metrics = document.querySelectorAll('.number-highlight');
        metrics.forEach(metric => {
            const target = parseInt(metric.textContent.replace(/,/g, ''));
            let current = 0;
            const increment = target / 100;
            const duration = 2000; // 2 seconds
            const steps = 100;
            const stepTime = duration / steps;

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                metric.textContent = window.utils.formatNumber(Math.floor(current));
            }, stepTime);
        });
    };

    setupDistributionChart();
    animateVestingTimeline();
    animateMetrics();

    // Update fee structure on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const feeCards = entry.target.querySelectorAll('.fee-card');
                feeCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 200);
                });
            }
        });
    });

    const feeSection = document.querySelector('#fee-structure');
    if (feeSection) {
        observer.observe(feeSection);
    }
});
