const TOTAL_CANDLES = 20;
let candlesPlaced = 0;
let candlesLit = 0;
let candlesBlown = 0;
let hasOpened = false;

document.addEventListener('DOMContentLoaded', () => {
    const giftBox = document.getElementById('gift-box');
    const startScreen = document.getElementById('start-overlay-screen');
    const mainContainer = document.querySelector('.main-container');

    createSnow();

    giftBox.addEventListener('click', () => {
        if (hasOpened) return;
        hasOpened = true;

        // Trigger opening animation
        giftBox.classList.add('opening');

        // Play music
        playChristmasMusic();

        // After lid opens, fade out the entire screen
        setTimeout(() => {
            startScreen.classList.add('hidden');
        }, 1200);

        // Show main content
        setTimeout(() => {
            mainContainer.classList.add('visible');
            initGame();
        }, 2500);
    });
});

function initGame() {
    placeCandles();
    createCursorTrail();
}

function createSnow() {
    const snowflakeCount = 50;
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❄';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
        snowflake.style.opacity = Math.random();
        snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
        document.body.appendChild(snowflake);
    }
}

function playChristmasMusic() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioCtx = new AudioContext();
    const tempo = 0.6015;

    const notes = [
        { note: 392.00, time: 0, dur: 0.4 }, { note: 392.00, time: 0.5, dur: 0.4 }, { note: 440.00, time: 1.0, dur: 0.8 }, { note: 392.00, time: 2.0, dur: 0.8 }, { note: 523.25, time: 3.0, dur: 0.8 }, { note: 493.88, time: 4.0, dur: 1.8 },
        { note: 392.00, time: 6.0, dur: 0.4 }, { note: 392.00, time: 6.5, dur: 0.4 }, { note: 440.00, time: 7.0, dur: 0.8 }, { note: 392.00, time: 8.0, dur: 0.8 }, { note: 587.33, time: 9.0, dur: 0.8 }, { note: 523.25, time: 10.0, dur: 1.8 },
        { note: 392.00, time: 12.0, dur: 0.4 }, { note: 392.00, time: 12.5, dur: 0.4 }, { note: 783.99, time: 13.0, dur: 0.8 }, { note: 659.25, time: 14.0, dur: 0.8 }, { note: 523.25, time: 15.0, dur: 0.8 }, { note: 493.88, time: 16.0, dur: 0.8 }, { note: 440.00, time: 17.0, dur: 0.8 },
        { note: 698.46, time: 18.0, dur: 0.4 }, { note: 698.46, time: 18.5, dur: 0.4 }, { note: 659.25, time: 19.0, dur: 0.8 }, { note: 523.25, time: 20.0, dur: 0.8 }, { note: 587.33, time: 21.0, dur: 0.8 }, { note: 523.25, time: 22.0, dur: 2.5 }
    ];

    notes.forEach(n => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = n.note;

        osc.type = 'triangle';

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const startTime = audioCtx.currentTime + (n.time * tempo);
        const duration = n.dur * tempo;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
    });
}

function placeCandles() {
    const container = document.getElementById('candle-container');
    const instruction = document.getElementById('instruction');

    instruction.textContent = "Setting up the cake... 🎂";
    instruction.classList.add('visible');

    const width = 280;
    const height = 60;

    const centerX = width / 2;
    const centerY = height / 2;

    const rings = [
        { count: 14, radiusX: width / 2, radiusY: height / 2 },
        { count: 6, radiusX: width / 4, radiusY: height / 4 }
    ];

    let candlesToPlace = [];

    rings.forEach(ring => {
        const step = (Math.PI * 2) / ring.count;
        for (let i = 0; i < ring.count; i++) {
            const angle = step * i + (Math.random() * 0.2 - 0.1);
            const x = centerX + Math.cos(angle) * ring.radiusX;
            const y = centerY + Math.sin(angle) * ring.radiusY;

            candlesToPlace.push({ x, y, z: y });
        }
    });

    candlesToPlace.sort((a, b) => a.z - b.z);

    let currentCandleIndex = 0;

    let interval = setInterval(() => {
        if (currentCandleIndex >= candlesToPlace.length) {
            clearInterval(interval);
            setTimeout(lightCandles, 500);
            return;
        }

        const pos = candlesToPlace[currentCandleIndex];
        const candle = document.createElement('div');
        candle.classList.add('candle');

        candle.style.left = `${pos.x}px`;
        candle.style.bottom = `${height + 10 - pos.y}px`;
        candle.style.zIndex = Math.floor(pos.z);

        const randomHeight = 50 + Math.random() * 15;
        candle.style.height = '0px';

        const flame = document.createElement('div');
        flame.classList.add('flame');
        candle.appendChild(flame);

        container.appendChild(candle);

        setTimeout(() => {
            candle.style.height = `${randomHeight}px`;
        }, 50);

        currentCandleIndex++;
        candlesPlaced++;

    }, 150);
}

