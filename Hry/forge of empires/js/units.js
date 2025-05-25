class Unit {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = 32;
        this.health = 100;
        this.speed = 2;
        this.target = null;
        this.path = [];
    }

    update() {
        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            } else {
                this.target = null;
            }
        }
    }

    render(ctx) {
        // Základné vykreslenie jednotky
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        // Vykreslenie zdravia
        const healthBarWidth = this.size;
        const healthBarHeight = 3;
        const healthPercentage = this.health / 100;

        ctx.fillStyle = '#c0392b';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2 - 5, healthBarWidth, healthBarHeight);

        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2 - 5, healthBarWidth * healthPercentage, healthBarHeight);
    }

    moveTo(x, y) {
        this.target = { x, y };
    }
}

class Worker extends Unit {
    constructor(x, y) {
        super(x, y, 'worker');
        this.size = 24;
        this.speed = 1.5;
        this.gatheringRate = 1;
        this.carryingResources = 0;
        this.maxCarry = 10;
    }

    render(ctx) {
        // Telo pracovníka
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        // Nástroj
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(this.x + this.size / 2, this.y - this.size / 4, this.size / 2, this.size / 4);

        // Vykreslenie zdravia
        const healthBarWidth = this.size;
        const healthBarHeight = 3;
        const healthPercentage = this.health / 100;

        ctx.fillStyle = '#c0392b';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2 - 5, healthBarWidth, healthBarHeight);

        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2 - 5, healthBarWidth * healthPercentage, healthBarHeight);

        // Vykreslenie nesených zdrojov
        if (this.carryingResources > 0) {
            ctx.fillStyle = '#e67e22';
            ctx.fillRect(
                this.x - this.size / 2,
                this.y + this.size / 2,
                (this.carryingResources / this.maxCarry) * this.size,
                3
            );
        }
    }

    gatherResource(resource) {
        // Tu bude logika pre zbieranie zdrojov
        if (this.carryingResources < this.maxCarry) {
            this.carryingResources += this.gatheringRate;
            return true;
        }
        return false;
    }

    depositResources() {
        const amount = this.carryingResources;
        this.carryingResources = 0;
        return amount;
    }
}