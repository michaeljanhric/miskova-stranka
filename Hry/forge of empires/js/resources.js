class ResourceManager {
    constructor() {
        this.resources = {
            gold: 1000,
            supplies: 500,
            happiness: 100,
            population: {
                current: 50,
                max: 100
            }
        };

        this.resourceIcons = {
            gold: '💰',
            supplies: '📦',
            happiness: '😊',
            population: '👥'
        };

        this.updateDisplay();
    }

    addResource(type, amount) {
        if (type === 'population') {
            this.resources.population.current = Math.min(
                this.resources.population.current + amount,
                this.resources.population.max
            );
        } else {
            this.resources[type] += amount;
        }
        this.updateDisplay();
    }

    removeResource(type, amount) {
        if (type === 'population') {
            this.resources.population.current = Math.max(
                this.resources.population.current - amount,
                0
            );
        } else {
            this.resources[type] = Math.max(this.resources[type] - amount, 0);
        }
        this.updateDisplay();
    }

    canAfford(costs) {
        for (const [resource, amount] of Object.entries(costs)) {
            if (resource === 'population') {
                if (this.resources.population.current + amount > this.resources.population.max) {
                    return false;
                }
            } else if (this.resources[resource] < amount) {
                return false;
            }
        }
        return true;
    }

    updateDisplay() {
        // Aktualizácia zobrazenia zlata
        document.getElementById('gold').textContent = this.resources.gold;

        // Aktualizácia zobrazenia zásob
        document.getElementById('supplies').textContent = this.resources.supplies;

        // Aktualizácia zobrazenia šťastia
        document.getElementById('happiness').textContent = this.resources.happiness;

        // Aktualizácia zobrazenia populácie
        document.getElementById('population').textContent =
            `${this.resources.population.current}/${this.resources.population.max}`;
    }

    getResourceAmount(type) {
        if (type === 'population') {
            return this.resources.population.current;
        }
        return this.resources[type];
    }

    getMaxPopulation() {
        return this.resources.population.max;
    }

    increaseMaxPopulation(amount) {
        this.resources.population.max += amount;
        this.updateDisplay();
    }
}