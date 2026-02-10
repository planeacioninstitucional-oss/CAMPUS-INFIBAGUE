// Additional JavaScript functions for Gestión Humana module

function showValue(value) {
    const messages = {
        honestidad: '🤝 HONESTIDAD: Actuar siempre con verdad y transparencia.',
        respeto: '🙏 RESPETO: Reconocer y valorar a los demás.',
        justicia: '⚖️ JUSTICIA: Dar a cada uno lo que corresponde.',
        diligencia: '⚡ DILIGENCIA: Actuar con prontitud y eficacia.',
        compromiso: '💪 COMPROMISO: Cumplir con responsabilidad.'
    };
    alert(messages[value]);
    if (typeof updateScore === 'function') updateScore(10);
}

const memoryCards = [
    { id: 1, emoji: '🏢', text: 'INFIBAGUÉ' },
    { id: 2, emoji: '💡', text: 'Alumbrado' },
    { id: 3, emoji: '🏪', text: 'Plazas' },
    { id: 4, emoji: '🌳', text: 'Parques' },
    { id: 5, emoji: '🤝', text: 'Honestidad' },
    { id: 6, emoji: '🙏', text: 'Respeto' },
    { id: 7, emoji: '⚖️', text: 'Justicia' },
    { id: 8, emoji: '⚡', text: 'Diligencia' }
];

let gameState = { cards: [], flipped: [], matched: [], moves: 0, matchCount: 0 };

function initMemoryGame() {
    const doubled = [...memoryCards, ...memoryCards]
        .sort(() => Math.random() - 0.5)
        .map((card, index) => ({ ...card, uniqueId: index }));
    gameState = { cards: doubled, flipped: [], matched: [], moves: 0, matchCount: 0 };
    renderMemoryGame();
    updateGameStats();
}

function renderMemoryGame() {
    const gameDiv = document.getElementById('memoryGame');
    if (!gameDiv) return;
    gameDiv.innerHTML = '';
    gameState.cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memory-card';
        cardDiv.setAttribute('role', 'button');
        cardDiv.setAttribute('aria-label', 'Tarjeta de memoria');
        if (gameState.matched.includes(card.uniqueId)) {
            cardDiv.classList.add('matched');
            cardDiv.innerHTML = card.emoji;
        } else if (gameState.flipped.includes(card.uniqueId)) {
            cardDiv.classList.add('flipped');
            cardDiv.innerHTML = card.emoji;
        } else {
            cardDiv.innerHTML = '❓';
        }
        // Soporte para click y touch
        cardDiv.addEventListener('click', (e) => {
            e.preventDefault();
            flipCard(card.uniqueId);
        });
        cardDiv.addEventListener('touchend', (e) => {
            e.preventDefault();
            flipCard(card.uniqueId);
        });
        gameDiv.appendChild(cardDiv);
    });
}

let isProcessing = false;

function flipCard(uniqueId) {
    if (isProcessing || gameState.flipped.length >= 2 || gameState.flipped.includes(uniqueId) || gameState.matched.includes(uniqueId)) return;

    isProcessing = true;
    gameState.flipped.push(uniqueId);
    renderMemoryGame();

    if (gameState.flipped.length === 2) {
        gameState.moves++;
        updateGameStats();
        setTimeout(() => {
            checkMatch();
            isProcessing = false;
        }, 100);
    } else {
        isProcessing = false;
    }
}

function checkMatch() {
    const [id1, id2] = gameState.flipped;
    const card1 = gameState.cards.find(c => c.uniqueId === id1);
    const card2 = gameState.cards.find(c => c.uniqueId === id2);
    setTimeout(() => {
        if (card1.id === card2.id) {
            gameState.matched.push(id1, id2);
            gameState.matchCount++;
            if (typeof updateScore === 'function') updateScore(50);
            celebrate();
            if (gameState.matchCount === memoryCards.length) {
                setTimeout(() => { alert('🎉 ¡Completaste el juego! +100 puntos'); if (typeof updateScore === 'function') updateScore(100); }, 500);
            }
        }
        gameState.flipped = [];
        renderMemoryGame();
        updateGameStats();
    }, 1000);
}

function updateGameStats() {
    const movesEl = document.getElementById('moves');
    const matchesEl = document.getElementById('matches');
    const gameScoreEl = document.getElementById('gameScore');
    if (movesEl) movesEl.textContent = gameState.moves;
    if (matchesEl) matchesEl.textContent = gameState.matchCount;
    if (gameScoreEl) gameScoreEl.textContent = gameState.matchCount * 50;
}

