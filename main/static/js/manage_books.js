// document.addEventListener('DOMContentLoaded', () => {
//     const bookForm = document.getElementById('book-form');
//     const messageContainer = document.getElementById('message-container');
//     const bookIdInput = document.getElementById('book-id');
//     const submitButton = document.getElementById('submit-button');
//     const cancelEditButton = document.getElementById('cancel-edit-button');

//     const authorNameInput = document.getElementById('author-name');
//     const authorIdInput = document.getElementById('author-id');
//     const authorSuggestionsDiv = document.getElementById('author-suggestions');
//     const newAuthorFieldsDiv = document.getElementById('new-author-fields');
//     const newAuthorFirstName = document.getElementById('new_author_first_name');
//     const newAuthorLastName = document.getElementById('new_author_last_name');
//     const bookListDiv = document.getElementById('book-list');

//     let currentAuthorSelected = false; // Flag to track if an author suggestion was clicked

//     function getCookie(name) {
//         let cookieValue = null;
//         if (document.cookie && document.cookie !== '') {
//             const cookies = document.cookie.split(';');
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i].trim();
//                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }

//     function showMessage(message, type) {
//         if (messageContainer) {
//             messageContainer.innerHTML = `<p class="${type}">${message}</p>`;
//             setTimeout(() => {
//                 messageContainer.innerHTML = '';
//             }, 5000);
//         } else {
//             console.log(`Message (${type}): ${message}`);
//         }
//     }

//     // --- Author Autocomplete Logic ---
//     let debounceTimeout;
//     authorNameInput.addEventListener('input', async (event) => {
//         clearTimeout(debounceTimeout);
//         const query = event.target.value.trim();
//         currentAuthorSelected = false; // Reset selection flag

//         if (query.length < 2) {
//             authorSuggestionsDiv.innerHTML = '';
//             authorIdInput.value = '';
//             newAuthorFieldsDiv.style.display = 'none';
//             return;
//         }

//         debounceTimeout = setTimeout(async () => {
//             try {
//                 const response = await fetch(`/api/authors/?search=${encodeURIComponent(query)}`, {
//                     headers: {
//                         'X-CSRFToken': getCookie('csrftoken'),
//                     },
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.detail || 'Error loading authors');
//                 }

//                 const authors = await response.json();

//                 authorSuggestionsDiv.innerHTML = '';
//                 authorIdInput.value = ''; // Clear author ID until selection

//                 if (authors.length > 0) {
//                     authors.forEach(author => {
//                         const suggestionItem = document.createElement('div');
//                         suggestionItem.classList.add('author-suggestion-item');
//                         suggestionItem.textContent = `${author.first_name} ${author.last_name}`;
//                         suggestionItem.dataset.authorId = author.id;
//                         suggestionItem.addEventListener('click', () => {
//                             authorNameInput.value = `${author.first_name} ${author.last_name}`;
//                             authorIdInput.value = author.id;
//                             authorSuggestionsDiv.innerHTML = '';
//                             newAuthorFieldsDiv.style.display = 'none';
//                             newAuthorFirstName.value = '';
//                             newAuthorLastName.value = '';
//                             currentAuthorSelected = true; // Mark as selected
//                         });
//                         authorSuggestionsDiv.appendChild(suggestionItem);
//                     });
//                     newAuthorFieldsDiv.style.display = 'none';
//                 } else {
//                     authorSuggestionsDiv.innerHTML = '<p>Author not found. You can create a new author.</p>';
//                     newAuthorFieldsDiv.style.display = 'block';
//                 }
//             } catch (error) {
//                 console.error('Error fetching author suggestions:', error);
//                 showMessage(`Error loading author list: ${error.message}`, 'error');
//             }
//         }, 300);
//     });

//     // If author input is cleared manually, reset author ID and show new author fields
//     authorNameInput.addEventListener('change', () => {
//         if (!currentAuthorSelected && authorNameInput.value.trim() === '') {
//             authorIdInput.value = '';
//             newAuthorFieldsDiv.style.display = 'block';
//             newAuthorFirstName.value = '';
//             newAuthorLastName.value = '';
//         }
//     });


//     // --- Form Submission (Edit) ---
//     bookForm.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         const bookId = bookIdInput.value;
//         if (!bookId) {
//             showMessage('Please select a book from the list to edit first.', 'error');
//             return;
//         }

//         const formData = new FormData(bookForm);

//         const title = formData.get('title');
//         const description = formData.get('description');
//         const price = parseFloat(formData.get('price'));
//         const bookType = document.getElementById('book_type').value;

