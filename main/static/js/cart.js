//  // تابع برای بارگذاری اطلاعات سبد خرید از API
//     async function loadCart() {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             alert('لطفاً ابتدا وارد شوید.');
//             window.location.href = '/login/';
//             return;
//         }

//         try {
//             const response = await fetch('/api/cart/', {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Token ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('خطا در بارگذاری سبد خرید');
//             }

//             const cartData = await response.json();
//             const cartItemsContainer = document.getElementById('cart-items');
//             cartItemsContainer.innerHTML = ''; // پاک کردن محتوای قبلی

//             let totalPrice = 0;

//             cartData.items.forEach(item => {
//                 totalPrice += item.food.price * item.quantity;

//                 const cartItem = document.createElement('li');
//                 cartItem.classList.add('cart-item');
//                 cartItem.innerHTML = `
//                         <img src="${item.food.image || '/static/images/default_food.jpg'}" alt="${item.food.name}">
//                         <div class="cart-item-details">
//                             <p class="cart-item-title">${item.food.name}</p>
//                             <p class="cart-item-price">${item.food.price} تومان</p>
//                             <div class="cart-item-quantity">
//                                 <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
//                                 <span>${item.quantity}</span>
//                                 <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
//                             </div>
//                         </div>
//                     `;

//                 cartItemsContainer.appendChild(cartItem);
//             });

//             // به روزرسانی جمع کل
//             document.getElementById('total-price').innerText = `${totalPrice} تومان`;

//         } catch (error) {
//             console.error('Error loading cart:', error);
//             alert('خطا در بارگذاری سبد خرید');
//         }
//     }

//     // تابع تغییر تعداد آیتم‌های سبد خرید
// async function changeQuantity(itemId, change) {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         alert('لطفاً ابتدا وارد شوید.');
//         window.location.href = '/login/';
//         return;
//     }

//     try {
//         // ابتدا سبد خرید را بارگذاری می‌کنیم تا اطلاعات آیتم را پیدا کنیم
//         const response = await fetch('/api/cart/', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Token ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             throw new Error('خطا در بارگذاری سبد خرید');
//         }

//         const cartData = await response.json();
//         const cartItem = cartData.items.find(item => item.id === itemId); // پیدا کردن آیتم با استفاده از itemId

//         if (!cartItem) {
//             alert('آیتم مورد نظر یافت نشد.');
//             return;
//         }

//         // محاسبه تعداد جدید
//         let newQuantity = cartItem.quantity + change;

//         if (newQuantity <= 0) {
//             // اگر تعداد صفر یا منفی شد، آیتم را از سبد خرید حذف می‌کنیم
//             const deleteResponse = await fetch(`/api/cart/remove/${itemId}/`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Authorization': `Token ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (deleteResponse.ok) {
//                 loadCart(); // بارگذاری مجدد سبد خرید
//             } else {
//                 alert('خطا در حذف آیتم از سبد خرید');
//             }
//         } else {
//             // اگر تعداد بیشتر از صفر باشد، تعداد آیتم را به روزرسانی می‌کنیم
//             const updateResponse = await fetch(`/api/cart/update/${itemId}/`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Token ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ quantity: newQuantity }),
//             });

//             if (updateResponse.ok) {
//                 loadCart(); // بارگذاری مجدد سبد خرید
//             } else {
//                 alert('خطا در به روزرسانی تعداد');
//             }
//         }

//     } catch (error) {
//         console.error('Error:', error);
//         alert('خطا در ارتباط با سرور');
//     }
// }



//     // تابع برای بارگذاری آدرس‌ها از API
//     async function loadAddresses() {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         alert('لطفاً ابتدا وارد شوید.');
//         window.location.href = '/login/';
//         return;
//     }

//     try {
//         const response = await fetch('/api/addresses/', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Token ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             throw new Error('خطا در بارگذاری آدرس‌ها');
//         }

//         const addresses = await response.json();
//         console.log('Addresses:', addresses); // بررسی پاسخ API

//         const addressDropdown = document.getElementById('address-dropdown');
//         addressDropdown.innerHTML = '<option value="">لطفاً یک آدرس انتخاب کنید</option>';

//         addresses.forEach(address => {
//             const fullAddress = `
//                 ${address.city || ''}, 
//                 ${address.neighborhood || ''}, 
//                 ${address.block || ''}, 
//                 کدپستی: ${address.postal_code || ''}, 
//                 ${address.country || ''}
//             `.trim().replace(/,\s*,/g, ',').replace(/,\s*$/, ''); // حذف کاماهای اضافی

//             const option = document.createElement('option');
//             option.value = address.id;
//             option.textContent = fullAddress || 'آدرس ناموجود';
//             addressDropdown.appendChild(option);
//         });

//         // فعال‌سازی دکمه ثبت سفارش فقط زمانی که آدرس انتخاب شده باشد
//         addressDropdown.addEventListener('change', () => {
//             document.getElementById('place-order-btn').disabled = addressDropdown.value === "";
//         });

