// const baseUrl = 'http://127.0.0.1:8000'; // آدرس پایه API

// // دریافت و نمایش کتاب‌ها با فیلترهای اختیاری
// async function fetchAndDisplayBooks(genre = null, searchQuery = null, authorQuery = null) {
//     const bookList = document.getElementById('book-list');
//     const loadingMessage = document.getElementById('loading-message');
//     const errorMessage = document.getElementById('error-message');

//     if (!bookList) {
//         console.error("Element with ID 'book-list' not found.");
//         return;
//     }

//     bookList.innerHTML = '';
//     if (loadingMessage) loadingMessage.style.display = 'block';
//     if (errorMessage) errorMessage.style.display = 'none';

//     let apiUrl = `${baseUrl}/api/books/approved/`; // آدرس پیش‌فرض API
//     const params = new URLSearchParams();

//     if (genre || searchQuery || authorQuery) {
//         apiUrl = `${baseUrl}/api/books/search/`; // اگر فیلتر داریم به آدرس جستجو می‌رویم
//     }

//     if (genre) {
//         params.append('genre', genre);
//     }
//     if (searchQuery) {
//         params.append('query', searchQuery);
//     }
//     if (authorQuery) {
//         params.append('author', authorQuery);
//     }

//     if (params.toString()) {
//         apiUrl += `?${params.toString()}`;
//     }

//     try {
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(`HTTP error! status: ${response.status}, detail: ${errorData.detail || JSON.stringify(errorData)}`);
//         }
//         const books = await response.json();
//         displayBooks(books);
//     } catch (error) {
//         console.error("Error fetching books:", error);
//         if (bookList) bookList.innerHTML = '';
//         if (errorMessage) {
//             errorMessage.textContent = `Failed to load books. Please try again later. Error: ${error.message}`;
//             errorMessage.style.display = 'block';
//         }
//     } finally {
//         if (loadingMessage) loadingMessage.style.display = 'none';
//     }
// }

// // نمایش کتاب‌ها
// function displayBooks(books) {
//     const bookList = document.getElementById('book-list');
//     if (!bookList) {
//         console.error("Element with ID 'book-list' not found.");
//         return;
//     }

//     bookList.innerHTML = '';

//     if (books.length === 0) {
//         bookList.innerHTML = '<p style="text-align:center; color:#A47148; font-size:1.2em; padding:20px;">No books found matching your criteria.</p>';
//         return;
//     }

//     books.forEach(book => {
//         const bookCard = document.createElement('div');
//         bookCard.classList.add('book-card');

//         const genreName = Array.isArray(book.genre) && book.genre.length > 0 ? book.genre[0].name : 'Unknown';
//         bookCard.setAttribute('data-category', genreName);

//         const coverImageUrl = book.cover_image_url || book.cover_image ? 
//                               `${baseUrl}${book.cover_image_url || book.cover_image}` : 
//                               '/static/images/default_cover.png';

//         bookCard.innerHTML = `
//             <img src="${coverImageUrl}" alt="${book.title} Cover" class="book-cover" />
//             <div class="book-info">
//                 <h2>${book.title}</h2>
//                 <p class="author">By: ${book.author_name || book.author || 'Unknown'}</p>
//                 <p class="description">${book.description ? book.description.substring(0, 100) + '...' : 'No description'}</p>
//                 <p class="price">$${parseFloat(book.price).toFixed(2)}</p>
//                 <a href="#" class="btn-read-more" data-book-id="${book.id}">Read More</a>
//             </div>
//         `;

//         bookList.appendChild(bookCard);
//     });

//     // اضافه کردن رویداد کلیک به دکمه‌های "Read More"
//     document.querySelectorAll('.btn-read-more').forEach(button => {
//         button.addEventListener('click', async (event) => {
//             event.preventDefault();
//             const bookId = event.target.dataset.bookId;
//             await fetchBookPreview(bookId);
//         });
//     });
// }

// // دریافت پیش‌نمایش کتاب
// async function fetchBookPreview(bookId) {
//     try {
//         const response = await fetch(`${baseUrl}/api/books/${bookId}/preview/`);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch preview: ${response.status}`);
//         }
//         const previewData = await response.json();
//         showPreviewModal(previewData.preview_text || "No preview available.");
//     } catch (error) {
//         alert("Error loading preview: " + error.message);
//     }
// }