//         // Frontend validation
//         if (!title || title.length < 3) {
//             showMessage('Book title must be at least 3 characters.', 'error');
//             return;
//         }
//         if (!description || description.length < 10) {
//             showMessage('Description must be at least 10 characters.', 'error');
//             return;
//         }
//         if (isNaN(price) || price <= 0) {
//             showMessage('Book price must be a positive number.', 'error');
//             return;
//         }
//         if (!bookType) {
//             showMessage('Book type is required.', 'error');
//             return;
//         }

//         // For editing, clear files if new ones aren't provided to avoid sending empty file parts
//         if (formData.get('full_file').size === 0) {
//             formData.delete('full_file');
//         }
//         if (formData.get('sample_file').size === 0) {
//             formData.delete('sample_file');
//         }
//         if (formData.get('cover_image').size === 0) {
//             formData.delete('cover_image');
//         }


//         // Handle author selection or new author creation
//         const selectedAuthorId = authorIdInput.value;
//         if (!selectedAuthorId) {
//             const newAuthorFirst = newAuthorFirstName.value.trim();
//             const newAuthorLast = newAuthorLastName.value.trim();

//             if (!newAuthorFirst || !newAuthorLast) {
//                 showMessage('To edit the book, either select an existing author or provide full details for a new author (first name, last name).', 'error');
//                 return;
//             }
//             formData.set('new_author_first_name', newAuthorFirst);
//             formData.set('new_author_last_name', newAuthorLast);
//             formData.delete('author'); // Remove existing author ID if creating new
//         } else {
//             formData.set('author', selectedAuthorId);
//             formData.delete('new_author_first_name');
//             formData.delete('new_author_last_name');
//         }

//         // CRITICAL FIX FOR GENRE: Send as array of IDs (based on your serializers.py)
//         const genreInput = formData.get('genre');
//         formData.delete('genre'); // Remove the single 'genre' field added by the form's default behavior
//         if (genreInput) {
//             const genreIds = genreInput.split(',')
//                                          .map(id => parseInt(id.trim(), 10))
//                                          .filter(id => !isNaN(id));
//             genreIds.forEach(id => {
//                 formData.append('genre', id);
//             });
//         }

//         try {
//             const url = `/api/admin/books/${bookId}/`;
//             const method = 'PUT'; // Always PUT for editing

//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken'),
//                 },
//                 body: formData,
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 showMessage(result.message || 'Book updated successfully!', 'success');
//                 resetForm();
//                 fetchBooks(); // Refresh the book list
//             } else {
//                 let errorMessage = 'Error editing book.';
//                 if (result) {
//                     const errorMessages = [];
//                     for (const key in result) {
//                         if (result.hasOwnProperty(key)) {
//                             const errorValue = result[key];
//                             if (Array.isArray(errorValue)) {
//                                 errorMessages.push(`${key}: ${errorValue.join(', ')}`);
//                             } else {
//                                 errorMessages.push(`${key}: ${errorValue}`);
//                             }
//                         }
//                     }
//                     if (errorMessages.length > 0) {
//                         errorMessage = errorMessages.join('; ');
//                     } else if (result.detail) {
//                         errorMessage = result.detail;
//                     }
//                 }
//                 showMessage(errorMessage, 'error');
//             }
//         } catch (error) {
//             console.error('Error submitting book:', error);
//             showMessage('An unexpected error occurred. Please try again.', 'error');
//         }
//     });

//     // --- Form Reset Logic ---
//     function resetForm() {
//         bookForm.reset();
//         bookIdInput.value = '';
//         authorIdInput.value = '';
//         authorSuggestionsDiv.innerHTML = '';
//         newAuthorFieldsDiv.style.display = 'none';
//         newAuthorFirstName.value = '';
//         newAuthorLastName.value = '';
//         document.getElementById('book_type').value = '';
//         cancelEditButton.style.display = 'none';
//         currentAuthorSelected = false; // Reset selection flag
//         showMessage('Form cleared. To edit, select a book from the list.', 'info');
//     }

//     cancelEditButton.addEventListener('click', resetForm);

//     // --- Fetch and Display Books ---
//     async function fetchBooks() {
//         bookListDiv.innerHTML = '<p>Loading books...</p>';
//         try {
//             const response = await fetch('/api/admin/books/', { // Assuming this endpoint for listing books
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken'),
//                 },
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || 'Error loading books');
//             }

//             const books = await response.json();
//             bookListDiv.innerHTML = ''; // Clear loading message

//             if (books.length === 0) {
//                 bookListDiv.innerHTML = '<p>No books found.</p>';
//                 return;
//             }

