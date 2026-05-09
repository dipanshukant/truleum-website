/**
 * 404 Error Page JavaScript
 * Enhanced functionality for 404 error page
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize 404 page enhancements
    init404Enhancements();
    
    // Track 404 errors for analytics
    track404Error();
    
    // Initialize search suggestions
    initSearchSuggestions();
    
    // Add helpful keyboard shortcuts
    initKeyboardShortcuts();
    
    // Initialize page animations
    init404Animations();
});

// Initialize 404 page enhancements
function init404Enhancements() {
    // Add helpful redirect suggestions based on URL
    suggestRedirects();
    
    // Initialize auto-redirect timer (optional)
    // initAutoRedirect();
    
    // Add copy URL functionality
    addCopyURLFeature();
}

// Suggest redirects based on current URL
function suggestRedirects() {
    const currentPath = window.location.pathname.toLowerCase();
    const suggestions = [];
    
    // Common URL patterns and their suggested redirects
    const redirectMap = {
        'service': '/services',
        'about': '/about',
        'contact': '/contact',
        'gallery': '/gallery',
        'blog': '/blog',
        'portfolio': '/gallery',
        'work': '/gallery',
        'project': '/gallery',
        'loft': '/services',
        'conversion': '/services',
        'renovation': '/services',
        'home': '/',
        'index': '/'
    };
    
    // Check if current path contains any keywords
    for (const [keyword, redirect] of Object.entries(redirectMap)) {
        if (currentPath.includes(keyword)) {
            suggestions.push({
                text: `Did you mean: ${redirect}?`,
                url: redirect,
                reason: `Contains "${keyword}"`
            });
        }
    }
    
    // Add suggestions to the page if any found
    if (suggestions.length > 0) {
        addSuggestionsToPage(suggestions);
    }
}

// Add suggestions to the page
function addSuggestionsToPage(suggestions) {
    const searchSection = document.querySelector('.error-search-section');
    if (!searchSection) return;
    
    const suggestionsHTML = `
        <div class="url-suggestions">
            <h4>Did you mean one of these?</h4>
            <div class="suggestions-list">
                ${suggestions.map(suggestion => `
                    <a href="${suggestion.url}" class="suggestion-link">
                        <span class="suggestion-text">${suggestion.text}</span>
                        <span class="suggestion-arrow">→</span>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
    
    searchSection.insertAdjacentHTML('afterend', suggestionsHTML);
    
    // Add CSS for suggestions
    const style = document.createElement('style');
    style.textContent = `
        .url-suggestions {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border-left: 4px solid #d4af37;
        }
        .url-suggestions h4 {
            color: #0a1a4a;
            margin-bottom: 20px;
            font-size: 1.3rem;
        }
        .suggestions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            margin: 0 auto;
        }
        .suggestion-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            background: #f8f9fa;
            border-radius: 8px;
            text-decoration: none;
            color: #0a1a4a;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        .suggestion-link:hover {
            background: #0a1a4a;
            color: white;
            border-color: #d4af37;
            transform: translateX(5px);
        }
        .suggestion-arrow {
            font-weight: bold;
            transition: transform 0.3s ease;
        }
        .suggestion-link:hover .suggestion-arrow {
            transform: translateX(5px);
        }
        @media (max-width: 768px) {
            .suggestions-list {
                max-width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

// Track 404 errors for analytics
function track404Error() {
    const errorData = {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
    
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_not_found', {
            'page_location': errorData.url,
            'page_referrer': errorData.referrer
        });
    }
    
    // Console log for debugging
    console.log('404 Error tracked:', errorData);
    
    // You could also send to your own analytics endpoint
    // sendToAnalytics(errorData);
}

// Initialize search suggestions
function initSearchSuggestions() {
    const searchInput = document.querySelector('input[type="search"]');
    if (!searchInput) return;
    
    // Add search suggestions based on popular pages
    const suggestions = [
        'loft conversion',
        'renovation services',
        'gallery',
        'about us',
        'contact',
        'blog',
        'Cambridge loft conversion',
        'home extension'
    ];
    
    searchInput.addEventListener('focus', function() {
        if (this.value === '') {
            showSearchSuggestions(suggestions, this);
        }
    });
    
    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const filteredSuggestions = suggestions.filter(s => 
            s.toLowerCase().includes(value)
        );
        
        if (filteredSuggestions.length > 0 && value.length > 0) {
            showSearchSuggestions(filteredSuggestions, this);
        } else {
            hideSearchSuggestions();
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.error-search-form')) {
            hideSearchSuggestions();
        }
    });
}

// Show search suggestions
function showSearchSuggestions(suggestions, input) {
    hideSearchSuggestions(); // Remove existing suggestions
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'search-suggestions';
    suggestionsDiv.innerHTML = suggestions.map(suggestion => 
        `<div class="search-suggestion" data-value="${suggestion}">${suggestion}</div>`
    ).join('');
    
    input.parentNode.appendChild(suggestionsDiv);
    
    // Add click handlers
    suggestionsDiv.addEventListener('click', function(e) {
        if (e.target.classList.contains('search-suggestion')) {
            input.value = e.target.dataset.value;
            hideSearchSuggestions();
            input.form.submit();
        }
    });
    
    // Add CSS for suggestions
    if (!document.querySelector('#search-suggestions-style')) {
        const style = document.createElement('style');
        style.id = 'search-suggestions-style';
        style.textContent = `
            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 8px;
                right: 8px;
                background: white;
                border-radius: 0 0 25px 25px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
            }
            .search-suggestion {
                padding: 12px 25px;
                cursor: pointer;
                transition: background 0.3s ease;
                border-bottom: 1px solid #f0f0f0;
            }
            .search-suggestion:last-child {
                border-bottom: none;
            }
            .search-suggestion:hover {
                background: #f8f9fa;
                color: #0a1a4a;
            }
        `;
        document.head.appendChild(style);
    }
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) {
        suggestions.remove();
    }
}

// Add keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Press 'H' to go home
        if (e.key === 'h' || e.key === 'H') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                window.location.href = '/';
            }
        }
        
        // Press 'C' to go to contact
        if (e.key === 'c' || e.key === 'C') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                window.location.href = '/contact';
            }
        }
        
        // Press 'S' to focus search
        if (e.key === 's' || e.key === 'S') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="search"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        }
        
        // Press 'Escape' to clear search
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.blur();
                hideSearchSuggestions();
            }
        }
    });
    
    // Add keyboard shortcuts info
    addKeyboardShortcutsInfo();
}

// Add keyboard shortcuts info
function addKeyboardShortcutsInfo() {
    const helpSection = document.querySelector('.error-help-section .help-content');
    if (!helpSection) return;
    
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.className = 'keyboard-shortcuts';
    shortcutsInfo.innerHTML = `
        <div class="shortcuts-toggle">⌨️ Keyboard Shortcuts</div>
        <div class="shortcuts-list" style="display: none;">
            <div class="shortcut-item"><kbd>H</kbd> Go to Home</div>
            <div class="shortcut-item"><kbd>C</kbd> Go to Contact</div>
            <div class="shortcut-item"><kbd>S</kbd> Focus Search</div>
            <div class="shortcut-item"><kbd>Esc</kbd> Clear Search</div>
        </div>
    `;
    
    helpSection.appendChild(shortcutsInfo);
    
    // Toggle shortcuts visibility
    const toggle = shortcutsInfo.querySelector('.shortcuts-toggle');
    const list = shortcutsInfo.querySelector('.shortcuts-list');
    
    toggle.addEventListener('click', function() {
        const isVisible = list.style.display !== 'none';
        list.style.display = isVisible ? 'none' : 'block';
        this.textContent = isVisible ? '⌨️ Keyboard Shortcuts' : '⌨️ Hide Shortcuts';
    });
    
    // Add CSS for shortcuts
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-shortcuts {
            margin-top: 30px;
            text-align: left;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
        }
        .shortcuts-toggle {
            cursor: pointer;
            padding: 10px 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            text-align: center;
            transition: background 0.3s ease;
            font-size: 0.9rem;
        }
        .shortcuts-toggle:hover {
            background: rgba(255,255,255,0.2);
        }
        .shortcuts-list {
            margin-top: 15px;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
        }
        .shortcut-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }
        .shortcut-item:last-child {
            margin-bottom: 0;
        }
        .shortcut-item kbd {
            background: rgba(255,255,255,0.2);
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.8rem;
            min-width: 24px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
}

// Add copy URL functionality
function addCopyURLFeature() {
    const heroContent = document.querySelector('.error-hero-content');
    if (!heroContent) return;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-url-btn';
    copyButton.innerHTML = '🔗 Copy URL';
    copyButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.15);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            this.innerHTML = '✅ Copied!';
            setTimeout(() => {
                this.innerHTML = '🔗 Copy URL';
            }, 2000);
        });
    });
    
    const container = document.querySelector('.error-hero-container');
    if (container) {
        container.style.position = 'relative';
        container.appendChild(copyButton);
    }
}

// Initialize 404 animations
function init404Animations() {
    // Add stagger animation to page cards
    const pageCards = document.querySelectorAll('.page-card');
    pageCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
    
    // Add stagger animation to recent posts
    const postCards = document.querySelectorAll('.recent-post-card');
    postCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.classList.add('fade-in-up');
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Optional: Auto-redirect functionality (uncomment if needed)
function initAutoRedirect() {
    let countdown = 10; // seconds
    const redirectUrl = '/'; // home page
    
    const countdownElement = document.createElement('div');
    countdownElement.className = 'auto-redirect-countdown';
    countdownElement.innerHTML = `
        <p>Redirecting to homepage in <span id="countdown">${countdown}</span> seconds...</p>
        <button id="cancel-redirect">Stay on this page</button>
    `;
    
    const heroContent = document.querySelector('.error-hero-content');
    if (heroContent) {
        heroContent.appendChild(countdownElement);
    }
    
    const countdownSpan = document.getElementById('countdown');
    const cancelButton = document.getElementById('cancel-redirect');
    
    const timer = setInterval(() => {
        countdown--;
        countdownSpan.textContent = countdown;
        
        if (countdown <= 0) {
            window.location.href = redirectUrl;
        }
    }, 1000);
    
    cancelButton.addEventListener('click', () => {
        clearInterval(timer);
        countdownElement.remove();
    });
}