// // نمایش پیش‌نمایش در مودال
// function showPreviewModal(previewText) {
//     // اگر مودال موجود نیست، بسازش
//     let modal = document.getElementById('preview-modal');
//     if (!modal) {
//         modal = document.createElement('div');
//         modal.id = 'preview-modal';
//         modal.style.position = 'fixed';
//         modal.style.top = '0';
//         modal.style.left = '0';
//         modal.style.width = '100vw';
//         modal.style.height = '100vh';
//         modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
//         modal.style.display = 'flex';
//         modal.style.justifyContent = 'center';
//         modal.style.alignItems = 'center';
//         modal.style.zIndex = '9999';

//         const content = document.createElement('div');
//         content.id = 'preview-modal-content';
//         content.style.backgroundColor = '#fff';
//         content.style.padding = '20px';
//         content.style.borderRadius = '10px';
//         content.style.maxWidth = '600px';
//         content.style.maxHeight = '80vh';
//         content.style.overflowY = 'auto';
//         content.style.whiteSpace = 'pre-wrap';
//         modal.appendChild(content);

//         // بستن مودال با کلیک روی بک‌گراند
//         modal.addEventListener('click', e => {
//             if (e.target === modal) {
//                 modal.style.display = 'none';
//             }
//         });

//         document.body.appendChild(modal);
//     }

//     // پر کردن محتوا و نمایش مودال
//     const content = document.getElementById('preview-modal-content');
//     content.textContent = previewText;
//     modal.style.display = 'flex';
// }

// // اسکرول دسته‌بندی‌ها
// function scrollCategories(direction) {
//     const barContainer = document.getElementById('bar');
//     if (barContainer) {
//         barContainer.scrollBy({ left: direction * 200, behavior: 'smooth' });
//     }
// }

// // مدیریت کلیک روی دسته‌ها
// document.querySelectorAll('.category-bar').forEach(categoryDiv => {
//     categoryDiv.addEventListener('click', () => {
//         const selectedCategory = categoryDiv.dataset.category || null;
//         fetchAndDisplayBooks(selectedCategory);
//     });
// });

// // مدیریت کلیک دکمه جستجو
// const searchButton = document.getElementById('search-button');
// const searchBox = document.getElementById('search-box');

// searchButton.addEventListener('click', () => {
//     const query = searchBox.value.trim();
//     if (query.length > 0) {
//         fetchAndDisplayBooks(null, query);
//     } else {
//         fetchAndDisplayBooks();
//     }
// });

// // جستجو با کلید Enter در input جستجو
// searchBox.addEventListener('keyup', (event) => {
//     if (event.key === 'Enter') {
//         searchButton.click();
//     }
// });

// // بارگذاری اولیه کتاب‌ها هنگام لود صفحه
// document.addEventListener('DOMContentLoaded', () => {
//     fetchAndDisplayBooks();
// });

// // --------







// const baseUrl = 'http://127.0.0.1:8000'; // آدرس پایه API

// // دریافت و نمایش کتاب‌ها با فیلترهای اختیاری
// async function fetchAndDisplayBooks(genre = null, searchQuery = null, authorQuery = null) {
//     const bookList = document.getElementById('book-list');
//     const loadingMessage = document.getElementById('loading-message');
//     const errorMessage = document.getElementById('error-message');

//     if (!bookList) {
//         console.error("Element with ID 'book-list' not found.");
//         return;
//     }

//     bookList.innerHTML = '';
//     if (loadingMessage) loadingMessage.style.display = 'block';
//     if (errorMessage) errorMessage.style.display = 'none';

//     let apiUrl = `${baseUrl}/api/books/approved/`; // آدرس پیش‌فرض API
//     const params = new URLSearchParams();

//     if (genre || searchQuery || authorQuery) {
//         apiUrl = `${baseUrl}/api/books/search/`; // اگر فیلتر داریم به آدرس جستجو می‌رویم
//     }

//     if (genre) {
//         params.append('genre', genre);
//     }
//     if (searchQuery) {
//         params.append('query', searchQuery);
//     }
//     if (authorQuery) {
//         params.append('author', authorQuery);
//     }

//     if (params.toString()) {
//         apiUrl += `?${params.toString()}`;
//     }

