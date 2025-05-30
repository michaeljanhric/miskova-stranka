// Inicializácia hry
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializujem hru...');

    // Vytvorenie mriežky
    const gridContainer = document.getElementById('grid-container');
    console.log('Grid container:', gridContainer);

    // Vytvorenie mriežky 20x20
    for (let i = 0; i < 400; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridContainer.appendChild(cell);
    }

    // Vytvorenie radnice v strede (5x5)
    const centerX = 7;
    const centerY = 7;

    for (let y = centerY; y < centerY + 5; y++) {
        for (let x = centerX; x < centerX + 5; x++) {
            const index = y * 20 + x;
            const cell = gridContainer.children[index];
            cell.classList.add('town-hall');
        }
    }

    // Pridanie nápisu "Radnica"
    const centerCell = gridContainer.children[centerY * 20 + centerX + 2];
    const label = document.createElement('div');
    label.className = 'building-label';
    label.textContent = 'Radnica';
    centerCell.appendChild(label);

    // Inicializácia canvasu
    const gameCanvas = document.getElementById('game-canvas');
    console.log('Game canvas:', gameCanvas);

    // Nastavenie veľkosti canvasu
    function resizeCanvas() {
        gameCanvas.width = gridContainer.offsetWidth;
        gameCanvas.height = gridContainer.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Inicializácia stavebného systému
    initBuildingSystem();
});

// Funkcie pre správu udalostí myši
function handleMouseMove(e) {
    if (!window.isBuildingMode) return;

    const gameCanvas = document.getElementById('game-canvas');
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Odstráň predchádzajúci preview
    const oldPreview = document.querySelector('.building-preview');
    if (oldPreview) oldPreview.remove();

    // Vytvor nový preview
    const preview = document.createElement('div');
    preview.className = 'building-preview';
    preview.style.width = `${window.selectedBuilding.size * 50}px`;
    preview.style.height = `${window.selectedBuilding.size * 50}px`;
    preview.style.left = `${Math.floor(x / 50) * 50}px`;
    preview.style.top = `${Math.floor(y / 50) * 50}px`;

    // Skontroluj, či je možné postaviť budovu
    const gridX = Math.floor(x / 50);
    const gridY = Math.floor(y / 50);
    const canBuild = canPlaceBuilding(gridX, gridY, window.selectedBuilding.size);

    preview.classList.add(canBuild ? 'valid' : 'invalid');
    gameCanvas.appendChild(preview);
}

function handleClick(e) {
    if (!window.isBuildingMode) return;

    const gameCanvas = document.getElementById('game-canvas');
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = Math.floor(x / 50);
    const gridY = Math.floor(y / 50);

    if (canPlaceBuilding(gridX, gridY, window.selectedBuilding.size)) {
        placeBuilding(gridX, gridY, window.selectedBuilding);
        window.isBuildingMode = false;
        gameCanvas.classList.remove('building-mode');
        const preview = document.querySelector('.building-preview');
        if (preview) preview.remove();
    }
}