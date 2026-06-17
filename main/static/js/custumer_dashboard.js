document.addEventListener('DOMContentLoaded', () => {
    /* ---------- پیمایش منوی کناری ---------- */
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('.main-content .section');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display = ('#' + section.id === sectionId) ? 'block' : 'none';
        });
        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === sectionId);
        });
        history.pushState(null, '', sectionId);
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showSection(link.getAttribute('href'));
        });
    });

    /* ---------- بارگذاری بخش اولیه ---------- */
    showSection(window.location.hash || '#profile');

    /* ---------- لاگ‌اوت ---------- */
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            fetch('/api/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                credentials: 'include', // در صورت نیاز به ارسال کوکی
            })
                .then(response => {
                    if (response.ok) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('username');
                        alert('You have been logged out successfully!');
                        window.location.href = 'http://127.0.0.1:8000'; // تغییر مسیر به صفحه لاگین
                    } else {
                        response.json().then(data => {
                            alert(data.detail || 'Logout failed.');
                        });
                    }
                })
                .catch(error => {
                    console.error('Error during logout:', error);
                    alert('خطا در هنگام لاگ‌اوت. لطفاً دوباره تلاش کنید.');
                });
        });
    }

    /* ---------- دکمه افزودن به سبد خرید (نمونه) ---------- */
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const bookId = btn.dataset.bookId;
            console.log('Adding book to cart:', bookId);
            alert(`کتاب با شناسه ${bookId} به سبد خرید اضافه شد (شبیه‌سازی).`);
        });
    });

    /* ---------- دکمه ویرایش پروفایل (نمونه) ---------- */
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', e => {
            e.preventDefault();
            alert('عملیات ویرایش پروفایل در اینجا انجام می‌شود.');
        });
    }

    /* ---------- تابع کمکی گرفتن CSRF از کوکی (در صورت نیاز) ---------- */
    function getCookie(name) {
        return document.cookie
            .split(';')
            .map(c => c.trim())
            .find(c => c.startsWith(name + '='))?.split('=')[1] ?? null;
    }
});
