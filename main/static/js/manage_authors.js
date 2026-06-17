// // manage_authors.js

// document.addEventListener('DOMContentLoaded', () => {
//     const authorListDiv = document.getElementById('authors-management-list');
//     const authorSearchBox = document.getElementById('author-search-box');
//     const authorSearchButton = document.getElementById('author-search-button');

//     function getCookie(name) { /* ... same getCookie function ... */ }
//     function fetchData(url) { /* ... same fetchData function ... */ }
//     function showMessage(message, type) { /* ... same showMessage function ... */ }

//     async function renderAuthors(authors) {
//         authorListDiv.innerHTML = '';
//         if (authors.length === 0) {
//             authorListDiv.innerHTML = `<p class="no-results-message">No authors found.</p>`;
//             return;
//         }

//         const table = document.createElement('table');
//         table.className = 'data-table';
//         table.innerHTML = `
//             <thead>
//                 <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>Biography</th>
//                     <th>Birth Date</th>
//                     <th>Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//             </tbody>
//         `;
//         const tbody = table.querySelector('tbody');

//         authors.forEach(author => {
//             const row = tbody.insertRow();
//             row.innerHTML = `
//                 <td>${author.id}</td>
//                 <td>${author.first_name} ${author.last_name}</td>
//                 <td>${author.biography ? author.biography.substring(0, 100) + '...' : 'N/A'}</td>
//                 <td>${author.birth_date || 'N/A'}</td>
//                 <td>
//                     <button class="edit-btn" data-id="${author.id}"><i class="fas fa-edit"></i> Edit</button>
//                     <button class="delete-btn" data-id="${author.id}"><i class="fas fa-trash-alt"></i> Delete</button>
//                 </td>
//             `;
//         });
//         authorListDiv.appendChild(table);

//         attachAuthorActionListeners();
//     }

//     function attachAuthorActionListeners() {
//         document.querySelectorAll('.edit-btn').forEach(button => {
//             button.onclick = (event) => handleEditAuthor(event.target.dataset.id);
//         });
//         document.querySelectorAll('.delete-btn').forEach(button => {
//             button.onclick = (event) => handleDeleteAuthor(event.target.dataset.id);
//         });
//     }

//     function handleEditAuthor(authorId) {
//         alert(`Editing author ID: ${authorId}. (Opens new page or modal)`);
//         window.location.href = `/edit-author/${authorId}/`; // Example redirect
//     }

//     async function handleDeleteAuthor(authorId) {
//         if (confirm(`Are you sure you want to delete author ID: ${authorId}?`)) {
//             try {
//                 const response = await fetch(`/api/authors/${authorId}/delete/`, {
//                     method: 'DELETE',
//                     headers: { 'X-CSRFToken': getCookie('csrftoken') },
//                 });
//                 if (!response.ok) throw new Error(`Failed to delete author! Status: ${response.status}`);
//                 showMessage(`Author ID: ${authorId} deleted successfully.`, 'success');
//                 fetchAndRenderAuthors();
//             } catch (error) {
//                 console.error('Error deleting author:', error);
//                 showMessage(`Error deleting author: ${error.message}`, 'error');
//             }
//         }
//     }

//     async function fetchAndRenderAuthors(query = '') {
//         let url = '/api/authors/'; // Your API endpoint for authors
//         if (query) url += `?search=${encodeURIComponent(query)}`;
//         const authors = await fetchData(url);
//         renderAuthors(authors);
//     }

//     // Event Listeners for search
//     authorSearchButton.addEventListener('click', () => fetchAndRenderAuthors(authorSearchBox.value.trim()));
//     authorSearchBox.addEventListener('keypress', (event) => {
//         if (event.key === 'Enter') authorSearchButton.click();
//     });

//     // Initial load
//     fetchAndRenderAuthors();
// });









