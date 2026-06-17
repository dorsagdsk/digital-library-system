
let userData = JSON.parse(sessionStorage.getItem('userData'));

// دکمه برای اضافه کردن آدرس جدید
document.getElementById('addAddressBtn').addEventListener('click', function () {
    const addressContainer = document.getElementById('addressContainer');
    const addressGroup = document.createElement('div');
    addressGroup.classList.add('address-group');
    addressGroup.innerHTML = `
        <label for="city">شهر</label>
        <input type="text" class="city" name="city[]" required>
        <label for="neighborhood">محله</label>
        <input type="text" class="neighborhood" name="neighborhood[]" required>
        <label for="block">پلاک</label>
        <input type="text" class="block" name="block[]" required>
        <label for="postal_code">کد پستی</label>
        <input type="text" class="postal_code" name="postal_code[]" required>
        <label for="country">کشور</label>
        <input type="text" class="country" name="country[]" required>
    `;
    addressContainer.appendChild(addressGroup);
});

// تابع اعتبارسنجی داده‌ها
const validateAddressFields = () => {
    const cities = document.getElementsByName('city[]');
    const countries = document.getElementsByName('country[]');
    const blocks = document.getElementsByName('block[]');
    const postalCodes = document.getElementsByName('postal_code[]');

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const country = countries[i];
        const block = blocks[i];
        const postalCode = postalCodes[i];

        // اعتبارسنجی شهر و کشور (فقط حروف)
        if (!/^[a-zA-Z؀-ۿ\s]+$/.test(city.value)) {
            city.style.borderColor = "red";
            alert('شهر باید فقط شامل حروف باشد.');
            return false;
        } else {
            city.style.borderColor = "#4CAF50";
        }

        if (!/^[a-zA-Z؀-ۿ\s]+$/.test(country.value)) {
            country.style.borderColor = "red";
            alert('کشور باید فقط شامل حروف باشد.');
            return false;
        } else {
            country.style.borderColor = "#4CAF50";
        }

        // اعتبارسنجی پلاک (فقط عدد)
        if (!/^\d+$/.test(block.value)) {
            block.style.borderColor = "red";
            alert('پلاک باید فقط شامل اعداد باشد.');
            return false;
        } else {
            block.style.borderColor = "#4CAF50";
        }

        // اعتبارسنجی کد پستی (فقط عدد و حداقل ۵ کاراکتر)
        if (!/^\d{5,}$/.test(postalCode.value)) {
            postalCode.style.borderColor = "red";
            alert('کد پستی باید فقط شامل اعداد باشد و حداقل ۵ کاراکتر داشته باشد.');
            return false;
        } else {
            postalCode.style.borderColor = "#4CAF50";
        }
    }
    return true;
};

// ذخیره آدرس‌ها و ارسال به API
document.getElementById('saveButton').addEventListener('click', async function () {
    if (!validateAddressFields()) {
        return; // اگر اعتبارسنجی ناموفق بود، از ادامه جلوگیری می‌شود
    }

    const formData = {
        ...userData,  // اطلاعات مشتری از صفحه اول
        addresses: [],
        role: 'customer'
    };

    const cities = document.getElementsByName('city[]');
    const neighborhoods = document.getElementsByName('neighborhood[]');
    const blocks = document.getElementsByName('block[]');
    const postalCodes = document.getElementsByName('postal_code[]');
    const countries = document.getElementsByName('country[]');

    // بررسی اینکه آیا تمام فیلدها پر شده‌اند
    for (let i = 0; i < cities.length; i++) {
        if (!cities[i].value || !neighborhoods[i].value || !blocks[i].value || !postalCodes[i].value || !countries[i].value) {
            alert('لطفاً تمام فیلدها را پر کنید.');
            return; // اگر فیلدی پر نشده باشد، از ارسال جلوگیری می‌کند
        }

        formData.addresses.push({
            city: cities[i].value,
            neighborhood: neighborhoods[i].value,
            block: blocks[i].value,
            postal_code: postalCodes[i].value,
            country: countries[i].value
        });
    }

    console.log('Form Data:', JSON.stringify(formData));  // چاپ داده‌های ارسال شده به سرور

    try {
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            alert('ثبت‌نام با موفقیت انجام شد');
            window.location.href = '/login/';

        } else {
            const errorData = await response.json();
            console.log('Error:', errorData);  // مشاهده اطلاعات خطای دقیق‌تر
            alert('خطا: ' + errorData.detail);
        }
    } catch (error) {
        alert('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.');
    }
});
