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
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Phép cộng -->
                <div class="lesson-category p-4 border rounded-lg hover:shadow-md transition">
                    <h3 class="text-xl font-semibold mb-3 flex items-center">
                        <i class="fas fa-plus-circle text-blue-500 mr-2"></i>Phép cộng
                    </h3>
                    <div class="lesson-content bg-blue-50 p-4 rounded-lg">
                        <p class="mb-2 font-medium">Cộng có nhớ trong phạm vi 100:</p>
                        <div class="font-mono text-lg mb-3 p-2 bg-white rounded">
                            36 + 47 = (30 + 40) + (6 + 7) = 70 + 13 = 83
                        </div>
                        <button class="practice-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            Luyện tập ngay
                        </button>
                    </div>
                </div>

                <!-- Phép trừ -->
                <div class="lesson-category p-4 border rounded-lg hover:shadow-md transition">
                    <h3 class="text-xl font-semibold mb-3 flex items-center">
                        <i class="fas fa-minus-circle text-red-500 mr-2"></i>Phép trừ
                    </h3>
                    <div class="lesson-content bg-red-50 p-4 rounded-lg">
                        <p class="mb-2 font-medium">Trừ có nhớ trong phạm vi 100:</p>
                        <div class="font-mono text-lg mb-3 p-2 bg-white rounded">
                            52 - 27 = (50 - 20) + (2 - 7) = 30 - 5 = 25
                        </div>
                        <button class="practice-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                            Luyện tập ngay
                        </button>
                    </div>
                </div>

                <!-- Bảng cửu chương -->
                <div class="lesson-category p-4 border rounded-lg hover:shadow-md transition">
                    <h3 class="text-xl font-semibold mb-3 flex items-center">
                        <i class="fas fa-times-circle text-green-500 mr-2"></i>Bảng cửu chương
                    </h3>
                    <div class="lesson-content bg-green-50 p-4 rounded-lg">
                        <p class="mb-2 font-medium">Bảng nhân từ 2 đến 5:</p>
                        <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                            ${[2,3,4,5].map(n => `
                                <div class="p-1 bg-white rounded">
                                    ${n} × 1 = ${n}<br>
                                    ${n} × 2 = ${n*2}<br>
                                    ...<br>
                                    ${n} × 9 = ${n*9}
                                </div>
                            `).join('')}
                        </div>
                        <button class="practice-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                            Luyện tập ngay
                        </button>
                    </div>
                </div>

                <!-- Phép chia -->
                <div class="lesson-category p-4 border rounded-lg hover:shadow-md transition">
                    <h3 class="text-xl font-semibold mb-3 flex items-center">
                        <i class="fas fa-divide text-purple-500 mr-2"></i>Phép chia
                    </h3>
                    <div class="lesson-content bg-purple-50 p-4 rounded-lg">
                        <p class="mb-2 font-medium">Chia hết và chia có dư:</p>
                        <div class="font-mono text-lg mb-3 p-2 bg-white rounded">
                            17 ÷ 3 = 5 dư 2<br>
                            24 ÷ 4 = 6
                        </div>
                        <button class="practice-btn bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">
                            Luyện tập ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add click handlers for practice buttons
    document.querySelectorAll('.practice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleNavClick('practice');
        });
    });
}

function loadPracticeContent() {
    const section = document.getElementById('practice-section');
    if (!section) return;

    // Initialize practice state
    let score = 0;
    let currentProblemIndex = 0;
    const problems = [
        generateMathProblem(problemTypes.ADDITION, difficultyLevels.MEDIUM),
        generateMathProblem(problemTypes.SUBTRACTION, difficultyLevels.MEDIUM),
        generateMathProblem(problemTypes.MULTIPLICATION, difficultyLevels.MEDIUM),
        generateMathProblem(problemTypes.DIVISION, difficultyLevels.MEDIUM),
        generateMathProblem(problemTypes.WORD_PROBLEM, difficultyLevels.MEDIUM)
    ];

    // Render practice UI
    section.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-purple-600">Luyện tập Toán</h2>
                <div class="flex items-center space-x-4">
                    <div class="score-display bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-bold">
                        Điểm: <span id="score-value">0</span>
                    </div>
                    <div class="progress-display">
                        <span id="current-problem">1</span>/<span>${problems.length}</span>
                    </div>
                </div>
            </div>

            <div id="problem-container" class="p-4 border rounded-lg mb-6">
                <!-- Problem will be rendered here -->
            </div>

            <div class="flex justify-between">
                <button id="back-btn" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled>
                    <i class="fas fa-arrow-left mr-2"></i>Bài trước
                </button>
                <button id="next-btn" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
                    Bài tiếp theo <i class="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    `;

    // Render current problem
    function renderProblem(index) {
        const problem = problems[index];
        const container = document.getElementById('problem-container');
        
        container.innerHTML = `
            <div class="mb-4">
                <div class="difficulty-badge bg-${getDifficultyColor(problem.difficulty)}-100 text-${getDifficultyColor(problem.difficulty)}-800 text-sm px-2 py-1 rounded-full inline-block">
                    ${problem.difficulty.toUpperCase()}
                </div>
            </div>
            <h3 class="text-lg font-semibold mb-2">Bài ${index + 1}:</h3>
            <p class="math-problem text-xl mb-4">${problem.question}</p>
            <div class="grid grid-cols-2 gap-3">
                ${problem.options.map((option, i) => `
                    <button class="answer-btn bg-white hover:bg-blue-50 border border-gray-200 p-3 rounded-lg transition" 
                            data-answer="${option}">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;

        // Update navigation buttons
        document.getElementById('back-btn').disabled = index === 0;
        document.getElementById('next-btn').disabled = index === problems.length - 1;
        document.getElementById('current-problem').textContent = index + 1;

        // Add answer handlers
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedAnswer = e.currentTarget.dataset.answer;
                const isCorrect = checkAnswer(selectedAnswer, problem.answer);
                
                if (isCorrect) {
                    score += 10;
                    document.getElementById('score-value').textContent = score;
                    e.currentTarget.classList.add('bg-green-100', 'border-green-500');
                } else {
                    e.currentTarget.classList.add('bg-red-100', 'border-red-500');
                }
                
                showFeedback(isCorrect);
            });
        });
    }

    // Navigation handlers
    document.getElementById('back-btn').addEventListener('click', () => {
        if (currentProblemIndex > 0) {
            currentProblemIndex--;
            renderProblem(currentProblemIndex);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentProblemIndex < problems.length - 1) {
            currentProblemIndex++;
            renderProblem(currentProblemIndex);
        }
    });

    // Start with first problem
    renderProblem(0);
}

function getDifficultyColor(difficulty) {
    return {
        easy: 'green',
        medium: 'yellow',
        hard: 'red'
    }[difficulty];
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