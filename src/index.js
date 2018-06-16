const _ = require('lodash');
const hero = require('../images/knight.png');
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

const gameWrapper = document.querySelector(".gameWrapper");
const nav = document.querySelector("nav");
const landingPage = document.querySelector(".wrapper");
const navElem = Array.from(document.querySelectorAll("nav li"));
const sections = Array.from(document.querySelectorAll("section"));
const startButton = document.getElementById("button-start");
const modalDialog = document.querySelector(".modalDialog");
const spellBar = document.querySelector(".modalDialog-spellBar");
const taskDialog = document.querySelector(".modalDialog-task");
const userInput = document.getElementById("userInput");
const accept = document.getElementById("accept");
const highscoreTable = document.querySelector(".highscoreTable");
const audio = document.getElementById('audio');
let newAudio;

let result;
let spell;
let answer;

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

startButton.addEventListener("click", () => {
    let userData = Array.from(document.userData.name);
    if (userData.every((input)=> input.value)) {
        landingPage.classList.toggle('hidden');
        gameWrapper.classList.toggle('hidden');
        resources([hero, gameBackground, healthBar, fireball, boulder, leftLegs, rightLegs, leftArms, rightArms, heads, bodys]);
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
                audio.pause();
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
            sprite: new Sprite(hero, [0,0], [200,220], [60,350], 10, [0,1,2,3,4,5,6,7,8,9], "horisontal", false, false, ['idle','secondIdle','attack','hurt','die']),
            health: new Sprite (healthBar, [0,41], [200,41], [20,40])
        };
        this.enemy={
            name: Game.genericEnemyName(),
            sprite: new enemySprite([650,375], 7, leftLegs, rightLegs, leftArms, bodys, rightArms, heads),
            health: new Sprite (healthBar, [0,41], [200,41], [580,40])
        };
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
        return _.sample(adjective) + ' ' + _.sample(noun) + ' ' + _.sample(name);
    }

    init() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        gameWrapper.appendChild(this.canvas);
        audio.play();
        this.ctx.fillStyle = "rgb(49, 93, 134)";
        this.ctx.font = "30px 'VanishingBoy'";
        this.instances.push(this.player.sprite, this.enemy.sprite, this.player.health, this.enemy.health);
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
            if (this.player.cast || this.enemy.cast) {
                this.checkCollision();
            }
            requestAnimationFrame(this.main.bind(this));
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
            newAudio.pause();
            let castIndex = this.instances.indexOf(cast);
            this.instances.splice(castIndex,1);
            this.player.cast = null;
            this.enemy.cast = null;
            target.sprite.action('hurt');
            target.health.size[0] -= 105; 
            if (this.enemy.health.size[0] <= 0) {
                newAudio = new Audio(winSound);
                newAudio.play(); 
                let enemyIndex = this.instances.indexOf(this.enemy.sprite);
                this.enemy.sprite = new enemySprite([650,375], 7, leftLegs, rightLegs, leftArms, bodys, rightArms, heads); 
                this.instances[enemyIndex]=this.enemy.sprite;
                this.enemy.name = Game.genericEnemyName();
                this.score++;
                this.enemy.health.size[0] = 200;
            }  
            if (this.player.health.size[0] <= 0) {
                this.player.sprite.action('die');
                setTimeout(()=>{
                    this.gameOver = true;
                },1500)
            }
        this.turn ="player";
        }
    }

    playerTurn() {
        let promise = new Promise((resolve, reject) => {
            this.turn = null;
            modalDialog.classList.toggle("hidden");
            let interval = setInterval(() => {
                    if (spell) {
                        resolve();
                    }
                }, 0)
            })
            .then(()=> {
                return new Promise((resolve,reject) => {
                    let interval =  setInterval(() => {
                        if (answer) {
                            resolve();
                        }
                    },0);
                })
            })
            .then(()=> {
                if (answer == result || answer.indexOf(result) != -1) {
                    this.player.sprite.action("attack", spell);
                    this.player.cast = new Sprite(fireball, [0, (spell%3)*49], [128,49], [this.player.sprite.posCanvas[0]+this.player.sprite.size[0]/2, this.player.sprite.posCanvas[1]+this.player.sprite.size[1]/2], 8, [0,1,2,3,4,5], "horisontal", false, 'right')
                    this.instances.push(this.player.cast);
                    newAudio = new Audio(fireballSound);
                    newAudio.play();
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
        newAudio = new Audio(boulderSound);
        newAudio.play();
    }

    showHighscore() {
        let highscore = JSON.parse(window.localStorage.getItem('highscore')) || [ ];
        highscore.push({'user': this.player.name, 'score': this.score});
        highscore = _.sortBy(highscore, (a)=> -a.score);
        if (highscore.length > 10) {
            highscore.length = 10;
        }
        highscoreTable.classList.toggle('hidden');
        let list = document.createElement('ol');
        for (let i=0 ; i < highscore.length; i++) {
            let li = document.createElement('li');
            li.innerText =`${highscore[i].user} ${highscore[i].score}`;
            list.appendChild(li);
        }
        highscoreTable.insertBefore(list,document.querySelector('.highscoreTable button'));
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