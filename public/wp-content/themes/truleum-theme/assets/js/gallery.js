// Gallery Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all gallery items and lightbox elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let images = [];
    
    // Collect all image data
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-image');
        const title = item.querySelector('.gallery-title').textContent;
        const description = item.querySelector('.gallery-description').textContent;
        
        images.push({
            src: img.src,
            alt: img.alt,
            title: title,
            description: description
        });
        
        // Add click event to open lightbox
        item.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox();
        });
    });
    
    // Open lightbox function
    function openLightbox() {
        const currentImage = images[currentImageIndex];
        
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        lightboxTitle.textContent = currentImage.title;
        lightboxDescription.textContent = currentImage.description;
        
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add fade in animation
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    }
    
    // Close lightbox function
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }, 300);
    }
    
    // Navigate to previous image
    function prevImage() {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        updateLightboxImage();
    }
    
    // Navigate to next image
    function nextImage() {
        currentImageIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        updateLightboxImage();
    }
    
    // Update lightbox image with animation
    function updateLightboxImage() {
        const currentImage = images[currentImageIndex];
        
        // Fade out
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.alt;
            lightboxTitle.textContent = currentImage.title;
            lightboxDescription.textContent = currentImage.description;
            
            // Fade in
            lightboxImage.style.opacity = '1';
        }, 150);
    }
    
    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                nextImage();
            } else {
                // Swipe right - previous image
                prevImage();
            }
        }
    }
    
    // Smooth scroll animation for gallery items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all gallery items for scroll animation
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
});
