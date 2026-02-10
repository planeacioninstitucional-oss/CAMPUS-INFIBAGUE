// ============================================
// MÓDULO DE INDUCCIÓN - JavaScript
// ============================================

// Estado Global
let currentSlide = 0;
const totalSlides = 6;
let bubbleVisible = false;
let selectedRole = '';
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let answered = false;
let questions = [];
let maxScore = 0;
let passingScore = 0;
let userName = 'Servidor INFIBAGUÉ'; // TODO: Obtener del sistema de autenticación

// Preguntas por Perfil
const questionsAdministrativo = [
    {
        type: "Personal Administrativo",
        question: "¿De conformidad con artículo 14 de la Ley 1755 de 2015, cuál es el término para dar respuesta a una petición?",
        options: [
            { letter: "A", text: "10 días hábiles", correct: false },
            { letter: "B", text: "15 días calendario", correct: false },
            { letter: "C", text: "10 días calendario", correct: false },
            { letter: "D", text: "15 días hábiles", correct: true }
        ],
        feedback: "Correcto. Según el artículo 14 de la Ley 1755 de 2015, toda petición debe resolverse dentro de los 15 días hábiles siguientes a su recepción."
    },
    {
        type: "Personal Administrativo",
        question: "Usted necesita redactar la respuesta a una solicitud de información de la Procuraduría General de la Nación. Seleccione quién es el responsable de firmar la respuesta:",
        options: [
            { letter: "A", text: "Profesional Universitario Líder del Proceso", correct: false },
            { letter: "B", text: "Director o Jefe Asesor de la Dependencia", correct: false },
            { letter: "C", text: "Gerente General", correct: true },
            { letter: "D", text: "Yo que redacté la respuesta", correct: false }
        ],
        feedback: "Correcto. Las comunicaciones a entes de control deben ser firmadas exclusivamente por el Representante Legal (Gerente General)."
    },
    {
        type: "Situación Laboral",
        question: "Llega un periodista a su oficina y le pide declaraciones sobre los servicios que presta INFIBAGUÉ. ¿Usted qué haría?",
        options: [
            { letter: "A", text: "Doy declaraciones sobre lo que está preguntando", correct: false },
            { letter: "B", text: "Le digo que me llame después porque estoy trabajando", correct: false },
            { letter: "C", text: "Hablo mal de la entidad", correct: false },
            { letter: "D", text: "Informo a la alta gerencia o a la oficina de comunicaciones", correct: true }
        ],
        feedback: "Correcto. Siempre debes remitir a los periodistas a la Oficina de Comunicaciones o a la alta gerencia. No des declaraciones por tu cuenta."
    },
    {
        type: "Manual de Imagen",
        question: "Por instrucción de su superior debe mandar a hacer una camisa institucional. Entonces usted:",
        options: [
            { letter: "A", text: "Elijo mi color favorito", correct: false },
            { letter: "B", text: "Elijo una de color de moda", correct: false },
            { letter: "C", text: "Elijo una que cumpla con el manual de imagen", correct: true }
        ],
        feedback: "Correcto. Siempre debes seguir el Manual de Imagen institucional para mantener la identidad corporativa."
    },
    {
        type: "Conocimientos Generales",
        question: "¿Cuál es el horario de atención al ciudadano de lunes a jueves?",
        options: [
            { letter: "A", text: "7:00 AM - 5:00 PM jornada continua", correct: false },
            { letter: "B", text: "7:00 AM - 12:00 PM y 2:00 PM - 5:00 PM", correct: true },
            { letter: "C", text: "8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM", correct: false },
            { letter: "D", text: "7:00 AM - 3:00 PM jornada continua", correct: false }
        ],
        feedback: "Correcto. El horario es de 7:00 AM a 12:00 PM y de 2:00 PM a 5:00 PM de lunes a jueves. Los viernes es jornada continua hasta las 3:00 PM."
    }
];

