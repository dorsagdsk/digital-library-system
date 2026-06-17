document.addEventListener('DOMContentLoaded', () => {
    const addDiscountForm = document.getElementById('add-discount-form');
    const messageContainer = document.getElementById('message-container');

    // Get CSRF Token from cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Display messages
    function showMessage(message, type) {
        if (messageContainer) {
            messageContainer.innerHTML = '';
            const p = document.createElement('p');
            p.className = `message ${type}`;
            p.textContent = message;
            messageContainer.appendChild(p);

            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 5000);
        } else {
            console.log(`Message (${type}): ${message}`);
        }
    }

    addDiscountForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addDiscountForm);
        const data = Object.fromEntries(formData.entries());

        // Validation
        const code = data.code;
        const percentage = parseFloat(data.percentage);
        const expirationDate = data.expiration_date;

        if (!code) {
            showMessage('Discount code is required.', 'error');
            return;
        }
        if (code.length !== 8) {
            showMessage('Discount code must be exactly 8 characters.', 'error');
            return;
        }
        if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
            showMessage('Percentage must be between 1 and 100.', 'error');
            return;
        }
        if (!expirationDate) {
            showMessage('Expiration date is required.', 'error');
            return;
        }

        const selectedDate = new Date(expirationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
            showMessage('Expiration date must be in the future.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/discounts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(result.message || 'Discount code added successfully!', 'success');
                addDiscountForm.reset();
            } else {
                let errorMessage = 'Failed to add discount code.';
                if (result) {
                    const errorKeys = Object.keys(result);
                    if (errorKeys.length > 0) {
                        errorMessage = errorKeys.map(key => {
                            const errorValue = result[key];
                            if (Array.isArray(errorValue)) {
                                return `${key}: ${errorValue.join(', ')}`;
                            }
                            return `${key}: ${errorValue}`;
                        }).join('; ');
                    } else if (result.detail) {
                        errorMessage = result.detail;
                    }
                }
                showMessage(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Error adding discount code:', error);
            showMessage('An unexpected error occurred. Please try again.', 'error');
        }
    });
});
