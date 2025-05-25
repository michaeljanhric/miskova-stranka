class Building {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = 64; // základná veľkosť 1x1
        this.health = 100;
        this.productionQueue = [];
        this.image = null;
        this.imageLoaded = false;
        this.loadImage();
        this.setProperties();
        this.producedResource = null;
        this.productionProgress = 0;
        this.lastProductionTime = 0;
    }

    setProperties() {
        const properties = {
            'hut': {
                name: 'Chatrč',
                description: 'Poskytuje bytovanie pre 5 obyvateľov',
                cost: { gold: 50, supplies: 100 },
                production: { population: 5 },
                size: 1,
                productionCycle: 0 // trvalá produkcia
            },
            'hunter': {
                name: 'Lovecká chatka',
                description: 'Produkuje potraviny',
                cost: { gold: 100, supplies: 150 },
                production: { supplies: 10 },
                size: 1,
                productionCycle: 60 // každú minútu
            },
            'farm': {
                name: 'Farma',
                description: 'Produkuje potraviny',
                cost: { gold: 150, supplies: 200 },
                production: { supplies: 15 },
                size: 2,
                productionCycle: 120 // každé 2 minúty
            },
            'pottery': {
                name: 'Hrnčiarska dielňa',
                description: 'Produkuje zásoby',
                cost: { gold: 200, supplies: 250 },
                production: { supplies: 20 },
                size: 2,
                productionCycle: 180 // každé 3 minúty
            },
            'mine': {
                name: 'Baňa',
                description: 'Produkuje zlato',
                cost: { gold: 250, supplies: 300 },
                production: { gold: 25 },
                size: 2,
                productionCycle: 240 // každé 4 minúty
            },
            'barracks': {
                name: 'Kasárne',
                description: 'Trénuje vojenské jednotky',
                cost: { gold: 300, supplies: 400 },
                production: { military: true },
                size: 2,
                productionCycle: 300 // každých 5 minút
            }
        };

        const props = properties[this.type];
        if (props) {
            this.name = props.name;
            this.description = props.description;
            this.cost = props.cost;
            this.production = props.production;
            this.size = props.size * 64; // konverzia na pixely
            this.productionCycle = props.productionCycle;
        }
    }

    loadImage() {
        this.image = new Image();
        this.image.onload = () => {
            console.log(`Obrázok ${this.type} načítaný`);
            this.imageLoaded = true;
        };
        this.image.onerror = () => {
            console.error(`Chyba pri načítaní obrázku ${this.type}`);
        };
        const imagePath = `assets/images/${this.type}.png`;
        console.log('Načítavam obrázok:', imagePath);
        this.image.src = imagePath;
    }

    update() {
        // Aktualizácia produkcie
        if (this.productionQueue.length > 0) {
            const currentProduction = this.productionQueue[0];
            currentProduction.progress += currentProduction.speed;

            if (currentProduction.progress >= 100) {
                this.productionQueue.shift();
                // Tu by sa malo vytvoriť nové jednotky
            }
        }

        // Aktualizácia produkcie zdrojov
        if (this.productionCycle > 0 && !this.producedResource) {
            const currentTime = Date.now();
            if (this.lastProductionTime === 0) {
                this.lastProductionTime = currentTime;
            }

            const timeDiff = currentTime - this.lastProductionTime;
            this.productionProgress = (timeDiff / (this.productionCycle * 1000)) * 100;

            if (this.productionProgress >= 100) {
                // Produkcia dokončená
                this.producedResource = {...this.production };
                this.productionProgress = 0;
                this.lastProductionTime = currentTime;
            }
        }
    }

    render(ctx) {
        console.log(`Vykresľujem budovu ${this.type} na pozícii [${this.x}, ${this.y}]`);
        if (this.image && this.imageLoaded) {
            console.log('Vykresľujem obrázok budovy');
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        } else {
            console.log('Vykresľujem záložný vzhľad budovy');
            // Záložné renderovanie ak obrázok nie je načítaný
            ctx.fillStyle = '#3498db';
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }

        // Vykreslenie zdravia
        const healthBarWidth = this.size;
        const healthBarHeight = 5;
        const healthPercentage = this.health / 100;

        ctx.fillStyle = '#c0392b';
        ctx.fillRect(this.x, this.y - healthBarHeight - 2, healthBarWidth, healthBarHeight);

        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x, this.y - healthBarHeight - 2, healthBarWidth * healthPercentage, healthBarHeight);

        // Vykreslenie progress baru pre produkciu
        if (this.productionQueue.length > 0) {
            const progress = this.productionQueue[0].progress;
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(this.x, this.y + this.size + 2, this.size * (progress / 100), 3);
        }

        // Vykreslenie progress baru pre produkciu zdrojov
        if (this.productionCycle > 0 && !this.producedResource) {
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(this.x, this.y + this.size + 2, this.size * (this.productionProgress / 100), 3);
        }

        // Vykreslenie vyrobeného zdroja
        if (this.producedResource) {
            const iconSize = 32;
            const iconX = this.x + (this.size - iconSize) / 2;
            const iconY = this.y - iconSize - 10;

            // Pozadie ikonky
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2 + 5, 0, Math.PI * 2);
            ctx.fill();

            // Ikonka zdroja
            ctx.font = `${iconSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (const [resource, amount] of Object.entries(this.producedResource)) {
                let icon = '';
                switch (resource) {
                    case 'gold':
                        icon = '💰';
                        break;
                    case 'supplies':
                        icon = '📦';
                        break;
                    case 'population':
                        icon = '👥';
                        break;
                    case 'military':
                        icon = '⚔️';
                        break;
                }
                ctx.fillText(icon, iconX + iconSize / 2, iconY + iconSize / 2);
                ctx.font = '12px Arial';
                ctx.fillText(amount.toString(), iconX + iconSize / 2, iconY + iconSize + 10);
            }

            // Pridanie animácie pulzovania
            const pulseSize = Math.sin(Date.now() / 200) * 2;
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2 + 5 + pulseSize, 0, Math.PI * 2);
            ctx.stroke();

            // Debugovacie informácie
            if (this.type === 'farm') { // Zobrazíme debug len pre farmu
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(`X: ${this.x}, Y: ${this.y}`, this.x, this.y - 20);
                ctx.fillText(`IconX: ${iconX}, IconY: ${iconY}`, this.x, this.y - 10);
            }
        }
    }

    startProduction(unitType) {
        this.productionQueue.push({
            type: unitType,
            progress: 0,
            speed: 1
        });
    }

    collectResource() {
        if (this.producedResource) {
            const collected = {...this.producedResource };
            this.producedResource = null;
            return collected;
        }
        return null;
    }
}

class TownHall extends Building {
    constructor(x, y) {
        super(x, y, 'townhall');
        this.size = 320; // 5x5 políčka (64 * 5)
        this.name = 'Radnica';
        this.description = 'Hlavná budova mesta';
        this.cost = { gold: 0, supplies: 0 };
        this.production = {
            population: 20,
            gold: 50,
            supplies: 50
        };
        console.log('Vytvorená radnica na pozícii:', x, y);
    }

    render(ctx) {
        console.log('Vykresľujem radnicu');
        if (this.image && this.imageLoaded) {
            console.log('Vykresľujem obrázok radnice');
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        } else {
            console.log('Vykresľujem záložný vzhľad radnice');
            // Záložné renderovanie pre radnicu
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText('Radnica', this.x + 10, this.y + this.size / 2);
        }
    }
}