// Global variables
let currentStep = 0;
const steps = ['hero', 'gifts', 'teddy', 'message', 'photo', 'final'];
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let hearts = [];
let isCelebrating = false;

// Initialize canvas
function initCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

// Create floating hearts background
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = ['💖', '💕', '💗', '💝', '🌸'][Math.floor(Math.random() * 5)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 6 + 's';
            heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
            heartsContainer.appendChild(heart);
        }, i * 300);
    }
}

// Confetti system
class ConfettiParticle {
    constructor(x, y, vx, vy, color, size, rotation, rotationSpeed) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.rotation = rotation;
        this.rotationSpeed = rotationSpeed;
        this.opacity = 1;
        this.gravity = 0.05;
        this.friction = 0.98;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.005;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

function createConfettiBurst(x, y, count = 100) {
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed * 0.5;
        const size = Math.random() * 6 + 3;
        const rotation = Math.random() * 360;
        const rotationSpeed = (Math.random() - 0.5) * 10;
        
        const colors = ['#ff6b6b', '#4ecdc4', '#feca57', '#ff9a9e', '#45b7d1', '#ffd93d'];
        confettiParticles.push(new ConfettiParticle(
            x, y, vx, vy, 
            colors[Math.floor(Math.random() * colors.length)],
            size, rotation, rotationSpeed
        ));
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        confettiParticles[i].update();
        confettiParticles[i].draw();
        
        if (confettiParticles[i].opacity <= 0 || 
            confettiParticles[i].y > confettiCanvas.height) {
            confettiParticles.splice(i, 1);
        }
    }
    
    if (confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// Navigation between sections
function showStep(stepIndex) {
    // Hide all sections
    document.querySelectorAll('.hero, .gifts-section, .message-section, .photo-frame, .final-celebration').forEach(section => {
        section.classList.add('hidden');
    });

    // Show current step
    if (stepIndex === 0) {
        document.querySelector('.hero').classList.remove('hidden');
    } else if (stepIndex === 1) {
        document.getElementById('giftsSection').classList.remove('hidden');
    } else if (stepIndex === 2) {
        document.getElementById('messageSection').classList.remove('hidden');
    } else if (stepIndex === 3) {
        document.getElementById('photoFrame').classList.remove('hidden');
    } else if (stepIndex === 4) {
        document.getElementById('finalSection').classList.remove('hidden');
    }
}

// Gift box interactions
function initGiftBoxes() {
    const giftBoxes = document.querySelectorAll('.gift-box');
    
    giftBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const gift = this.querySelector('.gift');
            const giftNum = this.dataset.gift;
            
            // Flip animation
            this.classList.add('flipped');
            
            // Gift-specific reactions
            setTimeout(() => {
                createConfettiBurst(this.offsetLeft + this.offsetWidth/2 + window.scrollX, 
                                 this.offsetTop + this.offsetHeight/2 + window.scrollY, 50);
                
                // Shake effect
                gift.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    gift.style.animation = '';
                    this.classList.remove('flipped');
                }, 1000);
                
                // Auto advance after last gift
                if (giftNum === '4') {
                    setTimeout(() => nextStep(), 1500);
                }
            }, 300);
        });
    });
}

// Step navigation
function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
        
        // Special effects for transitions
        if (currentStep === 1) {
            createConfettiBurst(window.innerWidth/2, 200, 80);
        } else if (currentStep === 4) {
            isCelebrating = true;
            startFireworks();
        }
    }
}

// Fireworks effect
function startFireworks() {
    const fireworksInterval = setInterval(() => {
        if (!isCelebrating) {
            clearInterval(fireworksInterval);
            return;
        }
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.3;
        createConfettiBurst(x, y, 150);
    }, 800);
    
    setTimeout(() => {
        clearInterval(fireworksInterval);
    }, 10000);
}

// Wish button
document.getElementById('wishBtn').addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-star"></i> ✨ Wishing... ✨';
    this.style.background = 'linear-gradient(45deg, #ffd700, #ff6b6b)';
    
    // Massive confetti explosion
    createConfettiBurst(window.innerWidth/2, window.innerHeight/2, 300);
    
    // Screen shake
    document.body.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
    
    // Continuous celebration
    setInterval(() => {
        createConfettiBurst(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight * 0.5,
            30
        );
    }, 300);
});

// Event Listeners
document.getElementById('startBtn').addEventListener('click', function() {
    this.style.display = 'none';
    nextStep();
});

// Window resize handler
window.addEventListener('resize', initCanvas);

// Mouse move parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const cake = document.querySelector('.cake');
    if (cake) {
        cake.style.transform = `translate(${mouseX * 10 - 5}px, ${mouseY * 10 - 5}px)`;
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        nextStep();
    }
});

// Touch support for mobile
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = confettiCanvas.getBoundingClientRect();
    createConfettiBurst(touch.clientX, touch.clientY, 50);
}, { passive: true });

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    createFloatingHearts();
    initGiftBoxes();
    
    // Start confetti animation loop
    setInterval(animateConfetti, 16);
    
    // Flame flicker restart
    setInterval(() => {
        const flame = document.querySelector('.flame');
        if (flame) {
            flame.style.animation = 'none';
            flame.offsetHeight; // Trigger reflow
            flame.style.animation = 'flicker 2s ease-in-out infinite alternate';
        }
    }, 2000);
    
    // Auto-advance demo (remove in production)
    // setTimeout(() => nextStep(), 3000);
});

// Add shake animation to CSS via JS (for dynamic addition)
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);