const questionsOperativo = [
    {
        type: "Personal Operativo",
        question: "Usted se encuentra realizando su labor y un usuario se acerca a realizar una consulta sobre el servicio que presta INFIBAGUÉ. Usted debe:",
        options: [
            { letter: "A", text: "Ignorar a la persona y seguir con su labor", correct: false },
            { letter: "B", text: "Decirle al compañero que esté libre que atienda al usuario", correct: false },
            { letter: "C", text: "Saludar al usuario, escuchar con atención sin interrumpir e indicar los canales de atención", correct: true },
            { letter: "D", text: "Informar al usuario que no tiene conocimiento de la información", correct: false }
        ],
        feedback: "Correcto. Siempre debes ser cortés, escuchar atentamente y dirigir al usuario a los canales oficiales de atención."
    },
    {
        type: "Situación en Campo",
        question: "Usted se encuentra realizando labores en campo y se acerca un periodista que le pide declaraciones sobre lo sucedido. ¿Usted qué haría?",
        options: [
            { letter: "A", text: "Le cuento al periodista lo que está preguntando", correct: false },
            { letter: "B", text: "Le digo que me llame después porque estoy trabajando", correct: false },
            { letter: "C", text: "Hablo mal de la entidad", correct: false },
            { letter: "D", text: "Informo a mi superior inmediato o a la alta gerencia", correct: true }
        ],
        feedback: "Correcto. Nunca des declaraciones a la prensa sin autorización. Siempre reporta a tu superior o gerencia."
    },
    {
        type: "Manual de Imagen",
        question: "Por instrucción de su superior debe mandar a hacer una camisa institucional. Entonces usted:",
        options: [
            { letter: "A", text: "Elijo mi color favorito", correct: false },
            { letter: "B", text: "Elijo una de color de moda", correct: false },
            { letter: "C", text: "Elijo una que cumpla con el manual de imagen", correct: true }
        ],
        feedback: "Correcto. Siempre debes seguir el Manual de Imagen institucional para mantener la identidad corporativa."
    }
];

// ============================================
// INICIALIZACIÓN
// ============================================

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 1500);

    // Show Luminito bubble after 3 seconds
    setTimeout(() => {
        showLuminitoBubble();
    }, 3000);
});

// ============================================
// LUMINITO HELPER
// ============================================

function toggleLuminitoBubble() {
    bubbleVisible = !bubbleVisible;
    const bubble = document.getElementById('luminitoBubble');
    if (bubbleVisible) {
        bubble.classList.add('show');
    } else {
        bubble.classList.remove('show');
    }
}

function showLuminitoBubble() {
    bubbleVisible = true;
    document.getElementById('luminitoBubble').classList.add('show');
    setTimeout(() => {
        bubbleVisible = false;
        document.getElementById('luminitoBubble').classList.remove('show');
    }, 5000);
}

// ============================================
// SELECCIÓN DE PERFIL
// ============================================

function seleccionarPerfil(perfil) {
    selectedRole = perfil;

    if (perfil === 'administrativo') {
        questions = questionsAdministrativo;
        maxScore = 500;
        passingScore = 375; // 75% de 500
    } else {
        questions = questionsOperativo;
        maxScore = 300;
        passingScore = 225; // 75% de 300
    }

    // Ocultar intro y mostrar primer slide
    document.getElementById('introScreen').classList.remove('active');
    document.getElementById('slide1').classList.add('active');

    updateProgress();
}

// ============================================
// NAVEGACIÓN DE SLIDES
// ============================================

