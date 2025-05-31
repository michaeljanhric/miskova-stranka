// Definícia budov
const BUILDINGS = {
    hut: { type: 'hut', size: 2, cost: { gold: 50, supplies: 100 } },
    hunter: { type: 'hunter', size: 2, cost: { gold: 100, supplies: 150 } },
    farm: { type: 'farm', size: 3, cost: { gold: 150, supplies: 200 } },
    pottery: { type: 'pottery', size: 2, cost: { gold: 200, supplies: 250 } },
    mine: { type: 'mine', size: 3, cost: { gold: 250, supplies: 300 } },
    barracks: { type: 'barracks', size: 3, cost: { gold: 300, supplies: 400 } }
};

// Globálne premenné
let selectedBuilding = null;
let isBuildingMode = false;

// Inicializácia stavebného systému
function initBuildingSystem() {
    console.log('Inicializujem stavebný systém...');

    // Pridanie event listenerov pre budovy v menu
    const buildingOptions = document.querySelectorAll('.building-option');
    console.log('Počet nájdených budov:', buildingOptions.length);

    buildingOptions.forEach(option => {
        option.addEventListener('click', function() {
            const buildingType = this.dataset.building;
            console.log('Kliknutie na budovu:', buildingType);

            selectedBuilding = BUILDINGS[buildingType];
            if (canAfford(selectedBuilding.cost)) {
                isBuildingMode = true;
                document.getElementById('game-canvas').classList.add('building-mode');
                console.log('Režim stavania aktivovaný');
            } else {
                alert('Nemáte dostatok zdrojov!');
            }
        });
    });

    // Event listener pre pohyb myšou
    document.getElementById('game-canvas').addEventListener('mousemove', function(e) {
        if (!isBuildingMode) return;

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Odstráň predchádzajúci preview
        const oldPreview = document.querySelector('.building-preview');
        if (oldPreview) oldPreview.remove();

        // Vytvor nový preview
        const preview = document.createElement('div');
        preview.className = 'building-preview';
        preview.style.width = `${selectedBuilding.size * 50}px`;
        preview.style.height = `${selectedBuilding.size * 50}px`;
        preview.style.left = `${Math.floor(x / 50) * 50}px`;
        preview.style.top = `${Math.floor(y / 50) * 50}px`;

        // Skontroluj, či je možné postaviť budovu
        const gridX = Math.floor(x / 50);
        const gridY = Math.floor(y / 50);
        const canBuild = canPlaceBuilding(gridX, gridY, selectedBuilding.size);

        preview.classList.add(canBuild ? 'valid' : 'invalid');
        this.appendChild(preview);
    });

    // Event listener pre kliknutie
    document.getElementById('game-canvas').addEventListener('click', function(e) {
        if (!isBuildingMode) return;

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridX = Math.floor(x / 50);
        const gridY = Math.floor(y / 50);

        if (canPlaceBuilding(gridX, gridY, selectedBuilding.size)) {
            if (spendResources(selectedBuilding.cost)) {
                placeBuilding(gridX, gridY, selectedBuilding);
                isBuildingMode = false;
                this.classList.remove('building-mode');
                const preview = document.querySelector('.building-preview');
                if (preview) preview.remove();
            }
        }
    });

    // Zrušenie režimu stavania pri kliknutí mimo mriežku
    document.addEventListener('click', function(e) {
        if (isBuildingMode && !e.target.closest('#game-canvas')) {
            isBuildingMode = false;
            document.getElementById('game-canvas').classList.remove('building-mode');
            const preview = document.querySelector('.building-preview');
            if (preview) preview.remove();
        }
    });
}

// Pomocné funkcie
function canPlaceBuilding(x, y, size) {
    if (x < 0 || y < 0 || x + size > 20 || y + size > 20) return false;

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
    for (let i = y; i < y + building.size; i++) {
        for (let j = x; j < x + building.size; j++) {
            const cell = document.querySelector(`.grid-cell:nth-child(${i * 20 + j + 1})`);
            cell.classList.add('building', building.type);
        }
    }

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
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM načítaný, inicializujem stavebný systém...');
    initBuildingSystem();
});