// ==================== CAROUSEL NAVIGATION SYSTEM ====================
// Atención al Ciudadano - Enhanced Navigation with Swipe Support

class CarouselNavigation {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.dots = [];
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        // Get all slides
        this.slides = Array.from(document.querySelectorAll('.slide'));

        // Create progress dots
        this.createProgressDots();

        // Setup event listeners
        this.setupEventListeners();

        // Initialize first slide
        this.showSlide(0);

        // Update header
        this.updateHeader();
    }

    createProgressDots() {
        const progressContainer = document.querySelector('.progress-indicator');
        if (!progressContainer) {
            // Create progress indicator if it doesn't exist
            const header = document.querySelector('.module-header');
            const progressDiv = document.createElement('div');
            progressDiv.className = 'progress-indicator';
            header.appendChild(progressDiv);
        }

        const container = document.querySelector('.progress-indicator');
        container.innerHTML = ''; // Clear existing dots

        // Create a dot for each slide
        this.slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            container.appendChild(dot);
            this.dots.push(dot);
        });
    }

    setupEventListeners() {
        // Touch events for swipe
        const container = document.querySelector('.container');
        if (container) {
            container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
            container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    showSlide(index) {
        if (this.isTransitioning) return;
        if (index < 0 || index >= this.slides.length) return;

        this.isTransitioning = true;

        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });

        // Add active class to current slide
        this.slides[index].classList.add('active');

        // Mark previous slides
        for (let i = 0; i < index; i++) {
            this.slides[i].classList.add('prev');
        }

        // Update dots
        this.updateDots(index);

        // Update current slide index
        this.currentSlide = index;

        // Update header indicator
        this.updateHeader();

        // Allow transitions after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    updateDots(activeIndex) {
        this.dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index === activeIndex) {
                dot.classList.add('active');
            } else if (index < activeIndex) {
                dot.classList.add('completed');
            }
        });
    }

    updateHeader() {
        const indicator = document.getElementById('slide-indicator');
        if (indicator) {
            const slideNames = [
                'Inicio',
                'Atributos Admin',
                'Protocolo Admin',
                'Canales Admin',
                'Evaluación Admin',
                'Atributos Operativo',
                'Protocolo Operativo',
                'Canales Operativo',
                'Presentación General',
                'Identificación',
                'Voceros'
            ];
            indicator.textContent = slideNames[this.currentSlide] || `Slide ${this.currentSlide + 1}`;
        }

        // Add active class to header for progress bar animation
        const header = document.querySelector('.module-header');
        if (header) {
            header.classList.add('active');
        }
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    // Touch/Swipe handlers
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchMove(e) {
        this.touchEndX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        const swipeThreshold = 50; // minimum distance for swipe
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.prevSlide();
            }
        }
    }
}

// ==================== NAVIGATION FUNCTIONS ====================
// Global functions for button onClick handlers

let carousel;

function nextSlide(currentSlideId) {
    if (carousel) {
        carousel.nextSlide();
    }
}

function prevSlide(currentSlideId) {
    if (carousel) {
        carousel.prevSlide();
    }
}

function startPath(path) {
    if (carousel) {
        if (path === 'admin') {
            carousel.goToSlide(1); // Go to admin path
        } else if (path === 'operative') {
            carousel.goToSlide(5); // Go to operative path
        }
    }
}

// ==================== QUIZ FUNCTIONALITY ====================
class QuizManager {
    constructor() {
        this.answers = {};
        this.currentQuiz = null;
    }

    selectOption(quizId, questionId, optionIndex, element) {
        // Remove selected class from siblings
        const siblings = element.parentElement.querySelectorAll('.quiz-option');
        siblings.forEach(opt => opt.classList.remove('selected'));

        // Add selected class to clicked option
        element.classList.add('selected');

        // Store answer
        if (!this.answers[quizId]) {
            this.answers[quizId] = {};
        }
        this.answers[quizId][questionId] = optionIndex;
    }

    checkAnswers(quizId, correctAnswers) {
        const userAnswers = this.answers[quizId] || {};
        let correct = 0;
        let total = Object.keys(correctAnswers).length;

        // Check each question
        Object.keys(correctAnswers).forEach(questionId => {
            const correctAnswer = correctAnswers[questionId];
            const userAnswer = userAnswers[questionId];

            const options = document.querySelectorAll(`[data-quiz="${quizId}"][data-question="${questionId}"]`);

            options.forEach((option, index) => {
                option.onclick = null; // Disable further clicks

                if (index === correctAnswer) {
                    option.classList.add('correct');
                    if (userAnswer === index) {
                        correct++;
                    }
                } else if (userAnswer === index) {
                    option.classList.add('incorrect');
                }
            });
        });

        const percentage = (correct / total) * 100;
        return { correct, total, percentage };
    }
}

