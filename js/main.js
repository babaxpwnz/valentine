// State
let isAccepted = false;

// ==================== EVASIVE BUTTON ====================

function initEvasiveButton() {
    const btn = document.getElementById('btn-no');
    let tx = 0, ty = 0;

    function escape(mx, my) {
        if (isAccepted) return;

        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 + tx;
        const cy = rect.top + rect.height / 2 + ty;

        if (Math.hypot(mx - cx, my - cy) > 100) return;

        // Move away
        const angle = Math.atan2(cy - my, cx - mx);
        tx += Math.cos(angle) * 80;
        ty += Math.sin(angle) * 80;

        // Clamp to screen
        const margin = 30;
        const minX = margin - rect.left;
        const maxX = window.innerWidth - rect.right - margin;
        const minY = margin - rect.top;
        const maxY = window.innerHeight - rect.bottom - margin;
        tx = Math.max(minX, Math.min(maxX, tx));
        ty = Math.max(minY, Math.min(maxY, ty));

        btn.style.transform = `translate(${tx}px, ${ty}px)`;
    }

    document.addEventListener('mousemove', e => escape(e.clientX, e.clientY));
    btn.addEventListener('touchstart', e => { e.preventDefault(); escape(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
    document.addEventListener('touchmove', e => escape(e.touches[0].clientX, e.touches[0].clientY));
    btn.addEventListener('click', e => { e.preventDefault(); escape(e.clientX, e.clientY); });
}

// ==================== HEARTS ====================

function initHearts() {
    const container = document.getElementById('hearts-container');
    const emojis = ['❤', '💕', '💗', '💖', '💘'];

    function spawn(big = false) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (big ? 20 : 12) + Math.random() * 10 + 'px';
        heart.style.animationDuration = (5 + Math.random() * 5) + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }

    for (let i = 0; i < 10; i++) setTimeout(spawn, Math.random() * 2000);
    setInterval(spawn, 1000);
}

// ==================== ACCEPT ====================

function initAccept() {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const yay = document.getElementById('yay-text');
    const gif = document.getElementById('gif-container');

    btnYes.addEventListener('click', () => {
        isAccepted = true;
        btnYes.style.display = 'none';
        btnNo.style.display = 'none';

        setTimeout(() => yay.classList.add('visible'), 300);
        setTimeout(() => gif.classList.add('visible'), 600);

        // Celebration hearts
        const container = document.getElementById('hearts-container');
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.className = 'heart';
                heart.textContent = ['❤', '💕', '💗', '💖', '💘'][Math.floor(Math.random() * 5)];
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.fontSize = (20 + Math.random() * 15) + 'px';
                heart.style.animationDuration = (3 + Math.random() * 3) + 's';
                container.appendChild(heart);
                setTimeout(() => heart.remove(), 6000);
            }, i * 80);
        }
    });
}

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', () => {
    initHearts();
    initEvasiveButton();
    initAccept();
});
