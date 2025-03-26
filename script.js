const quizListScreen = document.getElementById('quiz-list-screen');
const quizList = document.getElementById('quiz-list');
const quizScreen = document.getElementById('quiz-screen');
const questionNumberDisplay = document.getElementById('question-number');
const questionStatementDisplay = document.getElementById('question-statement');
const optionsList = document.getElementById('options-list');
const checkAnswerBtn = document.getElementById('check-answer-btn');
const nextBtn = document.getElementById('next-btn');
const resultScreen = document.getElementById('result-screen');
const correctAnswersDisplay = document.getElementById('correct-answers');
const incorrectAnswersDisplay = document.getElementById('incorrect-answers');
const summaryDiv = document.getElementById('summary');
const summaryList = document.getElementById('summary-list');
const backToQuizzesBtn = document.getElementById('back-to-quizzes-btn');

const quizzesData = [
    {
        id: 'quiz1',
        title: 'Quiz 1',
        questions: [
            {
                question: 'What is the capital of France?',
                options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
                correctAnswer: 'Paris'
            },
            {
                question: 'What is 2 + 2?',
                options: ['3', '4', '5', '6'],
                correctAnswer: '4'
            },
            {
                question: 'Which planet is known as the Red Planet?',
                options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
                correctAnswer: 'Mars'
            },
            {
                question: 'What is the chemical symbol for water?',
                options: ['Wo', 'Wa', 'H2O', 'HO2'],
                correctAnswer: 'H2O'
            },
            {
                question: 'Who painted the Mona Lisa?',
                options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo'],
                correctAnswer: 'Da Vinci'
            }
        ]
    },
    {
        id: 'quiz2',
        title: 'Quiz 2',
        questions: [
            {
                question: 'What is the largest mammal?',
                options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
                correctAnswer: 'Blue Whale'
            },
            {
                question: 'In which year did World War II end?',
                options: ['1943', '1945', '1947', '1949'],
                correctAnswer: '1945'
            },
            {
                question: 'What is the currency of Japan?',
                options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
                correctAnswer: 'Yen'
            },
            {
                question: 'What is the powerhouse of the cell?',
                options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
                correctAnswer: 'Mitochondria'
            },
            {
                question: 'Who wrote the play "Hamlet"?',
                options: ['Charles Dickens', 'Jane Austen', 'William Shakespeare', 'Leo Tolstoy'],
                correctAnswer: 'William Shakespeare'
            }
        ]
    }
];

let currentQuiz = null;
let currentQuestionIndex = 0;
let selectedOption = null;
let userAnswers = [];

// Function to start a quiz
function startQuiz(quizId) {
    currentQuiz = quizzesData.find(quiz => quiz.id === quizId);
    if (currentQuiz) {
        quizListScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        currentQuestionIndex = 0;
        userAnswers = [];
        loadQuestion();
    }
}

// Function to load the current question
function loadQuestion() {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length) {
        const currentQuestion = currentQuiz.questions[currentQuestionIndex];
        questionNumberDisplay.textContent = `Question ${currentQuestionIndex + 1}`;
        questionStatementDisplay.textContent = currentQuestion.question;
        optionsList.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const li = document.createElement('li');
            li.textContent = option;
            li.dataset.option = index;
            li.addEventListener('click', selectOption);
            optionsList.appendChild(li);
        });
        checkAnswerBtn.disabled = true;
        nextBtn.classList.add('hidden');
        selectedOption = null;
        removeOptionHighlights();
    } else {
        // Quiz finished
        showResults();
    }
}

// Function to handle option selection
function selectOption(event) {
    if (!checkAnswerBtn.disabled) return; // Prevent selection after checking

    removeOptionHighlights();
    selectedOption = event.target;
    selectedOption.classList.add('selected');
    checkAnswerBtn.disabled = false;
}

// Function to remove highlighting from options
function removeOptionHighlights() {
    optionsList.querySelectorAll('li').forEach(li => {
        li.classList.remove('selected');
        li.classList.remove('correct');
        li.classList.remove('incorrect');
    });
}

// Function to check the selected answer
function checkAnswer() {
    if (!selectedOption) return;

    const selectedAnswerIndex = parseInt(selectedOption.dataset.option);
    const correctAnswer = currentQuiz.questions[currentQuestionIndex].correctAnswer;
    const correctAnswerIndex = currentQuiz.questions[currentQuestionIndex].options.indexOf(correctAnswer);

    if (currentQuiz.questions[currentQuestionIndex].options[selectedAnswerIndex] === correctAnswer) {
        selectedOption.classList.add('correct');
        userAnswers.push({ question: currentQuiz.questions[currentQuestionIndex], selectedAnswer: currentQuiz.questions[currentQuestionIndex].options[selectedAnswerIndex], isCorrect: true });
    } else {
        selectedOption.classList.add('incorrect');
        const correctOption = optionsList.querySelector(`li[data-option="${correctAnswerIndex}"]`);

        if (correctOption) {
            correctOption.classList.add('correct');
        }
        userAnswers.push({ question: currentQuiz.questions[currentQuestionIndex], selectedAnswer: currentQuiz.questions[currentQuestionIndex].options[selectedAnswerIndex], isCorrect: false });
    }

    checkAnswerBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
}

// Function to move to the next question
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
    checkAnswerBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    checkAnswerBtn.disabled = true;
}

// Function to show the results
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
    const incorrectCount = userAnswers.length - correctCount;

    correctAnswersDisplay.textContent = `Correct Answers: ${correctCount}`;
incorrectAnswersDisplay.textContent = `Incorrect Answers: ${incorrectCount}`;

    // Bonus: Display question summary
    summaryList.innerHTML = '';
    userAnswers.forEach(answer => {
        const li = document.createElement('li');
        li.classList.add('summary-item');
        li.innerHTML = `
            <p><strong>Question:</strong> ${answer.question.question}</p>
            <p><strong>Your Answer:</strong> ${answer.selectedAnswer}</p>
            <p><strong>Correct Answer:</strong> ${answer.question.correctAnswer}</p>
            <p class="${answer.isCorrect ? 'correct' : 'incorrect'}">${answer.isCorrect ? 'Correct' : 'Incorrect'}</p>
        `;
        summaryList.appendChild(li);
    });
    summaryDiv.classList.remove('hidden');
}

// Event listeners
quizList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const quizId = event.target.dataset.quizId;
        startQuiz(quizId);
    }
});

checkAnswerBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextQuestion);
backToQuizzesBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    quizListScreen.classList.remove('hidden');
    currentQuiz = null;
    currentQuestionIndex = 0;
    userAnswers = [];
});

// Bonus: Preventing back button (basic browser history manipulation)
function preventBackButton() {
    window.history.pushState(null, null, window.location.pathname + window.location.hash);
    window.addEventListener('popstate', function(event) {
        window.history.pushState(null, null, window.location.pathname + window.location.hash);
    });
}

// Call preventBackButton when a quiz starts
function startQuiz(quizId) {
    currentQuiz = quizzesData.find(quiz => quiz.id === quizId);
    if (currentQuiz) {
        quizListScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        currentQuestionIndex = 0;
        userAnswers = [];
        loadQuestion();
        preventBackButton(); // Add here to prevent back button after starting a quiz
    }
}
