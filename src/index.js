let _ = require('lodash');

let nav = document.querySelector("nav");
let landingPage = document.querySelector(".wrapper");
let navElem = Array.from(document.querySelectorAll("nav li"));
let sections = Array.from(document.querySelectorAll("section"));
let startButton = document.getElementById("button-start");
let modalDialog = document.querySelector(".modalDialog");
let spellBar = document.querySelector(".modalDialog-spellBar");
let task = document.querySelector(".modalDialog-task");
const userInput = document.getElementById("userInput");
const accept =document.getElementById("accept");

let canvas;
let ctx;

let player;
let enemy;
let fireball;
let lastTime;
let playerHealth;
let enemyHealth;
let turn = "player";
let result;
let spell;
let answer;
let instances = [];

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
        
        window.localStorage.setItem('1', JSON.stringify(userData));  // rewrite
        landingPage.style.display="none";
        resources(['../images/knight.png', "../images/game-background.png", "../images/health-bar.png", "../images/fireball.png"]);
        resources.onReady(init);
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

function init() {
    canvas = document.createElement("canvas")
    ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    player = new Sprite('../images/knight.png', [0,0], [150,180], [100,370], 10, [0,1,2,3,4,5,6,7,8,9], "horizontal", false, false);
    enemy = new Sprite('../images/knight.png', [0,0], [150,180], [550,370], 8, [0,1,2,3,4,5,6,7,8,9], "horizontal", false, false);
    playerHealth = new Sprite ('../images/health-bar.png', [0,41], [200,41], [20,40]);
    enemyHealth = new Sprite ('../images/health-bar.png', [0,41], [200,41], [580,40]);
    instances.push(player,enemy, playerHealth, enemyHealth);
    lastTime = Date.now();
    main();
}

function main() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    update(dt);
    
    render();
    lastTime = now;
    if (turn == "player") {
        question();
    }
    else if (turn == "enemy") {
      
    }
    checkCollision();
    requestAnimationFrame(main);
}

function render() {
    ctx.drawImage(resources.get('../images/game-background.png'), 0, 0 );
    ctx.drawImage(resources.get('../images/health-bar.png'), 0, 0, 200, 41, 20, 40, 200, 41);
    ctx.drawImage(resources.get('../images/health-bar.png'), 0, 0, 200, 41, 580, 40, 200, 41);
    instances.forEach((item)=> item.render(ctx));
    if (fireball) {
         fireball.render(ctx);
    } 
}

function update(dt) {
    instances.forEach((item) => item.update(dt));
    if (fireball) {
        fireball.update(dt);
    }
}

function checkCollision() {
    if (fireball && fireball.posCanvas[0] + fireball.size[0] > enemy.posCanvas[0] + enemy.size[0] / 2) {
        fireball = null;
        enemyHealth.size[0] -= 30; 
        enemy.hit();
        if (enemyHealth.size[0] <= 0) {
            win();
        }
    }
}

function question() {
let promise = new Promise(function(resolve, reject) {
    turn = null;
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
            answer=null;
            player.attack();
            fireball = new Sprite("../images/fireball.png", [0,0], [128,49], [player.posCanvas[0], player.posCanvas[1]+player.size[1]/2], 8, [0,1,2,3,4,5], "horisontal", false, true)
        }
        else {
            console.log("you are wrong")
            enemy.attack;
        }
        turn = "player";
    })
    .catch((e)=> { console.log(e)})    
}


import  '../css/style.css';
import resources from './resources.js';
import Sprite from './sprite.js';
import arithmetic from './tasks/arithmetic.js';
import translate from './tasks/translate.js';
import dragNDrop from './tasks/dragNDrop.js';