document.addEventListener('DOMContentLoaded', () => {
    const addAuthorForm = document.getElementById('addAuthorForm');
    const messageDiv = document.getElementById('message');

    if (addAuthorForm) {
        addAuthorForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById('authorUsername').value;
            const password = document.getElementById('authorPassword').value;
            const firstName = document.getElementById('authorFirstName').value;
            const lastName = document.getElementById('authorLastName').value;
            const contactNumber = document.getElementById('authorContactNumber').value;

            // No need to get token from localStorage if it's an HTTP-only cookie
            // The browser will automatically send HTTP-only cookies with the request
            // when `credentials: 'include'` is used in fetch.

            const formData = {
                username: username,
                password: password,
                first_name: firstName,
                last_name: lastName,
                contact_number: contactNumber,
                // role will be set to 'author' by the backend (AddAuthorAPIView)
            };

            try {
                const response = await fetch('/api/authors/add/', { // Your API endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // X-CSRFToken is usually needed for POST requests in Django for session-based auth.
                        // If you're using TokenAuthentication with an HTTP-only cookie,
                        // DRF's TokenAuthentication usually handles this automatically by looking for the token.
                        // However, if you encounter 403 Forbidden, you might need to manually retrieve and send CSRF.
                        // For now, let's rely on TokenAuthentication and the cookie.
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include', // This is crucial for sending HTTP-only cookies
                });

                const data = await response.json();

                if (response.ok) { // Check for 2xx status codes
                    messageDiv.textContent = 'نویسنده با موفقیت اضافه شد!'; // Author added successfully!
                    messageDiv.style.color = 'green';
                    addAuthorForm.reset(); // Clear the form
                    // Optionally, redirect or update a list of authors
                } else {
                    // Handle API errors (e.g., validation errors from serializer)
                    let errorMessage = 'خطا در افزودن نویسنده: '; // Error adding author:
                    if (data.detail) {
                        errorMessage += data.detail;
                    } else if (data.username) {
                        errorMessage += `نام کاربری: ${data.username.join(', ')}`; // Username error
                    } else if (data.password) {
                        errorMessage += `رمز عبور: ${data.password.join(', ')}`; // Password error
                    } else if (data.first_name) {
                        errorMessage += `نام: ${data.first_name.join(', ')}`; // First name error
                    } else if (data.last_name) {
                        errorMessage += `نام خانوادگی: ${data.last_name.join(', ')}`; // Last name error
                    } else {
                        errorMessage += JSON.stringify(data); // Fallback for other errors
                    }
                    messageDiv.textContent = errorMessage;
                    messageDiv.style.color = 'red';
                }
            } catch (error) {
                console.error('Fetch error:', error);
                messageDiv.textContent = 'خطای شبکه یا سرور. لطفاً دوباره تلاش کنید.'; // Network or server error. Please try again.
                messageDiv.style.color = 'red';
            }
        });
    } else {
        console.error('Form with ID "addAuthorForm" not found.');
    }
});