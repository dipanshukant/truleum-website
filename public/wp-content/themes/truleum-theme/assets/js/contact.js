/**
 * Contact Form JavaScript
 * Handles form validation, submission, and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quote-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const successMessage = document.getElementById('form-success');

    // Form validation rules
    const validationRules = {
        'full_name': {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s'-]+$/,
            message: 'Please enter a valid full name (letters, spaces, hyphens, and apostrophes only)'
        },
        'email': {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        'phone': {
            required: false,
            pattern: /^[\d\s\-\+\(\)]+$/,
            message: 'Please enter a valid phone number'
        }
    };

    // Real-time validation
    function validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = validationRules[fieldName];
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        // Clear previous error state
        formGroup.classList.remove('error');
        errorElement.textContent = '';

        if (!rules) return true;

        // Check required fields
        if (rules.required && !value) {
            showFieldError(formGroup, errorElement, 'This field is required');
            return false;
        }

        // Skip other validations if field is empty and not required
        if (!value && !rules.required) return true;

        // Check minimum length
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(formGroup, errorElement, `Minimum ${rules.minLength} characters required`);
            return false;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(formGroup, errorElement, rules.message);
            return false;
        }

        // Field is valid
        formGroup.classList.add('valid');
        return true;
    }

    function showFieldError(formGroup, errorElement, message) {
        formGroup.classList.add('error');
        errorElement.textContent = message;
    }

    // Add event listeners for real-time validation
    const validatedFields = ['full_name', 'email', 'phone'];
    validatedFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                // Clear error state on input
                const formGroup = field.closest('.form-group');
                if (formGroup.classList.contains('error')) {
                    setTimeout(() => validateField(field), 500);
                }
            });
        }
    });

    // Handle "Other" input fields
    function setupOtherInputs() {
        const otherRadios = form.querySelectorAll('input[value="other"]');
        otherRadios.forEach(radio => {
            const otherInput = radio.parentElement.querySelector('.other-input');
            if (otherInput) {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        otherInput.focus();
                        otherInput.required = true;
                    }
                });

                // Handle other radio buttons in the same group
                const groupName = radio.name;
                const groupRadios = form.querySelectorAll(`input[name="${groupName}"]`);
                groupRadios.forEach(groupRadio => {
                    if (groupRadio !== radio) {
                        groupRadio.addEventListener('change', () => {
                            if (groupRadio.checked) {
                                otherInput.required = false;
                                otherInput.value = '';
                            }
                        });
                    }
                });
            }
        });
    }

    // Form submission
    function handleFormSubmission(e) {
        e.preventDefault();

        // Validate all required fields
        let isFormValid = true;
        validatedFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field && !validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Scroll to first error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        submitForm();
    }

    function submitForm() {
        if (!validateForm()) return;

        setLoadingState(true);

        // Check if truleum_ajax is available
        if (typeof truleum_ajax === 'undefined') {
            console.error('truleum_ajax object not found');
            showErrorMessage('Configuration error. Please refresh the page and try again.');
            setLoadingState(false);
            return;
        }

        console.log('truleum_ajax object:', truleum_ajax);

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Add security nonce and action
        formData.append('action', truleum_ajax.action);
        formData.append('nonce', truleum_ajax.nonce);
        
        // Add honeypot fields for spam protection
        formData.append('website', '');
        formData.append('url', '');

        // Submit form via AJAX
        fetch(truleum_ajax.ajax_url, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            return response.text();
        })
        .then(text => {
            console.log('Raw response:', text);
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('JSON parse error:', e);
                throw new Error('Invalid JSON response');
            }
            
            if (data.success) {
                // Check if we should redirect to Thank You page
                if (data.redirect) {
                    // Show brief success message then redirect
                    showSuccessMessage();
                    setTimeout(() => {
                        window.location.href = data.redirect;
                    }, 1500);
                } else {
                    showSuccessMessage();
                }
            } else {
                showErrorMessage(data.message || 'Something went wrong. Please try again.');
                
                // Handle field-specific errors
                if (data.errors) {
                    Object.keys(data.errors).forEach(fieldName => {
                        const field = form.querySelector(`[name="${fieldName}"]`);
                        if (field) {
                            const formGroup = field.closest('.form-group');
                            const errorElement = formGroup.querySelector('.error-message');
                            showFieldError(formGroup, errorElement, data.errors[fieldName]);
                        }
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('Network error. Please check your connection and try again.');
        })
        .finally(() => {
            setLoadingState(false);
        });
    }

    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnText.style.opacity = '0';
            btnLoader.style.display = 'block';
        } else {
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
        }
    }

    function showSuccessMessage() {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showErrorMessage(message) {
        alert(message); // Replace with better error handling
    }

    // Enhanced form interactions
    function enhanceFormInteractions() {
        // Add focus animations to form groups
        const formInputs = form.querySelectorAll('.form-input, .form-textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });

        // Add hover effects to radio options
        const radioOptions = form.querySelectorAll('.radio-option');
        radioOptions.forEach(option => {
            option.addEventListener('click', () => {
                const radio = option.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                }
            });
        });

        // Auto-resize textareas
        const textareas = form.querySelectorAll('.form-textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        });
    }

    // Character counter for textareas (optional enhancement)
    function addCharacterCounters() {
        const textareas = form.querySelectorAll('.form-textarea');
        textareas.forEach(textarea => {
            const maxLength = textarea.getAttribute('maxlength');
            if (maxLength) {
                const counter = document.createElement('div');
                counter.className = 'character-counter';
                counter.style.cssText = 'text-align: right; font-size: 0.8rem; color: #666; margin-top: 5px;';
                
                const updateCounter = () => {
                    const remaining = maxLength - textarea.value.length;
                    counter.textContent = `${remaining} characters remaining`;
                    counter.style.color = remaining < 50 ? '#dc2626' : '#666';
                };

                textarea.addEventListener('input', updateCounter);
                textarea.parentElement.appendChild(counter);
                updateCounter();
            }
        });
    }

    // Initialize all functionality
    function init() {
        setupOtherInputs();
        enhanceFormInteractions();
        // addCharacterCounters(); // Uncomment if you want character counters

        // Add form submission handler
        form.addEventListener('submit', handleFormSubmission);

        console.log('Contact form initialized');
    }

    // Start the form
    init();

    // Add smooth animations on page load
    setTimeout(() => {
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 300);
});

// Add initial styles for form group animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .form-group.focused {
            transform: scale(1.02);
        }
        
        .form-input:focus,
        .form-textarea:focus {
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1), 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .radio-option:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
});
