class Inventory {
    constructor() {
        this.towers = {
            basic: 0,
            fast: 0,
            strong: 0
        };
    }

    addTower(type) {
        if (this.towers[type] !== undefined) {
            this.towers[type]++;
        } else {
            console.error('Tipo de torre inválido');
        }
    }

    removeTower(type) {
        if (this.towers[type] !== undefined && this.towers[type] > 0) {
            this.towers[type]--;
        } else {
            console.error('Tipo de torre inválido ou sem torres deste tipo');
        }
    }

    getTowerCount(type) {
        return this.towers[type] !== undefined ? this.towers[type] : 0;
    }
}

const inventory = new Inventory();

export { inventory };