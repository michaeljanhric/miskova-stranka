// Správa zdrojov
let resources = {
    gold: 1000,
    supplies: 1000,
    population: 0,
    maxPopulation: 10
};

// Inicializácia systému zdrojov
function initResourceSystem() {
    console.log('Inicializujem systém zdrojov...');
    updateResourceDisplay();
    startResourceGeneration();
}

// Aktualizácia zobrazenia zdrojov
function updateResourceDisplay() {
    document.getElementById('gold').textContent = resources.gold;
    document.getElementById('supplies').textContent = resources.supplies;
    document.getElementById('population').textContent = `${resources.population}/${resources.maxPopulation}`;
}

// Kontrola, či má hráč dostatok zdrojov
function canAfford(cost) {
    return resources.gold >= cost.gold && resources.supplies >= cost.supplies;
}

// Odpočítanie zdrojov
function spendResources(cost) {
    if (!canAfford(cost)) return false;

    resources.gold -= cost.gold;
    resources.supplies -= cost.supplies;
    updateResourceDisplay();
    return true;
}

// Pridanie zdrojov
function addResources(type, amount) {
    resources[type] += amount;
    updateResourceDisplay();
}

// Generovanie zdrojov
function startResourceGeneration() {
    setInterval(() => {
        // Základná generácia zdrojov
        resources.gold += 5;
        resources.supplies += 10;

        // Generácia zdrojov z budov
        const buildings = document.querySelectorAll('.building');
        buildings.forEach(building => {
            const type = Array.from(building.classList)
                .find(cls => ['hut', 'hunter', 'farm', 'pottery', 'mine', 'barracks'].includes(cls));

            if (type) {
                switch (type) {
                    case 'hut':
                        resources.maxPopulation += 2;
                        break;
                    case 'hunter':
                        resources.supplies += 15;
                        break;
                    case 'farm':
                        resources.supplies += 25;
                        break;
                    case 'pottery':
                        resources.gold += 10;
                        break;
                    case 'mine':
                        resources.gold += 20;
                        break;
                    case 'barracks':
                        resources.supplies += 5;
                        break;
                }
            }
        });

        updateResourceDisplay();
    }, 5000); // Každých 5 sekúnd
}

// Inicializácia zobrazenia zdrojov
document.addEventListener('DOMContentLoaded', updateResourceDisplay);