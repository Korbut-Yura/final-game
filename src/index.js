const _ = require('lodash');
const hero = require('../images/knight.png');
const gameBackground = require('../images/game-background.png');
const healthBar = require('../images/health-bar.png');
const fireballPic = require('../images/fireball.png');
const heads = require('../images/enemy_parts/head.png');
const bodys = require('../images/enemy_parts/body.png');
const leftLegs = require('../images/enemy_parts/leftLegs.png');
const rightLegs = require('../images/enemy_parts/rightLegs.png');
const leftArms = require('../images/enemy_parts/leftArms.png');
const rightArms = require('../images/enemy_parts/rightArms.png');

import  '../css/style.css';
import resources from './resources.js';
import Sprite from './sprite.js';
import arithmetic from './tasks/arithmetic.js';
import translate from './tasks/translate.js';
import dragNDrop from './tasks/dragNDrop.js';
import listening from './tasks/listening.js';
import sequence from './tasks/sequence.js';
import memory from './tasks/memory.js';
import enemySprite from './enemySprite.js'; 

const gameWrapper = document.querySelector(".gameWrapper");
const nav = document.querySelector("nav");
const landingPage = document.querySelector(".wrapper");
const navElem = Array.from(document.querySelectorAll("nav li"));
const sections = Array.from(document.querySelectorAll("section"));
const startButton = document.getElementById("button-start");
const modalDialog = document.querySelector(".modalDialog");
const spellBar = document.querySelector(".modalDialog-spellBar");
const taskDialog = document.querySelector(".modalDialog-task");
const task = document.getElementById("task");
const userInput = document.getElementById("userInput");
const accept = document.getElementById("accept");
const taskExplanation = document.getElementById('task-explanation');
const highscoreTable = document.querySelector(".highscoreTable");
const audio = document.getElementById('audio');

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
        landingPage.classList.toggle('hidden');
        gameWrapper.classList.toggle('hidden');
        resources([hero, gameBackground, healthBar, fireballPic, leftLegs, rightLegs, leftArms, rightArms, heads, bodys]);
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
        taskDialog.classList.toggle("hidden");
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
            case '3':
                result = listening();
                console.log(result);
                break;
            case '4':
                result = sequence();
                console.log(result);
                break;
            case '5':
                result = memory();
                console.log(result);
                break;
        }
    }
})

accept.addEventListener("click", () => {
    if (spell == '2') {
        let arr = Array.from( document.getElementById('sortable').children);
        answer = arr.map((i)=> i.innerText).join('');
    }
    else {
        answer = userInput.value ||' ';
    }
    modalDialog.classList.toggle('hidden');
  })

document.body.addEventListener('keyup',(e) => {
    let canvas = document.getElementsByTagName('canvas')[0];
    if (e.keyCode == 27 && canvas) {
            landingPage.classList.toggle('hidden');
            gameWrapper.classList.toggle('hidden');    
    }
})
/* ------FLOW-------- */
class Game {
    constructor(userData) {
        this.userName = userData.reduce((a,b)=> a.value+' '+ b.value);
        this.enemyName = Game.genericEnemyName();
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.instances = [];
        this.lastTime = null;
        this.turn = "player";
        this.cast = null;
        this.gameOver = false;
        this.score = 0;
    }
    static genericEnemyName() {
        let adjective = ['Сопливый','Мерзкий','Вонючий','Злобный','Ужасный','Гадкий','Вредный','Опасный'];
        let noun = ['Огр','Волк','Тролль','Людоед','Хоббит','Гном','Гоблин','Орк'];
        let name = ['Том','Макс','Ник','Кайл','Фил','Гарольд','Шон','Дэн','Бим','Гарри'];
        let enemyName = _.sample(adjective) + ' ' + _.sample(noun) + ' ' + _.sample(name);
        return enemyName
    }
    static GenericParametrs(url,simpleSize, wrapPoint) {
        this.url = url;
        this.simpleSize = simpleSize;
        this.wrapPoint = wrapPoint;
    }
    init() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        gameWrapper.appendChild(this.canvas);
        audio.play();
        this.ctx.fillStyle = "rgb(49, 93, 134)";
        this.ctx.font = "30px 'VanishingBoy'";
        this.player = new Sprite(hero, [0,0], [200,220], [60,350], 10, [0,1,2,3,4,5,6,7,8,9], "horizontal", false, false, ['idle','secondIdle','attack','hurt','die']);
        this.playerHealth = new Sprite (healthBar, [0,41], [200,41], [20,40]);
        this.enemyHealth = new Sprite (healthBar, [0,41], [200,41], [580,40]);
        
        let leftLegsParam = new GenericParametrs(leftLegs,[41,62], [21,0]);
        let rightLegsParam = new GenericParametrs(rightLegs, [44,64],[22,0]);
        let leftArmsParam = new GenericParametrs(leftArms, [166,133], [140,20]);
        let rightArmsParam = new GenericParametrs(rightArms, [77,140], [25,30]);
        let bodyParam = new GenericParametrs(bodys, [134,150], [67,100]);
        let headParam = new GenericParametrs(heads, [150,137], [90,100]);

