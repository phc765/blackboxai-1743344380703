// Math problem types
const problemTypes = {
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction',
    MULTIPLICATION: 'multiplication',
    DIVISION: 'division'
};

// Difficulty levels
const difficultyLevels = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

// Generate random math problems (Violympic style)
function generateMathProblem(type, difficulty) {
    let num1, num2, num3, answer;

    
    switch(difficulty) {
        case difficultyLevels.EASY:
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            break;
        case difficultyLevels.MEDIUM:
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            break;
        case difficultyLevels.HARD:
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 100) + 1;
            break;
    }

        switch(type) {
        case problemTypes.ADDITION:
            answer = num1 + num2;
            return {
                question: `Điền số thích hợp: ${num1} + ${num2} = ?`,
                answer: answer,
                options: generateOptions(answer, difficulty)
            };

                case problemTypes.SUBTRACTION:
            if (num1 < num2) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            return {
                question: `Khoanh vào kết quả đúng: ${num1} - ${num2} = ?`,
                answer: answer, 
                options: generateOptions(answer, difficulty)
            };

                case problemTypes.MULTIPLICATION:
            answer = num1 * num2;
            return {
                question: `Tính: ${num1} × ${num2} = ?`,
                answer: answer,
                options: generateOptions(answer, difficulty)
            };

                case problemTypes.DIVISION:
            answer = num1;
            num1 = num1 * num2;
            return {
                question: `Tìm x: ${num1} ÷ ${num2} = x`,
                answer: answer,
                options: generateOptions(answer, difficulty)
            };

        case problemTypes.COMPARE:
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 100) + 1;
            const comparisons = ['lớn hơn', 'bé hơn', 'bằng'];
            const comparison = comparisons[Math.floor(Math.random() * comparisons.length)];
            let correctOption;
            
            if (comparison === 'lớn hơn') correctOption = num1 > num2 ? 'Đ' : 'S';
            else if (comparison === 'bé hơn') correctOption = num1 < num2 ? 'Đ' : 'S';
            else correctOption = num1 === num2 ? 'Đ' : 'S';
            
            return {
                question: `Đúng hay Sai? ${num1} ${comparison} ${num2}`,
                answer: correctOption,
                options: ['Đ', 'S']
            };

        case problemTypes.SEQUENCE:
            const start = Math.floor(Math.random() * 50) + 1;
            const step = Math.floor(Math.random() * 5) + 1;
            const sequence = [start, start + step, start + step * 2];
            const missingPos = Math.floor(Math.random() * 3);
            answer = sequence[missingPos];
            sequence[missingPos] = '?';
            
            return {
                question: `Điền số còn thiếu: ${sequence.join(', ')}`,
                answer: answer,
                options: generateOptions(answer, difficulty)
            };

        case problemTypes.WORD_PROBLEM:
            return wordProblems[Math.floor(Math.random() * wordProblems.length)];

    }
}

// Generate multiple choice options
function generateOptions(correctAnswer, difficulty) {
    const options = [correctAnswer];
    const range = difficulty === difficultyLevels.EASY ? 5 : 
                 difficulty === difficultyLevels.MEDIUM ? 10 : 20;
    
    while(options.length < 4) {
        const randomOffset = Math.floor(Math.random() * range) + 1;
        const option = correctAnswer + (Math.random() > 0.5 ? randomOffset : -randomOffset);
        
        // Ensure positive numbers and no duplicates
        if (option > 0 && !options.includes(option)) {
            options.push(option);
        }
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
}

// Check user answer
function checkAnswer(selectedAnswer, correctAnswer) {
    return parseInt(selectedAnswer) === correctAnswer;
}

// Export functions
export { 
    problemTypes, 
    difficultyLevels, 
    generateMathProblem, 
    checkAnswer 
};