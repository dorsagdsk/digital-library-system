// view_statistics.js

document.addEventListener('DOMContentLoaded', async () => {
    const totalBooksCount = document.getElementById('total-books-count');
    const totalAuthorsCount = document.getElementById('total-authors-count');
    const totalUsersCount = document.getElementById('total-users-count');
    const totalOrdersCount = document.getElementById('total-orders-count');

    // Chart instances
    let topBooksChartInstance = null;
    let ordersOverTimeChartInstance = null;

    /**
     * Fetches data from a given API endpoint.
     * @param {string} url - The API endpoint URL.
     * @returns {Promise<Object|Array>} A promise that resolves to data.
     */
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null; // Return null on error for statistics
        }
    }

    // --- Render Statistics ---

    async function renderOverallStats() {
        const stats = await fetchData('/api/statistics/overall/'); // Your API endpoint for overall stats
        if (stats) {
            totalBooksCount.textContent = stats.total_books !== undefined ? stats.total_books : '--';
            totalAuthorsCount.textContent = stats.total_authors !== undefined ? stats.total_authors : '--';
            totalUsersCount.textContent = stats.total_users !== undefined ? stats.total_users : '--';
            totalOrdersCount.textContent = stats.total_orders !== undefined ? stats.total_orders : '--';
        } else {
            totalBooksCount.textContent = totalAuthorsCount.textContent = totalUsersCount.textContent = totalOrdersCount.textContent = 'N/A';
        }
    }

    // --- Render Charts ---

    async function renderTopBooksChart() {
        const data = await fetchData('/api/statistics/top-books/'); // Your API for top ordered books
        if (!data) return;

        const ctx = document.getElementById('topBooksChart').getContext('2d');
        if (topBooksChartInstance) {
            topBooksChartInstance.destroy(); // Destroy previous chart instance if exists
        }

        topBooksChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.book_title),
                datasets: [{
                    label: 'Orders Count',
                    data: data.map(item => item.order_count),
                    backgroundColor: 'rgba(174, 142, 109, 0.8)', // --color-accent-gold
                    borderColor: 'rgba(174, 142, 109, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Orders'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Book Title'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    async function renderOrdersOverTimeChart() {
        const data = await fetchData('/api/statistics/orders-over-time/'); // Your API for orders over time
        if (!data) return;

        // Assuming data is an array of {date: 'YYYY-MM-DD', count: N}
        const labels = data.map(item => item.date);
        const counts = data.map(item => item.count);

        const ctx = document.getElementById('ordersOverTimeChart').getContext('2d');
        if (ordersOverTimeChartInstance) {
            ordersOverTimeChartInstance.destroy(); // Destroy previous chart instance
        }

        ordersOverTimeChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Orders',
                    data: counts,
                    borderColor: 'rgba(195, 150, 122, 1)', // --color-light-accent
                    backgroundColor: 'rgba(195, 150, 122, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Orders'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Initial load of all statistics and charts
    renderOverallStats();
    renderTopBooksChart();
    renderOrdersOverTimeChart();

    // No search functionality for statistics in this basic example,
    // but you could implement filters (e.g., date range for charts)
});