document.addEventListener('DOMContentLoaded', () => {
    const addAuthorForm = document.getElementById('addAuthorForm');
    const messageDiv = document.getElementById('message');
    const authorsList = document.getElementById('authorsList');
    const submitAuthorButton = document.getElementById('submitAuthorButton');
    const cancelEditButton = document.getElementById('cancelEditButton');

    let editingAuthorId = null; // To store the ID of the author being edited

    // --- Helper Functions ---

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block'; // Ensure it's visible
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
            messageDiv.style.display = 'none'; // Hide after 5 seconds
        }, 5000);
    }

    // --- Core Author Management Functions ---

    // Function to fetch all authors
    async function fetchAuthors() {
        try {
            const authToken = getCookie('auth_token'); // Assuming you get the token from a cookie
            if (!authToken) {
                showMessage('برای مشاهده نویسندگان، ابتدا وارد شوید.', 'error');
                authorsList.innerHTML = '<tr><td colspan="8">برای مشاهده نویسندگان، ابتدا وارد شوید.</td></tr>';
                return;
            }

            const response = await fetch('/api/authors/', { // API endpoint for listing authors
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`, // Include auth token
                },
                credentials: 'include', // Important for sending cookies
            });

            if (response.ok) {
                const authors = await response.json();
                renderAuthors(authors);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'خطا در بارگذاری نویسندگان.');
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
            showMessage(`خطا در بارگذاری نویسندگان: ${error.message}`, 'error');
            authorsList.innerHTML = '<tr><td colspan="8">خطا در بارگذاری نویسندگان.</td></tr>';
        }
    }

    // Function to render authors in the table
    function renderAuthors(authors) {
        authorsList.innerHTML = ''; // Clear previous content
        if (authors.length === 0) {
            authorsList.innerHTML = '<tr><td colspan="8">نویسنده‌ای یافت نشد.</td></tr>';
            return;
        }

        authors.forEach(author => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${author.username}</td>
                <td>${author.first_name || ''}</td>
                <td>${author.last_name || ''}</td>
                <td>${author.email || ''}</td>
                <td>${author.contact_number || ''}</td>
                <td>${new Date(author.date_joined).toLocaleString('fa-IR')}</td>
                <td>${author.role || 'کاربر عادی'}</td>
                <td class="action-buttons">
                    <button class="edit-button" data-id="${author.id}">ویرایش</button>
                    <button class="delete-button" data-id="${author.id}">حذف</button>
                </td>
            `;
            authorsList.appendChild(row);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (event) => editAuthor(event.target.dataset.id));
        });
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => deleteAuthor(event.target.dataset.id));
        });
    }

    // Function to handle adding or updating an author
    async function addOrUpdateAuthor(event) {
        event.preventDefault();

        const username = document.getElementById('authorUsername').value;
        const password = document.getElementById('authorPassword').value; // Password is optional for PUT
        const firstName = document.getElementById('authorFirstName').value;
        const lastName = document.getElementById('authorLastName').value;
        const email = document.getElementById('authorEmail').value;
        const contactNumber = document.getElementById('authorContactNumber').value;

        const formData = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            contact_number: contactNumber,
        };

        // Only include password if it's provided (for new creation or explicit change)
        if (password) {
            formData.password = password;
        }

        let url = '/api/authors/add/'; // API endpoint for adding (POST)
        let method = 'POST';
        let successMessage = 'نویسنده با موفقیت اضافه شد!';

        if (editingAuthorId) {
            url = `/api/authors/${editingAuthorId}/`; // API endpoint for updating (PUT)
            method = 'PUT';
            successMessage = 'نویسنده با موفقیت ویرایش شد!';
        }

        try {
            const authToken = getCookie('auth_token');
            if (!authToken) {
                showMessage('برای انجام این عملیات، ابتدا وارد شوید.', 'error');
                return;
            }
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'), // Always send CSRF for POST/PUT/DELETE
                    'Authorization': `Token ${authToken}`, // Include auth token
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(successMessage, 'success');
                addAuthorForm.reset();
                editingAuthorId = null; // Reset editing state
                submitAuthorButton.textContent = 'افزودن نویسنده'; // Change button text back
                cancelEditButton.style.display = 'none'; // Hide cancel button
                fetchAuthors(); // Refresh the list
            } else {
                let errorMessage = 'خطا در عملیات نویسنده: ';
                if (data.detail) {
                    errorMessage += data.detail;
                } else {
                    // Concatenate all validation errors
                    for (const key in data) {
                        errorMessage += `${key}: ${data[key].join(', ')} `;
                    }
                }
                showMessage(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showMessage('خطای شبکه یا سرور. لطفاً دوباره تلاش کنید.', 'error');
        }
    }

    // Function to populate the form for editing
    async function editAuthor(id) {
        try {
            const authToken = getCookie('auth_token');
            if (!authToken) {
                showMessage('برای ویرایش نویسنده، ابتدا وارد شوید.', 'error');
                return;
            }

            const response = await fetch(`/api/authors/${id}/`, { // API endpoint for detail
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                const author = await response.json();
                document.getElementById('authorUsername').value = author.username;
                // password field should ideally not be pre-filled for security
                document.getElementById('authorPassword').value = ''; // Clear password field
                document.getElementById('authorFirstName').value = author.first_name || '';
                document.getElementById('authorLastName').value = author.last_name || '';
                document.getElementById('authorEmail').value = author.email || '';
                document.getElementById('authorContactNumber').value = author.contact_number || '';

                editingAuthorId = author.id;
                submitAuthorButton.textContent = 'به روز رسانی نویسنده';
                cancelEditButton.style.display = 'inline-block'; // Show cancel button
                addAuthorForm.scrollIntoView({ behavior: 'smooth' }); // Scroll to form
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'خطا در دریافت اطلاعات نویسنده.');
            }
        } catch (error) {
            console.error('Error fetching author for edit:', error);
            showMessage(`خطا در بارگذاری نویسنده برای ویرایش: ${error.message}`, 'error');
        }
    }

    // Function to delete an author
    async function deleteAuthor(id) {
        if (!confirm('آیا مطمئن هستید که می‌خواهید این نویسنده را حذف کنید؟')) {
            return;
        }

        try {
            const authToken = getCookie('auth_token');
            if (!authToken) {
                showMessage('برای حذف نویسنده، ابتدا وارد شوید.', 'error');
                return;
            }

            const response = await fetch(`/api/authors/${id}/`, { // API endpoint for deletion
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'), // CSRF for DELETE
                    'Authorization': `Token ${authToken}`,
                },
                credentials: 'include',
            });

            if (response.ok) { // 204 No Content for successful delete
                showMessage('نویسنده با موفقیت حذف شد.', 'success');
                fetchAuthors(); // Refresh the list
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'خطا در حذف نویسنده.');
            }
        } catch (error) {
            console.error('Error deleting author:', error);
            showMessage(`خطا در حذف نویسنده: ${error.message}`, 'error');
        }
    }

    // Function to cancel editing mode
    function cancelEdit() {
        addAuthorForm.reset();
        editingAuthorId = null;
        submitAuthorButton.textContent = 'افزودن نویسنده';
        cancelEditButton.style.display = 'none';
        messageDiv.style.display = 'none'; // Clear any messages
    }


    // --- Event Listeners and Initial Load ---
    if (addAuthorForm) {
        addAuthorForm.addEventListener('submit', addOrUpdateAuthor);
    } else {
        console.error('Form with ID "addAuthorForm" not found.');
    }

    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', cancelEdit);
    }

    // Initial load of authors when the page is ready
    fetchAuthors();
});






