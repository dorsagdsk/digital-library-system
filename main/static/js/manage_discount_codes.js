// document.addEventListener('DOMContentLoaded', () => {
//     const addDiscountForm = document.getElementById('add-discount-form');
//     const discountCodesList = document.getElementById('discount-codes-list');
//     const messageContainer = document.getElementById('message-container');
//     const submitButton = document.getElementById('submit-button');

//     let editingCodeId = null; // برای پیگیری کدی که در حال ویرایش است

//     // تابع برای گرفتن CSRF Token از کوکی
//     function getCookie(name) {
//         let cookieValue = null;
//         if (document.cookie && document.cookie !== '') {
//             const cookies = document.cookie.split(';');
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i].trim();
//                 // Does this cookie string begin with the name we want?
//                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }

//     // تابع برای نمایش پیام‌ها (موفقیت/خطا)
//     function showMessage(message, type) {
//         if (messageContainer) {
//             messageContainer.textContent = message;
//             messageContainer.className = `message ${type}`; // اضافه کردن کلاس CSS برای استایل
//             setTimeout(() => {
//                 messageContainer.textContent = '';
//                 messageContainer.className = 'message'; // پاک کردن کلاس‌ها بعد از 5 ثانیه
//             }, 5000);
//         } else {
//             console.log(`Message (${type}): ${message}`);
//         }
//     }

//     // تابع برای واکشی کدهای تخفیف از API و نمایش آن‌ها
//     async function fetchDiscountCodes() {
//         try {
//             const response = await fetch('/api/discounts/', { // استفاده از مسیر API برای لیست
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken'),
//                     'Content-Type': 'application/json', // معمولاً برای GET لازم نیست اما ضرری هم نداره
//                 },
//             });
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || 'خطا در بارگذاری کدهای تخفیف.');
//             }
//             const codes = await response.json();
//             renderDiscountCodes(codes); // فراخوانی تابع برای رندر کردن کدها
//         } catch (error) {
//             console.error('Error fetching discount codes:', error);
//             showMessage(`خطا در بارگذاری کدهای تخفیف: ${error.message}`, 'error');
//         }
//     }

//     // تابع برای رندر کردن کدهای تخفیف در جدول HTML
//     function renderDiscountCodes(codes) {
//         discountCodesList.innerHTML = ''; // پاک کردن محتوای قبلی جدول
//         if (codes.length === 0) {
//             discountCodesList.innerHTML = '<tr><td colspan="8">کد تخفیفی یافت نشد.</td></tr>';
//             return;
//         }

//         codes.forEach(code => {
//             const row = document.createElement('tr');
//             // فرمت دهی تاریخ و زمان برای نمایش خواناتر
//             const validFrom = new Date(code.valid_from).toLocaleString('fa-IR', {
//                 year: 'numeric', month: '2-digit', day: '2-digit',
//                 hour: '2-digit', minute: '2-digit', hour12: false
//             });
//             const validUntil = new Date(code.valid_until).toLocaleString('fa-IR', {
//                 year: 'numeric', month: '2-digit', day: '2-digit',
//                 hour: '2-digit', minute: '2-digit', hour12: false
//             });

//             row.innerHTML = `
//                 <td>${code.code}</td>
//                 <td>${code.percentage}%</td>
//                 <td>${validFrom}</td>
//                 <td>${validUntil}</td>
//                 <td>${code.is_active ? 'بله' : 'خیر'}</td>
//                 <td>${code.times_used}</td>
//                 <td>${code.usage_limit === 0 ? 'نامحدود' : code.usage_limit}</td>
//                 <td class="action-buttons">
//                     <button class="edit-button" data-id="${code.id}">ویرایش</button>
//                     <button class="delete-button" data-id="${code.id}">حذف</button>
//                 </td>
//             `;
//             discountCodesList.appendChild(row);
//         });


//         document.querySelectorAll('.delete-button').forEach(button => {
//             button.addEventListener('click', (event) => deleteDiscountCode(event.target.dataset.id));
//         });
//     }

//     // تابع برای افزودن یا به روز رسانی کد تخفیف
//     async function addOrUpdateDiscountCode(event) {
//         event.preventDefault(); // جلوگیری از رفرش صفحه