//             books.forEach(book => {
//                 const bookItem = document.createElement('div');
//                 bookItem.classList.add('book-item');
//                 const authorFullName = book.author ? `${book.author.first_name} ${book.author.last_name}` : 'Unknown';
//                 const genres = book.genre && Array.isArray(book.genre) ? book.genre.map(g => g.name).join(', ') : 'No genre';
//                 const publicationDate = book.publication_date ? new Date(book.publication_date).toLocaleDateString('en-US') : 'N/A'; // Changed to en-US for English date format

//                 bookItem.innerHTML = `
//                     <h3>${book.title}</h3>
//                     <p><strong>Author:</strong> ${authorFullName}</p>
//                     <p><strong>Genres:</strong> ${genres}</p>
//                     <p><strong>Publication Date:</strong> ${publicationDate}</p>
//                     <p><strong>Price:</strong> ${book.price} Toman</p>
//                     <p><strong>Stock:</strong> ${book.stock}</p>
//                     <p><strong>Book Type:</strong> ${book.book_type === 'ebook' ? 'E-book' : book.book_type === 'paperback' ? 'Paperback' : 'Hardcover'}</p>
//                     <div class="actions">
//                         <button class="edit-btn" data-book-id="${book.id}">Edit</button>
//                         <button class="delete-btn" data-book-id="${book.id}">Delete</button>
//                     </div>
//                 `;
//                 bookListDiv.appendChild(bookItem);
//             });

//             addEventListenersToBookButtons();

//         } catch (error) {
//             console.error('Error fetching books:', error);
//             bookListDiv.innerHTML = `<p class="error">Error loading books: ${error.message}</p>`;
//         }
//     }

//     // --- Add Event Listeners for Edit/Delete Buttons ---
//     function addEventListenersToBookButtons() {
//         document.querySelectorAll('.edit-btn').forEach(button => {
//             button.addEventListener('click', (event) => editBook(event.target.dataset.bookId));
//         });

//         document.querySelectorAll('.delete-btn').forEach(button => {
//             button.addEventListener('click', (event) => deleteBook(event.target.dataset.bookId));
//         });
//     }

//     // --- Edit Book Functionality ---
//     async function editBook(bookId) {
//         try {
//             const response = await fetch(`/api/admin/books/${bookId}/`, { // Assuming GET endpoint for single book
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken'),
//                 },
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || 'Error loading book information for editing');
//             }

//             const book = await response.json();

//             // Populate the form fields
//             bookIdInput.value = book.id;
//             document.getElementById('title').value = book.title;
//             document.getElementById('description').value = book.description;
//             document.getElementById('price').value = book.price;
//             document.getElementById('stock').value = book.stock;
//             document.getElementById('isbn').value = book.isbn || '';
//             document.getElementById('publication_date').value = book.publication_date || '';
//             document.getElementById('book_type').value = book.book_type;

//             // Handle author
//             if (book.author) {
//                 authorNameInput.value = `${book.author.first_name} ${book.author.last_name}`;
//                 authorIdInput.value = book.author.id;
//                 newAuthorFieldsDiv.style.display = 'none';
//                 currentAuthorSelected = true; // Indicate an author is selected
//             } else {
//                 authorNameInput.value = '';
//                 authorIdInput.value = '';
//                 newAuthorFieldsDiv.style.display = 'block';
//                 newAuthorFirstName.value = ''; // Clear new author fields
//                 newAuthorLastName.value = '';
//                 currentAuthorSelected = false;
//             }

//             // Handle genres (display as comma-separated IDs)
//             if (book.genre && Array.isArray(book.genre)) {
//                 document.getElementById('genre').value = book.genre.map(g => g.id).join(',');
//             } else {
//                 document.getElementById('genre').value = '';
//             }

//             // Show cancel button
//             cancelEditButton.style.display = 'inline-block';

//             showMessage('Form populated for book editing.', 'success');
//         } catch (error) {
//             console.error('Error fetching book for edit:', error);
//             showMessage(`Error loading book information for editing: ${error.message}`, 'error');
//         }
//     }

//     // --- Delete Book Functionality ---
//     async function deleteBook(bookId) {
//         if (!confirm('Are you sure you want to delete this book? This action is irreversible.')) {
//             return;
//         }

//         try {
//             const response = await fetch(`/api/admin/books/${bookId}/`, { // Assuming DELETE endpoint for book
//                 method: 'DELETE',
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken'),
//                 },
//             });

