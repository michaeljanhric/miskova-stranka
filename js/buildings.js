class Building {
    constructor(type, size, cost) {
        this.type = type;
        this.size = size;
        this.cost = cost;
    }
}

const BUILDINGS = {
    hut: new Building('hut', 2, { gold: 50, supplies: 100 }),
    hunter: new Building('hunter', 2, { gold: 100, supplies: 150 }),
    farm: new Building('farm', 3, { gold: 150, supplies: 200 }),
    pottery: new Building('pottery', 2, { gold: 200, supplies: 250 }),
    mine: new Building('mine', 3, { gold: 250, supplies: 300 }),
    barracks: new Building('barracks', 3, { gold: 300, supplies: 400 })
};

// Globálne premenné
window.selectedBuilding = null;
window.isBuildingMode = false;

function initBuildingSystem() {
    const buildingOptions = document.querySelectorAll('.building-option');
    const gameCanvas = document.getElementById('game-canvas');
    const gridContainer = document.getElementById('grid-container');

    buildingOptions.forEach(option => {
        option.addEventListener('click', () => {
            const buildingType = option.dataset.building;
            window.selectedBuilding = BUILDINGS[buildingType];
            window.isBuildingMode = true;
            gameCanvas.classList.add('building-mode');
        });
    });

    gameCanvas.addEventListener('mousemove', (e) => {
        if (!window.isBuildingMode) return;

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
    });

    gameCanvas.addEventListener('click', (e) => {
        if (!window.isBuildingMode) return;

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
    });

    // Zrušenie režimu stavania pri kliknutí mimo mriežku
    document.addEventListener('click', (e) => {
        if (window.isBuildingMode && !e.target.closest('#game-canvas')) {
            window.isBuildingMode = false;
            gameCanvas.classList.remove('building-mode');
            const preview = document.querySelector('.building-preview');
            if (preview) preview.remove();
        }
    });
}

function canPlaceBuilding(x, y, size) {
    // Kontrola hraníc mriežky
    if (x < 0 || y < 0 || x + size > 20 || y + size > 20) return false;

    // Kontrola kolízie s existujúcimi budovami
    for (let i = y; i < y + size; i++) {
        for (let j = x; j < x + size; j++) {
            const cell = document.querySelector(`.grid-cell:nth-child(${i * 20 + j + 1})`);
            if (cell.classList.contains('building') || cell.classList.contains('town-hall')) {
                return false;
            }
        }
    }

    return true;
}

function placeBuilding(x, y, building) {
    // Vytvorenie budovy v mriežke
    for (let i = y; i < y + building.size; i++) {
        for (let j = x; j < x + building.size; j++) {
            const cell = document.querySelector(`.grid-cell:nth-child(${i * 20 + j + 1})`);
            cell.classList.add('building', building.type);
        }
    }

    // Pridanie nápisu budovy
    const centerCell = document.querySelector(`.grid-cell:nth-child(${y * 20 + x + Math.floor(building.size/2)})`);
    const label = document.createElement('div');
    label.className = 'building-label';
    label.textContent = getBuildingName(building.type);
    centerCell.appendChild(label);
}

function getBuildingName(type) {
    const names = {
        'hut': 'Chatrč',
        'hunter': 'Lovecká chatka',
        'farm': 'Farma',
        'pottery': 'Hrnčiarska dielňa',
        'mine': 'Baňa',
        'barracks': 'Kasárne'
    };
    return names[type] || type;
}

// Inicializácia systému budov po načítaní dokumentu
document.addEventListener('DOMContentLoaded', initBuildingSystem);