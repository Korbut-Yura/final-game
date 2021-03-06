const _ = require('lodash');
const hero = require('../images/player.png');
const gameBackground = require('../images/game-background.png');
const healthBar = require('../images/health-bar.png');
const fireball = require('../images/fireball.png');
const boulder = require('../images/boulder.png');
const heads = require('../images/enemy_parts/head.png');
const bodys = require('../images/enemy_parts/body.png');
const leftLegs = require('../images/enemy_parts/leftLegs.png');
const rightLegs = require('../images/enemy_parts/rightLegs.png');
const leftArms = require('../images/enemy_parts/leftArms.png');
const rightArms = require('../images/enemy_parts/rightArms.png');
const fireballSound = require('../audio/player_spell.wav');
const boulderSound = require('../audio/bowling_roll.ogg');
const winSound = require('../audio/win_sound.wav');
const gameOverSound = require('../audio/gameover.ogg');

const gameWrapper = document.querySelector(".gameWrapper");
const nav = document.querySelector("nav");
const landingPage = document.querySelector(".wrapper");
const navElem = Array.from(document.querySelectorAll("nav li"));
const sections = Array.from(document.querySelectorAll("section"));
const startButton = Array.from(document.querySelectorAll(".button-start"));
const modalDialog = document.querySelector(".modalDialog");
const spellBar = document.querySelector(".modalDialog-spellBar");
const taskDialog = document.querySelector(".modalDialog-task");
const userInput = document.getElementById("userInput");
const accept = document.getElementById("accept");
const highscoreTable = document.querySelector(".highscoreTable");
const audio = document.getElementById('audio');

let result;
let spell;
let answer;
let game;

/* ------ EVENT -------- */

nav.addEventListener("click", (e) => {
    if (e.target.tagName == 'LI') {
        sections.forEach((item) => {
            item.style.display="none";
        })
        navElem.forEach(i => {
            i.classList.remove('active');
        })
       e.target.classList.add('active'); 
       let index = navElem.indexOf(e.target);
       sections[index].style.display="block"; 
    }
})

