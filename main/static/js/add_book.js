document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('add-book-form');
    const messageContainer = document.getElementById('message-container');

    const authorNameInput = document.getElementById('author-name');
    const authorIdInput = document.getElementById('author-id');
    const authorSuggestionsDiv = document.getElementById('author-suggestions');
    const newAuthorFieldsDiv = document.getElementById('new-author-fields');
    const newAuthorFirstName = document.getElementById('new_author_first_name');
    const newAuthorLastName = document.getElementById('new_author_last_name');

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
        if (messageContainer) {
            messageContainer.innerHTML = `<p class="${type}">${message}</p>`;
            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 5000);
        } else {
            console.log(`Message (${type}): ${message}`);
        }
    }

    let debounceTimeout;
    authorNameInput.addEventListener('input', async (event) => {
        clearTimeout(debounceTimeout);
        const query = event.target.value.trim();

        if (query.length < 2) {
            authorSuggestionsDiv.innerHTML = '';
            authorIdInput.value = '';
            newAuthorFieldsDiv.style.display = 'none';
            return;
        }

        debounceTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`/api/authors/?search=${encodeURIComponent(query)}`, {
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'خطا در بارگذاری نویسندگان');
                }

                const authors = await response.json();

                authorSuggestionsDiv.innerHTML = '';
                authorIdInput.value = '';

                if (authors.length > 0) {
                    authors.forEach(author => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.classList.add('author-suggestion-item');
                        suggestionItem.textContent = `${author.first_name} ${author.last_name}`;
                        suggestionItem.dataset.authorId = author.id;
                        suggestionItem.addEventListener('click', () => {
                            authorNameInput.value = `${author.first_name} ${author.last_name}`;
                            authorIdInput.value = author.id;
                            authorSuggestionsDiv.innerHTML = '';
                            newAuthorFieldsDiv.style.display = 'none';
                            newAuthorFirstName.value = '';
                            newAuthorLastName.value = '';
                        });
                        authorSuggestionsDiv.appendChild(suggestionItem);
                    });
                    newAuthorFieldsDiv.style.display = 'none';
                } else {
                    authorSuggestionsDiv.innerHTML = '<p>نویسنده یافت نشد. می‌توانید یک نویسنده جدید ایجاد کنید.</p>';
                    newAuthorFieldsDiv.style.display = 'block';
                }
            } catch (error) {
                console.error('Error fetching author suggestions:', error);
                showMessage(`خطا در بارگذاری لیست نویسندگان: ${error.message}`, 'error');
            }
        }, 300);
    });

    addBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addBookForm);

        const title = formData.get('title');
        const description = formData.get('description');
        const price = parseFloat(formData.get('price'));
        const fullFile = formData.get('full_file');
        const selectedAuthorId = authorIdInput.value;
        const bookType = document.getElementById('book_type').value; // Get value from the new select field

        // Basic frontend validation for required fields
        if (!title || title.length < 3) {
            showMessage('عنوان کتاب باید حداقل ۳ کاراکتر داشته باشد.', 'error');
            return;
        }
        if (!description || description.length < 10) {
            showMessage('توضیحات باید حداقل ۱۰ کاراکتر داشته باشد.', 'error');
            return;
        }
        if (isNaN(price) || price <= 0) {
            showMessage('قیمت کتاب باید عددی مثبت باشد.', 'error');
            return;
        }
        if (!bookType) { // Validation for book_type
            showMessage('نوع کتاب الزامی است.', 'error');
            return;
        }
        if (!fullFile || fullFile.size === 0) {
            showMessage('فایل کامل کتاب (full_file) الزامی است.', 'error');
            return;
        }
        if (fullFile && !fullFile.name.toLowerCase().endsWith('.pdf')) {
            showMessage('فرمت فایل کامل کتاب باید PDF باشد.', 'error');
            return;
        }


        // Handle author selection or new author creation
        if (!selectedAuthorId) {
            const newAuthorFirst = newAuthorFirstName.value.trim();
            const newAuthorLast = newAuthorLastName.value.trim();

            if (!newAuthorFirst || !newAuthorLast) {
                showMessage('برای افزودن کتاب، یا یک نویسنده موجود را انتخاب کنید یا مشخصات کامل نویسنده جدید را وارد نمایید (نام، نام خانوادگی).', 'error');
                return;
            }
            formData.set('new_author_first_name', newAuthorFirst);
            formData.set('new_author_last_name', newAuthorLast);
            formData.delete('author'); // Remove existing author ID if creating new
        } else {
            formData.set('author', selectedAuthorId);
            formData.delete('new_author_first_name');
            formData.delete('new_author_last_name');
        }

        // --- CRITICAL FIX FOR GENRE: Send as array of IDs (based on your serializers.py) ---
        const genreInput = document.getElementById('genre').value;
        formData.delete('genre'); // Remove the single 'genre' field added by the form's default behavior
        if (genreInput) {
            // Split by comma, trim whitespace, filter out empty strings, and CONVERT TO INTEGERS
            const genreIds = genreInput.split(',')
                                      .map(id => parseInt(id.trim(), 10))
                                      .filter(id => !isNaN(id)); // Ensure only valid numbers are kept

            // Append each valid genre ID as a separate 'genre' field.
            // This is the correct format for DRF's default PrimaryKeyRelatedField for ManyToMany.
            genreIds.forEach(id => {
                formData.append('genre', id);
            });
        }
        // --- END CRITICAL FIX FOR GENRE ---

        try {
            const response = await fetch('/api/admin/books/add/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    // 'Content-Type': 'multipart/form-data' is implicitly set by browser when sending FormData
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(result.message || 'کتاب با موفقیت اضافه شد!', 'success');
                addBookForm.reset();
                authorIdInput.value = '';
                authorSuggestionsDiv.innerHTML = '';
                newAuthorFieldsDiv.style.display = 'none';
                newAuthorFirstName.value = '';
                newAuthorLastName.value = '';
                document.getElementById('book_type').value = ''; // Reset the select for book_type
            } else {
                let errorMessage = 'خطا در افزودن کتاب.';
                if (result) {
                    const errorMessages = [];
                    for (const key in result) {
                        if (result.hasOwnProperty(key)) {
                            const errorValue = result[key];
                            if (Array.isArray(errorValue)) {
                                errorMessages.push(`${key}: ${errorValue.join(', ')}`);
                            } else {
                                errorMessages.push(`${key}: ${errorValue}`);
                            }
                        }
                    }
                    if (errorMessages.length > 0) {
                        errorMessage = errorMessages.join('; ');
                    } else if (result.detail) {
                        errorMessage = result.detail;
                    }
                }
                showMessage(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Error adding book:', error);
            showMessage('خطای غیرمنتظره رخ داد. لطفا دوباره تلاش کنید.', 'error');
        }
    });

    // Initial state setup
    newAuthorFieldsDiv.style.display = 'none';
});