async function lightCandles() {
    const flames = document.querySelectorAll('.flame');
    const instruction = document.getElementById('instruction');
    const overlay = document.getElementById('dark-overlay');

    instruction.textContent = "Lighting the candles... 🔥";
    overlay.style.opacity = 0.85;

    // Create complex lighter structure
    const lighterContainer = document.createElement('div');
    lighterContainer.classList.add('lighter-container');

    const lighterBody = document.createElement('div');
    lighterBody.classList.add('lighter-body');

    const lighterChimney = document.createElement('div');
    lighterChimney.classList.add('lighter-chimney');

    const lighterFlame = document.createElement('div');
    lighterFlame.classList.add('lighter-flame');

    lighterContainer.appendChild(lighterBody);
    lighterContainer.appendChild(lighterChimney);
    lighterContainer.appendChild(lighterFlame);

    document.body.appendChild(lighterContainer);

    setTimeout(() => lighterContainer.classList.add('visible'), 100);

    for (const flame of flames) {
        const flameRect = flame.getBoundingClientRect();

        // Adjust for tilted lighter (30deg)
        // With rotation, the "tip" of the lighter flame is shifted.
        // We need to place the lighter such that its flame tip (approx top-left relative to center due to rotation)
        // touches the bottom-center of the candle flame.

        lighterContainer.style.left = `${flameRect.left + flameRect.width / 2 - 45}px`;
        lighterContainer.style.top = `${flameRect.bottom - 5}px`;

        await new Promise(resolve => setTimeout(resolve, 400));

        flame.classList.add('lit');

        await new Promise(resolve => setTimeout(resolve, 160));
    }

    lighterContainer.classList.remove('visible');
    setTimeout(() => lighterContainer.remove(), 500);

    startGame();
}

function startGame() {
    const instruction = document.getElementById('instruction');
    instruction.innerHTML = "Make a wish! ✨<br>Rub the flames to blow them out!";
    setupInteraction();
}

function setupInteraction() {
    const appBody = document.body;

    function checkCollision(x, y) {
        const flames = document.querySelectorAll('.flame.lit');
        flames.forEach(flame => {
            const rect = flame.getBoundingClientRect();
            if (x >= rect.left - 30 && x <= rect.right + 30 &&
                y >= rect.top - 30 && y <= rect.bottom + 30) {
                extinguish(flame);
            }
        });
    }

    appBody.addEventListener('mousemove', (e) => {
        checkCollision(e.clientX, e.clientY);
    });

    appBody.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        checkCollision(touch.clientX, touch.clientY);
    }, { passive: false });
}

function extinguish(flame) {
    if (!flame.classList.contains('lit')) return;

    flame.classList.remove('lit');
    const candle = flame.parentElement;

    const smoke = document.createElement('div');
    smoke.classList.add('smoke');
    candle.appendChild(smoke);

    setTimeout(() => smoke.remove(), 1000);

    candlesBlown++;

    if (candlesBlown === TOTAL_CANDLES) {
        finishGame();
    }
}

function finishGame() {
    const instruction = document.getElementById('instruction');
    const santaContainer = document.querySelector('.santa-container');
    const cardContainer = document.querySelector('.card-container');

    instruction.style.opacity = 0;

    setTimeout(() => {
        if (santaContainer) santaContainer.classList.add('active');
        if (cardContainer) cardContainer.classList.add('active');
        startFireworks();
        setupCardMusic();
    }, 500);
}

function setupCardMusic() {
    const cardText = document.querySelector('.card-text');
    let audio = null;

    if (cardText) {
        cardText.addEventListener('click', () => {
            if (!audio) {
                audio = new Audio('christmas.mp3');
            }
            audio.play();
        });
    }
}

function startFireworks() {
    const canvas = document.getElementById('firework-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.friction = 0.95;
    }

    Particle.prototype.draw = function () {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    Particle.prototype.update = function () {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }

    function createFirework(x, y) {
        const colors = ['#ffdac1', '#ff9aa2', '#b5ead7', '#e2f0cb', '#fff'];
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2);
        createFirework(x, y);
    }, 500);

    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            if (particle.alpha > 0) {
                particle.update();
                particle.draw();
            } else {
                particles.splice(index, 1);
            }
        });
    }

    animate();
}

function createCursorTrail() {
    const colors = ['#ffcbd3', '#bcebc7', '#fff9c4', '#fff'];
    document.addEventListener('mousemove', (e) => {
        createSparkle(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        createSparkle(touch.clientX, touch.clientY);
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = Math.random() * 8 + 4 + 'px';
        sparkle.style.height = sparkle.style.width;
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.transform = 'translate(-50%, -50%)';
        sparkle.style.zIndex = '9999';
        sparkle.style.boxShadow = '0 0 10px rgba(255,255,255,0.8)';

        document.body.appendChild(sparkle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 30 + 10;
        const moveX = Math.cos(angle) * velocity;
        const moveY = Math.sin(angle) * velocity;

        sparkle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }
}
