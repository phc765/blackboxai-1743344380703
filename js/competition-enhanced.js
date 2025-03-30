import { generateMathProblem, problemTypes, difficultyLevels } from './game-logic-enhanced.js';
import { showFeedback } from './main.js';

class CompetitionMode {
    constructor() {
        this.timeLimit = 60; // 60 seconds
        this.score = 0;
        this.timer = null;
        this.currentProblem = null;
        this.isRunning = false;
    }

    startCompetition() {
        this.score = 0;
        this.isRunning = true;
        this.updateScoreDisplay();
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
        // Random problem type including new Violympic types
        const types = [
            problemTypes.ADDITION,
            problemTypes.SUBTRACTION,
            problemTypes.MULTIPLICATION,
            problemTypes.DIVISION,
            problemTypes.COMPARE,
            problemTypes.SEQUENCE,
            problemTypes.WORD_PROBLEM
        ];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        this.currentProblem = generateMathProblem(randomType, difficultyLevels.MEDIUM);
        this.displayProblem(this.currentProblem);
    }

    displayProblem(problem) {
        const problemContainer = document.getElementById('problem-container');
        if (!problemContainer) return;

        problemContainer.innerHTML = `
            <div class="math-problem">${problem.question}</div>
            <div class="grid grid-cols-2 gap-4 mt-6">
                ${problem.options.map((option, index) => `
                    <div class="answer-option" data-answer="${option}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (!this.isRunning) return;
                
                const selectedAnswer = e.currentTarget.dataset.answer;
                const isCorrect = checkAnswer(selectedAnswer, problem.answer);
                
                if (isCorrect) {
                    this.score += 10;
                    this.updateScoreDisplay();
                    showFeedback(true);
                } else {
                    showFeedback(false);
                }

                this.generateNewProblem();
            });
        });
    }

    endCompetition() {
        clearInterval(this.timer);
        this.isRunning = false;
        
        const problemContainer = document.getElementById('problem-container');
        if (problemContainer) {
            problemContainer.innerHTML = `
                <div class="text-center py-8">
                    <h2 class="text-2xl font-bold mb-4">Hết giờ!</h2>
                    <p class="text-xl mb-6">Điểm của bạn: <span class="font-bold">${this.score}</span></p>
                    <button id="restart-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                        Chơi lại
                    </button>
                </div>
            `;

            document.getElementById('restart-btn').addEventListener('click', () => {
                this.startCompetition();
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