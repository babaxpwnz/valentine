import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

// State
let isAccepted = false;
let isMerging = false;
let modelsLoaded = 0;

// Three.js
let scene, camera, renderer, clock;
let cupidGroup, devilGroup, cupidModel, devilModel;

// ==================== THREE.JS ====================

function initThree() {
    const container = document.getElementById('canvas-container');

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 12);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x404040, 0.6));
    const light1 = new THREE.PointLight(0xff9999, 1, 50);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    const light2 = new THREE.PointLight(0xffcccc, 0.8, 50);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    // Groups
    cupidGroup = new THREE.Group();
    devilGroup = new THREE.Group();
    scene.add(cupidGroup);
    scene.add(devilGroup);

    loadModels();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function loadModels() {
    const loader = new STLLoader();
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Загрузка...';
    document.body.appendChild(loading);

    function onLoad(geometry, color, group, x) {
        geometry.computeVertexNormals();
        geometry.center();
        const material = new THREE.MeshPhongMaterial({ color, specular: 0x444444, shininess: 30 });
        const mesh = new THREE.Mesh(geometry, material);
        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize(new THREE.Vector3());
        mesh.scale.setScalar(2 / Math.max(size.x, size.y, size.z));
        group.add(mesh);
        group.position.set(x, 3.5, 0);
        if (group === cupidGroup) cupidModel = mesh;
        else devilModel = mesh;
        modelsLoaded++;
        if (modelsLoaded === 2) {
            loading.remove();
            animate();
        }
    }

    loader.load('Cute Flexi Valentines Devil & Cupid/Bellamys3DP - Cupid.stl',
        g => onLoad(g, 0xffb6c1, cupidGroup, -2.5));
    loader.load('Cute Flexi Valentines Devil & Cupid/Bellamys3DP - Devil.stl',
        g => onLoad(g, 0xff6b6b, devilGroup, 2.5));
}

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!isMerging) {
        // Floating animation
        cupidGroup.position.x = -2.5 + Math.sin(t * 0.7) * 0.6;
        cupidGroup.position.y = 3.5 + Math.sin(t * 0.9) * 0.4;
        devilGroup.position.x = 2.5 + Math.sin(t * 0.8) * 0.6;
        devilGroup.position.y = 3.5 + Math.cos(t * 0.85) * 0.4;

        if (cupidModel) cupidModel.rotation.y += 0.003;
        if (devilModel) devilModel.rotation.y -= 0.003;
    } else {
        // Merge together
        cupidGroup.position.x += (-1 - cupidGroup.position.x) * 0.02;
        cupidGroup.position.y += (3.5 - cupidGroup.position.y) * 0.02;
        devilGroup.position.x += (1 - devilGroup.position.x) * 0.02;
        devilGroup.position.y += (3.5 - devilGroup.position.y) * 0.02;

        // Float together
        const float = Math.sin(t * 2) * 0.1;
        cupidGroup.position.y += float;
        devilGroup.position.y += float;
    }

    renderer.render(scene, camera);
}

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
        isMerging = true;
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
    initThree();
    initHearts();
    initEvasiveButton();
    initAccept();
});
