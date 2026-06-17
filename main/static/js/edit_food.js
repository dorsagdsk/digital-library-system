document.addEventListener("DOMContentLoaded", function() {
    const foodId = window.location.pathname.split('/')[2];

    fetch(`/api/foods_admin/${foodId}/`, {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch food data');
        }
        return response.json();
    })
    .then(data => {
        // پر کردن فرم با داده‌های غذا
        document.getElementById('name').value = data.name;
        document.getElementById('category').value = data.category;
        document.getElementById('description').value = data.description;
        document.getElementById('price').value = data.price;

        // تنظیم تصویر
        const foodImage = document.getElementById('food-image'); // فرض می‌کنیم که این یک تگ <img> است
        if (data.image) {
            foodImage.src = `${data.image}`;
        } else {
            foodImage.src = '/static/images/default_food.jpg';  // تصویر پیش‌فرض
        }

        // اگر نیاز به تنظیم مقدار فایل داشتید (که معمولاً این کار را برای فایل‌ها انجام نمی‌دهید):
        // document.getElementById('image').value = ''; // این خط را به هیچ وجه نباید تنظیم کنید
    })
    .catch(error => {
        console.error('Error fetching food data:', error);
    });

    // ارسال فرم و ذخیره تغییرات
    document.getElementById('edit-food-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch(`/api/foods_admin/${foodId}/`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('اطلاعات غذا با موفقیت ذخیره شد');
            window.location.href = '/admin-dashboard/';
        })
        .catch(error => console.error('Error:', error));
    });
});
