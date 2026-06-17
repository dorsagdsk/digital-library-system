document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

});

document.getElementById('logout-button').addEventListener('click', function (event) {
    event.preventDefault(); // جلوگیری از رفتار پیش‌فرض لینک

    // ارسال درخواست به API لاگ‌اوت
    fetch('/api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // ارسال کوکی‌ها برای احراز هویت
    })
    .then(response => {
        if (response.ok) {
            // موفقیت در لاگ‌اوت
            localStorage.removeItem('token'); // حذف توکن از localStorage

            // تنظیم کوکی‌ها به مقدار خالی برای حذف آن‌ها
            document.cookie.split(";").forEach(function (cookie) {
                let name = cookie.split("=")[0].trim();
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            });

            alert('Successfully logged out!');
            window.location.href = 'http://127.0.0.1:8000'; // بازگشت به صفحه اصلی
        } else {
            // مدیریت خطا
            return response.json().then(data => {
                alert(data.detail || 'Error logging out.');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during logout.');
    });
});
