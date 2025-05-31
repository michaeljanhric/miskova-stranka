// Základné herné premenné
let gameState = {
    resources: {
        coins: 1000,
        supplies: 500,
        population: 100
    },
    buildings: [],
    research: []
};

// Inicializácia hry
function initGame() {
    console.log('Inicializácia hry...');
    setupEventListeners();
    loadGameState();
    startGameLoop();
}

// Nastavenie event listenerov
function setupEventListeners() {
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);
}

// Načítanie herného stavu
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
    }
    updateUI();
}

// Uloženie herného stavu
function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Herná slučka
function startGameLoop() {
    setInterval(() => {
        updateResources();
        updateUI();
        saveGameState();
    }, 1000);
}

// Aktualizácia zdrojov
function updateResources() {
    gameState.resources.coins += 10;
    gameState.resources.supplies += 5;
}

// Aktualizácia UI
function updateUI() {
    // Tu bude kód pre aktualizáciu UI
    console.log('Aktualizácia UI...');
}

// Spracovanie kliknutia
function handleClick(event) {
    // Tu bude kód pre spracovanie kliknutia
    console.log('Kliknutie:', event);
}

// Spracovanie stlačenia klávesy
function handleKeyPress(event) {
    // Tu bude kód pre spracovanie stlačenia klávesy
    console.log('Stlačenie klávesy:', event);
}

// Spustenie hry po načítaní stránky
window.addEventListener('load', initGame);