startButton.forEach( i => {
    i.addEventListener("click", () => {
        let userData = Array.from(document.userData.name);
        if (userData.every((input)=> input.value)) {
            landingPage.classList.add('hidden');
            highscoreTable.classList.add('hidden');
            if (game) {
                game.status = false; 
            }
            gameWrapper.classList.remove('hidden');
            game = new Game(userData)
            game.init();
        }
        else {
            alert("Please, insert your first name and second name");
        }
    })
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
                result = +arithmetic();
                break;
            case '1':  
                result = translate();
                break;
            case '2':  
                result = dragNDrop();
                break;
            case '3':
                audio.pause();
                result = listening();
                break;
            case '4':
                result = +sequence();
                break;
            case '5':
                result = +memory();
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
        answer = userInput.value.toLowerCase() ||' ';
    }
    audio.play()
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
        this.player={
            name: userData.reduce((a,b)=> a.value+' '+ b.value),
            sprite: new Sprite(hero, [0,0], [200,220], [60,350], 10, [0,1,2,3,4,5,6,7,8,9], "horisontal", false, false, ['idle','attack','hurt','die']),
            health: new Sprite (healthBar, [0,41], [200,41], [20,40])
        };
        this.enemy={
            name: Game.genericEnemyName(),
            sprite: new enemySprite([650,375], 7, leftLegs, rightLegs, leftArms, bodys, rightArms, heads),
            health: new Sprite (healthBar, [0,41], [200,41], [580,40])
        };
        this.canvas = document.querySelector(".canvas");
        this.ctx = this.canvas.getContext("2d");
        this.instances = [];
        this.lastTime = null;
        this.turn = "player";
        this.cast = null;
        this.gameOver = false;
        this.score = 0;
        this.status = true;  //for exit from requestAnimationFrame
    }

    static genericEnemyName() {
        let adjective = ['Сопливый','Мерзкий','Вонючий','Злобный','Ужасный','Гадкий','Вредный','Опасный'];
        let noun = ['Огр','Волк','Тролль','Людоед','Хоббит','Гном','Гоблин','Орк'];
        let name = ['Том','Макс','Ник','Кайл','Фил','Гарольд','Шон','Дэн','Бим','Гарри'];
        return _.sample(adjective) + ' ' + _.sample(noun) + ' ' + _.sample(name);
    }

    init() {
        resources.onReady(() => {
            this.canvas.width = 800;
            this.canvas.height = 600;
            audio.play();
            this.ctx.fillStyle = "rgb(49, 93, 134)";
            this.ctx.font = "30px 'VanishingBoy'";
            this.instances = [this.player.sprite, this.enemy.sprite, this.player.health, this.enemy.health];
            this.lastTime = Date.now();
            this.main();
        });
        resources([hero, gameBackground, healthBar, fireball, boulder, leftLegs, rightLegs, leftArms, rightArms, heads, bodys, fireballSound, boulderSound,winSound,gameOverSound]);
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
            if (this.player.cast || this.enemy.cast) {
                this.checkCollision();
            }
            if (this.status) {
                requestAnimationFrame(this.main.bind(this));
            }
        }
        else {
            this.showHighscore();
        }
    }

    update(dt) {
        this.instances.forEach((item) => item.update(dt));
    }

    render() { 
        this.ctx.drawImage(resources.get(gameBackground), 0, 0 );
        this.ctx.textAlign = "center";
        this.ctx.fillText('Your score:' + this.score, 400, 40);
        this.ctx.textAlign = "start";
        this.ctx.fillText(this.player.name, 40, 40);
        this.ctx.textAlign = "end";
        this.ctx.fillText(this.enemy.name, 760 ,40)
        this.ctx.drawImage(resources.get(healthBar), 0, 0, 200, 41, 20, 40, 200, 41);
        this.ctx.drawImage(resources.get(healthBar), 0, 0, 200, 41, 580, 40, 200, 41);
        this.instances.forEach((item)=> item.render(this.ctx));
    }

    checkCollision() {
        let cast = this.player.cast||this.enemy.cast;
        let target = this.player.cast ? this.enemy : this.player;
        if (cast.posCanvas[0] < this.player.sprite.posCanvas[0]+ this.player.sprite.size[0]/2 || cast.posCanvas[0] > this.enemy.sprite.posCanvas[0]-cast.size[0]){
            let castIndex = this.instances.indexOf(cast);
            this.instances.splice(castIndex,1);
            this.player.cast = null;
            this.enemy.cast = null;
            target.health.size[0] -= 105; 
            if (this.player.health.size[0] <= 0) {
                audio.pause();
                resources.get(gameOverSound).play();
                this.player.sprite.action('die');
                setTimeout(()=>{
                    this.gameOver = true;
                },1000);
                return
            } 
            else if (this.enemy.health.size[0] <= 0) {
                    resources.get(winSound).play();
                    let enemyIndex = this.instances.indexOf(this.enemy.sprite);
                    this.enemy.sprite = new enemySprite([650,375], 7, leftLegs, rightLegs, leftArms, bodys, rightArms, heads); 
                    this.instances[enemyIndex]=this.enemy.sprite;
                    this.enemy.name = Game.genericEnemyName();
                    this.score++;
                    this.enemy.health.size[0] = 200;
            }  
            else {
                target.sprite.action('hurt');
            }
            
        this.turn ="player";
        }
    }

    playerTurn() {
       new Promise((resolve) => {
            this.turn = null;
            modalDialog.classList.remove("hidden");
            let interval = setInterval(() => {
                if (spell) {
                    clearInterval(interval);
                    resolve();
                }
                if (!this.status) {
                    clearInterval(interval);
                }
            }, 0)
            })
            .then(()=> {
                return new Promise((resolve) => {
                    let interval = setInterval(() => {
                        if (answer) {
                            clearInterval(interval)
                            resolve();
                        }
                        if (!this.status) {
                            clearInterval(interval);
                        }
                    },0);
                })
            })
            .then(()=> {
                if (answer == result || _.includes(result,answer)) {
                    this.player.sprite.action("attack", spell);
                    this.player.cast = new Sprite(fireball, [0, (spell%3)*49], [128,49], [this.player.sprite.posCanvas[0]+this.player.sprite.size[0]/2, this.player.sprite.posCanvas[1]+this.player.sprite.size[1]/2], 8, [0,1,2,3,4,5], "horisontal", false, 'right')
                    this.instances.push(this.player.cast);
                    let audio = resources.get(fireballSound)
                    audio.play()
                }
                else {
                    this.turn = "enemy";
                }
                spellBar.classList.toggle("hidden");
                taskDialog.classList.toggle("hidden");
                spell = null;
                answer = null;
                userInput.value = '';
            })
            .catch((e)=> {console.log(e)})    
        }

    enemyTurn() {
        this.turn = null;            
        this.enemy.sprite.action("attack");
        this.enemy.cast = new Sprite(boulder, [0,0], [130,130], [this.enemy.sprite.posCanvas[0] - 130, 410], 10 ,[0,1,2,3,4,5], 'horisontal' ,false, 'left');
        this.instances.push(this.enemy.cast);
        resources.get(boulderSound).play();
    }

    showHighscore() {
        let highscore = JSON.parse(window.localStorage.getItem('highscore')) || [ ];
        const list = document.querySelector('.highscoreTable ol');
        highscore.push({'user': this.player.name, 'score': this.score});
        highscore = _.sortBy(highscore, (a)=> -a.score);
        if (highscore.length > 10) {
            highscore.length = 10;
        }
        highscoreTable.classList.remove('hidden');
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (let i=0 ; i < highscore.length; i++) {
            let li = document.createElement('li');
            li.innerHTML = `<span>${highscore[i].user}</span> <span class='score'>${highscore[i].score}</span>`;
            list.appendChild(li);
        }
        localStorage.setItem('highscore', JSON.stringify(highscore)); 
    }
}

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