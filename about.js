// about.js - About page specific functionality

document.addEventListener('DOMContentLoaded', () => {
    // Team member interactions and animations
    const setupTeamSection = () => {
        const teamMembers = document.querySelectorAll('.team-card');
        
        teamMembers.forEach(member => {
            // Hover effects
            member.addEventListener('mouseenter', () => {
                const socialLinks = member.querySelector('.social-links');
                const bio = member.querySelector('.member-bio');
                
                if (socialLinks) {
                    socialLinks.style.opacity = '1';
                    socialLinks.style.transform = 'translateY(0)';
                }
                
                if (bio) {
                    bio.style.maxHeight = bio.scrollHeight + 'px';
                }
            });

            member.addEventListener('mouseleave', () => {
                const socialLinks = member.querySelector('.social-links');
                const bio = member.querySelector('.member-bio');
                
                if (socialLinks) {
                    socialLinks.style.opacity = '0';
                    socialLinks.style.transform = 'translateY(10px)';
                }
                
                if (bio) {
                    bio.style.maxHeight = '0';
                }
            });

            // Click to expand bio on mobile
            member.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const bio = member.querySelector('.member-bio');
                    const isExpanded = bio.style.maxHeight !== '0px';
                    
                    // Reset all other bios
                    teamMembers.forEach(m => {
                        const otherBio = m.querySelector('.member-bio');
                        if (otherBio && m !== member) {
                            otherBio.style.maxHeight = '0';
                            m.classList.remove('expanded');
                        }
                    });

                    // Toggle clicked bio
                    if (bio) {
                        bio.style.maxHeight = isExpanded ? '0' : bio.scrollHeight + 'px';
                        member.classList.toggle('expanded');
                    }
                }
            });
        });
    };

    // Office locations map
    const setupOfficeMap = () => {
        const officeLocations = [
            { city: 'New York', coords: [40.7128, -74.0060] },
            { city: 'London', coords: [51.5074, -0.1278] },
            { city: 'Singapore', coords: [1.3521, 103.8198] },
            { city: 'Tokyo', coords: [35.6762, 139.6503] }
        ];

        const map = L.map('office-map', {
            center: [20, 0],
            zoom: 2,
            scrollWheelZoom: false
        });

        // Custom map style
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add office markers
        officeLocations.forEach(office => {
            const marker = L.marker(office.coords, {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `
                        <div class="marker-pulse"></div>
                        <div class="marker-label">${office.city}</div>
                    `
                })
            }).addTo(map);

            // Marker click handler
            marker.on('click', () => {
                showOfficeDetails(office.city);
            });
        });
    };

    // Office details popup
    const showOfficeDetails = (city) => {
        const officeDetails = {
            'New York': {
                address: '123 Wall Street, New York, NY 10005',
                phone: '+1 (212) 555-0123',
                email: 'ny@blockchains.bond'
            },
            'London': {
                address: '456 Canary Wharf, London E14 5AB',
                phone: '+44 20 7123 4567',
                email: 'london@blockchains.bond'
            },
            'Singapore': {
                address: '789 Marina Bay, Singapore 018956',
                phone: '+65 6789 0123',
                email: 'sg@blockchains.bond'
            },
            'Tokyo': {
                address: '321 Shibuya, Tokyo 150-0002',
                phone: '+81 3-1234-5678',
                email: 'tokyo@blockchains.bond'
            }
        };

        const details = officeDetails[city];
        if (!details) return;

        const popup = document.createElement('div');
        popup.className = 'office-popup';
        popup.innerHTML = `
            <div class="office-popup-content">
                <h3>${city} Office</h3>
                <p><i class="location-icon"></i>${details.address}</p>
                <p><i class="phone-icon"></i>${details.phone}</p>
                <p><i class="email-icon"></i>${details.email}</p>
                <button class="close-popup">Close</button>
            </div>
        `;

        document.body.appendChild(popup);

        // Animation
        requestAnimationFrame(() => {
            popup.classList.add('visible');
        });

        // Close button handler
        popup.querySelector('.close-popup').addEventListener('click', () => {
            popup.classList.remove('visible');
            setTimeout(() => popup.remove(), 300);
        });
    };

    // Contact form handling
    const setupContactForm = () => {
        const form = document.getElementById('contact-form');
        const submitButton = form?.querySelector('button[type="submit"]');
        const formFields = form?.querySelectorAll('input, textarea');

        if (!form) return;

        // Real-time validation
        formFields?.forEach(field => {
            field.addEventListener('input', () => {
                validateField(field);
                updateSubmitButton();
            });

            field.addEventListener('blur', () => {
                validateField(field);
            });
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!submitButton) return;

            // Validate all fields
            let isValid = true;
            formFields?.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="loading-spinner"></span>
                Sending...
            `;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
                form.reset();
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    };

    // Field validation
    const validateField = (field) => {
        const value = field.value.trim();
        let isValid = true;

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Validation rules
        if (field.required && !value) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }

        field.classList.toggle('invalid', !isValid);
        return isValid;
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const showFieldError = (field, message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    };

    // Update submit button state
    const updateSubmitButton = () => {
        const form = document.getElementById('contact-form');
        const submitButton = form?.querySelector('button[type="submit"]');
        const formFields = form?.querySelectorAll('input, textarea');
        
        if (!submitButton || !formFields) return;

        let isValid = true;
        formFields.forEach(field => {
            if (field.required && !field.value.trim()) {
                isValid = false;
            }
            if (field.classList.contains('invalid')) {
                isValid = false;
            }
        });

        submitButton.disabled = !isValid;
    };

    // Notification system
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animation
        requestAnimationFrame(() => {
            notification.classList.add('visible');
        });

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    // Initialize all functionality
    setupTeamSection();
    setupOfficeMap();
    setupContactForm();

    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
        .team-card {
            transition: all 0.3s ease;
        }

        .team-card:hover {
            transform: translateY(-5px);
        }

        .social-links {
            transition: all 0.3s ease;
        }

        .member-bio {
            transition: max-height 0.3s ease-out;
            overflow: hidden;
        }

        .custom-marker {
            position: relative;
        }

        .marker-pulse {
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb), 0.7);
            }
            70% {
                transform: scale(1);
                box-shadow: 0 0 0 10px rgba(var(--primary-color-rgb), 0);
            }
            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb), 0);
            }
        }

        .office-popup {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }

        .office-popup.visible {
            opacity: 1;
        }

        .office-popup-content {
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }

        .office-popup.visible .office-popup-content {
            transform: translateY(0);
        }

        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #fff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 4px;
            background: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .notification.visible {
            transform: translateY(0);
            opacity: 1;
        }

        .notification.success {
            background: #4CAF50;
            color: white;
        }

        .notification.error {
            background: #f44336;
            color: white;
        }
    `;
    document.head.appendChild(style);
});