//         const formData = new FormData(addDiscountForm);
//         const data = {
//             code: formData.get('code'),
//             percentage: parseInt(formData.get('discount_percentage')), // تغییر نام به 'percentage'
//             valid_from: formData.get('valid_from'),
//             valid_until: formData.get('valid_until'),
//             usage_limit: parseInt(formData.get('usage_limit')),
//             is_active: formData.get('is_active') === 'on' ? true : false,
//         };

//         // اعتبارسنجی اولیه در سمت کلاینت
//         if (!data.code || data.code.length !== 8) {
//             showMessage('کد تخفیف باید دقیقاً 8 کاراکتر باشد.', 'error');
//             return;
//         }
//         if (isNaN(data.percentage) || data.percentage <= 0 || data.percentage > 100) {
//             showMessage('درصد تخفیف باید بین 1 تا 100 باشد.', 'error');
//             return;
//         }
//         if (!data.valid_from || !data.valid_until) {
//             showMessage('تاریخ شروع و پایان اعتبار الزامی است.', 'error');
//             return;
//         }
//         if (new Date(data.valid_from) >= new Date(data.valid_until)) {
//             showMessage('تاریخ پایان اعتبار باید بعد از تاریخ شروع اعتبار باشد.', 'error');
//             return;
//         }
//         if (new Date(data.valid_until) <= new Date()) { // تاریخ انقضا نباید گذشته باشد
//             showMessage('تاریخ پایان اعتبار باید در آینده باشد.', 'error');
//             return;
//         }


//         let url = '/api/discounts/'; // مسیر API برای افزودن
//         let method = 'POST';

//         if (editingCodeId) {
//             url = `/api/discounts/${editingCodeId}/`; // مسیر API برای ویرایش
//             method = 'PUT'; // برای ویرایش از PUT استفاده می‌کنیم
//         }

//         try {
//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': getCookie('csrftoken'),
//                 },
//                 body: JSON.stringify(data),
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 showMessage(`کد تخفیف با موفقیت ${editingCodeId ? 'ویرایش' : 'افزوده'} شد.`, 'success');
//                 addDiscountForm.reset(); // پاک کردن فرم
//                 editingCodeId = null; // ریست کردن حالت ویرایش
//                 submitButton.textContent = 'افزودن کد تخفیف'; // دکمه را به حالت اولیه برمی‌گردانیم
//                 fetchDiscountCodes(); // لیست را به‌روز می‌کنیم
//             } else {
//                 let errorMessage = 'خطا در عملیات کد تخفیف.';
//                 if (result) {
//                     const errorKeys = Object.keys(result);
//                     if (errorKeys.length > 0) {
//                         errorMessage = errorKeys.map(key => {
//                             const errorValue = result[key];
//                             if (Array.isArray(errorValue)) {
//                                 return `${key}: ${errorValue.join(', ')}`;
//                             }
//                             return `${key}: ${errorValue}`;
//                         }).join('; ');
//                     } else if (result.detail) {
//                         errorMessage = result.detail;
//                     }
//                 }
//                 showMessage(errorMessage, 'error');
//             }
//         } catch (error) {
//             console.error(`Error ${editingCodeId ? 'updating' : 'adding'} discount code:`, error);
//             showMessage('خطای غیرمنتظره رخ داد. لطفا دوباره تلاش کنید.', 'error');
//         }
//     }

//     // تابع برای ویرایش یک کد تخفیف (پر کردن فرم)
//     async function editDiscountCode(id) {
//         try {
//             const response = await fetch(`/api/discounts/${id}/`, { // مسیر API برای جزئیات کد تخفیف
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken'),
//                     'Content-Type': 'application/json',
//                 },
//             });
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || 'خطا در دریافت اطلاعات کد تخفیف.');
//             }
//             const code = await response.json();

//             // پر کردن فرم با اطلاعات کد تخفیف برای ویرایش
//             document.getElementById('code').value = code.code;
//             document.getElementById('discount_percentage').value = code.percentage; // تغییر نام به 'percentage'
//             // فرمت دهی تاریخ برای ورودی datetime-local
//             document.getElementById('valid_from').value = new Date(code.valid_from).toISOString().slice(0, 16);
//             document.getElementById('valid_until').value = new Date(code.valid_until).toISOString().slice(0, 16);
//             document.getElementById('usage_limit').value = code.usage_limit;
//             document.getElementById('is_active').checked = code.is_active;

