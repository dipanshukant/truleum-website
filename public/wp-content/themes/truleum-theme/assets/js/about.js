/* About Us Page JavaScript - Extracted from inline events */

document.addEventListener('DOMContentLoaded', function() {
    
    // About image hover effects
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        aboutImage.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.03)';
        });
        
        aboutImage.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // About button hover effects
    const primaryBtn = document.querySelector('.about-btn-primary');
    if (primaryBtn) {
        primaryBtn.addEventListener('mouseover', function() {
            this.style.background = '#1a3a8f';
            this.style.transform = 'translateY(-3px)';
        });
        
        primaryBtn.addEventListener('mouseout', function() {
            this.style.background = '#0c1b4d';
            this.style.transform = 'translateY(0)';
        });
    }
    
    const secondaryBtn = document.querySelector('.about-btn-secondary');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('mouseover', function() {
            this.style.background = '#f1f1f1';
            this.style.transform = 'translateY(-3px)';
        });
        
        secondaryBtn.addEventListener('mouseout', function() {
            this.style.background = 'transparent';
            this.style.transform = 'translateY(0)';
        });
    }
    
    // Reason cards hover effects
    const reasonCards = document.querySelectorAll('.reason-card');
    reasonCards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
});