function nextSlide() {
    const currentSlideEl = document.getElementById('slide' + (currentSlide + 1));
    currentSlideEl.classList.remove('active');

    currentSlide++;

    if (currentSlide < totalSlides) {
        const nextSlideEl = document.getElementById('slide' + (currentSlide + 1));
        nextSlideEl.classList.add('active');
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function previousSlide() {
    const currentSlideEl = document.getElementById('slide' + (currentSlide + 1));
    currentSlideEl.classList.remove('active');

    currentSlide--;

    const prevSlideEl = document.getElementById('slide' + (currentSlide + 1));
    prevSlideEl.classList.add('active');
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    // Actualizar botones de navegación
    updateNavigationButtons();
}

function updateNavigationButtons() {
    // Actualizar botón anterior en todos los slides
    document.querySelectorAll('.navigation .btn-nav:first-child').forEach((btn, index) => {
        if (currentSlide === 0) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    });
}

// ============================================
// INTERACTIVIDAD DE TARJETAS
// ============================================

function revealCard(card) {
    const detail = card.querySelector('.card-detail');
    const indicator = card.querySelector('.expand-indicator');

    if (detail.classList.contains('show')) {
        detail.classList.remove('show');
        indicator.textContent = '+';
        card.classList.remove('revealed');
    } else {
        detail.classList.add('show');
        indicator.textContent = '−';
        card.classList.add('revealed');
    }
}

function toggleStat(stat) {
    stat.classList.toggle('expanded');
}

function highlightTimeline(item) {
    // Remove highlight from all items
    document.querySelectorAll('.timeline-item-interactive').forEach(el => {
        el.style.background = '';
    });
    // Add highlight to clicked item
    item.style.background = 'var(--color-gray-50)';
}

// ============================================
// COMPLETAR CONTENIDO E IR A EVALUACIÓN
// ============================================

function completeContent() {
    // Ocultar último slide
    document.getElementById('slide6').classList.remove('active');

    // Mostrar screen de evaluación
    document.getElementById('quizScreen').classList.add('active');

    // Configurar evaluación según perfil
    const subtitle = selectedRole === 'administrativo' ? 'Personal Administrativo' : 'Personal Operativo';
    document.getElementById('quizSubtitle').textContent = subtitle;
    document.getElementById('totalQuestions').textContent = questions.length;

    // Cargar primera pregunta
    loadQuestion();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Progreso al 100% en el header
    document.getElementById('progressBar').style.width = '100%';
}

// ============================================
// EVALUACIÓN
// ============================================

function loadQuestion() {
    answered = false;
    const container = document.getElementById('questionsContainer');
    const question = questions[currentQuestionIndex];

    container.innerHTML = `
        <div class="question-container active">
            <div class="question-type">${question.type}</div>
            <div class="question-text">${question.question}</div>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <div class="option" onclick="selectOption(${index})">
                        <div class="option-letter">${option.letter}</div>
                        <div class="option-text">${option.text}</div>
                        <div class="option-icon"></div>
                    </div>
                `).join('')}
            </div>
            <div class="feedback-container" id="feedback"></div>
        </div>
    `;

    updateQuizStats();
}

function selectOption(index) {
    if (answered) return;

    answered = true;
    const question = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    const feedback = document.getElementById('feedback');
    const pointsPerQuestion = maxScore / questions.length;

    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (question.options[i].correct) {
            opt.classList.add('correct');
            opt.querySelector('.option-icon').textContent = '✓';
        }
    });

    if (question.options[index].correct) {
        score += pointsPerQuestion;
        correctAnswers++;
        feedback.className = 'feedback-container success show';
        feedback.innerHTML = `
            <div class="feedback-title">
                <span>✓</span> ¡Excelente!
            </div>
            <div class="feedback-text">${question.feedback}</div>
        `;
        createConfetti();
    } else {
        options[index].classList.add('incorrect');
        options[index].querySelector('.option-icon').textContent = '✗';
        feedback.className = 'feedback-container error show';
        feedback.innerHTML = `
            <div class="feedback-title">
                <span>✗</span> Incorrecto
            </div>
            <div class="feedback-text">${question.feedback}</div>
        `;
    }

    updateQuizStats();

    setTimeout(() => {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'btn-container';
        btnContainer.innerHTML = `
            <button class="btn-quiz btn-quiz-primary" onclick="nextQuestion()">
                ${currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta →' : 'Ver Resultados 🎉'}
            </button>
        `;
        document.querySelector('.question-container.active').appendChild(btnContainer);
    }, 500);
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function updateQuizStats() {
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('score').textContent = Math.round(score);
    document.getElementById('correct').textContent = correctAnswers;

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.querySelector('.quiz-progress-bar').style.width = progress + '%';
    document.querySelector('.quiz-progress-bar').style.background = 'linear-gradient(90deg, var(--color-success) 0%, #059669 100%)';
}

function showResults() {
    const incorrectAnswers = questions.length - correctAnswers;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= passingScore;

    document.querySelector('.quiz-stats-bar').style.display = 'none';
    document.querySelector('.quiz-progress-bar-container').style.display = 'none';
    document.querySelector('.question-container').style.display = 'none';
    document.getElementById('resultsScreen').classList.add('active');

    document.getElementById('resultsIcon').textContent = passed ? '🏆' : '📚';
    document.getElementById('resultsTitle').textContent = passed ? '¡Felicitaciones! Has Aprobado' : 'No Aprobaste Esta Vez';
    document.getElementById('resultsTitle').className = 'results-title ' + (passed ? 'passed' : 'failed');
    document.getElementById('finalScore').textContent = Math.round(score) + ' / ' + maxScore + ' pts';
    document.getElementById('finalScore').style.color = passed ? 'var(--color-success)' : 'var(--color-error)';

    const message = passed
        ? `Has aprobado el cuestionario exitosamente con ${percentage}% de aciertos. ¡Excelente trabajo! Estás listo para aplicar estos conocimientos en tu labor diaria. Ahora puedes descargar tu certificado de aprobación.`
        : `Has obtenido ${percentage}% de aciertos, pero necesitas al menos 75% para aprobar (${passingScore} puntos). Te recomendamos revisar nuevamente el material de inducción y volver a intentarlo. ¡No te rindas!`;

    document.getElementById('resultsMessage').textContent = message;
    document.getElementById('totalCorrect').textContent = correctAnswers;
    document.getElementById('totalIncorrect').textContent = incorrectAnswers;
    document.getElementById('percentage').textContent = percentage + '%';

    // Botones según resultado
    const buttonsContainer = document.getElementById('resultsButtons');
    if (passed) {
        buttonsContainer.innerHTML = `
            <button class="btn-quiz btn-quiz-secondary" onclick="reiniciarInduccion()">
                🔄 Volver a Ver Contenido
            </button>
            <button class="btn-quiz btn-quiz-primary" onclick="notificarModuloCompletado()">
                ✅ Continuar al Siguiente Módulo
            </button>
        `;
        createCelebration();

        // Guardar en localStorage
        guardarProgreso(passed, percentage, score);
    } else {
        buttonsContainer.innerHTML = `
            <button class="btn-quiz btn-quiz-primary" onclick="reiniciarInduccion()">
                📚 Volver a Ver Contenido
            </button>
        `;
    }
}

// ============================================
// REINICIAR INDUCCIÓN
// ============================================

function reiniciarInduccion() {
    // Reset variables
    currentSlide = 0;
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    answered = false;

    // Ocultar pantalla de resultados y quiz
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('quizScreen').classList.remove('active');

    // Mostrar primer slide
    document.getElementById('slide1').classList.add('active');

    // Reset progress
    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// COMUNICACIÓN CON PARENT WINDOW
// ============================================

function notificarModuloCompletado() {
    const percentage = Math.round((correctAnswers / questions.length) * 100);

    // Enviar mensaje al parent window (curso-detalle.html)
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'MODULO_INDUCCION_COMPLETADO',
            data: {
                aprobado: true,
                puntuacion: Math.round(score),
                porcentaje: percentage,
                perfil: selectedRole,
                fecha: new Date().toISOString()
            }
        }, '*');
    } else {
        // Si no está en iframe, mostrar mensaje
        alert('Módulo completado! Redirigiendo al siguiente módulo...');
        // Redirigir al dashboard
        window.location.href = '../funcionario/dashboard.html';
    }
}

// ============================================
// CONFETTI Y CELEBRACIÓN
// ============================================

function createConfetti() {
    const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

function createCelebration() {
    const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 15 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }
}

// ============================================
// GUARDAR PROGRESO (LocalStorage)
// ============================================

function guardarProgreso(aprobado, porcentaje, puntuacion) {
    const progreso = {
        modulo: 'atencion-ciudadano',
        perfil: selectedRole,
        aprobado: aprobado,
        porcentaje: porcentaje,
        puntuacion: puntuacion,
        fecha: new Date().toISOString(),
        usuario: userName
    };

    // Obtener progresos existentes
    let progresos = JSON.parse(localStorage.getItem('induccionINFIBAGUE') || '[]');

    // Agregar nuevo progreso
    progresos.push(progreso);

    // Guardar
    localStorage.setItem('induccionINFIBAGUE', JSON.stringify(progresos));

    console.log('Progreso guardado:', progreso);
}

// ============================================
// UTILIDADES
// ============================================

function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}
