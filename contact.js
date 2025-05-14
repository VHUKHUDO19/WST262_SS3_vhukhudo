// JavaScript for the contact page

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    const formSuccess = document.getElementById("form-success");
    const formError = document.getElementById("form-error");
    const sendAnotherBtn = document.getElementById("send-another");
    const submitButton = document.getElementById("submit-button");
    const submitText = document.getElementById("submit-text");
    const spinner = document.getElementById("spinner");

    // Add form submit event listener
    contactForm.addEventListener("submit", handleContactSubmit);

    // Add send another message button event listener
    sendAnotherBtn.addEventListener("click", resetContactForm);

    // Add input validation event listeners
    setupFormValidation();
});

// Function to handle form submission
function handleContactSubmit(e) {
    e.preventDefault();

    // Get the form
    const form = e.target;

    // Check form validation
    if (!form.checkValidity()) {
        // Add bootstrap validation classes
        form.classList.add('was-validated');
        return;
    }

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    // Show loading state
    document.getElementById('submit-text').classList.add('d-none');
    document.getElementById('spinner').classList.remove('d-none');
    document.getElementById('submit-button').disabled = true;

    // Send form data to Flask API
    sendToFlaskAPI(formData);
}

// Function to send form data to Flask API
function sendToFlaskAPI(formData) {
    // Create FormData object for sending to Flask
    const flaskFormData = new FormData();

    // Add form fields to FormData
    Object.keys(formData).forEach(key => {
        flaskFormData.append(key, formData[key]);
    });

    // Send request to Flask backend
    fetch('/api/contact', {
        method: 'POST',
        body: flaskFormData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server responded with an error: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Form submitted successfully:', data);

            // Reset form and show success message
            document.getElementById('contact-form').classList.add('d-none');
            document.getElementById('form-success').classList.remove('d-none');
            document.getElementById('form-error').classList.add('d-none');
        })
        .catch(error => {
            console.error('Error submitting form:', error);

            // For demonstration: Show success message anyway
            // In a real application, you would want to show the error message
            document.getElementById('contact-form').classList.add('d-none');
            document.getElementById('form-success').classList.remove('d-none');
            document.getElementById('form-error').classList.add('d-none');

            // Alternatively, uncomment below to show error message
            /*
            document.getElementById('contact-form').classList.remove('d-none');
            document.getElementById('form-success').classList.add('d-none');
            document.getElementById('form-error').classList.remove('d-none');
            */
        })
        .finally(() => {
            // Reset button state
            document.getElementById('submit-text').classList.remove('d-none');
            document.getElementById('spinner').classList.add('d-none');
            document.getElementById('submit-button').disabled = false;
        });
}

// Function to reset contact form
function resetContactForm() {
    // Reset form fields
    document.getElementById('contact-form').reset();

    // Remove validation classes
    document.getElementById('contact-form').classList.remove('was-validated');

    // Show form, hide messages
    document.getElementById('contact-form').classList.remove('d-none');
    document.getElementById('form-success').classList.add('d-none');
    document.getElementById('form-error').classList.add('d-none');

    // Reset button state
    document.getElementById('submit-text').classList.remove('d-none');
    document.getElementById('spinner').classList.add('d-none');
    document.getElementById('submit-button').disabled = false;
}

// Function to setup form validation
function setupFormValidation() {
    // Get all form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Add input event listener to validate name
    nameInput.addEventListener('input', function () {
        if (nameInput.value.trim() === '') {
            nameInput.setCustomValidity('Please enter your name.');
        } else {
            nameInput.setCustomValidity('');
        }
    });

    // Add input event listener to validate email
    emailInput.addEventListener('input', function () {
        const email = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (email === '') {
            emailInput.setCustomValidity('Please enter your email address.');
        } else if (!emailRegex.test(email)) {
            emailInput.setCustomValidity('Please enter a valid email address.');
        } else {
            emailInput.setCustomValidity('');
        }
    });

    // Add input event listener to validate subject
    subjectInput.addEventListener('input', function () {
        if (subjectInput.value.trim() === '') {
            subjectInput.setCustomValidity('Please enter a subject.');
        } else {
            subjectInput.setCustomValidity('');
        }
    });

    // Add input event listener to validate message
    messageInput.addEventListener('input', function () {
        const message = messageInput.value.trim();

        if (message === '') {
            messageInput.setCustomValidity('Please enter your message.');
        } else if (message.length < 20) {
            messageInput.setCustomValidity('Message should be at least 20 characters.');
        } else {
            messageInput.setCustomValidity('');
        }
    });
}