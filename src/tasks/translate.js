import {vocabulary} from "./vocabulary.js";

export default function translate() {
    userInput.classList.remove("hidden");
    const task = document.getElementById("task");
    const taskExplanation = document.getElementById('task-explanation');
    const repeat = document.querySelector(".fa-redo-alt");
    task.classList.remove('hidden');
    repeat.classList.add('hidden');
    taskExplanation.innerText ='Переведите на русский язык.'
    let keys = Object.keys(vocabulary);
    let randomKey = keys[_.random(0, keys.length-1)];
    let answer = vocabulary[randomKey];
    task.innerText = `${randomKey}`;
    return answer;
}

