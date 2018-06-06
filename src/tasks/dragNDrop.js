export default function dragNDrop () {
    const task = document.getElementById("task");
    task.innerText = '';
    let result = _.chain(vocabulary).values().sample().value();
    let shuffleResult = _.chain(result).split('').shuffle().value();

    let list = document.createElement("ul");
    list.classList.add('droppable');
    for (let i=0; i<shuffleResult.length; i++) {
        let li = document.createElement('li');
        li.classList.add('draggable');
        li.innerText = shuffleResult[i];
        list.appendChild(li);
    }
    task.appendChild(list);

    let dragObj = {};
    
    list.addEventListener("mousedown", (e) => {
        let target = e.target.closest('.draggable') 
        if(!target) return;
        dragObj.elem = target;
        dragObj.startX = e.pageX;
        dragObj.startY = e.pageY;
    });
    list.addEventListener("mousemove", (e) => {
        if (!dragObj.elem) return;
        dragObj.elem.style.position= "absolute";
        dragObj.elem.style.zIndex = "9999";    
        dragObj.elem.style.left = e.pageX +'px';
        dragObj.elem.style.top = e.pageY + 'px';
        
    })
    list.addEventListener("mouseup", (e)=> {
        dragObj={};
    })
    return result;
};



import {vocabulary} from "./vocabulary.js";