// JavaScript for the home page

document.addEventListener("DOMContentLoaded", function () {
    // Fetch featured courses for the home page
    fetchFeaturedCourses();

    // Add animation to hero elements
    animateHeroElements();
});

// Function to fetch featured courses from the API
function fetchFeaturedCourses() {
    const featuredCoursesContainer = document.getElementById("featured-courses");

    // Fetch courses from the Node.js Express API
    fetch('/api/featured-courses')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(courses => {
            // Clear loading spinner
            featuredCoursesContainer.innerHTML = '';

            // Display the featured courses
            courses.forEach(course => {
                const courseCard = createCourseCard(course);
                featuredCoursesContainer.appendChild(courseCard);
            });
        })
        .catch(error => {
            console.error('Error fetching featured courses:', error);

            // Handle error by showing a message
            featuredCoursesContainer.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-warning">
                        <p>Unable to load featured courses. Please try again later.</p>
                    </div>
                </div>
            `;

            // Fallback: Display some dummy courses for display purposes
            displayFallbackCourses();
        });
}

// Function to display fallback courses when API fails
function displayFallbackCourses() {
    const featuredCoursesContainer = document.getElementById("featured-courses");

    const fallbackCourses = [
        {
            id: 1,
            title: "Complete Web Development Bootcamp",
            description: "Learn HTML, CSS, JavaScript, React and Node.js to become a full-stack web developer.",
            category: "Web Development",
            level: "Beginner to Advanced",
            students: 12549,
            price: 89.99
        },
        {
            id: 2,
            title: "Data Science and Machine Learning",
            description: "Master the skills of data analysis, visualization and machine learning with Python.",
            category: "Data Science",
            level: "Intermediate",
            students: 8723,
            price: 94.99
        },
        {
            id: 3,
            title: "UX/UI Design Fundamentals",
            description: "Learn the principles of user experience and interface design for digital products.",
            category: "Design",
            level: "Beginner",
            students: 6382,
            price: 79.99
        }
    ];

    // Clear the container
    featuredCoursesContainer.innerHTML = '';

    // Add fallback courses
    fallbackCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'col-lg-4 col-md-6 mb-4';
        courseElement.innerHTML = `
            <div class="card h-100 course-card">
                <div class="card-body">
                    <span class="badge bg-primary mb-2">${course.category}</span>
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text">${course.description}</p>
                    <p class="text-muted small">${course.level} • ${course.students.toLocaleString()} students</p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <span class="fw-bold">$${course.price}</span>
                    <a href="courses.html" class="btn btn-primary btn-sm">View Course</a>
                </div>
            </div>
        `;
        featuredCoursesContainer.appendChild(courseElement);
    });
}

// Function to create a course card element
function createCourseCard(course) {
    const courseCol = document.createElement('div');
    courseCol.className = 'col-lg-4 col-md-6 mb-4';

    courseCol.innerHTML = `
        <div class="card h-100 course-card">
            <div class="card-body">
                <span class="badge bg-primary mb-2">${course.category}</span>
                <h5 class="card-title">${course.title}</h5>
                <p class="card-text">${course.description}</p>
                <p class="text-muted small">${course.level} • ${course.students.toLocaleString()} students</p>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <span class="fw-bold">$${course.price}</span>
                <a href="courses.html?id=${course.id}" class="btn btn-primary btn-sm">View Course</a>
            </div>
        </div>
    `;

    return courseCol;
}

// Function to add animation to hero elements
function animateHeroElements() {
    const heroElements = document.querySelectorAll('.animate-on-scroll');

    heroElements.forEach(element => {
        element.classList.add('animate__animated', 'animate__fadeInUp');
    });
}