const quizData = [
    { question: '1. ¿Cuál es la misión principal de Infibagué?', options: ['Servicios de alumbrado', 'Generador de desarrollo para la comunidad', 'Gestionar parques', 'Administrar plazas'], correct: 1 },
    { question: '2. Valores del Código de Integridad:', options: ['Honestidad, Respeto, Justicia, Diligencia, Compromiso', 'Lealtad, Valentía, Honor', 'Puntualidad, Eficiencia', 'Solidaridad, Amor, Paz'], correct: 0 },
    { question: '3. Funciones de Infibagué:', options: ['Educación, Salud, Transporte', 'Alumbrado, Plazas, Parques', 'Agua, Luz, Gas', 'Construcción de Vías'], correct: 1 },
    { question: '4. ¿Cuántas Direcciones tiene Infibagué?', options: ['Dos', 'Tres', 'Cuatro', 'Cinco'], correct: 2 },
    { question: '5. Planes de Gestión Humana:', options: ['Marketing y Ventas', 'Bienestar, Capacitación, Estímulos', 'Construcción', 'Financiero'], correct: 1 }
];

let quizAnswers = [];

function initQuiz() {
    const container = document.getElementById('quizQuestions');
    if (!container) return;
    container.innerHTML = '';
    quizAnswers = new Array(quizData.length).fill(null);
    quizData.forEach((q, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = q.question;
        questionDiv.appendChild(questionTitle);
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        q.options.forEach((option, oIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = option;
            optionDiv.setAttribute('role', 'button');
            optionDiv.setAttribute('tabindex', '0');
            optionDiv.style.cursor = 'pointer';
            optionDiv.style.touchAction = 'manipulation';

            const handleSelect = (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectOption(qIndex, oIndex, optionDiv);
            };

            optionDiv.addEventListener('click', handleSelect);
            optionDiv.addEventListener('touchend', handleSelect);
            optionDiv.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectOption(qIndex, oIndex, optionDiv);
                }
            });

            optionsDiv.appendChild(optionDiv);
        });
        questionDiv.appendChild(optionsDiv);
        container.appendChild(questionDiv);
    });
}

function selectOption(qIndex, oIndex, element) {
    const options = element.parentElement.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    quizAnswers[qIndex] = oIndex;
    const answered = quizAnswers.filter(a => a !== null).length;
    const percentage = (answered / quizData.length) * 100;
    const progressFill = document.getElementById('quizProgress');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        progressFill.textContent = Math.round(percentage) + '%';
    }
}

function checkQuiz() {
    if (quizAnswers.includes(null)) { alert('⚠️ Por favor responde todas las preguntas'); return; }
    let correct = 0;
    const questions = document.querySelectorAll('.question');
    quizData.forEach((q, qIndex) => {
        const optionDivs = questions[qIndex].querySelectorAll('.option');
        optionDivs.forEach((div, oIndex) => {
            div.onclick = null;
            if (oIndex === q.correct) div.classList.add('correct');
            if (quizAnswers[qIndex] === oIndex && oIndex !== q.correct) div.classList.add('wrong');
        });
        if (quizAnswers[qIndex] === q.correct) correct++;
    });
    const percentage = (correct / quizData.length) * 100;
    if (typeof nextSlide === 'function') nextSlide(10);
    showResults(correct, percentage);
}

function showResults(correct, percentage) {
    const resultDiv = document.getElementById('quizResult');
    const titleDiv = document.getElementById('result-title');
    const btnRetry = document.getElementById('btn-retry');
    const btnFinish = document.getElementById('btn-finish');
    if (!resultDiv || !titleDiv) return;

    if (percentage >= 70) {
        titleDiv.textContent = '¡Felicitaciones! 🎉';
        resultDiv.className = 'result-message result-success';
        resultDiv.innerHTML = `<div style="font-size: 3em; margin-bottom: 20px;">🏆✅🎉</div><p style="font-size: 1.8em; margin-bottom: 15px;">¡Has aprobado!</p><p>Calificación: ${correct} de ${quizData.length} correctas (${Math.round(percentage)}%)</p><p style="margin-top: 20px; font-size: 1.2em;">✅ Módulo completado</p>`;
        if (typeof updateScore === 'function') updateScore(200);
        bigCelebration();
        if (btnFinish) btnFinish.style.display = 'block';
    } else {
        titleDiv.textContent = 'Necesitas mejorar 📚';
        resultDiv.className = 'result-message result-fail';
        resultDiv.innerHTML = `<div style="font-size: 3em; margin-bottom: 20px;">📚💪</div><p>Calificación: ${correct} de ${quizData.length} correctas (${Math.round(percentage)}%)</p><p style="margin-top: 20px;">Revisa el contenido</p><p><strong>Se requiere 70%</strong></p>`;
        if (typeof updateScore === 'function') updateScore(50);
        if (btnRetry) btnRetry.style.display = 'block';
    }
}

function celebrate() {
    const celebration = document.getElementById('celebration');
    if (!celebration) return;
    const colors = ['#2563eb', '#3b82f6', '#22c55e', '#ffd700'];
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        celebration.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

function bigCelebration() {
    const celebration = document.getElementById('celebration');
    if (!celebration) return;
    const colors = ['#2563eb', '#3b82f6', '#22c55e', '#ffd700'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        celebration.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => { initMemoryGame(); });
