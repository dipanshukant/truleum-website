document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const albumCards = document.querySelectorAll('.album-card');
    const galleryModal = document.getElementById('galleryModal');
    const modalTitle = document.querySelector('.modal-title');
    const modalGalleryGrid = document.querySelector('.gallery-modal .gallery-grid');
    const closeModalButton = document.querySelector('.close-modal');
    const galleryData = document.querySelector('.gallery-data');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxContent = document.querySelector('.lightbox-content');
    const lightboxCloseButton = document.querySelector('.lightbox-close');
    let lightboxSafeOpenUntil = 0; // Ignore background clicks until this time
    let lightboxLockUntil = 0; // Ignore any close attempts until this time

    // --- Category Name Mapping ---
    const categoryNames = {
        'house-extension': 'House Extension',
        'loft-conversion': 'Loft Conversion',
        'kitchen-refurbishment': 'Kitchen Refurbishment',
        'bathroom-renovation': 'Bathroom Renovation'
    };

    // --- Auto-open category from URL parameter ---
    function checkURLForCategory() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category && categoryNames[category]) {
            // Find the album card for this category and trigger click
            const targetCard = document.querySelector(`[data-category="${category}"]`);
            if (targetCard) {
                setTimeout(() => {
                    targetCard.click();
                }, 100);
            }
        }
    }

    // --- Main Gallery Modal ---
    function openGalleryModal() {
        galleryModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => galleryModal.classList.add('is-open'), 10);
    }

    function closeGalleryModal() {
        galleryModal.classList.remove('is-open');
        setTimeout(() => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 600); // Match CSS transition duration
    }

    albumCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const categoryMedia = galleryData.querySelector(`.category-images[data-category="${category}"]`);

            if (categoryMedia) {
                modalTitle.textContent = categoryNames[category] || 'Gallery';
                modalGalleryGrid.innerHTML = ''; // Clear previous items

                const mediaItems = categoryMedia.querySelectorAll('img, video');
                mediaItems.forEach(media => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    let mediaElement;

                    if (media.tagName === 'IMG') {
                        mediaElement = document.createElement('img');
                        mediaElement.src = media.src;
                        mediaElement.alt = media.alt;
                        mediaElement.loading = 'lazy';
                    } else if (media.tagName === 'VIDEO') {
                        mediaElement = document.createElement('video');
                        mediaElement.src = media.src;
                        mediaElement.alt = media.alt;
                        mediaElement.muted = true;
                        mediaElement.loop = true;
                        mediaElement.setAttribute('playsinline', '');
                        galleryItem.addEventListener('mouseenter', () => mediaElement.play());
                        galleryItem.addEventListener('mouseleave', () => { mediaElement.pause(); mediaElement.currentTime = 0; });
                    }

                    const overlay = document.createElement('div');
                    overlay.className = 'image-overlay';

                    const zoomIcon = document.createElement('div');
                    zoomIcon.className = 'zoom-icon';
                    zoomIcon.innerHTML = `<i class="fas ${media.tagName === 'VIDEO' ? 'fa-play' : 'fa-search-plus'}"></i>`;

                    galleryItem.appendChild(mediaElement);
                    galleryItem.appendChild(overlay);
                    galleryItem.appendChild(zoomIcon);
                    modalGalleryGrid.appendChild(galleryItem);

                    galleryItem.addEventListener('click', (e) => {
                        // Prevent other click handlers (from older gallery.js) from running
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation(); // Prevents click from reaching the galleryModal background
                        openLightbox(media.src, media.alt, media.tagName);
                    });
                });

                openGalleryModal();
            }
        });
    });

    // Prevent clicks inside content from closing the lightbox
    if (lightboxContent) {
        lightboxContent.addEventListener('click', (e) => e.stopPropagation());
    }

    // --- Simple Lightbox Modal ---
    let lightboxKeepAliveTimer = null;

    function openLightbox(src, alt, type = 'IMG') {
        lightboxContent.innerHTML = '';
        let mediaElement;

        if (type === 'IMG') {
            mediaElement = document.createElement('img');
            mediaElement.className = 'lightbox-image';
            mediaElement.src = src;
            mediaElement.alt = alt;
        } else if (type === 'VIDEO') {
            mediaElement = document.createElement('video');
            mediaElement.className = 'lightbox-video';
            mediaElement.src = src;
            mediaElement.alt = alt;
            mediaElement.controls = true;
            mediaElement.autoplay = true;
        }

        if (mediaElement) {
            mediaElement.style.opacity = '1';
            mediaElement.style.visibility = 'visible';
            lightboxContent.appendChild(mediaElement);
        }

        lightboxModal.style.display = 'block';
        lightboxModal.style.opacity = '1';
        // Set a short safety window to ignore immediate background clicks
        lightboxSafeOpenUntil = Date.now() + 700; // ms
        // Also lock close calls briefly to detect unintended closes
        lightboxLockUntil = Date.now() + 1500; // ms
        console.log('[Lightbox] openLightbox', { src, type, at: new Date().toISOString() });

        // Temporarily disable the close button to prevent accidental/ghost closes
        if (lightboxCloseButton) {
            lightboxCloseButton.style.pointerEvents = 'none';
            setTimeout(() => {
                lightboxCloseButton.style.pointerEvents = '';
            }, 1200);
        }

        // Keep-alive: force media to remain visible for 2 seconds
        const keepAliveUntil = Date.now() + 2000;
        const ensureVisible = () => {
            if (!mediaElement || Date.now() > keepAliveUntil) {
                clearInterval(lightboxKeepAliveTimer);
                lightboxKeepAliveTimer = null;
                return;
            }
            try {
                mediaElement.style.opacity = '1';
                mediaElement.style.visibility = 'visible';
                mediaElement.style.display = '';
            } catch (err) { /* noop */ }
        };
        ensureVisible();
        lightboxKeepAliveTimer = setInterval(ensureVisible, 120);
    }

    function closeLightboxWithReason(reason) {
        if (Date.now() < lightboxLockUntil) {
            console.warn('[Lightbox] Close ignored due to lock', { reason, now: Date.now(), lockUntil: lightboxLockUntil });
            return;
        }
        console.log('[Lightbox] closeLightbox called', { reason, at: new Date().toISOString() });
        lightboxModal.style.opacity = '0';
        const video = lightboxContent.querySelector('video');
        if (video) video.pause();
        if (lightboxKeepAliveTimer) {
            clearInterval(lightboxKeepAliveTimer);
            lightboxKeepAliveTimer = null;
        }
        lightboxModal.style.display = 'none';
        lightboxContent.innerHTML = '';
    }

    // Backwards-compat alias
    function closeLightbox() { closeLightboxWithReason('generic'); }

    // --- Event Listeners for Closing ---
    closeModalButton.addEventListener('click', closeGalleryModal);
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) closeGalleryModal();
    });

    lightboxCloseButton.addEventListener('click', () => closeLightboxWithReason('close_button'));
    
    // TEMP: disable background-click-to-close while we debug disappearing issue
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === this) {
            if (Date.now() < lightboxSafeOpenUntil) return; // ignore ghosts
            console.log('[Lightbox] Background click captured (disabled close during debug)');
            // To re-enable, replace the next line with: closeLightboxWithReason('background_click')
            return;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightboxModal.style.display === 'block') {
                closeLightboxWithReason('escape_key');
            } else if (galleryModal.style.display === 'block') {
                closeGalleryModal();
            }
        }
    });

    // --- Initial Page Load Animations ---
    albumCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.15}s both`;
    });

    // --- Check for URL category parameter on page load ---
    checkURLForCategory();

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});