// document.addEventListener('DOMContentLoaded', () => {
//     const authorsList = document.getElementById('authorsList');

//     // تابع بارگذاری لیست نویسندگان
//     async function loadAuthors() {
//         if (!authorsList) return;
//         authorsList.textContent = 'در حال بارگذاری...';
//         try {
//             const response = await fetch('/api/authors/');  // بدون credentials
//             if (!response.ok) throw new Error('خطا در دریافت داده‌ها');
//             const data = await response.json();
//             authorsList.innerHTML = '';
//             if (data.length === 0) {
//                 authorsList.textContent = 'نویسنده‌ای یافت نشد.';
//             } else {
//                 data.forEach(author => {
//                     const li = document.createElement('li');
//                     li.textContent = `${author.first_name} ${author.last_name} (نام کاربری: ${author.username})`;
//                     authorsList.appendChild(li);
//                 });
//             }
//         } catch (err) {
//             authorsList.textContent = 'خطا در بارگذاری لیست نویسندگان.';
//             console.error(err);
//         }
//     }

//     loadAuthors(); // بارگذاری لیست در شروع

//     // افزودن نویسنده
//     const addAuthorForm = document.getElementById('addAuthorForm');
//     const messageDiv = document.getElementById('message');

//     if (addAuthorForm) {
//         addAuthorForm.addEventListener('submit', async (event) => {
//             event.preventDefault();
//             const formData = {
//                 username: document.getElementById('authorUsername').value,
//                 password: document.getElementById('authorPassword').value,
//                 first_name: document.getElementById('authorFirstName').value,
//                 last_name: document.getElementById('authorLastName').value,
//                 contact_number: document.getElementById('authorContactNumber').value,
//             };
//             try {
//                 const response = await fetch('/api/authors/add/', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(formData),
//                     // credentials حذف شد
//                 });
//                 const data = await response.json();
//                 if (response.ok) {
//                     messageDiv.textContent = '✅ نویسنده با موفقیت اضافه شد.';
//                     messageDiv.style.color = 'green';
//                     addAuthorForm.reset();
//                     loadAuthors();
//                 } else {
//                     messageDiv.textContent = '❌ خطا در افزودن نویسنده: ' + (data.detail || JSON.stringify(data));
//                     messageDiv.style.color = 'red';
//                 }
//             } catch (error) {
//                 console.error('Fetch error:', error);
//                 messageDiv.textContent = '❌ خطای شبکه یا سرور.';
//                 messageDiv.style.color = 'red';
//             }
//         });
//     }

