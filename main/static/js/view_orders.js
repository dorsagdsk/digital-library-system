// view_orders.js

document.addEventListener('DOMContentLoaded', () => {
    const orderListDiv = document.getElementById('order-list');
    const orderSearchBox = document.getElementById('order-search-box');
    const orderSearchButton = document.getElementById('order-search-button');
    const orderStatusFilter = document.getElementById('order-status');
    const startDateFilter = document.getElementById('start-date');
    const endDateFilter = document.getElementById('end-date');
    const applyFiltersButton = document.getElementById('apply-filters-button');

    /**
     * Fetches orders from the API based on filters.
     * @param {Object} filters - Object containing search, status, start_date, end_date.
     * @returns {Promise<Array>}
     */
    async function fetchOrders(filters = {}) {
        let url = '/api/orders/'; // Your API endpoint for orders
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
            orderListDiv.innerHTML = `<p class="error-message">Failed to load orders. Please try again later.</p>`;
            return [];
        }
    }

    /**
     * Renders orders into the orderListDiv.
     * @param {Array} orders - Array of order objects.
     */
    function renderOrders(orders) {
        orderListDiv.innerHTML = '';
        if (orders.length === 0) {
            orderListDiv.innerHTML = `<p class="no-results-message">No orders found.</p>`;
            return;
        }

        const table = document.createElement('table');
        table.className = 'order-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');

        orders.forEach(order => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.user_email || order.user_id}</td>
                <td>${new Date(order.order_date).toLocaleDateString()}</td>
                <td>$${order.total_price ? order.total_price.toFixed(2) : '0.00'}</td>
                <td><span class="status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="view-details-btn" data-id="${order.id}"><i class="fas fa-eye"></i> Details</button>
                    <button class="update-status-btn" data-id="${order.id}" data-status="${order.status}"><i class="fas fa-sync-alt"></i> Update Status</button>
                </td>
            `;
        });
        orderListDiv.appendChild(table);

        attachOrderActionListeners();
    }

    function attachOrderActionListeners() {
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.onclick = (event) => viewOrderDetails(event.target.dataset.id);
        });
        document.querySelectorAll('.update-status-btn').forEach(button => {
            button.onclick = (event) => updateOrderStatus(event.target.dataset.id, event.target.dataset.status);
        });
    }

    function viewOrderDetails(orderId) {
        alert(`Viewing details for Order ID: ${orderId}. (Modal/Page implementation needed)`);
        // In a real app, open a modal with order items, shipping info etc.
    }

    function updateOrderStatus(orderId, currentStatus) {
        const newStatus = prompt(`Current status for Order ID ${orderId} is "${currentStatus}". Enter new status (e.g., pending, completed, cancelled):`);
        if (newStatus && ['pending', 'completed', 'cancelled'].includes(newStatus.toLowerCase())) {
            // Send API call to update status
            console.log(`Updating order ${orderId} to status: ${newStatus}`);
            // You'd make a PUT/PATCH request to /api/orders/{orderId}/update-status/
            // On success, call fetchOrders() again.
            alert(`Order ID: ${orderId} status updated to ${newStatus}. (API call pending)`);
            fetchOrders(getCurrentFilters()); // Refresh list
        } else if (newStatus !== null) {
            alert('Invalid status. Please enter pending, completed, or cancelled.');
        }
    }

    function getCurrentFilters() {
        return {
            search: orderSearchBox.value.trim(),
            status: orderStatusFilter.value,
            start_date: startDateFilter.value,
            end_date: endDateFilter.value
        };
    }

    // Event Listeners
    orderSearchButton.addEventListener('click', () => {
        fetchOrders(getCurrentFilters());
    });
    orderSearchBox.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') orderSearchButton.click();
    });
    applyFiltersButton.addEventListener('click', () => {
        fetchOrders(getCurrentFilters());
    });

    // Initial load
    fetchOrders(getCurrentFilters());
});