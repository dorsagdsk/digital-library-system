document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('add-food-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form); // ایجاد شیء FormData از فرم

        // برای بررسی اینکه تصویر به درستی به formData اضافه شده، می‌توانید این کد را استفاده کنید
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

     fetch('/api/add-food/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token ' + localStorage.getItem('token')
    },
    body: formData
})
.then(response => response.json())
.then(data => {
    if (data.id) {
        alert('غذا با موفقیت اضافه شد');
        window.location.href = '/admin-dashboard/';
    } else {
        console.log('خطا در افزودن غذا:', data);  // بررسی جزئیات خطا
        alert('خطا در افزودن غذا');
    }
})
.catch(error => {
    console.error('Error:', error);
});

    });
});
