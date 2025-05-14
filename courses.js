// JavaScript for the courses page

document.addEventListener("DOMContentLoaded", function () {
    // Initialize variables
    let allCourses = [];
    let filteredCourses = [];
    let selectedCategory = 'all';
    let searchQuery = '';

    // Get DOM elements
    const coursesContainer = document.getElementById("courses-container");
    const categoryFilters = document.getElementById("category-filters");
    const searchInput = document.getElementById("search-input");
    const courseCount = document.getElementById("course-count");
    const noResults = document.getElementById("no-results");
    const clearFiltersBtn = document.getElementById("clear-filters");

    // Fetch all courses from the API
    fetchCourses();

    // Event listeners
    searchInput.addEventListener("input", handleSearch);
    clearFiltersBtn.addEventListener("click", clearFilters);

    // Function to fetch courses from the API
    function fetchCourses() {
        // Show loading state
        coursesContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;

        // Fetch courses from the Node.js Express API
        fetch('/api/courses')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(courses => {
                allCourses = courses;
                filteredCourses = courses;

                // Update the UI
                displayCourses(filteredCourses);

                // Initialize category filters
                initializeCategoryFilters(courses);

                // Update course count
                updateCourseCount(filteredCourses.length);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);

                // Handle error by showing a message
                coursesContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <div class="alert alert-warning">
                            <p>Unable to load courses. Please try again later.</p>
                        </div>
                    </div>
                `;

                // Fallback: Use hardcoded courses for display
                const fallbackCourses = getFallbackCourses();
                allCourses = fallbackCourses;
                filteredCourses = fallbackCourses;

                // Update the UI with fallback data
                displayCourses(fallbackCourses);
                initializeCategoryFilters(fallbackCourses);
                updateCourseCount(fallbackCourses.length);
            });
    }

    // Function to initialize category filters
    function initializeCategoryFilters(courses) {
        // Extract unique categories
        const categories = ['all', ...new Set(courses.map(course => course.category))];

        // Clear existing filters except "All" button
        categoryFilters.innerHTML = `
            <button class="btn btn-primary" data-category="all">All</button>
        `;

        // Add category filter buttons
        categories.forEach(category => {
            if (category !== 'all') {
                const button = document.createElement('button');
                button.className = 'btn btn-outline-primary';
                button.setAttribute('data-category', category);
                button.textContent = category;
                button.addEventListener('click', () => filterByCategory(category));
                categoryFilters.appendChild(button);
            }
        });

        // Add event listener to "All" button
        document.querySelector('[data-category="all"]').addEventListener('click', () => filterByCategory('all'));
    }

    // Function to filter courses by category
    function filterByCategory(category) {
        selectedCategory = category;

        // Update active button state
        document.querySelectorAll('#category-filters button').forEach(btn => {
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline-primary');
            } else {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline-primary');
            }
        });

        // Apply filters
        applyFilters();
    }

    // Function to handle search input
    function handleSearch() {
        searchQuery = searchInput.value.toLowerCase().trim();
        applyFilters();
    }

    // Function to apply both category and search filters
    function applyFilters() {
        filteredCourses = allCourses.filter(course => {
            // Apply category filter
            const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

            // Apply search filter
            const matchesSearch = course.title.toLowerCase().includes(searchQuery) ||
                course.description.toLowerCase().includes(searchQuery) ||
                (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchQuery)));

            return matchesCategory && matchesSearch;
        });

        // Update the UI
        displayCourses(filteredCourses);
        updateCourseCount(filteredCourses.length);
    }

    // Function to clear all filters
    function clearFilters() {
        // Reset search
        searchInput.value = '';
        searchQuery = '';

        // Reset category
        selectedCategory = 'all';
        document.querySelectorAll('#category-filters button').forEach(btn => {
            if (btn.getAttribute('data-category') === 'all') {
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline-primary');
            } else {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline-primary');
            }
        });

        // Apply filters
        applyFilters();
    }

    // Function to display courses
    function displayCourses(courses) {
        // Clear courses container
        coursesContainer.innerHTML = '';

        // Show/hide "no results" message
        if (courses.length === 0) {
            coursesContainer.classList.add('d-none');
            noResults.classList.remove('d-none');
        } else {
            coursesContainer.classList.remove('d-none');
            noResults.classList.add('d-none');

            // Render courses
            courses.forEach(course => {
                const courseCol = document.createElement('div');
                courseCol.className = 'col-lg-4 col-md-6 mb-4';

                courseCol.innerHTML = `
                    <div class="card h-100 course-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="badge bg-primary rounded-pill">${course.category}</span>
                                <div class="rating">
                                    <i class="bi bi-star-fill"></i>
                                    <span>${course.rating}</span>
                                </div>
                            </div>
                            <h5 class="card-title">${course.title}</h5>
                            <p class="card-text">${course.description}</p>
                            <p class="text-muted small mb-2">
                                <strong>Instructor:</strong> ${course.instructor}
                            </p>
                            <p class="text-muted small mb-2">
                                <strong>Level:</strong> ${course.level}
                            </p>
                            <p class="text-muted small">
                                ${course.students.toLocaleString()} students enrolled
                            </p>
                            ${course.tags ? `
                            <div class="mt-3">
                                ${course.tags.map(tag => `
                                    <span class="badge bg-light text-dark me-1">${tag}</span>
                                `).join('')}
                            </div>
                            ` : ''}
                        </div>
                        <div class="card-footer d-flex justify-content-between align-items-center">
                            <span class="fw-bold">$${course.price.toFixed(2)}</span>
                            <button class="btn btn-primary btn-sm" onclick="showCourseDetails(${course.id})">
                                View Details
                            </button>
                        </div>
                    </div>
                `;

                coursesContainer.appendChild(courseCol);
            });
        }
    }

    // Function to update course count
    function updateCourseCount(count) {
        courseCount.textContent = `${count} ${count === 1 ? 'course' : 'courses'} found`;
    }

    // Function to get fallback courses when API fails
    function getFallbackCourses() {
        return [
            {
                id: 1,
                title: "Complete Web Development Bootcamp",
                description: "Learn HTML, CSS, JavaScript, React and Node.js to become a full-stack web developer.",
                category: "Web Development",
                level: "Beginner to Advanced",
                price: 89.99,
                rating: 4.8,
                students: 12549,
                instructor: "John Smith",
                tags: ["frontend", "backend", "fullstack"]
            },
            {
                id: 2,
                title: "Data Science and Machine Learning",
                description: "Master the skills of data analysis, visualization and machine learning with Python.",
                category: "Data Science",
                level: "Intermediate",
                price: 94.99,
                rating: 4.7,
                students: 8723,
                instructor: "Emily Chen",
                tags: ["python", "machine learning", "data"]
            },
            {
                id: 3,
                title: "UX/UI Design Fundamentals",
                description: "Learn the principles of user experience and interface design for digital products.",
                category: "Design",
                level: "Beginner",
                price: 79.99,
                rating: 4.6,
                students: 6382,
                instructor: "Sarah Johnson",
                tags: ["design", "ui", "ux"]
            },
            {
                id: 4,
                title: "Advanced JavaScript: From Zero to Hero",
                description: "Deep dive into modern JavaScript with ES6+, async/await, and more advanced concepts.",
                category: "Web Development",
                level: "Intermediate to Advanced",
                price: 84.99,
                rating: 4.9,
                students: 9741,
                instructor: "Michael Davis",
                tags: ["javascript", "es6", "frontend"]
            },
            {
                id: 5,
                title: "Mobile App Development with Flutter",
                description: "Build cross-platform mobile apps for iOS and Android with Google's Flutter framework.",
                category: "Mobile Development",
                level: "Intermediate",
                price: 89.99,
                rating: 4.7,
                students: 5492,
                instructor: "David Wilson",
                tags: ["flutter", "mobile", "cross-platform"]
            },
            {
                id: 6,
                title: "Python for Data Science and AI",
                description: "Learn Python programming for data analysis, visualization, and artificial intelligence.",
                category: "Data Science",
                level: "Beginner to Intermediate",
                price: 79.99,
                rating: 4.8,
                students: 11043,
                instructor: "Lisa Wang",
                tags: ["python", "data science", "ai"]
            }
        ];
    }
});

// Function to show course details in modal
function showCourseDetails(courseId) {
    // Fetch course details from the API
    fetch(`/api/courses/${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(course => {
            // Populate modal with course details
            document.getElementById('courseModalLabel').textContent = course.title;

            const modalContent = document.getElementById('modal-content');
            modalContent.innerHTML = `
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-3">
                        <span class="badge bg-primary">${course.category}</span>
                        <div class="rating">
                            <i class="bi bi-star-fill text-warning"></i>
                            <span>${course.rating}</span>
                        </div>
                    </div>
                    
                    <h4>${course.title}</h4>
                    <p>${course.description}</p>
                    
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <p><strong>Instructor:</strong> ${course.instructor}</p>
                            <p><strong>Level:</strong> ${course.level}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Students:</strong> ${course.students.toLocaleString()}</p>
                            <p><strong>Price:</strong> $${course.price.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div class="mt-3">
                        <h5>What You'll Learn</h5>
                        <ul>
                            ${course.learningOutcomes ? course.learningOutcomes.map(outcome =>
                `<li>${outcome}</li>`
            ).join('') : '<li>Comprehensive understanding of the subject</li><li>Practical application skills</li><li>Industry-relevant knowledge</li>'}
                        </ul>
                    </div>
                </div>
            `;

            // Set enrollment button action
            document.getElementById('enroll-button').onclick = function () {
                enrollInCourse(course);
            };

            // Show the modal
            const courseModal = new bootstrap.Modal(document.getElementById('courseModal'));
            courseModal.show();
        })
        .catch(error => {
            console.error('Error fetching course details:', error);

            // Show error in modal
            document.getElementById('courseModalLabel').textContent = 'Error';
            document.getElementById('modal-content').innerHTML = `
                <div class="alert alert-danger">
                    Failed to load course details. Please try again later.
                </div>
            `;

            // Show the modal
            const courseModal = new bootstrap.Modal(document.getElementById('courseModal'));
            courseModal.show();
        });
}

// Function to handle course enrollment
function enrollInCourse(course) {
    // Close the modal
    const courseModal = bootstrap.Modal.getInstance(document.getElementById('courseModal'));
    courseModal.hide();

    // Update toast message
    document.querySelector('.toast-body').textContent = `You've successfully enrolled in "${course.title}"!`;

    // Show toast notification
    const toast = new bootstrap.Toast(document.getElementById('enrollmentToast'));
    toast.show();
}