//     } catch (error) {
//         console.error('Error loading addresses:', error);
//         alert('خطا در بارگذاری آدرس‌ها');
//     }
// }

//     // تابع برای ثبت سفارش
//     async function placeOrder() {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             alert('لطفاً ابتدا وارد شوید.');
//             window.location.href = '/login/';
//             return;
//         }

//         const selectedAddress = document.getElementById('address-dropdown').value;
//         if (!selectedAddress) {
//             alert('لطفاً یک آدرس انتخاب کنید.');
//             return;
//         }

//         try {
//             const response = await fetch('/api/checkout/', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Token ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ delivery_address_id: selectedAddress }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'خطا در ثبت سفارش');
//             }

//             const orderData = await response.json();
//             alert('سفارش شما با موفقیت ثبت شد!');
//             window.location.href = '/show-order-customer/'; // انتقال به صفحه سفارش‌ها

//         } catch (error) {
//             console.error('Error placing order:', error);
//             alert('خطا در ثبت سفارش');
//         }
//     }

// document.addEventListener('DOMContentLoaded', () => {
//     // بارگذاری سبد خرید و آدرس‌ها هنگام بارگذاری صفحه
//     loadCart();
//     loadAddresses();
//     document.getElementById('place-order-btn').addEventListener('click', placeOrder);


// });

// async function loadCart() {
//     const cartItemsContainer = document.getElementById('cart-items');
//     const cartTotalPrice = document.getElementById('cart-total-price');

//     cartItemsContainer.innerHTML = 'در حال بارگذاری...';

//     try {
//         const response = await fetch('/api/cart/', { credentials: 'include' });
//         if (!response.ok) throw new Error('خطا در بارگذاری سبد خرید');

//         const data = await response.json();

//         cartItemsContainer.innerHTML = '';

//         if (data.items.length === 0) {
//             cartItemsContainer.innerHTML = '<p>سبد خرید شما خالی است.</p>';
//             cartTotalPrice.textContent = '0';
//             return;
//         }

//         data.items.forEach(item => {
//             const div = document.createElement('div');
//             div.innerHTML = `
//                 <strong>${item.book.title}</strong><br/>
//                 تعداد: ${item.quantity}<br/>
//                 قیمت کل: ${item.total_price.toLocaleString()} تومان
//             `;
//             cartItemsContainer.appendChild(div);
//         });

//         cartTotalPrice.textContent = data.total_price.toLocaleString();
//     } catch (error) {
//         cartItemsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
//         cartTotalPrice.textContent = '0';
//     }
// }

// // بارگذاری سبد خرید هنگام بارگذاری صفحه
// window.addEventListener('DOMContentLoaded', loadCart);




async function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button'); // فرض می‌کنیم یک دکمه تسویه‌حساب داری

    cartItemsContainer.innerHTML = 'در حال بارگذاری سبد خرید...';
    checkoutButton.style.display = 'none'; // دکمه رو پنهان کن تا وقتی اطلاعات کامل شد نمایش بدی

    try {
        const response = await fetch('/api/cart/', { credentials: 'include' });
        
        // 🚨 قدم ۱: بررسی پاسخ خام سرور
        if (!response.ok) {
            const errorText = await response.text();
            console.error('خطا از سمت سرور:', response.status, errorText);
            throw new Error('خطا در بارگذاری سبد خرید. لطفاً بعداً تلاش کنید.');
        }

        const data = await response.json();
        
        // 🚨 قدم ۲: نمایش دقیق داده‌های دریافتی از سرور در کنسول
        console.log('داده‌های دریافتی از سرور:', data);

        cartItemsContainer.innerHTML = '';

        if (!data.items || data.items.length === 0) {
            cartItemsContainer.innerHTML = '<p>سبد خرید شما خالی است.</p>';
            cartTotalPrice.textContent = '0';
            return;
        }

        data.items.forEach(item => {
            // 🚨 قدم ۳: بررسی وجود فیلدهای مورد نیاز
            if (!item.book || !item.book.title || item.total_price === undefined) {
                console.error('ساختار داده نامعتبر برای یک آیتم:', item);
                return; // از این آیتم صرف‌نظر کن
            }

            const div = document.createElement('div');
            div.innerHTML = `
                <strong>${item.book.title}</strong><br/>
                تعداد: ${item.quantity}<br/>
                قیمت کل: ${item.total_price.toLocaleString()} تومان
            `;
            cartItemsContainer.appendChild(div);
        });

        if (data.total_price !== undefined) {
            cartTotalPrice.textContent = data.total_price.toLocaleString();
            checkoutButton.style.display = 'block'; // نمایش دکمه تسویه حساب
        } else {
            console.error('فیلد total_price در پاسخ سرور وجود ندارد.');
            cartTotalPrice.textContent = '۰';
        }
        
    } catch (error) {
        cartItemsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
        cartTotalPrice.textContent = '۰';
        console.error('خطای کلی جاوااسکریپت:', error);
    }
}

window.addEventListener('DOMContentLoaded', loadCart);