const quizManager = new QuizManager();

function selectQuizOption(quizId, questionId, optionIndex, element) {
    quizManager.selectOption(quizId, questionId, optionIndex, element);
}

function checkQuiz(quizId, correctAnswers) {
    const result = quizManager.checkAnswers(quizId, correctAnswers);

    // Show result message
    const resultDiv = document.getElementById(`result-${quizId}`);
    if (resultDiv) {
        if (result.percentage >= 70) {
            resultDiv.innerHTML = `
                <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); 
                            color: white; padding: 30px; border-radius: 20px; text-align: center; 
                            box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);">
                    <div style="font-size: 4em; margin-bottom: 20px;">🎉✅🏆</div>
                    <h2 style="margin-bottom: 15px;">¡Excelente!</h2>
                    <p style="font-size: 1.5em;">Has aprobado con ${result.percentage.toFixed(0)}%</p>
                    <p>${result.correct} de ${result.total} respuestas correctas</p>
                </div>
            `;
            celebrate();
        } else {
            resultDiv.innerHTML = `
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                            color: white; padding: 30px; border-radius: 20px; text-align: center;
                            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">
                    <div style="font-size: 4em; margin-bottom: 20px;">📚💪</div>
                    <h2 style="margin-bottom: 15px;">¡Sigue Practicando!</h2>
                    <p style="font-size: 1.5em;">${result.percentage.toFixed(0)}% - Necesitas 70%</p>
                    <p>${result.correct} de ${result.total} respuestas correctas</p>
                </div>
            `;
        }
    }

    return result;
}

// ==================== PUZZLE FUNCTIONALITY ====================
class PuzzleGame {
    constructor() {
        this.selected = [];
        this.matches = [];
    }

    selectItem(channel, definition, element) {
        // Check if already matched
        if (this.matches.includes(channel)) return;

        // If item already selected, deselect it
        if (this.selected.length > 0 &&
            this.selected[0].element === element) {
            element.classList.remove('selected');
            this.selected = [];
            return;
        }

        // If we have 2 items selected, reset
        if (this.selected.length === 2) {
            this.selected.forEach(item => {
                item.element.classList.remove('selected');
            });
            this.selected = [];
        }

        // Add to selection
        element.classList.add('selected');
        this.selected.push({ channel, definition, element });

        // Check for match
        if (this.selected.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const [item1, item2] = this.selected;

        // Check if they match (one is channel, one is definition, same value)
        if (item1.channel === item2.definition ||
            item1.definition === item2.channel) {
            // Match!
            setTimeout(() => {
                item1.element.classList.remove('selected');
                item2.element.classList.remove('selected');
                item1.element.classList.add('matched');
                item2.element.classList.add('matched');

                this.matches.push(item1.channel || item1.definition);
                this.selected = [];

                // Check if all matched
                if (this.matches.length === 8) { // Assuming 8 pairs
                    celebrate();
                    setTimeout(() => {
                        alert('🎉 ¡Completaste el puzzle!');
                    }, 500);
                }
            }, 600);
        } else {
            // No match - deselect after delay
            setTimeout(() => {
                item1.element.classList.remove('selected');
                item2.element.classList.remove('selected');
                this.selected = [];
            }, 1000);
        }
    }
}

const puzzleGame = new PuzzleGame();

function selectPuzzleItem(channel, definition, element) {
    puzzleGame.selectItem(channel, definition, element);
}

// ==================== CELEBRATION EFFECTS ====================
function celebrate() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(celebration);

    const colors = ['#2563eb', '#3b82f6', '#22c55e', '#10b981', '#fbbf24', '#f59e0b'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: 50%;
            animation: fall ${2 + Math.random() * 3}s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        celebration.appendChild(confetti);
    }

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Remove after animation
    setTimeout(() => {
        celebration.remove();
        style.remove();
    }, 5000);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize carousel
    carousel = new CarouselNavigation();

    console.log('✅ Carousel Navigation initialized');
    console.log('📱 Swipe gestures enabled');
    console.log('⌨️ Keyboard navigation enabled (← →)');
});