//     try {
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(`HTTP error! status: ${response.status}, detail: ${errorData.detail || JSON.stringify(errorData)}`);
//         }
//         const books = await response.json();
//         displayBooks(books);
//     } catch (error) {
//         console.error("Error fetching books:", error);
//         if (bookList) bookList.innerHTML = '';
//         if (errorMessage) {
//             errorMessage.textContent = `Failed to load books. Please try again later. Error: ${error.message}`;
//             errorMessage.style.display = 'block';
//         }
//     } finally {
//         if (loadingMessage) loadingMessage.style.display = 'none';
//     }
// }

// // نمایش کتاب‌ها
// function displayBooks(books) {
//     const bookList = document.getElementById('book-list');
//     if (!bookList) {
//         console.error("Element with ID 'book-list' not found.");
//         return;
//     }

//     bookList.innerHTML = '';

//     if (books.length === 0) {
//         bookList.innerHTML = '<p style="text-align:center; color:#A47148; font-size:1.2em; padding:20px;">No books found matching your criteria.</p>';
//         return;
//     }

//     books.forEach(book => {
//         const bookCard = document.createElement('div');
//         bookCard.classList.add('book-card');

//         // فرض می‌کنیم ژانر به درستی از بک‌اند به صورت لیستی از آبجکت‌ها برگردانده می‌شود.
//         // اگر BookListMainSerializer فقط id ژانر را برمی‌گرداند، این قسمت نیاز به تغییر دارد.
//         // اما اگر `genre` نام ژانرها را برمی‌گرداند، این کد کار می‌کند.
//         // بر اساس `BookListMainSerializer` شما که `genre` را به عنوان یک فیلد مستقیم لیست کرده،
//         // اگر `genre` در مدل Book یک `ManyToManyField` به `Genre` باشد،
//         // باید در serializer آن را به درستی نمایش دهید.
//         // برای مثال، می‌توانید از `GenreSerializer` یا `StringRelatedField` استفاده کنید.
//         // با فرض اینکه `book.genre` یک آرایه از اشیاء ژانر است و هر شیء دارای `name` است:
//         const genreNames = Array.isArray(book.genre) ? book.genre.map(g => g.name).join(', ') : 'Unknown';
//         bookCard.setAttribute('data-category', genreNames);


//         // تغییر اصلی در اینجاست: baseUrl را حذف می‌کنیم اگر URL کامل باشد
//         const coverImageUrl = book.cover_image_url || book.cover_image || '/static/images/default_cover.png';


//         bookCard.innerHTML = `
//             <img src="${coverImageUrl}" alt="${book.title} Cover" class="book-cover" />
//             <div class="book-info">
//                 <h2>${book.title}</h2>
//                 <p class="author">By: ${book.author_name || book.author || 'Unknown'}</p>
//                 <p class="description">${book.description ? book.description.substring(0, 100) + '...' : 'No description'}</p>
//                 <p class="price">$${parseFloat(book.price).toFixed(2)}</p>
//                 <a href="#" class="btn-read-more" data-book-id="${book.id}">Read More</a>
//             </div>
//         `;

//         bookList.appendChild(bookCard);
//     });

//     // اضافه کردن رویداد کلیک به دکمه‌های "Read More"
//     document.querySelectorAll('.btn-read-more').forEach(button => {
//         button.addEventListener('click', async (event) => {
//             event.preventDefault();
//             const bookId = event.target.dataset.bookId;
//             await fetchBookPreview(bookId);
//         });
//     });
// }

// // دریافت پیش‌نمایش کتاب
// async function fetchBookPreview(bookId) {
//     try {
//         const response = await fetch(`${baseUrl}/api/books/${bookId}/preview/`);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch preview: ${response.status}`);
//         }
//         const previewData = await response.json();
//         showPreviewModal(previewData.preview_text || "No preview available.");
//     } catch (error) {
//         alert("Error loading preview: " + error.message);
//     }
// }

// // نمایش پیش‌نمایش در مودال
// function showPreviewModal(previewText) {
//     // اگر مودال موجود نیست، بسازش
//     let modal = document.getElementById('preview-modal');
//     if (!modal) {
//         modal = document.createElement('div');
//         modal.id = 'preview-modal';
//         modal.style.position = 'fixed';
//         modal.style.top = '0';
//         modal.style.left = '0';
//         modal.style.width = '100vw';
//         modal.style.height = '100vh';
//         modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
//         modal.style.display = 'flex';
//         modal.style.justifyContent = 'center';
//         modal.style.alignItems = 'center';
//         modal.style.zIndex = '9999';