        this.enemy = new enemySprite([650,375], 7, leftLegsParam, rightLegsParam, leftArmsParam, bodyParam, rightArmsParam, headParam ); 
        this.instances.push(this.player, this.enemy, this.playerHealth, this.enemyHealth);
        this.lastTime = Date.now();
        this.main();
    }

    main() {
        if (!this.gameOver) {
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
            if (this.gameOver) {
                this.highscore();
            }
            this.checkCollision();
            requestAnimationFrame(this.main.bind(this));
        }
        else {
            this.showHighscore();
        }
    }

    update(dt) {
        this.instances.forEach((item) => item.update(dt));
            if (this.cast) {
                this.cast.update(dt);
        }
    }

    render() {
        this.ctx.drawImage(resources.get(gameBackground), 0, 0 );
        this.ctx.textAlign = "start";
        this.ctx.fillText(this.userName, 40, 40);
        this.ctx.textAlign = "end";
        this.ctx.fillText(this.enemyName, 760 ,40)
        this.ctx.drawImage(resources.get(healthBar), 0, 0, 200, 41, 20, 40, 200, 41);
        this.ctx.drawImage(resources.get(healthBar), 0, 0, 200, 41, 580, 40, 200, 41);
        this.instances.forEach((item)=> item.render(this.ctx));
        if (this.cast) {
            this.cast.render(this.ctx);
        }
       
    }

    checkCollision() {
        if (this.cast && this.cast.posCanvas[0] + this.cast.size[0] > this.enemy.posCanvas[0]) {
            this.cast = null;
            this.enemy.action('hurt');
            this.enemyHealth.size[0] -= 105; 
            if (this.enemyHealth.size[0] < 0) {
                let enemyIndex = this.instances.indexOf(this.enemy);
                 let leftLegsParam = new GenericParametrs(leftLegs,[41,62], [21,0]);
                let rightLegsParam = new GenericParametrs(rightLegs, [44,64],[22,0]);
                let leftArmsParam = new GenericParametrs(leftArms, [166,133], [140,20]);
                let rightArmsParam = new GenericParametrs(rightArms, [77,140], [25,30]);
                let bodyParam = new GenericParametrs(bodys, [134,150], [67,100]);
                let headParam = new GenericParametrs(heads, [150,137], [90,100]);
                this.enemy = new enemySprite([650,375], 7, leftLegsParam, rightLegsParam, leftArmsParam, bodyParam, rightArmsParam, headParam ); 
                this.instances[enemyIndex]=this.enemy;
                this.enemyName = Game.genericEnemyName();
                this.score++;
                this.enemyHealth.size[0] = 200;
            }   
            this.turn="player";
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
                if (answer == result || answer.indexOf(result) != -1) {
                    this.player.action("attack",spell);
                    this.cast = new Sprite(fireballPic, [0, (spell%3)*49], [128,49], [this.player.posCanvas[0], this.player.posCanvas[1]+this.player.size[1]/2], 8, [0,1,2,3,4,5], "horisontal", false, true)
                    let newAudio = new Audio('../audio/player_spell.wav');
                    newAudio.play();
                }
                else {
                    this.turn = "enemy";
                    console.log("you are wrong");
                }
                spellBar.classList.toggle("hidden");
                taskDialog.classList.toggle("hidden");

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
                this.enemy.action("attack");
                resolve();
            }, 2000)
        })
        promise.then(()=> {
            return new Promise((resolve,reject) => {
                setTimeout(()=>{
                    this.playerHealth.size[0] -= 100; 
                    if (this.playerHealth.size[0] <= 0) {
                        this.player.action('die');
                        resolve();
                    } 
                    else {
                        this.player.action('hurt');
                        this.turn = "player";
                    }
                }, 1500)
            })
        })
        .then(() => {
            setTimeout(() => {
                this.gameOver = true;
            }, 1000)
        })
    }
    showHighscore() {
        let highscore = JSON.parse(window.localStorage.getItem('highscore')) || [ ];
        highscore.push({'user': this.userName, 'score': this.score});
        highscore = _.sortBy(highscore, (a)=> -a.score);
        if (highscore.length > 10) {
            highscore.length = 10;
        }
        highscoreTable.classList.toggle('hidden');
        let list = document.createElement('ul');
        for (let i=0 ; i < highscore.length; i++) {
            let li = document.createElement('li');
            li.innerText =`${highscore[i].user} ${highscore[i].score}`;
            list.appendChild(li);
        }
        highscoreTable.appendChild(list);
            localStorage.setItem('highscore', JSON.stringify(highscore)); 
    }
}


class GenericParametrs{
    constructor(url,simpleSize, wrapPoint) {
        this.url = url;
        this.simpleSize = simpleSize;
        this.wrapPoint = wrapPoint;
        this.pos = _.random(0,2);
    }
}