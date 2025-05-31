// Inicializácia hry
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializujem hru...');

    // Inicializácia mriežky
    initGrid();

    // Inicializácia stavebného systému
    initBuildingSystem();

    // Inicializácia systému zdrojov
    initResourceSystem();
});

// Inicializácia mriežky
function initGrid() {
    console.log('Inicializujem mriežku...');
    const gameCanvas = document.getElementById('game-canvas');

    // Vytvorenie mriežky 20x20
    for (let i = 0; i < 400; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gameCanvas.appendChild(cell);
    }

    // Pridanie radnice do stredu
    const centerIndex = 190; // 9 * 20 + 10
    const centerCell = gameCanvas.children[centerIndex];
    centerCell.classList.add('town-hall');

    const label = document.createElement('div');
    label.className = 'building-label';
    label.textContent = 'Radnica';
    centerCell.appendChild(label);
}