//         const content = document.createElement('div');
//         content.id = 'preview-modal-content';
//         content.style.backgroundColor = '#fff';
//         content.style.padding = '20px';
//         content.style.borderRadius = '10px';
//         content.style.maxWidth = '600px';
//         content.style.maxHeight = '80vh';
//         content.style.overflowY = 'auto';
//         content.style.whiteSpace = 'pre-wrap';
//         modal.appendChild(content);

//         // بستن مودال با کلیک روی بک‌گراند
//         modal.addEventListener('click', e => {
//             if (e.target === modal) {
//                 modal.style.display = 'none';
//             }
//         });

//         document.body.appendChild(modal);
//     }

//     // پر کردن محتوا و نمایش مودال
//     const content = document.getElementById('preview-modal-content');
//     content.textContent = previewText;
//     modal.style.display = 'flex';
// }

// // اسکرول دسته‌بندی‌ها
// function scrollCategories(direction) {
//     const barContainer = document.getElementById('bar');
//     if (barContainer) {
//         barContainer.scrollBy({ left: direction * 200, behavior: 'smooth' });
//     }
// }

// // مدیریت کلیک روی دسته‌ها
// document.querySelectorAll('.category-bar').forEach(categoryDiv => {
//     categoryDiv.addEventListener('click', () => {
//         const selectedCategory = categoryDiv.dataset.category || null;
//         fetchAndDisplayBooks(selectedCategory);
//     });
// });

// // مدیریت کلیک دکمه جستجو
// const searchButton = document.getElementById('search-button');
// const searchBox = document.getElementById('search-box');

// searchButton.addEventListener('click', () => {
//     const query = searchBox.value.trim();
//     if (query.length > 0) {
//         fetchAndDisplayBooks(null, query);
//     } else {
//         fetchAndDisplayBooks();
//     }
// });

// // جستجو با کلید Enter در input جستجو
// searchBox.addEventListener('keyup', (event) => {
//     if (event.key === 'Enter') {
//         searchButton.click();
//     }
// });

// // بارگذاری اولیه کتاب‌ها هنگام لود صفحه
// document.addEventListener('DOMContentLoaded', () => {
//     fetchAndDisplayBooks();
// });



// const baseUrl = 'http://127.0.0.1:8000'; // آدرس پایه API

// // دریافت و نمایش کتاب‌ها با فیلترهای اختیاری
// async function fetchAndDisplayBooks(genre = null, searchQuery = null, authorQuery = null) {
//     const bookList = document.getElementById('book-list');
//     const loadingMessage = document.getElementById('loading-message');
//     const errorMessage = document.getElementById('error-message');

//     if (!bookList) {
//         console.error("Element with ID 'book-list' not found.");
//         return;
//     }

//     bookList.innerHTML = '';
//     if (loadingMessage) loadingMessage.style.display = 'block';
//     if (errorMessage) errorMessage.style.display = 'none';

//     let apiUrl = `${baseUrl}/api/books/approved/`; // آدرس پیش‌فرض API
//     const params = new URLSearchParams();

//     if (genre || searchQuery || authorQuery) {
//         apiUrl = `${baseUrl}/api/books/search/`; // اگر فیلتر داریم به آدرس جستجو می‌رویم
//     }

//     if (genre) {
//         params.append('genre', genre);
//     }
//     if (searchQuery) {
//         params.append('query', searchQuery);
//     }
//     if (authorQuery) {
//         params.append('author', authorQuery);
//     }

//     if (params.toString()) {
//         apiUrl += `?${params.toString()}`;
//     }

//     try {
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(`HTTP error! status: ${response.status}, detail: ${errorData.detail || JSON.stringify(errorData)}`);
//         }
//         const books = await response.json();
//         displayBooks(books);
//     } catch (error) {
//         console.error("Error fetching books:", error);
//         if (bookList) bookList.innerHTML = '';
//         if (errorMessage) {
//             errorMessage.textContent = `Failed to load books. Please try again later. Error: ${error.message}`;
//             errorMessage.style.display = 'block';
//         }
//     } finally {
//         if (loadingMessage) loadingMessage.style.display = 'none';
//     }
// }

// // نمایش کتاب‌ها
// function displayBooks(books) {
//     const bookList = document.getElementById('book-list');
//     if (!bookList) {
//         console.error("Element with ID 'book-list' not found.");
//         return;
//     }

//     bookList.innerHTML = '';

