let secretNumber;
let minRange;
let maxRange;
let remainingAttempts;
let maxAttempts;
document.getElementById("guessInput").removeAttribute("disabled");
const dynamicRules = document.getElementById('dynamicRules');
document.getElementById('startGame').addEventListener("click", startGame);
document.getElementById('guessInput').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        handleGuess();
    }
});
document.getElementById('Guess').addEventListener("click", handleGuess);
document.getElementById('newGame').addEventListener("click", endGame);

function updateRules() {
    a = parseInt(document.getElementById('inputA').value);
    b = parseInt(document.getElementById('inputB').value);
    attempts = Math.ceil(Math.log2(b - a + 1));

    rulesHTML = `
        <ol class="mb-0">
            <li>Задайте диапазон чисел [${a}; ${b}] в полях ввода</li>
            <li>Компьютер загадает случайное число в этом диапазоне</li>
            <li>У вас будет <strong>${attempts}</strong> попыток для угадывания</li>
            <li>После каждой попытки вы получите подсказку:
                <ul class="mt-1">
                    <li>🔺 Число больше вашей попытки</li>
                    <li>🔻 Число меньше вашей попытки</li>
                    <li>🎉 Вы угадали!</li>
                </ul>
            </li>
        </ol>
    `;

    dynamicRules.innerHTML = rulesHTML;
}

function startGame() {
    guessHistory = [];
    updateHistoryDisplay();
    updateRules();
    minRange = parseInt(document.getElementById('inputA').value);
    maxRange = parseInt(document.getElementById('inputB').value);

    if (minRange >= maxRange) {
        showValidateMessage('Error: Minimum value must be less than maximum value', 'alert-danger');
        return;
    }

    secretNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;

    const rangeSize = maxRange - minRange + 1;
    maxAttempts = Math.ceil(Math.log2(rangeSize));
    remainingAttempts = maxAttempts;

    document.getElementById('setupSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');
    document.getElementById('remainingAttempts').textContent = remainingAttempts;
    document.getElementById('message').className = 'alert';
    document.getElementById('guessInput').value = '';
    document.getElementById("guessInput").focus();
}


// Добавьте новую функцию
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('guessHistory');
    historyContainer.innerHTML = guessHistory.map((attempt, index) => `
        <div class="d-flex justify-content-between small ${attempt.result === 'correct' ? 'text-success' : ''}">
            <span>#${index + 1}: ${attempt.number}</span>
            <span>${attempt.result.toUpperCase()}</span>
        </div>
    `).join('');
}

function handleGuess() {
    document.getElementById("guessInput").focus();
    const guessInput = document.getElementById('guessInput');
    const guess = parseInt(guessInput.value);
    const messageElement = document.getElementById('message');

    if (isNaN(guess) || guess < minRange || guess > maxRange) {
        showMessage(`Please enter a number between ${minRange} and ${maxRange}`, 'alert-danger');
        return;
    }

    remainingAttempts--;
    document.getElementById('remainingAttempts').textContent = remainingAttempts;
    if(remainingAttempts === 0 || remainingAttempts < 0){
        showMessage(`Game Over! The number was ${secretNumber}`, 'alert-danger');
        document.getElementById("guessInput").setAttribute("disabled", "true");
        document.getElementById("newGame").focus();
    } else{
        if (guess === secretNumber) {
            showMessage(`🎉 Correct! You won with ${maxAttempts - remainingAttempts} attempts!`, 'alert-success');
            document.getElementById("guessInput").setAttribute("disabled", "true");
            document.getElementById("newGame").focus();
        } else {
            const hint = guess < secretNumber ? 'higher' : 'lower';
            showMessage(`Try again! The number is ${hint} than ${guess}`, 'alert-warning');
        }
    }
    guessHistory.push({
        number: guess,
        result: guess === secretNumber ? 'correct' : guess < secretNumber ? 'high' : 'low',
    });

    updateHistoryDisplay();

    guessInput.value = '';
}

function showMessage(text, style) {
    const messageElement = document.getElementById('message');
    document.getElementById('message').hidden = false;
    messageElement.textContent = text;
    messageElement.className = `alert ${style}`;
}

function showValidateMessage(text, style) {
    const messageElement = document.getElementById('valmessage');
    messageElement.textContent = text;
    messageElement.className = `alert ${style}`;
}

function endGame() {
    document.getElementById('message').hidden = true;
    guessHistory = [];
    updateHistoryDisplay();
    document.getElementById('gameSection').classList.add('hidden');
    document.getElementById('setupSection').classList.remove('hidden');
    //document.getElementById().classList
}


