// manage_users.js

document.addEventListener('DOMContentLoaded', () => {
    const userListDiv = document.getElementById('users-management-list');
    const userSearchBox = document.getElementById('user-search-box');
    const userSearchButton = document.getElementById('user-search-button');

    function getCookie(name) { /* ... same getCookie function ... */ }
    function fetchData(url) { /* ... same fetchData function ... */ }
    function showMessage(message, type) { /* ... same showMessage function ... */ }

    async function renderUsers(users) {
        userListDiv.innerHTML = '';
        if (users.length === 0) {
            userListDiv.innerHTML = `<p class="no-results-message">No users found.</p>`;
            return;
        }

        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Is Admin</th>
                    <th>Is Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');

        users.forEach(user => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.is_staff ? 'Yes' : 'No'}</td>
                <td>${user.is_active ? 'Yes' : 'No'}</td>
                <td>
                    <button class="edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="toggle-status-btn" data-id="${user.id}" data-active="${user.is_active}">
                        <i class="fas fa-power-off"></i> ${user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
            `;
        });
        userListDiv.appendChild(table);

        attachUserActionListeners();
    }

    function attachUserActionListeners() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.onclick = (event) => handleEditUser(event.target.dataset.id);
        });
        document.querySelectorAll('.toggle-status-btn').forEach(button => {
            button.onclick = (event) => toggleUserStatus(event.target.dataset.id, event.target.dataset.active === 'true');
        });
    }

    function handleEditUser(userId) {
        alert(`Editing user ID: ${userId}. (Opens new page or modal)`);
        window.location.href = `/edit-user/${userId}/`; // Example redirect
    }

    async function toggleUserStatus(userId, isActive) {
        const action = isActive ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} user ID: ${userId}?`)) {
            try {
                const response = await fetch(`/api/users/${userId}/toggle-status/`, {
                    method: 'POST', // Or PATCH
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({ is_active: !isActive })
                });
                if (!response.ok) throw new Error(`Failed to ${action} user! Status: ${response.status}`);
                showMessage(`User ID: ${userId} ${action}d successfully.`, 'success');
                fetchAndRenderUsers();
            } catch (error) {
                console.error(`Error ${action}ing user:`, error);
                showMessage(`Error ${action}ing user: ${error.message}`, 'error');
            }
        }
    }

    async function fetchAndRenderUsers(query = '') {
        let url = '/api/users/'; // Your API endpoint for users
        if (query) url += `?search=${encodeURIComponent(query)}`;
        const users = await fetchData(url);
        renderUsers(users);
    }

    // Event Listeners for search
    userSearchButton.addEventListener('click', () => fetchAndRenderUsers(userSearchBox.value.trim()));
    userSearchBox.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') userSearchButton.click();
    });

    // Initial load
    fetchAndRenderUsers();
});