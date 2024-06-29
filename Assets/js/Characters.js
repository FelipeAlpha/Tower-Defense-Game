import { inventory } from 'Assets/js/inventory.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let towers = [];
let enemies = [];
let projectiles = [];
let resources = 100;

const towerImage = new Image();
towerImage.src = 'Assets/Imgs';

const enemyImage = new Image();
enemyImage.src = 'Assets/Imgs';

const shootSound = new Audio('Assets/Audios')
const hitSound = new Audio('Assets/Audios')

class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.shootingCooldown = 1000;
        this.lastShot = 0;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot >= this.shootingCooldown) {
            projectiles.push(new Projectile(this.x + this.width / 2, this.y, 5, 5, 'red'))
            this.lastShot = now;
        }
    }
}

class FastTower extends Tower {
    constructor(x, y) {
        super(x, y);
        this.shootingCooldown = 500;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class StrongTower extends Tower {
    constructor(x, y) {
        super(x, y);
        this.shootingCooldown = 2000;
    }

    draw() {
        ctx.fillStyle = 'purple';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = speed;
        this.health = 100;
    }

    update() {
        this.x += this.speed;
        if (this.x > canvas.width) {
            this.x = 0;
            resources -= 10;
        }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class FastEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 2);
    }

    draw() {
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class StrongEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 1);
        this.health = 200;
    }

    draw() {
        ctx.fillStyle = 'darkred'
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Projectile {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 5;
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    towers.forEach(tower => {
        tower.draw();
        tower.shoot();
    });

    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        enemy.draw();
    });

    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update();
        projectile.draw();

        enemies.forEach((enemy, enemyIndex) => {
            if (checkCollision(projectile, enemy)) {}
            enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1);
            resources += 10;
            hitSound.play();
        })

    });

    if (projectile.x > canvas.width) {
        projectiles.splice(projectileIndex, 1);
    }
};

const levels = [
    {
        towers: [
            { type: 'FastTower', x: 100, y: 100 },
            { type: 'StrongTower', x: 200, y: 150 },
        ],
        enemies: [
            { type: 'FastEnemy', x: 0, y: 200 },
            { type: 'StrongEnemy', x: 0, y: 250 },
        ]
    }
]

let currentlevel = 0;

function loadLevel(levelIndex) {
    towers = [];
    enemies = [];
    projectiles = [];

    levels[levelIndex].towers.forEach(t => {
        if (t.type === 'FastTower') towers.push(new FastTower(t.x, t.y));
        else if (t.type === 'StrongTower') towers.push(new StrongTower(t.x, t.y));
    });

    levels[levelIndex].enemies.forEach(e => {
        if (e.type === 'FastEnemy') enemies.push(new FastEnemy(e.x, e.y));
        else if (e.type === 'StrongEnemy') enemies.push(new StrongEnemy(e.x, e.y));
    });

    gameLoop();
}

loadLevel(currentlevel);