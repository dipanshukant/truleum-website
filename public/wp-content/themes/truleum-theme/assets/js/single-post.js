/**
 * Single Post JavaScript
 * Enhanced functionality for individual blog posts
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Generate Table of Contents
    generateTableOfContents();
    
    // Initialize reading progress
    initReadingProgress();
    
    // Handle newsletter signup
    handleNewsletterSignup();
    
    // Smooth scrolling for TOC links
    initSmoothScrolling();
    
    // Social share functionality
    initSocialShare();
    
    // Reading time calculation
    calculateReadingTime();
});

// Generate Table of Contents from headings
function generateTableOfContents() {
    const tocContainer = document.getElementById('table-of-contents');
    const contentWrapper = document.querySelector('.post-content-wrapper');
    
    if (!tocContainer || !contentWrapper) return;
    
    const headings = contentWrapper.querySelectorAll('h2, h3, h4');
    
    if (headings.length === 0) {
        tocContainer.innerHTML = '<p>No headings found in this article.</p>';
        return;
    }
    
    let tocHTML = '<ul>';
    let currentLevel = 2;
    
    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const id = `heading-${index}`;
        const text = heading.textContent;
        
        // Add ID to heading for linking
        heading.id = id;
        
        // Adjust nesting based on heading level
        if (level > currentLevel) {
            tocHTML += '<ul>';
        } else if (level < currentLevel) {
            tocHTML += '</ul>';
        }
        
        tocHTML += `<li><a href="#${id}" class="toc-link">${text}</a></li>`;
        currentLevel = level;
    });
    
    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;
}

// Reading progress indicator
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    const progressBarFill = progressBar.querySelector('.reading-progress-bar');
    const contentWrapper = document.querySelector('.post-content-wrapper');
    
    if (!contentWrapper) return;
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBarFill.style.width = Math.min(progress, 100) + '%';
    });
    
    // Add CSS for reading progress
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(10, 26, 74, 0.1);
            z-index: 9999;
        }
        .reading-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #d4af37 0%, #b8941f 100%);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Newsletter signup handling
function handleNewsletterSignup() {
    const newsletterForms = document.querySelectorAll('.sidebar-newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate subscription (replace with actual implementation)
            setTimeout(() => {
                submitBtn.textContent = 'Subscribed!';
                submitBtn.style.background = '#10b981';
                
                // Reset form
                this.querySelector('input[type="email"]').value = '';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 2000);
                
                console.log('Newsletter subscription for:', email);
            }, 1000);
        });
    });
}

// Smooth scrolling for TOC links
function initSmoothScrolling() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('toc-link')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Highlight the clicked TOC link
                document.querySelectorAll('.toc-link').forEach(link => {
                    link.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        }
    });
    
    // Add CSS for active TOC link
    const style = document.createElement('style');
    style.textContent = `
        .toc-link.active {
            color: #d4af37 !important;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
}

// Social share functionality
function initSocialShare() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track social share (you can add analytics here)
            const platform = this.classList.contains('facebook') ? 'Facebook' :
                           this.classList.contains('twitter') ? 'Twitter' :
                           this.classList.contains('linkedin') ? 'LinkedIn' : 'Email';
            
            console.log(`Shared on ${platform}:`, window.location.href);
        });
    });
}

// Calculate and display reading time
function calculateReadingTime() {
    const readingTimeElements = document.querySelectorAll('.reading-time');
    const contentWrapper = document.querySelector('.post-content-wrapper');
    
    if (!contentWrapper || readingTimeElements.length === 0) return;
    
    const text = contentWrapper.textContent || contentWrapper.innerText || '';
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    readingTimeElements.forEach(element => {
        if (element.textContent.includes('[reading_time]')) {
            element.innerHTML = element.innerHTML.replace('[reading_time]', readingTime);
        }
    });
}

// Intersection Observer for TOC highlighting
function initTOCHighlighting() {
    const headings = document.querySelectorAll('.post-content-wrapper h2, .post-content-wrapper h3, .post-content-wrapper h4');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (headings.length === 0 || tocLinks.length === 0) return;
    
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
        rootMargin: '-100px 0px -66%',
        threshold: 0
    });
    
    headings.forEach(heading => observer.observe(heading));
}

// Initialize TOC highlighting after TOC is generated
setTimeout(initTOCHighlighting, 100);

// Copy link functionality
function addCopyLinkFeature() {
    const postTitle = document.querySelector('.post-title');
    if (!postTitle) return;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-link-btn';
    copyButton.innerHTML = '🔗 Copy Link';
    copyButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255,255,255,0.9);
        border: none;
        padding: 8px 12px;
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
                this.innerHTML = '🔗 Copy Link';
            }, 2000);
        });
    });
    
    const heroContent = document.querySelector('.post-hero-content');
    if (heroContent) {
        heroContent.style.position = 'relative';
        heroContent.appendChild(copyButton);
    }
}

// Initialize copy link feature
addCopyLinkFeature();
