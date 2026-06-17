loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                alert(data.detail || 'Something went wrong!');
                throw new Error('Authentication failed');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
           console.log("Saving username:", data.username);  // چک کردن نام کاربری قبل از ذخیره کردن

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            console.log(data.role);
            switch(data.role) {
                case 'admin':
                    window.location.href = '/admin-dashboard/';
                    break;
                case 'customer':
                    window.location.href = '/customer-dashboard/';
                    break;
                case 'author':
                    window.location.href = '/author-dashboard/';
                    break;
                default:
                    alert('Unknown role!');
                    break;
            }
        }
        else {
            alert('نام کاربری یا رمز عبور اشتباه است.');
        }
    })
    .catch(error => {
        console.error(error);
    });
});