//     // حذف نویسنده
//     const deleteAuthorForm = document.getElementById('deleteAuthorForm');
//     const deleteMessage = document.getElementById('deleteMessage');

//     if (deleteAuthorForm) {
//         deleteAuthorForm.addEventListener('submit', async (event) => {
//             event.preventDefault();
//             const username = document.getElementById('deleteAuthorUsername').value;
//             try {
//                 const response = await fetch(`/api/authors/delete/${username}/`, {
//                     method: 'DELETE',
//                     // credentials حذف شد
//                 });
//                 const data = await response.json();
//                 if (response.ok) {
//                     deleteMessage.textContent = '✅ نویسنده با موفقیت حذف شد.';
//                     deleteMessage.style.color = 'green';
//                     deleteAuthorForm.reset();
//                     loadAuthors();
//                 } else {
//                     deleteMessage.textContent = '❌ خطا در حذف نویسنده: ' + (data.detail || JSON.stringify(data));
//                     deleteMessage.style.color = 'red';
//                 }
//             } catch (error) {
//                 console.error('Fetch error:', error);
//                 deleteMessage.textContent = '❌ خطای شبکه یا سرور.';
//                 deleteMessage.style.color = 'red';
//             }
//         });
//     }

//     // ویرایش نویسنده
//     const editAuthorForm = document.getElementById('editAuthorForm');
//     const editMessage = document.getElementById('editMessage');

//     if (editAuthorForm) {
//         editAuthorForm.addEventListener('submit', async (event) => {
//             event.preventDefault();

//             const username = document.getElementById('editUsername').value;
//             const formData = {
//                 first_name: document.getElementById('newFirstName').value,
//                 last_name: document.getElementById('newLastName').value,
//                 contact_number: document.getElementById('newContactNumber').value,
//             };

//             try {
//                 const response = await fetch(`/api/authors/update/${username}/`, {
//                     method: 'PUT',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(formData),
//                     // credentials حذف شد
//                 });

//                 const data = await response.json();

//                 if (response.ok) {
//                     editMessage.textContent = '✅ نویسنده با موفقیت ویرایش شد.';
//                     editMessage.style.color = 'green';
//                     editAuthorForm.reset();
//                     loadAuthors();
//                 } else {
//                     editMessage.textContent = '❌ خطا در ویرایش نویسنده: ' + (data.detail || JSON.stringify(data));
//                     editMessage.style.color = 'red';
//                 }
//             } catch (error) {
//                 console.error('Fetch error:', error);
//                 editMessage.textContent = '❌ خطای شبکه یا سرور.';
//                 editMessage.style.color = 'red';
//             }
//         });
//     }
// });
