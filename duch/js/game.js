console.log('Načítavam game.js');

class Game {
    constructor() {
        console.log('Vytváram novú inštanciu hry');
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            console.error('Canvas nebol nájdený!');
            return;
        }
        console.log('Canvas nájdený:', this.canvas);

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Nepodarilo sa získať kontext canvasu!');
            return;
        }
        console.log('Canvas kontext získaný');

        // Inicializácia manažérov
        this.resourceManager = new ResourceManager();
        this.researchManager = new ResearchManager();
        this.questManager = new QuestManager();

        this.buildings = [];
        this.units = [];
        this.selectedBuilding = null;
        this.buildingPreview = null;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.camera = { x: 0, y: 0 };
        this.gridSize = 64;
        this.gridColor = 'rgba(255, 255, 255, 0.1)';
        this.gridLineWidth = 1;
        this.hoveredBuilding = null;
        this.mouseX = 0;
        this.mouseY = 0;

        this.setupCanvas();
        this.setupEventListeners();
        this.initializeGame();
        this.gameLoop();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 80;
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight - 80;
        });
    }

    setupEventListeners() {
        // Event listener pre kliknutie na budovu v menu
        document.querySelectorAll('.building-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const buildingType = e.currentTarget.dataset.building;
                console.log('Vybratá budova:', buildingType);

                // Odstránenie predchádzajúceho výberu
                document.querySelectorAll('.building-option').forEach(opt => {
                    opt.classList.remove('selected');
                });

                // Pridanie triedy selected na vybranú budovu
                e.currentTarget.classList.add('selected');

                // Nastavenie preview budovy
                this.buildingPreview = {
                    type: buildingType,
                    x: 0,
                    y: 0,
                    size: this.getBuildingSize(buildingType)
                };

                // Pridanie triedy pre zmenu kurzora
                this.canvas.classList.add('building-mode');
            });
        });

        // Event listener pre pohyb myši
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;

            if (this.buildingPreview) {
                this.buildingPreview.x = this.mouseX - this.buildingPreview.size / 2;
                this.buildingPreview.y = this.mouseY - this.buildingPreview.size / 2;
            }

            // Kontrola, či je myš nad nejakou budovou
            const worldX = this.mouseX + this.camera.x;
            const worldY = this.mouseY + this.camera.y;
            this.hoveredBuilding = this.getBuildingAt(worldX, worldY);
        });

        // Event listener pre opustenie canvasu
        this.canvas.addEventListener('mouseleave', () => {
            this.hoveredBuilding = null;
        });

        // Event listener pre kliknutie na canvas
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const worldX = x + this.camera.x;
            const worldY = y + this.camera.y;

            console.log('Kliknutie na pozícii:', { x, y, worldX, worldY });

            // Kontrola kliknutia na vyrobený zdroj
            const building = this.getBuildingAt(worldX, worldY);
            if (building && building.producedResource) {
                console.log('Našla sa budova so zdrojom:', building);
                console.log('Typ budovy:', building.type);
                console.log('Pozícia budovy:', { x: building.x, y: building.y });
                console.log('Veľkosť budovy:', building.size);
                console.log('Vyrobený zdroj:', building.producedResource);

                const iconSize = 32;
                const iconX = building.x + (building.size - iconSize) / 2;
                const iconY = building.y - iconSize - 10;

                console.log('Pozícia ikonky:', { iconX, iconY });
                console.log('Pozícia myši vo svete:', { worldX, worldY });

                // Kontrola, či klik bol v oblasti ikonky
                const dx = worldX - (iconX + iconSize / 2);
                const dy = worldY - (iconY + iconSize / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                console.log('Vzdialenosť od stredu ikonky:', distance);
                console.log('Maximálna povolená vzdialenosť:', iconSize / 2 + 5);

                if (distance <= iconSize / 2 + 5) {
                    console.log('Kliknutie na zdroj:', building.producedResource);
                    const collected = building.collectResource();
                    if (collected) {
                        console.log('Vyzbierané zdroje:', collected);
                        // Pridanie vyzbieraných zdrojov
                        for (const [resource, amount] of Object.entries(collected)) {
                            console.log(`Pridávam ${amount} ${resource}`);
                            this.resourceManager.addResource(resource, amount);
                        }
                    } else {
                        console.log('Nepodarilo sa vyzbierať zdroje');
                    }
                    return;
                } else {
                    console.log('Klik bol mimo oblasti ikonky');
                }
            }

            if (this.buildingPreview) {
                // Zaokrúhlenie na najbližšie mriežkové pole
                const gridX = Math.floor(worldX / this.gridSize) * this.gridSize;
                const gridY = Math.floor(worldY / this.gridSize) * this.gridSize;

                // Kontrola, či máme dostatok zdrojov
                const buildingCost = this.getBuildingCost(this.buildingPreview.type);
                if (this.resourceManager.canAfford(buildingCost)) {
                    // Odpočítanie zdrojov
                    for (const [resource, amount] of Object.entries(buildingCost)) {
                        this.resourceManager.removeResource(resource, amount);
                    }

                    // Vytvorenie novej budovy
                    const newBuilding = new Building(gridX, gridY, this.buildingPreview.type);
                    this.buildings.push(newBuilding);
                    console.log('Budova postavená:', newBuilding);

                    // Resetovanie preview
                    this.buildingPreview = null;
                    this.canvas.classList.remove('building-mode');

                    // Odstránenie triedy selected
                    document.querySelectorAll('.building-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                } else {
                    alert('Nemáš dostatok zdrojov!');
                }
            }
        });

        // Event listener pre stlačenie Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.buildingPreview) {
                this.buildingPreview = null;
                this.canvas.classList.remove('building-mode');
                document.querySelectorAll('.building-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }
        });

        // Event listeners pre tlačidlá
        document.getElementById('toggle-menu').addEventListener('click', () => this.toggleMenu('building-menu'));
        document.getElementById('toggle-research').addEventListener('click', () => this.toggleMenu('research'));
        document.getElementById('toggle-quests').addEventListener('click', () => this.toggleMenu('quests'));
    }

    initializeGame() {
        console.log('Inicializácia hry...');

        // Vytvorenie počiatočnej radnice v strede obrazovky
        console.log('Vytváram radnicu...');
        const centerX = Math.floor((this.canvas.width - 320) / 2);
        const centerY = Math.floor((this.canvas.height - 320) / 2);
        this.createBuilding('townhall', centerX, centerY);

        // Centrovanie kamery na radnicu
        if (this.buildings.length > 0) {
            console.log('Centrujem kameru na radnicu...');
            const townhall = this.buildings[0];
            this.centerCameraOn(townhall);
        }

        // Inicializácia úloh
        this.questManager.initializeQuests();

        // Inicializácia výskumu
        this.researchManager.updateResearchTree();
    }

    toggleMenu(menuId) {
        const menu = document.getElementById(menuId);
        const content = menu.querySelector('.building-categories, #research-tree, #quest-list');
        const button = menu.querySelector('button');

        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            button.textContent = '▼';
        } else {
            content.classList.add('hidden');
            button.textContent = '▲';
        }
    }

    getBuildingSize(buildingType) {
        const properties = {
            'hut': 64,
            'hunter': 64,
            'farm': 128,
            'pottery': 128,
            'mine': 128,
            'barracks': 128,
            'townhall': 320
        };
        return properties[buildingType] || 64;
    }

    getBuildingCost(buildingType) {
        const properties = {
            'hut': { gold: 50, supplies: 100 },
            'hunter': { gold: 100, supplies: 150 },
            'farm': { gold: 150, supplies: 200 },
            'pottery': { gold: 200, supplies: 250 },
            'mine': { gold: 250, supplies: 300 },
            'barracks': { gold: 300, supplies: 400 }
        };
        return properties[buildingType] || { gold: 0, supplies: 0 };
    }

    createBuilding(type, x, y) {
        let building;
        if (type === 'townhall') {
            building = new TownHall(x, y);
        } else {
            building = new Building(x, y, type);
        }
        this.buildings.push(building);

        // Kontrola úloh
        this.questManager.checkQuestProgress(this.buildings, this.researchManager);
    }

    getBuildingAt(x, y) {
        return this.buildings.find(building => {
            return x >= building.x &&
                x <= building.x + building.size &&
                y >= building.y &&
                y <= building.y + building.size;
        });
    }

    update() {
        // Aktualizácia budov
        this.buildings.forEach(building => building.update());

        // Aktualizácia jednotiek
        this.units.forEach(unit => unit.update());

        // Aktualizácia výskumu
        this.researchManager.updateResearch(0.1);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Uloženie kontextu pred aplikovaním kamery
        this.ctx.save();

        // Aplikovanie kamery
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // Vykreslenie mriežky
        this.drawGrid();

        // Vykreslenie budov
        this.buildings.forEach(building => building.render(this.ctx));

        // Vykreslenie preview budovy
        if (this.buildingPreview) {
            this.ctx.globalAlpha = 0.5;
            this.ctx.fillStyle = '#3498db';
            this.ctx.fillRect(
                this.buildingPreview.x,
                this.buildingPreview.y,
                this.buildingPreview.size,
                this.buildingPreview.size
            );
            this.ctx.globalAlpha = 1.0;
        }

        // Obnovenie kontextu
        this.ctx.restore();

        // Vykreslenie tooltipu
        if (this.hoveredBuilding) {
            this.renderTooltip(this.hoveredBuilding);
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = this.gridLineWidth;

        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        console.log('Mriežka vykreslená s veľkosťou bunky:', this.gridSize);
    }

    renderTooltip(building) {
        const padding = 10;
        const lineHeight = 20;
        const tooltipWidth = 200;

        // Vytvorenie textu tooltipu
        const lines = [
            building.name,
            building.description,
            '',
            'Zdravie: ' + building.health + '%',
            'Veľkosť: ' + (building.size / 64) + 'x' + (building.size / 64)
        ];

        // Pridanie informácií o produkcii
        if (building.production) {
            lines.push('');
            lines.push('Produkcia:');
            for (const [resource, amount] of Object.entries(building.production)) {
                if (resource === 'military') {
                    lines.push('- Vojenské jednotky');
                } else {
                    lines.push(`- ${amount} ${resource}`);
                }
            }

            // Pridanie informácie o produkčnom cykle
            if (building.productionCycle === 0) {
                lines.push('Produkcia: Trvalá');
            } else {
                const minutes = building.productionCycle / 60;
                if (minutes === 1) {
                    lines.push('Produkcia: Každú minútu');
                } else {
                    lines.push(`Produkcia: Každých ${minutes} minút`);
                }
            }
        }

        // Výpočet výšky tooltipu
        const tooltipHeight = lines.length * lineHeight + padding * 2;

        // Pozícia tooltipu
        let tooltipX = this.mouseX + 15;
        let tooltipY = this.mouseY + 15;

        // Kontrola, či sa tooltip neprekrýva s okrajom obrazovky
        if (tooltipX + tooltipWidth > this.canvas.width) {
            tooltipX = this.mouseX - tooltipWidth - 15;
        }
        if (tooltipY + tooltipHeight > this.canvas.height) {
            tooltipY = this.mouseY - tooltipHeight - 15;
        }

        // Vykreslenie pozadia tooltipu
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

        // Vykreslenie textu
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        lines.forEach((line, index) => {
            this.ctx.fillText(line, tooltipX + padding, tooltipY + padding + (index + 1) * lineHeight);
        });
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    centerCameraOn(building) {
        console.log('Centrujem kameru na budovu:', building.type);
        this.camera.x = building.x - (this.canvas.width - building.size) / 2;
        this.camera.y = building.y - (this.canvas.height - building.size) / 2;
        console.log('Nová pozícia kamery:', this.camera.x, this.camera.y);
    }
}

// Spustenie hry
console.log('Spúšťam hru...');
const game = new Game();
console.log('Inštancia hry vytvorená:', game);