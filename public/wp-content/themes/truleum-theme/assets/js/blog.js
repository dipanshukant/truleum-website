/**
 * Blog Page JavaScript
 * Handles filtering, load more, and newsletter functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Blog Post Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            blogPosts.forEach(post => {
                const category = post.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    post.style.display = 'block';
                    post.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
    
    // Load More Functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let currentPage = 1;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Show loading state
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Simulate loading (in real implementation, this would be an AJAX call)
            setTimeout(() => {
                // Reset button
                this.textContent = 'Load More Articles';
                this.disabled = false;
                
                // In a real implementation, you would load more posts here
                console.log('Loading more posts...');
            }, 1000);
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate subscription (in real implementation, this would be an AJAX call)
            setTimeout(() => {
                // Show success message
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
    }
    
    // Smooth scroll for post links
    const postLinks = document.querySelectorAll('.post-link, .read-more-btn, .read-more');
    
    postLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add a subtle animation effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe blog post cards for scroll animations
    blogPosts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        post.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(post);
    });
    
    // Observe other elements
    const animatedElements = document.querySelectorAll('.featured-post, .section-title, .blog-newsletter');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        observer.observe(element);
    });
    
    // Add CSS for fadeInUp animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            0% {
                opacity: 0;
                transform: translateY(30px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Reading time calculation (if not using a plugin)
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return time;
}

// Add reading time to posts (if needed)
document.addEventListener('DOMContentLoaded', function() {
    const posts = document.querySelectorAll('.blog-post-card, .featured-post');
    
    posts.forEach(post => {
        const readTimeElement = post.querySelector('.read-time');
        if (readTimeElement && readTimeElement.textContent.includes('[reading_time]')) {
            const content = post.querySelector('.post-excerpt, .featured-post-excerpt');
            if (content) {
                const readingTime = calculateReadingTime(content.textContent);
                readTimeElement.textContent = `${readingTime} min read`;
            }
        }
    });
});