//     if (books.length === 0) {
//         bookList.innerHTML = '<p style="text-align:center; color:#A47148; font-size:1.2em; padding:20px;">No books found matching your criteria.</p>';
//         return;
//     }

//     books.forEach(book => {
//         const bookCard = document.createElement('div');
//         bookCard.classList.add('book-card');

//         // فرض می‌کنیم `book.genre` یک آرایه از نام‌های ژانر است (با StringRelatedField).
//         // اگر هنوز از PrimaryKeyRelatedField استفاده می‌کنید، این خط "Unknown" را برمی‌گرداند.
//         const genreNames = Array.isArray(book.genre) ? book.genre.join(', ') : 'Unknown';
//         bookCard.setAttribute('data-category', genreNames);

//         // **تغییر اصلی در این خط است:**
//         // اگر cover_image_url یک URL کامل است، نیازی به اضافه کردن baseUrl نیست.
//         // فقط از آن استفاده می‌کنیم.
//         const coverImageUrl = book.cover_image_url || '/static/images/default_cover.png';


//         bookCard.innerHTML = `
//             <img src="${coverImageUrl}" alt="${book.title} Cover" class="book-cover" />
//             <div class="book-info">
//                 <h2>${book.title}</h2>
//                 <p class="author">By: ${book.author_name || book.author || 'Unknown'}</p>
//                 <p class="description">${book.description ? book.description.substring(0, 100) + '...' : 'No description'}</p>
//                 <p class="price">$${parseFloat(book.price).toFixed(2)}</p>
//                 <a href="#" class="btn-read-more" data-book-id="${book.id}">Read More</a>
//             </div>
//         `;

//         bookList.appendChild(bookCard);
//     });

//     // اضافه کردن رویداد کلیک به دکمه‌های "Read More"
//     document.querySelectorAll('.btn-read-more').forEach(button => {
//         button.addEventListener('click', async (event) => {
//             event.preventDefault();
//             const bookId = event.target.dataset.bookId;
//             await fetchBookPreview(bookId);
//         });
//     });
// }

// // دریافت پیش‌نمایش کتاب
// async function fetchBookPreview(bookId) {
//     try {
//         const response = await fetch(`${baseUrl}/api/books/${bookId}/preview/`);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch preview: ${response.status}`);
//         }
//         const previewData = await response.json();
//         showPreviewModal(previewData.preview_text || "No preview available.");
//     } catch (error) {
//         alert("Error loading preview: " + error.message);
//     }
// }

// // نمایش پیش‌نمایش در مودال
// function showPreviewModal(previewText) {
//     let modal = document.getElementById('preview-modal');
//     if (!modal) {
//         modal = document.createElement('div');
//         modal.id = 'preview-modal';
//         modal.style.position = 'fixed';
//         modal.style.top = '0';
//         modal.style.left = '0';
//         modal.style.width = '100vw';
//         modal.style.height = '100vh';
//         modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
//         modal.style.display = 'flex';
//         modal.style.justifyContent = 'center';
//         modal.style.alignItems = 'center';
//         modal.style.zIndex = '9999';

//         const content = document.createElement('div');
//         content.id = 'preview-modal-content';
//         content.style.backgroundColor = '#fff';
//         content.style.padding = '20px';
//         content.style.borderRadius = '10px';
//         content.style.maxWidth = '600px';
//         content.style.maxHeight = '80vh';
//         content.style.overflowY = 'auto';
//         content.style.whiteSpace = 'pre-wrap';
//         modal.appendChild(content);

//         modal.addEventListener('click', e => {
//             if (e.target === modal) {
//                 modal.style.display = 'none';
//             }
//         });

//         document.body.appendChild(modal);
//     }

//     const content = document.getElementById('preview-modal-content');
//     content.textContent = previewText;
//     modal.style.display = 'flex';
// }

// // اسکرول دسته‌بندی‌ها
// function scrollCategories(direction) {
//     const barContainer = document.getElementById('bar');
//     if (barContainer) {
//         barContainer.scrollBy({ left: direction * 200, behavior: 'smooth' });
//     }
// }

// // مدیریت کلیک روی دسته‌ها
// document.querySelectorAll('.category-bar').forEach(categoryDiv => {
//     categoryDiv.addEventListener('click', () => {
//         const selectedCategory = categoryDiv.dataset.category || null;
//         fetchAndDisplayBooks(selectedCategory);
//     });
// });

