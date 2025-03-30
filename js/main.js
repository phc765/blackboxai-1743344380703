import { initCompetition } from './competition.js';

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Set up navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavClick(link.dataset.section);
        });
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

function handleNavClick(section) {
    const sectionId = `${section}-section`;
    
    // Update active nav link
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-section="${section}"]`).classList.add('active');
    
    // Show selected section
    sections.forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.remove('hidden');
    activeSection.classList.add('active');

    // Close mobile menu if open
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }

    // Load section-specific content
    switch(section) {
        case 'home':
            loadHomeContent();
            break;
        case 'lessons':
            loadLessonsContent();
            break;
        case 'practice':
            loadPracticeContent();
            break;
        case 'competition':
            loadCompetitionContent();
            break;
        case 'ranking':
            loadRankingContent();
            break;
    }
}


    // Load initial content
    loadHomeContent();
});

// Content loading functions
function loadHomeContent() {
    // Home page specific initialization
    console.log('Home content loaded');
}

function loadLessonsContent() {
    // Lessons page initialization
    console.log('Lessons content loaded');
}

function loadPracticeContent() {
    // Practice page initialization
    console.log('Practice content loaded');
}

function loadCompetitionContent() {
    // Competition page initialization
    initCompetition();
    console.log('Competition content loaded');
}

function loadRankingContent() {
    // Ranking page initialization
    console.log('Ranking content loaded');
}

// Utility functions
function showFeedback(isCorrect) {
    const feedbackClass = isCorrect ? 'correct' : 'wrong';
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `feedback ${feedbackClass} p-4 rounded-lg text-center my-4`;
    feedbackElement.textContent = isCorrect ? 'Chính xác! 👏' : 'Sai rồi, thử lại nhé!';
    
    document.querySelector('.section.active').appendChild(feedbackElement);
    setTimeout(() => feedbackElement.remove(), 2000);
}

// Export functions for other modules
export { showFeedback };
