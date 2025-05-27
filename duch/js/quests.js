class QuestManager {
    constructor() {
        this.quests = {
            'stone_age': [{
                    id: 'build_hut',
                    title: 'Prvá chata',
                    description: 'Postav svoju prvú chatu',
                    requirements: {
                        buildings: { 'hut': 1 }
                    },
                    rewards: {
                        gold: 100,
                        supplies: 50
                    },
                    completed: false
                },
                {
                    id: 'research_hunting',
                    title: 'Začiatok lovu',
                    description: 'Výskum lovectva',
                    requirements: {
                        research: ['stone_age.hunting']
                    },
                    rewards: {
                        gold: 150,
                        supplies: 75
                    },
                    completed: false
                }
            ],
            'bronze_age': [{
                id: 'build_mine',
                title: 'Prvá baňa',
                description: 'Postav svoju prvú baňu',
                requirements: {
                    buildings: { 'mine': 1 }
                },
                rewards: {
                    gold: 200,
                    supplies: 100
                },
                completed: false
            }]
        };

        this.currentAge = 'stone_age';
        this.activeQuests = [];
        this.completedQuests = [];
    }

    initializeQuests() {
        this.activeQuests = this.quests[this.currentAge].filter(quest => !quest.completed);
        this.updateQuestList();
    }

    checkQuestProgress(buildings, research) {
        for (const quest of this.activeQuests) {
            if (this.isQuestCompleted(quest, buildings, research)) {
                this.completeQuest(quest);
            }
        }
    }

    isQuestCompleted(quest, buildings, research) {
        // Kontrola budov
        if (quest.requirements.buildings) {
            for (const [buildingType, count] of Object.entries(quest.requirements.buildings)) {
                const buildingCount = buildings.filter(b => b.type === buildingType).length;
                if (buildingCount < count) return false;
            }
        }

        // Kontrola výskumu
        if (quest.requirements.research) {
            for (const techId of quest.requirements.research) {
                if (!research.isResearched(techId)) return false;
            }
        }

        return true;
    }

    completeQuest(quest) {
        quest.completed = true;
        this.completedQuests.push(quest);
        this.activeQuests = this.activeQuests.filter(q => q.id !== quest.id);

        // Pridanie odmeny
        if (quest.rewards) {
            for (const [resource, amount] of Object.entries(quest.rewards)) {
                // Tu by sa malo volať ResourceManager.addResource
                console.log(`Pridané ${amount} ${resource}`);
            }
        }

        this.updateQuestList();
    }

    updateQuestList() {
            const questListElement = document.getElementById('quest-list');
            questListElement.innerHTML = '';

            for (const quest of this.activeQuests) {
                const questElement = document.createElement('div');
                questElement.className = 'quest';
                questElement.innerHTML = `
                <h4>${quest.title}</h4>
                <p>${quest.description}</p>
                <div class="rewards">
                    ${Object.entries(quest.rewards).map(([resource, amount]) => 
                        `<span>${resource}: ${amount}</span>`
                    ).join(' ')}
                </div>
            `;
            questListElement.appendChild(questElement);
        }
    }
}