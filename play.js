const question = document.getElementById("quesiton");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const correctBonus = 5;
const maxQuestions = 10;
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById('score');
const preloader = document.getElementById('preloader');
const gmae = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];

let questions = [];
//     {
//         question: 'Inside which HTML element do we put the JavaScript?',
//         choice1: '<script>',
//         choice2: '<javascript>',
//         choice3: '<js>',
//         choice4: '<scripting>',
//         answer: 1,
//     },
//     {
//         question:
//             "What is the correct syntax for referring to an external script called 'xxx.js'?",
//         choice1: "<script href='xxx.js'>",
//         choice2: "<script name='xxx.js'>",
//         choice3: "<script src='xxx.js'>",
//         choice4: "<script file='xxx.js'>",
//         answer: 3,
//     },
//     {
//         question: " How do you write 'Hello World' in an alert box?",
//         choice1: "msgBox('Hello World');",
//         choice2: "alertBox('Hello World');",
//         choice3: "msg('Hello World');",
//         choice4: "alert('Hello World');",
//         answer: 4,
//     },
//     {
//         question: "Where is the correct place to insert a JavaScript?",
//         choice1: "The <head> section",
//         choice2: "The <body>section",
//         choice3: "title",
//         choice4: "Both the <head> section and <body> section are correct"

//     }
// ];
fetch(
    'https://opentdb.com/api.php?amount=50&category=18&difficulty=medium&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    gmae.classList.remove('hidden');
    preloader.classList.add('hidden');
};

getNewQuestion = ()=> {
    if (availableQuesions.length === 0 || questionCounter >= maxQuestions) {
        localStorage.setItem("recentScore", score);
        //go to the end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
     questionCounterText.innerText = `${questionCounter}/${maxQuestions}`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        
        const apply= selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if(apply === 'correct')
        {
            incrementScore(correctBonus);
        }
       
    selectedChoice.parentElement.classList.add(apply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(apply);
      getNewQuestion();
    }, 1000);

    });
});

incrementScore = num=>{
    score += num;
    scoreText.innerText = score;
}

