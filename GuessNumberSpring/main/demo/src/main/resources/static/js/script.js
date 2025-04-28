document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '/api/game';

    // Инициализация элементов DOM
    const elements = {
        startButton: document.getElementById('startButton'),
        checkButton: document.getElementById('checkButton'),
        newGameButton: document.getElementById('newGameButton'),
        inputA: document.getElementById('inputA'),
        inputB: document.getElementById('inputB'),
        guessInput: document.getElementById('guessInput'),
        setupSection: document.getElementById('setupSection'),
        gameSection: document.getElementById('gameSection'),
        message: document.getElementById('message'),
        remainingAttempts: document.getElementById('remainingAttempts'),
        history: document.getElementById('history'),
        rulesBlock: document.getElementById('rulesBlock')
    };

    // Инициализация приложения
    function init() {
        setupEventListeners();
        updateRulesDisplay();
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        elements.startButton.addEventListener('click', startGameHandler);
        elements.checkButton.addEventListener('click', handleGuess);
        elements.newGameButton.addEventListener('click', endGame);
        elements.inputA.addEventListener('input', updateRulesDisplay);
        elements.inputB.addEventListener('input', updateRulesDisplay);
        elements.guessInput.addEventListener('keypress', e => {
            if(e.key === 'Enter') handleGuess();
        });
    }
    console.log('Элемент startButton:', document.getElementById('startButton'));

    // Обновление блока правил
    function updateRulesDisplay() {
        const min = parseInt(elements.inputA.value) || 0;
        const max = parseInt(elements.inputB.value) || 0;
        const isValid = min < max;
        const attempts = isValid ? Math.ceil(Math.log2(max - min + 1)) : '?';

        elements.rulesBlock.innerHTML = `
            <h4 class="alert-heading">📜 Правила игры:</h4>
            <ol class="mb-0">
                <li>Задайте диапазон чисел [${min}; ${max}]</li>
                ${isValid ? `
                <li>Компьютер загадает случайное число</li>
                <li>У вас будет <strong>${attempts}</strong> попыток</li>
                ` : `
                <li class="text-danger">⚠️ Минимум должен быть меньше максимума</li>
                `}
                <li>Используйте подсказки:
                    <ul class="mt-1">
                        <li>🔺 Число больше вашей попытки</li>
                        <li>🔻 Число меньше вашей попытки</li>
                    </ul>
                </li>
            </ol>
        `;
    }

    async function sha256(message) {
        // Кодируем сообщение в Uint8Array
        const msgBuffer = new TextEncoder().encode(message);

        // Вычисляем хеш
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

        // Преобразуем ArrayBuffer в обычный массив байт
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // Конвертируем байты в hex-строку
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex;
    }

    // Обработчик начала игры
    async function startGameHandler() {
        try {
            const min = parseInt(elements.inputA.value);
            const max = parseInt(elements.inputB.value);

            if(min >= max) {
                showMessage('Ошибка: Неверный диапазон', 'danger');
                return;
            }

            let checksum;
            await sha256(String(min) + String(max)).then(hash => checksum = hash);
            console.log(checksum);
            let bodyReq = JSON.stringify({ min, max, checksum });
            const response = await fetch(`${API_BASE_URL}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: bodyReq
            });

            if(!response.ok) throw new Error(await response.text());

            const data = await response.json();
            currentGameId = data.gameId;

            elements.setupSection.classList.add('hidden');
            elements.gameSection.classList.remove('hidden');
            elements.guessInput.focus();
            updateGameUI(data);

        } catch(error) {
            handleApiError(error);
        }
    }

    // Обработчик попытки угадать
    async function handleGuess() {
        try {
            const guess = parseInt(elements.guessInput.value);

            if(isNaN(guess)) {
                showMessage('Введите корректное число', 'warning');
                return;
            }

            let checksum;
            await sha256(String(guess)).then(hash => checksum = hash);
            console.log(checksum);
            let bodyReq = JSON.stringify({
                guess,
                checksum
            });

            const response = await fetch(`${API_BASE_URL}/guess`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: bodyReq
            });

            if(!response.ok) throw new Error(await response.text());

            const data = await response.json();
            updateGameUI(data);

            if(data.gameOver) endGame();

        } catch(error) {
            handleApiError(error);
        } finally {
            elements.guessInput.value = '';
        }
    }

    // Обновление игрового интерфейса
    function updateGameUI(data) {
        elements.remainingAttempts.textContent = data.remainingAttempts;
        if(data.remainingAttempts <= 0){
            document.getElementById('guessInput').setAttribute('disabled', 'disabled');
        } else {
            document.getElementById('guessInput').removeAttribute('disabled');
        }
        showMessage(data.message, data.gameOver ? 'danger' : 'info');
        updateHistory(data.history);
    }

    // Обновление истории попыток
    function updateHistory(history) {
        elements.history.innerHTML = history.map((attempt, index) => `
            <div class="alert ${getAttemptStyle(attempt.result)} mb-2">
                <div class="d-flex justify-content-between">
                    <span>#${index + 1}: ${attempt.number}</span>
                </div>
                <div class="mt-1">
                    ${attempt.result === 'CORRECT' ? '🎉 Правильно!' :
            attempt.result === 'LOW' ? '🔻 Меньше загаданного' :
                '🔺 Больше загаданного'}
                </div>
            </div>
        `).join('');
    }

    // Завершение игры
    function endGame() {
        currentGameId = null;
        elements.setupSection.classList.remove('hidden');
        elements.gameSection.classList.add('hidden');
        elements.inputA.focus();
        elements.history.innerHTML = '';
        showMessage('', 'info');
    }

    // Вспомогательные функции
    function showMessage(text, style) {
        elements.message.textContent = text;
        elements.message.className = `alert alert-${style}`;
    }

    function getAttemptStyle(result) {
        return {
            'CORRECT': 'alert-success',
            'LOW': 'alert-warning',
            'HIGH': 'alert-danger'
        }[result];
    }

    function handleApiError(error) {
        console.error('API Error:', error);
        showMessage('Ошибка сервера: попробуйте еще раз', 'danger');
    }

    // Запуск приложения
    init();
});