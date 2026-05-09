// Hero Slideshow Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    const slides = document.querySelectorAll('.hero-slide');
    
    if (slides.length === 0) return; // Exit if no slides found
    
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;
    
    // Initialize slides - lazy load backgrounds
    const imageUrls = [];
    const loadedSlides = new Set();
    
    slides.forEach((slide, index) => {
        const bgUrl = slide.getAttribute('data-bg');
        if (bgUrl) {
            imageUrls.push(bgUrl);
            // Set basic styles only
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
            slide.style.backgroundRepeat = 'no-repeat';
            
            // Set initial visibility and z-index
            if (index === 0) {
                // Load first slide immediately
                slide.style.backgroundImage = `url('${bgUrl}')`;
                loadedSlides.add(index);
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.zIndex = '2';
            } else {
                // Don't load background yet - lazy loaded
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.zIndex = '1';
            }
        }
    });
    
    console.log('Slideshow initialized with', slides.length, 'slides (lazy loading enabled)');
    
    // Load slide background on demand
    function loadSlideBackground(index) {
        if (!loadedSlides.has(index) && imageUrls[index]) {
            slides[index].style.backgroundImage = `url('${imageUrls[index]}')`;
            loadedSlides.add(index);
            console.log('Lazy loaded slide', index);
        }
    }
    
    // Preload next image for smooth transitions
    function preloadNextImage(index) {
        const nextIndex = (index + 1) % slides.length;
        if (!loadedSlides.has(nextIndex) && imageUrls[nextIndex]) {
            const img = new Image();
            img.src = imageUrls[nextIndex];
            loadedSlides.add(nextIndex);
            slides[nextIndex].style.backgroundImage = `url('${imageUrls[nextIndex]}')`;
        }
    }
    
    // Initialize slideshow
    function initSlideshow() {
        console.log('Initializing slideshow with lazy loading...');
        // Preload second slide for smooth first transition
        preloadNextImage(0);
        
        // Start slideshow after a short delay
        setTimeout(() => {
            startSlideshow();
            console.log('Slideshow started');
        }, 500);
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        if (isTransitioning || slideIndex === currentSlide || slideIndex >= slides.length) return;
        
        isTransitioning = true;
        console.log('Changing from slide', currentSlide, 'to slide', slideIndex);
        
        // Load the target slide's background if not loaded
        loadSlideBackground(slideIndex);
        
        // Hide all slides first
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            slide.style.zIndex = '1';
            slide.style.opacity = '0';
        });
        
        // Update current slide index
        currentSlide = slideIndex;
        
        // Show new slide
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.zIndex = '2';
        slides[currentSlide].style.opacity = '1';
        
        console.log('Slide', slideIndex, 'is now active with background:', imageUrls[slideIndex]);
        
        // Preload next image for smooth transition
        preloadNextImage(currentSlide);
        
        // Reset transition flag
        setTimeout(() => {
            isTransitioning = false;
        }, 1600); // Match CSS transition duration (1.5s + buffer)
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    // Start automatic slideshow
    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);
        
        console.log('Starting slideshow timer...');
        
        // Change slide every 5 seconds
        slideInterval = setInterval(() => {
            if (!isTransitioning) {
                console.log('Auto-advancing to next slide');
                nextSlide();
            } else {
                console.log('Skipping slide change - transitioning:', isTransitioning);
            }
        }, 3000);
        
        console.log('Slideshow timer set for 6 second intervals');
    }
    
    // Pause slideshow
    function pauseSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        heroSection.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold && !isTransitioning) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
                goToSlide(prevIndex);
            }
        }
    }
    
    // Keyboard navigation (arrows only)
    document.addEventListener('keydown', function(e) {
        if (isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
                goToSlide(prevIndex);
                break;
            case 'ArrowRight':
                nextSlide();
                break;
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Restart slideshow after resize
            if (slideInterval) {
                pauseSlideshow();
                startSlideshow();
            }
        }, 250);
    });
    
    // Initialize everything
    initSlideshow();
    
    console.log('Hero slideshow setup complete');
    
    // Cleanup function for when page is unloaded
    window.addEventListener('beforeunload', function() {
        pauseSlideshow();
        if (observer && heroSection) {
            observer.unobserve(heroSection);
        }
    });
    
});
