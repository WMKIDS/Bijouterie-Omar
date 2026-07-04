const canvas = document.getElementById('gold-dust');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Simple magnetic effect with cursor
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
            this.x += dx * 0.01;
            this.y += dy * 0.01;
        }

        // Warp edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 75; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

initParticles();
animateParticles();