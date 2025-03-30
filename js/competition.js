import { generateMathProblem, problemTypes, difficultyLevels } from './game-logic-enhanced.js';

import { showFeedback } from './main.js';

class CompetitionMode {
    constructor() {
        this.baseTimeLimit = 60; // 60 seconds
        this.timeLimit = 60;
        this.score = 0;
        this.streak = 0;
        this.timer = null;
        this.currentProblem = null;
        this.isRunning = false;
        this.difficulty = 'medium';
        this.activePowerUps = [];
        this.comboMultiplier = 1;
    }

    get difficultySettings() {
        return {
            easy: { timeBonus: 5, pointMultiplier: 1 },
            medium: { timeBonus: 3, pointMultiplier: 1.5 },
            hard: { timeBonus: 1, pointMultiplier: 2 }
        };
    }


        startCompetition(difficulty = 'medium') {
        this.score = 0;
        this.streak = 0;
        this.comboMultiplier = 1;
        this.difficulty = difficulty;
        this.timeLimit = this.baseTimeLimit;
        this.isRunning = true;
        this.activePowerUps = [];
        this.updateScoreDisplay();
        this.updateStreakDisplay();
        this.startTimer();
        this.generateNewProblem();
    }


    startTimer() {
        let timeLeft = this.timeLimit;
        this.updateTimerDisplay(timeLeft);

        this.timer = setInterval(() => {
            timeLeft--;
            this.updateTimerDisplay(timeLeft);

            if (timeLeft <= 0) {
                this.endCompetition();
            }
        }, 1000);
    }

    updateTimerDisplay(timeLeft) {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = timeLeft;
            timerElement.style.color = timeLeft <= 10 ? 'red' : 'inherit';
        }
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

        generateNewProblem() {
        const types = Object.values(problemTypes);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        this.currentProblem = generateMathProblem(randomType, this.difficulty);
        this.displayProblem(this.currentProblem);
        
        // Apply active power-ups
        this.applyPowerUps();
    }

    applyPowerUps() {
        const powerUpContainer = document.getElementById('powerup-container');
        if (powerUpContainer) {
            powerUpContainer.innerHTML = this.activePowerUps.map(powerup => `
                <div class="powerup-badge bg-${this.getPowerUpColor(powerup)}-500 text-white px-2 py-1 rounded-full text-xs">
                    ${powerup.toUpperCase()}
                </div>
            `).join('');
        }
    }

    getPowerUpColor(powerup) {
        const colors = {
            'time+': 'blue',
            '2x': 'green',
            'skip': 'purple'
        };
        return colors[powerup] || 'gray';
    }


        displayProblem(problem) {
        const problemContainer = document.getElementById('problem-container');
        if (!problemContainer) return;

        problemContainer.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <div class="difficulty-badge bg-${this.getDifficultyColor()} text-white px-3 py-1 rounded-full">
                    ${this.difficulty.toUpperCase()}
                </div>
                <div id="powerup-container" class="flex space-x-2"></div>
            </div>
            <div class="math-problem text-3xl">${problem.question}</div>
            <div class="grid grid-cols-2 gap-4 mt-6">
                ${problem.options.map((option, index) => `
                    <div class="answer-option transform hover:scale-105 transition-transform" data-answer="${option}">
                        <div class="option-content p-4 rounded-lg shadow-md bg-white hover:bg-blue-50">
                            ${option}
                        </div>
                    </div>
                `).join('')}
            </div>
            ${this.streak > 3 ? `
                <div class="combo-meter mt-4">
                    <div class="text-center text-yellow-500 font-bold">
                        COMBO x${this.comboMultiplier}!
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-yellow-500" style="width: ${Math.min(100, (this.streak / 10) * 100)}%"></div>
                    </div>
                </div>
            ` : ''}
        `;


        // Add event listeners to answer options
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (!this.isRunning) return;
                
                                const selectedAnswer = e.currentTarget.dataset.answer;
                const isCorrect = checkAnswer(selectedAnswer, problem.answer);
                
                if (isCorrect) {
                    this.streak++;
                    if (this.streak % 3 === 0) {
                        this.comboMultiplier = Math.min(5, Math.floor(this.streak / 3));
                    }
                    
                    const basePoints = 10 * this.comboMultiplier;
                    const difficultyBonus = this.difficultySettings[this.difficulty].pointMultiplier;
                    this.score += Math.round(basePoints * difficultyBonus);
                    
                    // Add time bonus for correct answer
                    this.timeLimit += this.difficultySettings[this.difficulty].timeBonus;
                    this.updateTimerDisplay(this.timeLimit);
                    
                    this.updateScoreDisplay();
                    this.updateStreakDisplay();
                    showFeedback(true);
                    
                    // Chance to get power-up
                    if (Math.random() < 0.2 && this.activePowerUps.length < 3) {
                        this.addRandomPowerUp();
                    }
                } else {
                    this.streak = 0;
                    this.comboMultiplier = 1;
                    showFeedback(false);
                }

                this.generateNewProblem();

            });
        });
    }

        addRandomPowerUp() {
        const powerUps = ['time+', '2x', 'skip'];
        const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
        this.activePowerUps.push(randomPowerUp);
        this.showPowerUpNotification(randomPowerUp);
    }

    showPowerUpNotification(powerup) {
        const notifications = {
            'time+': 'Thêm 5 giây!',
            '2x': 'Nhân đôi điểm!',
            'skip': 'Bỏ qua câu hỏi!'
        };
        
        const notification = document.createElement('div');
        notification.className = `powerup-notification bg-${this.getPowerUpColor(powerup)}-500 text-white p-3 rounded-lg shadow-lg mb-4 animate-bounce`;
        notification.textContent = notifications[powerup];
        document.getElementById('problem-container').prepend(notification);
        
        setTimeout(() => notification.remove(), 2000);
    }

    getDifficultyColor() {
        return {
            easy: 'green',
            medium: 'yellow',
            hard: 'red'
        }[this.difficulty];
    }

    updateStreakDisplay() {
        const streakElement = document.getElementById('streak-counter');
        if (streakElement) {
            streakElement.textContent = this.streak;
            streakElement.className = `streak-counter ${this.streak > 3 ? 'text-yellow-500 animate-pulse' : 'text-gray-500'}`;
        }
    }

    endCompetition() {
        clearInterval(this.timer);
        this.isRunning = false;
        
        const problemContainer = document.getElementById('problem-container');
        if (problemContainer) {
            problemContainer.innerHTML = `
                <div class="text-center py-8">
                    <h2 class="text-2xl font-bold mb-4">Hết giờ!</h2>
                    <div class="result-card bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
                        <p class="text-xl">Điểm của bạn:</p>
                        <p class="text-4xl font-bold my-2">${this.score}</p>
                        <p class="text-sm">Độ khó: ${this.difficulty.toUpperCase()}</p>
                    </div>
                    <div class="flex justify-center space-x-4">
                        <button id="restart-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">
                            Chơi lại
                        </button>
                        <button id="change-difficulty-btn" class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition">
                            Đổi độ khó
                        </button>
                    </div>
                </div>
            `;


                        document.getElementById('restart-btn').addEventListener('click', () => {
                this.startCompetition(this.difficulty);
            });
            
            document.getElementById('change-difficulty-btn').addEventListener('click', () => {
                this.showDifficultySelector();
            });

        }
    }
}

// Initialize competition mode when competition section is loaded
function initCompetition() {
    const competition = new CompetitionMode();
    competition.startCompetition();
}

export { initCompetition };