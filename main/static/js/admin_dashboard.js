// admin_dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('search-box');
    const searchButton = document.getElementById('search-button');
    const bookListDiv = document.getElementById('book-list');

    // --- Utility Functions ---

    /**
     * Fetches data from a given API endpoint.
     * @param {string} url - The API endpoint URL.
     * @returns {Promise<Array>} A promise that resolves to an array of data.
     */
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            // Display an error message to the user
            bookListDiv.innerHTML = `<p class="error-message">Failed to load data. Please try again later.</p>`;
            return [];
        }
    }

    /**
     * Renders a list of books into the bookListDiv.
     * @param {Array} books - An array of book objects.
     */
    function renderBooks(books) {
        bookListDiv.innerHTML = ''; // Clear previous content

        if (books.length === 0) {
            bookListDiv.innerHTML = `<p class="no-results-message">No books found matching your criteria.</p>`;
            return;
        }

        const bookGrid = document.createElement('div');
        bookGrid.className = 'book-grid'; // Use a new class for the grid layout

        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.setAttribute('data-id', book.id); // Store book ID for actions

            // Basic template for a book card
            bookCard.innerHTML = `
                <img src="${book.image_url || '/static/images/default_book.png'}" alt="${book.title}" class="book-thumbnail">
                <div class="card-content">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author || 'N/A'}</p>
                    <p><strong>Genre:</strong> ${book.genre || 'N/A'}</p>
                    <p><strong>Published:</strong> ${book.published_date || 'N/A'}</p>
                    <p><strong>Price:</strong> $${book.price ? book.price.toFixed(2) : 'N/A'}</p>
                    <div class="card-actions">
                        <button class="edit-btn" data-id="${book.id}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="delete-btn" data-id="${book.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                    </div>
                </div>
            `;
            bookGrid.appendChild(bookCard);
        });
        bookListDiv.appendChild(bookGrid);

        // Attach event listeners to new buttons
        attachBookActionListeners();
    }

    /**
     * Attaches click listeners to Edit and Delete buttons on book cards.
     * This needs to be called after rendering new cards.
     */
    function attachBookActionListeners() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.onclick = (event) => handleEditBook(event.target.dataset.id);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.onclick = (event) => handleDeleteBook(event.target.dataset.id);
        });
    }

    // --- Event Handlers for Book Actions ---

    /**
     * Handles the click event for editing a book.
     * In a real app, this would typically open a modal or redirect to an edit page.
     * @param {string} bookId - The ID of the book to edit.
     */
    function handleEditBook(bookId) {
        console.log('Edit book with ID:', bookId);
        // Implement modal or redirect to /edit-book/${bookId}
        alert(`Editing book ID: ${bookId}. (Implementation pending)`);
        window.location.href = `/edit-book/${bookId}/`; // Example redirect
    }

    /**
     * Handles the click event for deleting a book.
     * This would send a DELETE request to your backend.
     * @param {string} bookId - The ID of the book to delete.
     */
    async function handleDeleteBook(bookId) {
        if (confirm(`Are you sure you want to delete book ID: ${bookId}? This cannot be undone.`)) {
            try {
                // In a real Django setup, you'd need CSRF token for POST/DELETE requests
                // const csrftoken = getCookie('csrftoken'); // You'd need a getCookie function
                const response = await fetch(`/api/books/${bookId}/delete/`, { // Example API endpoint
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'X-CSRFToken': csrftoken,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete book! Status: ${response.status}`);
                }

                alert(`Book ID: ${bookId} deleted successfully.`);
                fetchBooks(); // Re-fetch and re-render the list
            } catch (error) {
                console.error('Error deleting book:', error);
                alert(`Error deleting book: ${error.message}`);
            }
        }
    }

    // --- Main Data Fetching Function ---

    /**
     * Fetches books from the API (potentially with a search query) and renders them.
     * @param {string} [query=''] - Optional search query.
     */
    async function fetchBooks(query = '') {
        let url = '/api/books/'; // Replace with your actual Django API endpoint for books
        if (query) {
            url += `?search=${encodeURIComponent(query)}`; // Add search parameter
        }
        const books = await fetchData(url);
        renderBooks(books);
    }

    // --- Search Functionality ---

    searchButton.addEventListener('click', () => {
        const query = searchBox.value.trim();
        fetchBooks(query);
    });

    searchBox.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click(); // Trigger search on Enter key
        }
    });

    // --- Initialization ---

    // Initial load of books when the page loads
    fetchBooks();
});

// Helper function to get CSRF token (needed for Django POST/DELETE requests)
// You would put this in a shared utility JS file or at the top of your script
/*
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
*/