// // مدیریت کلیک دکمه جستجو
// const searchButton = document.getElementById('search-button');
// const searchBox = document.getElementById('search-box');

// searchButton.addEventListener('click', () => {
//     const query = searchBox.value.trim();
//     if (query.length > 0) {
//         fetchAndDisplayBooks(null, query);
//     } else {
//         fetchAndDisplayBooks();
//     }
// });

// // جستجو با کلید Enter در input جستجو
// searchBox.addEventListener('keyup', (event) => {
//     if (event.key === 'Enter') {
//         searchButton.click();
//     }
// });

// // بارگذاری اولیه کتاب‌ها هنگام لود صفحه
// document.addEventListener('DOMContentLoaded', () => {
//     fetchAndDisplayBooks();
// });

// // static/js/scripts.js

// // تابع برای اسکرول کردن دسته‌بندی‌ها
// function scrollCategories(direction) {
//     const bar = document.getElementById('bar');
//     const scrollAmount = bar.clientWidth / 2; // Scroll half the width of the container
//     bar.scrollBy({
//         left: direction * scrollAmount,
//         behavior: 'smooth'
//     });
// }

// // تابع برای فچ کردن و نمایش کتاب‌ها
// async function fetchAndDisplayBooks(category = null, searchQuery = '') {
//     const bookList = document.getElementById('book-list');
//     const loadingMessage = document.getElementById('loading-message');
//     const errorMessage = document.getElementById('error-message');

//     bookList.innerHTML = ''; // Clear previous books
//     loadingMessage.style.display = 'block';
//     errorMessage.style.display = 'none';

//     let url = '/api/books/'; // فرض می‌کنیم یک API endpoint دارید که لیست کتاب‌ها را برمی‌گرداند

//     const params = new URLSearchParams();
//     if (category) {
//         params.append('category', category);
//     }
//     if (searchQuery) {
//         params.append('search', searchQuery);
//     }
//     if (params.toString()) {
//         url += `?${params.toString()}`;
//     }

//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const books = await response.json();
//         loadingMessage.style.display = 'none';

//         if (books.length === 0) {
//             bookList.innerHTML = '<p style="text-align: center; color: #777;">No books found in this category or matching your search.</p>';
//             return;
//         }

//         books.forEach(book => {
//             const bookCard = document.createElement('div');
//             bookCard.classList.add('book-card');

//             // ساخت URL برای صفحه جزئیات کتاب
//             // نکته: اگر از Django URL reverse در JS استفاده می‌کنید، باید آن را از طریق قالب رندر کنید
//             // اما برای سادگی، یک URL مستقیم بر اساس ID کتاب می‌سازیم.
//             const detailUrl = `/books/${book.id}/`; // فرض می کنیم URL شما این ساختار را دارد

//             bookCard.innerHTML = `
//                 <a href="${detailUrl}" class="book-card-link">
//                     <img src="${book.image}" alt="${book.title}" />
//                     <h3>${book.title}</h3>
//                     <p class="book-author">${book.author}</p>
//                     <div class="book-price">$${book.price}</div>
//                     <button class="read-more-btn">Read More</button>
//                 </a>
//             `;
//             bookList.appendChild(bookCard);
//         });

//     } catch (error) {
//         console.error("Error fetching books:", error);
//         loadingMessage.style.display = 'none';
//         errorMessage.style.display = 'block';
//         errorMessage.textContent = 'Failed to load books. Please try again later.';
//     }
// }

// // Event Listeners for category filtering
// document.addEventListener('DOMContentLoaded', () => {
//     const categoryBars = document.querySelectorAll('.category-bar');
//     categoryBars.forEach(bar => {
//         bar.addEventListener('click', () => {
//             const category = bar.dataset.category;
//             fetchAndDisplayBooks(category);

//             // Optional: Highlight active category
//             categoryBars.forEach(b => b.classList.remove('active-category'));
//             bar.classList.add('active-category');
//         });
//     });

//     // Event Listener for search button
//     const searchButton = document.getElementById('search-button');
//     const searchBox = document.getElementById('search-box');
//     searchButton.addEventListener('click', () => {
//         const searchQuery = searchBox.value;
//         fetchAndDisplayBooks(null, searchQuery);
//     });

//     searchBox.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter') {
//             const searchQuery = searchBox.value;
//             fetchAndDisplayBooks(null, searchQuery);
//         }
//     });


//     // Initial load of all books
//     fetchAndDisplayBooks();
// });