//             editingCodeId = code.id; // تنظیم ID برای حالت ویرایش
//             submitButton.textContent = 'به روز رسانی کد تخفیف'; // تغییر متن دکمه

//             // اسکرول به بالای فرم (اختیاری، برای بهبود تجربه کاربری)
//             addDiscountForm.scrollIntoView({ behavior: 'smooth' });

//         } catch (error) {
//             console.error('Error fetching discount code for edit:', error);
//             showMessage(`خطا در بارگذاری کد تخفیف برای ویرایش: ${error.message}`, 'error');
//         }
//     }

//     // تابع برای حذف یک کد تخفیف
//     async function deleteDiscountCode(id) {
//         if (!confirm('آیا مطمئن هستید که می‌خواهید این کد تخفیف را حذف کنید؟')) {
//             return; // اگر کاربر انصراف داد، کاری نکن
//         }

//         try {
//             const response = await fetch(`/api/discounts/${id}/`, { // مسیر API برای حذف
//                 method: 'DELETE',
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken'),
//                 },
//             });

//             if (response.ok) {
//                 showMessage('کد تخفیف با موفقیت حذف شد.', 'success');
//                 fetchDiscountCodes(); // لیست را به‌روز می‌کنیم
//             } else {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || 'خطا در حذف کد تخفیف.');
//             }
//         } catch (error) {
//             console.error('Error deleting discount code:', error);
//             showMessage(`خطا در حذف کد تخفیف: ${error.message}`, 'error');
//         }
//     }

//     // Event Listener برای ارسال فرم (افزودن/ویرایش)
//     addDiscountForm.addEventListener('submit', addOrUpdateDiscountCode);

//     // بارگذاری اولیه کدهای تخفیف هنگام بارگذاری صفحه
//     fetchDiscountCodes();
// });

