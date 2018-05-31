import  '../css/style.css';
import resources from 'E:/RSS/final-game/src/resources.js';
import Sprite from 'E:/RSS/final-game/src/sprite.js';
import modalDialog from 'E:/RSS/final-game/src/modalDialog.js'
let _ = require('lodash');

let nav = document.querySelector("nav");
let landingPage = document.querySelector(".wrapper");
let navElem = Array.from(document.querySelectorAll("nav li"));
let sections = Array.from(document.querySelectorAll("section"));
let startButton = document.getElementById("button-start");

let canvas;
let ctx;

let backFont;
let player;
let enemy;
let lastTime;
let playerHealth;
let enemyHealth;
let progress = "player";

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
        resources(['../images/knight.png', "../images/game-background.png", "../images/health-bar.png"]);
        resources.onReady(init);
    }
    else {
        alert("Please, insert your first name and second name");
    }
})

function init() {
    canvas = document.createElement("canvas")
    ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    player = new Sprite('../images/knight.png', [0,0], [150,180], [100,370], 5, [0,1,2,3,4,5,6,7,8,9], "horizontal", false);
    enemy = new Sprite('../images/knight.png', [0,180], [150,180], [500,370], 8, [0,1,2,3,4,5,6,7,8,9], "horizontal", false);
    playerHealth = new Sprite ('../images/health-bar.png', [0,41], [200,41], [20,40]);
    enemyHealth = new Sprite ('../images/health-bar.png', [0,41], [200,41], [580,40]);
    
    lastTime = Date.now();
    main();
}

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
   
    player.update(dt);
    enemy.update(dt);
    render();
    lastTime = now;
    requestAnimationFrame(main)
}

function render() {
    ctx.drawImage(resources.get('../images/game-background.png'), 0, 0 );
    ctx.drawImage(resources.get('../images/health-bar.png'), 0, 0, 200, 41, 20, 40, 200, 41);
    ctx.drawImage(resources.get('../images/health-bar.png'), 0, 0, 200, 41, 580, 40, 200, 41);
    enemy.render(ctx);
    player.render(ctx);
    enemyHealth.render(ctx);
    playerHealth.render(ctx);
}

