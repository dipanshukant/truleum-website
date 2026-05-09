// Popup Contact Form JS
function openPopupContactForm() {
  document.getElementById('popup-contact-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closePopupContactForm() {
  document.getElementById('popup-contact-overlay').style.display = 'none';
  document.body.style.overflow = '';
}
// Handle form submission
if (document.getElementById('popup-contact-form')) {
  document.getElementById('popup-contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
        // Send to WordPress AJAX handler
    formData.append('action', 'submit_popup_contact_form');
    // Add nonce for security
    const nonceField = form.querySelector('[name="popup_contact_nonce"]');
    if (nonceField) {
      formData.append('popup_contact_nonce', nonceField.value);
    }
    const resp = await fetch('/wp-admin/admin-ajax.php', {
      method: 'POST',
      body: formData
    });
    const data = await resp.json();
    if (data.success) {
      form.reset();
      document.getElementById('popup-form-success').style.display = 'block';
    } else {
      alert(data.data && data.data.message ? data.data.message : 'There was an error sending your message. Please try again.');
    }
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  });
}
// Close popup on overlay click
if (document.getElementById('popup-contact-overlay')) {
  document.getElementById('popup-contact-overlay').addEventListener('click', function(e) {
    if (e.target === this) closePopupContactForm();
  });
}
