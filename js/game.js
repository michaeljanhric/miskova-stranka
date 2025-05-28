document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('grid-container');

    // Vytvorenie mriežky 20x20
    for (let i = 0; i < 400; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridContainer.appendChild(cell);
    }

    // Inicializácia canvasu
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    // Nastavenie veľkosti canvasu na veľkosť kontajnera
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    // Inicializácia veľkosti canvasu
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
});