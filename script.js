let currentPage = 1;

// Токен и ID бота
const BOT_TOKEN = "8823167341:AAFYxnFbars8Yuj9NQf9b4bRyVoI9ebisE4";
const CHAT_ID = "8801075372"; // Твой ID (Слава)

// Данные ответов
const userAnswers = {
    q1: "",
    q2: "",
    q3: "",
    q4: ""
};

function nextPage(pageNum) {
    document.getElementById('page' + currentPage).classList.remove('active');
    currentPage = pageNum;
    document.getElementById('page' + currentPage).classList.add('active');
}

// Вопрос 1
function handleAns(qNum, answer) {
    if (qNum === 1) {
        userAnswers.q1 = answer;
        const ans1Text = document.getElementById('ans1-text');
        if (answer === 'Да я красотка') {
            ans1Text.innerHTML = "Конечно так, это же очевидно! 😉";
        } else if (answer === 'Я няшная') {
            ans1Text.innerHTML = "Да, ты очень няшная и милая! 🥰";
        } else if (answer === 'Нет') {
            ans1Text.innerHTML = "Неправда! Вообще-то ты очень красивая и милая! 😘";
        }
        nextPage(9);
    }
}

// Вопрос 2 (Ввод текста)
function submitTextAns() {
    const text = document.getElementById('whoAmI').value;
    if (text.trim() === "") {
        alert("Напиши хоть что-нибудь 🙈");
        return;
    }
    userAnswers.q2 = text;
    nextPage(10);
}

// Вопрос 3 (Доверие)
function handleTrust(isYes) {
    userAnswers.q3 = isYes ? "Да" : "Нет";
    const trustText = document.getElementById('trust-text');
    
    if (isYes) {
        trustText.innerHTML = "Спасибо, солнышко! ❤️";
    } else {
        trustText.innerHTML = ""; // Если нет, просто переходим к след вопросу
    }
    
    // Генерируем 10 кнопок "Нет" для 4 вопроса
    const loveBtns = document.getElementById('love-buttons');
    loveBtns.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'ans-btn';
        btn.innerText = 'Нет';
        btn.onclick = function() {
            userAnswers.q4 = "Нет";
            document.getElementById('final-love-text').innerHTML = "А я тебя тоже люблю! 😘❤️";
            nextPage(12);
        };
        loveBtns.appendChild(btn);
    }
    
    nextPage(11);
}

// Отправка в Telegram (вызывается после прохождения)
async function sendResultsToTelegram() {
    const text = `
🔔 **Новые ответы от Даны!**
    
1. Красивая? -> ${userAnswers.q1}
2. Кто я для тебя? -> ${userAnswers.q2}
3. Доверяешь? -> ${userAnswers.q3}
4. Любишь? -> ${userAnswers.q4}
    `;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'Markdown' })
        });
    } catch (e) {
        console.log("Ошибка отправки в ТГ", e);
    }
}

// Обновляем last page logic
// Перехватываем переход на 12 страницу чтобы отправить результаты
const originalNextPage = nextPage;
nextPage = function(pageNum) {
    if (pageNum === 12) {
        sendResultsToTelegram(); // Вызываем отправку
    }
    originalNextPage(pageNum);
};
