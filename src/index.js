const _ = require('lodash');

const nav = document.querySelector("nav");
const landingPage = document.querySelector(".wrapper");
const navElem = Array.from(document.querySelectorAll("nav li"));
const sections = Array.from(document.querySelectorAll("section"));
const startButton = document.getElementById("button-start");
const modalDialog = document.querySelector(".modalDialog");
const spellBar = document.querySelector(".modalDialog-spellBar");
const task = document.querySelector(".modalDialog-task");
const userInput = document.getElementById("userInput");
const accept =document.getElementById("accept");

let result;
let spell;
let answer;

/* ------ EVENT -------- */

nav.addEventListener("click", (e) => {
    if (e.target.tagName == 'LI') {
        sections.forEach((item) => {
            item.style.display="none";
        })
       let index = navElem.indexOf(e.target);
       sections[index].style.display="block"; 
    }
})

startButton.addEventListener("click", () => {
    let userData = Array.from(document.userData.name);
    if (userData.every((input)=> input.value)) {
        landingPage.style.display="none";
        resources([hero,enemy, gameBackground, healthBar, fireballPic]);
        resources.onReady(() => {
            let game = new Game(userData);
            game.init();
        });
    }
    else {
        alert("Please, insert your first name and second name");
    }
})

spellBar.addEventListener("click", (e) => {
    if (e.target.tagName == 'LI') {
        spellBar.classList.toggle("hidden");
        task.classList.toggle("hidden");
        let ul = e.target.parentNode;
        let ulChilds = Array.from(ul.children);
        spell = ulChilds.indexOf(e.target)+'';
        switch(spell) {
            case '0':  
                result = arithmetic();
                console.log(result);
                break;
            case '1':  
                result = translate();
                console.log(result);
                break;
            case '2':  
                result = dragNDrop();
                console.log(result);
                break;
        }
    }
})

accept.addEventListener("click", () => {
    answer = userInput.value;
    modalDialog.classList.toggle('hidden');
})

/* ------FLOW-------- */

const hero        = require('../images/knight.png');
const enemy = require('../images/enemy.png')
const gameBackground = require('../images/game-background.png');
const healthBar = require('../images/health-bar.png');
const fireballPic = require('../images/fireball.png');


import  '../css/style.css';
import resources from './resources.js';
import Sprite from './sprite.js';
import arithmetic from './tasks/arithmetic.js';
import translate from './tasks/translate.js';
import dragNDrop from './tasks/dragNDrop.js';



class Game {
    constructor(userData) {
        this.userName = userData.reduce((a,b)=> a.value+' '+ b.value);
        this.enemyName = Game.genericEnemyName();
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.instances = [];
        this.lastTime = null;
        this.turn = "player";
        this.spell = null;
    }
    static genericEnemyName() {
        let adjective = ['Сопливый','Мерзкий','Вонючий','Злобный','Ужасный','Гадкий','Вредный','Опасный'];
        let noun = ['Огр','Волк','Тролль','Людоед','Хоббит','Гном','Гоблин','Орк'];
        let name = ['Том','Макс','Ник','Кайл','Фил','Гарольд','Шон','Дэн','Бим','Гарри'];
        let enemyName = _.sample(adjective) + ' ' + _.sample(noun) + ' ' + _.sample(name);
        return enemyName
    }
    
    init() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        document.body.appendChild(this.canvas);

        this.ctx.fillStyle = "rgb(49, 93, 134)";
        this.ctx.font = "30px 'VanishingBoy'";
       
        this.player = new Sprite(hero, [0,0], [150,180], [100,370], 10, [0,1,2,3,4,5,6,7,8,9], "horizontal", false, false, ['idle','secondIdle','attack','hurt','die']);
        this.enemy = new Sprite(enemy, [0,0], [390,335], [390,200], 7, [0,1,2,3,4,5], "horizontal", false, false, ['idle','hurt','attack']);
        this.playerHealth = new Sprite (healthBar, [0,41], [200,41], [20,40]);
        this.enemyHealth = new Sprite (healthBar, [0,41], [200,41], [580,40]);

        this.instances.push(this.player, this.enemy, this.playerHealth, this.enemyHealth);
        this.lastTime = Date.now();

        this.main();
    }

    main() {
        this.now = Date.now();
        let dt = (this.now - this.lastTime) / 1000.0;

        this.update(dt);
        this.render();
        this.lastTime = this.now;
        if (this.turn === "player") {
            this.playerTurn();
        }
        else if (this.turn === "enemy") {
            this.enemyTurn();
        }
        this.checkCollision();
        requestAnimationFrame(this.main.bind(this));
    }

    update(dt) {
        this.instances.forEach((item) => item.update(dt));
            if (this.spell) {
                this.spell.update(dt);
        }
    }

    render() {

        this.ctx.drawImage(resources.get(gameBackground), 0, 0 );
        this.ctx.fillText(this.userName, 40, 40);
        this.ctx.fillText(this.enemyName, 600 ,40)
        this.ctx.drawImage(resources.get(healthBar), 0, 0, 200, 41, 20, 40, 200, 41);
        this.ctx.drawImage(resources.get(healthBar), 0, 0, 200, 41, 580, 40, 200, 41);
        this.instances.forEach((item)=> item.render(this.ctx));
        if (this.spell) {
             this.spell.render(this.ctx);
        } 
    }

    checkCollision() {
        if (this.spell && this.spell.posCanvas[0] + this.spell.size[0] > this.enemy.posCanvas[0] + this.enemy.size[0] / 2) {
            this.spell = null;
            this.enemyHealth.size[0] -= 30; 
            this.enemy.hurt();
            this.turn = "enemy";
        }
    }

    playerTurn() {
        let promise = new Promise((resolve, reject) => {
            this.turn = null;
            modalDialog.classList.toggle("hidden");
            let interval = setInterval(() => {
                    if (spell) {
                        resolve();
                        clearInterval(interval);
                    }
                }, 0)
            })
            .then(()=> {
                return new Promise((resolve,reject) => {
                    let interval =  setInterval(() => {
                        if (answer) {
                            resolve();
                            clearInterval(interval);
                        }
                    },0);
                })
            })
            .then(()=> {
                if (answer == result) {
                    this.player.attack();
                    this.spell = new Sprite(fireballPic, [0,0], [128,49], [this.player.posCanvas[0], this.player.posCanvas[1]+this.player.size[1]/2], 8, [0,1,2,3,4,5], "horisontal", false, true)
                }
                else {
                    console.log("you are wrong");
                    this.turn = "enemy";
                }
                spellBar.classList.toggle("hidden");

                task.classList.toggle("hidden");
                spell = null;
                answer =null;
                userInput.value = '';
               
            })
            .catch((e)=> {console.log(e)})    
        }

    enemyTurn() {
        let promise = new Promise((resolve, reject) => {
            this.turn = null;
            setTimeout(()=>{
                this.enemy.attack();
                resolve();
            }, 2000)
        })
        promise.then(()=> {
            setTimeout(()=>{
                this.turn="player";
            }, 1500)
        })
    }
}
