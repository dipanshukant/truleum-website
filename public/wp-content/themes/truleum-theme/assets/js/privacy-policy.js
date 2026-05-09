/**
 * Privacy Policy JavaScript
 * Enhanced functionality for Privacy Policy page
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize smooth scrolling for TOC links
    initSmoothScrolling();
    
    // Initialize active section highlighting
    initActiveSectionHighlighting();
    
    // Initialize scroll to top functionality
    initScrollToTop();
    
    // Print functionality removed per user request
    // initPrintFunctionality();
});

// Smooth scrolling for TOC links
function initSmoothScrolling() {
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveLink(this);
            }
        });
    });
}

// Update active TOC link
function updateActiveLink(activeLink) {
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    activeLink.classList.add('active');
}

// Active section highlighting based on scroll position
function initActiveSectionHighlighting() {
    const sections = document.querySelectorAll('.privacy-section[id]');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (sections.length === 0 || tocLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const correspondingLink = document.querySelector(`a[href="#${id}"]`);
                
                // Remove active class from all links
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current link
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    });
    
    sections.forEach(section => observer.observe(section));
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);
    
    // Add CSS for scroll button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #0a1a4a 0%, #1e3a8a 100%);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(10, 26, 74, 0.3);
        }
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        .scroll-to-top:hover {
            background: linear-gradient(135deg, #1e3a8a 0%, #0a1a4a 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(10, 26, 74, 0.4);
        }
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Print functionality
function initPrintFunctionality() {
    // Add print button to hero section
    const heroContent = document.querySelector('.privacy-hero-content');
    if (!heroContent) return;
    
    const printButton = document.createElement('button');
    printButton.className = 'print-privacy-btn';
    printButton.innerHTML = '🖨️ Print Privacy Policy';
    printButton.style.cssText = `
        background: rgba(255,255,255,0.15);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 12px 25px;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        margin-top: 20px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    `;
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    printButton.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255,255,255,0.25)';
        this.style.transform = 'translateY(-2px)';
    });
    
    printButton.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255,255,255,0.15)';
        this.style.transform = 'translateY(0)';
    });
    
    heroContent.appendChild(printButton);
}

// Cookie consent banner (optional enhancement)
function initCookieConsent() {
    // Check if consent already given
    if (localStorage.getItem('cookieConsent') === 'accepted') {
        return;
    }
    
    // Create cookie banner
    const banner = document.createElement('div');
    banner.className = 'cookie-consent-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <div class="cookie-text">
                <h4>🍪 We Use Cookies</h4>
                <p>We use cookies to enhance your browsing experience and analyze our traffic. By continuing to use our site, you consent to our use of cookies.</p>
            </div>
            <div class="cookie-actions">
                <button class="accept-cookies">Accept All</button>
                <button class="manage-cookies">Manage Preferences</button>
            </div>
        </div>
    `;
    
    // Add CSS for banner
    const style = document.createElement('style');
    style.textContent = `
        .cookie-consent-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #0a1a4a 0%, #1e3a8a 100%);
            color: white;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 -4px 15px rgba(0,0,0,0.2);
        }
        .cookie-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
        }
        .cookie-text h4 {
            margin: 0 0 8px 0;
            font-size: 1.1rem;
        }
        .cookie-text p {
            margin: 0;
            opacity: 0.9;
            font-size: 0.9rem;
        }
        .cookie-actions {
            display: flex;
            gap: 15px;
            flex-shrink: 0;
        }
        .cookie-actions button {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .accept-cookies {
            background: #d4af37;
            color: white;
        }
        .accept-cookies:hover {
            background: #b8941f;
        }
        .manage-cookies {
            background: transparent;
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
        }
        .manage-cookies:hover {
            background: rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) {
            .cookie-content {
                flex-direction: column;
                text-align: center;
                gap: 20px;
            }
            .cookie-actions {
                width: 100%;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(banner);
    
    // Handle accept button
    banner.querySelector('.accept-cookies').addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.remove();
    });
    
    // Handle manage button (redirect to privacy policy)
    banner.querySelector('.manage-cookies').addEventListener('click', function() {
        // Scroll to cookies section if already on privacy policy page
        const cookiesSection = document.getElementById('cookies-usage');
        if (cookiesSection) {
            cookiesSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Initialize cookie consent on all pages except privacy policy
if (!window.location.pathname.includes('privacy-policy')) {
    initCookieConsent();
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Press 'P' to print
    if (e.key === 'p' || e.key === 'P') {
        if (e.ctrlKey || e.metaKey) {
            // Let browser handle Ctrl+P
            return;
        }
        e.preventDefault();
        window.print();
    }
    
    // Press 'T' to go to top
    if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});
