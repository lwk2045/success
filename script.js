// 캔버스 설정
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fireworksCtx = fireworksCanvas.getContext('2d');
const moneyCanvas = document.getElementById('moneyCanvas');
const moneyCtx = moneyCanvas.getContext('2d');

// 캔버스 크기 설정
function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    moneyCanvas.width = window.innerWidth;
    moneyCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 색상 배열
const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#FF4500',
    '#8A2BE2', '#7FFF00', '#FF1493', '#FFD700'
];

// 폭죽 클래스
class Firework {
    constructor() {
        this.reset();
        this.exploded = false;
        this.particles = [];
    }

    reset() {
        this.x = Math.random() * fireworksCanvas.width;
        this.y = fireworksCanvas.height;
        this.targetX = Math.random() * fireworksCanvas.width;
        this.targetY = Math.random() * fireworksCanvas.height * 0.6;
        this.speed = 2;
        this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
        this.particles = [];
    }

    update() {
        if (!this.exploded) {
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            // 목표 위치에 도달하면 폭발
            if (Math.abs(this.x - this.targetX) < 5 && Math.abs(this.y - this.targetY) < 5) {
                this.explode();
            }
        } else {
            // 파티클 업데이트
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            }

            // 모든 파티클이 사라지면 새 폭죽 생성
            if (this.particles.length === 0) {
                this.reset();
            }
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 100; i++) {
            const particle = new Particle(this.x, this.y, this.color);
            this.particles.push(particle);
        }
    }

    draw() {
        if (!this.exploded) {
            fireworksCtx.beginPath();
            fireworksCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            fireworksCtx.fillStyle = this.color;
            fireworksCtx.fill();
        } else {
            // 파티클 그리기
            for (const particle of this.particles) {
                particle.draw();
            }
        }
    }
}

// 파티클 클래스
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.005;
        this.size = Math.random() * 3 + 1;
        this.gravity = 0.05;
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }

    draw() {
        fireworksCtx.save();
        fireworksCtx.globalAlpha = this.alpha;
        fireworksCtx.beginPath();
        fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fireworksCtx.fillStyle = this.color;
        fireworksCtx.fill();
        fireworksCtx.restore();
    }
}

// 돈 클래스
class Money {
    constructor() {
        this.image = new Image();
        this.image.src = this.getRandomMoneyImage();
        this.width = 40;
        this.height = 20;
        this.reset();
    }

    reset() {
        this.x = Math.random() * moneyCanvas.width;
        this.y = -this.height - Math.random() * 100;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 5;
        this.speed = Math.random() * 2 + 1;
        this.swingFactor = Math.random() * 3;
        this.swingOffset = Math.random() * Math.PI * 2;
    }

    getRandomMoneyImage() {
        const moneyImages = [
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwODgwMCIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNmZmZmZmYiPiQxMDA8L3RleHQ+PC9zdmc+',
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwOTkwMCIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNmZmZmZmYiPiQ1MDwvdGV4dD48L3N2Zz4=',
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwNzcwMCIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNmZmZmZmYiPiQyMDwvdGV4dD48L3N2Zz4='
        ];
        return moneyImages[Math.floor(Math.random() * moneyImages.length)];
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        this.x += Math.sin(this.y * 0.03 + this.swingOffset) * this.swingFactor;

        // 화면 밖으로 나가면 재설정
        if (this.y > moneyCanvas.height + this.height) {
            this.reset();
        }
    }

    draw() {
        moneyCtx.save();
        moneyCtx.translate(this.x, this.y);
        moneyCtx.rotate(this.rotation * Math.PI / 180);
        moneyCtx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        moneyCtx.restore();
    }
}

// 오브젝트 생성
const fireworks = [];
const moneyBills = [];

// 초기 폭죽 생성
for (let i = 0; i < 5; i++) {
    fireworks.push(new Firework());
}

// 초기 돈 생성
for (let i = 0; i < 50; i++) {
    const money = new Money();
    // 초기에 화면에 분산
    money.y = Math.random() * moneyCanvas.height;
    moneyBills.push(money);
}

// 애니메이션 루프
function animate() {
    // 캔버스 지우기
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    moneyCtx.clearRect(0, 0, moneyCanvas.width, moneyCanvas.height);

    // 폭죽 업데이트 및 그리기
    for (const firework of fireworks) {
        firework.update();
        firework.draw();
    }

    // 돈 업데이트 및 그리기
    for (const money of moneyBills) {
        money.update();
        money.draw();
    }

    // 랜덤하게 새 폭죽 추가
    if (Math.random() < 0.02 && fireworks.length < 10) {
        fireworks.push(new Firework());
    }

    requestAnimationFrame(animate);
}

// 애니메이션 시작
animate();

// 이미지 로드를 위한 도움 함수
function preloadImages() {
    moneyBills.forEach(money => {
        money.image.onload = () => {
            money.loaded = true;
        };
    });
}

preloadImages();
