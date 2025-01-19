// technology.js - Technology page specific functionality

document.addEventListener('DOMContentLoaded', () => {
    // Code tabs functionality
    const setupCodeTabs = () => {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const codeContent = document.querySelector('#contract-code');

        const codeExamples = {
            token: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BONDToken is ERC20, Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Advanced security features
    mapping(address => bool) public blacklisted;
    uint256 public maxTransferAmount;
    
    // Cross-chain compatibility
    mapping(uint256 => bool) public supportedChainIds;
    
    constructor() ERC20("BLOCKCHAINS.BOND", "BOND") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        maxTransferAmount = 1000000 * 10**decimals();
    }

    function mint(address to, uint256 amount) 
        external onlyRole(MINTER_ROLE) {
        require(!blacklisted[to], "Address is blacklisted");
        require(amount <= maxTransferAmount, "Amount exceeds limit");
        _mint(to, amount);
    }

    function updateMaxTransfer(uint256 newMax) 
        external onlyRole(ADMIN_ROLE) {
        maxTransferAmount = newMax;
    }
}`,
            staking: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BONDStaking is ReentrancyGuard {
    IERC20 public bondToken;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 lockPeriod;
        uint8 tier;
    }
    
    mapping(address => Stake) public stakes;
    mapping(uint8 => uint256) public tierRewards;
    
    event Staked(address indexed user, uint256 amount, uint8 tier);
    event Unstaked(address indexed user, uint256 amount);
    
    constructor(address _bondToken) {
        bondToken = IERC20(_bondToken);
        setupTiers();
    }
    
    function stake(uint256 amount, uint8 tier) 
        external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(tier < 4, "Invalid tier");
        
        bondToken.transferFrom(msg.sender, address(this), amount);
        
        stakes[msg.sender] = Stake({
            amount: amount,
            timestamp: block.timestamp,
            lockPeriod: getTierLockPeriod(tier),
            tier: tier
        });
        
        emit Staked(msg.sender, amount, tier);
    }
}`,
            governance: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract BONDGovernor is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes {
    constructor(IVotes _token)
        Governor("BOND Governor")
        GovernorSettings(1, 45818, 100000e18)
        GovernorVotes(_token)
    {}

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        pure
        override
        returns (uint256)
    {
        return 100000e18;
    }
}`
        };

        const updateCode = (type) => {
            if (codeContent && codeExamples[type]) {
                codeContent.textContent = codeExamples[type];
                Prism.highlightElement(codeContent);
            }
        };

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                // Update code content
                updateCode(btn.dataset.tab);
            });
        });

        // Initialize with token contract
        updateCode('token');
    };

    // Architecture diagram animations
    const setupArchitectureAnimations = () => {
        const cards = document.querySelectorAll('.chain-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate icons
                    const icon = entry.target.querySelector('i');
                    if (icon) {
                        icon.style.animation = 'pulse 2s infinite';
                    }
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            observer.observe(card);
        });
    };

    // Security features interactive demo
    const setupSecurityDemo = () => {
        const securityCards = document.querySelectorAll('.security-card');
        
        securityCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add security scan animation
                const icon = card.querySelector('i');
                if (icon) {
                    icon.style.animation = 'securityScan 1.5s ease-in-out';
                }
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('i');
                if (icon) {
                    icon.style.animation = '';
                }
            });
        });
    };

    // Infrastructure diagram interactions
    const setupInfrastructureDiagram = () => {
        const layers = document.querySelectorAll('.layer-card');
        
        layers.forEach((layer, index) => {
            layer.addEventListener('click', () => {
                // Remove active class from all layers
                layers.forEach(l => l.classList.remove('active'));
                // Add active class to clicked layer
                layer.classList.add('active');
                
                // Show detailed information for the selected layer
                const details = {
                    0: 'Protocol Layer: Handles core smart contract functionality and cross-chain operations',
                    1: 'Service Layer: Manages API endpoints and data indexing services',
                    2: 'Application Layer: Provides user interfaces and developer tools'
                };

                // Create or update info tooltip
                let tooltip = document.getElementById('layer-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.id = 'layer-tooltip';
                    document.body.appendChild(tooltip);
                }

                tooltip.textContent = details[index];
                tooltip.style.display = 'block';
                
                // Position tooltip near the layer
                const rect = layer.getBoundingClientRect();
                tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
                tooltip.style.left = `${rect.left}px`;
            });
        });

        // Hide tooltip when clicking outside
        document.addEventListener('click', (e) => {
            const tooltip = document.getElementById('layer-tooltip');
            if (tooltip && !e.target.closest('.layer-card')) {
                tooltip.style.display = 'none';
            }
        });
    };

    // Protocol integrations demo
    const setupIntegrationDemo = () => {
        const cards = document.querySelectorAll('.integration-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Simulate integration process
                card.classList.add('connecting');
                
                setTimeout(() => {
                    card.classList.remove('connecting');
                    card.classList.add('connected');
                    
                    // Reset after animation
                    setTimeout(() => {
                        card.classList.remove('connected');
                    }, 2000);
                }, 1500);
            });
        });
    };

    // Initialize all functionality
    setupCodeTabs();
    setupArchitectureAnimations();
    setupSecurityDemo();
    setupInfrastructureDiagram();
    setupIntegrationDemo();

    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        @keyframes securityScan {
            0% { color: var(--primary-color); }
            50% { color: #00ff00; }
            100% { color: var(--primary-color); }
        }

        .connecting {
            position: relative;
            overflow: hidden;
        }

        .connecting::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            animation: connecting 1.5s infinite;
        }

        @keyframes connecting {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .connected {
            animation: success 0.5s ease-out;
        }

        @keyframes success {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});
