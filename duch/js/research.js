class ResearchManager {
    constructor() {
        this.technologies = {
            'stone_age': {
                'hunting': {
                    name: 'Lovectvo',
                    description: 'Odomyka lovecké budovy a zvyšuje produkciu potravín',
                    cost: { gold: 50, supplies: 100 },
                    researched: false,
                    requirements: []
                },
                'farming': {
                    name: 'Farming',
                    description: 'Odomyka farmárske budovy a zvyšuje produkciu potravín',
                    cost: { gold: 100, supplies: 150 },
                    researched: false,
                    requirements: ['hunting']
                },
                'housing': {
                    name: 'Bydlenie',
                    description: 'Zvyšuje maximálnu populáciu o 10',
                    cost: { gold: 150, supplies: 200 },
                    researched: false,
                    requirements: ['farming']
                },
                'pottery': {
                    name: 'Hrnčiarstvo',
                    description: 'Odomyka hrnčiarske dielne a zvyšuje produkciu zásob',
                    cost: { gold: 200, supplies: 250 },
                    researched: false,
                    requirements: ['housing']
                },
                'mining': {
                    name: 'Ťažba',
                    description: 'Odomyka ťažobné budovy a zvyšuje produkciu zlata',
                    cost: { gold: 250, supplies: 300 },
                    researched: false,
                    requirements: ['pottery']
                }
            },
            'bronze_age': {
                'bronze_working': {
                    name: 'Spracovanie bronzu',
                    description: 'Odomyka kováčske budovy a zvyšuje produkciu zásob',
                    cost: { gold: 500, supplies: 600 },
                    researched: false,
                    requirements: ['stone_age.mining']
                },
                'masonry': {
                    name: 'Murárstvo',
                    description: 'Odomyka kamenné budovy a zvyšuje obranu',
                    cost: { gold: 600, supplies: 700 },
                    researched: false,
                    requirements: ['bronze_working']
                },
                'writing': {
                    name: 'Písmo',
                    description: 'Odomyka knižnice a zvyšuje produkciu výskumu',
                    cost: { gold: 700, supplies: 800 },
                    researched: false,
                    requirements: ['masonry']
                },
                'wheel': {
                    name: 'Koleso',
                    description: 'Zvyšuje rýchlosť jednotiek a produkciu zásob',
                    cost: { gold: 800, supplies: 900 },
                    researched: false,
                    requirements: ['writing']
                },
                'mathematics': {
                    name: 'Matematika',
                    description: 'Zvyšuje presnosť útokov a produkciu zlata',
                    cost: { gold: 900, supplies: 1000 },
                    researched: false,
                    requirements: ['wheel']
                }
            }
        };

        this.currentAge = 'stone_age';
        this.researchProgress = 0;
        this.currentResearch = null;
    }

    canResearch(techId) {
        const tech = this.getTechnology(techId);
        if (!tech || tech.researched) return false;

        // Kontrola požiadaviek
        for (const req of tech.requirements) {
            if (req.includes('.')) {
                // Požiadavka obsahuje vek a technológiu
                const [age, tech] = req.split('.');
                if (!this.technologies[age] || !this.technologies[age][tech] || !this.technologies[age][tech].researched) {
                    return false;
                }
            } else {
                // Požiadavka je len technológia v aktuálnom veku
                if (!this.technologies[this.currentAge] || !this.technologies[this.currentAge][req] || !this.technologies[this.currentAge][req].researched) {
                    return false;
                }
            }
        }

        return true;
    }

    startResearch(techId) {
        if (!this.canResearch(techId)) return false;

        this.currentResearch = techId;
        this.researchProgress = 0;
        return true;
    }

    updateResearch(amount) {
        if (!this.currentResearch) return;

        const tech = this.getTechnology(this.currentResearch);
        this.researchProgress += amount;

        if (this.researchProgress >= 100) {
            this.completeResearch(this.currentResearch);
            this.currentResearch = null;
            this.researchProgress = 0;
        }
    }

    completeResearch(techId) {
        const tech = this.getTechnology(techId);
        if (tech) {
            tech.researched = true;
            this.updateResearchTree();
        }
    }

    getTechnology(techId) {
        const [age, tech] = techId.split('.');
        return this.technologies[age] && this.technologies[age][tech];
    }

    updateResearchTree() {
            const treeElement = document.getElementById('research-tree');
            treeElement.innerHTML = '';

            // Vykreslenie technológií pre aktuálnu dobu
            const currentAgeTechs = this.technologies[this.currentAge];
            for (const [techId, tech] of Object.entries(currentAgeTechs)) {
                const techElement = document.createElement('div');
                techElement.className = 'technology';
                if (tech.researched) techElement.classList.add('researched');
                if (this.currentResearch === `${this.currentAge}.${techId}`) {
                    techElement.classList.add('researching');
                }

                techElement.innerHTML = `
                <h4>${tech.name}</h4>
                <p>${tech.description}</p>
                <div class="cost">Zlato: ${tech.cost.gold}</div>
                ${this.currentResearch === `${this.currentAge}.${techId}` ? 
                    `<div class="progress-bar">
                        <div class="progress" style="width: ${this.researchProgress}%"></div>
                    </div>` : ''}
            `;

            if (!tech.researched && this.canResearch(`${this.currentAge}.${techId}`)) {
                techElement.addEventListener('click', () => this.startResearch(`${this.currentAge}.${techId}`));
            }

            treeElement.appendChild(techElement);
        }
    }

    isResearched(techId) {
        const tech = this.getTechnology(techId);
        return tech && tech.researched;
    }
}