//             if (response.ok) {
//                 showMessage('Book deleted successfully.', 'success');
//                 fetchBooks(); // Refresh the book list
//                 resetForm(); // Reset form in case deleted book was being edited
//             } else {
//                 const errorData = await response.json();
//                 let errorMessage = errorData.detail || 'Error deleting book.';
//                 showMessage(errorMessage, 'error');
//             }
//         } catch (error) {
//             console.error('Error deleting book:', error);
//             showMessage('An unexpected error occurred while deleting the book. Please try again.', 'error');
//         }
//     }

//     // Initial setup
//     newAuthorFieldsDiv.style.display = 'none';
//     cancelEditButton.style.display = 'none'; // Hide cancel button initially
//     fetchBooks(); // Load books when the page loads
// });






document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const messageContainer = document.getElementById('message-container');
    const bookIdInput = document.getElementById('book-id');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');

    const authorNameInput = document.getElementById('author-name');
    const authorIdInput = document.getElementById('author-id');
    const authorSuggestionsDiv = document.getElementById('author-suggestions');
    const newAuthorFieldsDiv = document.getElementById('new-author-fields');
    const newAuthorFirstName = document.getElementById('new_author_first_name');
    const newAuthorLastName = document = document.getElementById('new_author_last_name');

    const bookListDiv = document.getElementById('book-list');
    let currentAuthorSelected = false;

    // --- Utility Functions ---
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            document.cookie.split(';').forEach(cookie => {
                const [key, value] = cookie.trim().split('=');
                if (key === name) cookieValue = decodeURIComponent(value);
            });
        }
        return cookieValue;
    }

    function showMessage(message, type = 'info') {
        if (messageContainer) {
            messageContainer.innerHTML = `<p class="${type}">${message}</p>`;
            setTimeout(() => messageContainer.innerHTML = '', 5000);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }

    // --- Author Autocomplete ---
    let debounceTimeout;
    authorNameInput.addEventListener('input', (event) => {
        clearTimeout(debounceTimeout);
        const query = event.target.value.trim();
        currentAuthorSelected = false;

        if (query.length < 2) {
            authorSuggestionsDiv.innerHTML = '';
            authorIdInput.value = '';
            newAuthorFieldsDiv.style.display = 'none';
            return;
        }

        debounceTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`/api/authors/?search=${encodeURIComponent(query)}`, {
                    headers: { 'X-CSRFToken': getCookie('csrftoken') },
                });
                if (!response.ok) throw new Error('Error loading authors');

                const authors = await response.json();
                authorSuggestionsDiv.innerHTML = '';
                authorIdInput.value = '';

                if (authors.length > 0) {
                    authors.forEach(author => {
                        const item = document.createElement('div');
                        item.classList.add('author-suggestion-item');
                        item.textContent = `${author.first_name} ${author.last_name}`;
                        item.addEventListener('click', () => {
                            authorNameInput.value = `${author.first_name} ${author.last_name}`;
                            authorIdInput.value = author.id;
                            authorSuggestionsDiv.innerHTML = '';
                            newAuthorFieldsDiv.style.display = 'none';
                            newAuthorFirstName.value = '';
                            newAuthorLastName.value = '';
                            currentAuthorSelected = true;
                        });
                        authorSuggestionsDiv.appendChild(item);
                    });
                    newAuthorFieldsDiv.style.display = 'none';
                } else {
                    authorSuggestionsDiv.innerHTML = '<p>Author not found. You can create a new author.</p>';
                    newAuthorFieldsDiv.style.display = 'block';
                }
            } catch (error) {
                console.error(error);
                showMessage(`Error loading authors: ${error.message}`, 'error');
            }
        }, 300);
    });

    authorNameInput.addEventListener('change', () => {
        if (!currentAuthorSelected && authorNameInput.value.trim() === '') {
            authorIdInput.value = '';
            newAuthorFieldsDiv.style.display = 'block';
        }
    });

    // --- Form Submission ---
    bookForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const bookId = bookIdInput.value;
        const formData = new FormData(bookForm);

        // Validation checks
        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const price = parseFloat(formData.get('price'));
        const bookType = document.getElementById('book_type').value;

        if (!title || title.length < 3) return showMessage('Book title must be at least 3 characters.', 'error');
        if (!description || description.length < 10) return showMessage('Description must be at least 10 characters.', 'error');
        if (isNaN(price) || price <= 0) return showMessage('Book price must be positive.', 'error');
        if (!bookType) return showMessage('Book type is required.', 'error');

        // Check for author details if no existing author is selected
        if (!formData.get('author') && (!newAuthorFirstName.value || !newAuthorLastName.value)) {
            return showMessage('Select an existing author or provide new author details.', 'error');
        }

        const method = bookId ? 'PUT' : 'POST';
        const url = bookId ? `/api/admin/books/${bookId}/` : '/api/admin/books/';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'X-CSRFToken': getCookie('csrftoken') },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                showMessage(result.message || (bookId ? 'Book updated successfully!' : 'Book created successfully!'), 'success');
                resetForm();
                fetchBooks();
            } else {
                const errors = Object.entries(result)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
                    .join('; ');
                showMessage(errors || 'Error saving book.', 'error');
            }
        } catch (error) {
            console.error(error);
            showMessage('An unexpected error occurred.', 'error');
        }
    });

    // --- Reset Form ---
    function resetForm() {
        bookForm.reset();
        bookIdInput.value = '';
        authorIdInput.value = '';
        authorSuggestionsDiv.innerHTML = '';
        newAuthorFieldsDiv.style.display = 'none';
        newAuthorFirstName.value = '';
        newAuthorLastName.value = '';
        document.getElementById('book_type').value = '';
        cancelEditButton.style.display = 'none';
        currentAuthorSelected = false;
        submitButton.textContent = 'Add Book'; // Change button text for new book creation
        showMessage('Form cleared. You can add a new book or select one from the list to edit.', 'info');
    }
    cancelEditButton.addEventListener('click', resetForm);

    // --- Load Book Into Form ---
    function loadBookIntoForm(book) {
        bookIdInput.value = book.id;
        bookForm.title.value = book.title;
        bookForm.description.value = book.description;
        bookForm.price.value = book.price;
        document.getElementById('book_type').value = book.book_type;

        authorNameInput.value = book.author_name;
        authorIdInput.value = book.author_id || '';
        currentAuthorSelected = true;
        newAuthorFieldsDiv.style.display = 'none';
        newAuthorFirstName.value = '';
        newAuthorLastName.value = '';

        document.getElementById('genre-input').value = (book.genres || []).join(',');
        cancelEditButton.style.display = 'inline-block';
        submitButton.textContent = 'Update Book'; // Change button text for editing
        showMessage('Book loaded into form. You can now edit it.', 'info');
    }

    // --- Delete Book ---
    async function deleteBook(bookId) {
        if (!confirm('Are you sure you want to delete this book?')) return;
        try {
            const response = await fetch(`/api/admin/books/${bookId}/`, {
                method: 'DELETE',
                headers: { 'X-CSRFToken': getCookie('csrftoken') },
            });
            if (response.ok) {
                showMessage('Book deleted successfully.', 'success');
                fetchBooks();
            } else {
                showMessage('Failed to delete book.', 'error');
            }
        } catch (error) {
            console.error(error);
            showMessage('Error deleting book.', 'error');
        }
    }

    // --- Approve Book ---
    async function approveBook(bookId) {
        try {
            const response = await fetch(`/api/admin/books/${bookId}/approve/`, {
                method: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') },
            });
            if (response.ok) {
                showMessage('Book approved successfully.', 'success');
                fetchBooks();
            } else {
                showMessage('Failed to approve book.', 'error');
            }
        } catch (error) {
            console.error(error);
            showMessage('Error approving book.', 'error');
        }
    }

    // --- Fetch Books ---
    async function fetchBooks() {
        bookListDiv.innerHTML = '<p>Loading books...</p>';
        try {
            const response = await fetch('/api/admin/books/', { headers: { 'X-CSRFToken': getCookie('csrftoken') } });
            if (!response.ok) throw new Error('Error loading books');
            const books = await response.json();
            bookListDiv.innerHTML = '';

            if (books.length === 0) return bookListDiv.innerHTML = '<p>No books found.</p>';

            books.forEach(book => {
                const div = document.createElement('div');
                div.classList.add('book-item');
                div.innerHTML = `
                    <strong>${book.title}</strong> by ${book.author_name} - ${book.price}$
                    <button class="edit-book-button" data-book-id="${book.id}">Edit</button>
                    <button class="delete-book-button" data-book-id="${book.id}">Delete</button>
                    <button class="approve-book-button" data-book-id="${book.id}">Approve</button>
                `;

                div.querySelector('.edit-book-button').addEventListener('click', () => loadBookIntoForm(book));
                div.querySelector('.delete-book-button').addEventListener('click', () => deleteBook(book.id));
                div.querySelector('.approve-book-button').addEventListener('click', () => approveBook(book.id));

                bookListDiv.appendChild(div);
            });
        } catch (error) {
            console.error(error);
            bookListDiv.innerHTML = '<p>Error loading books.</p>';
        }
    }

    // --- Initial Fetch ---
    fetchBooks();
});