const baseUrl = 'http://127.0.0.1:8000'; // آدرس پایه API

// تابع واحد برای دریافت و نمایش کتاب‌ها با فیلترهای اختیاری
async function fetchAndDisplayBooks(genre = null, searchQuery = null, authorQuery = null) {
    const bookList = document.getElementById('book-list');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');

    if (!bookList) {
        console.error("Element with ID 'book-list' not found.");
        return;
    }

    bookList.innerHTML = '';
    if (loadingMessage) loadingMessage.style.display = 'block';
    if (errorMessage) errorMessage.style.display = 'none';

    let apiUrl = `${baseUrl}/api/books/approved/`; // آدرس پیش‌فرض API
    const params = new URLSearchParams();

    if (genre || searchQuery || authorQuery) {
        apiUrl = `${baseUrl}/api/books/search/`; // اگر فیلتر داریم به آدرس جستجو می‌رویم
    }

    if (genre) {
        params.append('genre', genre);
    }
    if (searchQuery) {
        params.append('query', searchQuery);
    }
    if (authorQuery) {
        params.append('author', authorQuery);
    }

    if (params.toString()) {
        apiUrl += `?${params.toString()}`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, detail: ${errorData.detail || JSON.stringify(errorData)}`);
        }
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        if (bookList) bookList.innerHTML = '';
        if (errorMessage) {
            errorMessage.textContent = `Failed to load books. Please try again later. Error: ${error.message}`;
            errorMessage.style.display = 'block';
        }
    } finally {
        if (loadingMessage) loadingMessage.style.display = 'none';
    }
}

// تابع برای نمایش کتاب‌ها در DOM
function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    if (!bookList) {
        console.error("Element with ID 'book-list' not found.");
        return;
    }

    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p style="text-align:center; color:#A47148; font-size:1.2em; padding:20px;">No books found matching your criteria.</p>';
        return;
    }

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        const genreNames = Array.isArray(book.genre) ? book.genre.join(', ') : 'Unknown';
        bookCard.setAttribute('data-category', genreNames);

        const coverImageUrl = book.cover_image_url || '/static/images/default_cover.png';
        const detailUrl = `/books/${book.id}/`;

        bookCard.innerHTML = `
            <a href="${detailUrl}" class="book-card-link">
                <img src="${coverImageUrl}" alt="${book.title} Cover" class="book-cover" />
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="author">By: ${book.author_name || book.author || 'Unknown'}</p>
                    <p class="description">${book.description ? book.description.substring(0, 100) + '...' : 'No description'}</p>
                    <p class="price">$${parseFloat(book.price).toFixed(2)}</p>
                    <button class="btn-read-more" data-book-id="${book.id}">Read More</button>
                </div>
            </a>
        `;
        bookList.appendChild(bookCard);
    });

    // اضافه کردن رویداد کلیک به دکمه‌های "Read More"
    document.querySelectorAll('.btn-read-more').forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const bookId = event.target.dataset.bookId;
            await fetchBookPreview(bookId);
        });
    });
}

// دریافت پیش‌نمایش کتاب
async function fetchBookPreview(bookId) {
    try {
        const response = await fetch(`${baseUrl}/api/books/${bookId}/preview/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch preview: ${response.status}`);
        }
        const previewData = await response.json();
        showPreviewModal(previewData.preview_text || "No preview available.");
    } catch (error) {
        alert("Error loading preview: " + error.message);
    }
}

// نمایش پیش‌نمایش در مودال
function showPreviewModal(previewText) {
    let modal = document.getElementById('preview-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'preview-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';

        const content = document.createElement('div');
        content.id = 'preview-modal-content';
        content.style.backgroundColor = '#fff';
        content.style.padding = '20px';
        content.style.borderRadius = '10px';
        content.style.maxWidth = '600px';
        content.style.maxHeight = '80vh';
        content.style.overflowY = 'auto';
        content.style.whiteSpace = 'pre-wrap';
        modal.appendChild(content);

        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.body.appendChild(modal);
    }

    const content = document.getElementById('preview-modal-content');
    content.textContent = previewText;
    modal.style.display = 'flex';
}

// اسکرول دسته‌بندی‌ها
function scrollCategories(direction) {
    const barContainer = document.getElementById('bar');
    if (barContainer) {
        const scrollAmount = barContainer.clientWidth / 2;
        barContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
}

// رویدادها را در یک بلوک `DOMContentLoaded` مدیریت می‌کنیم
document.addEventListener('DOMContentLoaded', () => {
    // بارگذاری اولیه کتاب‌ها هنگام لود صفحه
    fetchAndDisplayBooks();

    // مدیریت کلیک روی دسته‌ها
    const categoryBars = document.querySelectorAll('.category-bar');
    categoryBars.forEach(categoryDiv => {
        categoryDiv.addEventListener('click', () => {
            const selectedCategory = categoryDiv.dataset.category || null;
            fetchAndDisplayBooks(selectedCategory);
            // optional: highlight active category
            categoryBars.forEach(b => b.classList.remove('active-category'));
            categoryDiv.classList.add('active-category');
        });
    });

    // مدیریت کلیک دکمه جستجو
    const searchButton = document.getElementById('search-button');
    const searchBox = document.getElementById('search-box');

    searchButton.addEventListener('click', () => {
        const query = searchBox.value.trim();
        if (query.length > 0) {
            fetchAndDisplayBooks(null, query);
        } else {
            fetchAndDisplayBooks();
        }
    });

    // جستجو با کلید Enter در input جستجو
    searchBox.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
});


// static/js/scripts.js

// ... سایر کدهای JavaScript شما

// رویداد کلیک روی کارت‌های کتاب
document.addEventListener('DOMContentLoaded', () => {
    // ... سایر کدها
    
    // اضافه کردن رویداد کلیک به دکمه‌های "Read More"
    const bookList = document.getElementById('book-list');
    if (bookList) {
        bookList.addEventListener('click', async (event) => {
            const button = event.target.closest('.btn-read-more');
            if (button) {
                event.preventDefault(); // جلوگیری از هدایت به لینک
                const bookId = button.dataset.bookId;
                await showBookDetails(bookId);
            }
        });
    }

    // تابع نمایش جزئیات کتاب
    async function showBookDetails(bookId) {
        const modal = document.getElementById('book-detail-modal');
        const contentDiv = document.getElementById('book-detail-content');
        
        // نمایش لودینگ
        contentDiv.innerHTML = '<div style="text-align: center; padding: 20px;">در حال بارگذاری...</div>';
        modal.style.display = 'flex'; // تغییر به flex

        try {
            const response = await fetch(`${baseUrl}/api/books/${bookId}/`);
            if (!response.ok) {
                throw new Error('کتاب مورد نظر یافت نشد.');
            }
            const book = await response.json();
            
            // ساخت HTML برای جزئیات کتاب
            const genresHtml = book.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('');
            const ratingsHtml = book.ratings.map(rating => `
                <div class="rating-item">
                    <p><strong>${rating.user_info.first_name || 'کاربر'} ${rating.user_info.last_name || ''}</strong> - امتیاز: ${rating.rating}/5</p>
                    <p>${rating.comment}</p>
                </div>
            `).join('');

            contentDiv.innerHTML = `
                <div class="book-detail-header">
                    <img src="${book.cover_image_url}" alt="${book.title}" class="book-detail-cover">
                    <div class="book-info">
                        <h2>${book.title}</h2>
                        <p class="author">توسط: ${book.author_name}</p>
                        <p class="price">${book.price} تومان</p>
                        <p class="stock">موجودی: ${book.stock}</p>
                        <p class="rating">میانگین امتیاز: ${book.average_rating ? book.average_rating.toFixed(1) : 'بدون امتیاز'}/5</p>
                        <button class="add-to-cart-btn" data-id="${book.id}">افزودن به سبد خرید</button>
                        ${book.sample_file_url ? `<a href="${book.sample_file_url}" target="_blank" class="sample-file-btn">پیش‌نمایش کتاب</a>` : ''}
                    </div>
                </div>
                <div class="book-detail-description">
                    <h3>توضیحات</h3>
                    <p>${book.description}</p>
                    <div class="genres">
                        ${genresHtml}
                    </div>
                </div>
                <div class="book-ratings">
                    <h3>نظرات کاربران</h3>
                    ${ratingsHtml || '<p>هنوز نظری برای این کتاب ثبت نشده است.</p>'}
                </div>
            `;
        } catch (error) {
            contentDiv.innerHTML = `<p style="color: red; text-align: center;">${error.message}</p>`;
        }
    }
    
    // رویداد بسته شدن Modal
    const modal = document.getElementById('book-detail-modal');
    const closeBtn = document.querySelector('.close-button');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

