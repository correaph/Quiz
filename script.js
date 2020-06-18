/* Array of questions
   Index 0: Question
   Index 1: Sub-array of possible answers
   Index 2: Index of sub-array for right answer
*/
var questions = [
    ["What does a break statement do ?", ["Restart the current loop.", "Exits from the current loop.", "Exit the current for loop.", "None of the above."], 1],
    ["What is the use of type of operator?", ["'Typeof' is an operator which is used to return a string description of the type of a variable.", "'Typeof' is an operator which is used to convert a number to a string.", "'Typeof' is an operator which is used to return a string description of the type of a variable", "'Typeof' is used to create an object variable."], 0],
    ["Which keywords are used to handle exceptions", ["try, get and finally", "begin, catch and finally", "try, catch and end", "try, catch and finally"], 3],
    ["Which company developed JavaScript ?", ["Microsoft", "Oracle", "Nescape", "Sun"], 2],
    ["What would be the result of 3+2+'7' ?", ["57", "327", "12", "39"], 0]
];
/* Gloval variables */
var highscore = JSON.parse(localStorage.getItem("quizhighscore"));
var timer = 0;
var timeOut = null;
var htmlSec1 = document.getElementById("Sec1");
var htmlSec2 = document.getElementById("Sec2");
var htmlSec3 = document.getElementById("Sec3");
var intervalFunction = null;
var msgElement = null;
/* startQuiz function 
   Initializes timer, clear html document, and calls showNextQuestion Function.
   Calls finishQuiz when time is over.
*/
var startQuiz = function () {
    timer = questions.length * 15;
    intervalFunction = setInterval(function () {
        timerElement.textContent = "Remaining time: " + (--timer);
        if (timer <= 0) {
            finishQuiz();
        }
    }, 1000);
    while (htmlSec3.firstChild) {
        htmlSec3.removeChild(htmlSec3.firstChild);
    }
    var timerElement = document.createElement("div");
    htmlSec3.appendChild(timerElement);
    msgElement = document.createElement("div");
    msgElement.setAttribute("class", "centerXY");
    htmlSec3.appendChild(msgElement);
    showNextQuestion();
};
/* showNextQuestion function 
   Randomly shows a question still saved in questions array,
   wait for user to choose an answer, removes it from questions array,
   and call itself until questions is empty.
*/
var showNextQuestion = function () {
    if (questions.length > 0 && timer > 0) {
        var randomN = Math.floor(Math.random() * questions.length);
        htmlSec1.firstElementChild.textContent = questions[randomN][0];
        while (htmlSec2.firstChild) {
            htmlSec2.removeChild(htmlSec2.firstChild);
        }
        var olDoc = document.createElement("ol");
        olDoc.style.justifyContent = "space-between";
        olDoc.addEventListener("click", function (event) {
            if (event.target.getAttribute("answer-index") == questions[randomN][2]) {
                msgElement.style.color = "green";
                msgElement.textContent = " ==> Correct!";
            }
            else {
                msgElement.style.color = "red";
                msgElement.textContent = " ==> Wrong!";
                timer -= 15;
                if (timer < 0) {
                    timer = 0;
                }
            }
            setTimeout(() => {
                msgElement.textContent = "";
            }, 1000);
            questions.splice(randomN, 1);
            showNextQuestion();
        });
        for (var i = 0; i < questions[randomN][1].length; i++) {
            var liDoc = document.createElement("li");
            liDoc.textContent = questions[randomN][1][i];
            liDoc.setAttribute("answer-index", i);
            olDoc.appendChild(liDoc);
        }
        var divTimer = document.createElement("div");
        htmlSec2.appendChild(olDoc);
        htmlSec3.appendChild(divTimer)
    } else {
        finishQuiz();
    }
}
/* finishQuiz function
   This function is triggered when time is over or when user have answered all the questions.
   It shows score, demands user name, and calls saveScore function.
*/
var finishQuiz = function () {
    clearInterval(intervalFunction);
    htmlSec1.firstElementChild.textContent = "You have completed the quiz! Your score is " + timer + "."
    while (htmlSec2.firstChild) {
        htmlSec2.removeChild(htmlSec2.firstChild);
    }
    while (htmlSec3.firstChild) {
        htmlSec3.removeChild(htmlSec3.firstChild);
    }
    saveScore();
};
/* saveScore function
   Adds username and score to highscore array, save it in local storage.
*/
var saveScore = function () {
    var form = document.createElement("form");
    var input = document.createElement("input");
    input.setAttribute("id", "name");
    var label = document.createElement("label");
    form.appendChild(label);
    label.textContent = "Enter your name for highscore records:"
    label.setAttribute("for", "name")
    form.appendChild(input);
    htmlSec2.appendChild(form);
    input.addEventListener("change", function () {
        if (highscore === null) {
            highscore = [[input.value, timer]];
        } else {
            highscore.push([input.value, timer]);
        }
        input.disabled = true;
        var restarLink = document.createElement("a");
        restarLink.href = "index.html";
        restarLink.textContent ="Restart Quiz"
        htmlSec2.appendChild(restarLink);
        localStorage.setItem("quizhighscore", JSON.stringify(highscore));
        showhighscoreRecord();
    })
};
/* showhighscoreRecord function
   Sorts highscore array in descending order, and show top five names and scores.
*/
var showhighscoreRecord = function () {
    var table = document.createElement("table");
    var caption = document.createElement("caption");
    caption.style.fontWeight = "bolder";
    table.appendChild(caption);
    caption.textContent = "HIGHSCORE - TOP 5";
    var tr = document.createElement("tr");
    table.appendChild(tr);
    var th = document.createElement("th");
    tr.appendChild(th);
    th.textContent = "Name";
    th = document.createElement("Score");
    tr.appendChild(th);
    th.textContent = "Score";
    if (highscore != null) {
        highscore.sort(function (a, b) { return parseInt(b[1]) - parseInt(a[1]) });
        for (var i = 0; i < 5 && i < highscore.length; i++) {
            tr = document.createElement("tr");
            table.appendChild(tr);
            var td = document.createElement("td");
            td.textContent = highscore[i][0];
            tr.appendChild(td);
            td = document.createElement("td");
            td.textContent = highscore[i][1];
            tr.appendChild(td);
        };
    }
    htmlSec3.appendChild(table);
   };
/* Add click event to StartButton*/
var startButton = document.getElementById("StartButton");
startButton.addEventListener("click", function (event) { startQuiz() });