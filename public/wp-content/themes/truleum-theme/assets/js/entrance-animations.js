/**
 * Entrance Animations for All Website Elements
 * Triggers animations when elements come into viewport
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // If user prefers reduced motion, show all elements immediately
        const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .section, section, .container, .content-section, .cta-btn, .btn, button, .enquire-btn, img, .image-container, .gallery-item, .card, .service-card, .process-step, .grid-item');
        allElements.forEach(el => el.classList.add('animate-in'));
        return;
    }

    // Intersection Observer options
    const observerOptions = {
        threshold: 0.06,
        rootMargin: '0px 0px 100px 0px'
    };

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Stop observing this element once it's animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Function to add staggered delays to child elements
    function addStaggeredDelays(container, childSelector) {
        const children = container.querySelectorAll(childSelector);
        children.forEach((child, index) => {
            if (index < 6) {
                child.classList.add(`animate-delay-${index + 1}`);
            }
        });
    }

    // Initialize animations after a short delay to ensure page is ready
    setTimeout(() => {
        // Target all headings
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            observer.observe(heading);
        });

        // Target all paragraphs
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(paragraph => {
            observer.observe(paragraph);
        });

        // Target all sections and containers
        const sections = document.querySelectorAll('.section, section, .container, .content-section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Target all buttons and CTAs
        const buttons = document.querySelectorAll('.cta-btn, .btn, button, .enquire-btn');
        buttons.forEach(button => {
            observer.observe(button);
        });

        // Target all images
        const images = document.querySelectorAll('img, .image-container, .gallery-item');
        images.forEach(image => {
            observer.observe(image);
        });

        // Target all cards and grid items
        const cards = document.querySelectorAll('.card, .service-card, .process-step, .grid-item');
        cards.forEach(card => {
            observer.observe(card);
        });

        // Add staggered animations to specific containers
        const serviceGrids = document.querySelectorAll('.services-grid, .process-steps, .gallery-grid');
        serviceGrids.forEach(grid => {
            addStaggeredDelays(grid, '.service-card, .process-step, .gallery-item');
        });

        // Special handling for hero section - animate immediately with stagger
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            const heroH1 = heroText.querySelector('h1');
            const heroP = heroText.querySelector('p');
            const heroBtn = heroText.querySelector('.cta-btn');

            setTimeout(() => {
                if (heroH1) heroH1.classList.add('animate-in');
            }, 500);
            
            setTimeout(() => {
                if (heroP) heroP.classList.add('animate-in');
            }, 700);
            
            setTimeout(() => {
                if (heroBtn) heroBtn.classList.add('animate-in');
            }, 900);
        }

        // Handle elements that might be added dynamically
        const dynamicObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const elementsToAnimate = node.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .section, section, .container, .content-section, .cta-btn, .btn, button, .enquire-btn, img, .image-container, .gallery-item, .card, .service-card, .process-step, .grid-item');
                        elementsToAnimate.forEach(el => observer.observe(el));
                    }
                });
            });
        });

        // Start observing for dynamic content
        dynamicObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

    }, 100); // Small delay to ensure DOM is fully ready

    // Debug logging (can be removed in production)
    console.log('Entrance animations initialized');
});
