document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Efecto de signos flotantes/cayendo ("?") ---
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let signs = [];
    const config = {
        color: 'rgba(255, 255, 255, 0.8)',
        minSize: 14,
        maxSize: 28,
        minSpeed: 0.5,
        maxSpeed: 1.5,
        count: 25
    };

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Sign {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height;
            this.size = Math.floor(Math.random() * (config.maxSize - config.minSize + 1)) + config.minSize;
            this.speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.y += this.speed;
            if (this.y > height + 50) {
                this.reset();
                this.y = -50;
            }
        }
        draw() {
            ctx.fillStyle = config.color.replace('0.8', this.opacity);
            ctx.font = `${this.size}px monospace`;
            ctx.fillText('?', this.x, this.y);
        }
    }

    function initSigns() {
        resizeCanvas();
        signs = [];
        for (let i = 0; i < config.count; i++) {
            const s = new Sign();
            s.y = Math.random() * height; // Distribuir por la pantalla al inicio
            signs.push(s);
        }
    }

    function animateSigns() {
        ctx.clearRect(0, 0, width, height);
        signs.forEach(s => {
            s.update();
            s.draw();
        });
        requestAnimationFrame(animateSigns);
    }

    window.addEventListener('resize', resizeCanvas);
    initSigns();
    animateSigns();


    // --- 2. Lógica del Reproductor de Música ---
    const bgAudio = document.getElementById('bg-audio');
    const playMusicBtn = document.getElementById('play-music-btn');
    const playIcon = document.getElementById('play-icon');
    const volumeSlider = document.getElementById('volume-slider');

    if (bgAudio && volumeSlider) {
        bgAudio.volume = volumeSlider.value;

        playMusicBtn.addEventListener('click', () => {
            if (bgAudio.paused) {
                bgAudio.play();
                playIcon.className = "fas fa-pause";
            } else {
                bgAudio.pause();
                playIcon.className = "fas fa-play";
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            bgAudio.volume = e.target.value;
        });
    }


    // --- 3. Lógica del Video Central (Play/Pause, Mute y Volumen) ---
    const centerVideo = document.getElementById('center-video-element');
    const videoPlayBtn = document.getElementById('video-play-btn');
    const videoPlayIcon = document.getElementById('video-play-icon');
    const videoMuteBtn = document.getElementById('video-mute-btn');
    const videoMuteIcon = document.getElementById('video-mute-icon');
    const videoVolumeSlider = document.getElementById('video-volume-slider');

    if (centerVideo) {
        centerVideo.volume = 0;

        videoPlayBtn.addEventListener('click', () => {
            if (centerVideo.paused) {
                centerVideo.play();
                videoPlayIcon.className = "fas fa-pause";
            } else {
                centerVideo.pause();
                videoPlayIcon.className = "fas fa-play";
            }
        });

        videoVolumeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            centerVideo.volume = val;
            if (val > 0) {
                centerVideo.muted = false;
                videoMuteIcon.className = "fas fa-volume-up";
            } else {
                centerVideo.muted = true;
                videoMuteIcon.className = "fas fa-volume-mute";
            }
        });

        videoMuteBtn.addEventListener('click', () => {
            if (centerVideo.muted || centerVideo.volume === 0) {
                centerVideo.muted = false;
                centerVideo.volume = videoVolumeSlider.value > 0 ? videoVolumeSlider.value : 0.5;
                videoVolumeSlider.value = centerVideo.volume;
                videoMuteIcon.className = "fas fa-volume-up";
            } else {
                centerVideo.muted = true;
                centerVideo.volume = 0;
                videoVolumeSlider.value = 0;
                videoMuteIcon.className = "fas fa-volume-mute";
            }
        });
    }


    // --- 4. Botón de Copiar Discord ---
    const copyBtn = document.querySelector('.btn-copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const textToCopy = copyBtn.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });
    }

});