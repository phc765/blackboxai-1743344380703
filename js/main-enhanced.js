// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

// Import from enhanced competition system
import { initCompetition } from './competition-enhanced.js';

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
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Load initial content
    loadHomeContent();
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

// Content loading functions
function loadHomeContent() {
    console.log('Home content loaded');
}

function loadLessonsContent() {
    const section = document.getElementById('lessons-section');
    if (!section) return;

    section.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">Bài học Toán lớp 3</h2>
            
            <div class="lesson-category mb-6">
                <h3 class="text-xl font-semibold mb-2">1. Phép cộng</h3>
                <div class="lesson-content bg-blue-50 p-4 rounded-lg">
                    <p class="mb-2">Cộng các số có 2 chữ số:</p>
                    <p class="font-mono text-lg">23 + 45 = (20 + 40) + (3 + 5) = 60 + 8 = 68</p>
                </div>
            </div>

            <div class="lesson-category mb-6">
                <h3 class="text-xl font-semibold mb-2">2. Phép trừ</h3>
                <div class="lesson-content bg-blue-50 p-4 rounded-lg">
                    <p class="mb-2">Trừ các số có 2 chữ số:</p>
                    <p class="font-mono text-lg">57 - 24 = (50 - 20) + (7 - 4) = 30 + 3 = 33</p>
                </div>
            </div>

            <div class="lesson-category mb-6">
                <h3 class="text-xl font-semibold mb-2">3. Bảng cửu chương</h3>
                <div class="lesson-content bg-blue-50 p-4 rounded-lg">
                    <p class="mb-2">Bảng nhân 2:</p>
                    <p class="font-mono text-lg">2 × 1 = 2<br>2 × 2 = 4<br>...<br>2 × 10 = 20</p>
                </div>
            </div>
        </div>
    `;
}

function loadPracticeContent() {
    const section = document.getElementById('practice-section');
    if (!section) return;

    // Generate 3 practice problems
    const problems = [
        generateMathProblem(problemTypes.ADDITION, difficultyLevels.MEDIUM),
        generateMathProblem(problemTypes.SUBTRACTION, difficultyLevels.MEDIUM),
        generateMathProblem(problemTypes.MULTIPLICATION, difficultyLevels.MEDIUM)
    ];

    section.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">Luyện tập Toán</h2>
            
            ${problems.map((problem, index) => `
                <div class="practice-problem mb-6 p-4 border-b">
                    <h3 class="text-lg font-semibold mb-2">Bài ${index + 1}:</h3>
                    <p class="math-problem text-xl mb-3">${problem.question}</p>
                    
                    <div class="grid grid-cols-2 gap-3">
                        ${problem.options.map((option, i) => `
                            <button class="answer-btn bg-gray-100 hover:bg-gray-200 p-2 rounded" 
                                    data-answer="${option}">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Add click handlers for answer buttons
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedAnswer = e.target.dataset.answer;
            const problem = problems.find(p => 
                p.options.includes(parseInt(selectedAnswer) || selectedAnswer)
            );
            
            const isCorrect = checkAnswer(selectedAnswer, problem.answer);
            showFeedback(isCorrect);
        });
    });
}


function loadCompetitionContent() {
    initCompetition();
    console.log('Competition content loaded');
}

function loadRankingContent() {
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

export { showFeedback };