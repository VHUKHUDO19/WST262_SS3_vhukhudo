// JavaScript for the about page

document.addEventListener("DOMContentLoaded", function () {
    // Fetch team members from JSON
    fetchTeamMembers();

    // Fetch testimonials from JSON
    fetchTestimonials();

    // Add event listener to feedback form
    document.getElementById('feedback-form').addEventListener('submit', handleFeedbackSubmit);

    // Add event listener to submit another button
    document.getElementById('submit-another').addEventListener('click', resetFeedbackForm);
});

// Function to fetch team members from JSON file
function fetchTeamMembers() {
    const teamContainer = document.getElementById('team-members');

    fetch('/api/team')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(team => {
            // Clear the container
            teamContainer.innerHTML = '';

            // Display team members
            team.forEach(member => {
                const memberCard = createTeamMemberCard(member);
                teamContainer.appendChild(memberCard);
            });
        })
        .catch(error => {
            console.error('Error fetching team data:', error);

            // Show error message
            teamContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center">
                        <p>Unable to load team information. Please try again later.</p>
                    </div>
                </div>
            `;

            // Use fallback data
            const fallbackTeam = getFallbackTeamData();
            displayFallbackTeam(fallbackTeam);
        });
}

// Function to create a team member card
function createTeamMemberCard(member) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-6 col-sm-6';

    col.innerHTML = `
        <div class="text-center mb-4">
            <img src="${member.avatar}" alt="${member.name}" class="rounded-circle img-fluid mb-3" style="width: 150px; height: 150px; object-fit: cover;">
            <h3 class="h5 fw-bold mb-1">${member.name}</h3>
            <p class="text-primary mb-2">${member.role}</p>
            <p class="text-muted px-3">${member.bio}</p>
        </div>
    `;

    return col;
}

// Function to display fallback team data
function displayFallbackTeam(teamData) {
    const teamContainer = document.getElementById('team-members');
    teamContainer.innerHTML = '';

    teamData.forEach(member => {
        const memberCard = createTeamMemberCard(member);
        teamContainer.appendChild(memberCard);
    });
}

// Function to get fallback team data
function getFallbackTeamData() {
    return [
        {
            name: "Dr. Robert Anderson",
            role: "Founder & CEO",
            bio: "With over 20 years of experience in education technology, Dr. Anderson founded LearnHub with a vision to make quality education accessible to everyone.",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            name: "Jennifer Lee",
            role: "Chief Learning Officer",
            bio: "Jennifer has a Ph.D. in Educational Psychology and specializes in curriculum development. She ensures all courses meet the highest pedagogical standards.",
            avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            name: "Marcus Williams",
            role: "CTO",
            bio: "With a background in software engineering and AI, Marcus leads our technology team in creating an intuitive and effective learning platform.",
            avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            name: "Sophia Garcia",
            role: "Head of Content",
            bio: "Sophia works with industry experts to develop cutting-edge courses that reflect current industry practices and emerging technologies.",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
    ];
}

// Function to fetch testimonials from JSON file
function fetchTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');

    fetch('/api/testimonials')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(testimonials => {
            // Clear the container
            testimonialsContainer.innerHTML = '';

            // Add testimonials to carousel
            testimonials.forEach((testimonial, index) => {
                const slide = document.createElement('div');
                slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;

                slide.innerHTML = `
                    <div class="d-flex justify-content-center">
                        <div class="col-md-8">
                            <div class="card border-0 shadow">
                                <div class="card-body p-4 text-center">
                                    <div class="mb-3">
                                        <i class="bi bi-star-fill text-warning"></i>
                                        <i class="bi bi-star-fill text-warning"></i>
                                        <i class="bi bi-star-fill text-warning"></i>
                                        <i class="bi bi-star-fill text-warning"></i>
                                        <i class="bi bi-star-fill text-warning"></i>
                                    </div>
                                    <p class="lead fst-italic mb-4">"${testimonial.content}"</p>
                                    <div class="d-flex justify-content-center align-items-center mb-3">
                                        <img src="${testimonial.avatar}" alt="${testimonial.name}" class="rounded-circle me-3" width="50" height="50">
                                        <div class="text-start">
                                            <h5 class="mb-0">${testimonial.name}</h5>
                                            <p class="text-muted mb-0">${testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                testimonialsContainer.appendChild(slide);
            });
        })
        .catch(error => {
            console.error('Error fetching testimonials:', error);

            // Show error message
            testimonialsContainer.innerHTML = `
                <div class="carousel-item active">
                    <div class="d-flex justify-content-center">
                        <div class="col-md-8">
                            <div class="alert alert-warning">
                                <p>Unable to load testimonials. Please try again later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Use fallback testimonials
            const fallbackTestimonials = getFallbackTestimonials();
            displayFallbackTestimonials(fallbackTestimonials);
        });
}

// Function to display fallback testimonials
function displayFallbackTestimonials(testimonials) {
    const testimonialsContainer = document.getElementById('testimonials-container');
    testimonialsContainer.innerHTML = '';

    testimonials.forEach((testimonial, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;

        slide.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="col-md-8">
                    <div class="card border-0 shadow">
                        <div class="card-body p-4 text-center">
                            <div class="mb-3">
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star-fill text-warning"></i>
                            </div>
                            <p class="lead fst-italic mb-4">"${testimonial.content}"</p>
                            <div class="d-flex justify-content-center align-items-center mb-3">
                                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="rounded-circle me-3" width="50" height="50">
                                <div class="text-start">
                                    <h5 class="mb-0">${testimonial.name}</h5>
                                    <p class="text-muted mb-0">${testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        testimonialsContainer.appendChild(slide);
    });
}

// Function to get fallback testimonials
function getFallbackTestimonials() {
    return [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Web Developer at TechCorp",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            content: "The Complete Web Development Bootcamp was exactly what I needed to transition into a tech career. The instructor was knowledgeable, supportive, and made complex topics easy to understand. I landed a job as a junior developer within 3 months of completing the course!"
        },
        {
            id: 2,
            name: "Michael Rodriguez",
            role: "UX Designer at DesignWorks",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            content: "LearnHub's UI/UX design course transformed my career. The project-based curriculum gave me real-world experience and a portfolio that helped me land my dream job. The community of students and instructors continues to be a great resource for networking and continuous learning."
        },
        {
            id: 3,
            name: "Emily Chen",
            role: "Data Scientist at DataTech",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            content: "The Data Science and Machine Learning course exceeded all my expectations. The content was rigorous yet accessible, and the hands-on projects prepared me for real-world challenges. The instructor's expertise and willingness to help made all the difference in my learning journey."
        }
    ];
}

// Function to handle feedback form submission
function handleFeedbackSubmit(e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    // Create feedback object
    const feedbackData = {
        name,
        email,
        feedback,
        timestamp: new Date().toISOString()
    };

    // Submit feedback to Node.js API
    fetch('/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Feedback submitted successfully:', data);

            // Show success message
            document.getElementById('feedback-form').classList.add('d-none');
            document.getElementById('feedback-success').classList.remove('d-none');
        })
        .catch(error => {
            console.error('Error submitting feedback:', error);

            // For demo purposes: show success anyway
            document.getElementById('feedback-form').classList.add('d-none');
            document.getElementById('feedback-success').classList.remove('d-none');
        });
}

// Function to reset feedback form
function resetFeedbackForm() {
    // Reset form fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('feedback').value = '';

    // Hide success message, show form
    document.getElementById('feedback-form').classList.remove('d-none');
    document.getElementById('feedback-success').classList.add('d-none');
}