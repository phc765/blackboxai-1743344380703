// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

// Import from enhanced competition system
import { initCompetition } from './competition-enhanced.js';
import { generateMathProblem, problemTypes, difficultyLevels, checkAnswer } from './game-logic-enhanced.js';

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
    console.log('Loading practice content...');
    const section = document.getElementById('practice-section');
    if (!section) {
        console.error('Practice section not found!');
        return;
    }

    // Add timer display
    section.innerHTML = `
        <div class="timer-display bg-purple-100 text-purple-800 text-center p-2 rounded-lg mb-4 text-xl font-bold">
            05:00
        </div>
    `;
    
    // Start 5 minute timer
    const timerDisplay = section.querySelector('.timer-display');
    startTimer(5 * 60, timerDisplay);

    try {
        // Generate 3 practice problems
        const problems = [
            generateMathProblem(problemTypes.ADDITION, difficultyLevels.MEDIUM),
            generateMathProblem(problemTypes.SUBTRACTION, difficultyLevels.MEDIUM),
            generateMathProblem(problemTypes.MULTIPLICATION, difficultyLevels.MEDIUM)
        ];
        console.log('Generated practice problems:', problems);


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
        console.log('Practice content loaded successfully');

        // Add click handlers for answer buttons

        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedAnswer = e.target.dataset.answer;
                const problem = problems.find(p => 
                    p.options.includes(parseInt(selectedAnswer) || selectedAnswer)
                );
                
                if (problem) {
                    const isCorrect = checkAnswer(selectedAnswer, problem.answer);
                    showFeedback(isCorrect);
                } else {
                    console.error('Could not find matching problem for answer');
                }
            });
        });
    } catch (error) {
        console.error('Error loading practice content:', error);
        section.innerHTML = `
            <div class="bg-white rounded-xl shadow-md p-6 text-center">
                <h2 class="text-2xl font-bold text-red-600 mb-4">Lỗi khi tải bài tập</h2>
                <p>Vui lòng thử lại sau</p>
            </div>
        `;
    }

}

// WebSocket client connection
let socket = null;
let playerId = null;
let currentMatch = null;

function loadCompetitionContent() {
    const section = document.getElementById('competition-section');
    if (!section) return;

    section.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold text-purple-600 mb-4">Chế độ thi đấu</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="solo-mode p-4 border rounded-lg hover:shadow-md transition">
                    <h3 class="text-xl font-semibold mb-2"><i class="fas fa-user mr-2"></i>Chơi đơn</h3>
                    <p class="mb-4">Thi đấu với thời gian và điểm số cá nhân</p>
                    <button id="solo-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Bắt đầu
                    </button>
                </div>
                
                <div class="multiplayer-mode p-4 border rounded-lg hover:shadow-md transition">
                    <h3 class="text-xl font-semibold mb-2"><i class="fas fa-users mr-2"></i>Đấu đôi</h3>
                    <p class="mb-4">Thi đấu trực tiếp với người chơi khác</p>
                    <button id="multiplayer-btn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                        Tìm đối thủ
                    </button>
                </div>
            </div>
            
            <div id="multiplayer-status" class="hidden mt-4 p-4 bg-gray-100 rounded-lg"></div>
        </div>
    `;

    // Setup event listeners
    document.getElementById('solo-btn').addEventListener('click', () => initCompetition(false));
    document.getElementById('multiplayer-btn').addEventListener('click', initMultiplayer);
}

function initMultiplayer() {
    if (!socket) {
        // Connect to WebSocket server
        socket = new WebSocket('ws://localhost:8000');
        
        socket.onopen = () => {
            console.log('Connected to multiplayer server');
            document.getElementById('multiplayer-status').innerHTML = `
                <p class="text-green-600"><i class="fas fa-spinner fa-spin mr-2"></i>Đang tìm đối thủ...</p>
            `;
            document.getElementById('multiplayer-status').classList.remove('hidden');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);
            
            switch(message.type) {
                case 'player_id':
                    playerId = message.data;
                    break;
                    
                case 'match_found':
                    currentMatch = message.data;
                    startMultiplayerMatch();
                    break;
                    
                case 'opponent_answer':
                    handleOpponentAnswer(message.data);
                    break;
                    
                case 'opponent_disconnected':
                    handleOpponentDisconnect();
                    break;
            }
        };

        socket.onclose = () => {
            console.log('Disconnected from multiplayer server');
        };
    }
    
    // Join matchmaking queue
    socket.send(JSON.stringify({
        type: 'join_queue'
    }));
}

function startMultiplayerMatch() {
    const statusEl = document.getElementById('multiplayer-status');
    statusEl.innerHTML = `
        <p class="text-green-600 font-bold mb-2">
            <i class="fas fa-check-circle mr-2"></i>Đã tìm thấy đối thủ!
        </p>
        <p>Trận đấu bắt đầu sau 3 giây...</p>
    `;
    
    setTimeout(() => {
        // Initialize competition with multiplayer flag
        initCompetition(true);
    }, 3000);
}

function handleOpponentAnswer(data) {
    // Show opponent's answer in UI
    console.log('Opponent answered:', data);
}

function handleOpponentDisconnect() {
    alert('Đối thủ đã thoát khỏi trận đấu!');
    // Return to competition menu
    loadCompetitionContent();
}

function loadRankingContent() {
    console.log('Ranking content loaded');
}

// Utility functions
function showFeedback(isCorrect) {
    const feedbackClass = isCorrect ? 'correct' : 'wrong';
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `feedback ${feedbackClass} p-4 rounded-lg text-center my-4 animate-bounce`;
    feedbackElement.innerHTML = isCorrect 
        ? `<span class="text-green-600 font-bold">Chính xác! 👏</span>`
        : `<span class="text-red-600 font-bold">Sai rồi, thử lại nhé!</span>`;
    
    // Try to play sound if available
    try {
        const sound = new Audio(isCorrect ? 'sounds/correct.mp3' : 'sounds/wrong.mp3');
        sound.play().catch(e => console.log('Sound playback not available'));
    } catch (e) {
        console.log('Sound files not found');
    }
    
    document.querySelector('.section.active').appendChild(feedbackElement);
    setTimeout(() => {
        feedbackElement.classList.remove('animate-bounce');
        feedbackElement.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => feedbackElement.remove(), 300);
    }, 2000);
}

// Timer functionality for practice section
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            showFeedback(false);
            display.textContent = "Hết giờ!";
            display.classList.add('text-red-600', 'font-bold');
        }
    }, 1000);
    return interval;
}

export { showFeedback };