export default function dragNDrop () {
    const task = document.getElementById("task");
    const taskExplanation = document.getElementById('task-explanation');
    const repeat = document.querySelector(".fa-redo-alt");
    task.classList.remove('hidden');
    repeat.classList.add('hidden');
    taskExplanation.innerText ='Составьте слово из данных букв.'
    task.innerText = '';
    userInput.classList.add("hidden");
    let result = _.chain(vocabulary).values().sample().value();
    let shuffleResult = _.chain(result).split('').shuffle().value();

    let list = document.createElement("ul");
    list.id = "sortable";
    for (let i=0; i<shuffleResult.length; i++) {
        let li = document.createElement('li');
        li.classList.add('draggable');
        li.innerText = shuffleResult[i];
        list.appendChild(li);
    }
    task.appendChild(list);

    $( function() {
        $( "#sortable" ).sortable();
        $( "#sortable" ).disableSelection();
    } );
    let dragObj = {};
    return result[0];
};

import {vocabulary} from "./vocabulary.js";