document.addEventListener('DOMContentLoaded', () => {
    const addDiscountForm = document.getElementById('add-discount-form');
    const discountCodesList = document.getElementById('discount-codes-list');
    const messageContainer = document.getElementById('message-container');
    const submitButton = document.getElementById('submit-button');

    let editingCodeId = null; // To keep track of the code being edited

    // Function to get CSRF Token from cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Function to display messages (success/error)
    function showMessage(message, type) {
        if (messageContainer) {
            messageContainer.textContent = message;
            messageContainer.className = `message ${type}`; // Add CSS class for styling
            setTimeout(() => {
                messageContainer.textContent = '';
                messageContainer.className = 'message'; // Clear classes after 5 seconds
            }, 5000);
        } else {
            console.log(`Message (${type}): ${message}`);
        }
    }

    // Function to fetch discount codes from the API and display them
    async function fetchDiscountCodes() {
        try {
            const response = await fetch('/api/discounts/', { // Using API path for list
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json', // Not strictly necessary for GET but doesn't hurt
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error loading discount codes.');
            }
            const codes = await response.json();
            renderDiscountCodes(codes); // Call function to render codes
        } catch (error) {
            console.error('Error fetching discount codes:', error);
            showMessage(`Error loading discount codes: ${error.message}`, 'error');
        }
    }

    // Function to render discount codes in the HTML table
    function renderDiscountCodes(codes) {
        discountCodesList.innerHTML = ''; // Clear previous table content
        if (codes.length === 0) {
            discountCodesList.innerHTML = '<tr><td colspan="8">No discount codes found.</td></tr>';
            return;
        }

        codes.forEach(code => {
            const row = document.createElement('tr');
            // Format date and time for more readable display
            const validFrom = new Date(code.valid_from).toLocaleString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hour12: false
            });
            const validUntil = new Date(code.valid_until).toLocaleString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hour12: false
            });

            row.innerHTML = `
                <td>${code.code}</td>
                <td>${code.percentage}%</td>
                <td>${validFrom}</td>
                <td>${validUntil}</td>
                <td>${code.is_active ? 'Yes' : 'No'}</td>
                <td>${code.times_used}</td>
                <td>${code.usage_limit === 0 ? 'Unlimited' : code.usage_limit}</td>
                <td class="action-buttons">
                    <button class="edit-button" data-id="${code.id}">Edit</button>
                    <button class="delete-button" data-id="${code.id}">Delete</button>
                </td>
            `;
            discountCodesList.appendChild(row);
        });

        // Attach event listeners for edit buttons
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (event) => editDiscountCode(event.target.dataset.id));
        });

        // Attach event listeners for delete buttons
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => deleteDiscountCode(event.target.dataset.id));
        });
    }

    // Function to add or update a discount code
    async function addOrUpdateDiscountCode(event) {
        event.preventDefault(); // Prevent page refresh

        const formData = new FormData(addDiscountForm);
        const data = {
            code: formData.get('code'),
            percentage: parseInt(formData.get('discount_percentage')),
            valid_from: formData.get('valid_from'),
            valid_until: formData.get('valid_until'),
            usage_limit: parseInt(formData.get('usage_limit')),
            is_active: formData.get('is_active') === 'on' ? true : false,
        };

        // Basic client-side validation
        if (!data.code || data.code.length !== 8) {
            showMessage('Discount code must be exactly 8 characters long.', 'error');
            return;
        }
        if (isNaN(data.percentage) || data.percentage <= 0 || data.percentage > 100) {
            showMessage('Discount percentage must be between 1 and 100.', 'error');
            return;
        }
        if (!data.valid_from || !data.valid_until) {
            showMessage('Valid from and valid until dates are required.', 'error');
            return;
        }
        if (new Date(data.valid_from) >= new Date(data.valid_until)) {
            showMessage('Valid until date must be after valid from date.', 'error');
            return;
        }
        if (new Date(data.valid_until) <= new Date()) { // Expiration date should not be in the past
            showMessage('Valid until date must be in the future.', 'error');
            return;
        }

        let url = '/api/discounts/'; // API path for adding
        let method = 'POST';

        if (editingCodeId) {
            url = `/api/discounts/${editingCodeId}/`; // API path for editing
            method = 'PUT'; // Use PUT for editing
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(`Discount code successfully ${editingCodeId ? 'updated' : 'added'}.`, 'success');
                addDiscountForm.reset(); // Clear the form
                editingCodeId = null; // Reset editing state
                submitButton.textContent = 'Add Discount Code'; // Revert button text
                fetchDiscountCodes(); // Refresh the list
            } else {
                let errorMessage = 'Error in discount code operation.';
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
            console.error(`Error ${editingCodeId ? 'updating' : 'adding'} discount code:`, error);
            showMessage('An unexpected error occurred. Please try again.', 'error');
        }
    }

    // Function to edit a discount code (populate the form)
    async function editDiscountCode(id) {
        try {
            const response = await fetch(`/api/discounts/${id}/`, { // API path for discount code details
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error retrieving discount code information.');
            }
            const code = await response.json();

            // Populate the form with discount code information for editing
            document.getElementById('code').value = code.code;
            document.getElementById('discount_percentage').value = code.percentage;
            // Format date for datetime-local input
            document.getElementById('valid_from').value = new Date(code.valid_from).toISOString().slice(0, 16);
            document.getElementById('valid_until').value = new Date(code.valid_until).toISOString().slice(0, 16);
            document.getElementById('usage_limit').value = code.usage_limit;
            document.getElementById('is_active').checked = code.is_active;

            editingCodeId = code.id; // Set ID for editing state
            submitButton.textContent = 'Update Discount Code'; // Change button text

            // Scroll to the top of the form (optional, for improved user experience)
            addDiscountForm.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error fetching discount code for edit:', error);
            showMessage(`Error loading discount code for editing: ${error.message}`, 'error');
        }
    }

    // Function to delete a discount code
    async function deleteDiscountCode(id) {
        if (!confirm('Are you sure you want to delete this discount code?')) {
            return; // If the user cancels, do nothing
        }

        try {
            const response = await fetch(`/api/discounts/${id}/`, { // API path for deleting
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            if (response.ok) {
                showMessage('Discount code successfully deleted.', 'success');
                fetchDiscountCodes(); // Refresh the list
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error deleting discount code.');
            }
        } catch (error) {
            console.error('Error deleting discount code:', error);
            showMessage(`Error deleting discount code: ${error.message}`, 'error');
        }
    }

    // Event Listener for form submission (add/edit)
    addDiscountForm.addEventListener('submit', addOrUpdateDiscountCode);

    // Initial loading of discount codes when the page loads
    fetchDiscountCodes();
});